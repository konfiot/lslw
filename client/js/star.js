/*
Handles the star. It is defined with a position and a score, whose image
is the radius of the star. It can be selected or hovered. Special items
are drawn in those cases.
*/
function Star(id, x, y, points) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.points = points;

	this.radius = 45 + Math.log(this.points + 1) * 5;
	
	// State of the star
	this.hover = false;
	this.select = false;
}

// Update the score of the star
Star.prototype.setPoints = function(p) {
    this.points = p;
	this.radius = 45 + Math.log(this.points + 1) * 6;
};

// Draw the star on the screen
Star.prototype.draw = function() {
	ctx.save();
	translate(this.x, this.y);

	ctx.beginPath();
	ctx.arc(0, 0, this.radius, 0, Math.PI*2);
	ctx.fillStyle = colorList[this.id][0];
	ctx.strokeStyle = colorList[this.id][1];
	ctx.lineWidth = 6;
	ctx.shadowColor = colorList[this.id][1];
	
	// Blur if hovered
	if (!this.hover) {
		ctx.shadowBlur = 0;
	} else {
		ctx.shadowBlur = 12;
	}
	ctx.shadowBlur = 0;
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
	
	// Reflection effect
	ctx.shadowBlur = 0;
	ctx.beginPath();
	var r = this.radius - 9;
	ctx.fillStyle = whiteTransparentColor;
	ctx.arc(0, 0, r, Math.PI, 0);
	ctx.arc(0, -Math.sqrt(3) * r, 2 * r, Math.PI / 3.0, 2 * Math.PI / 3.0);
	ctx.fill();
	ctx.closePath();
	
	// Write the score
	var s = parseInt(this.radius);
	ctx.font = "lighter " + String(s) +"px arial";
	ctx.fillStyle = whiteSemiColor;
	ctx.textAlign="center";
	ctx.textBaseline = 'middle';
	ctx.fillText(this.points, 0, 5);

	ctx.restore();
};

// Determine if the mouse is over the star
Star.prototype.isMouseOver = function() {
	
	var r2 = 	Math.pow(mouse.worldX - this.x, 2) +
				Math.pow(mouse.worldY - this.y, 2);
				// mouse.y + centerY - canvas.height/2 - this.y / scale
	if (r2 < Math.pow(this.radius * 1.7, 2)) {
		this.hover = true;
	} else {
		this.hover = false;
	}
	return this.hover;
};
