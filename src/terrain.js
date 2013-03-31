var cnv = document.getElementById("canvas");
var ctx = cnv.getContext("2d");

cnv.width = window.innerWidth;
cnv.height = window.innerHeight;

ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

var offscreen = document.createElement("canvas");
var offscreenCtx = offscreen.getContext('2d');
var w = 45;
var h = 35;
offscreen.width = w;
offscreen.height = h;

var imgData = offscreenCtx.createImageData(w, h);
var data = imgData.data;

var time = 0.9;

function generate (xref, yref) {
	var shift = Math.random() * 200 | 0;
	for (var x = 0; x < w; ++x) {
		for (var y = 0; y < h; ++y) {
			var lvl = PerlinNoise.noise(
				(x + xref) / w * 1.5, 
				(y + yref) / h * 1.5,
				1
			);
			var gen = lvl * 255 | 0;
			var index = (y * w + x) * 4;
			var r = gen, b = gen, g = gen;

			if (gen < 50) { //deep blue
				r = 44;
				g = 131;
				b = 235;
			} else if (gen < 100) { //blue
				r = 54;
				g = 141;
				b = 255;
			} else if (gen < 110) { //light blue
				r = 146;
				g = 180;
				b = 255;
			} else if (gen < 120) { //beach
				r = 255;
				g = 231;
				b = 54;			
			} else if (gen < 160) { //grass
				r = 100;
				g = 200;
				b = 50;
			} else if (gen < 195) { //brown
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

	offscreenCtx.putImageData(imgData, 0, 0);
	ctx.drawImage(offscreen, 0, 0, w, h, 0, 0, cnv.width, cnv.height);
}

function drawPlayer () {
	var startx = cnv.width / 2 + 15;
	var starty = cnv.height / 2;

	ctx.fillStyle = "red";
	ctx.fillRect(startx, starty, 30, 30);

	ctx.fillStyle = "pink";
	ctx.fillRect(startx, starty + 30, 30, 30);

	ctx.fillStyle = "grey";
	ctx.fillRect(startx, starty + 60, 30, 30);
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