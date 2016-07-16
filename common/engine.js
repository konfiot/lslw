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
	closestDist = Math.pow(this.options.dist + 1, 2);

	for (var i in this.game) {
		// Only look at player's stars
		if (this.game[i].id == playerId && this.game[i].type == "s")  {
			r2 = Math.pow(x - this.game.stars[i].x, 2) +
					Math.pow(y - this.game[i].y, 2);

			if (r2 < closestDist && r2 < this.options.dist) {
				closestDist = r2;
				closestStar = i;
			}
		}
	}

	return closestStar;
};

// TODO
function possibleTrip(fromId, toId, number) {
}

Engine.prototype.fullSync = function () {
	this.game = io.getGameData();
};

Engine.prototype.getSatellite = function (playerId, satelliteId, callback) {
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
	if (possibleTrip(fromId, toId, number)) {
		this.io.move(playerId, nearest, satelliteId, this.options.shipsPerSatellite, function (res) {
			if (res) {
				this.game[res.id] = res.data;
			}
		});
	}
};

Engine.prototype.addStar = function (x, y, count, playerId, id) {
	if (this.game[id] !== undefined || count < 0) {
		return false;
	}

	var radius = 45 + Math.log(count + 1) * 5;

	this.game[id] = {
		type: "star",
		x: x,
		y: y,
		count: count,
		id: playerId,
		radius: radius
	};

	return true;
};

Engine.prototype.addSatellite = function (x, y, count, id) {
	if (this.game[id] !== undefined || count < 0) {
		return false;
	}

	var radius = 2 + 2 * count;

	this.game[id] = {
		type: "satellite",
		x: x,
		y: y,
		count: count,
		radius: radius
	};

	return true;
};
