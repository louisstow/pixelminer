function randRange (min, max) {
	return Math.random() * (max - min) + min;
}

var TileTypes = {
	WOOD: 1,
	STONE: 2,
	DIRT: 3,
	TRUNK: 4,
	LEAVES: 5,
	COAL: 6,
	GOLD: 7
};

var Generator = {

	tree: function (matrix, x, y) {
		var w = 5;
		var h = 10;

		if (x > (64 - w) || y > (64 - h))
			return;

		//start trunk
		var startx = 2;
		var starty = 9;
		var endx;
		var endy = randRange(4, 6) | 0;

		
		for (; starty >= endy; --starty) {
			matrix[startx + x][starty + y] = TileTypes.TRUNK;
		}

		//start leaves
		endx = 4;
		
		for (startx = 0; startx <= endx; ++startx) {
			for (starty = 0; starty < endy; ++starty) {
				//leave some holes
				if (Math.random() < 0.8) {
					matrix[startx + x][starty + y] = TileTypes.LEAVES;					
				}
			}
		}

		return matrix;
	}
};