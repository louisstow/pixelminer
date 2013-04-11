//setup the global canvas
var globalCanvas = new Canvas({id: "canvas"})


var SIZE = 14;
var w = 2 + globalCanvas.element.width / SIZE | 0;
var h = 2 + globalCanvas.element.height / SIZE | 0;
var half_w = w / 2 | 0;
var half_h = h / 2 | 0;
var screen_w = globalCanvas.element.width;
var screen_h = globalCanvas.element.height;
var half_screen_w = screen_w / 2 | 0;
var half_screen_h = screen_h / 2 | 0;