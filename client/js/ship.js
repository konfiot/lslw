/*
The ship object
*/
function Ship(star1, star2, value, factor) {
	this.star1 = star1;
	this.star2 = star2;

	var dx = star2.x - star1.x;
	var dy = star2.y - star1.y;
	this.L = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
	this.progression = star1.radius / L;
	this.id = star1.id;

	this.theta = Math.acos(dx / L);

	if (dy < 0) {
		this.theta = -this.theta;
	}

	this.factor = factor;
	this.highlight = false;
}

// Draws the ship according to its progression
Ship.prototype.drawShip = function () {
	ctx.save();

	var c = Math.cos(this.theta);
	var s = Math.sin(this.theta);

	translate(this.star1.x + this.L * this.progression * Math.cos(this.theta),
				this.star1.y + this.L * this.progression * Math.sin(this.theta));
	ctx.scale(this.factor, this.factor);
	ctx.fillStyle = colorList[this.id][0];

	if (this.highlight) {
		ctx.shadowColor = whiteSemiColor;
		ctx.shadowBlur = 12;
	}

	ctx.beginPath();
	ctx.moveTo(-15 * s, 15 * c);
	ctx.lineTo(35 * c, 35 * s);
	ctx.lineTo(15 * s, -15 * c);
	ctx.lineTo(-10 * c, -10 * s);
	ctx.fill();

	if (this.value !== 0) {
		ctx.font = "lighter 25px arial";
		ctx.fillStyle = whiteSemiColor;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(value, 30 * s, -30 * c);
	}

	ctx.restore();
};
