/*
The main display. Iterate through the game elements
*/

Display = function () {
	// Setup the scene
	var s = Math.min(playerstate.scale, 1.0);

	var viewportWidth = visibleCanvas.foreground.width;
	var viewportHeight = visibleCanvas.foreground.height;
	visibleContext.background.clearRect(0, 0, viewportWidth, viewportHeight);
	visibleContext.foreground.clearRect(0, 0, viewportWidth, viewportHeight);

	// Draw the space TODO
	space.draw();

	// Draw what the player should see
	playerDisplay();

	// Draw the ships
	drawShips();

	// Blit the offscreen canvases onto the visible one
	var posX = playerstate.centerX - parseInt(viewportWidth * 0.5 / playerstate.scale);
	var posY = playerstate.centerY - parseInt(viewportHeight * 0.5 / playerstate.scale);
	var viewportScaledWidth = viewportWidth / playerstate.scale;
	var viewportScaledHeight = viewportHeight / playerstate.scale;

	visibleContext.foreground.drawImage(offCanvas.links,
				posX, posY, viewportScaledWidth, viewportScaledHeight,
				0, 0, viewportWidth, viewportHeight);
	visibleContext.foreground.drawImage(offCanvas.ships,
				posX, posY, viewportScaledWidth, viewportScaledHeight,
				0, 0, viewportWidth, viewportHeight);
	visibleContext.foreground.drawImage(offCanvas.player,
				posX, posY, viewportScaledWidth, viewportScaledHeight,
				0, 0, viewportWidth, viewportHeight);
	visibleContext.foreground.drawImage(offCanvas.stellar,
				posX, posY, viewportScaledWidth, viewportScaledHeight,
				0, 0, viewportWidth, viewportHeight);
};

drawDisplayClallback = function (id) {
	var obj = engine.game[id];

	switch (obj.type) {
		case "star":
			clearStellar(obj.x, obj.y, computeRadius("star", obj.count) + 20);
			drawStar(obj);

			break;

		case "link":
			// No need to clear !
			drawLink(obj);

			break;

		case "satellite":
			clearStellar(obj.x, obj.y, maxRadSat);

			if (obj.visible) {
				drawSatellite(obj);
			}

			break;
	}
};

// Draws the star on the starContext
drawStar = function (obj) {
	var x = parseInt(obj.x);
	var y = parseInt(obj.y);
	ctx = offContext.stellar;

	// Clear the area first
	ctx.clearRect(x - radius - 15, y - radius - 15,
					2 * radius + 10, 2 * radius + 10);

	ctx.fillStyle = engine.game[obj.id].color[0];
	ctx.strokeStyle = engine.game[obj.id].color[1];
	ctx.lineWidth = 6;
	var radius = computeRadius("star", obj.count);

	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();

	// Reflection effect
	ctx.fillStyle = whiteTransparentColor;
	var r = radius - 9;

	ctx.beginPath();
	ctx.arc(x, y, r, Math.PI, 0);
	ctx.arc(x, y - Math.sqrt(3) * r, 2 * r, Math.PI / 3.0, 2 * Math.PI / 3.0);
	ctx.fill();
	ctx.closePath();

	// Write the score
	ctx.font = "lighter " + String(parseInt(radius)) + "px arial";
	ctx.fillStyle = whiteSemiColor;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(obj.count, x, y + 5);
};

drawLink = function (obj) {
	var dx = parseInt(gameConstants.mapSize * 0.5);
	var dy = parseInt(gameConstants.mapSize * 0.5);
	ctx = offContext.links;

	var s1 = engine.game[obj.from];
	var s2 = engine.game[obj.to];

	ctx.setLineDash([20, 8]);

	if (s1.id != playerIdList[0] && s1.id == s2.id) {
		ctx.lineWidth = 5;
		ctx.strokeStyle = engine.game[s1.id].color[0];
	} else {
		ctx.lineWidth = 3;
		ctx.strokeStyle = greyColor;
	}

	ctx.beginPath();
	ctx.moveTo(s1.x, s1.y);
	ctx.lineTo(s2.x, s2.y);
	ctx.stroke();
	ctx.closePath();
};

