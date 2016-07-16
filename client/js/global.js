// Context
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var gameWindow = canvas.getBoundingClientRect();
var canvasMarginLeft = gameWindow.left;
var canvasMarginTop =  gameWindow.top;

canvas.width = document.body.clientWidth; // document.width is obsolete
canvas.height = document.body.clientHeight; // document.height is obsolete

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
