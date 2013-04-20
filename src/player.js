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

Input.onSelect(function (x, y) {
	x += Player.pixelX - half_screen_w;
	y += Player.pixelY - half_screen_h;

	var a = Player.pixelX - x;
	var b = Player.pixelY - y;
	var distance = Math.floor(Math.sqrt(a * a + b * b) / SIZE);
	
	if (distance < Player.reach) {
		var tile = Map.getTileAtPoint(x, y);
		
		if (typeof tile.tile === "number") {
			Inventory.addItem(tile.tile, 1);
			Map.remove(tile.map, tile.key, tile.offsetx, tile.offsety);
			doDraw = true;
		}
		
	}
});