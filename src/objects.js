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
				matrix[startx + x - this.anchorX][starty + y - this.anchorY] = TileTypes.TRUNK;
			}

			//start leaves
			endx = 4;
			
			for (startx = 0; startx <= endx; ++startx) {
				for (starty = 0; starty < endy; ++starty) {
					//leave some holes
					if (Math.random() < 0.9) {
						matrix[startx + x - this.anchorX][starty + y - this.anchorY] = TileTypes.LEAVES;					
					}
				}
			}

			return matrix;
		}
	},

	coal: {
		template: [
			[[TileTypes.COAL]]
		],
		placement: ["ROCK"],
		luck: 0.05
	},

	gold: {
		template: [
			[[TileTypes.GOLD]]
		],
		placement: ["ROCK"],
		luck: 0.005
	}
};