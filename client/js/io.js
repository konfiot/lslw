function makeid () {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 5; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
}

function Io () {
	this.ws = new WebSocket("SERVER_URL");
	this.awaiting = {};
	this.upCb = function () {};
	this.delCb = function () {};

	ws.onmessage = function (e) {
		msg = JSON.parse(e.data);

		switch (msg.type) {
			case "u":
				this.awaiting[msg.id](msg.game);
				break;

			case "ship":
				this.awaiting[msg.id]({id: msg.id, ts: msg.ts});
				break;

			case "player":
				this.awaiting[msg.id]({id: msg.id});
				break;
			case "del":
				this.delCb(msg.id);
				break;
			case "up":
				this.upCb(msg.id, msg.data);
				break;
		}
	};
}

Io.prototype.move = function (playerId, fromId, toId, number, callback) {
	id = makeid();
	this.awaiting[id] = callback;
	this.ws.send(JSON.stringify({
		id: id,
		type: "ship",
		from: fromId,
		to: toId,
		number: number
	}));
};

Io.prototype.addStar = function (x, y, count, playerId, callback) {
	callback(false);
};

Io.prototype.addSatellite = function (x, y, count, callback) {
	callback(false);
};

Io.prototype.addLink = function (from, to, callback) {
	callback(false);
};

Io.prototype.addPlayer = function (name, color, callback) {
	id = makeid();
	awaiting[id] = callback;
	ws.send(JSON.stringify({
		id: id,
		type: "player",
		name: name,
		color: color
	}));
};

Io.prototype.getGameData = function (callback) {
	id = makeid();
	awaiting[id] = callback;
	ws.send(JSON.stringify({type: "up"}));
};


