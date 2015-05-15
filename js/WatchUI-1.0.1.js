Framework7.prototype.plugins.WatchUI = function(app, params) {
	window.WatchApp = function(watchParams) {
		var watch = this;

		watch.version = "1.0.1 (1504060172)";

		watch.params = {
			CoreAppListSource: "apps/apps.json",
			CoreHideNavbar: true,
			CoreHomeView: $('div.view#home'),
			CoreIndexIdentifier: "index",
			CoreInitHomeScreen: true,
			CoreHomeMovement: true,
			CoreLoadAppsRemote: false,
			CoreNavbarClock: true,
			CoreNavbarClockElement: 'p.time',
			screenContainer: $("#screen-container"),
			UIIconSize: 60,
			UIBubbleSize: 80,
			UIScrollRangeX: 35,
			UIScrollRangeY: 55,
			UIEnableAppLabels: false
		};

		for (var param in watchParams) {
			watch.params[param] = watchParams[param];
		}

		watch.core = new WatchCore({
			appListSource: watch.params.CoreAppListSource,
			hideNavbar: watch.params.CoreHideNavbar,
			homeView: watch.params.CoreHomeView,
			indexIdentifier: watch.params.CoreIndexIdentifier,
			initHomeScreen: watch.params.CoreInitHomeScreen,
			homeMovement: watch.params.CoreHomeMovement,
			loadAppsRemote: watch.params.CoreLoadAppsRemote,
			navbarClock: watch.params.CoreNavbarClock,
			navbarClockElement: watch.params.CoreNavbarClockElement,
			screenContainer: watch.params.screenContainer,
			main: watch,
		});
		watch.ui = new WatchUI({
			screenContainer: watch.params.screenContainer,
			iconSize: watch.params.UIIconSize,
			bubbleSize: watch.params.UIBubbleSize,
			scrollRangeX: watch.params.UIScrollRangeX,
			scrollRangeY: watch.params.UIScrollRangeY,
			enableAppLabels: watch.params.UIEnableAppLabels
		});
	};

	window.WatchCore = function(coreParams) {
		var core = this;

		core.version = "1.2 (1504050231)";

		core.params = {
			appList: [],
		}

		for (var param in coreParams) {
			core.params[param] = coreParams[param];
		}

		core.intervals = [];


		/* Methods */
		core.init = function() {
			$.ajaxSetup({
				//cache: false
			});

			if (navigator.standalone) {
				$("body").addClass("standalone");
				if (/(iPad)/g.test( navigator.userAgent)) {
					$('body').addClass('ipad');
				}
			}

			if (!core.params.hideNavbar) {
				$("div.navbar").css("opacity", 1);
			}

			if (core.params.initHomeScreen) {
				if (core.params.loadAppsRemote) {
					core.params.appList = core.apps.getAppList();
				}

				core.apps.initHomeScreen();
			}

			if (core.params.navbarClock) {
				core.clock.init();
			}

			Dom7(document).on("pageInit", function() {
				if (core.params.navbarClock) {
					core.clock.set();
				}

				$('a.link.watch-home').off("click");
				$('a.link.watch-home').on("click", function() {
					core.home(true);
				});
			});
		};
		core.clock = {
			init: function() {
				core.clock.set();
				core.intervals.push(setInterval(core.clock.set, 500));
			},
			set: function() {
				var today = new Date();
				var h = today.getHours();
				var m = today.getMinutes();

				h = (h < 10) ? "0" + h : h;
				m = (m < 10) ? "0" + m : m;
				$(core.params.navbarClockElement).html(h + ":" + m);
			}
		}

		core.apps = {
			initHomeScreen: function() {
				if (core.params.loadAppsRemote) {
					for (var i = 0; i < core.params.appList.length; i++) {
						var appInfo = core.params.appList[i];
						core.params.homeView.append("<div class=\"appicon " + appInfo.identifier + "\" id=\"apps/" + appInfo.bundleID + "/" + appInfo.executable + "\"><img src=\""+appInfo.icon+"\"><p class=\"label\">"+appInfo.title+"</p></div>");
					}
				}

				setTimeout(function() {
					core.home();

					core.params.screenContainer.on((core.params.homeMovement?"touchstart mousedown":""), function(e) {
						if (core.params.main.ui.params.scrollAvailable === false) {
							return;
						};

						$(window).off("touchmove mousemove");

						core.params.main.ui.params.lastX = e.originalEvent.pageX;
						core.params.main.ui.params.lastY = e.originalEvent.pageY;
						core.params.main.ui.params.deltaX = e.originalEvent.pageX - core.params.main.ui.params.lastX;
						core.params.main.ui.params.deltaY = e.originalEvent.pageY - core.params.main.ui.params.lastY;
						core.params.main.ui.params.scrollMoveX += core.params.main.ui.params.deltaX;
						core.params.main.ui.params.scrollMoveY += core.params.main.ui.params.deltaY;
						core.params.main.ui.params.scrollX = core.params.main.ui.params.scrollMoveX;
						core.params.main.ui.params.scrollY = core.params.main.ui.params.scrollMoveY;


						clearInterval(core.params.main.ui.params.inertia);

						$(window).on('touchmove mousemove', function(e) {
							e.preventDefault();
							e.stopPropagation();
							scrolling = true;

							$('.appicon.active').removeClass("active");

							if (e.originalEvent.touches !== undefined) {
								e.originalEvent = e.originalEvent.touches[0];
							};

							core.params.main.ui.params.deltaX = e.originalEvent.pageX - core.params.main.ui.params.lastX;
							core.params.main.ui.params.deltaY = e.originalEvent.pageY - core.params.main.ui.params.lastY;

							core.params.main.ui.params.lastX = e.originalEvent.pageX;
							core.params.main.ui.params.lastY = e.originalEvent.pageY;

							core.params.main.ui.params.scrollMoveX += core.params.main.ui.params.deltaX;
							core.params.main.ui.params.scrollMoveY += core.params.main.ui.params.deltaY;

							core.params.main.ui.params.scrollX = core.params.main.ui.params.scrollMoveX;
							core.params.main.ui.params.scrollY = core.params.main.ui.params.scrollMoveY;


							if (core.params.main.ui.params.scrollMoveX > core.params.main.ui.params.scrollRangeX) {
								core.params.main.ui.params.scrollX = core.params.main.ui.params.scrollRangeX + (core.params.main.ui.params.scrollMoveX - core.params.main.ui.params.scrollRangeX) / 2;
							} else if (core.params.main.ui.params.scrollX < - core.params.main.ui.params.scrollRangeX) {
								core.params.main.ui.params.scrollX = - core.params.main.ui.params.scrollRangeX + (core.params.main.ui.params.scrollMoveX + core.params.main.ui.params.scrollRangeX) / 2;
							}

							if (core.params.main.ui.params.scrollMoveY > core.params.main.ui.params.scrollRangeY) {
								core.params.main.ui.params.scrollY = core.params.main.ui.params.scrollRangeY + (core.params.main.ui.params.scrollMoveY - core.params.main.ui.params.scrollRangeY) / 2;
							} else if (core.params.main.ui.params.scrollY < - core.params.main.ui.params.scrollRangeY) {
								core.params.main.ui.params.scrollY = - core.params.main.ui.params.scrollRangeY + (core.params.main.ui.params.scrollMoveY + core.params.main.ui.params.scrollRangeY) / 2;
							}

							core.params.main.ui.iconMapRefresh(core.params.main.ui.params.bubbleSize, core.params.main.ui.params.iconSize, {
								x : core.params.main.ui.params.scrollX,
								y: core.params.main.ui.params.scrollY
							})
						});
						$(window).on("touchend mouseup" , function(e) {
							$(window).off("touchmove mousemove touchend mouseup");

							setTimeout(function() {
								scrolling = false;
							}, 10);

							var step = 1,
							steps = 32,
							veloX = core.params.main.ui.params.deltaX,
							veloY = core.params.main.ui.params.deltaY,
							distanceX = veloX * 10,
							distanceY = veloY * 10;

							core.params.main.ui.params.inertia = setInterval(function() {
								if (step > steps) {
									clearInterval(core.params.main.ui.params.inertia);
								};

								core.params.main.ui.params.scrollMoveX = core.params.main.ui.params.scrollX;
								core.params.main.ui.params.scrollMoveY = core.params.main.ui.params.scrollY;

								core.params.main.ui.params.inertiaX = $.easing["easeOutCubic"](null, step, 0, distanceX, steps) - $.easing["easeOutCubic"](null, (step - 1), 0, distanceX, steps);
								core.params.main.ui.params.inertiaY = $.easing["easeOutCubic"](null, step, 0, distanceY, steps) - $.easing["easeOutCubic"](null, (step - 1), 0, distanceY, steps);

								core.params.main.ui.params.scrollX += core.params.main.ui.params.inertiaX;
								core.params.main.ui.params.scrollY += core.params.main.ui.params.inertiaY;

								if (core.params.main.ui.params.scrollX > core.params.main.ui.params.scrollRangeX) {
									core.params.main.ui.params.scrollX -= (core.params.main.ui.params.scrollX - core.params.main.ui.params.scrollRangeX) / 4;
								} else if (core.params.main.ui.params.scrollX < - core.params.main.ui.params.scrollRangeX) {
									core.params.main.ui.params.scrollX -= (core.params.main.ui.params.scrollX + core.params.main.ui.params.scrollRangeX) / 4;
								}

								if (core.params.main.ui.params.scrollY > core.params.main.ui.params.scrollRangeY) {
									core.params.main.ui.params.scrollY -= (core.params.main.ui.params.scrollY - core.params.main.ui.params.scrollRangeY) / 4;
								} else if (core.params.main.ui.params.scrollY < - core.params.main.ui.params.scrollRangeY) {
									core.params.main.ui.params.scrollY -= (core.params.main.ui.params.scrollY + core.params.main.ui.params.scrollRangeY) / 4;
								}

								core.params.main.ui.iconMapRefresh(core.params.main.ui.params.bubbleSize, core.params.main.ui.params.iconSize, {
									x : core.params.main.ui.params.scrollX,
									y: core.params.main.ui.params.scrollY
								});
								step++;
							}, 16)
						})
					});

					$('.appicon').on("touchstart mousedown", function() {
						var el = $(this);

						/*el.addClass("active");

						el.attr("data-scale", el.css("transform").match(/-?[\d\.]+/g)[0]);
						el.css({
							"transform": "translate3d(" + el.css("transform").match(/-?[\d\.]+/g)[4] + "px," + el.css("transform").match(/-?[\d\.]+/g)[5] + "px,0) scale(" + el.css("transform").match(/-?[\d\.]+/g)[0] * 0.85 + ")"
						});*/
					});
					$(".appicon").click(function() {
						if (scrolling || core.params.main.ui.homeVisible) {
							return;
						}

						var el = $(this);
						var cl = $(this).attr("id");

						var timeout;

						if (core.params.main.ui.params.scrollX == parseInt(el.attr("data-x")) && core.params.main.ui.params.scrollY == parseInt(el.attr("data-Y"))) {
							timeout = 0;
						} else {
							core.params.main.ui.moveHome(parseInt(el.attr("data-x")), parseInt(el.attr("data-y")),400);
							timeout = 400;
						}

						var width, height;

						if ($("div.views").outerWidth() > $("div.views").outerHeight()) {
							width = height = $("div.views").outerHeight();
						} else if ($("div.views").outerHeight() > $("div.views").outerWidth()) {
							height = width = $("div.views").outerWidth();
						}

						mainView.router.loadPage({
							url: cl,
							animatePages: false
						});


						$("div.views").css({
							opacity: 0,
							overflow: "hidden"
						});

						setTimeout(function() {
							core.params.main.ui.homeVisible = false;

							$("div.views").show();
							$("div.views").velocity({
								display: "block",
								opacity: [[1],1],
								scale: [[1],0],
								/*width: [[$("div.views").outerWidth()], width],
								height: [[$("div.views").outerHeight()], height],
								/*marginLeft: [[0], window.innerWidth/2-width/2],
								marginTop: [[0], (window.innerHeight/2-height/2)]*/
							}, {
								easing: [0.77, 0, 0.175, 1],
								duration: 600,
							});
							core.params.homeView.velocity({
								scale: [[4], 1],
								opacity: [[0], 1],
							}, {
								easing: [0.77, 0, 0.175, 1],
								duration: 600,
							});
						}, timeout);


						/*core.params.main.ui.homeVisible = false;

						var cl = $(this).attr("id");
						var el = $(this);

						el.css({
							"transform": "translate3d(" + el.css("transform").match(/-?[\d\.]+/g)[4] + "px," + el.css("transform").match(/-?[\d\.]+/g)[5] + "px,0) scale(" + el.attr("data-scale") + ")"
						})
						core.params.homeView.removeAttr("style");
						mainView.router.loadPage({
							url: cl,
							animatePages: false
						});

						$("div.views").css("opacity",0);
						$("div.views").show();

						if ($("div.views").outerWidth() > $("div.views").outerHeight()) {

						} else if ($("div.views").outerHeight() > $("div.views").outerWidth()) {

						}


						$("div.views").velocity({
							display: "block",
							scale: [[1],0],
							opacity: [[1],1]
						}, {
							easing: [0.77, 0, 0.175, 1],
							duration: 600,
						});
						core.params.homeView.velocity({
							scale: [[4], 1],
							opacity: [[0], 1],
						}, {
							easing: [0.77, 0, 0.175, 1],
							duration: 600,
						});*/
					});

					var homeReset = new Hammer(document.querySelector("div#screen-container"));
					homeReset.on('doubletap', function(ev) {
						core.params.main.ui.moveHome(0,0,400);
						ev.preventDefault();
					});
				}, 100);
			},

			getAppList: function() {
				var apps;
				$.ajax({
					url: core.params.appListSource,
					dataType: "json",
					async: false,
					success: function(data) {
						apps = data.apps;
					}
				});
				return apps;
			},
			getAppInfo: function(appID) {
				if (core.params.appList.length > 0) {
					return core.params.appList[core.getIndexIfObjWithOwnAttr(core.params.appList, "identifier", appID)];
				} else {
					core.params.appList = core.apps.getAppList();
					return core.params.appList[core.getIndexIfObjWithOwnAttr(core.params.appList, "identifier", appID)];
				}
			},
			returnAppInfo: function(appInfoObject) {
				return appInfoObject;
			}
		};
		core.home = function(appClosingTimeout) {
			appClosingTimeout = typeof appClosingTimeout !== 'undefined' ? appClosingTimeout : false;
			scrollAvailable = false;

			$('div.page[data-page="'+core.params.indexIdntifier+'"]').removeClass("page-on-left");
			setTimeout(function() {

				/*core.params.main.ui.params.scrollX = 0;
				core.params.main.ui.params.scrollY = 0;
				core.params.main.ui.params.scrollMoveX = 0;
				core.params.main.ui.params.scrollMoveY = 0;

				core.params.main.ui.iconMapRefresh(core.params.main.ui.params.bubbleSize, core.params.main.ui.params.iconSize, {x : 0,y: 0});*/

				var openingStep = 0;
				var openingTimer = setInterval(function() {
					if (openingStep > 5) {
						clearInterval(openingTimer);
						scrollAvailable = true;
					};

					/*core.params.main.ui.iconMapRefresh(core.params.main.ui.params.bubbleSize, core.params.main.ui.params.iconSize, {
						x : 0,
						y: 0
					})*/
					openingStep++;
				}, 16)
				$("#home").show();
				setTimeout(function() {
					$('#home').velocity({
						scale: [[1], 4],
						opacity: [[1], 0],
					}, {
						easing: [0.77, 0, 0.175, 1],
						duration: 600
					})
				}, 10);

				core.params.main.ui.params.homeVisible = true;

				/*mainView.router.loadPage({
					pageName: "index",
					animatePages: false
				});*/
				mainView.history = [mainView.history[0]];
				mainView.activePage = mainView.initialPages[0].f7PageData;
				mainView.url = mainView.initialPages[0].f7PageData.url;
				$('div.page[data-page="index"]').removeClass("page-on-left");
			}, ((appClosingTimeout)) ? 0 : 0);

			if (appClosingTimeout) {
				/*$('div.view.view-main').velocity({
					scale: [[0], 1],
					opacity: 0
				}, {
					easing: [0.55, 0.055, 0.675, 0.19],
					duration: 300,
					complete: function() {
						$('div.view.view-main, div.navbar').removeAttr("style");
						$('div.page:not([data-page="index"])').remove();
						$('div.navbar-inner').remove();
					}
				});*/
				$("div.views").velocity({
					scale: [[0],1],
					opacity: [[1],1]
				}, {
					easing: [0.77, 0, 0.175, 1],
					duration: 600,
					complete: function() {
						$('div.view.view-main, div.navbar').removeAttr("style");
					$('div.page:not([data-page="index"])').remove();
					$('div.navbar-inner').remove();
					}
				});
				setTimeout(function() {
					
				}, 600);
			}
		};

		core.getIndexIfObjWithOwnAttr = function(array, attr, value) {
			for (var i = 0; i < array.length; i++) {
				if (array[i].hasOwnProperty(attr) && array[i][attr] === value) {
					return i;
				}
			}
			return - 1;
		};

		core.init();
	};
	window.WatchUI = function (uiParams) {
		var ui = this;

		ui.version = "1.3 (1504040280)";

		ui.params = {
			scrollX: 0,
			scrollY: 0,
			scrollMoveX: 0,
			scrollMoveY: 0,
			lastX: undefined,
			lastY: undefined,
			deltaX: undefined,
			deltaY: undefined,
			scrollRangeX: 80,
			scrollRangeY: 60,
			inertia: undefined,
			inertiaX: undefined,
			inertiaY: undefined,
			scrollAvailable: true,
			homeVisible: true,
			enableAppLabels: false
		};

		for (var param in uiParams) {
			ui.params[param] = uiParams[param];
		}

		ui.screen = $("#screen-container");

		ui.renderAllowed = true;

		/* Methods */
		ui.init = function() {
			ui.screenW = ui.screen.outerWidth();
			ui.screenH = ui.screen.outerHeight();
			ui.centerW = ui.screenW / 2;
			ui.centerH = ui.screenH / 2;

			ui.hexCube = new Array();
			for (var i = 0; i < 3; i++) {
				for (var j = - i; j <= i; j++) {
					for (var k = - i; k <= i; k++) {
						for (var l = - i; l <= i; l++) {
							if (Math.abs(j) + Math.abs(k) + Math.abs(l) == i * 2 && j + k + l == 0) {
								ui.hexCube.push([j, k, l]);
							}
						}
					}
				}
			}
			
			if (ui.params.enableAppLabels) {
				$('body').addClass("app-labels");

			}
		};
		ui.iconMapRefresh = function (sphereR, hexR, scroll, _option) {
			if (!ui.params.homeVisible || !ui.renderAllowed) {
				return;
			}

			ui.renderAllowed = false;

			hexCubeOrtho = new Array(),
			hexCubePolar = new Array(),
			hexCubeSphere = new Array();

			var option = {
				iconZoom : 1,
				edgeZoom : true,
			}


			if (scroll === undefined) {
				var scrollX = 0,
				scrollY = 0;
			} else {
				var scrollX = scroll.x,
				scrollY = scroll.y;
			}

			function polar2ortho (r, rad) {
				var x = r * Math.cos(rad);
				var y = r * Math.sin(rad);
				return {
					"x" : x,
					"y" : y,
				}
			}

			function ortho2polar (x, y) {
				var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
				var rad = Math.atan2(y, x);
				return {
					"r" : r,
					"rad" : rad,
				}
			}

			for (i in ui.hexCube) {
				hexCubeOrtho[i] = {
					"x": (ui.hexCube[i][1] + ui.hexCube[i][0] / 2) * hexR + scrollX,
					"y": Math.sqrt(3) / 2 * ui.hexCube[i][0] * hexR + scrollY,
				}

				if ($("div.appicon:nth-child("+(parseInt(i)+1)+")").attr("data-x") === undefined) {
					$("div.appicon:nth-child("+(parseInt(i)+1)+")").attr("data-x",-hexCubeOrtho[i].x);
					$("div.appicon:nth-child("+(parseInt(i)+1)+")").attr("data-y",-hexCubeOrtho[i].y);
				}
			}

			for (i in hexCubeOrtho) {
				hexCubePolar[i] = ortho2polar(hexCubeOrtho[i].x, hexCubeOrtho[i].y);
			}

			for (i in hexCubePolar) {
				var rad = hexCubePolar[i].r / sphereR;
				if (rad < Math.PI / 2) {
					var r = hexCubePolar[i].r * $.easing["swing"](null, rad / (Math.PI / 2), 1.5, - 0.5, 1);
					var deepth = $.easing["easeInOutCubic"](null, rad / (Math.PI / 2), 1, - 0.5, 1);
				} else {
					var r = hexCubePolar[i].r;
					var deepth = $.easing["easeInOutCubic"](null, 1, 1, - 0.5, 1);
				}

				hexCubeSphere[i] = {
					"r" : r,
					"deepth" : deepth,
					"rad" : hexCubePolar[i].rad,
				}
			}

			for (i in hexCubeSphere) {
				hexCubeOrtho[i] = polar2ortho(hexCubeSphere[i].r, hexCubeSphere[i].rad);
			}

			for (i in hexCubeOrtho) {
				var factor = ((ui.params.enableAppLabels)) ? 1.5 : 1;
				hexCubeOrtho[i].x = Math.round(hexCubeOrtho[i].x * 10) / 10 * factor;
				hexCubeOrtho[i].y = Math.round(hexCubeOrtho[i].y * 10) / 10 * factor;
			}

			if (option.edgeZoom === true) {
				var edge = 20;
				for (i in hexCubeOrtho) {
					if (Math.abs(hexCubeOrtho[i].x) > ui.screenW / 2 - edge || Math.abs(hexCubeOrtho[i].y) > ui.screenH / 2 - edge) {
						hexCubeOrtho[i].scale = hexCubeSphere[i].deepth * 0.4;
					} else if (Math.abs(hexCubeOrtho[i].x) > ui.screenW / 2 - 2 * edge && Math.abs(hexCubeOrtho[i].y) > ui.screenH / 2 - 2 * edge) {
						hexCubeOrtho[i].scale = Math.min(hexCubeSphere[i].deepth * $.easing["easeInOutSine"](null, ui.screenW / 2 - Math.abs(hexCubeOrtho[i].x) - edge, 0.4, 0.6, edge), hexCubeSphere[i].deepth * $.easing["easeInOutSine"](null, ui.screenH / 2 - Math.abs(hexCubeOrtho[i].y) - edge, 0.3, 0.7, edge) );
					} else if (Math.abs(hexCubeOrtho[i].x) > ui.screenW / 2 - 2 * edge) {
						hexCubeOrtho[i].scale = hexCubeSphere[i].deepth * $.easing["easeOutSine"](null, ui.screenW / 2 - Math.abs(hexCubeOrtho[i].x) - edge, 0.4, 0.6, edge);
					} else if (Math.abs(hexCubeOrtho[i].y) > ui.screenH / 2 - 2 * edge) {
						hexCubeOrtho[i].scale = hexCubeSphere[i].deepth * $.easing["easeOutSine"](null, ui.screenH / 2 - Math.abs(hexCubeOrtho[i].y) - edge, 0.4, 0.6, edge);
					} else {
						hexCubeOrtho[i].scale = hexCubeSphere[i].deepth;
					}
				}

				for (i in hexCubeOrtho) {
					if (hexCubeOrtho[i].x < - ui.screenW / 2 + 2 * edge) {
						hexCubeOrtho[i].x += $.easing["easeInSine"](null, ui.screenW / 2 - Math.abs(hexCubeOrtho[i].x) - 2 * edge, 0, 6, 2 * edge);
					} else if (hexCubeOrtho[i].x > ui.screenW / 2 - 2 * edge) {
						hexCubeOrtho[i].x += $.easing["easeInSine"](null, ui.screenW / 2 - Math.abs(hexCubeOrtho[i].x) - 2 * edge, 0, - 6, 2 * edge);
					};
					if (hexCubeOrtho[i].y < - ui.screenH / 2 + 2 * edge) {
						hexCubeOrtho[i].y += $.easing["easeInSine"](null, ui.screenH / 2 - Math.abs(hexCubeOrtho[i].y) - 2 * edge, 0, 8, 2 * edge);
					} else if (hexCubeOrtho[i].y > ui.screenH / 2 - 2 * edge) {
						hexCubeOrtho[i].y += $.easing["easeInSine"](null, ui.screenH / 2 - Math.abs(hexCubeOrtho[i].y) - 2 * edge, 0, - 8, 2 * edge);
					}
				}
			};

			for (var i = 0; i < $(".appicon").length; i++) {
				$(".appicon").eq(i).transform({
					"x": hexCubeOrtho[i].x,
					"y": hexCubeOrtho[i].y,
					"scale": hexCubeOrtho[i].scale,
				});
				$(".appicon p.label").eq(i).css({
					"opacity": (hexCubeOrtho[i].scale-0.5)/0.5,
				});
			}


			setTimeout(function() {
				ui.renderAllowed = true
			}, 1000/120);
		};


		ui.animationEnabled = true;
		ui.currentTime = 0;
		
		ui.moveHome = function(x,y,duration) {
			if (!scrolling) {
				ui.currentTime = 0;
				scrolling = true;
				ui.startX = ui.params.scrollX;
				ui.startY = ui.params.scrollY;
			}
			ui.currentTime = ui.currentTime+(1000/60);

			setTimeout(function() {
				if (ui.currentTime<=duration && ui.animationEnabled) {

					ui.requestID = requestAnimFrame(function() {
						ui.moveHome(x,y,duration);
					}, $("div#screencontainer"));
					ui._moveHome(x,y,ui.currentTime,duration,ui.startX,ui.startY);
				} else {
					ui._moveHome(x,y,duration,duration,ui.startX,ui.startY);
					scrolling = false;
					webkitCancelRequestAnimationFrame(ui.requestID);

					ui.animationEnabled = true;
				}
			}, 0);
		};
		ui._moveHome = function(x,y,frame,duration,startX,startY) {
			if (ui.params.scrollX == x && ui.params.scrollY == y) {
				return;
			}

			var easing = "easeOutQuart";

			ui.params.scrollX = $.easing[easing](null,frame, startX, x-startX, duration);
			ui.params.scrollY = $.easing[easing](null,frame, startY, y-startY, duration);

			ui.params.scrollMoveX = ui.params.scrollX;
			ui.params.scrollMoveY = ui.params.scrollY;

			ui.iconMapRefresh(80,60,{x:ui.params.scrollX,y:ui.params.scrollY});
		}

		ui.init();
		ui.iconMapRefresh(ui.params.bubbleSize, ui.params.iconSize, {
			x : 0,
			y: 0
		});
	};

	(function() {
		var old_modal = app.modal;

		app.modal = function (options) {
			old_modal(options);
			$("div.modal").css("margin-left",-$("div.modal").outerWidth()/2)
		}
	})();
	
	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame       ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame    ||
				function( callback ){
					window.setTimeout(callback, 1000 / 20);
				};
	})();
}

