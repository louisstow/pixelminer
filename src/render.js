
//setup the global canvas
var globalCanvas = new Canvas({id: "canvas"})

var SIZE = 14;

var w = 2 + globalCanvas.element.width / SIZE | 0;
var h = 2 + globalCanvas.element.height / SIZE | 0;

var offscreen = new Canvas({
	width: w,
	height: h
});

offscreen.element.id = "minimap";
document.getElementById("stage").appendChild(offscreen.element);

var imgData = offscreen.context.createImageData(w, h);
var data = imgData.data;

//unit time of day 0 to 1 exclusive.
var time = 0.9;

function generate (xref, yref) {
	var shift = Math.random() * 200 | 0;
	for (var x = 0; x < w; ++x) {
		for (var y = 0; y < h; ++y) {
			//generate normalized position
			var lvl = Terrain.generatePosition(x + xref, y + yref);

			var index = (y * w + x) * 4;
			
			var gen = lvl * 255 | 0;
			var r = gen, b = gen, g = gen;

			var deepblue = 70;
			var blue = deepblue + 40;
			var lightblue = blue + 10;
			var beach = lightblue + 10;
			var grass = beach + 30;
			var brown = grass + 30;
			
			if (lvl < Terrain.threshold.DEEP_WATER) { //deep blue
				r = 44;
				g = 131;
				b = 235;
			} else if (lvl < Terrain.threshold.WATER) { //blue
				r = 54;
				g = 141;
				b = 255;
			} else if (lvl < Terrain.threshold.SHALLOW_WATER) { //light blue
				r = 146;
				g = 180;
				b = 255;
			} else if (lvl < Terrain.threshold.BEACH) { //beach
				r = 255;
				g = 231;
				b = 54;			
			} else if (lvl < Terrain.threshold.LAND) { //grass
				r = 100;
				g = 200;
				b = 50;
			} else if (lvl < Terrain.threshold.ROCK) { //brown
				r = 118;
				g = 118;
				b = 118;
			} else if (lvl < Terrain.threshold.SNOW) { //snow
				r = 245;
				g = 220;
				b = 209;
			}
			
			var diff = lvl * 150 - 75;
			var dither = Math.random() * 10 - 5;
			data[index] = (r + diff + dither) * time;
			data[++index] = (g + diff  + dither) * time;
			data[++index] = (b + diff + dither) * time
			data[++index] = 255;
		}
	}

	

	offscreen.context.putImageData(imgData, 0, 0);
	globalCanvas.context.drawImage(offscreen.element, 0, 0, w, h, 0, 0, w * SIZE, h * SIZE);
	drawChunks(xref, yref);
	
}

var TileColor = [
	null,
	{r: 255, g: 88, b: 7}, //wood
	{r: 150, g: 140, b: 140}, //stone
	{r: 0, g: 186, b: 0}, //dirt
	{r: 148, g: 104, b: 28}, //trunk
	{r: 37, g: 122, b: 16}, //leaves
	{r: 30, g: 20, b: 30}, //coal
	{r: 180, g: 170, b: 80} //gold
];

var player = {
	x: w / 2 | 0,
	y: h / 2 | 0,
	w: 1,
	h: 3,
	tag: "player",
	color: "blue",
	static: true
};

/**
* 1. Loop over every visible chunk
* 2. Create draw-list include the player obj
* 3. Sort the draw-list by y + h
* 4. Loop draw-list, loop the layer from start (x0,y0) to end (x1,y1)
* 5. Render each tile with a fillRect
*/
function drawChunks (x, y) {
	//top left chunk
	var cx0 = Math.floor(x / CHUNK_SIZE);
	var cy0 = Math.floor(y / CHUNK_SIZE);

	//bottom right chunk
	var cx1 = Math.floor((x + w) / CHUNK_SIZE);
	var cy1 = Math.floor((y + h) / CHUNK_SIZE);

	//all the chunks inbetween
	for (var cx = cx0; cx <= cx1; ++cx) {
		for (var cy = cy0; cy <= cy1; ++cy) {
			var chunk = Map.getChunk(1, cx, cy);

			//clone the draw list
			var drawList = Map.getMetadata(cx, cy).slice(0);
			drawList.push(player);
			drawList.sort(function (a, b) {
				return (a.y + a.h) - (b.y + b.h);
			});

			renderList(drawList, chunk, x, y, cx, cy);
		}
	}

	console.log(cx0, cy0, cx1, cy1)
}

function renderList (drawList, chunk, x, y, cx, cy) {
	for (var i = 0; i < drawList.length; ++i) {
		renderObj(drawList[i], chunk, x, y, cx, cy);
	}
}

