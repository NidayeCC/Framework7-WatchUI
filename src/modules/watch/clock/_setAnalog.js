module.exports = function() {
	var el = $("div.page[data-app=\"NanoTimer\"][data-page=\"app-index\"] div.page-content svg#watchHands");
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

}