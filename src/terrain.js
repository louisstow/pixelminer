//this value scales the perline noise. The bigger the number
//the bigger the terrain.
var SCALE = 90; 

var Terrain = {
	generatePosition: function (x, y) {
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

		return lvl;
	},

	threshold: {
		DEEP_WATER: 0.2,
		WATER: 0.4,
		SHALLOW_WATER: 0.5,
		BEACH: 0.6,
		LAND: 0.8,
		ROCK: 0.9,
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
	}
}