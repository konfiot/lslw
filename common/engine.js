/*
The engine class, shared by the client and the server
*/
function Engine(io, callback, gameConstants) {
	this.io = io;
	this.update = callback;
	this.game = {};
	this.options = gameConstants;
}

// Returns the id of the closest star from a given satellite. -1 if out of reach
function getNearestStar(playerId, satelliteId) {
	var x = this.game[satelliteId].x;
	var y = this.game[satelliteId].y;

	closestStar = -1;
	closestDist = Math.pow(this.options.dist + 1, 2);

	for (var i in this.game) {
		// Only look at player's stars
		if (this.game[i].id == playerId && this.game[i].type = "s")  {
			r2 = Math.pow(x - this.game.stars[i].x, 2) +
					Math.pow(y - this.game[i].y, 2);

			if (r2 < closestDist && r2 < this.options.dist) {
				closestDist = r2;
				closestStar = i;
			}
		}
	}

	return closestStar;
}

// TODO
function possibleTrip(fromId, toId, number) {
}

Engine.prototype.fullSync = function () {
	this.game = io.getGameData();
	this.update(this.game);
};

Engine.prototype.getSatellite = function (playerId, satelliteId, callback) {
	if (this.game[satelliteId] === undefined || this.game[satelliteId].type !== "s") { // Check if given id exists and is assigned to a satellite
		callback(false);
	}

	nearest = getNearestStar(playerId, satelliteId);

	if (nearest >= 0) {
		this.move(playerId, nearest, satelliteId, this.options.shipsPerSatellite, callback)
	} else {
		callback(false);
	}
};

Engine.prototype.move = function (playerId, fromId, toId, number, callback) {
	if (possibleTrip(fromId, toId, number)) {
		this.io.move(playerId, nearest, satelliteId, this.options.shipsPerSatellite, function (res) {
			if (res) {
				this.game[res.id] = res.data;
				callback(true);
				this.update(this.game);
			} else {
				callback(false);
			}
		});
	} else {
		callback(false);
	}
};
