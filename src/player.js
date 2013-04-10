var Player = {
	x: 0, //x position in the world
	y: 0, //y position in the world
	realx: 0, //pixel position
	realy: 0, //pixel position
	w: SIZE,
	h: SIZE * 3,

	player: true,

	draw: function (ctx) {
		var startx = (w * SIZE - SIZE) / 2 - offsetx;
		var starty = (h / 2 | 0) * SIZE - SIZE - offsety;
		//console.log(startx, offsetx, starty, offsety)
		ctx.fillStyle = "red";
		ctx.fillRect(startx, starty, SIZE, SIZE);

		ctx.fillStyle = "pink";
		ctx.fillRect(startx, starty + SIZE, SIZE, SIZE);

		ctx.fillStyle = "grey";
		ctx.fillRect(startx, starty + SIZE * 2, SIZE, SIZE);
	}
}

scrollTo();