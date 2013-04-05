/**
* Canvas class
*/
var Canvas = function (opts) {
	opts = opts || {};

	if (opts.id) {
		this.element = document.getElementById(opts.id);
	} else {
		this.element = document.createElement("canvas");
	}

	if (typeof opts.width === "number") {
		this.element.width = opts.width;
	}

	if (typeof opts.height === "number") {
		this.element.height = opts.height;
	}

	this.context = this.element.getContext("2d");
	
	if (!opts.smoothingEnabled) {
		this.context.webkitImageSmoothingEnabled = false;
		this.context.mozImageSmoothingEnabled = false;
		this.context.imageSmoothingEnabled = false;
	}
};
