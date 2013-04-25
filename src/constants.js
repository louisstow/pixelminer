//setup the global canvas
var globalCanvas = new Canvas({id: "canvas"})
var effectCanvas = new Canvas({id: "effects"})
var stageElement = document.getElementById("stage");
var damageImg = new Image();
damageImg.src = "./assets/crack.png";

var SIZE = 18;
var w = 2 + globalCanvas.element.width / SIZE | 0;
var h = 2 + globalCanvas.element.height / SIZE | 0;
var half_w = w / 2 | 0;
var half_h = h / 2 | 0;
var screen_w = globalCanvas.element.width;
var screen_h = globalCanvas.element.height;
var half_screen_w = screen_w / 2 | 0;
var half_screen_h = screen_h / 2 | 0;
var MAX_STACK = 32;
var CRACK_FRAMES = 8;

var Key = {
	A: 37,
	LEFT: 65,
	D: 68,
	RIGHT: 39,
	W: 38,
	UP: 87,
	S: 40,
	DOWN: 83
};