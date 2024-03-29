var CHUNK_SIZE = 64;

var layer1 = {};
var metadata = {}; //chunk metadata

var layer2 = {};

function checkIntersect (obj, existing) {
	for (var i = 0; i < existing.length; ++i) {
		var obj2 = existing[i];
		
		if (obj.x < (obj2.x + obj2.w) && 
			(obj.x + obj.w) > obj2.x &&
			obj.y < (obj2.y + obj2.h) &&
			(obj.y + obj.h) > obj2.y) return true;
	}

	return false;
}

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
				if (template[tx][ty] === null) { continue }
				map[x + tx - (opts.anchorX || 0)][y + ty - (opts.anchorY || 0)] = {
					id: template[tx][ty]
				};
			}
		}
	},

	remove: function (map, key, x, y) {
		delete map[key][x][y];
	},

	generateTerrainChunk: function (key, cx, cy) {
		var map = layer1[key] = [];
		var metachunk = metadata[key] = [];

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

				

				for (var objname in Generator) {
					var luck = Math.random();
					var obj = Generator[objname];
					var w = obj.w = obj.width || 1;
					var h = obj.h = obj.height || 1;
					var ax = obj.anchorX = obj.anchorX || 0;
					var ay = obj.anchorY = obj.anchorY || 0;

					//only plant if lucky enough
					if (obj.luck < luck) { continue; }

					//must be the correct terrain layer
					if (obj.placement.indexOf(layer) === -1) { continue; }

					//ensure the object will fit in the chunk
					if (x - ax < 0 || y - ay < 0  ||
						x + (w - ax) > CHUNK_SIZE ||
						y + (h - ay) > CHUNK_SIZE) { continue; }

					//final check to see if placing this will not
					//intersect existing objects
					if (checkIntersect({
							x: x - ax,
							y: y - ay,
							w: w,
							h: h
						}, metachunk)) {
						continue;
					}

					//execute the generate function
					if (typeof obj.generate === "function") {
						obj.generate(map, x, y);
					}
					else if (obj.template) {
						//randomly select a template
						var template = obj.template[obj.template.length * Math.random() | 0];
						this.place(map, x, y, template, obj);
					}

					metachunk.push({
						x: x - ax,
						y: y - ay,
						w: w,
						h: h,
						pixelW: w * SIZE,
						pixelH: h * SIZE,
						cx: cx,
						cy: cy,
						pixelX: (cx * CHUNK_SIZE + (x - ax)) * SIZE,
						pixelY: (cy * CHUNK_SIZE + (y - ay)) * SIZE,
						uuid: (Math.random() * 2000 | 0).toString(16)
					});

					break;
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
	},

	getMetadata: function (cx, cy) {
		var key = cx + "," + cy;
		return metadata[key];
	},

	getTileAtPoint: function (x, y) {
		var pos = Convertor.px2chunk(x, y);

		var obj2 = layer2[pos.key][pos.x][pos.y];
		var obj1 = layer1[pos.key][pos.x][pos.y];

		if (obj2) {
			pos.layer = 2;
			pos.tile = obj2;
			pos.map = layer2;
		} else if (obj1) {
			pos.layer = 1;
			pos.tile = obj1;
			pos.map = layer1;
		} else {
			return false;
		}

		return pos;
	}

};