$.fn.extend({
	transform: function(_transform) {
		this.each(function() {
			var $this = $(this)
			if ($this.data("transform") === undefined) {
				$this.data("transform", {});
			}
			$.extend($this.data("transform"), _transform);

			var transformCSS,
			translate3d = ["0", "0", "0"],
			scale = "1";

			for (n in $this.data("transform")) {
				switch (n) {
				case "x" :
					if (typeof($this.data("transform").x) === "number") {
						translate3d[0] = $this.data("transform").x + "px";
					} else {
						translate3d[0] = $this.data("transform").x;
					}
					break;

				case "y" :
					if (typeof($this.data("transform").y) === "number") {
						translate3d[1] = $this.data("transform").y + "px";
					} else {
						translate3d[1] = $this.data("transform").y;
					}
					break;

				case "z" :
					if (typeof($this.data("transform").z) === "number") {
						translate3d[2] = $this.data("transform").z + "px";
					} else {
						translate3d[2] = $this.data("transform").z;
					}
					break;

				case "scale" :
					scale = $this.data("transform").scale;
					break;
				}
			}

			if (translate3d === ["0", "0", "0"]) {
				translate3d = "";
			} else {
				translate3d = "translate3d(" + translate3d + ")";
			}

			if (scale === "1") {
				scale = "";
			} else {
				scale = "scale(" + scale + ")"
			}
			transformCSS = translate3d + " " + scale;

			$this.css("transform", transformCSS);

		})
	},
});

var scrolling = false;
