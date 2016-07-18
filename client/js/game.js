// Initializing
var mouse = new Mouse();
var space = new SpaceBackground(150);
var engine = new Engine(new DummyIo(), gameConstants);

function callbackPlayer(playerId) {
	playerIdList.push(playerId);
}

// Add players
engine.addPlayer("Gaia", ["hsl(180, 0%, 51%)", "hsl(180, 0%, 67%)"], callbackPlayer);
engine.addPlayer("Player1", generateColor(220), callbackPlayer);
engine.addPlayer("Player2", generateColor(100), callbackPlayer);

var playerstate = new PlayerState(playerIdList[1]);

var nPoints = 20 * 20;
var density = 0.5;
var sparsity = 0.03;
delaunayMapGeneration(nPoints, density, sparsity);

// Connect events
document.addEventListener("mousedown", downHandler, false);
document.addEventListener("mouseup", upHandler, false);
document.addEventListener("DOMMouseScroll", wheelHandler, false);
document.addEventListener("mousewheel", wheelHandler, false);
document.addEventListener("mousemove", moveHandler, false);

time = null;
globalTimer = null;

function draw(timestamp) {
	globalTimer = timestamp;

	if (!time) {
		time = timestamp;
	}

	var dt = (timestamp - time) / 1000; // Seconds
	time = timestamp;

	playerstate.update();
	Display();

	requestAnimationFrame(draw);
}

draw();
