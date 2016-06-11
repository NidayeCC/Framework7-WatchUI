var animSpeed = 1;

var findRow3 = function(node) {
    var i = 1;
    while (node = node.previousSibling) {
        if (node.nodeType === 1) { ++i }
    }
    return i;
}

var describeArc = require('../../libraries/describeArc');

module.exports = function(watch, el) {
	var indexInParent = findRow3(el)-1;
	
	$("div.view > div.clock").classList.add("invisible");
	$("div.view.view-app div.navbar").classList.add("navbar-hidden");

	new Velocity($("#app-reveal circle.reveal"), {
		strokeWidth: [0, 312]
	}, {
		easing: "easeInCirc",
		duration: 200*animSpeed,
		complete: function() {
			watch.clock().setAnalog();
			$("#app-reveal g.small-watch").style.display = "none";

			var outerCircleRevealPath = $("div.page[data-app=\"NanoTimer\"][data-page=\"app-index\"] div.page-content svg#outerIndicatorReveal path");
			var innerCircleRevealPath = $("div.page[data-app=\"NanoTimer\"][data-page=\"app-index\"] div.page-content svg#innerIndicatorReveal path");

			if (watch.params.clockRevealAnimation) {
				if (outerCircleRevealPath && innerCircleRevealPath) {
					outerCircleRevealPath.setAttribute("d", describeArc(156, 156, 78, 0.001, 360));
					innerCircleRevealPath.setAttribute("d", describeArc(156, 156, 67.5, 0.001, 360));
					
					outerCircleRevealPath.setAttribute("stroke", "#000");
					innerCircleRevealPath.setAttribute("stroke", "#000");
				}
				
				watch.animationController.addAnimation({
					el: outerCircleRevealPath,
					animationFunction: function(frame) {
						var value = Easing.easeOutQuint(null,frame,0,360,60*animSpeed)
						value = value >= 360 ? 359.99 : (value <= 0 ? 0.001 : value);
						this.el.setAttribute("d", describeArc(156, 156, 78, value, 360));
					},
					frameLength: 60*animSpeed,
				});
				watch.animationController.addAnimation({
					el: innerCircleRevealPath,
					animationFunction: function(frame) {
						var value = Easing.easeOutQuint(null,frame,0,360,60*animSpeed)
						value = value >= 360 ? 359.99 : (value <= 0 ? 0.001 : value);
						this.el.setAttribute("d", describeArc(156, 156, 67.5, value-15, 360-15));
					},
					frameLength: 60*animSpeed,
					delay: 200*animSpeed
				});
				watch.animationController.playAnimation();
			} else {
				if (outerCircleRevealPath && innerCircleRevealPath) {
					outerCircleRevealPath.setAttribute("stroke", "none");
					innerCircleRevealPath.setAttribute("stroke", "none");
				}
				new Velocity([outerCircleRevealPath, innerCircleRevealPath], {
					opacity: [1, 0]
				}, {
					easing: "easeOutCirc",
					duration: 200*animSpeed,
				});
			}
		}
	});


	new Velocity($(".view-main"), {
		scale: [[8], 1]
	}, {
		easing: "easeInOutQuint",
		duration: 600*animSpeed,
		complete: function() {
			$(".view-main").classList.remove("active");
			$(".view-main").style.transform = "";
			$(".view-main").style.opacity = 0;
		}
	});
	new Velocity($(".view-app"), {
		scale: [1, 0.125],
		opacity: [1, 1],
	}, {
		easing: "easeInOutQuint",
		duration: 600*animSpeed,
		complete: function() {
			$(".view-main").style.transformOrigin = "";
			$(".view-app").style.transformOrigin = "";
			$(".view-main").style.opacity = "";

			watch.paramsInternal.scrollX = -watch.iconPositions.hexCubeOrtho[indexInParent].x;
			watch.paramsInternal.scrollY = -watch.iconPositions.hexCubeOrtho[indexInParent].y;
			watch.paramsInternal.lastX = watch.paramsInternal.scrollX;
			watch.paramsInternal.lastY = watch.paramsInternal.scrollY;
			watch.paramsInternal.deltaX = watch.paramsInternal.scrollX;
			watch.paramsInternal.deltaY = watch.paramsInternal.scrollY;
			watch.paramsInternal.scrollMoveX = watch.paramsInternal.scrollX;
			watch.paramsInternal.scrollMoveY = watch.paramsInternal.scrollY;
			watch.iconMapRefresh(watch.params.carouselSize, watch.params.iconSize, {x: watch.paramsInternal.scrollX, y: watch.paramsInternal.scrollY});
		}
	});

	if (window.innerWidth > 640) {
		new Velocity($$("div.appicon:not(.app-open)"), {
			opacity: [0, 1]
		}, {
			easing: "easeInOutQuint",
			duration: 400*animSpeed,
		})
	}
}