/*
Here goes the map generator.
*/

generateStars = function(size) {
	starList = [];
	for (var i = -size+1; i < size; i++) {
		for (var j = -size+1; j < size; j++) {
			starList.push(new Star(	parseInt(Math.random() * 3),
									parseInt(350 * (i + Math.random() * 0.5 - 0.25)),
									parseInt(350 * (j + Math.random() * 0.5 - 0.25)),
									parseInt(Math.random() * 10))	);
		}
	}
	return starList;
};

generateSatellites = function(nSat, size) {
	satelliteList = [];
	for (var i = 0; i < nSat; i++) {
		satelliteList.push(new Satellite(parseInt((Math.random() * 2 - 1) * size),
							parseInt((Math.random() * 2 - 1) * size),
							parseInt(Math.random() * 3 + 2)));
	}
	return satelliteList;
};
