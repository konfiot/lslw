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

function generateMap(nStars) {
	var avgRadius = 250;
	var surroundingStar = [[0, 0, 0, []]]; // x, y, id, links angles
	var createdStar = [[0, 0, 0]];
	var createdLinks = [];
	
	var c = 1;
	while (c < nStars && surroundingStar.length > 0) {
		// Pick up a star in the surrounding
		currentStar = surroundingStar[0];
		
		// Decide how many links are coming from this star
		var N = Math.max(numberOfLinks() - currentStar[3].length, 0);
		var takenDirs = currentStar[3];
		
		// For each link, create a star
		for (var i = 0; i < N; i++) {
			var dir = chooseDirection(takenDirs); // Angle in rad
			
			if (dir >= 0) {
				takenDirs.push(dir);
				var radius = avgRadius * (1 + Math.random() * 0.2);
				
				// Solve conflicts
				dir = checkDirAvailable(dir, radius, currentStar, createdStar);
				
				// Add the star and the link if possible
				if (dir > 0) {
					var x = currentStar[0] + radius * Math.cos(dir);
					var y = currentStar[1] + radius * Math.sin(dir);
					
					surroundingStar.push([x, y, c, [Math.PI + dir]]);
					createdStar.push([x, y, c]);
					createdLinks.push([currentStar[2], c]);
					c++;
					
					if (c >= nStars) {
						break;
					}
				} else {
					createdLinks.push([currentStar[2], -dir]);
				}
			}
		}
		
		surroundingStar.splice(0, 1);
	}
	
	// Generate the actual map
	for (var k = 0; k < createdStar.length; k++) {
		var s = createdStar[k]
		engine.addStar(s[0],
						s[1],
						parseInt(Math.random() * 10),
						parseInt(Math.random() * 3), // To change
						s[2]);
	}
	
	for (k = 0; k < createdLinks.length; k++) {
		var l = createdLinks[k];
		engine.addLink(l[0],
						l[1],
						nStars + 1 + k);
	}
}

// Returns the direction if not near a star. If close to another star, returns its id
function checkDirAvailable(dir, radius, currentStar, createdStar) {
	var x = currentStar[0] + radius * Math.cos(dir);
	var y = currentStar[1] + radius * Math.sin(dir);

	minRadius = 150 * 150;
	minStar = -1;
	
	for (var i = 0; i < createdStar.length; i++) {
		r2 = Math.pow(createdStar[i][0] - x, 2) + Math.pow(createdStar[i][1] - y, 2);
		
		if (r2 < minRadius) {
			minStar = i;
			minRadius = r2;
		}
	}
	
	if (minStar < 0) {
		return dir;
	} else {
		return -minStar;
	}	
}

function numberOfLinks() {
	var r = Math.random();
	var N = 3;
	
	if (r < 0.1) {
		N = 5
	} else if (r < 0.5) {
		N = 4
	}
	
	return N;
}

// Choose another direction far enough from previous ones
function chooseDirection(dirs) {
	var D = 30;
	var r = Math.random() * 2 * Math.PI / D;
	var possibleDirs = [];
	
	for (var i = 0; i < D; i++) {
		var newDir = 2 * Math.PI / D * i + r;
		var availableDir = true;

		for (var d = 0; d < dirs.length; d++) {
			var angle = Math.abs(dirs[d] - newDir) % (Math.PI * 2)
			if (Math.min(angle, Math.PI - angle) < Math.PI / 4) {
				availableDir = false;
			}
		}
		
		if (availableDir) {
			possibleDirs.push(newDir);
		}
	}

	var N = possibleDirs.length;

	if (N > 0) {
		return possibleDirs[parseInt(Math.random() * N)];
	} else {
		return -1;
	}
}