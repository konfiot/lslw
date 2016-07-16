// Transltates the content to the viewer position
function translate(x, y) {
	ctx.translate(-playerstate.centerX + x, -playerstate.centerY + y);
}

// Compute the position of the mouse in world coordinates
worldMousePosition = function () {
	mouse.worldX = playerstate.centerX + (mouse.x - canvas.width / 2) / playerstate.scale;
	mouse.worldY = playerstate.centerY + (mouse.y - canvas.height / 2) / playerstate.scale;
};

function generateColor(n) {
	var mainColor = "hsl(" + String(n) + ", 84%, 51%)";
	var edgeColor = "hsl(" + String(n) + ", 76%, 67%)";

	return [mainColor, edgeColor];
}

// Computes the anchor point, the angle and the length of a connexion
function computeBridge(star1, star2) {
	var dx = star2.x - star1.x;
	var dy = star2.y - star1.y;
	var L = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
	var x = dx * star1.radius / L + star1.x;
	var y = dy * star1.radius / L + star1.y;

	var theta = Math.acos(dx / L);

	if (dy < 0) {
		theta = -theta;
	}

	L -= star1.radius + star2.radius;

	return [x, y, theta, L];
}

// Goes from one star to a certain point in space
function computeLink(star1, x2, y2) {
	var dx = x2 - star1.x;
	var dy = y2 - star1.y;
	var L = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
	var x = dx * star1.radius / L + star1.x;
	var y = dy * star1.radius / L + star1.y;

	var theta = Math.acos(dx / L);

	if (dy < 0) {
		theta = -theta;
	}

	return [x, y, theta, L];
}

// Draw ships, works for different size : ships between stars or to get points
function drawShip(id, x, y, theta, val, factor, highlight) {
	ctx.save();

	var c = Math.cos(theta);
	var s = Math.sin(theta);

	translate(x, y);
	ctx.scale(factor, factor);
	ctx.fillStyle = colorList[id][0];

	if (highlight) {
		ctx.shadowColor = whiteSemiColor;
		ctx.shadowBlur = 12;
	}

	ctx.beginPath();
	ctx.moveTo(-15 * s, 15 * c);
	ctx.lineTo(35 * c, 35 * s);
	ctx.lineTo(15 * s, -15 * c);
	ctx.lineTo(-10 * c, -10 * s);
	ctx.fill();

	if (val !== 0) {
		ctx.font = "lighter 25px arial";
		ctx.fillStyle = whiteSemiColor;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(val, 30 * s, -30 * c);
	}

	ctx.restore();
}
