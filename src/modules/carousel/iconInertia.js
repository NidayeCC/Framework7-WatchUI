var _iconInertia = function(watch, step, steps, distanceX, distanceY) {
	watch.paramsInternal.scrolling = true;
	if (step > steps || (watch.paramsInternal.deltaX == 0 &&  watch.paramsInternal.deltaY == 0)) {
		for (var i=0; i<watch.inertias.length; i++) {
			clearInterval(watch.inertias[i]);
			watch.paramsInternal.scrolling = false;
		}
		return;
	};

	watch.paramsInternal.scrollMoveX = watch.paramsInternal.scrollX;
	watch.paramsInternal.scrollMoveY = watch.paramsInternal.scrollY;

	watch.paramsInternal.inertiaX = Easing.easeOutCubic(null, step, 0, distanceX, steps) - Easing.easeOutCubic(null, (step - 1), 0, distanceX, steps);
	watch.paramsInternal.inertiaY = Easing.easeOutCubic(null, step, 0, distanceY, steps) - Easing.easeOutCubic(null, (step - 1), 0, distanceY, steps);

	if (watch.paramsInternal.inertiaX < watch.paramsInternal.inertiaThreshold && watch.paramsInternal.inertiaY < watch.paramsInternal.inertiaThreshold && step < 5) {
		if (watch.paramsInternal.inertiaX > -watch.paramsInternal.inertiaThreshold && watch.paramsInternal.inertiaY > -watch.paramsInternal.inertiaThreshold && step < 5) {
			if (watch.longPress) {
				for (var i=0; i<watch.inertias.length; i++) {
					clearInterval(watch.inertias[i]);
				}
				return;
			}
		}
	}
	if (watch.paramsInternal.inertiaX == 0 && watch.paramsInternal.inertiaY == 0 && step < 5) {
		return;
	}

	watch.paramsInternal.scrollX += watch.paramsInternal.inertiaX;
	watch.paramsInternal.scrollY += watch.paramsInternal.inertiaY;

	if (watch.paramsInternal.scrollX > watch.paramsInternal.scrollRangeX) {
		watch.longPress = false;
		watch.paramsInternal.scrollX -= (watch.paramsInternal.scrollX - watch.paramsInternal.scrollRangeX)/4;
	} else if (watch.paramsInternal.scrollX < -watch.paramsInternal.scrollRangeNegX) {
		watch.longPress = false;
		watch.paramsInternal.scrollX -= (watch.paramsInternal.scrollX + watch.paramsInternal.scrollRangeNegX)/4;
	}

	if (watch.paramsInternal.scrollY > watch.paramsInternal.scrollRangeY) {
		watch.longPress = false;
		watch.paramsInternal.scrollY -= (watch.paramsInternal.scrollY - watch.paramsInternal.scrollRangeY)/4;
	} else if (watch.paramsInternal.scrollY < -watch.paramsInternal.scrollRangeNegY) {
		watch.longPress = false;
		watch.paramsInternal.scrollY -= (watch.paramsInternal.scrollY + watch.paramsInternal.scrollRangeNegY)/4;
	}

	watch.iconMapRefresh(watch.params.carouselSize, watch.params.iconSize, {x: watch.paramsInternal.scrollX, y: watch.paramsInternal.scrollY});
}

module.exports = function(e) {
	var watch = this;

	var touchEventMove = ("ontouchend" in window) ? "touchmove" : "mousemove";
	var touchEventEnd = ("ontouchend" in window) ? "touchend" : "mouseup";

	window.removeEventListener(touchEventMove, watch._moveIcons);
	window.removeEventListener(touchEventEnd, watch._iconInertia);
	var step = 1,
		steps = 32,
		veloX = watch.paramsInternal.deltaX,
		veloY = watch.paramsInternal.deltaY,
		distanceX = veloX * 10,
		distanceY = veloY * 10;

		if (watch.paramsInternal.scrollX > watch.paramsInternal.scrollRangeX || watch.paramsInternal.scrollX < -watch.paramsInternal.scrollRangeNegX) {
			watch.longPress = false;
		}
		if (watch.paramsInternal.scrollY > watch.paramsInternal.scrollRangeY || watch.paramsInternal.scrollY < -watch.paramsInternal.scrollRangeNegY) {
			watch.longPress = false;
		}

	if (!watch.longPress) {
		watch.inertias.push(setInterval(function() {
			if (!watch.paramsInternal.scrollAvailable) {
				clearInterval(watch.inertias[watch.inertias.length-1]);
				watch.inertias.pop();
				return;
			}

			_iconInertia(watch, step, steps, distanceX, distanceY);
			step++;
		}, 16));
	} 
		setTimeout(function() {
			watch.longPress = false;
		}, 200)
};