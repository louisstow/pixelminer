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
globalCanvas.element.addEventListener("touchstart", onInput, false);
globalCanvas.element.addEventListener("mouseup", onInput, false);
globalCanvas.element.addEventListener("touchend", onInput, false);

function onInput (e) {
	var type = e.type.replace(/mouse|touch/ig, '');
	if (type === "down") type = "start";
	if (type === "up") type = "end";

	var button = "left";
	if (e.which === 3 || e.button === 2) { button = "right"; }

	//TODO: allow touch
	var x = e.offsetX - 1;
	var y = e.offsetY - 1;
	
	Input.emit(type + ":" + button, x, y);
}

window.addEventListener("keyup", function (e) {
	delete Input.isDown[e.keyCode];
}, false);

window.addEventListener("blur", function () {
	Input.isDown = {};
}, false);

function no (e) {
	e.preventDefault();
	return false;
}

window.addEventListener("contextmenu", no, false);
window.addEventListener("selectstart", no, false);

var Input = new (Spineless.Event.extend({
	isDown: {}
}));

window.addEventListener("DOMMouseScroll", onScroll, false);
document.onmousewheel = onScroll;

function onScroll (e) {
	var delta = -e.detail || e.wheelDelta;
	
	Input.emit("scroll", delta);
}