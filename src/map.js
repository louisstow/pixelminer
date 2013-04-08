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

	place: function (map, x, y, template, opts) {
		for (var tx = 0; tx < template.length; ++tx) {
			for (var ty = 0; ty < template[tx].length; ++ty) {
				map[x + tx - (opts.anchorX || 0)][y + ty - (opts.anchorY || 0)] = template[tx][ty];
			}
		}
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
				//calculate the actual position in the world
				var realx = cx * CHUNK_SIZE + x;
				var realy = cy * CHUNK_SIZE + y;

				//determine the terrain at this position
				var lvl = Terrain.generatePosition(realx, realy);
				var layer = Terrain.getLayer(lvl);

				var luck = Math.random();

				for (var objname in Generator) {
					var obj = Generator[objname];
					var w = obj.width || 1;
					var h = obj.height || 1;
					var ax = obj.anchorX || 0;
					var ay = obj.anchorY || 0;

					//only plant if lucky enough
					if (obj.luck < luck) { continue };

					//must be the correct terrain layer
					if (obj.placement.indexOf(layer) === -1) { continue };

					//ensure the object will fit in the chunk
					if (x - ax < 0 || y - ay < 0  ||
						x + (w - ax) > CHUNK_SIZE ||
						y + (h - ay) > CHUNK_SIZE) { continue; }

					//execute the generate function
					if (typeof obj.generate === "function") {
						obj.generate(map, x, y);
					}
					else if (obj.template) {
						//randomly select a template
						var template = obj.template[obj.template.length * Math.random() | 0];
						this.place(map, x, y, template, obj);
					}
				}

				//generate resources on rock
				// if (layer === "ROCK") {

				// 	if (luck < 0.1) {
				// 		map[x][y] = TileTypes.COAL;
				// 	}
					
				// 	if (luck < 0.01) {
				// 		map[x][y] = TileTypes.GOLD;	
				// 	}
				// }
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