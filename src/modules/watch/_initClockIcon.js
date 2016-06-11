var appIconSvg = 
"<svg width=\"80\" height=\"80\" viewBox=\"0 0 312 312\" id=\"app-reveal\" xmlns=\"http://www.w3.org/2000/svg\">" +
"<circle class=\"reveal\" cx=\"156\" cy=\"156\" r=\"156\" stroke=\"#fff\" fill=\"none\" stroke-width=\"312\" />" +
	"<g class=\"small-watch\">" +
		"<g data-name=\"hour_hand\">" +
			"<circle cx=\"156\" cy=\"156\" r=\"7\" fill=\"#000\" />" +
			"<rect x=\"154\" y=\"134\" width=\"4\" height=\"22\" fill=\"#000\" />" +
			"<rect x=\"150\" y=\"73\" width=\"12\" height=\"62\" fill=\"#000\" rx=\"6\" ry=\"6\" />" +
		"</g>" +
		"<g data-name=\"minute_hand\">" +
			"<circle cx=\"156\" cy=\"156\" r=\"7\" fill=\"#000\" />" +
			"<rect x=\"154\" y=\"134\" width=\"4\" height=\"22\" fill=\"#000\" />" +
			"<rect x=\"150\" y=\"21\" width=\"12\" height=\"124\" fill=\"#000\" rx=\"6\" ry=\"6\" />" +
		"</g>" +
		"<g data-name=\"second_hand\">" +
			"<circle cx=\"156\" cy=\"156\" r=\"5\" fill=\"#FF9500\" />" +
			"<rect x=\"154\" y=\"21\" width=\"4\" height=\"165\" fill=\"#FF9500\" />" +
			"<circle cx=\"156\" cy=\"156\" r=\"4\" fill=\"#FF9500\" />" +
		"</g>" +
	"</g>" +
"</svg>";

var el = null;

module.exports = {
	addClock: function(watch, appData) {
		var _appIcon = document.createElement("div");
		_appIcon.className = "appicon clock";
		
		_appIcon.innerHTML = appIconSvg;
	
		if (appData.bundleID && appData.bundleID != "") {
			_appIcon.setAttribute("data-bundle",appData.bundleID);
		}
	
		el = _appIcon;
		watch.params.target.appendChild(_appIcon);
	},
	setClock: function() {
		if (!el) {
			return;
		}
		
		var today = new Date();
		var Hour = today.getHours() >= 12 ? today.getHours() - 12 : today.getHours();
		var Minute = today.getMinutes();
		var Second = today.getSeconds();
		var Msecond = today.getMilliseconds();
		
		if (typeof demo !== 'undefined' && demo) {
			Hour = 10;
			Minute = 9;
			Second = 30;
			Msecond = 0;
		}

		var secondValue = (Second/60.0) + ((Msecond / 1000)/60);
		var minuteValue = ((Minute/60) + secondValue/60);
		var hourValue = ((Hour/12) + minuteValue/12);

		var secondFuture = (Second+1)/60 + ((Msecond / 1000)/60);
		var minuteFuture = (Minute+1)/60 + (secondFuture/60);
		var hourFuture = (Hour+1)/12 + (minuteFuture/12);
		
		el.querySelector("g[data-name=\"second_hand\"]").style.transform = "rotate("+(secondValue*360)+"deg)";
		el.querySelector("g[data-name=\"minute_hand\"]").style.transform = "rotate("+(minuteValue*360)+"deg)";
		el.querySelector("g[data-name=\"hour_hand\"]").style.transform = "rotate("+(hourValue*360)+"deg)";

		if (typeof demo !== 'undefined' && demo) {} else {
			new Velocity(el.querySelector("g[data-name=\"second_hand\"]"), "stop");
			new Velocity(el.querySelector("g[data-name=\"second_hand\"]"), {
				rotateZ: [secondFuture*360, secondValue*360],
			}, {
				duration: 1000,
				easing: 'linear'
			});
		}
	},
	getClock: function() {
		return el;
	}
}