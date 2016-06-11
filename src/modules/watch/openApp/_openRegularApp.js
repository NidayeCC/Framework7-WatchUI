var animSpeed = 1;

var findRow3 = function(node) {
    var i = 1;
    while (node = node.previousSibling) {
        if (node.nodeType === 1) { ++i }
    }
    return i;
}

module.exports = function(watch, el) {
	var indexInParent = findRow3(el)-1;

	el.classList.remove("fade-in");
	el.classList.add("fade-out");
	$("div.view > div.clock").classList.remove("hidden");
	$("div.view > div.clock").classList.remove("invisible");
	$("div.view.view-app div.navbar").classList.remove("navbar-hidden");

	new Velocity($(".view-main"), {
		scale: [[8], 1]
	}, {
		easing: "easeInQuint",
		duration: 200*animSpeed,
		complete: function() {
			$(".view-main").classList.remove("active");
			$(".view-main").style.transform = "";
			$(".view-main").style.opacity = 0;
		}
	});

	new Velocity($(".view-app"), {
		scale: [1, 0.125],
		opacity: [1, 0.25],
	}, {
		easing: "easeOutCirc",
		duration: 600*animSpeed,
		delay: 150*animSpeed,
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
			easing: "linear",
			duration: 200*animSpeed,
		})
	}
}