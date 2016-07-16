/*
Here goes the map generator.
*/
generateStars = function (size) {
	var k = 0;

	for (var i = -size + 1; i < size; i++) {
		for (var j = -size + 1; j < size; j++) {
			engine.addStar(parseInt(350 * (i + Math.random() * 0.5 - 0.25)),
							parseInt(350 * (j + Math.random() * 0.5 - 0.25)),
							parseInt(Math.random() * 10),
							parseInt(Math.random() * 3),
							k);
			k++;
		}
	}
};

generateSatellites = function (nSat, size) {
	var k = 100;

	for (var i = 0; i < nSat; i++) {
		engine.addSatellite(parseInt((Math.random() * 2 - 1) * size),
							parseInt((Math.random() * 2 - 1) * size),
							parseInt(Math.random() * 3 + 2),
							k);
		k++;
	}
};
