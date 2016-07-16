/*

*/
function Dot(x, y, points) {
	this.x = x;
	this.y = y;
	this.points = points;

	this.radius = 2 + 2 * this.points;
	this.hover = false;
	this.star = [];
	// s1, Ox, Oy, R, alpha, alpha0, gamma, id
	this.shipList = [];
}

Dot.prototype.update = function(dt) {
	for (var i = this.shipList.length-1; i >= 0; i--) {
		this.shipList[i][4] -= shipSpeed * dt / this.shipList[i][3];
		
		if (this.shipList[i][4] < -this.shipList[i][5]-Math.PI) {
			var p = net.starList[this.shipList[i][0]].points + this.points + 1;
			net.starList[this.shipList[i][0]].setPoints(p);
			this.shipList.splice(i,1);
		}
	}
};

Dot.prototype.draw = function() {
	ctx.save();
	
	translate(this.x, this.y);
	ctx.fillStyle = whiteColor;
	ctx.shadowColor = whiteColor;
	ctx.strokeStyle = whiteSemiColor;
	ctx.lineWidth = 4;
	
	// Blur if hovered
	if (!this.hover) {
		ctx.shadowBlur = 5;
	} else {
		ctx.shadowBlur = 18;
	}
	
	ctx.beginPath();
	ctx.arc(0, 0, this.radius, 0, Math.PI*2);
	ctx.fill();
	ctx.stroke();
	
	ctx.restore();
	
	for (var i=0; i < this.shipList.length; i++) {		
		var theta = this.shipList[i][6] - this.shipList[i][4] + Math.PI;
		var e = Math.PI - this.shipList[i][6] - this.shipList[i][4];
		var R = this.shipList[i][3];
		
		var x = this.x + this.shipList[i][1] + R * Math.cos(e);
		var y = this.y + this.shipList[i][2] + R * Math.sin(e);

		var highlight = false;
		
		if (this.shipList[i][4] < -Math.PI * 0.5) {
			highlight = true;
		}
		
		drawShip(this.shipList[i][7],x,y,theta,0,0.5,highlight);
	}
};

Dot.prototype.isMouseOver = function() {
	var r2 = 	Math.pow(mouse.worldX - this.x, 2) +
				Math.pow(mouse.worldY - this.y, 2);
	if (r2 < Math.pow(this.radius + 20, 2)) {
		this.hover = true;
		if (mouse.isMouseDown) {
			// TODO
			s1 = 0;
			star = net.starList[s1];
			net.starList[s1].setPoints(net.starList[s1].points - 1);
			
			var Ox = (star.x - this.x) * 0.5;
			var Oy = (star.y - this.y) * 0.5;
			var R = Math.sqrt(Math.pow(Ox, 2) + Math.pow(Oy, 2));
			var alpha0 = 2 * Math.asin(star.radius / R * 0.5);
			var alpha = alpha0;
			var id = star.id;
			
			var gamma = Math.acos(Ox / R);
			if (Oy < 0) {
				gamma = -gamma;
			}
			
			this.shipList.push([s1, Ox, Oy, R, alpha, alpha0, gamma, id]);
		}
	} else {
		this.hover = false;
	}
	return this.hover;
};
