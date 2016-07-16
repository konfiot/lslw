net = new Network(3);
d = new Dot(100,100,3);
space = new SpaceBackground(100);
player = new Player(1);
mouse = new Mouse();
//worldMousePosition();

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
	if (!time) time = timestamp;
	var dt = (timestamp - time) / 1000; // Seconds
	time = timestamp;
	
	var s = Math.min(player.scale, 1.0);
	ctx.clearRect(0, 0, canvas.width / s, canvas.height / s);
	ctx.save();
	ctx.translate(canvas.width/2,canvas.height/2);
	ctx.scale(player.scale, player.scale);
	
	space.draw();
	player.update();
	player.draw();
	d.draw();
	d.isMouseOver();
	net.update(dt);
	d.update(dt);
	net.draw();
	
	ctx.restore();

	T += 1;
	requestAnimationFrame(draw);
}

draw();
