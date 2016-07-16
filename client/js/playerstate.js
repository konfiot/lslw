/*
Handles the playerstate inputs. Understands the behavior of the playerstate
then send requests to the engine.
*/
function PlayerState(id) {
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

	// [star number, start time, progression]
	this.selectionAnimation = [];
}

PlayerState.prototype.newSelection = function (starId) {
	this.previousSelectedStar = this.selectedStar;
	this.selectedStar = starId;

	if (this.selectionAnimation.length > 0) {
		this.selectionAnimation[this.selectionAnimation.length - 1][1] = globalTimer;
	}

	if (this.selectedStar >= 0) {
		this.selectionAnimation.push([this.selectedStar, globalTimer, 0]);
	}
};

// Called when the mouse state changes
PlayerState.prototype.update = function () {
	// Update animation
	for (var i = this.selectionAnimation.length - 1; i >= 0 ; i--) {
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
		var radiusStar2 =	Math.pow(mouse.worldX - net.starList[j].x, 2) +
							Math.pow(mouse.worldY - net.starList[j].y, 2);

		if (radiusStar2 < Math.pow(net.starList[j].radius * 1.5 + 10 / playerstate.scale, 2)) {
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
	if (this.hoveredStar < 0 && mouse.isMouseDown) {
		delta = Math.pow(mouse.lastClickedX - mouse.x, 2) + Math.pow(mouse.lastClickedY - mouse.y, 2);

		if (delta < 2) {
			this.newSelection(-1);
			this.clickedStar = -1;
		}
	}

	// Is the mouse still dragging ?
	if (!mouse.isMouseDown) {
		if (this.dragging && this.hoveredStar >= 0 &&
			this.selectedStar >= 0 && this.hoveredStar != this.selectedStar) {
			// TODO REQUEST
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

	// If the playerstate whishes to, a ship is sent
	if (this.clickedStar >= 0 && this.previousClickedStar >= 0 &&
		this.previousClickedStar != this.clickedStar && net.starList[this.previousClickedStar].id == this.id) {
		var p = net.starList[this.previousClickedStar].points;

		if (p > 0) {
			// TODO REQUEST
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
		var radiusSat2 =	Math.pow(mouse.worldX - net.satelliteList[k].x, 2) +
							Math.pow(mouse.worldY - net.satelliteList[k].y, 2);

		if (radiusSat2 < Math.pow(net.satelliteList[k].radius * 1.5 + 10 / playerstate.scale, 2)) {
			this.hoveredSatellite = k;
			k = net.nSatellites; // Stop loop
		}
	}
};

// If the playerstate is not willing to drag, change the view
PlayerState.prototype.mouseDownMoved = function (mouseDeltaX, mouseDeltaY) {
	if (!this.dragging) {
		this.centerX += mouseDeltaX / this.scale;
		this.centerY += mouseDeltaY / this.scale;
	}
};
