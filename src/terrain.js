//this value scales the perline noise. The bigger the number
//the bigger the terrain.
var SCALE = 90;

var terrainCache = {};

var Terrain = {
	generatePosition: function (x, y) {
		var key = x + "," + y;
		if (terrainCache[key])
			return terrainCache[key];

		var lvl = PerlinNoise.noise(
			x / SCALE * 1.5, 
			y / SCALE * 1.5,
			1
		);

		var lvl2 = PerlinNoise.noise(
			x / 20, 
			y / 20,
			1
		);

		var lvl3 = PerlinNoise.noise(
			x / 5, 
			y / 5,
			1
		);

		//take the average with more weighting
		//on the first layer
		lvl = (lvl * 4 + lvl2 * 2 + lvl3) / 7;

		terrainCache[key] = lvl;
		return lvl;
	},

	threshold: {
		DEEP_WATER: 0.36,
		WATER: 0.40,
		SHALLOW_WATER: 0.45,
		BEACH: 0.48,
		LAND: 0.60,
		ROCK: 0.7,
		SNOW: 1
	},

	getLayer: function (n) {
		var threshold = Terrain.threshold;

		if (n < threshold.DEEP_WATER)
			return "DEEP_WATER";

		if (n < threshold.WATER)
			return "WATER";

		if (n < threshold.SHALLOW_WATER)
			return "SHALLOW_WATER";

		if (n < threshold.BEACH)
			return "BEACH";

		if (n < threshold.LAND)
			return "LAND";

		if (n < threshold.ROCK)
			return "ROCK";

		if (n < threshold.SNOW)
			return "SNOW";
	},

	colors: {
		"DEEP_WATER": {r: 44, g: 131, b: 235},
		"WATER": {r: 54, g: 141, b: 255},
		"SHALLOW_WATER": {r: 146, g: 180, b: 255},
		"BEACH": {r: 255, g: 231, b: 54},
		"LAND": {r: 100, g: 200, b: 50},
		"ROCK": {r: 118, g: 118, b: 118},
		"SNOW": {r: 220, g: 230, b: 245}
	}
}