/*
The main display. Iterate through the game elements
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

				translate(obj.x, obj.y, ctx);
				ctx.fillStyle = engine.game[obj.id].color[0];
				ctx.strokeStyle = engine.game[obj.id].color[1];
				ctx.lineWidth = 6;
				var radius = computeStarRadius(obj.count);

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
				ctx.fillText(obj.count, 0, 5);

				ctx.restore();
				break;

			case "satellite": // Draw a SATELLITE
				obj = engine.game[i];
				ctx = context.stellar;

				ctx.save();

				translate(obj.x, obj.y, ctx);
				ctx.fillStyle = whiteColor;
				ctx.shadowColor = whiteColor;
				ctx.shadowBlur = 5;
				ctx.strokeStyle = whiteSemiColor;
				ctx.lineWidth = 4;
				radius = computeSatelliteRadius(obj.count);

				ctx.beginPath();
				ctx.arc(0, 0, radius, 0, Math.PI * 2);
				ctx.fill();
				ctx.stroke();

				ctx.restore();
				break;

			case "ship": // Draw a SHIP
				obj = engine.game[i];
				var x, y;
				var crossedDistance = (engine.serverTimestamp() - obj.timestamp) / 1000 *
										engine.options.shipSpeed + obj.initRadius;

				var dx = engine.game[obj.to].x - engine.game[obj.from].x;
				var dy = engine.game[obj.to].y - engine.game[obj.from].y;
				var L = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

				var theta = Math.acos(dx / L);

				if (dy < 0) {
					theta = -theta;
				}

				if (obj.count > 0) {

					// Draw a ship from star to star
					if (crossedDistance < L) {
						x = engine.game[obj.from].x + crossedDistance * Math.cos(theta);
						y = engine.game[obj.from].y + crossedDistance * Math.sin(theta);

						drawShip(obj.id, x, y, theta, obj.count, 1, false);
					}
				} else {

					// Draw a ship seeking a satellite
					if (crossedDistance < Math.PI * L) {
						var hasTakenSatellite = false;

						if (obj.count < 0) {
							hasTakenSatellite = true;
						}

						var alpha = crossedDistance / L * 2;
						var gamma = Math.PI * 0.5 - theta - alpha;
						var epsilon = theta + (Math.PI - alpha) * 0.5;
						r = L * Math.sin(alpha / 2);

						x = engine.game[obj.from].x + r * Math.cos(epsilon);
						y = engine.game[obj.from].y + r * Math.sin(epsilon);

						drawShip(obj.id, x, y, gamma, obj.count, 0.5, hasTakenSatellite);
					}
				}

				break;

			case "link": // Draw a LINK
				obj = engine.game[i];
				ctx = context.background;

				ctx.save();

				var s1 = engine.game[obj.from];
				var s2 = engine.game[obj.to];

				translate(s1.x, s1.y, ctx);
				ctx.setLineDash([20, 8]);

				ctx.lineWidth = 3;

				if (s1.id == s2.id) {
					ctx.strokeStyle = engine.game[s1.id].color[0];
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

	for (layer in context) {
		context[layer].restore();
	}
};

// Draw ships, works for different size : ships between stars or to get points
function drawShip(id, x, y, theta, count, factor, highlight) {
	context.ships.save();

	var c = Math.cos(theta);
	var s = Math.sin(theta);

	translate(x, y, context.ships);
	context.ships.scale(factor, factor);
	context.ships.fillStyle = engine.game[id].color[0];

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

	if (count !== 0) {
		context.ships.font = "lighter 25px arial";
		context.ships.fillStyle = whiteSemiColor;
		context.ships.textAlign = "center";
		context.ships.textBaseline = "middle";
		context.ships.fillText(count, 30 * s, -30 * c);
	}

	context.ships.restore();
}
