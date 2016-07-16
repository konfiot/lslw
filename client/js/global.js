// Contexts
var canvas = {
	background : document.getElementById("backgroundLayer"),
	ships : document.getElementById("shipsLayer"),
	stellar : document.getElementById("stellarLayer")
};

var context = {
	background : canvas.background.getContext("2d"),
	ships : canvas.ships.getContext("2d"),
	stellar : canvas.stellar.getContext("2d")
};

var gameWindow = canvas.background.getBoundingClientRect();
var canvasMarginLeft = gameWindow.left;
var canvasMarginTop =  gameWindow.top;

for (var layer in canvas) {
	canvas[layer].width = document.body.clientWidth;
	canvas[layer].height = document.body.clientHeight;
}

// Colors
var whiteColor = "rgb(255, 255, 255)";
var whiteTransparentColor = "rgba(255, 255, 255, 0.2)";
var whiteSemiColor = "rgba(255, 255, 255, 0.6)";
var backgroundColor = "rgb(30, 8, 54)";
// var blueColor = "rgb(35, 95, 253)";
// var blueEdge = "rgb(109, 127, 255)";
var distantStarColor = "rgb(65, 15, 115)";
var colorList = [];

var T = 0;
var shipSpeed = 70; // px per second
