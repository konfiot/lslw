/*
The main display. Calls every draw() functions
*/
Display = function () {
	// Setup the scene
	var s = Math.min(playerstate.scale, 1.0);
	ctx.clearRect(0, 0, canvas.width / s, canvas.height / s);

	ctx.save();

	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.scale(playerstate.scale, playerstate.scale);

	// Draw the space
	space.draw();

	// Draws the connexions between stars according to their colors
	for (var i = 0; i < engine.game.nLinks; i++) {
		ctx.save();

		var s1 = engine.game.stars[engine.game.links[i][0]];
		var s2 = engine.game.stars[engine.game.links[i][1]];

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

	playerDisplay();

	// Draws the satellites
	for (i = 0; i < engine.game.satellites.length; i++) {
		var sat = engine.game.satellites[i];

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

	// TODO Draws the ships
	for (i = 0; i < engine.game.ships.length; i++) {
		var connectionLength = engine.game.ships[i][4];
		var k = engine.game.ships[i][3];
		var connectionAngle = engine.game.ships[i][5];
		var id = engine.game.stars[engine.game.ships[i][0]].id;

		var x = engine.game.stars[engine.game.ships[i][0]].x + connectionLength * k * Math.cos(connectionAngle);
		var y = engine.game.stars[engine.game.ships[i][0]].y + connectionLength * k * Math.sin(connectionAngle);

		drawShip(engine.game.ships[i][6], x, y, connectionAngle, engine.game.ships[i][2], 1, false);
	}

	// TODO chose ships ?
	for (i = 0; i < engine.game.ships.length; i++) {
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
		ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();

		ctx.restore();

		for (var i = 0; i < this.shipList.length; i++) {
			var theta = this.shipList[i][6] - this.shipList[i][4] + Math.PI;
			var e = Math.PI - this.shipList[i][6] - this.shipList[i][4];
			var R = this.shipList[i][3];

			var x = this.x + this.shipList[i][1] + R * Math.cos(e);
			var y = this.y + this.shipList[i][2] + R * Math.sin(e);

			var highlight = false;

			if (this.shipList[i][4] < -Math.PI * 0.5) {
				highlight = true;
			}

			drawShip(this.shipList[i][7], x, y, theta, 0, 0.5, highlight);
		}
	}

	// Draws the stars

	for (i = 0; i < this.nStars; i++) {
		engine.game.stars[i].draw();
	}

	ctx.restore();
};
