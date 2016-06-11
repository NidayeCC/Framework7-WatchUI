var closeRegularApp = require('./_closeRegularApp'),
	closeClockApp = require('./_closeClockApp');

module.exports = function() {
	var watch = this;
	
	if (!watch.paramsInternal.appOpen) {
		return
	}
	watch.paramsInternal.appOpen = false;
	
	if ($("div.appicon.app-open")) {
		$("div.appicon.app-open").classList.remove("app-open");
	}

	$(".view-main").classList.add("active");
	$(".view-main").style.transform = "scale(8)";
	

	var iconEl = $(".appicon[data-bundle=\""+watch.openAppId+"\"]");
	if (watch.loadedApps[watch.openAppId].isClockApp) {
		closeClockApp(watch, iconEl);
	} else {
		closeRegularApp(watch, iconEl);
	}
}