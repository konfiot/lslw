/*
The main display. Calls every draw() functions
*/
Display = function () {
	// Setup the scene
	var s = Math.min(playerstate.scale, 1.0);
	
	for ctx in context {
		ctx.clearRect(0, 0, canvas.width / s, canvas.height / s);

		ctx.save();

		ctx.translate(canvas.width / 2, canvas.height / 2);
		ctx.scale(playerstate.scale, playerstate.scale);
	}

	// Draw the space
	space.draw();

	// Draw what the player should see
	playerDisplay();
	
	// Draw the ingame elements
	var obj = null;
	
	for i in engine.game {
		switch (engine.game[i].type) {
			case "star":
			// Draw a star
			obj = engine.game[i];
			ctx = context.stellar;
			
			radius = 45 + Math.log(obj.points + 1) * 5;

			ctx.save();

			translate(obj.x, obj.y);
			ctx.fillStyle = colorList[obj.id][0];
			ctx.strokeStyle = colorList[obj.id][1];
			ctx.lineWidth = 6;

			ctx.beginPath();
			ctx.arc(0, 0, radius, 0, Math.PI * 2);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();

			// Reflection effect
			ctx.fillStyle = whiteTransparentColor;
			var r = radius - 9;

			ctx.beginPath();
			ctx.arc(0, 0, r, Math.PI, 0);
			ctx.arc(0, -Math.sqrt(3) * r, 2 * r, Math.PI / 3.0, 2 * Math.PI / 3.0);
			ctx.fill();
			ctx.closePath();

			// Write the score
			ctx.font = "lighter " + String(parseInt(radius)) + "px arial";
			ctx.fillStyle = whiteSemiColor;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(obj.points, 0, 5);

			ctx.restore();
			break;
			
			case "ship":
			// Draw a ship
			obj = engine.game[i];
			ctx = context.stellar;
			
			
			for (i = 0; i < engine.game.ships.length; i++) {
			var connectionLength = engine.game.ships[i][4];
			var k = engine.game.ships[i][3];
			var connectionAngle = engine.game.ships[i][5];
			var id = engine.game.stars[engine.game.ships[i][0]].id;

			var x = engine.game.stars[engine.game.ships[i][0]].x + connectionLength * k * Math.cos(connectionAngle);
			var y = engine.game.stars[engine.game.ships[i][0]].y + connectionLength * k * Math.sin(connectionAngle);

			drawShip(engine.game.ships[i][6], x, y, connectionAngle, engine.game.ships[i][2], 1, false);
		}
		}
	}
	
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

		translate(obj.x, obj.y);
		ctx.fillStyle = whiteColor;
		ctx.shadowColor = whiteColor;
		ctx.strokeStyle = whiteSemiColor;
		ctx.lineWidth = 4;

		// Blur if hovered
		if (!obj.hover) {
			ctx.shadowBlur = 5;
		} else {
			ctx.shadowBlur = 18;
		}

		ctx.beginPath();
		ctx.arc(0, 0, obj.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();

		ctx.restore();

		for (var i = 0; i < obj.shipList.length; i++) {
			var theta = obj.shipList[i][6] - obj.shipList[i][4] + Math.PI;
			var e = Math.PI - obj.shipList[i][6] - obj.shipList[i][4];
			var R = obj.shipList[i][3];

			var x = obj.x + obj.shipList[i][1] + R * Math.cos(e);
			var y = obj.y + obj.shipList[i][2] + R * Math.sin(e);

			var highlight = false;

			if (obj.shipList[i][4] < -Math.PI * 0.5) {
				highlight = true;
			}

			drawShip(obj.shipList[i][7], x, y, theta, 0, 0.5, highlight);
		}
	}

	// Draws the stars

	for (i = 0; i < obj.nStars; i++) {
		engine.game.stars[i].draw();
	}

	for ctx in context {
		ctx.restore();
	}
};
