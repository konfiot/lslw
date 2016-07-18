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

	var linksToRemove = parseInt(sparsity * edgeSet.length);
	var l = 0;

	while (l < linksToRemove) {
		var index = parseInt(Math.random(edgeSet.length));

		edgeSet.splice(index, 1);

		l++;
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
