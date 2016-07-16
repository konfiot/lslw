function downHandler(e) {
	mouse.downHandler(e);
}

function upHandler(e) {
	mouse.upHandler(e);
}

function wheelHandler(e) {
	mouse.wheelHandler(e);
}

function moveHandler(e) {
	mouse.moveHandler(e);
}

/* Not necessary yet
function keyDownHandler(e) {
	if (e.keyCode == 39) {
		rightPressed = true;
	} else if (e.keyCode == 37) {
		leftPressed = true;
	}
}

function keyUpHandler(e) {
	if (e.keyCode == 39) {
		rightPressed = false;
	} else if (e.keyCode == 37) {
		leftPressed = false;
	}
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
*/
