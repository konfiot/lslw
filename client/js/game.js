mouse = new Mouse();
space = new SpaceBackground(100);
playerstate = new PlayerState(1);
engine = new Engine();

engine.addStar(0, 0, 10, 0, 1);

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

	//playerstate.update();
	Display();

	T += 1;
	requestAnimationFrame(draw);
}

draw();
