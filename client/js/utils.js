// Transltates the content to the viewer position
function translate(x, y, ctx) {
	ctx.translate(-playerstate.centerX + x, -playerstate.centerY + y);
}

function computeRadius(type, count) {

	if (type === "star") {
		return 45 + Math.log(count + 1) * 5;
	} else if (type === "satellite") {
		return 2 + 2 * count;
	}
}

function distance(a, b) {
	return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

// Compute the position of the mouse in world coordinates
worldMousePosition = function () {
	mouse.worldX = playerstate.centerX + (mouse.x - canvas.background.width / 2) / playerstate.scale;
	mouse.worldY = playerstate.centerY + (mouse.y - canvas.background.height / 2) / playerstate.scale;
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


