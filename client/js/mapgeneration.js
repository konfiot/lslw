/*
Map generation using Delaunay Triangulation
*/
delaunayMapGeneration = function (nPoints, density, sparsity) {
	var size = Math.sqrt(nPoints) * engine.options.minDistBetweenStars * (1 - density);

	var pointSet = [];
	var edgeSet = [];

	if (nPoints > Math.pow(size / engine.options.minDistBetweenStars, 2)) {
		console.log("Attention, might not finish...");
	}

	// Generate the initial set (ugly, but why not ?)
	var n = 0;
	var x, y;
	var distMin2 = Math.pow(engine.options.minDistBetweenStars, 2);

	while (n < nPoints) {
		x = size * (Math.random() * 2 - 1);
		y = size * (Math.random() * 2 - 1);
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

	var radius2 = (size * 0.92) * (size * 0.92);

	// Forming a circle
	for (var s = 0; s < pointSet.length; s++) {
		var r2 = Math.pow(pointSet[s].x, 2) + Math.pow(pointSet[s].y, 2);

		if (r2 > radius2) {
			idToRemoveList.push(s);
		}
	}

	var nPointsToRemove = parseInt(sparsity * pointSet.length);
	var len = pointSet.length;
	
	for (var q = 0; q < nPointsToRemove; q++) {
		idToRemoveList.push(parseInt(Math.random() * len));
	}
	
	idToRemoveList.sort(function (a, b) { return b - a });

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
};
