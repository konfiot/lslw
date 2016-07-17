/*
Here goes the map generator.
*/
generateMap = function (nStars) {
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

	var currentStarId;

	function callbackStar(starId) {
		currentStarId = starId;
	}

	// Generate the actual map
	for (var k = 0; k < createdStar.length; k++) {
		var s = createdStar[k];
		engine.addStar(s[0], // x
						s[1], // y
						parseInt(Math.random() * 10), // count
						playerIdList[parseInt(Math.random() * 3)], // PlayerId
						callbackStar);
		createdStar[k] = currentStarId;
	}

	for (k = 0; k < createdLinks.length; k++) {
		var l = createdLinks[k];

		engine.addLink(createdStar[l[0]], // from
						createdStar[l[1]]); // to
	}
};

// Returns the direction if not near a star. If close to another star, returns its id
checkDirAvailable = function (dir, radius, currentStar, createdStar) {
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
};

numberOfLinks = function () {
	var r = Math.random();
	var N = 3;

	if (r < 0.1) {
		N = 5;
	} else if (r < 0.5) {
		N = 4;
	}

	return N;
};

// Choose another direction far enough from previous ones
chooseDirection = function (dirs) {
	var D = 30;
	var r = Math.random() * 2 * Math.PI / D;
	var possibleDirs = [];

	for (var i = 0; i < D; i++) {
		var newDir = 2 * Math.PI / D * i + r;
		var availableDir = true;

		for (var d = 0; d < dirs.length; d++) {
			var angle = Math.abs(dirs[d] - newDir) % (Math.PI * 2);

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
};

generateSatellites = function (nSat, size) {
	var createdSatellites = []; // x, y, count

	for (var i = 0; i < nSat; i++) {
		var x = parseInt(size * (Math.random() * 2 - 1));
		var y = parseInt(size * (Math.random() * 2 - 1));
		var count = 2 + parseInt(Math.random() * 3);

		for (var s in engine.game) {

			// Iteration over stars to find if the future satellite is not too close
			if (engine.game[s].type === "star") {
				var dx = x - engine.game[s].x;
				var dy = y - engine.game[s].y;
				var r = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

				if (r < engine.options.satMinDist) {
					var f = engine.options.satMinDist / r;

					// Update coordinates
					x = engine.game[s].x + f * dx;
					y = engine.game[s].y + f * dy;
				}
			}
		}

		createdSatellites.push([x, y, count]);
	}

	for (var j = 0; j < createdSatellites.length; j++) {
		engine.addSatellite(createdSatellites[j][0],
							createdSatellites[j][1],
							createdSatellites[j][2]);
	}
};
