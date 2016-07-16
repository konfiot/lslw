/*
The player's state is embedded in this class. It handles the ships as well
*/
function Player(id) {
	this.id = id;
	
	this.hoveredStar = -1;
	this.selectedStar = -1;
	this.clickedStar = -1;
	this.previousSelectedStar = -1;
	this.previousClickedStar = -1;
	this.isDragging = false;
	
	this.hoveredSatellite = -1;
	
	this.centerX = 0;
	this.centerY = 0;
	this.scale = 1;
	
	// Animation
	// [star number, start time, progression]
	this.selectionAnimation = [];
}

Player.prototype.newSelection = function(starId) {
	this.previousSelectedStar = this.selectedStar;
	this.selectedStar = starId;
	if (this.selectedStar >= 0) {
		this.selectionAnimation.push([this.selectedStar, globalTimer, 0]);
	}
	if (this.selectionAnimation.length > 0) {
		this.selectionAnimation[this.selectionAnimation.length-1][1] = globalTimer;
	}
};

// Called when the mouse state changes
Player.prototype.update = function() {
	// Update animation
	
	for (var i = this.selectionAnimation.length-1; i >= 0 ; i--) {
		// Needs to be animated ?
		if (this.selectionAnimation[i][0] != this.selectedStar) {
			dt = globalTimer - this.selectionAnimation[i][1];
			
			// Still animated
			if (dt < 500) {
				this.selectionAnimation[i][2] = dt / 500;
			} else {
				this.selectionAnimation.splice(i, 1);
			}
		}
	}
	
	// Update which star is hovered
	this.hoveredStar = -1;
	for (var j = 0; j < net.nStars; j++) {
		var radiusStar2 = 	Math.pow(mouse.worldX - net.starList[j].x, 2) +
							Math.pow(mouse.worldY - net.starList[j].y, 2);
		if (radiusStar2 < Math.pow(net.starList[j].radius * 1.5 + 10 / player.scale, 2)) {
			this.hoveredStar = j;
			j = net.nStars; // Stop loop
		}
	}
	
	// Update which star is selected
	if (mouse.isMouseDown && !this.dragging && this.hoveredStar >= 0) {
		this.previousClickedStar = this.clickedStar;
		this.clickedStar = this.hoveredStar;
		
		if (net.starList[this.hoveredStar].id == this.id) {
			this.newSelection(this.hoveredStar);
		}
	}
	
	// If clicked out a star, deselect
	if (this.hoveredStar < 0 && !mouse.isMouseDown) {
		delta = Math.pow(mouse.lastClickedX - mouse.x, 2) + Math.pow(mouse.lastClickedY - mouse.y, 2);
		if (delta < 2) {
			this.newSelection(-1);
			this.clickedStar = -1;
		}
	}
	
	// Is the mouse still dragging ?
	if (!mouse.isMouseDown) {
		if (	this.dragging && this.hoveredStar >= 0 &&
				this.selectedStar >= 0 && this.hoveredStar != this.selectedStar) {
			// TODO Test if possible
			net.automationList.push([this.selectedStar, this.hoveredStar]);
			this.newSelection(-1);
			this.clickedStar  = -1;
		}
		this.dragging = false;
	} else {
		if (this.hoveredStar >= 0) {
			this.dragging = true;
		}
	}
	
	// If the player whishes to, a ship is sent
	if (	this.clickedStar >= 0 && this.previousClickedStar >= 0 &&
			this.previousClickedStar != this.clickedStar && net.starList[this.previousClickedStar].id == this.id) {
		var p = net.starList[this.previousClickedStar].points;
		
		if (p > 0) {
			net.addNewShip(this.previousClickedStar, this.clickedStar, p);
			net.starList[this.previousClickedStar].setPoints(0);
		}

		this.newSelection(-1);
		this.clickedStar = -1;
	}
	
	// Update which satellite is hovered
	// NEED OPTIMIZATION
	this.hoveredSatellite = -1;
	for (var k = 0; k < net.nSatellites; k++) {
		var radiusSat2 = 	Math.pow(mouse.worldX - net.satelliteList[k].x, 2) +
							Math.pow(mouse.worldY - net.satelliteList[k].y, 2);
		if (radiusSat2 < Math.pow(net.satelliteList[k].radius * 1.5 + 10 / player.scale, 2)) {
			this.hoveredSatellite = k;
			k = net.nSatellites; // Stop loop
		}
	}
};

// If the player is not willing to drag, change the view
Player.prototype.mouseDownMoved = function(mouseDeltaX, mouseDeltaY) {
	if (!this.dragging) {
		this.centerX += mouseDeltaX / this.scale;
		this.centerY += mouseDeltaY / this.scale;
	}
};

Player.prototype.draw = function() {
	// Draws an aura around the hovered star
	if (this.hoveredStar >= 0) {
		var hStar = net.starList[this.hoveredStar];
		
		ctx.save();
		
		translate(hStar.x, hStar.y);
		ctx.lineWidth = 6;
		ctx.shadowColor = colorList[hStar.id][1];
		ctx.shadowBlur = 12;
		
		ctx.beginPath();
		ctx.arc(0, 0, hStar.radius, 0, Math.PI*2);
		ctx.fill();
		ctx.stroke();
		
		ctx.restore();
	}
	
	// Draws an aura around the hovered satellite
	if (this.hoveredSatellite >= 0) {
		var hSat = net.satelliteList[this.hoveredSatellite];
		
		ctx.save();
		
		translate(hSat.x, hSat.y);
		ctx.lineWidth = 6;
		ctx.strokeStyle = whiteColor;
		ctx.shadowColor = whiteColor;
		ctx.shadowBlur = 12;
		
		ctx.beginPath();
		ctx.arc(0, 0, hSat.radius, 0, Math.PI*2);
		ctx.fill();
		ctx.stroke();
		
		ctx.restore();
	}
	
	// Draws the selection cursor
	for (var i = 0; i < this.selectionAnimation.length ; i++) {
		var current = this.selectionAnimation[i];
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
