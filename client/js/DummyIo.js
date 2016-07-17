function makeid()
{
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 20; i++) {
	            text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
}

function DummyIo() {

}

DummyIo.prototype.move = function (playerId, fromId, toId, number, callback) {
	callback({id: makeid(), ts: Date.now()});
};

DummyIo.prototype.addStar = function (x, y, count, playerId, callback) {
	callback({id: makeid()});
};

DummyIo.prototype.addSatellite = function (x, y, count, callback) {
	callback({id: makeid()});
};

DummyIo.prototype.addLink = function (from, to, callback) {
	callback({id: makeid()});
};

DummyIo.prototype.addPlayer = function (name, color, callback) {
	callback({id: makeid()});
};
