module.exports = function(sphereR, hexR, scroll) {
	var watch = this;
	var _math = require("../math");
	
	var hexCubeOrtho = [],
		hexCubePolar = [],
		hexCubeSphere = [];

	if (scroll === undefined) {
		var scrollX = 0,
			scrollY = 0;
	} else {
		var scrollX = scroll.x,
			scrollY = scroll.y;
	}

	for (var i in watch.hexCube) {
		hexCubeOrtho[i] = {
			"x": (watch.hexCube[i][1] + watch.hexCube[i][0]/2) * hexR + scrollX,
			"y": Math.sqrt(3) / 2 * watch.hexCube[i][0] * hexR + scrollY
		}
	}

	for (var i in hexCubeOrtho) {
		hexCubePolar[i] = _math.ortho2polar(hexCubeOrtho[i].x, hexCubeOrtho[i].y);
	}

	for (var i in hexCubePolar) {
		var rad = hexCubePolar[i].r / sphereR;
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
		var edge = 17;
		for (i in hexCubeOrtho) {
			if (Math.abs(hexCubeOrtho[i].x) > watch.paramsInternal.screenW/2 - edge || Math.abs(hexCubeOrtho[i].y) > watch.paramsInternal.screenH/2 - edge) {
				hexCubeOrtho[i].scale = hexCubeSphere[i].depth * 0.4;
			} else if (Math.abs(hexCubeOrtho[i].x) > watch.paramsInternal.screenW/2 - 2 * edge && Math.abs(hexCubeOrtho[i].y) > watch.paramsInternal.screenH/2 - 2 * edge){
				hexCubeOrtho[i].scale = Math.min(hexCubeSphere[i].depth * Easing.easeInOutSine(null, watch.paramsInternal.screenW/2 - Math.abs(hexCubeOrtho[i].x) - edge, 0.4, 0.6, edge), hexCubeSphere[i].depth * Easing.easeInOutSine(null, watch.paramsInternal.screenH/2 - Math.abs(hexCubeOrtho[i].y) - edge, 0.3, 0.7, edge) );
			} else if (Math.abs(hexCubeOrtho[i].x) > watch.paramsInternal.screenW/2 - 2 * edge){
				hexCubeOrtho[i].scale = hexCubeSphere[i].depth * Easing.easeOutSine(null, watch.paramsInternal.screenW/2 - Math.abs(hexCubeOrtho[i].x) - edge, 0.4, 0.6, edge);
			} else if (Math.abs(hexCubeOrtho[i].y) > watch.paramsInternal.screenH/2 - 2 * edge){
				hexCubeOrtho[i].scale = hexCubeSphere[i].depth * Easing.easeOutSine(null, watch.paramsInternal.screenH/2 - Math.abs(hexCubeOrtho[i].y) - edge, 0.4, 0.6, edge);
			} else {
				hexCubeOrtho[i].scale = hexCubeSphere[i].depth;
			}
			
		}

		for (i in hexCubeOrtho){
			if (hexCubeOrtho[i].x < -watch.paramsInternal.screenW/2 + 2 * edge) {
				hexCubeOrtho[i].x += Easing.easeInSine(null, watch.paramsInternal.screenW/2 - Math.abs(hexCubeOrtho[i].x) - 2 * edge, 0, 6, 2 * edge);
			} else if (hexCubeOrtho[i].x > watch.paramsInternal.screenW/2 - 2 * edge) {
				hexCubeOrtho[i].x += Easing.easeInSine(null, watch.paramsInternal.screenW/2 - Math.abs(hexCubeOrtho[i].x) - 2 * edge, 0, -6, 2 * edge);
			}
			
			if (hexCubeOrtho[i].y < -watch.paramsInternal.screenH/2 + 2 * edge) {
				hexCubeOrtho[i].y += Easing.easeInSine(null, watch.paramsInternal.screenH/2 - Math.abs(hexCubeOrtho[i].y) - 2 * edge, 0, 8, 2 * edge);
			} else if (hexCubeOrtho[i].y > watch.paramsInternal.screenH/2 - 2 * edge) {
				hexCubeOrtho[i].y += Easing.easeInSine(null, watch.paramsInternal.screenH/2 - Math.abs(hexCubeOrtho[i].y) - 2 * edge, 0, -8, 2 * edge);
			}
		}
	}
	for (var i=0; i<watch.hexCube.length; i++) {
		if ($$("div.appicon")[i]) {
			$$("div.appicon")[i].style.transform = "translate3d("+hexCubeOrtho[i].x+"px,"+hexCubeOrtho[i].y+"px,0) scale("+hexCubeOrtho[i].scale+")";
		}
	}

};