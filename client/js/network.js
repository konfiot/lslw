/*
The network is made of interconnected stars. This handles the lists of relevant items
and updates the networks's state
*/
function Network(size) {
	this.mapSize = 1000;
	this.size = size;
	this.nSatellites = 50;

	// Initialize the network of stars
	this.starList = generateStars(this.size);
	this.satelliteList = generateSatellites(this.nSatellites, this.mapSize);

	this.nStars = this.starList.length;

	colorList.push(["hsl(180, 0%, 51%)", "hsl(180, 0%, 67%)"],
						generateColor(220), generateColor(100));

	// Contains the connexions
	this.connexionList = [];

	// var c = computeBridge(this.starList[0], this.starList[1])
	// start star, end star, val, proportion, length, theta, id
	this.shipList = [];

	// x, y, value

	this.automationList = [];

	this.addNewShip = function (s1, s2, val) {
		var star1 = this.starList[s1];
		var star2 = this.starList[s2];

		var dx = star2.x - star1.x;
		var dy = star2.y - star1.y;
		var L = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
		var c = star1.radius / L;
		var id = star1.id;

		var theta = Math.acos(dx / L);

		if (dy < 0) {
			theta = -theta;
		}

		this.shipList.push([s1, s2, val, c, L, theta, id]);
	};
}

Network.prototype.update = function (dt) {
	// Compute the new advancement of the ships, plus the conquest mechanic

	for (var i = this.shipList.length - 1; i >= 0; i--) {
		// New proportion of the segment crossed
		var c = this.shipList[i][3] + shipSpeed * dt / this.shipList[i][4];

		if (c < (this.shipList[i][4] - this.starList[this.shipList[i][1]].radius) / this.shipList[i][4]) {
			this.shipList[i][3] = c;
		} else {
			var p = this.starList[this.shipList[i][1]].points;
			var star1 = this.starList[this.shipList[i][0]];
			var star2 = this.starList[this.shipList[i][1]];

			// Both stars belong to the same player

			if (star1.id == star2.id) {
				star2.setPoints(p + this.shipList[i][2]);
			} else {
				var q = p - this.shipList[i][2];

				// The star is attacked, if the score is neg, the star is conquered

				if (q < 0) {
					star2.setPoints(-q - 1);
					star2.id = this.shipList[i][6];
				} else {
					star2.setPoints(q);
				}
			}

			this.shipList.splice(i, 1);
		}
	}
};

Network.prototype.draw = function () {
	// Draws the connexions between stars according to their colors

	for (var i = 0; i < this.connexionList.length; i++) {
		ctx.save();

		var s1 = this.starList[this.connexionList[i][0]];
		var s2 = this.starList[this.connexionList[i][1]];

		translate(s1.x, s1.y);
		ctx.setLineDash([20, 8]);

		ctx.lineWidth = 3;

		if (s1.id == s2.id) {
			ctx.strokeStyle = colorList[s1.id][0];
		} else {
			ctx.strokeStyle = whiteColor;
		}

		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(s2.x - s1.x, s2.y - s1.y);
		ctx.stroke();
		ctx.closePath();

		ctx.restore();
	}

	// Draws the automation indicator

	for (i = 0; i < this.automationList.length; i++) {
		var star1 = net.starList[this.automationList[i][0]];
		var star2 = net.starList[this.automationList[i][1]];
		var dx = star2.x - star1.x;
		var dy = star2.y - star1.y;
		var L = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

		var theta = Math.acos(dx / L);

		if (dy < 0) {
			theta = -theta;
		}

		var c = Math.cos(theta);
		var s = Math.sin(theta);
		var h = star1.radius + 60;

		ctx.save();

		translate(star1.x, star1.y);
		ctx.fillStyle = colorList[star1.id][0];

		ctx.beginPath();
		ctx.moveTo(-25 * s, 25 * c);
		ctx.lineTo(h * c, h * s);
		ctx.lineTo(25 * s, -25 * c);
		ctx.lineTo(0, 0);
		ctx.fill();

		ctx.restore();
	}

	// Draws the ships

	for (i = 0; i < this.shipList.length; i++) {
		var connectionLength = this.shipList[i][4];
		var k = this.shipList[i][3];
		var connectionAngle = this.shipList[i][5];
		var id = this.starList[this.shipList[i][0]].id;

		var x = this.starList[this.shipList[i][0]].x + connectionLength * k * Math.cos(connectionAngle);
		var y = this.starList[this.shipList[i][0]].y + connectionLength * k * Math.sin(connectionAngle);

		drawShip(this.shipList[i][6], x, y, connectionAngle, this.shipList[i][2], 1, false);
	}

	// Draws the stars

	for (i = 0; i < this.nStars; i++) {
		this.starList[i].draw();
	}

	// Draws the satellites

	for (i = 0; i < this.nSatellites; i++) {
		var sat = this.satelliteList[i];

		ctx.save();

		translate(sat.x, sat.y);
		ctx.fillStyle = whiteColor;
		ctx.shadowColor = whiteColor;
		ctx.shadowBlur = 5;
		ctx.strokeStyle = whiteSemiColor;
		ctx.lineWidth = 4;

		ctx.beginPath();
		ctx.arc(0, 0, sat.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();

		ctx.restore();
	}
};
