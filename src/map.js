var CHUNK_SIZE = 64;

var layer1 = {};
var layer2 = {};

var Map = {

	//reference function for now
	tileToChunkOffset: function (x, y) {
		var cx = Math.floor(x / CHUNK_SIZE);
		var cy = Math.floor(y / CHUNK_SIZE);

		var offsetx = x - cx * CHUNK_SIZE;
		var offsety = y - cy * CHUNK_SIZE;

	},

	generateTerrainChunk: function (key, cx, cy) {
		var map = layer1[key] = [];

		//initialise the array
		for (var x = 0; x < CHUNK_SIZE; ++x) {
			map[x] = [];
		}

		//generate objects
		for (var x = 0; x < CHUNK_SIZE; ++x) {
			for (var y = 0; y < CHUNK_SIZE; ++y) {
				var realx = cx * CHUNK_SIZE + x;
				var realy = cy * CHUNK_SIZE + y;

				var lvl = Terrain.generatePosition(realx, realy);
				var layer = Terrain.getLayer(lvl);

				var luck = Math.random();

				if (layer === "LAND" && luck < 0.01) {
					Generator.tree(map, x, y);
				}
			}
		}

		return map;
	},

	initUserland: function (key) {
		var map = layer2[key] = [];

		//initialise the array
		for (var x = 0; x < CHUNK_SIZE; ++x) {
			map[x] = [];
		}
	},

	getChunk: function (layer, cx, cy) {
		var map = (layer === 1) ? layer1 : layer2;
		var key = cx + "," + cy;
		var chunk = map[key];

		if (!chunk) {
			var terrain = this.generateTerrainChunk(key, cx, cy);
			var userland = this.initUserland(key);

			//return the requested layer
			chunk = (layer === 1) ? terrain : userland;
		}

		return chunk;
	}

};