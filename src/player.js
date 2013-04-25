var Player = {
	x: 0, //x position in the world
	y: 0, //y position in the world
	w: 1,
	h: 3,
	pixelX: 0, //pixel position
	pixelY: 0, //pixel position
	pixelW: SIZE,
	pixelH: SIZE * 3,

	canMove: true,

	reach: 5, //how many tiles can the player reach
	speed: 2, //speed of the player in pixels per tick

	player: true,

	draw: function (ctx) {
		var startx = half_screen_w - Renderer.offsetx;
		var starty = half_screen_h - Renderer.offsety;
		
		ctx.fillStyle = "red";
		ctx.fillRect(startx, starty, SIZE, SIZE);

		ctx.fillStyle = "pink";
		ctx.fillRect(startx, starty + SIZE, SIZE, SIZE);

		ctx.fillStyle = "grey";
		ctx.fillRect(startx, starty + SIZE * 2, SIZE, SIZE);
	},

	allowMove: function () {
		this.canMove = true;
	},

	stopMove: function () {
		this.canMove = false;
	}
}

var moved = false;
Timer.tick(function () {
	moved = false;

	if (!Player.canMove) return;

	if (Input.isDown[Key.A] || Input.isDown[Key.LEFT]) {
		Player.pixelX -= Player.speed;
		moved = true;
	}

	if (Input.isDown[Key.D] || Input.isDown[Key.RIGHT]) {
		Player.pixelX += Player.speed;
		moved = true;
	}

	if (Input.isDown[Key.W] || Input.isDown[Key.UP]) {
		Player.pixelY -= Player.speed;
		moved = true;
	}

	if (Input.isDown[Key.S] || Input.isDown[Key.DOWN]) {
		Player.pixelY += Player.speed;
		moved = true;
	}

	if (moved) {
		Renderer.needsRender();
	}
});



//keep the timer of the tile to destroy
var toDestroy = null;
var tileDestroy = null;
var tweenFunc;
var emitter;

Input.on("start:left", function (screenx, screeny) {
	var x = screenx + Player.pixelX - half_screen_w;
	var y = screeny + Player.pixelY - half_screen_h;

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

		//get the position on the screen
		var position = Convertor.chunk2px(
			location.cx, 
			location.cy,
			location.x, 
			location.y
		);

		emitter = new ParticleEmitter();
		emitter.start({
			maxParticles: 7,
			color: tileData.color,
			spread: 30,
			x: position.x + SIZE / 2,
			y: position.y,
			life: 4,
			gravity: {x: 0, y: 0.2}
		});

		Player.stopMove();

		//must hold down
		toDestroy = setTimeout(function () {
			Inventory.addItem(location.tile.id, 1);
			Map.remove(location.map, location.key, location.x, location.y);
			doDraw = true;
			stopMining();
		}, timeout);

		tweenFunc = function () {
			//emitter.removeParticles(1);
			emitter.tick();
			effectCanvas.clear();
			effectCanvas.context.globalAlpha = 0.5;
			emitter.render(effectCanvas.context);
		};

		Timer.on("tick", tweenFunc);
	}
});

Input.on("start:right", function (x, y) {

});

function stopMining () {
	clearTimeout(toDestroy);
	
	emitter.destroy(function () {
		Timer.off("tick", tweenFunc);
		Player.allowMove()
	});
	
	Renderer.needsRender();
	toDestroy = null;
}

Input.on("end:*", function (x, y) {
	//if let go before the timeout,
	//cancel the timeout
	if (toDestroy !== null) {
		stopMining();
	}
});