/*
Draws the information that only the playerstate can see
*/
playerDisplay = function () {
	// Draws an aura around the hovered star
	if (playerstate.hoveredStar >= 0) {
		var hStar = net.starList[playerstate.hoveredStar];

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
	if (playerstate.hoveredSatellite >= 0) {
		var hSat = net.satelliteList[playerstate.hoveredSatellite];

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

	// Draws the selection cursor
	for (var i = 0; i < playerstate.selectionAnimation.length ; i++) {
		var current = playerstate.selectionAnimation[i];
		var s = net.starList[current[0]];
		var inc = T * 0.01;
		var r = s.radius + 5;

		ctx.save();

		translate(s.x, s.y);
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
