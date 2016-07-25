/*
Map generation using Delaunay Triangulation
*/
delaunayMapGeneration = function (nPoints, density, sparsity) {
	var size = Math.sqrt(nPoints) * engine.options.minDistBetweenStars * (1 - density);
	size = gameConstants.mapSize;
	var nSat = parseInt(nPoints * 1.0);

	var pointSet = [];
	var edgeSet = [];

	if (nPoints > Math.pow(size / engine.options.minDistBetweenStars, 2)) {
		console.log("Attention, might not finish...");
	}

	// Generate the initial set (ugly, but why not ?)
	var n = 0;
	var x, y;
	var distMin2 = Math.pow(engine.options.minDistBetweenStars, 2);
	var r2;

	while (n < nPoints) {
		x = parseInt(size * Math.random());
		y = parseInt(size * Math.random());
		var isOk = true;

		for (var k = 0; k < pointSet.length; k++) {
			r2 = Math.pow(pointSet[k].x - x, 2) + Math.pow(pointSet[k].y - y, 2);

			if (r2 < distMin2) {
				isOk = false;
			}
		}

		if (isOk) {
			pointSet.push(new Vertex(x, y));
		}

		n++;
	}

	var T = delaunayTriangulation(pointSet);

	// Create the edge set
	for (var j = 0; j < T.length; j++) {
		edgeSet.push(new Edge(T[j].v0, T[j].v1));
		edgeSet.push(new Edge(T[j].v1, T[j].v2));
		edgeSet.push(new Edge(T[j].v2, T[j].v0));
	}

	edgeSet = removeDoubleEdges(edgeSet);

	// Remove some points
	var idToRemoveList = [];

	var radius2 = (size * 0.45) * (size * 0.45);

	// Forming a circle
	for (var s = 0; s < pointSet.length; s++) {
		r2 = Math.pow(pointSet[s].x - size * 0.5, 2) + Math.pow(pointSet[s].y - size * 0.5, 2);

		if (r2 > radius2) {
			idToRemoveList.push(s);
		}
	}

	var nPointsToRemove = parseInt(sparsity * pointSet.length);
	var len = pointSet.length;

	for (var q = 0; q < nPointsToRemove; q++) {
		idToRemoveList.push(parseInt(Math.random() * len));
	}

	idToRemoveList.sort(function (a, b) { return b - a; });

	// Remove the vertices and edges
	for (var p = 0; p < idToRemoveList.length; p++) {
		var id = idToRemoveList[p];

		for (var l = 0; l < edgeSet.length; l++) {

			if (edgeSet[l].v0 === pointSet[id] ||
				edgeSet[l].v1 === pointSet[id]) {
				edgeSet.splice(l, 1);
			}
		}

		pointSet.splice(id, 1);
	}

	// Generate the actual map
	var currentStarId;

	function callbackStar(starId) {
		currentStarId = starId;
	}

	for (var m = 0; m < pointSet.length; m++) {
		engine.addStar(pointSet[m].x,
						pointSet[m].y,
						parseInt(Math.random() * 10), // count
						playerIdList[parseInt(Math.random() * 3)], // PlayerId
						callbackStar);
		pointSet[m].id = currentStarId;
	}

	for (m = 0; m < edgeSet.length; m++) {
		engine.addLink(edgeSet[m].v0.id, // from
						edgeSet[m].v1.id); // to
	}

	// Create satellites
	var createdSatellites = []; // x, y, count

	for (var i = 0; i < nSat; i++) {
		x = parseInt(size * Math.random());
		y = parseInt(size * Math.random());
		var count = 2 + parseInt(Math.random() * 3);

		for (s in engine.game) {

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

	for (j = 0; j < createdSatellites.length; j++) {
		engine.addSatellite(createdSatellites[j][0],
							createdSatellites[j][1],
							createdSatellites[j][2]);
	}
};
