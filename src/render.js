//pre randomize noise values
var noise = [];
for (var x = 0; x < 50; ++x) {
	noise[x] = Math.random();
}

//render to an offscreen canvas
var offscreen = new Canvas({
	width: w,
	height: h
});

var imgData = offscreen.context.createImageData(w, h);
var data = imgData.data;

//top left absolute tile position
var currentx = 0;
var currenty = 0;

/**
* Main Renderer object
*/
var Renderer = {
	doDraw: true,

	needsRender: function () {
		Renderer.doDraw = true;
	},

	offsetx: 0,
	offsety: 0,

	/**
	* Generate a chunk of terrain and render
	* to an offscreen canvas.
	*/
	generate: function (xref, yref) {
		for (var x = 0; x < w; ++x) {
			for (var y = 0; y < h; ++y) {
				//generate normalized position
				var lvl = Terrain.generatePosition(x + xref, y + yref);

				var index = (y * w + x) * 4;
				
				//grab the color
				var terrain = Terrain.getLayer(lvl);
				var color = Terrain.colors[terrain];
				
				var diff = lvl * 150 - 75;

				var noisekey = Math.abs((x + xref) * (y + yref)) % noise.length;
				var dither = noise[noisekey] * 10 - 5;

				data[index] = (color.r + diff + dither);
				data[++index] = (color.g + diff  + dither);
				data[++index] = (color.b + diff + dither);
				data[++index] = 255;
			}
		}

		offscreen.context.putImageData(imgData, 0, 0);
		globalCanvas.context.drawImage(offscreen.element, 0, 0, w, h, 0, 0, w * SIZE, h * SIZE);
	},

	/**
	* Render every chunk visible in the viewport
	* and all the objects inside it.
	*/
	renderChunks: function (x, y) {
		//top left chunk
		var cx0 = Math.floor(x / CHUNK_SIZE);
		var cy0 = Math.floor(y / CHUNK_SIZE);

		//bottom right chunk
		var cx1 = Math.floor((x + w) / CHUNK_SIZE);
		var cy1 = Math.floor((y + h) / CHUNK_SIZE);

		var drawList = [];

		//all the chunks inbetween
		for (var cx = cx0; cx <= cx1; ++cx) {
			for (var cy = cy0; cy <= cy1; ++cy) {
				Map.getChunk(1, cx, cy);

				//clone the draw list 
				var copy = Map.getMetadata(cx, cy);

				for (var i = 0; i < copy.length; ++i) {
					var obj = copy[i];
					//console.log(obj.realx)
					if (obj.pixelX + obj.pixelW < (Player.pixelX - half_screen_w) ||
						obj.pixelY + obj.pixelH < (Player.pixelY - half_screen_h) ||
						obj.pixelX > (Player.pixelX + half_screen_w) ||
						obj.pixelY > (Player.pixelY + half_screen_h)) {
						continue;
					}

					drawList.push(obj);
				}

				//only add to the list ONCE
				if (!Player.drawn) {
					drawList.push(Player);
					Player.drawn = true;
				}
			}
		}

		//sort based on pixel position
		drawList.sort(function (a, b) {
			return (a.pixelY + a.pixelH) - (b.pixelY + b.pixelH);
		});

		//render the draw list in order
		for (var i = 0; i < drawList.length; ++i) {
			Renderer.renderObj(drawList[i], x, y);
		}
	},

	/**
	* Render individual objects
	*/
	renderObj: function (obj, x, y) {
		var oh = obj.y + obj.h;
		var ow = obj.x + obj.w;
		
		//execute the draw function instead
		if (typeof obj.draw === "function") {
			obj.draw(globalCanvas.context);
			return;
		}

		var chunk = Map.getChunk(1, obj.cx, obj.cy);

		for (var ox = obj.x; ox < ow; ++ox) {
			for (var oy = obj.y; oy < oh; ++oy) {
				//check the block exists in this chunk
				var block = chunk[ox] && chunk[ox][oy];
				
				//skip if no tile here
				if (!block && !obj.color) { 
					continue; 
				}
				
				var realx = obj.cx * CHUNK_SIZE + ox;
				var realy = obj.cy * CHUNK_SIZE + oy;

				var pixelx = (realx - x) * SIZE;
				var pixely = (realy - y) * SIZE;

				var color = Tile.get(block.id).color || obj.color;

				//convert to hash, prob better to set to rgb()
				if (typeof color === "object") {
					color = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
				}

				globalCanvas.context.fillStyle = color;
				globalCanvas.context.fillRect(pixelx, pixely, SIZE, SIZE);
			}
		}
	},

	/**
	* Main render function. Handles the smooth
	* scrolling values and determines what
	* to regenerate.
	*/
	render: function () {
		var doRender = false;
		var x = Player.pixelX - half_screen_w;
		var y = Player.pixelY - half_screen_h;

		//check if we're in a new tile
		if (Math.floor(x / SIZE) !== currentx) {
			currentx = Math.floor(x / SIZE);
			doRender = true;
		}

		if (Math.floor(y / SIZE) !== currenty) {
			currenty = Math.floor(y / SIZE);
			doRender = true;
		}
		
		//if so, generate that terrain position first
		if (doRender) { 
			Renderer.generate(currentx, currenty); 
		}

		//reset the player
		Player.drawn = false;
		
		var modx = x % SIZE;
		var mody = y % SIZE;
		var offsetx = -1 * ((SIZE + modx) % SIZE);
		var offsety = -1 * ((SIZE + mody) % SIZE);
		Renderer.offsetx = offsetx;
		Renderer.offsety = offsety;

		//draw the offscreen canvas to the main canvas
		globalCanvas.context.save();
		globalCanvas.context.translate(offsetx, offsety);
		globalCanvas.context.drawImage(
			offscreen.element, 
			0, 
			0, 
			w, 
			h, 
			0, 
			0, 
			w * SIZE, 
			h * SIZE
		);

		//render all the objects on top
		Renderer.renderChunks(currentx, currenty);
		globalCanvas.context.restore();
	}
};


Timer.render(function () {
	if (Renderer.doDraw) {
		Renderer.render();
		Renderer.doDraw = false;
	}
});

//initalisiation stuff
Timer.start();
Renderer.render();
