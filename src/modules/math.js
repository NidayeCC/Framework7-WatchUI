module.exports = {
	polar2ortho: function(r, rad) {
		var x = r * Math.cos(rad);
		var y = r * Math.sin(rad);
		return {
			"x": x,
			"y": y,
		}
	},
	ortho2polar: function(x, y) {
		var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
		var rad = Math.atan2(y, x);
		return {
			"r": r,
			"rad": rad,
		}
	}
}

Math.linear = function(x, t, b, c, d) {
	return c*t/d + b;
}
Math.easeOutQuad = function (x, t, b, c, d) {
	return -c *(t/=d)*(t-2) + b;
}
Math.easeInOutCubic = function (x, t, b, c, d) {
	if ((t/=d/2) < 1) return c/2*t*t*t + b;
	return c/2*((t-=2)*t*t + 2) + b;
}
Math.easeOutCubic = function (x, t, b, c, d) {
	return c*((t=t/d-1)*t*t + 1) + b;
}
Math.easeInSine = function (x, t, b, c, d) {
    return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
}
Math.easeOutSine = function (x, t, b, c, d) {
    return c * Math.sin(t/d * (Math.PI/2)) + b;
}
Math.easeInOutSine = function (x, t, b, c, d) {
    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
}
Math.easeInOutCirc = function (x, t, b, c, d) {
	if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
	return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
}
Math.easeInQuint = function (x, t, b, c, d) {
	return c*(t/=d)*t*t*t*t + b;
}
Math.easeOutQuint = function (x, t, b, c, d) {
	return c*((t=t/d-1)*t*t*t*t + 1) + b;
}