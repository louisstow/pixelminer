function randRange (min, max) {
	return Math.random() * (max - min) + min;
}

var Generator = {

	tree: {
		width: 5,
		height: 10,
		anchorX: 2,
		anchorY: 9,
		luck: 0.01,
		placement: ["LAND"], 

		generate: function (matrix, x, y) {
			//start trunk
			var startx = 2;
			var starty = 9;
			var endx;
			var endy = randRange(4, 6) | 0;
			
			for (; starty >= endy; --starty) {
				matrix[startx + x - this.anchorX][starty + y - this.anchorY] = {
					id: tileByName.TRUNK
				};
			}

			//start leaves
			endx = 4;
			
			for (startx = 0; startx <= endx; ++startx) {
				for (starty = 0; starty < endy; ++starty) {
					//leave some holes
					if (Math.random() < 0.9) {
						matrix[startx + x - this.anchorX][starty + y - this.anchorY] = {
							id: tileByName.LEAVES
						};
					}
				}
			}

			return matrix;
		}
	},

	coal: {
		template: [
			[[tileByName.COAL]]
		],
		placement: ["ROCK"],
		luck: 0.01
	},

	gold: {
		template: [
			[[tileByName.GOLD]]
		],
		placement: ["ROCK"],
		luck: 0.005
	},

	flower: {
		template: [
			[[tileByName.ROSE, tileByName.STEM]],
			[[tileByName.TULIP, tileByName.STEM]]
		],
		placement: ["LAND"],
		luck: 0.005,
		width: 2,
		height: 2
	},

	grass: {
		width: 3,
		height: 2,
		placement: ["LAND"],
		luck: 0.02,

		template: [
			[[tileByName.STEM], [null, tileByName.STEM]],
			[[null, tileByName.STEM], [tileByName.STEM, null]],
			[[tileByName.STEM], [null, tileByName.STEM], [tileByName.STEM]]
		]	
	}
};