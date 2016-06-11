module.exports = function(e) {
	var watch = this;

	e.preventDefault();
	e.stopPropagation();

	if (e.touches !== undefined) {
		e = e.touches[0];
	}

	watch.longPress = false;
	clearTimeout(watch.longPressTimer);
	watch.longPressTimer = setTimeout(function() {
		watch.longPress = true;

	}, ("ontouchend" in window) ? 30 : 200);
	
	Dom7("div.appicon").removeClass("translucent transition");

	watch.paramsInternal.deltaX = e.pageX - watch.paramsInternal.lastX;
	watch.paramsInternal.deltaY = e.pageY - watch.paramsInternal.lastY;

	watch.paramsInternal.lastX = e.pageX;
	watch.paramsInternal.lastY = e.pageY;

	watch.paramsInternal.scrollMoveX += watch.paramsInternal.deltaX;
	watch.paramsInternal.scrollMoveY += watch.paramsInternal.deltaY;

	watch.paramsInternal.scrollX = watch.paramsInternal.scrollMoveX;
	watch.paramsInternal.scrollY = watch.paramsInternal.scrollMoveY;

	if (watch.paramsInternal.scrollMoveX > watch.paramsInternal.scrollRangeX) {
		watch.longPress = false;
		watch.paramsInternal.scrollX = watch.paramsInternal.scrollRangeX + (watch.paramsInternal.scrollMoveX - watch.paramsInternal.scrollRangeX)/2;
	} else if (watch.paramsInternal.scrollX < -watch.paramsInternal.scrollRangeNegX) {
		watch.longPress = false;
		watch.paramsInternal.scrollX = -watch.paramsInternal.scrollRangeNegX + (watch.paramsInternal.scrollMoveX + watch.paramsInternal.scrollRangeNegX)/2;
	}

	if (watch.paramsInternal.scrollMoveY > watch.paramsInternal.scrollRangeY) {
		watch.longPress = false;
		watch.paramsInternal.scrollY = watch.paramsInternal.scrollRangeY + (watch.paramsInternal.scrollMoveY - watch.paramsInternal.scrollRangeY)/2;
	} else if (watch.paramsInternal.scrollY < -watch.paramsInternal.scrollRangeNegY) {
		watch.longPress = false;
		watch.paramsInternal.scrollY = -watch.paramsInternal.scrollRangeNegY + (watch.paramsInternal.scrollMoveY + watch.paramsInternal.scrollRangeNegY)/2;
	}

	watch.iconMapRefresh(watch.params.carouselSize, watch.params.iconSize, {x: watch.paramsInternal.scrollX, y: watch.paramsInternal.scrollY});

	return false;
}