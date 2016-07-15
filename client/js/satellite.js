/*
A simple structure for the satellites
*/
function Satellite(x, y, value) {
	this.x = x;
	this.y = y;
	this.value = value;
	
	this.radius = 2 + 2 * this.value;
}