var animSpeed = 1;

var describeArc = require('../../libraries/describeArc');

module.exports = function(watch, iconEl) {
	var outerCircleRevealPath = $("div.page[data-app=\"NanoTimer\"][data-page=\"app-index\"] div.page-content svg#outerIndicatorReveal path");
	var innerCircleRevealPath = $("div.page[data-app=\"NanoTimer\"][data-page=\"app-index\"] div.page-content svg#innerIndicatorReveal path");

	if (watch.params.clockRevealAnimation) {
		watch.animationController.addAnimation({
			el: outerCircleRevealPath,
			animationFunction: function(frame) {
				var value = Easing.easeOutQuint(null,frame,360,-360,12)
				value = value >= 360 ? 359.99 : (value <= 0 ? 0.001 : value);
				this.el.setAttribute("d", describeArc(156, 156, 78, value, 360));
			},
			frameLength: 12*animSpeed,
			delay: 100*animSpeed
		});
		watch.animationController.addAnimation({
			el: innerCircleRevealPath,
			animationFunction: function(frame) {
				var value = Easing.easeOutQuint(null,frame,360,-360,12)
				value = value >= 360 ? 359.99 : (value <= 0 ? 0.001 : value);
				this.el.setAttribute("d", describeArc(156, 156, 67.5, value-15, 360-15));
			},
			frameLength: 12*animSpeed
		});
		watch.animationController.playAnimation();
	} else {
		new Velocity([outerCircleRevealPath, innerCircleRevealPath], {
			opacity: [0, 1]
		}, {
			easing: "easeOutCirc",
			duration: 400*animSpeed,
			delay: 200*animSpeed
		});
	}
	if (window.innerWidth > 640) {
		new Velocity($$("div.appicon:not(.app-open)"), {
			opacity: [1, 0]
		}, {
			easing: "easeInOutCirc",
			duration: 400*animSpeed,
		})
	}

	new Velocity($(".view-app"), {
		scale: [1/8, 1],
		opacity: [0.25, 1],
	}, {
		easing: "easeInOutCirc",
		duration: 600*animSpeed,
		complete: function() {
			$(".view-app").classList.remove("active");
			$(".view-app").style.transform = "";
			$(".view-app").style.opacity = 0;
			
			watch.views.apps.history = [];
			if ($("div.loading-wrapper")) {
				$("div.loading-wrapper").remove();
			}
			watch.paramsInternal.scrollAvailable = true;
			
		}
	});
	new Velocity($(".view-main"), {
		
		scale: [1, 8]
	}, {
		easing: "easeOutCirc",
		duration: 600*animSpeed,
		delay: 150*animSpeed,
		complete: function() {
			iconEl.classList.remove("fade-in");

			if ($("div.appicon.app-open")) {
				$("div.appicon.app-open").classList.remove("app-open");
			}
		}
	});
	new Velocity($("#app-reveal circle.reveal"), {
		strokeWidth: [312, 0]
	}, {
		easing: "easeOutCirc",
		duration: 400*animSpeed,
		delay: 200*animSpeed
	});
	setTimeout(function() {
		$("#app-reveal g.small-watch").style.display = "";
		var step = 0;
		var interval = setInterval(function() {
			if (step >= 60) {
				clearInterval(interval);

				watch.paramsInternal.scrollAvailable = true;
				return;
			}

			watch.params.iconSpacing = Easing.easeOutQuad(null,step+1,2,-1,60);
			watch.iconMapRefresh(watch.params.carouselSize, watch.params.iconSize, {x: watch.paramsInternal.scrollX, y: watch.paramsInternal.scrollY});
			step++;
		});
	}, 200);
}