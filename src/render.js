
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
document.body.appendChild(offscreen.element);

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

	drawChunks(data, xref, yref);

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
	{r: 180, g: 170, b: 80} //gold
]

function drawChunks (data, x, y) {
	//top left chunk
	var cx0 = Math.floor(x / 64);
	var cy0 = Math.floor(y / 64);

	//bottom right chunk
	var cx1 = Math.floor((x + w) / 64);
	var cy1 = Math.floor((y + h) / 64);

	//all the chunks inbetween
	for (var cx = cx0; cx <= cx1; ++cx) {
		for (var cy = cy0; cy <= cy1; ++cy) {
			var chunk = Map.getChunk(1, cx, cy);

			for (var relx = 0; relx < 64; ++relx) {
				for (var rely = 0; rely < 64; ++rely) {
					//got a block. now where to put it?
					try {
						if (chunk[relx][rely]) {
							var realx = cx * 64 + relx;
							var realy = cy * 64 + rely;

							var pixelx = realx - x;
							var pixely = realy - y;

							if (pixelx >= w || pixely >= h || pixelx < 0 || pixely < 0)
								continue;

							var index = (pixely * w + pixelx) * 4;
							var block = chunk[relx][rely];
							var color = TileColor[block];

							data[index] = color.r * time;
							data[++index] = color.g * time;
							data[++index] = color.b * time;
							data[++index] = color.a || 255;
						}
					} catch(e) {
						//debugger;
					}
				}
			}
		}
	}

	console.log(cx0, cy0, cx1, cy1)
}

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
	
	if (doRender) { generate(currentx, currenty); }

	
	var modx = x % SIZE;
	var mody = y % SIZE;

	var offsetx = -1 * ((SIZE + modx) % SIZE);
	var offsety = -1 * ((SIZE + mody) % SIZE);

	globalCanvas.context.drawImage(offscreen.element, 0, 0, w, h, offsetx, offsety, w * SIZE, h * SIZE);
}

var currentx = 0;
var currenty = 0;
var scrollx = 0;
var scrolly = 0;

var speed = 3;
generate(currentx, currenty);
drawPlayer();

window.addEventListener("keydown", function (e) {
	if (e.keyCode === 37 || e.keyCode === 65)
		scrollx -= speed;
	if (e.keyCode === 39 || e.keyCode === 68)
		scrollx += speed;
	if (e.keyCode === 38 || e.keyCode === 87)
		scrolly -= speed;
	if (e.keyCode === 40 || e.keyCode === 83)
		scrolly += speed;

	scrollTo(scrollx, scrolly);
	//generate(currentx | 0, currenty | 0);
	drawPlayer();
}, false);