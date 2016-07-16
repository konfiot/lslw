/*
The engine class, shared by the client and the server
*/
function Engine(io, callback, gameConstants) {
	this.io = io;
	this.update = callback;
	this.game = {
		players: {},
		stars: {},
		satellites: {},
		links: {},
		ships: {},
		
		nStars: 0,
		nLinks: 0,
	};
	this.options = gameConstants;
}

// Returns the id of the closest star from a given satellite. -1 if out of reach
function getNearestStar(playerId, satelliteId) {
	var x = engine.game.satellites[satelliteId].x;
	var y = engine.game.satellites[satelliteId].y;

	closestStar = -1;
	closestDist = Math.pow(engine.options.dist + 1, 2);

	for (var i = 0; i < engine.game.stars.length; i++) {
		// Only look at player's stars
		if (engine.game.stars[i].id == playerId) {
			r2 = Math.pow(x - engine.game.stars[i].x, 2) +
					Math.pow(y - engine.game.stars[i].y, 2);

			if (r2 < closestDist && r2 < engine.options.dist) {
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
	if (satelliteId >= this.game.satellites.length) {
		callback(false);
	}

	nearest = getNearestStar(playerId, satelliteId);

	if (nearest >= 0) {
		this.move(playerId, nearest, satelliteId, this.options.shipsPerSatellite, function (res) {
			if (res) {
				this.game.ships[res.id] = res.data;
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

Engine.prototype.move = function (playerId, fromId, toId, number, callback) {
	if (possibleTrip(fromId, toId, number)) {
		this.io.move(playerId, nearest, satelliteId, this.options.shipsPerSatellite, function (res) {
			if (res) {
				this.game.ships[res.id] = res.data;
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
