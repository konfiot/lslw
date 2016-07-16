/*
The main display. Calls every draw() functions
*/
Display = function () {
	// Setup the scene
	var s = Math.min(playerstate.scale, 1.0);

	for (var layer in context) {
		context[layer].clearRect(0, 0, canvas[layer].width / s, canvas[layer].height / s);

		context[layer].save();

		context[layer].translate(canvas[layer].width / 2, canvas[layer].height / 2);
		context[layer].scale(playerstate.scale, playerstate.scale);
	}

	// Draw the space
	space.draw();

	// Draw what the player should see
	playerDisplay();

	// Draw the ingame elements
	var obj = null;

	for (var i in engine.game) {
		switch (engine.game[i].type) {
			case "star": // Draw a STAR
				obj = engine.game[i];
				ctx = context.stellar;

				ctx.save();

				translate(obj.x, obj.y);
				ctx.fillStyle = colorList[obj.id][0];
				ctx.strokeStyle = colorList[obj.id][1];
				ctx.lineWidth = 6;

				ctx.beginPath();
				ctx.arc(0, 0, obj.radius, 0, Math.PI * 2);
				ctx.fill();
				ctx.stroke();
				ctx.closePath();

				// Reflection effect
				ctx.fillStyle = whiteTransparentColor;
				var r = obj.radius - 9;

				ctx.beginPath();
				ctx.arc(0, 0, r, Math.PI, 0);
				ctx.arc(0, -Math.sqrt(3) * r, 2 * r, Math.PI / 3.0, 2 * Math.PI / 3.0);
				ctx.fill();
				ctx.closePath();

				// Write the score
				ctx.font = "lighter " + String(parseInt(obj.radius)) + "px arial";
				ctx.fillStyle = whiteSemiColor;
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillText(obj.count, 0, 5);

				ctx.restore();
				break;

			case "satellite": // Draw a SATELLITE
				obj = engine.game[i];
				ctx = context.stellar;

				ctx.save();

				translate(obj.x, obj.y);
				ctx.fillStyle = whiteColor;
				ctx.shadowColor = whiteColor;
				ctx.shadowBlur = 5;
				ctx.strokeStyle = whiteSemiColor;
				ctx.lineWidth = 4;

				ctx.beginPath();
				ctx.arc(0, 0, obj.radius, 0, Math.PI * 2);
				ctx.fill();
				ctx.stroke();

				ctx.restore();
				break;

			case "ship": // Draw a SHIP
				obj = engine.game[i];
				ctx = context.ships;

				var connectionLength = engine.game.ships[i][4];
				var k = engine.game.ships[i][3];
				var connectionAngle = engine.game.ships[i][5];
				var id = engine.game.stars[engine.game.ships[i][0]].id;

				var x = engine.game.stars[engine.game.ships[i][0]].x + connectionLength * k * Math.cos(connectionAngle);
				var y = engine.game.stars[engine.game.ships[i][0]].y + connectionLength * k * Math.sin(connectionAngle);

				drawShip(engine.game.ships[i][6], x, y, connectionAngle, engine.game.ships[i][2], 1, false);
				break;

			case "link": // Draw a LINK
				obj = engine.game[i];
				ctx = context.background;

				ctx.save();

				var s1 = engine.game[obj.startId];
				var s2 = engine.game[obj.endId];

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
				break;
		}
	}

	/*
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
	*/
	for (layer in context) {
		context[layer].restore();
	}
};
