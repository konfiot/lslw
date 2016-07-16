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

	// Draws the ships
	for (i = 0; i < engine.game.ships.length; i++) {
		var connectionLength = engine.game.ships[i][4];
		var k = engine.game.ships[i][3];
		var connectionAngle = engine.game.ships[i][5];
		var id = engine.game.stars[engine.game.ships[i][0]].id;

		var x = engine.game.stars[engine.game.ships[i][0]].x + connectionLength * k * Math.cos(connectionAngle);
		var y = engine.game.stars[engine.game.ships[i][0]].y + connectionLength * k * Math.sin(connectionAngle);

		drawShip(engine.game.ships[i][6], x, y, connectionAngle, engine.game.ships[i][2], 1, false);
	}

	// Draws the stars

	for (i = 0; i < this.nStars; i++) {
		engine.game.stars[i].draw();
	}

	ctx.restore();
}