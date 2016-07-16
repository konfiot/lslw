net = new Network(3);
d = new Dot(100, 100, 3);
space = new SpaceBackground(100);
playerstate = new PlayerState(1);
mouse = new Mouse();

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
	d.draw();
	d.isMouseOver();
	net.update(dt);
	d.update(dt);

	Display();

	T += 1;
	requestAnimationFrame(draw);
}

draw();
