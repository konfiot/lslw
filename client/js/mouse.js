/*
Handles the mouse
*/
function Mouse() {
	this.x = 0;
	this.y = 0;
	this.worldX = 0;
	this.worldY = 0;

	this.isMouseDown = false;
	this.oldMouseDown = false;
	this.lastClickedX = 0;
	this.lastClickedY = 0;
}

// When the mouse button is pressed
Mouse.prototype.downHandler = function (e) {
	if (!this.isMouseDown) {
		this.lastClickedX = this.x;
		this.lastClickedY = this.y;
	}
	this.isMouseDown = true;
	playerstate.update(clearCallback);
};

// When the mouse button is released
Mouse.prototype.upHandler = function (e) {
	this.isMouseDown = false;
	playerstate.update(clearCallback);
};

// When the mouse wheel is rotated
Mouse.prototype.wheelHandler = function (e) {
	var delta = 0;

	if (e.wheelDelta) { // IE/Opera.
		delta = -(e.wheelDelta / 120);
	} else if (e.detail) { // Mozilla
		delta = e.detail / 3;
	}

	// Set boundaries
	var newScale = playerstate.scale * (1 + delta * 0.05);

	if ((newScale <= 3 || delta < 0) && newScale > 0.2) {
		playerstate.scale = newScale;
	} else if (newScale > 3) {
		// Custom formula
		playerstate.scale = playerstate.scale + 0.15 * delta * Math.exp(-3 * 0.1) * Math.exp(-playerstate.scale * 0.1);
	}

	if (e.preventDefault) {
		e.preventDefault();
	}

	e.returnValue = false;

	worldMousePosition();
};

// When the mouse is moved.
// A threshold need to be crossed before the camera actually moves
Mouse.prototype.moveHandler = function (e) {
	var _mouseX = e.pageX - canvasMarginLeft;
	var _mouseY = e.pageY - canvasMarginTop;
	var dx = this.x - _mouseX;
	var dy = this.y - _mouseY;
	var deltaCenter = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

	if (this.isMouseDown && deltaCenter > 3) {
		playerstate.mouseDownMoved(dx, dy);
	}

	playerstate.update(clearCallback);

	this.x = _mouseX;
	this.y = _mouseY;

	worldMousePosition();
};
