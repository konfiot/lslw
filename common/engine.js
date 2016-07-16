/*
The engine class, shared by the client and the server
*/
function Engine(io, callback, game_constants) {
	this.io = io;
	this.update = callback;
	this.game = {
		players = {},
		stars = {},
		links = {},
		ships = {}
	}
	this.options = game_constants;
}

function distance(a, b) {
	return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}


// TODO
function get_nearest_star(player_id, satellite_id) {
}

// TODO
function possible_trip(from_id, to_id, number) {
}

Engine.prototype.full_sync = function () {
	this.game = io.get_game_data();
	this.update(this.game);
};

Engine.prototype.get_satellite = function (player_id, satellite_id, callback) {
	if (stars[satellite_id].t !== "s") {
		callback(false);
	}

	nearest = get_nearest_star(player_id, satellite_id);

	if (nearest.dist <= this.oprions.dist) {
		this.move(player_id, nearest.id, satellite_id, this.options.ships_per_satellite, function (res){
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

Engine.prototype.move = function (player_id, from_id, to_id, number, callback) {
	if (possible_trip(from_id, to_id, number)) {
		this.io.move(player_id, nearest.id, satellite_id, this.options.ships_per_satellite, function (res){
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

