/*
Draws the information that only the playerstate can see
*/
playerDisplay = function () {
	// Draw on the ships layer
	ctx = offContext.player;

	// Draws an aura around the hovered star
	if (playerstate.hoveredStarId !== -1) {
		var hStar = engine.game[playerstate.hoveredStarId];
		var x = hStar.x;
		var y = hStar.y;
		var radius = computeRadius("star", hStar.count);

		ctx.save();

		ctx.lineWidth = 6;
		ctx.shadowColor = engine.game[hStar.id].color[1];
		ctx.shadowBlur = 12;

		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();

		ctx.restore();
	}

	// Draws an aura around the hovered satellite
	if (playerstate.hoveredSatelliteId !== -1) {
		var hSat = engine.game[playerstate.hoveredSatelliteId];

		ctx.save();

		ctx.lineWidth = 6;
		ctx.strokeStyle = whiteColor;
		ctx.shadowColor = whiteColor;
		ctx.shadowBlur = 12;

		ctx.beginPath();
		ctx.arc(hSat.x, hSat.y, computeRadius("satellite", hSat.count), 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();

		ctx.restore();
	}

	// Draws the automation indicators
	for (var i = 0; i < engine.game[playerstate.id].automation.length; i++) {
		var star1 = engine.game[engine.game[playerstate.id].automation[i][0]];
		var star2 = engine.game[engine.game[playerstate.id].automation[i][1]];
		var dx = star2.x - star1.x;
		var dy = star2.y - star1.y;
		var L = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

		var theta = Math.acos(dx / L);

		if (dy < 0) {
			theta = -theta;
		}

		var c = Math.cos(theta);
		var s = Math.sin(theta);
		var h = computeRadius("star", star1.count) + 60;

		ctx.save();

		ctx.translate(star1.x, star1.y);
		ctx.fillStyle = engine.game[star1.id].color[0];

		ctx.beginPath();
		ctx.moveTo(-25 * s, 25 * c);
		ctx.lineTo(h * c, h * s);
		ctx.lineTo(25 * s, -25 * c);
		ctx.lineTo(0, 0);
		ctx.fill();

		ctx.restore();
	}

	// Draws the selection cursor
	for (i = 0; i < playerstate.selectionAnimation.length ; i++) {
		var current = playerstate.selectionAnimation[i];
		var star = engine.game[current[0]];
		var inc = (Date.now() / 1000 % (2 * Math.PI)); // TODO
		var r = computeRadius("star", star.count) + 5;

		ctx.save();

		ctx.strokeStyle = "rgba(255, 255, 255, " + String(0.6 * (1 - current[2] * current[2])) + ")";
		ctx.lineWidth = 10 - current[2] * 5;
		ctx.setLineDash([Math.PI / 3 * r, Math.PI / 6 * r]);
		ctx.shadowColor = whiteSemiColor;
		ctx.shadowBlur = 8;

		ctx.beginPath();
		ctx.arc(star.x, star.y, r, inc, Math.PI * 2 + inc);
		ctx.stroke();
		ctx.closePath();

		ctx.restore();
	}

	// Draws the selection marker for the satellites
	for (i = 0; i < playerstate.clickedSatellites.length; i++) {
		var sat = engine.game[playerstate.clickedSatellites[i]];

		ctx.save();

		ctx.fillStyle = whiteTransparentColor;

		ctx.beginPath();
		ctx.arc(sat.x, sat.y, computeRadius("satellite", sat.count) + 8, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();

		ctx.restore();
	}
};

clearPlayerCallback = function () {
	var obj, radius;

	if (playerstate.hoveredStarId !== -1) {
		obj = engine.game[playerstate.hoveredStarId];
		radius = computeRadius("star", obj.count) + 20;

		clearArroundStellar(obj.x, obj.y, radius);
	}

	if (playerstate.hoveredSatelliteId !== -1) {
		obj = engine.game[playerstate.hoveredSatelliteId];
		radius = maxRadSat;

		clearArroundStellar(obj.x, obj.y, radius);
	}

	var select = playerstate.selectionAnimation;

	for (var i = 0; i < select.length; i++) {
		obj = engine.game[select[i][0]];
		radius = computeRadius("star", obj.count) + 30;

		clearArroundStellar(obj.x, obj.y, radius);
	}
}

clearArroundStellar = function (x, y, radius) {
	offContext.player.clearRect(x - radius, y - radius,
					2 * radius, 2 * radius);
}
