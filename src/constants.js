//setup the global canvas
var globalCanvas = new Canvas({id: "canvas"})
var stageElement = document.getElementById("stage");

var SIZE = 18;
var w = 2 + globalCanvas.element.width / SIZE | 0;
var h = 2 + globalCanvas.element.height / SIZE | 0;
var half_w = w / 2 | 0;
var half_h = h / 2 | 0;
var screen_w = globalCanvas.element.width;
var screen_h = globalCanvas.element.height;
var half_screen_w = screen_w / 2 | 0;
var half_screen_h = screen_h / 2 | 0;

var Key = {
	A: 37,
	LEFT: 65,
	D: 29,
	RIGHT: 68,
	W: 38,
	UP: 87,
	S: 40,
	DOWN: 83
};