function renderObj (obj, chunk, x, y, cx, cy) {
	var oh = obj.y + obj.h;
	var ow = obj.x + obj.w;

	for (var ox = obj.x; ox < ow; ++ox) {
		for (var oy = obj.y; oy < oh; ++oy) {
			try {
			var block = chunk[ox][oy];
			} catch(e) { debugger }
			//if (obj.tag && obj.tag === "player") debugger;
			if (!block && !obj.color) { continue; }

			if (obj.static) {
				var pixelx = ox * SIZE;
				var pixely = oy * SIZE;
				console.log(pixelx, pixely)
			} else {
				var realx = cx * CHUNK_SIZE + ox;
				var realy = cy * CHUNK_SIZE + oy;
				var pixelx = (realx - x) * SIZE;
				var pixely = (realy - y) * SIZE;
			}

			//	console.log(pixelx, realx, ox, x)
			var color = TileColor[block] || obj.color;
			if (typeof color === "object") {
				color = "#" + color.r.toString(16) + color.g.toString(16) + color.b.toString(16);
			}

			globalCanvas.context.fillStyle = color;
			globalCanvas.context.fillRect(pixelx, pixely, SIZE, SIZE);
		}
	}
}

// function drawChunk (data, chunk, x, y) {
// 	for (var relx = 0; relx < CHUNK_SIZE; ++relx) {
// 		for (var rely = 0; rely < CHUNK_SIZE; ++rely) {
// 			//got a block. now where to put it?
// 			try {
// 				if (chunk[relx][rely]) {
// 					var realx = cx * CHUNK_SIZE + relx;
// 					var realy = cy * CHUNK_SIZE + rely;

// 					var pixelx = realx - x;
// 					var pixely = realy - y;

// 					if (pixelx >= w || pixely >= h || pixelx < 0 || pixely < 0) {
// 						continue;
// 					}

// 					var index = (pixely * w + pixelx) * 4;
// 					var block = chunk[relx][rely];
// 					var color = TileColor[block];

// 					data[index] = color.r * time;
// 					data[++index] = color.g * time;
// 					data[++index] = color.b * time;
// 					data[++index] = color.a || 255;
// 				}
// 			} catch(e) {
// 				//debugger;
// 			}
// 		}
// 	}
// }

function drawPlayer () {
	var startx = (w * SIZE - SIZE) / 2;
	var starty = (h / 2 | 0) * SIZE - SIZE;

	globalCanvas.context.fillStyle = "red";
	globalCanvas.context.fillRect(startx, starty, SIZE, SIZE);

	globalCanvas.context.fillStyle = "pink";
	globalCanvas.context.fillRect(startx, starty + SIZE, SIZE, SIZE);

	globalCanvas.context.fillStyle = "grey";
	globalCanvas.context.fillRect(startx, starty + SIZE * 2, SIZE, SIZE);
}

function scrollTo (x, y) {
	var doRender = false;

	if (Math.floor(x / SIZE) !== currentx) {
		currentx = Math.floor(x / SIZE);
		doRender = true;
	}

	if (Math.floor(y / SIZE) !== currenty) {
		currenty = Math.floor(y / SIZE);
		doRender = true;
	}
	
	if (doRender) { 
		generate(currentx, currenty); 
	}
	//player.x = currentx;
	//player.y = currenty;
	
	var modx = x % SIZE;
	var mody = y % SIZE;

	var offsetx = -1 * ((SIZE + modx) % SIZE);
	var offsety = -1 * ((SIZE + mody) % SIZE);

	globalCanvas.context.drawImage(offscreen.element, 0, 0, w, h, offsetx, offsety, w * SIZE, h * SIZE);

	drawChunks(currentx, currenty);
}

var currentx = 0;
var currenty = 0;
var scrollx = 0;
var scrolly = 0;

var speed = 2;
generate(currentx, currenty);

var isDown = {};

Timer.tick(function () {
	var moved = false;

	if (isDown[37] || isDown[65]) {
		scrollx -= speed;
		moved = true;
	}

	if (isDown[39] || isDown[68]) {
		scrollx += speed;
		moved = true;
	}

	if (isDown[38] || isDown[87]) {
		scrolly -= speed;
		moved = true;
	}

	if (isDown[40] || isDown[83]) {
		scrolly += speed;
		moved = true;
	}

	if (moved) {
		scrollTo(scrollx, scrolly);
	}
});

window.addEventListener("keydown", function (e) {
	isDown[e.keyCode] = true;
}, false);

window.addEventListener("keyup", function (e) {
	delete isDown[e.keyCode];
}, false);

Timer.start();