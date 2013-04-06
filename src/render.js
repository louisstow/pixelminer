
//setup the global canvas
var globalCanvas = new Canvas({id: "canvas"})

var SIZE = 18;

var w = 1 + globalCanvas.element.width / SIZE | 0;
var h = 1 + globalCanvas.element.height / SIZE | 0;

var offscreen = new Canvas({
	width: w,
	height: h
});

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
			
			if (gen < deepblue) { //deep blue
				r = 44;
				g = 131;
				b = 235;
			} else if (gen < blue) { //blue
				r = 54;
				g = 141;
				b = 255;
			} else if (gen < lightblue) { //light blue
				r = 146;
				g = 180;
				b = 255;
			} else if (gen < beach) { //beach
				r = 255;
				g = 231;
				b = 54;			
			} else if (gen < grass) { //grass
				r = 100;
				g = 200;
				b = 50;
			} else if (gen < brown) { //brown
				r = 118;
				g = 118;
				b = 118	;

				var resource = Math.random();
				if (resource < 0.02) {
					r = 180;
					g = 170;
					b = 80;
				} else if (resource < 0.1) {
					//coal
					r = 30;
					g = 20;
					b = 30;
				}
			} else if (gen < 255) { //snow
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

var currentx = 0;
var currenty = 0;
var speed = 1;
generate(currentx, currenty);
drawPlayer();

window.addEventListener("keydown", function (e) {
	if (e.keyCode === 37 || e.keyCode === 65)
		currentx -= speed;
	if (e.keyCode === 39 || e.keyCode === 68)
		currentx += speed;
	if (e.keyCode === 38 || e.keyCode === 87)
		currenty -= speed;
	if (e.keyCode === 40 || e.keyCode === 83)
		currenty += speed;

	generate(currentx | 0, currenty | 0);
	drawPlayer();
}, false);