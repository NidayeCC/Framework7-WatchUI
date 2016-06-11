var watch;
var loadJSON = require('./loadJSON');

var touchEventStart = ("ontouchend" in window) ? "touchstart" : "mousedown";
var touchEventMove = ("ontouchend" in window) ? "touchmove" : "mousemove";
var touchEventEnd = ("ontouchend" in window) ? "touchend" : "mouseup";

var initApp = function() {
	if (!watch.params.target) {
		throw new Error("watchUI cannot be initialized without target container!");
	}
	
	if (watch.params.watchFrame) {
		document.body.classList.add("frame");
	}

	watch.paramsInternal.screenW = watch.params.target.offsetWidth;
	watch.paramsInternal.screenH = watch.params.target.offsetHeight;
	watch.paramsInternal.centerW = watch.paramsInternal.screenW/2;
	watch.paramsInternal.centerH = watch.paramsInternal.screenH/2;

	/*window.addEventListener("resize", function() {
		watch.paramsInternal.screenW = watch.params.target.offsetWidth;
		watch.paramsInternal.screenH = watch.params.target.offsetHeight;
		watch.paramsInternal.centerW = watch.paramsInternal.screenW/2;
		watch.paramsInternal.centerH = watch.paramsInternal.screenH/2;
	});*/
	

	watch.framework = new Framework7({
		cache: false,
		onPageInit: function(app_fw7, page) {
			if (page.name == "app-index") {
				watch.loadingTimeout = false;
				clearTimeout(watch.timeouts.loading);
				watch.timeouts.loading = null;
				if ($("div.loading-wrapper")) {
					$("div.loading-wrapper").remove();
				}
			}

			if (watch.environments[watch.params.environment].homeLinks) {
				var home = $$(".watch-home, div.view div.pages + div.clock p.time");
				if (home) {
					for (var i=0; i<home.length; i++) {
						home[i].removeEventListener(touchEventEnd, watch.closeApp)
						home[i].addEventListener(touchEventEnd, watch.closeApp)
					}
				}
			} else {
				document.body.classList.add("no-home-links")
			}
			initScrollIndicator();
		},
		onPageBeforeAnimation: function(app_fw7, page) {
			if (page.navbarInnerContainer && watch.loadedApps[watch.openAppId].color) {
				//console.log(page.navbarInnerContainer)
				page.navbarInnerContainer.style.color = watch.loadedApps[watch.openAppId].color;
			}
		},
		onPageAfterBack: function(app_fw7, page) {
			initScrollIndicator();
		},
		preprocess: function(content, url, next) {
			if (content) {
				content = content.replace(/{{app}}/g, "apps/"+watch.openAppId);
				
				if (watch.loadedApps[watch.openAppId].color) {
					//content = content.replace(/{{accentColor}}/g, watch.loadedApps[watch.openAppId].color);
					content = content.replace(/<div class="navbar-inner/g, "<div style=\"color: "+watch.loadedApps[watch.openAppId].color+"\" class=\"navbar-inner");
				}
				return content;
			}
		},
		onAjaxStart: function() {
			watch.ajaxStates.start = true;
			watch.ajaxStates.complete = false;
			watch.ajaxStates.error = false;

			watch.timeouts.loading = setTimeout(function() {
				var data = watch.loadedApps[$("div.appicon.app-open").getAttribute("data-bundle")];
				Dom7("div.view.view-app").append("<div class=\"loading-wrapper\"><div class=\"error-icon\"></div><div class=\"loading visible\"></div><p class=\"app-title\">"+data.title+"</p></div>");
			}, 400)
		},
		onAjaxComplete: function() {
			watch.ajaxStates.start = false;
			watch.ajaxStates.complete = true;
			if (watch.ajaxStates.error) {
				return;
			}
			clearTimeout(watch.timeouts.loading);
		},
		onAjaxError: function() {
			watch.ajaxStates.error = true;
			setTimeout(function() {
				var el = $("div.appicon.app-open");
				var data = watch.loadedApps[el.getAttribute("data-bundle")];
				$("div.loading-wrapper div.loading").remove();
				$("div.loading-wrapper div.error-icon").style.backgroundImage = el.style.backgroundImage;
				$("div.loading-wrapper p.app-title").innerHTML = (data.title.length > 0 ? data.title : "The app")+" could not be opened.";
				clearTimeout(watch.loadingTimeout);
				watch.loadingTimeout = false;
			}, 1200);
		}
	});
	watch.views.apps = watch.framework.addView(".view-app", {
		dynamicNavbar: true,
		domCache: true,
	});

	if (watch.environments[watch.params.environment].doubleTapHome) {
		var mc = new Hammer.Manager(watch.params.target);
		var dt = new Hammer.Tap({event: 'doubletap', taps: 2 })
		mc.add(dt);
		mc.on("doubletap", function(e) {
			watch.longPress = false;
			watch.home();
		});
	}
	
	_loadApps();
}

