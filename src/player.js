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

		var dist = ((x - sx) * (x - sx)) + ((y - sy) * (y - sy));
		if (dist > reach) {
			return false;
		}

		//only visit one tile away
		if (x !== sx && y !== sy) {
			var val = cb(x, y);
			if (val) return val;
		}

		if (error > 0) {
			x += x_inc;
			error -= dy;
		} else if (error < 0) {
			y += y_inc;
			error += dx;
		} else {
			x += x_inc;
			error -= dy;
			y += y_inc;
			error += dx;
			n--;
		}
	}

	return false;
}

//keep the timer of the tile to destroy
var toDestroy = null;
var tileDestroy = null;
var tweenFunc;

Input.on("start", function (x, y) {
	x += Player.pixelX - half_screen_w;
	y += Player.pixelY - half_screen_h;

	//check the first tile in the line of sight
	var location = lineOfSight(
		Player.pixelX + SIZE / 2, 
		Player.pixelY + SIZE,
		x,
		y,
		Player.reach * SIZE,
		Map.getTileAtPoint
	);

	if (location) {
		var tileData = Tile.get(location.tile.id);
		var timeout = tileData.strength * 1000;

		//must hold down
		toDestroy = setTimeout(function () {
			Inventory.addItem(location.tile.id, 1);
			Map.remove(location.map, location.key, location.offsetx, location.offsety);
			doDraw = true;	
		}, timeout);

		var startTime = Date.now();
		var timeInc = timeout / CRACK_FRAMES;
		var futureTime = startTime + timeInc;
		var damage = 0;

		tileDestroy = location.tile;
		tileDestroy.damage = 0;
		doDraw = true;

		tweenFunc = function () {
			var now = Date.now();
			if (now > futureTime) {
				console.log(damage)
				damage++;
				futureTime = now + timeInc;
				location.tile.damage = damage;
				doDraw = true;
			}

			if (damage > CRACK_FRAMES) {
				Timer.off("tick", tweenFunc);
			}
		};

		Timer.on("tick", tweenFunc);
	}
});

Input.on("end", function (x, y) {
	//if let go before the timeout,
	//cancel the timeout
	if (toDestroy !== null) {
		clearTimeout(toDestroy);
		toDestroy = null;
		Timer.off("tick", tweenFunc);
		delete tileDestroy.damage;
		tileDestroy = null;
		doDraw = true;
	}
});