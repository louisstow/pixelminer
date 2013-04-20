var Player = {
	x: 0, //x position in the world
	y: 0, //y position in the world
	w: 1,
	h: 3,
	pixelX: 0, //pixel position
	pixelY: 0, //pixel position
	pixelW: SIZE,
	pixelH: SIZE * 3,

	reach: 5, //how many tiles can the player reach

	player: true,

	draw: function (ctx) {
		var startx = half_screen_w - offsetx;
		var starty = half_screen_h - offsety;
		//console.log(startx, offsetx, starty, offsety)
		ctx.fillStyle = "red";
		ctx.fillRect(startx, starty, SIZE, SIZE);

		ctx.fillStyle = "pink";
		ctx.fillRect(startx, starty + SIZE, SIZE, SIZE);

		ctx.fillStyle = "grey";
		ctx.fillRect(startx, starty + SIZE * 2, SIZE, SIZE);
	}
}

/**
* lineOfSight
* sx - start x
* sy - start y
* ex - end x
* ey - end y
*/
function lineOfSight (sx, sy, ex, ey, reach, cb) {
	var dx = Math.abs(ex - sx);
	var dy = Math.abs(ey - sy);

	var x = sx;
	var y = sy;

	var x_inc = (ex > sx) ? 1 : -1;
	var y_inc = (ey > sy) ? 1 : -1;

	var n = 1 + dx + dy;
	var error = dx - dy;
	dx *= 2;
	dy *= 2;

	reach *= reach; //square it so we can compare distance

	for (; n > 0; --n) {
		console.log("VISIT", x, y, n);

		var dist = ((x - sx) * (x - sx)) + ((y - sy) * (y - sy));
		if (dist > reach) {
			console.log("PAST REACH", reach, dist);
			return false;
		}

		//only visit one tile away
		if (x !== sx && y !== sy) {
			var val = cb(x, y);
			console.log(val)
			if (val) return val;
		}

		if (error > 0) {
			x += x_inc;
			error -= dy;
		} else {
			y += y_inc;
			error += dx;
		}
	}

	return false;
}

Input.onSelect(function (x, y) {
	x += Player.pixelX - half_screen_w;
	y += Player.pixelY - half_screen_h;

	//check the first tile in the line of sight
	var tile = lineOfSight(
		Player.pixelX, 
		Player.pixelY,
		x,
		y,
		Player.reach * SIZE,
		Map.getTileAtPoint
	);
	
	if (tile) {
		Inventory.addItem(tile.tile, 1);
		Map.remove(tile.map, tile.key, tile.offsetx, tile.offsety);
		doDraw = true;
	}	
});