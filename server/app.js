var	sio = require("socket.io"),
	http = require("http"),
	fs = require("fs"),
	uuid = require("uuid"),
	Entities = require("html-entities").AllHtmlEntities,
	eencode = new Entities();

var server = http.createServer(function (request, response) {
	var	filename = "index.html",
		encoding = "identity",
		acceptEncoding = request.headers["accept-encoding"],
		raw;

	if (!acceptEncoding) {
		acceptEncoding = "";
	}

	raw = fs.createReadStream(__dirname + "/../dist/" + filename);

	if (acceptEncoding.match(/\bgzip\b/)) {
		encoding =  "gzip";
		raw = fs.createReadStream(__dirname + "/../dist/" + filename + ".gz");
	} else if (acceptEncoding.match(/\bdeflate\b/)) {
		encoding = "deflate";
		raw = fs.createReadStream(__dirname + "/../dist/" + filename + ".zip");
	}

	if (request.url === "/") {
		response.writeHead(200, {
			"Content-Type": "text/html; charset=utf-8",
			"Cache-Control": "max-age=" + 86400000 * 7,
			"content-encoding": encoding
		});
		raw.pipe(response);

	} else {
		response.writeHead(404);
		response.end();
	}
});

server.listen(parseInt(process.env.PORT || 1337, 10), function () {
	console.log("Server running");
});

/* ---------------------------- Listening sockets ---------------------------- */

var io = sio.listen(server);


io.on("connection", function (socket) {
	socket.on("message", function () {});
	socket.on("disconnect", function () {});
});

