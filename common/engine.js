/*
The engine class, shared by the client and the server
*/
function Engine(io, callback, game_constants) {
	this.io = io;
	this.update = callback;
	this.game = {
		players = {},
		stars = {},
		ships = {}
	}
	this.options = game_constants;
}


Engine.prototype.full_sync = function () {
	this.game = io.get_game_data();
	this.update(this.game);
}

Engine.prototype.get_satellite(player_id, satellite_id, callback) {
	nearest = get_nearest_star(player_id, satellite_id);

	if (stars[satellite_id].t !== "s") {
		callback(false);
	}

	if (nearest.dist <= oprions.dist) {
		io.move(player_id, nearest.id, satellite_id, function (res){
			if (res) {
				this.game.ships[res.id] = res.data;
				callback(true);
				this.update(this.game);
			} else {
				callback(false);
			}
		});
	}
}

