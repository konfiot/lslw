/*
Initializes the canvas. The map consist of 3 offscreen layers.
Only the required area is blited to the screen
 */

// Visible canvas
var visibleCanvas = {
	background : document.getElementById("backgroundLayer"),
	foreground : document.getElementById("foregroundLayer"),
	gui : document.getElementById("guiLayer")
}

var visibleContext = {
	background : visibleCanvas.background.getContext("2d"),
	foreground : visibleCanvas.foreground.getContext("2d"),
	gui : visibleCanvas.gui.getContext("2d")
}

for (var layer in visibleCanvas) {
	visibleCanvas[layer].width = document.body.clientWidth;
	visibleCanvas[layer].height = document.body.clientHeight;
}

var gameWindow = visibleCanvas.background.getBoundingClientRect();
var canvasMarginLeft = gameWindow.left;
var canvasMarginTop =  gameWindow.top;

// Offscreen canvas
var offCanvas = {
	ships : document.createElement("canvas"),
	stellar : document.createElement("canvas")
}

var offContext = {
	ships : offCanvas.ships.getContext("2d"),
	stellar : offCanvas.stellar.getContext("2d")
}

for (layer in offCanvas) {
	offCanvas[layer].width = gameConstants.mapSize;
	offCanvas[layer].height = gameConstants.mapSize;
}


// The satellites are drawn once //
var offSateliteCanvas = document.createElement("canvas");
var maxRadSat = 26;
offSateliteCanvas.width = 6 * maxRadSat;
offSateliteCanvas.height = 2 * maxRadSat;
var offSateliteCtx = offSateliteCanvas.getContext("2d");

// Fill the canvas with satellite sprites
offSateliteCtx.fillStyle = whiteColor;
offSateliteCtx.shadowColor = whiteColor;
offSateliteCtx.shadowBlur = 5;
offSateliteCtx.strokeStyle = whiteSemiColor;
offSateliteCtx.lineWidth = 4;

for (var a = 0; a < 3; a++) {
	var radius = 6 + 2 * a;

	offSateliteCtx.beginPath();
	offSateliteCtx.arc(maxRadSat * (2 * a + 1), maxRadSat, radius, 0, Math.PI * 2);
	offSateliteCtx.fill();
	offSateliteCtx.stroke();
}
