/*
The engine class, shared by the client and the server
*/
function Engine(io, gameConstants) {
	this.io = io;
	this.game = {};
	this.options = gameConstants;
	this.io.attachDelCallback(this.del);
	this.io.arrachUpCallback(this.up);
}

Engine.prototype.del = function (id) {
	delete this.game[id];
};

Engine.prototype.up = function (id, data) {
	this.game[id] = data;
};

Engine.prototype.ETA = function (id) {
	// TODO
};

Engine.prototype.finished = function (id) {
	return (this.serverTimestamp() >= this.ETA(i));
};

// Updates the game
Engine.prototype.update = function () {
	time = this.serverTimestamp();

	for (var i in game) {
		if (this.game[i].type === "ship" && this.finished(i)) {
			dest = this.game[i].to;

			switch (dest.type) {
				case "star":
					if (this.game[i].id === this.game[dest].id) {
						this.game[dest].number += this.game[i].number;
					} else {
						this.game[dest].number = Math.abs(this.game[dest].number - this.game[i].number);

						if (this.game[i].number >= this.game[dest].number) {
							this.game[dest].id = this.game[i].id;
						}
					}
					delete this.game[i];
					break;

				case "satellite":
					this.game[i].ts = this.ETA(i);
					this.game[i].to = game[i].from;
					this.game[i].from = dest;
					this.game[i].number += game[dest].number;
					delete game[dest];
			}
		}
	}
};

// Returns the id of the closest star from a given satellite. -1 if out of reach
Engine.prototype.getNearestStar = function (playerId, satelliteId) {
	var x = this.game[satelliteId].x;
	var y = this.game[satelliteId].y;

	closestStar = -1;
	closestDist = Math.pow(this.options.range + 1, 2);

	for (var i in this.game) {
		// Only look at player's stars
		if (this.game[i].id == playerId && this.game[i].type == "s")  {
			r2 = Math.pow(x - this.game.stars[i].x, 2) +
					Math.pow(y - this.game[i].y, 2);

			if (r2 < closestDist && r2 < this.options.range) {
				closestDist = r2;
				closestStar = i;
			}
		}
	}

	return closestStar;
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
Engine.prototype.getSatellite = function (playerId, satelliteId, callback) {
	if (typeof callback !== "function") {
		callback = function () {};
	}

	// Check if given id exists and is assigned to a satellite
	if (this.game[satelliteId] !== undefined || this.game[satelliteId].type === "s") {
		nearest = getNearestStar(playerId, satelliteId);

		if (nearest >= 0) {
			this.move(playerId, nearest, satelliteId, this.options.shipsPerSatellite, callback);
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
		that = this; // ??
		var radius = computeRadius("star", this.game[fromId].count);

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
				setTimeout(that.update, this.ETA(i) - this.serverTimestamp() + 50);
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
				count: count
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
