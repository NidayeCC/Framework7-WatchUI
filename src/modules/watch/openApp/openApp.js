var openRegularApp = require('./_openRegularApp'),
	openClockApp = require('./_openClockApp');

module.exports = function(el) {
	var watch = this;
	
	if (watch.paramsInternal.appOpen || watch.paramsInternal.scrolling || watch.forceTouch) {
		return
	}
	if (!el.getAttribute("data-bundle")) {
		return
	}

	var transform = window.getComputedStyle(el,null).transform.match(/-?[\d\.]+/g);
	
	watch.paramsInternal.appOpen = true;
	watch.paramsInternal.scrollAvailable = false;
	
	el.classList.add("app-open");
	el.style.opacity = "";
	el.removeAttribute("data-scale");

	$(".view-app").classList.add("active");
	var factor = 1.14,
		_transformX = watch.paramsInternal.screenW/2+(parseFloat(transform[4])*factor),
		_transformY = watch.paramsInternal.screenH/2+(parseFloat(transform[5])*factor);

	$(".view-main").style.transformOrigin = _transformX+"px "+_transformY+"px";
	$(".view-app").style.transformOrigin = _transformX+"px "+_transformY+"px";

	if (watch.openAppId != el.getAttribute("data-bundle")) {
		watch.openAppId = el.getAttribute("data-bundle");
		$("div.view.view-app div.pages").innerHTML = "";
		$("div.view.view-app div.navbar").innerHTML = "";
		watch.views.apps.router.load({
			url:"apps/"+el.getAttribute("data-bundle")+"/"+watch.loadedApps[el.getAttribute("data-bundle")].executable,
			animatePages: false,
			force: true,
		});
	}
	
	if (watch.loadedApps[watch.openAppId].isClockApp) {
		openClockApp(watch, el);
	} else {
		openRegularApp(watch, el);
	}
}