function Particle (opts) {
}

function toRGB (color) {
	return "rgba(" + color.r + "," + color.g + "," + color.b + ",1)";
}

var ParticleEmitter = function () {
	this._particles = [];
	this._stop = false;
}

ParticleEmitter.prototype = {

	start: function (opts) {
		opts = opts || {};

		var n = this.maxParticles = opts.maxParticles || 100;

		this.vel = {x: 0, y: 0};
		this.color = opts.color;
		this.gravity = opts.gravity || {x: 0, y: 0.5};
		this.spread = opts.spread || 1;
		this.size = opts.size || 5;
		this.life = opts.life || 100;
		this.startX = opts.x;
		this.startY = opts.y;
		this.angle = opts.angle || 1;

		this.addParticles(n);
	},

	addParticles: function (n) {
		//init pixels
		while (n--) {
			this._particles.push(new Particle());
			this.initParticle(this._particles[this._particles.length - 1]);
		}
	},

	removeParticles: function (n) {
		while (n--) {
			this._particles.pop();
		}
	},

	initParticle: function (particle) {
		particle.color = {
			r: this.color.r + (Math.random() * 50 - 20) | 0,
			g: this.color.g + (Math.random() * 50 - 20) | 0,
			b: this.color.b + (Math.random() * 50 - 20) | 0
		};

		particle.x = Math.random() * this.spread - this.spread / 2;
		particle.y = Math.random() * this.spread - this.spread / 2;
		particle.w = this.size + Math.random();
		particle.h = this.size + Math.random();
		particle.life = this.life + (Math.random() * 20 | 0);
		particle.vel = {x: this.vel.x, y: this.vel.y};
		particle.angle = this.angle;
	},

	tick: function () {
		var i = this._particles.length;

		var particle;

		while (i-- > 0) {
			particle = this._particles[i];

			particle.vel.x += this.gravity.x;
			particle.vel.y += this.gravity.y;				

			particle.x += particle.vel.x;
			particle.y += particle.vel.y;

			particle.life--;

			if (particle.life < 0) {
				if (this._stop) {
					this._particles.splice(i, 1);
					//i--;
				} else {
					this.initParticle(particle);
				}
			}
		}
	},

	render: function (ctx) {

		var len = this._particles.length;
		var particle;

		ctx.translate(this.startX, this.startY);

		for (var i = 0; i < len; ++i) {
			particle = this._particles[i];

			ctx.fillStyle = toRGB(particle.color);
			ctx.fillRect(
				particle.x,
				particle.y,
				particle.w,
				particle.h
			);
		}

		ctx.translate(-this.startX, -this.startY);
	},

	destroy: function (end) {
		this._stop = true;
		var self = this;
		function checkSize () {
			setTimeout(function () {
				if (self._particles.length) {
					checkSize();
				} else {
					end();
				}
			}, 10);
		}

		checkSize();
	}
};

/**
ParticleEmitter.start({
	maxParticles: 100,
	gravity: {y: 0.1},
	color: [],
	startSize: 5,
	endSize: 2,
	duration: 
});

*/