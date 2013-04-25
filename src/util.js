function randRange (min, max) {
	return Math.random() * (max - min) + min;
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


//interpolate the color values
function lerp (start, end, v) {
	return start + (end - start) * v;
}