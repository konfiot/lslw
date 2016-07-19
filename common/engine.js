/*
The engine class, shared by the client and the server
*/
function Engine(io, gameConstants) {
	this.io = io;
	this.game = {};
	this.options = gameConstants;
	this.io.attachDelCallback(this.del);
	this.io.attachUpCallback(this.up);
}

Engine.prototype.del = function (id) {
	delete this.game[id];
};

Engine.prototype.up = function (id, data) {
	this.game[id] = data;
};

// Returns the time required for a ship to travel
Engine.prototype.tripDuration = function (id) {
	var ship = this.game[id];
	var dest = ship.to;

	var L = distance(this.game[ship.from], this.game[ship.to]);

	switch (this.game[dest].type) {
		case "star":
			
			return ((L - ship.initRadius - computeRadius("star", this.game[ship.to].count))
							/ this.options.shipSpeed * 1000);

		case "satellite":

			return ((Math.PI * L - ship.initRadius - computeRadius("star", this.game[ship.from].count))
							/ this.options.shipSpeed * 1000);
	}
};

Engine.prototype.midTripDuration = function (id) {
	var ship = this.game[id];
	var L = distance(this.game[ship.from], this.game[ship.to]);
	
	return ((Math.PI * L * 0.5 - ship.initRadius) / this.options.shipSpeed * 1000);
}

// Check if the trip takes more time than it should
Engine.prototype.finished = function (id) {
	return (this.serverTimestamp() - this.game[id].timestamp >= this.tripDuration(id));
};

// Check if the circular ship is at mid trip
Engine.prototype.midTrip = function (id) {
	var Dt = this.serverTimestamp() - this.game[id].timestamp;
	return (Dt >= this.midTripDuration(id) && this.game[id].count == 1);
};

// Updates the game
Engine.prototype.update = function () {
	time = this.serverTimestamp();

	for (var i in this.game) {
		// Loot ak ships
		if (this.game[i].type === "ship") {
			var ship = this.game[i];
			var dest = this.game[ship.to];

			// Check for midtrip toward satellites
			if (dest.type == "satellite" && this.midTrip(i)) {
				ship.count += dest.count;
				dest.visible = false;
			}

			// Check for end of ship trips
			if (this.finished(i)) {

				switch (dest.type) {
					case "star":

						if (ship.id === dest.id) {
							// The ship is for reinforcemnt
							dest.count += ship.count;
						} else {
							// The ship attacks
							newCount = dest.count - ship.count;

							if (newCount >= 0) {
								// Not enough to convert
								dest.count = newCount;
							} else {
								// The star is conquered
								dest.count = -newCount - 1;
								dest.id = ship.id;
							}
						}

						this.del(i);
						break;

					case "satellite":
						var fromStar = this.game[ship.from];

						if (ship.id === fromStar.id) {
							// The ship returns the satellite
							fromStar.count += ship.count;
						} else {
							// The ship attacks
							newCount = Math.floor(fromStar.count - ship.count * 0.5);

							if (newCount >= 0) {
								// Not enough to convert
								fromStar.count = newCount;
							} else {
								// The star is conquered
								fromStar.count = -newCount - 1;
								fromStar.id = ship.id;
							}
						}

						this.del(i);
						break;
				}
			}
		}
		
		// TODO automation list
	}
};

// Returns the id of the closest star from a given satellite. -1 if out of reach
Engine.prototype.getNearestStar = function (playerId, satelliteId, countTest) {
	var x = this.game[satelliteId].x;
	var y = this.game[satelliteId].y;

	var reachableStars = [];
	var range2 =  Math.pow(this.options.range + 1, 2);

	for (var i in this.game) {
		// Only look at player's stars
		if (this.game[i].type == "star" && this.game[i].id == playerId)  {
			r2 = Math.pow(x - this.game[i].x, 2) +
					Math.pow(y - this.game[i].y, 2);

			if (r2 < range2) {
				reachableStars.push([i, r2]);
			}
		}
	}

	if (countTest) {

		for (var k = reachableStars.length - 1; k >= 0; k--) {

			if (engine.game[reachableStars[k][0]].count === 0) {
				reachableStars.splice(k, 1);
			}
		}
	}

	if (reachableStars.length > 0) {
		reachableStars.sort(function (a, b) { return a[1] > b[1]; });

		return reachableStars[0][0];
	} else {

		return -1;
	}
};

