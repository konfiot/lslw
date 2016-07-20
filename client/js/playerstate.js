/*
Handles the playerstate inputs. Understands the behavior of the playerstate
then send requests to the engine.
*/
function PlayerState(id) {
	this.id = id;

	this.hoveredStarId = -1;
	this.selectedStar = -1;
	this.clickedStar = -1;
	this.previousSelectedStar = -1;
	this.previousClickedStar = -1;
	this.isDragging = false;

	this.hoveredSatelliteId = -1;
	this.clickedSatellites = [];

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

	if (this.selectedStar !== -1) {
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

	// Update which star or which satellite is hovered
	this.hoveredStarId = -1;
	this.hoveredSatelliteId = -1;

	for (var j in engine.game) {
		var obj = engine.game[j];

		if (obj.type == "star" || (obj.type == "satellite" && obj.visible)) {
			var radius2 =	Math.pow(mouse.worldX - obj.x, 2) +
							Math.pow(mouse.worldY - obj.y, 2);

			if (radius2 < Math.pow(computeRadius(obj.type, obj.count) * 1.5 + 10 / playerstate.scale, 2)) {

				if (obj.type == "star") {
					this.hoveredStarId = j;
					break;
				} else {
					this.hoveredSatelliteId = j;
					break;
				}
			}
		}
	}

	// Update which satellite is selected
	if (mouse.isMouseDown && !this.dragging &&
		this.hoveredSatelliteId !== -1 && this.clickedSatellites.indexOf(this.hoveredSatelliteId) < 0) {

		var callbackSat = (function (id) {
			if (id !== false) {
				this.clickedSatellites.push(this.hoveredSatelliteId);
			}
		}).bind(this);

		engine.getSatellite(this.id, this.hoveredSatelliteId, this.selectedStar, callbackSat);
	}

	// Update which star is selected
	if (mouse.isMouseDown && !this.dragging && this.hoveredStarId !== -1) {
		this.previousClickedStar = this.clickedStar;
		this.clickedStar = this.hoveredStarId;

		if (engine.game[this.hoveredStarId].id === this.id) {
			this.newSelection(this.hoveredStarId);
		}
	}

	// If clicked out a star, deselect
	if (this.hoveredStarId === -1 && this.hoveredSatelliteId === -1 && mouse.isMouseDown) {
		delta = Math.pow(mouse.lastClickedX - mouse.x, 2) + Math.pow(mouse.lastClickedY - mouse.y, 2);

		if (delta < 2) {
			this.newSelection(-1);
			this.clickedStar = -1;
		}
	}

	// Is the mouse still dragging ?
	if (!mouse.isMouseDown) {

		if (this.dragging && this.hoveredStarId !== -1 &&
			this.selectedStar !== -1 && this.hoveredStarId != this.selectedStar &&
			engine.possibleTrip(this.selectedStar, this.hoveredStarId)) {
			engine.game[this.id].automation.push([this.selectedStar, this.hoveredStarId]);
			// TODO remove other connexions, remove auto
			this.newSelection(-1);
			this.clickedStar  = -1;
		}
		this.dragging = false;
	} else {
		if (this.hoveredStarId !== -1) {
			this.dragging = true;
		}
	}

	// If the playerstate whishes to, a ship is sent
	if (this.clickedStar !== -1 && this.previousClickedStar !== -1 &&
		this.previousClickedStar != this.clickedStar && engine.game[this.previousClickedStar].id == this.id) {
		var p = engine.game[this.previousClickedStar].count;

		if (p > 0) {
			engine.move(this.id, this.previousClickedStar, this.clickedStar, p);
		}

		this.newSelection(-1);
		this.clickedStar = -1;
	}
	
	// Update clicked satellites
	for (var k = this.clickedSatellites.length- 1; k >= 0; k--) {

		if (!engine.game[this.clickedSatellites[k]].visible) {
			this.clickedSatellites.splice(k, 1);
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
