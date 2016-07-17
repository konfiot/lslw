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

				var crossedDistance = (engine.serverTimestamp() - obj.timestamp) / 1000 * engine.options.shipSpeed;
				var dx = engine.game[obj.to].x - engine.game[obj.from].x;
				var dy = engine.game[obj.to].y - engine.game[obj.from].y;
				var L = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

				var theta = Math.acos(dx / L);

				if (dy < 0) {
					theta = -theta;
				}

				var x = engine.game[obj.from].x + crossedDistance * Math.cos(theta);
				var y = engine.game[obj.from].y + crossedDistance * Math.sin(theta);

				drawShip(obj.id, x, y, theta, obj.count, 1, false);
				break;
				
			case "cargo": // Draw a CARGO
				obj = engine.game[i];

				var crossedDistance = (engine.serverTimestamp() - obj.timestamp) / 1000 * engine.options.shipSpeed;
				var dx = engine.game[obj.to].x - engine.game[obj.from].x;
				var dy = engine.game[obj.to].y - engine.game[obj.from].y;
				var L = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

				var theta = Math.acos(dx / L);

				if (dy < 0) {
					theta = -theta;
				}

				var x = engine.game[obj.from].x + crossedDistance * Math.cos(theta);
				var y = engine.game[obj.from].y + crossedDistance * Math.sin(theta);

				drawShip(obj.id, x, y, theta, obj.count, 1, false);
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


// Draw ships, works for different size : ships between stars or to get points
function drawShip(id, x, y, theta, count, factor, highlight) {
	context.ships.save();

	var c = Math.cos(theta);
	var s = Math.sin(theta);

	translate(x, y);
	context.ships.scale(factor, factor);
	context.ships.fillStyle = engine.colorList[id][0];

	if (highlight) {
		context.ships.shadowColor = whiteSemiColor;
		context.ships.shadowBlur = 12;
	}

	// Draws the shape
	context.ships.beginPath();
	context.ships.moveTo(-15 * s, 15 * c);
	context.ships.lineTo(35 * c, 35 * s);
	context.ships.lineTo(15 * s, -15 * c);
	context.ships.lineTo(-10 * c, -10 * s);
	context.ships.fill();

	if (val !== 0) {
		context.ships.font = "lighter 25px arial";
		context.ships.fillStyle = whiteSemiColor;
		context.ships.textAlign = "center";
		context.ships.textBaseline = "middle";
		context.ships.fillText(count, 30 * s, -30 * c);
	}

	context.ships.restore();
}