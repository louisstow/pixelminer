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
		loops = 0;
		var now = Date.now();

		while (now > nextGameTick && loops < maxFrameSkip) {
			Timer.doTick(now - lastGameTick);
			this.emit("tick", now - lastGameTick);
			nextGameTick += skipTicks;
			lastGameTick = now;
			loops++;
		}

		if (loops >= maxFrameSkip) {
			nextGameTick = now;
		}

		if (loops) {
			Timer.doRender();
			this.emit("render");
		}
	},

	tick: function (cb) {
		this._ticks.push(cb);
	},

	render: function (cb) {
		this._renders.push(cb);	
	},

	doTick: function (dt) {
		for (var i = 0, l = this._ticks.length; i < l; ++i) {
			this._ticks[i](dt);
		}
	},

	doRender: function () {
		for (var i = 0, l = this._renders.length; i < l; ++i) {
			this._renders[i]();
		}
	}
}));