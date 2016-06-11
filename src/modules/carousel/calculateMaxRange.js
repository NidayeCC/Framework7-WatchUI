module.exports = function() {
	var watch = this;
	var _math = require('../math.js');

	var hexCubeOrtho = [],
		hexCubePolar = [],
		hexCubeSphere = [];


	var scrollX = 0,
		scrollY = 0;

	for (var i in watch.hexCube) {
		hexCubeOrtho[i] = {
			"x": (watch.hexCube[i][1] + watch.hexCube[i][0]/2) * watch.params.iconSize + scrollX,
			"y": Math.sqrt(3) / 2 * watch.hexCube[i][0] * watch.params.iconSize + scrollY
		}
	}

	for (var i in hexCubeOrtho) {
		hexCubePolar[i] = _math.ortho2polar(hexCubeOrtho[i].x, hexCubeOrtho[i].y);
	}

	for (var i in hexCubePolar) {
		var rad = hexCubePolar[i].r / 0;
		if (rad < Math.PI / 2) {
			var r = hexCubePolar[i].r * Easing.easeOutQuad(null, rad/(Math.PI/2), 1.5, -0.5, 1);
			var depth = Easing.easeInOutCubic(null, rad/(Math.PI/2), 1, -0.5, 1);
		} else {
			var r = hexCubePolar[i].r;
			var depth = Easing.easeInOutCubic(null, 1, 1, -0.5, 1);
		}

		hexCubeSphere[i] = {
			"r": r,
			"depth": depth,
			"rad": hexCubePolar[i].rad
		}
	}

	for (var i in hexCubeSphere) {
		hexCubeOrtho[i] = _math.polar2ortho(hexCubeSphere[i].r, hexCubeSphere[i].rad);
	}

	for (var i in hexCubeOrtho) {
		hexCubeOrtho[i].x = Math.round(hexCubeOrtho[i].x * watch.params.iconSpacing*10) / 10;
		hexCubeOrtho[i].y = Math.round(hexCubeOrtho[i].y * watch.params.iconSpacing*10) / 10;
	}

	if (watch.params.edgeZoom) {
		var edge = -1000;
		for (i in hexCubeOrtho) {
			if (Math.abs(hexCubeOrtho[i].x) > watch.params.screenW/2 - edge || Math.abs(hexCubeOrtho[i].y) > watch.params.screenH/2 - edge) {
				hexCubeOrtho[i].scale = hexCubeSphere[i].depth * 0.4;
			}else if(Math.abs(hexCubeOrtho[i].x) > watch.params.screenW/2 - 2 * edge && Math.abs(hexCubeOrtho[i].y) > watch.params.screenH/2 - 2 * edge){
				hexCubeOrtho[i].scale = Math.min(hexCubeSphere[i].depth * Math.linear(null, watch.params.screenW/2 - Math.abs(hexCubeOrtho[i].x) - edge, 0.4, 0.6, edge), hexCubeSphere[i].depth * Math.linear(null, watch.params.screenH/2 - Math.abs(hexCubeOrtho[i].y) - edge, 0.3, 0.7, edge) );
			}else if(Math.abs(hexCubeOrtho[i].x) > watch.params.screenW/2 - 2 * edge){
				hexCubeOrtho[i].scale = hexCubeSphere[i].depth * Math.linear(null, watch.params.screenW/2 - Math.abs(hexCubeOrtho[i].x) - edge, 0.4, 0.6, edge);
			}else if(Math.abs(hexCubeOrtho[i].y) > watch.params.screenH/2 - 2 * edge){
				hexCubeOrtho[i].scale = hexCubeSphere[i].depth * Math.linear(null, watch.params.screenH/2 - Math.abs(hexCubeOrtho[i].y) - edge, 0.4, 0.6, edge);
			}else{
				hexCubeOrtho[i].scale = hexCubeSphere[i].depth;
			}
		}

		for (i in hexCubeOrtho){
			if (hexCubeOrtho[i].x < -watch.params.screenW/2 + 2 * edge) {
				hexCubeOrtho[i].x += Math.linear(null, watch.params.screenW/2 - Math.abs(hexCubeOrtho[i].x) - 2 * edge, 0, 6, 2 * edge);
			}else if(hexCubeOrtho[i].x > watch.params.screenW/2 - 2 * edge) {
				hexCubeOrtho[i].x += Math.linear(null, watch.params.screenW/2 - Math.abs(hexCubeOrtho[i].x) - 2 * edge, 0, -6, 2 * edge);
			};
			if(hexCubeOrtho[i].y < -watch.params.screenH/2 + 2 * edge) {
				hexCubeOrtho[i].y += Math.linear(null, watch.params.screenH/2 - Math.abs(hexCubeOrtho[i].y) - 2 * edge, 0, 8, 2 * edge);
			}else if(hexCubeOrtho[i].y > watch.params.screenH/2 - 2 * edge) {
				hexCubeOrtho[i].y += Math.linear(null, watch.params.screenH/2 - Math.abs(hexCubeOrtho[i].y) - 2 * edge, 0, -8, 2 * edge);
			}
		}
	}

	var ranges = {
		minX: 0,
		maxX: 0,
		minY: 0,
		maxY: 0,
		hexCubeOrtho: hexCubeOrtho
	}

	for (i in hexCubeOrtho) {
		if (hexCubeOrtho[i].x < 0) {
			if (-hexCubeOrtho[i].x > ranges.maxX) {
				ranges.maxX = -hexCubeOrtho[i].x
			}
		} else {
			if (-hexCubeOrtho[i].x < ranges.minX) {
				ranges.minX = -hexCubeOrtho[i].x;
			}
		}
		if (hexCubeOrtho[i].y < 0) {
			if (-hexCubeOrtho[i].y > ranges.maxY) {
				ranges.maxY = -hexCubeOrtho[i].y
			}
		} else {
			if (-hexCubeOrtho[i].y < ranges.minY) {
				ranges.minY = -hexCubeOrtho[i].y;
			}
		}
	}
	return ranges;
}