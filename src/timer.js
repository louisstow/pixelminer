//obligatory shim layer for rAF
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.msRequestAnimationFrame	 ||
          window.oRequestAnimationFrame 	 ||
          function (callback) {
            window.setTimeout(callback, 1000 / 60);
          };
})();

var FPS = 50;
var loops = 0;
var skipTicks = 1000 / FPS;
var maxFrameSkip = 2; //maximum frames to drop
var nextGameTick = Date.now();
var lastGameTick = null;

var currentFrame = 0;

var Timer = new (Spineless.Event.extend({
	FPS: FPS,
	_ticks: [],
	_renders: [],
	
	start: function () {
		//start the render loop
		(function renderLoop () {
			window.requestAnimFrame(renderLoop);
			Timer.step();
		})();
	},

	stop: function () {

	},

	step: function() {
		var now = Date.now();

		this.emit("tick", now - lastGameTick, ++currentFrame);
		lastGameTick = now;

		this.emit("render");
	}
}));