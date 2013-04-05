function randRange (min, max) {
	return Math.random() * (max - min) + min;
}

var TileTypes = {
	WOOD: 1,
	STONE: 2,
	DIRT: 3,
	TRUNK: 4,
	LEAVES: 5,
};

var Generator = {
	matrix: [],

	createMatrix: function (width, height) {
		this.matrix.length = 0;

		for (var i = 0; i < width; ++i) {
			this.matrix[i] = [];
		}

		return this.matrix;
	},

	tree: function () {
		var matrix = this.createMatrix(5, 10);

		//start trunk
		var startx = 2;
		var starty = 9;
		var endx;
		var endy = randRange(4, 6) | 0;

		
		for (; starty >= endy; --starty) {
			matrix[startx][starty] = TileTypes.TRUNK;
		}

		//start leaves
		endx = 4;
		
		for (startx = 0; startx <= endx; ++startx) {
			for (starty = 0; starty < endy; ++starty) {
				//leave some holes
				console.log(startx, starty, endx, endy)
				if (Math.random() < 0.8)
					matrix[startx][starty] = TileTypes.LEAVES;
			}
		}

		return matrix;
	}
};