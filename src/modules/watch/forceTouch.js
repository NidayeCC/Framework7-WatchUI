var touchEventStart = ("ontouchend" in window) ? "touchstart" : "mousedown";
var touchEventMove = ("ontouchend" in window) ? "touchmove" : "mousemove";
var touchEventEnd = ("ontouchend" in window) ? "touchend" : "mouseup";

var _touch = null;
var emulatedForce = false;

var forceTouchEvents = {};

var watch = null;

var _forceTouch = {
	init: function(_watch) {
		watch = _watch;
		$("body").addEventListener(touchEventStart, _forceTouch.touchStart);
		$("body").addEventListener(touchEventEnd, _forceTouch.touchEnd);
		
		watch.onForceTouch = onForceTouch;
		watch.triggerForceTouchEvent = triggerForceTouchEvent;
		/*var touchStart = function(e) {
			//e.preventDefault();
			checkForce(e);
		}
		var touchEnd = function(e) {
			//e.preventDefault();
			_touch = null;
		}
		var checkForce = function(e) {
			_touch = e;
			setTimeout(refreshForceValue.bind(_touch), 10);
		}
		var refreshForceValue = function() {
			console.log("test");
			if (!touch.touches[0]) {
				//return
			}
			var touchEvent = this;
			var forceValue = 0;
			if (touchEvent) {
				forceValue = touchEvent.touches[0].force || 0;
				setTimeout(refreshForceValue.bind(_touch), 10);
			} else {
				forceValue = 0;
			}

			if ((forceValue >= 1 || emulatedForce) && watch.paramsInternal.appOpen) {
				_touch = null;
				//watch.forceTouch = true;
				//watch.openMenu();
				console.log("forceTouch");
			}
		}*/
	},
	touchStart: function(e) {
		_forceTouch.checkForce(e)
	},
	touchEnd: function() {
		_touch = null;
	},
	checkForce: function(e) {
		_touch = e;
		setTimeout(_forceTouch.refreshForceValue.bind(_touch), 10);
	},
	refreshForceValue: function() {
		var touchEvent = this;
		var forceValue = 0;
		if (touchEvent && touchEvent.touches) {
			forceValue = touchEvent.touches[0].force || 0;
			setTimeout(_forceTouch.refreshForceValue.bind(_touch), 10);
		} else {
			forceValue = 0;
		}

		if ((forceValue >= 1 || emulatedForce) && watch.paramsInternal.appOpen) {
			_touch.preventDefault();
			_touch = null;
			//watch.forceTouch = true;
			//watch.openMenu();
			watch.triggerForceTouchEvent(watch.openAppId, watch.views.apps.activePage.name);
		}
	},
	setEmulatedForce: function(enabled) {
		emulatedForce = enabled;
	}
};

var onForceTouch = function(appId, pageName, callback) {
	if (!forceTouchEvents[appId]) {
		forceTouchEvents[appId] = {};
	}
	forceTouchEvents[appId][pageName] = callback;
	
}
var triggerForceTouchEvent = function(appId, pageName) {
	if (forceTouchEvents[appId] && forceTouchEvents[appId][pageName]) {
		forceTouchEvents[appId][pageName]();
	} else {
		return false;
	}
}

module.exports = _forceTouch;