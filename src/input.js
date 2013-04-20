//store which keys are held down

window.addEventListener("keydown", function (e) {
	if (e.keyCode >= 48 && e.keyCode <= 57) {
		var n = e.keyCode - 49;
		if (n === -1) n = 9;
		Inventory.selectQuick(n);
	}

	if (e.keyCode === 69) Inventory.selectQuick(++Inventory._selected);
	if (e.keyCode === 81) Inventory.selectQuick(--Inventory._selected);

	Input.isDown[e.keyCode] = true;
}, false);

globalCanvas.element.addEventListener("mousedown", onInput, false);
globalCanvas.element.addEventListener("touchdown", onInput, false);

function onInput (e) {
	//TODO: allow touch
	var x = e.offsetX - 1;
	var y = e.offsetY - 1;
	
	Input.select(x, y);
}

window.addEventListener("keyup", function (e) {
	delete Input.isDown[e.keyCode];
}, false);

window.addEventListener("blur", function () {
	Input.isDown = {};
}, false);

var Input = {
	_selectCb: [],

	isDown: {},

	onSelect: function (cb) {
		this._selectCb.push(cb);
	},

	select: function (x, y) {
		var l = this._selectCb.length;
		while (l--) {
			this._selectCb[l](x, y);
		}
	}
}