var _loadApps = function() {
	watch.loadedApps = {};
	
	var appUrls = [];
	if (!watch.params.localApps) {
		loadJSON(watch.params.applicationGrid, function(data) {
			for (var i=0; i<data["apps"].length; i++) {
				if (data["apps"][i].bundleID) {
					watch.loadedApps[data["apps"][i].bundleID] = data["apps"][i];
				}
				
				if (data["apps"][i].isClockApp) {
					_initClockIcon.addClock(watch, data["apps"][i]);
					_initClockIcon.setClock();
				} else {
					var _appIcon = document.createElement("div");
					_appIcon.className = "appicon";
					
					if (data["apps"][i].bundleID && data["apps"][i].bundleID != "") {
						_appIcon.setAttribute("data-bundle",data["apps"][i].bundleID);
					}
					if (data["apps"][i].bundleID && data["apps"][i].bundleID != "" && data["apps"][i].executable && data["apps"][i].executable != "") {
						appUrls.push("/apps/"+data["apps"][i].bundleID+"/"+data["apps"][i].executable);
					}
					_appIcon.style.backgroundImage = "url("+data["apps"][i].icon+")";
					watch.params.target.appendChild(_appIcon);
				}

				if (data["apps"][i].bundleID && data["apps"][i].bundleID != "" && data["apps"][i].executable && data["apps"][i].executable != "") {
					appUrls.push("/apps/"+data["apps"][i].bundleID+"/"+data["apps"][i].executable);
				}
				watch.hexCube.push(data["apps"][i].position);

				$$("div.appicon")[i].addEventListener(touchEventStart, function() {
					var el = this;
					var transform = window.getComputedStyle(el,null).transform.match(/-?[\d\.]+/g);
					if (!el.hasAttribute("data-scale")) {
						el.setAttribute("data-scale", transform[0]);
					}
					el.classList.add("transition");
					el.classList.add("translucent");
					el.style.transform = "translate3d(" + transform[4] + "px," + transform[5] + "px,0) scale(" + transform[0] * 0.85 + ")"
				});

				var taps = 0;
				$$("div.appicon")[i].addEventListener(touchEventEnd, function() {
					var el = this;
					var transform = window.getComputedStyle(el,null).transform.match(/-?[\d\.]+/g)
					if (!watch.longPress) {
						el.style.transform = "translate3d(" + transform[4] + "px," + transform[5] + "px,0) scale(" + el.getAttribute("data-scale") + ")";
					}
					el.classList.remove("translucent");
					taps++;
		
					if (watch.environments[watch.params.environment].doubleTapHome) {
						setTimeout(function() {
							if (watch.paramsInternal.scrollAvailable && !watch.paramsInternal.scrolling && !watch.longPress) {

								switch (taps) {
			
									case 1: watch.openApp(el); break;
									case 2: watch.home(); break;
								}
							}
							taps = 0;
							el.classList.remove("transition");
						}, 200);
					} else {
						setTimeout(function() {
							watch.openApp(el);
							el.classList.remove("transition");
						}, 200)
					}
				})
			}
			initUI();
			watch.clock().init();
		});
	}
	watch.emulatedForceTouch.init(watch);
	if (typeof watch.params.onInit === "function") {
		watch.params.onInit(watch);
	}
};
var initUI = function() {
	var posRangeY = 0, negRangeY = 0;
	var rows = {}, rowMostPosX = [0,0], rowMostNegX = [0,0];

	for (var i=0; i<watch.hexCube.length; i++) {
		if (typeof(rows[watch.hexCube[i][0].toString()]) !== "object") {
			rows[watch.hexCube[i][0].toString()] = [];
		}
		rows[watch.hexCube[i][0].toString()].push(watch.hexCube[i][1]);
		rows[watch.hexCube[i][0].toString()].sort();

		for (var j=0; j<rows[watch.hexCube[i][0].toString()].length; j++) {
			if (rows[watch.hexCube[i][0].toString()][j] <= rowMostPosX[1] && rowMostPosX[0] != 0) {
				rowMostPosX = [watch.hexCube[i][0], rows[watch.hexCube[i][0].toString()][j]]
			} else if (rows[watch.hexCube[i][0].toString()][j] <= rowMostPosX[1] && rowMostPosX[0] == 0) {
				rowMostPosX = [0, rows[watch.hexCube[i][0].toString()][j]]
			}
			if (rows[watch.hexCube[i][0].toString()][j] >= rowMostNegX[1]) {
				rowMostNegX = [watch.hexCube[i][0], rows[watch.hexCube[i][0].toString()][j]]
			}
		}
	}

	for (var i in rows) {
		posRangeY = Math.min(posRangeY, parseInt(i));
		negRangeY = Math.max(negRangeY, parseInt(i));
	}

	var ranges = watch.calculateMaxRange();
	watch.paramsInternal.scrollRangeX = ranges.maxX;
	watch.paramsInternal.scrollRangeNegX = -ranges.minX;
	watch.paramsInternal.scrollRangeY = ranges.maxY;
	watch.paramsInternal.scrollRangeNegY = -ranges.minY;
	watch.iconPositions = ranges;

	watch.params.target.addEventListener(touchEventStart, function(e) {
		if (!watch.paramsInternal.scrollAvailable) {
			return;
		}

		if (e.touches !== undefined) {
			if (e.touches.length == 2) {
				e.preventDefault();
				return;
			}
			e = e.touches[0];
		}


		window.removeEventListener(touchEventMove, watch._moveIcons);

		watch.paramsInternal.lastX = e.pageX;
		watch.paramsInternal.lastY = e.pageY;
		watch.paramsInternal.deltaX = e.pageX - watch.paramsInternal.lastX;
		watch.paramsInternal.deltaY = e.pageY - watch.paramsInternal.lastY;
		watch.paramsInternal.scrollMoveX += watch.paramsInternal.deltaX;
		watch.paramsInternal.scrollMoveY += watch.paramsInternal.deltaY;
		watch.paramsInternal.scrollX = watch.paramsInternal.scrollMoveX;
		watch.paramsInternal.scrollY = watch.paramsInternal.scrollMoveY;

		clearInterval(watch.inertia);

		window.addEventListener(touchEventMove, watch._moveIcons);

		window.addEventListener(touchEventEnd, watch._iconInertia);
	});

	watch.paramsInternal.scrollX = 0;
	watch.paramsInternal.scrollY = 0;
	watch.paramsInternal.scrollMoveX = 0;
	watch.paramsInternal.scrollMoveY = 0;



	var step = 0;
	var interval = setInterval(function() {
		if (step >= 60) {
			clearInterval(interval);

			watch.paramsInternal.scrollAvailable = true;
			return;
		}

		//watch.params.iconSpacing = Easing.easeOutQuad(null,step+1,2,-1,60);
		//watch.iconMapRefresh(watch.params.carouselSize, watch.params.iconSize, {x: watch.paramsInternal.scrollX, y: watch.paramsInternal.scrollY});
		step++;
	});
	watch.iconMapRefresh(watch.params.carouselSize, watch.params.iconSize, {x: watch.paramsInternal.scrollX, y: watch.paramsInternal.scrollY});
};
var _initClockIcon = require('./_initClockIcon');
var initScrollIndicator = function() {
	if ($("div.scroll-indicator") && watch.views.apps && watch.views.apps.activePage) {
		$("div.scroll-indicator div.scroll-indicator-inner").style.height = (watch.paramsInternal.screenH / watch.views.apps.activePage.container.querySelector("div.page-content").scrollHeight) * 100 + "%";
		watch.views.apps.activePage.container.querySelector("div.page-content").addEventListener("scroll", function() {
			if ($("div.view-app.active") && watch.views.apps.activePage.container.querySelector("div.page-content").scrollHeight > watch.paramsInternal.screenH) {
				clearTimeout(watch.timeouts.scrollIndicator)
				$("div.scroll-indicator").classList.add("visible");

				var el = watch.views.apps.activePage.container.querySelector("div.page-content")
				var _maxScrollTop = (el.scrollTop > el.scrollHeight - watch.paramsInternal.screenH ? el.scrollHeight - watch.paramsInternal.screenH : (el.scrollTop > 0 ? el.scrollTop : 0));
				var _scrollBarTop = (72 - $("div.scroll-indicator div.scroll-indicator-inner").offsetHeight) * (_maxScrollTop / (el.scrollHeight - watch.paramsInternal.screenH));

				$("div.scroll-indicator div.scroll-indicator-inner").style.top = _scrollBarTop+"px";

				watch.timeouts.scrollIndicator = setTimeout(function() {
					$("div.scroll-indicator").classList.remove("visible");
				}, 400)
			}
		});
	}
}


module.exports = function() {
	watch = this;
	initApp()
};