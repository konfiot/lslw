/*
Handles the background, made of distant stars with depth effect.
When the center moves, outbound stars are replaces with others.
*/
function SpaceBackground(n) {
	this.nDistantStars = n;
	this.distantStars = [];

	for (var i = 0; i < this.nDistantStars; i++) {
		var distantFactor = Math.random() * 0.1 + 0.05;
		var radius = Math.random() * 3 + 4;
		var x = (Math.random() * 5 - 2.5) * canvas.background.width;
		var y = (Math.random() * 5 - 2.5) * canvas.background.height;
		this.distantStars.push([x, y, radius, distantFactor]);
	}
}

// Create a star outside the screen
SpaceBackground.prototype.createOutboundDistantStar = function () {
	var distantFactor = Math.random() * 0.1 + 0.05;
	var _x = Math.random() * 3;
	var _y = 0;

	// Create a star arroud the screen, not within, in a 3x3 box

	if (_x < 1 || _x > 2) {
		_y = Math.random() * 3;
	} else {
		_y = Math.random();

		if (Math.random() < 0.5) {
			_y += 2;
		}
	}

	var x = (_x - 1.5) * canvas.background.width / playerstate.scale + playerstate.centerX * distantFactor;
	var y = (_y - 1.5) * canvas.background.height / playerstate.scale + playerstate.centerY * distantFactor;

	// Radius of the distant star
	var radius = Math.random() * 3 + 4;

	return [x, y, radius, distantFactor];
};

// Draw the whole space on screen and handle the outbound stars
SpaceBackground.prototype.draw = function () {
	var offScreenStars = [];
	
	// If inbound, draw. Else, mark the star
	context.background.save();

	if (playerstate.scale > 0.50) {
		// Normal color
		context.background.fillStyle = "rgb(65, 15, 115)";
	} else if (playerstate.scale < 0.30) {
		// Invisible
		context.background.fillStyle = backgroundColor;
	} else {
		// Fade
		var t = (playerstate.scale - 0.3) / 0.2;

		context.background.fillStyle = "rgb(" +	parseInt(30 + 35 * t) + "," +
											parseInt(8 + 7 * t) + "," +
											parseInt(54 + 61 * t) + ")";
	}

	/*
	context.background.clearRect(0, 0, canvas.background.width, canvas.background.height);
	context.background.font = "lighter " + 70 + "px arial";
	context.background.fillStyle = "rgb(0,0,0)";
	context.background.textAlign = "center";
	context.background.textBaseline = "middle";
	context.background.fillText("YYY", 140, 105);*/

	
	for (var i = 0; i < this.nDistantStars; i++) {
		var distantFactor = this.distantStars[i][3];
		var x = this.distantStars[i][0] - playerstate.centerX * distantFactor;
		var y = this.distantStars[i][1] - playerstate.centerY * distantFactor;
		
		if (x < canvas.background.width * 1.5 &&
			x > -canvas.background.width * 1.5 &&
			y > -canvas.background.height * 1.5 &&
			y < canvas.background.height * 1.5) {

			context.background.beginPath();
			context.background.arc(x, y, this.distantStars[i][2], 0, Math.PI * 2);
			context.background.fill();

		} else {
			offScreenStars.push(i);
		}
	}
	context.background.restore();

	// Replace outboud stars with others
	for (var j = 0; j < offScreenStars.length; j++) {
		this.distantStars[offScreenStars[j]] = this.createOutboundDistantStar();
	}
};
