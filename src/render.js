

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
	
	
}

var TileColor = [
	null,
	{r: 255, g: 88, b: 7}, //wood
	{r: 150, g: 140, b: 140}, //stone
	{r: 0, g: 186, b: 0}, //dirt
	{r: 148, g: 104, b: 28}, //trunk
	{r: 37, g: 122, b: 16}, //leaves
	{r: 30, g: 20, b: 30}, //coal
	{r: 180, g: 170, b: 80}, //gold
	{r: 224, g: 27, b: 106}, //flower
	{r: 57, g: 152, b: 36}, //stem
	{r: 222, g: 242, b: 0} //tulip
];

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

	//console.log(drawList.length)
	for (var i = 0; i < drawList.length; ++i) {
		renderObj(drawList[i], x, y);
	}
}


function renderObj (obj, x, y) {
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
			
			if (!block && !obj.color) { continue; }
			
			var realx = obj.cx * CHUNK_SIZE + ox;
			var realy = obj.cy * CHUNK_SIZE + oy;

			var pixelx = (realx - x) * SIZE;
			var pixely = (realy - y) * SIZE;

			var color = TileColor[block] || obj.color;
			//convert to hash, prob better to set to rgb()
			if (typeof color === "object") {
				color = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
			}

			globalCanvas.context.fillStyle = color;
			globalCanvas.context.fillRect(pixelx, pixely, SIZE, SIZE);
		}
	}
}

function scrollTo () {
	var doRender = false;
	var x = Player.pixelX - half_screen_w;
	var y = Player.pixelY - half_screen_h;

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

	Player.drawn = false;
	
	var modx = x % SIZE;
	var mody = y % SIZE;

	offsetx = -1 * ((SIZE + modx) % SIZE);
	offsety = -1 * ((SIZE + mody) % SIZE);

	globalCanvas.context.save();
	globalCanvas.context.translate(offsetx, offsety);
	globalCanvas.context.drawImage(offscreen.element, 0, 0, w, h, 0, 0, w * SIZE, h * SIZE);

	drawChunks(currentx, currenty);
	globalCanvas.context.restore();
}

var currentx = 0;
var currenty = 0;
var scrollx = 0;
var scrolly = 0;
var offsetx = 0;
var offsety = 0;

var speed = 2;


var isDown = {};
var moved = true;

Timer.tick(function () {
	moved = false;

	if (isDown[37] || isDown[65]) {
		Player.pixelX -= speed;
		moved = true;
	}

	if (isDown[39] || isDown[68]) {
		Player.pixelX += speed;
		moved = true;
	}

	if (isDown[38] || isDown[87]) {
		Player.pixelY -= speed;
		moved = true;
	}

	if (isDown[40] || isDown[83]) {
		Player.pixelY += speed;
		moved = true;
	}
});

function getCurrentChunk () {
	console.log(
		Math.floor(currentx / CHUNK_SIZE),
		Math.floor(currenty / CHUNK_SIZE)
	);
}

Timer.render(function () {
	if (moved) scrollTo();
});

window.addEventListener("keydown", function (e) {
	isDown[e.keyCode] = true;
}, false);

window.addEventListener("keyup", function (e) {
	delete isDown[e.keyCode];
}, false);

window.addEventListener("blur", function () {
	isDown = {};
}, false);

//initalisiation stuff
Timer.start();
Math.seedrandom("hello.");
scrollTo();
