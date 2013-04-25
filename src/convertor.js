/**
* Convert between the many coordinate systems
* 1. Pixel coordinate
* 2. Absolute tile coordinate
* 3. Chunk coordinate
* 4. Scroll value
*/

var Convertor = {
	px2absolute: function (x, y) {
		var tx = Math.floor(x / SIZE);
		var ty = Math.floor(y / SIZE);

		return {
			x: tx,
			y: ty
		};
	},

	px2chunk: function (x, y) {
		var tx = Math.floor(x / SIZE);
		var ty = Math.floor(y / SIZE);
		var cx = Math.floor(tx / CHUNK_SIZE);
		var cy = Math.floor(ty / CHUNK_SIZE);

		var offsetx = tx - cx * CHUNK_SIZE;
		var offsety = ty - cy * CHUNK_SIZE;
		var key = cx + "," + cy;

		return {
			key: key,
			x: offsetx,
			y: offsety,
			cx: cx,
			cy: cy
		}
	},

	tile2chunk: function (x, y) {
		var cx = Math.floor(x / CHUNK_SIZE);
		var cy = Math.floor(y / CHUNK_SIZE);

		var offsetx = x - cx * CHUNK_SIZE;
		var offsety = y - cy * CHUNK_SIZE;
		var key = cx + "," + cy;

		return {
			key: key,
			x: offsetx,
			y: offsety,
			cx: cx,
			cy: cy
		}
	},

	tile2px: function (x, y) {
		return {
			x: x * SIZE + Player.pixelX - half_screen_w,
			y: y * SIZE + Player.pixelY - half_screen_h
		}
	},

	chunk2px: function (cx, cy, x, y) {
		console.log(cx, cy, x, y)
		return {
			x: (cx * CHUNK_SIZE + x) * SIZE - Player.pixelX + half_screen_w,
			y: (cy * CHUNK_SIZE + y) * SIZE - Player.pixelY + half_screen_h
		}
	},

	chunk2tile: function (cx, cy, x, y) {
		return {
			x: cx * CHUNK_SIZE + x + Player.pixelX + half_screen_w,
			y: cy * CHUNK_SIZE + y + Player.pixelY + half_screen_h
		}
	}
}