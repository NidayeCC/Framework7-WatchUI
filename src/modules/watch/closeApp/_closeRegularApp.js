var animSpeed = 1;

module.exports = function(watch, iconEl) {
	if (window.innerWidth >= 312*2) {
		$(".view-main").style.opacity = 0;
	}
	new Velocity($(".view-app"), {
		scale: [80/312, 1],
		opacity: [0.25, 1],
	}, {
		easing: "easeInCirc",
		duration: 200*animSpeed,
		complete: function() {
			iconEl.classList.remove("fade-out");
			iconEl.classList.add("fade-in");
			$(".view-app").classList.remove("active");
			$(".view-app").style.transform = "";
			$(".view-app").style.opacity = 0;

			if (window.innerWidth > 640) {
				new Velocity($$("div.appicon:not(.app-open)"), {
					opacity: [1, 0]
				}, {
					easing: "linear",
					duration: 200*animSpeed,
				})
			}

			new Velocity($(".view-main"), {
				scale: [1, 8],
				opacity: [1, 0],
			}, {
				easing: "easeOutCirc",
				duration: 600*animSpeed,
				complete: function() {
					$(".view-app").classList.remove("active");
					iconEl.classList.remove("fade-in");

					if ($("div.appicon.app-open")) {
						$("div.appicon.app-open").classList.remove("app-open");
					}
				}
			});
			watch.views.apps.history = [];
			if ($("div.loading-wrapper")) {
				$("div.loading-wrapper").remove();
			}
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
		}
	});
}