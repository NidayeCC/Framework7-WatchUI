module.exports = function() {
	var watch = this;
	
	if (app.paramsInternal.appOpen) {
		watch.closeApp();
		return;
	}

	watch.paramsInternal.scrollAvailable = false;
	watch.paramsInternal.scrolling = true;
	var step = 0;
	var changeX = watch.paramsInternal.scrollX;
	var changeY = watch.paramsInternal.scrollY;

	var interval = setInterval(function() {
		if (step >= 10) {
			clearInterval(interval);

			watch.paramsInternal.deltaX = 0;
			watch.paramsInternal.deltaY = 0;

			watch.paramsInternal.lastX = 0;
			watch.paramsInternal.lastY = 0;

			watch.paramsInternal.scrollMoveX = 0;
			watch.paramsInternal.scrollMoveY = 0;

			watch.paramsInternal.scrollX = 0;
			watch.paramsInternal.scrollY = 0;

			watch.paramsInternal.scrollAvailable = true;
			watch.paramsInternal.scrolling = false;
			return;
		}

		var _scrollX = Easing.easeOutQuad(null,step+1,changeX,-changeX,10);
		var _scrollY = Easing.easeOutQuad(null,step+1,changeY,-changeY,10);
		watch.iconMapRefresh(watch.params.carouselSize, watch.params.iconSize, {x: _scrollX, y: _scrollY});
		step++;
	}, 1000/60);
}