// Return a boolean to tell wether or not a certain path is allowed to be taken
Engine.prototype.possibleTrip = function (fromId, toId) {
	if (this.game[toId] === undefined || this.game[fromId] === undefined) {

		return false;
	}

	if (this.game[toId].type === "satellite") {
		return distance(this.game[fromId], this.game[toId]) <= this.options.range;
	} else if (this.game[toId].type === "star") {

		for (var i in this.game) {

			// Test for both sides
			if (this.game[i].type === "link" &&
				((this.game[i].from === fromId && this.game[i].to === toId) ||
				(this.game[i].from === toId && this.game[i].to === fromId))) {

				return true;
			}
		}

		return false;
	}
};

// Synchronize the engine
Engine.prototype.fullSync = function () {
	that = this;
	io.getGameData(function (res) {
		that.game = res;
	});
};

// Send a ship to harvest a satellite
Engine.prototype.getSatellite = function (playerId, satelliteId, fromStarId, callback) {
	if (typeof callback !== "function") {
		callback = function () {};
	}

	// Check if given id exists and is assigned to a satellite
	if (this.game[satelliteId].type === "satellite") {
		var nearest = -1;

		// If no particular star is given, search for one available
		if (fromStarId === -1) {
			nearest = this.getNearestStar(playerId, satelliteId, true);
		} else {
			if (engine.game[fromStarId].count !== 0) {
				nearest = fromStarId;
			}
		}

		if (nearest !== -1) {
			this.move(playerId, nearest, satelliteId, 1, callback);
		} else {
			callback(false);
		}
	}
};

// Send a ship from one star to another
Engine.prototype.move = function (playerId, fromId, toId, count, callback) {
	if (typeof callback !== "function") {
		callback = function () {};
	}

	if (this.possibleTrip(fromId, toId)) {
		that = this;
		var radius = computeRadius("star", this.game[fromId].count);
		// TODO
		this.game[fromId].count -= count;
		this.io.move(playerId, fromId, toId, count, function (res) {
			if (res) {
				that.game[res.id] = {
					type: "ship",
					id: playerId,
					from: fromId,
					to: toId,
					count: count,
					initRadius: radius,
					timestamp: res.ts
				};
				callback(res.id);
				// setTimeout(that.update, this.ETA(i) - this.serverTimestamp() + 50);
			} else {
				callback(false);
			}
		});
	}
};

// Adds a star to the game
Engine.prototype.addStar = function (x, y, count, playerId, callback) {
	if (typeof callback !== "function") {
		callback = function () {};
	}

	if (count < 0) {
		callback(false);

		return;
	}

	that = this;
	this.io.addStar(x, y, count, playerId, function (res) {
		if (res) {
			that.game[res.id] = {
				type: "star",
				x: x,
				y: y,
				count: count,
				id: playerId
			};
			callback(res.id);
		} else {
			callback(false);
		}
	});
};

// Adds a satellite to the game
Engine.prototype.addSatellite = function (x, y, count, callback) {
	if (typeof callback !== "function") {
		callback = function () {};
	}

	if (count < 0) {
		callback(false);

		return;
	}

	that = this;
	this.io.addSatellite(x, y, count, function (res) {
		if (res) {
			that.game[res.id] = {
				type: "satellite",
				x: x,
				y: y,
				count: count,
				visible: true
			};
			callback(res.id);
		} else {
			callback(false);
		}
	});
};

// Adds a connexion between two stars
Engine.prototype.addLink = function (from, to, callback) {
	if (typeof callback !== "function") {
		callback = function () {};
	}

	if (this.game[from] === undefined || this.game[to] === undefined || this.game[from].type !== "star" || this.game[to].type !== "star") {
		callback(false);

		return;
	}

	that = this;
	this.io.addLink(from, to, function (res) {
		if (res) {
			that.game[res.id] = {
				type: "link",
				from: from,
				to: to
			};
			callback(res.id);
		} else {
			callback(false);
		}
	});
};

// Adds a player to the game
Engine.prototype.addPlayer = function (name, color, callback) {
	if (typeof callback !== "function") {
		callback = function () {};
	}

	that = this;
	this.io.addPlayer(name, color, function (res) {
		if (res) {
			that.game[res.id] = {
				type: "player",
				name: name,
				color: color,
				automation: []
			};
			callback(res.id);
		} else {
			callback(false);
		}
	});
};

// Returns the timestamp of the server
Engine.prototype.serverTimestamp = function () {
	// TODO
	svTimestamp = Date.now();

	return svTimestamp;
};
