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
		var x = (Math.random() * 5 - 2.5) * canvas.width;
		var y = (Math.random() * 5 - 2.5) * canvas.height;
		this.distantStars.push([x, y, radius, distantFactor]);
	}
	
	// Create a star outside the screen
	this.createOutboundDistantStar = function() {
		var distantFactor = Math.random() * 0.1 + 0.05;
		var _x = Math.random() * 3;

		// Create a star arroud the screen, not within, in a 3x3 box
		if (_x < 1 || _x > 2) {
			var _y = Math.random() * 3;
		} else {
			var _y = Math.random();
			if (Math.random() < 0.5) {
				_y += 2;
			}
		}

		var x = (_x - 1.5) * canvas.width / player.scale + player.centerX * distantFactor;
		var y = (_y - 1.5) * canvas.height / player.scale + player.centerY * distantFactor;

		// Radius of the distant star
		var radius = Math.random() * 3 + 4;
		return [x, y, radius, distantFactor];
	};
	
	// Draw the whole space on screen and handle the outbound stars
	this.draw = function() {
		var offScreenStars = []
		
		// If inbound, draw. Else, mark the star
		ctx.save();
		
		if (player.scale > 0.50) {
			// Normal color
			ctx.fillStyle = "rgb(65, 15, 115)";
		} else if (player.scale < 0.30) {
			// Invisible
			ctx.fillStyle = backgroundColor;
		} else {
			// Fade
			var t = (player.scale - 0.3) / 0.2;
			
			ctx.fillStyle = "rgb(" + 	parseInt(30 + 35 * t) + "," +
										parseInt(8 +7 * t) + "," +
										parseInt(54 + 61 * t) + ")";
		}		
		
		for (var i = 0; i < this.nDistantStars; i++) {
			var distantFactor = this.distantStars[i][3];
			var x = this.distantStars[i][0] - player.centerX * distantFactor;
			var y = this.distantStars[i][1] - player.centerY * distantFactor;
		
			if(		x < canvas.width * 1.5 &&
					x > -canvas.width * 1.5 &&
					y > -canvas.height * 1.5 &&
					y < canvas.height * 1.5) {
				
				ctx.beginPath();
				ctx.arc(x, y, this.distantStars[i][2], 0, Math.PI*2);
				ctx.fill();
				
			} else {
				offScreenStars.push(i);
			}
		}
		ctx.restore();
		
		// Replace outboud stars with others
		for (var i = 0; i < offScreenStars.length; i++)
			this.distantStars[offScreenStars[i]] = this.createOutboundDistantStar();
	};
};