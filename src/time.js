//background: rgba(253, 94, 83, 0.3);
var Time = {
	hour: 0,
	minute: 0,
	onNewHour: null,
	onDay: null,
	onNight: null
};

(function () {

var colors = {
	night: {r: 4, g: 4, b: 90, a: 0.6},
	sunset: {r: 72, g: 29, b: 163, a: 0.3},
	sunrise: {r: 253, g: 94, b: 83, a: 0.3},
	day: {r: 253, g: 94, b: 83, a: 0}
};

var time = 0; //start at midnight
var day = (1000 * 60) * 10; //10 minutes
var inc = 500; //increment the day
var divider = day / 24; //divide into 24 hours
var overlay = document.getElementById("time").style;

//interpolate the color values
function lerp (start, end, v) {
	return start + (end - start) * v;
}

function renderTime () {
	time += inc;
	time = time % day;

	var hour = time / divider;
	var minute = hour - (hour | 0);
	Time.minute = minute * 60 | 0;

	//new hour event
	if ((hour | 0) !== Time.hour) {
		Time.hour = hour | 0;
		Time.onNewHour && Time.onNewHour();
	}

	var color, next, nexthour, prevhour;

	if (hour >= 0 && hour <= 5) {
		color = colors.night;
		next = colors.sunrise;
		prevhour = 4;
		nexthour = 5;
	}
	else if (hour > 5 && hour <= 7) {
		color = colors.sunrise;
		next = colors.day;
		prevhour = 5;
		nexthour = 7;
	}
	else if (hour > 7 && hour <= 20) {
		color = colors.day;
		next = colors.sunset;
		prevhour = 7;
		nexthour = 20;

		Time.onDay && Time.onDay(); //execute day event
	}
	else if (hour > 20 && hour <= 22) {
		color = colors.sunset;
		next = colors.night;
		prevhour = 20;
		nexthour = 22;
	}
	else if (hour > 22) {
		color = colors.night;
		next = colors.night;
		prevhour = 22;
		nexthour = 24;

		Time.onNight && Time.onNight(); //execute night event
	}

	var between = (hour - prevhour) / (nexthour - prevhour);
	if (between < 0) between = 0;

	var r = lerp(color.r, next.r, between) | 0;
	var g = lerp(color.g, next.g, between) | 0;
	var b = lerp(color.b, next.b, between) | 0;
	var a = lerp(color.a, next.a, between).toFixed(3);

	overlay.background = "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

renderTime();
setInterval(renderTime, inc);

})();