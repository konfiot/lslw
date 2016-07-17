function makeid()
{
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 20; i++) {
	            text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
}
var handler = {
	apply: function (target, thisArg, args) {
		return {
			id: makeid(),
			time: Date.now()
		};
	}
};

var DummyIo = new Proxy({}, handler);
