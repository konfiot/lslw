/*
The network is made of interconnected stars. This handles the lists of relevant items
and updates the networks's state
*/
function Network(size) {
	this.mapSize = 1000;
	this.size = size;
	this.nSatellites = 50;

	// Initialize the network of stars
	this.starList = generateStars(this.size);
	this.satelliteList = generateSatellites(this.nSatellites, this.mapSize);

	this.nStars = this.starList.length;

	colorList.push(["hsl(180, 0%, 51%)", "hsl(180, 0%, 67%)"],
						generateColor(220), generateColor(100));

	// Contains the connexions
	this.connexionList = [];

	// var c = computeBridge(this.starList[0], this.starList[1])
	// start star, end star, val, proportion, length, theta, id
	this.shipList = [];

	// x, y, value

	this.automationList = [];

	this.addNewShip = function (s1, s2, val) {
		var star1 = this.starList[s1];
		var star2 = this.starList[s2];

		var dx = star2.x - star1.x;
		var dy = star2.y - star1.y;
		var L = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
		var c = star1.radius / L;
		var id = star1.id;

		var theta = Math.acos(dx / L);

		if (dy < 0) {
			theta = -theta;
		}

		this.shipList.push([s1, s2, val, c, L, theta, id]);
	};
}

Network.prototype.update = function (dt) {
	// Compute the new advancement of the ships, plus the conquest mechanic

	for (var i = this.shipList.length - 1; i >= 0; i--) {
		// New proportion of the segment crossed
		var c = this.shipList[i][3] + shipSpeed * dt / this.shipList[i][4];

		if (c < (this.shipList[i][4] - this.starList[this.shipList[i][1]].radius) / this.shipList[i][4]) {
			this.shipList[i][3] = c;
		} else {
			var p = this.starList[this.shipList[i][1]].points;
			var star1 = this.starList[this.shipList[i][0]];
			var star2 = this.starList[this.shipList[i][1]];

			// Both stars belong to the same player

			if (star1.id == star2.id) {
				star2.setPoints(p + this.shipList[i][2]);
			} else {
				var q = p - this.shipList[i][2];

				// The star is attacked, if the score is neg, the star is conquered

				if (q < 0) {
					star2.setPoints(-q - 1);
					star2.id = this.shipList[i][6];
				} else {
					star2.setPoints(q);
				}
			}

			this.shipList.splice(i, 1);
		}
	}
};
