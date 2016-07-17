/*
The engine class, shared by the client and the server
*/
function Engine(io, gameConstants) {
	this.io = io;
	this.game = {};
	this.options = gameConstants;
	this.automationList = [];

	colorList.push(["hsl(180, 0%, 51%)", "hsl(180, 0%, 67%)"],
						generateColor(220), generateColor(100));
}

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

Engine.prototype.possibleTrip = function (fromId, toId, number) {

	if (this.game[toId] === undefined || this.game.fromId === undefined || this.game[fromId].count > number) {

		return false;
	}

	if (this.game[toId].type === "satellite") {
		return distance(this.game[fromId], this.game[toId]) <= this.options.range;
	} else if (this.game[toId].type === "star") {
		for (var i in this.game) {
			if (this.game[i].type === "link" && this.game[i].from === fromId && this.game[i].to === toId) {

				return true;
			}
		}

		return false;
	}
};

Engine.prototype.fullSync = function () {
	this.game = io.getGameData();
};

Engine.prototype.getSatellite = function (playerId, satelliteId, callback) {
	if (typeof callback !== "function") {
		callback = function(){};
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

Engine.prototype.move = function (playerId, fromId, toId, number, callback) {
	if (typeof callback !== "function") {
		callback = function(){};
	}

	if (possibleTrip(fromId, toId, number)) {
		that = this;
		this.io.move(playerId, fromId, toId, number, this.options.shipsPerSatellite, function (res) {
			if (res) {
				that.game[res.id] = {
					type: "ship",
					id: playerId,
					from: fromId,
					to: toId,
					count: number,
					initRadius: computeStarRadius(this.game[fromId].count),
					timestamp: res.ts
				};
				callback(true);
			} else {
				callback(false);
			}
		});
	}
};

Engine.prototype.addStar = function (x, y, count, playerId, callback) {
	if (typeof callback !== "function") {
		callback = function(){};
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
			callback(true);
		} else {
			callback(false);
		}
	});
};

Engine.prototype.addSatellite = function (x, y, count, callback) {
	if (typeof callback !== "function") {
		callback = function(){};
	}

	if (count < 0) {
		callback(false);

		return;
	}

	that = this
	this.io.addSatellite(x, y, count, function (res) {
		if (res) {
			that.game[res.id] = {
				type: "satellite",
				x: x,
				y: y,
				count: count
			};
			callback(true);
		} else {
			callback(false);
		}
	});
};

Engine.prototype.addLink = function (from, to, callback) {
	if (typeof callback !== "function") {
		callback = function(){};
	}

	if (this.game[from] === undefined || this.game[to] === undefined || this.game[from].type !== "star" || this.game[to].type !== "star") {
		callback(false);

		return;
	}

	that = this
	this.io.addLink(from, to, function (res) {
		if (res) {
			that.game[res.id] = {
				type: "link",
				from: from,
				to: to
			};
			callback(true);
		} else {
			callback(false);
		}
	});
};

Engine.prototype.addPlayer = function (name, color, callback) {
	if (typeof callback !== "function") {
		callback = function(){};
	}

	that = this
	this.io.addPlayer(name, color, function (res) {
		if (res) {
			that.game[res.id] = {
				type: "player",
				name: name,
				color: color
			};
			callback(true);
		} else {
			callback(false);
		}
	});
};

Engine.prototype.serverTimestamp = function () {
	// TODO
	return svTimestamp;
}
