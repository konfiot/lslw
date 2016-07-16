/*
The engine class, shared by the client and the server
*/
function Engine(io, callback, gameConstants) {
	this.io = io;
	this.update = callback;
	this.game = {
		players: {},
		stars: {},
		links: {},
		ships: {}
	};
	this.options = gameConstants;
}

// TODO
function getNearestStar(playerId, satelliteId) {
}

// TODO
function possibleTrip(fromId, toId, number) {
}

Engine.prototype.fullSync = function () {
	this.game = io.getGameData();
	this.update(this.game);
};

Engine.prototype.getSatellite = function (playerId, satelliteId, callback) {
	if (stars[satelliteId].t !== "s") {
		callback(false);
	}

	nearest = getNearestStar(playerId, satelliteId);

	if (nearest.dist <= this.oprions.dist) {
		this.move(playerId, nearest.id, satelliteId, this.options.shipsPerSatellite, function (res) {
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
		this.io.move(playerId, nearest.id, satelliteId, this.options.shipsPerSatellite, function (res) {
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
