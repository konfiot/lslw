/*
Draws the information that only the playerstate can see
*/
playerDisplay = function () {
	// Draw on the ships layer
	ctx = context.ships;

	// Draws an aura around the hovered star
	if (playerstate.hoveredStarId >= 0) {
		var hStar = engine.game[playerstate.hoveredStarId];

		ctx.save();

		translate(hStar.x, hStar.y);
		ctx.lineWidth = 6;
		ctx.shadowColor = colorList[hStar.id][1];
		ctx.shadowBlur = 12;

		ctx.beginPath();
		ctx.arc(0, 0, hStar.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();

		ctx.restore();
	}

	// Draws an aura around the hovered satellite
	if (playerstate.hoveredSatelliteId >= 0) {
		var hSat = engine.game[playerstate.hoveredSatelliteId];

		ctx.save();

		translate(hSat.x, hSat.y);
		ctx.lineWidth = 6;
		ctx.strokeStyle = whiteColor;
		ctx.shadowColor = whiteColor;
		ctx.shadowBlur = 12;

		ctx.beginPath();
		ctx.arc(0, 0, hSat.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();

		ctx.restore();
	}

	// Draws the automation indicators
	for (i = 0; i < engine.automationList.length; i++) {
		var star1 = engine.game[this.automationList[i][0]];
		var star2 = engine.game[this.automationList[i][1]];
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

	// Draws the selection cursor
	for (var i = 0; i < playerstate.selectionAnimation.length ; i++) {
		var current = playerstate.selectionAnimation[i];
		var star = engine.game[current[0]];
		var inc = T * 0.01;
		var r = star.radius + 5;

		ctx.save();

		translate(star.x, star.y);
		ctx.strokeStyle = "rgba(255, 255, 255, " + String(0.6 * (1 - current[2] * current[2])) + ")";
		ctx.lineWidth = 10 - current[2] * 5;
		ctx.setLineDash([Math.PI / 3 * r, Math.PI / 6 * r]);
		ctx.shadowColor = whiteSemiColor;
		ctx.shadowBlur = 8;

		ctx.beginPath();
		ctx.arc(0, 0, r, inc, Math.PI * 2 + inc);
		ctx.stroke();
		ctx.closePath();

		ctx.restore();
	}
};
