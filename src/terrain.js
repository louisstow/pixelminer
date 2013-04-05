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
	}
}