drawSatellite = function (obj) {
	var x = parseInt(obj.x);
	var y = parseInt(obj.y);
	ctx = offContext.stellar;

	ctx.clearRect(x - maxRadSat, y - maxRadSat, 2 * maxRadSat, 2 * maxRadSat);

	var posX = -playerstate.centerX + obj.x - maxRadSat;
	var posY = -playerstate.centerY + obj.y - maxRadSat;
	ctx.drawImage(offSateliteCanvas,
			maxRadSat * 2 * (obj.count - 2), 0, 2 * maxRadSat, 2 * maxRadSat,
			x - maxRadSat, y - maxRadSat, 2 * maxRadSat, 2 * maxRadSat);

};

drawShips = function (obj) {
	var shipsToDraw = [];

	for (var i in engine.game) {
		obj = engine.game[i];

		// Determine its properties
		if (obj.type === "ship") {
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

			if (engine.game[obj.to].type === "star") {
				// Draw a ship from star to star
				if (crossedDistance < L) {
					x = engine.game[obj.from].x + crossedDistance * Math.cos(theta);
					y = engine.game[obj.from].y + crossedDistance * Math.sin(theta);

					shipsToDraw.push([obj.id, x, y, theta, obj.count, 1, false]);
				}
			} else {
				// Draw a ship going for a satellite
				if (crossedDistance < Math.PI * L) {
					var hasTakenSatellite = false;

					if (obj.count > 1) {
						hasTakenSatellite = true;
					}

					var alpha = crossedDistance / L * 2;
					var gamma = Math.PI * 0.5 + theta - alpha;
					var epsilon = theta + (Math.PI - alpha) * 0.5;
					var r2 = L * Math.sin(alpha / 2);

					x = engine.game[obj.from].x + r2 * Math.cos(epsilon);
					y = engine.game[obj.from].y + r2 * Math.sin(epsilon);

					shipsToDraw.push([obj.id, x, y, gamma, 0, 0.5, hasTakenSatellite]);
				}
			}
		}
	}

	// Clear
	for (var j = 0; j < shipsToDraw.length; j++) {
		clearShip(shipsToDraw[j][1], shipsToDraw[j][2]);
	}

	// Draw
	for (j = 0; j < shipsToDraw.length; j++) {
		drawSingleShip.apply(null, shipsToDraw[j]);
	}
};

clearShip = function (x, y) {
	offContext.ships.clearRect(x - 50, y - 50, 100, 100);
};

// Draw ships, works for different size : ships between stars or to get points
drawSingleShip = function (id, x, y, theta, count, factor, highlight) {
	var ctx = offContext.ships;
	ctx.save();

	var c = Math.cos(theta);
	var s = Math.sin(theta);

	ctx.translate(x, y, ctx);
	ctx.scale(factor, factor);
	ctx.fillStyle = engine.game[id].color[0];

	if (highlight) {
		ctx.shadowColor = whiteSemiColor;
		ctx.shadowBlur = 12;
	}

	// Draws the shape
	ctx.beginPath();
	ctx.moveTo(-15 * s, 15 * c);
	ctx.lineTo(35 * c, 35 * s);
	ctx.lineTo(15 * s, -15 * c);
	ctx.lineTo(-10 * c, -10 * s);
	ctx.fill();

	if (count !== 0) {
		ctx.font = "lighter 25px arial";
		ctx.fillStyle = whiteSemiColor;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(count, 30 * s, -30 * c);
	}

	ctx.restore();
};

clearStellar = function (x, y, radius) {
	offContext.stellar.clearRect(x - radius, y - radius,
					2 * radius, 2 * radius);
	offContext.ships.clearRect(x - radius, y - radius,
					2 * radius, 2 * radius);
};

clearLink = function (obj) {
	star1 = engine.game[obj.from];
	star2 = engine.game[obj.to];

	offContext.links.clearRect(star1.x, star1.y,
					star2.x - star1.x, star2.y - star1.y);
};
