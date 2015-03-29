var getIndexIfObjWithOwnAttr = function(array, attr, value) {
	for(var i = 0; i < array.length; i++) {
		if(array[i].hasOwnProperty(attr) && array[i][attr] === value) {
			return i;
		}
	}
	return -1;
};

var setNavbarClock = function() {
	var today=new Date();
	var h=today.getHours();
	var m=today.getMinutes();
	
	h = (h<10) ? "0"+h : h;
	m = (m<10) ? "0"+m : m;
	$('p.time').html(h+":"+m);
};

(function() {
	"use strict",
	window.WatchApp = function(params) {
		var app = this;
		
		app.version = "2.1 (1503290121)"
	};
	
	window.WatchCore = function(params) {
		var core = this;

		core.version = "1.1 (1503290083)";

		core.params = {
			appList: [],
			appListSource: "apps/apps.json",
			homeView: $('div.view#home'),
			screenContainer: $("#screen-container"),
			indexIdentifier: "index",
			hideNavbar: true,

			initHomeScreen: true,
			loadAppsRemote: false,
			
			navbarClock: true,
			navbarClockElement: $('p.time'),
		};
		
		core.intervals = [];
		
		for (var param in params) {
			core.params[param] = params[param];
		}

		core.init = function() {
			$.ajaxSetup({ cache: false });
			
			if (navigator.standalone) {
				$("body").addClass("standalone");
				if (/(iPad)/g.test( navigator.userAgent)) {
					$('body').addClass('ipad');
				}
			}
			
			if (!core.params.hideNavbar) {
				$("div.navbar").css("opacity",1);
			}
			
			if (core.params.initHomeScreen) {
				if (core.params.loadAppsRemote) {
					core.params.appList = core.apps.getAppList();
				}
				
				if (!core.params.loadAppsRemote) {
					core.apps.initHomeScreen();
				}
			}
			
			if (core.params.navbarClock) {
				core.initNavbarClock();
			}
			
			Dom7(document).on("pageInit", function() {
				if (core.params.navbarClock) {
					setNavbarClock();
				}
				
				$('a.link.watch-home').off("click");
				$('a.link.watch-home').on("click", function() {
					core.home(true);
				});
			});
		};
		
		core.initNavbarClock = function() {
			setNavbarClock();
			
			core.intervals.push(setInterval(setNavbarClock, 500));
		}
		
		core.home = function(appClosingTimeout) {
			appClosingTimeout = typeof appClosingTimeout !== 'undefined' ? appClosingTimeout : false;
			scrollAvailable = false;

			$('div.page[data-page="index"]').removeClass("page-on-left");
			setTimeout(function(){

				core.watchUI.params.scrollX = 0;
				core.watchUI.params.scrollY = 0;
				core.watchUI.params.scrollMoveX = 0;
				core.watchUI.params.scrollMoveY = 0;

				core.watchUI.iconMapRefresh(100, core.watchUI.params.iconSize, {x : 0, y: 0});

				var openingStep = 0;
				var openingTimer = setInterval(function() {
					if (openingStep > 5) {
						clearInterval(openingTimer);
						scrollAvailable = true;
					};

					core.watchUI.iconMapRefresh(100, core.watchUI.params.iconSize, {x : 0, y: 0})
					openingStep++;
				},16)

				$("#home").show();
				setTimeout(function(){
					$('#home').velocity({
						scale: [[1], 2],
						opacity: [[1], 0],
					}, {
						easing: [0.19, 1, 0.22, 1],
						duration: 600
					})
				}, 10);

				core.watchUI.homeVisible = true;

				mainView.router.loadPage({pageName: "index",animatePages:false});
				mainView.history = [mainView.history[0]];
				$('div.page[data-page="index"]').removeClass("page-on-left");
			}, ((appClosingTimeout)) ? 300 : 0);

			if (appClosingTimeout) {
				$('div.view.view-main').velocity({
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
				});
			}
		};
		
		core.watchUI = new WatchUI({
			core: core
		});
		
		core.apps = {
			initHomeScreen: function() {
				if (core.params.loadAppRemote) {
					for (var i=0; i<core.params.appList.length;i++) {
						var appInfo = core.params.appList[i];
						core.params.homeView.append("<div class=\"appicon "+appInfo.identifier+"\" id=\"apps/"+appInfo.bundleID+"/"+appInfo.executable+"\"></div>")
					}
				}

				setTimeout(function() {
					/*core.watchUI = new WatchUI({
						core: core
					});*/
					core.home();
					
					core.params.screenContainer.on("touchstart mousedown", function(e) {
						if (core.watchUI.params.scrollAvailable === false) {
							return;
						};
					
						$(window).off("touchmove mousemove");
					
						core.watchUI.params.lastX = e.originalEvent.pageX;
						core.watchUI.params.lastY = e.originalEvent.pageY;
						core.watchUI.params.deltaX = e.originalEvent.pageX - core.watchUI.params.lastX;
						core.watchUI.params.deltaY = e.originalEvent.pageY - core.watchUI.params.lastY;
						core.watchUI.params.scrollMoveX += core.watchUI.params.deltaX;
						core.watchUI.params.scrollMoveY += core.watchUI.params.deltaY;
						core.watchUI.params.scrollX = core.watchUI.params.scrollMoveX;
						core.watchUI.params.scrollY = core.watchUI.params.scrollMoveY;
					
					
						clearInterval(core.watchUI.params.inertia);
					
						$(window).on('touchmove mousemove', function(e){
							e.preventDefault();
							e.stopPropagation();
							scrolling = true;
					
							$('.appicon.active').removeClass("active");
					
							if (e.originalEvent.touches !== undefined) {
								e.originalEvent = e.originalEvent.touches[0];
							};
					
							core.watchUI.params.deltaX = e.originalEvent.pageX - core.watchUI.params.lastX;
							core.watchUI.params.deltaY = e.originalEvent.pageY - core.watchUI.params.lastY;
					
							core.watchUI.params.lastX = e.originalEvent.pageX;
							core.watchUI.params.lastY = e.originalEvent.pageY;
					
							core.watchUI.params.scrollMoveX += core.watchUI.params.deltaX;
							core.watchUI.params.scrollMoveY += core.watchUI.params.deltaY;
					
							core.watchUI.params.scrollX = core.watchUI.params.scrollMoveX;
							core.watchUI.params.scrollY = core.watchUI.params.scrollMoveY;
					
					
							if(core.watchUI.params.scrollMoveX > core.watchUI.params.scrollRangeX) {
								core.watchUI.params.scrollX = core.watchUI.params.scrollRangeX + (core.watchUI.params.scrollMoveX - core.watchUI.params.scrollRangeX)/2;
							} else if (core.watchUI.params.scrollX < -core.watchUI.params.scrollRangeX) {
								core.watchUI.params.scrollX = -core.watchUI.params.scrollRangeX + (core.watchUI.params.scrollMoveX + core.watchUI.params.scrollRangeX)/2;
							}
					
							if(core.watchUI.params.scrollMoveY > core.watchUI.params.scrollRangeY) {
								core.watchUI.params.scrollY = core.watchUI.params.scrollRangeY + (core.watchUI.params.scrollMoveY - core.watchUI.params.scrollRangeY)/2;
							} else if (core.watchUI.params.scrollY < -core.watchUI.params.scrollRangeY) {
								core.watchUI.params.scrollY = -core.watchUI.params.scrollRangeY + (core.watchUI.params.scrollMoveY + core.watchUI.params.scrollRangeY)/2;
							}
					
							core.watchUI.iconMapRefresh(100, core.watchUI.params.iconSize, {x : core.watchUI.params.scrollX, y: core.watchUI.params.scrollY})
						});
						$(window).on("touchend mouseup" ,function(e) {
							$(window).off("touchmove mousemove touchend mouseup");
					
							setTimeout(function() {
								scrolling = false;
							}, 10);
					
							var step = 1,
								steps = 32,
								veloX = core.watchUI.params.deltaX,
								veloY = core.watchUI.params.deltaY,
								distanceX = veloX * 10,
								distanceY = veloY * 10;
					
							core.watchUI.params.inertia = setInterval(function() {
								if (step > steps) {
									clearInterval(core.watchUI.params.inertia);
								};
					
								core.watchUI.params.scrollMoveX = core.watchUI.params.scrollX;
								core.watchUI.params.scrollMoveY = core.watchUI.params.scrollY;
					
								core.watchUI.params.inertiaX = $.easing["easeOutCubic"](null, step, 0, distanceX, steps) - $.easing["easeOutCubic"](null, (step - 1), 0, distanceX, steps);
								core.watchUI.params.inertiaY = $.easing["easeOutCubic"](null, step, 0, distanceY, steps) - $.easing["easeOutCubic"](null, (step - 1), 0, distanceY, steps);
					
								core.watchUI.params.scrollX += core.watchUI.params.inertiaX;
								core.watchUI.params.scrollY += core.watchUI.params.inertiaY;
					
								if(core.watchUI.params.scrollX > core.watchUI.params.scrollRangeX) {
									core.watchUI.params.scrollX -= (core.watchUI.params.scrollX - core.watchUI.params.scrollRangeX)/4;
								}else if (core.watchUI.params.scrollX < -core.watchUI.params.scrollRangeX) {
									core.watchUI.params.scrollX -= (core.watchUI.params.scrollX + core.watchUI.params.scrollRangeX)/4;
								}
					
								if(core.watchUI.params.scrollY > core.watchUI.params.scrollRangeY) {
									core.watchUI.params.scrollY -= (core.watchUI.params.scrollY - core.watchUI.params.scrollRangeY)/4;
								}else if (core.watchUI.params.scrollY < -core.watchUI.params.scrollRangeY) {
									core.watchUI.params.scrollY -= (core.watchUI.params.scrollY + core.watchUI.params.scrollRangeY)/4;
								}
					
								core.watchUI.iconMapRefresh(100, core.watchUI.params.iconSize, {x : core.watchUI.params.scrollX, y: core.watchUI.params.scrollY});
								step++;
							},16)
						})
					});
					$('.appicon').on("touchstart mousedown", function() {
						var el = $(this);
					
						el.addClass("active");
		
						el.attr("data-scale", el.css("transform").match(/-?[\d\.]+/g)[0]);
						el.css({
							"transform": "translate3d("+el.css("transform").match(/-?[\d\.]+/g)[4]+"px,"+el.css("transform").match(/-?[\d\.]+/g)[5]+"px,0) scale("+el.css("transform").match(/-?[\d\.]+/g)[0]*0.85+")"
						});
					});
					$(".appicon").click(function(){
						if (scrolling || !core.watchUI.homeVisible) {
							return;
						}
						core.watchUI.homeVisible = false;
		
						var cl = $(this).attr("id");
						var el = $(this);
						
						el.css({
							"transform": "translate3d("+el.css("transform").match(/-?[\d\.]+/g)[4]+"px,"+el.css("transform").match(/-?[\d\.]+/g)[5]+"px,0) scale("+el.attr("data-scale")+")"
						})
		
						core.params.homeView.removeAttr("style");
						core.params.homeView.velocity({
							scale: 2,
							opacity: [[0],1],
						}, {
							easing: [0.895, 0.03, 0.685, 0.22],
							duration: 300,
							complete: function() {
								mainView.router.loadPage({
									url: cl,
									animatePages:false
								});
		
								setTimeout(function() {
									setTimeout(function() {
										$('div.page:not([data-page="'+core.params.indexIdentifier+'"]) div.page-content, div.navbar').css("opacity",1);
									}, 100);
									$('div.view.view-main').velocity({
										scale: [[1], 0],
										opacity: 1
									}, {
										easing: [0.19, 1, 0.22, 1],
										duration: 600
									});
								}, 50);
							}
						});
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
					return core.params.appList[getIndexIfObjWithOwnAttr(core.params.appList, "identifier", appID)];
				} else {
					core.params.appList = core.apps.getAppList();
					return core.params.appList[getIndexIfObjWithOwnAttr(core.params.appList, "identifier", appID)];
				}
			},
			returnAppInfo: function(appInfoObject) {
				return appInfoObject;
			}
		}

		/* Notifications */
		core.notify = function(options) {
			options = options || {};

			var title = options.title ? options.title : "1 notification";
			var subtitle = options.subtitle ? options.subtitle : "Title";
			var icon = options.icon ? options.icon : "icons/AppIcon-Generic.png";
			var color = options.color ? options.color : "#fff";

			var backgroundColor = options.color ? options.color : "#63605e";

			var message = options.message ? options.message : "No content";
			
			var buttons = options.buttons ? options.buttons : [];
			
			var dismissFunction = function() {
				$('div.image-wrapper').velocity({
						opacity: 0
					}, {
						duration: 200,
					});
					$('div.long-look').velocity({
						opacity: 0
					}, {
						duration: 200,
						complete: function() {
							$('.watch-notification').velocity({
								opacity: 0
							}, {
								delay: 200,
								duration: 200,
								complete: function() {
									$('.watch-notification').remove();
								}
							});
						}
					});
					$('.watch-notification').removeClass("modal-to-long-look");
					$('.watch-notification').addClass("modal-out");
			}

			$("body").append('<div class="notifications watch-notification"><div class="notification-container"><div class="image-wrapper"><img src="'+icon+'"></div><div class="short-look"><div class="watch-notification-title">'+title+'</div><div class="watch-notification-subtitle" style="color: '+color+'">'+subtitle+'</div></div><div class="long-look"><div class="watch-notification-title" style="background-color: '+backgroundColor+'">'+subtitle+'</div><div class="watch-notification-text">'+message+'</div></div></div></div>');
			
			
			$("div.long-look").append('<div class="modal-buttons"></div>');
			for (var i=0; i<buttons.length; i++) {
				$('div.long-look div.modal-buttons').append("<span class=\"modal-button\">"+buttons[i].title+"</span>");

				if (typeof(buttons[i].onClick) === "function") {
					var onclickFunction = buttons[i].onClick;
					$('div.long-look div.modal-buttons').on("click", function() {
						dismissFunction();
						
						setTimeout(onclickFunction, 400);
					});
				} else {
					$('div.long-look div.modal-buttons').on("click", function() {
						dismissFunction();
					});
				}
			}
			$('div.long-look div.modal-buttons').append("<span class=\"modal-button dismiss\">Dismiss</span>")


			setTimeout(function() {
				$('div.long-look').css("margin-left",-$('div.long-look').outerWidth()/2);
				$('.watch-notification span.dismiss').on("click", function() {
					dismissFunction();
				});
				$(".watch-notification").addClass("modal-in");

			}, 50);
			/*setTimeout(function() {
				$(".watch-notification").removeClass("modal-in");
				$(".watch-notification").addClass("modal-to-long-look");

				$("div.watch-notification div.long-look").velocity({
					top: [[53], window.innerHeight],
				}, {
					duration: 600,
					easing: [0.645, 0.045, 0.355, 1]
				});
			}, 1550);*/
		}

		core.init();
	};

	window.WatchUI = function(params) {
		var ui = this;
		
		ui.version = "1.2 (1503290052)";
		
		ui.screen = $("#screen-container");

		ui.params = {
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
			iconSize: $(".appicon").outerWidth(),
			
			core: null
		}
		
		for (var param in params) {
			ui.params[param] = params[param];
		}
		
		ui.watchCore = ui.params.core;

		ui.init = function() {
			ui.screenW = ui.screen.outerWidth();
			ui.screenH = ui.screen.outerHeight();
			ui.centerW = ui.screenW/2;
			ui.centerH = ui.screenH/2;

			ui.hexCube = new Array();
			for(var i = 0; i < 4; i++) {
				for(var j = -i; j <= i; j++) {
					for(var k = -i; k <= i; k++) {
						for(var l = -i; l <= i; l++) {
							if(Math.abs(j) + Math.abs(k) + Math.abs(l) == i*2 && j + k + l == 0) {
								ui.hexCube.push([j,k,l]);
							}
						}
					}
				}
			}
		}
		ui.iconMapRefresh = function (sphereR, hexR, scroll, _option) {
			if (!ui.homeVisible) {
				return;
			}

			hexCubeOrtho = new Array(),
			hexCubePolar = new Array(),
			hexCubeSphere = new Array();

			var option = {
				iconZoom : 1,
				edgeZoom : true,
			}

			$.extend(option, _option || {});

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
					"x"	: x,
					"y"	: y,
				}
			}

			function ortho2polar (x, y) {
				var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
				var rad = Math.atan2(y, x);
				return {
					"r"		: r,
					"rad"	: rad,
				}
			}

			for (i in ui.hexCube) {
				hexCubeOrtho[i] = {
					"x": (ui.hexCube[i][1] + ui.hexCube[i][0] / 2) * hexR + scrollX,
					"y": Math.sqrt(3) / 2 * ui.hexCube[i][0] * hexR + scrollY,
				}
			}

			for (i in hexCubeOrtho) {
				hexCubePolar[i] = ortho2polar(hexCubeOrtho[i].x, hexCubeOrtho[i].y);
			}

			for (i in hexCubePolar) {
				var rad = hexCubePolar[i].r / sphereR;
				if (rad < Math.PI/2) {
					var r = hexCubePolar[i].r * $.easing["swing"](null, rad / (Math.PI/2), 1.5, -0.5, 1);
					var deepth = $.easing["easeInOutCubic"](null, rad / (Math.PI/2), 1, -0.5, 1);
				} else {
					var r = hexCubePolar[i].r;
					var deepth = $.easing["easeInOutCubic"](null, 1, 1, -0.5, 1);
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
				hexCubeOrtho[i].x = Math.round(hexCubeOrtho[i].x * 10) / 10;
				hexCubeOrtho[i].y = Math.round(hexCubeOrtho[i].y * 10) / 10 *1.14;
			}

			if (option.edgeZoom === true) {
				var edge = 20;
				for (i in hexCubeOrtho) {
					if (Math.abs(hexCubeOrtho[i].x) > ui.screenW/2 - edge || Math.abs(hexCubeOrtho[i].y) > ui.screenH/2 - edge) {
						hexCubeOrtho[i].scale = hexCubeSphere[i].deepth * 0.4;
					}else if(Math.abs(hexCubeOrtho[i].x) > ui.screenW/2 - 2 * edge && Math.abs(hexCubeOrtho[i].y) > ui.screenH/2 - 2 * edge){
						hexCubeOrtho[i].scale = Math.min(hexCubeSphere[i].deepth * $.easing["easeInOutSine"](null, ui.screenW/2 - Math.abs(hexCubeOrtho[i].x) - edge, 0.4, 0.6, edge), hexCubeSphere[i].deepth * $.easing["easeInOutSine"](null, ui.screenH/2 - Math.abs(hexCubeOrtho[i].y) - edge, 0.3, 0.7, edge) );
					}else if(Math.abs(hexCubeOrtho[i].x) > ui.screenW/2 - 2 * edge){
						hexCubeOrtho[i].scale = hexCubeSphere[i].deepth * $.easing["easeOutSine"](null, ui.screenW/2 - Math.abs(hexCubeOrtho[i].x) - edge, 0.4, 0.6, edge);
					}else if(Math.abs(hexCubeOrtho[i].y) > ui.screenH/2 - 2 * edge){
						hexCubeOrtho[i].scale = hexCubeSphere[i].deepth * $.easing["easeOutSine"](null, ui.screenH/2 - Math.abs(hexCubeOrtho[i].y) - edge, 0.4, 0.6, edge);
					}else{
						hexCubeOrtho[i].scale = hexCubeSphere[i].deepth;
					}
				}

				for (i in hexCubeOrtho){
					if (hexCubeOrtho[i].x < -ui.screenW/2 + 2 * edge) {
						hexCubeOrtho[i].x += $.easing["easeInSine"](null, ui.screenW/2 - Math.abs(hexCubeOrtho[i].x) - 2 * edge, 0, 6, 2 * edge);
					}else if(hexCubeOrtho[i].x > ui.screenW/2 - 2 * edge) {
						hexCubeOrtho[i].x += $.easing["easeInSine"](null, ui.screenW/2 - Math.abs(hexCubeOrtho[i].x) - 2 * edge, 0, -6, 2 * edge);
					};
					if(hexCubeOrtho[i].y < -ui.screenH/2 + 2 * edge) {
						hexCubeOrtho[i].y += $.easing["easeInSine"](null, ui.screenH/2 - Math.abs(hexCubeOrtho[i].y) - 2 * edge, 0, 8, 2 * edge);
					}else if(hexCubeOrtho[i].y > ui.screenH/2 - 2 * edge) {
						hexCubeOrtho[i].y += $.easing["easeInSine"](null, ui.screenH/2 - Math.abs(hexCubeOrtho[i].y) - 2 * edge, 0, -8, 2 * edge);
					}
				}
			};

			for (var i = 0; i < $(".appicon").length; i++){
				$(".appicon").eq(i).transform({
					"x": hexCubeOrtho[i].x,
					"y": hexCubeOrtho[i].y,
					"scale": hexCubeOrtho[i].scale,
				});
			}
		}

		ui.init();
		ui.iconMapRefresh(100, ui.iconSize, {x : 0, y: 0});
	};
})();

$.fn.extend({
	transform: function(_transform) {
		this.each(function(){
			var $this = $(this)
			if ($this.data("transform") === undefined) {
				$this.data("transform", {});
			}
			$.extend($this.data("transform"), _transform);

			var transformCSS,
					translate3d = ["0","0","0"],
					scale = "1";

			for (n in $this.data("transform")) {
				switch(n) {
					case "x" :
						if (typeof($this.data("transform").x) === "number") {
							translate3d[0] = $this.data("transform").x + "px";
						}else{
							translate3d[0] = $this.data("transform").x;
						}
						break;

					case "y" :
						if (typeof($this.data("transform").y) === "number") {
							translate3d[1] = $this.data("transform").y + "px";
						}else{
							translate3d[1] = $this.data("transform").y;
						}
						break;

					case "z" :
						if (typeof($this.data("transform").z) === "number") {
							translate3d[2] = $this.data("transform").z + "px";
						}else{
							translate3d[2] = $this.data("transform").z;
						}
						break;

					case "scale" :
						scale = $this.data("transform").scale;
						break;
				}
			}

			if (translate3d === ["0","0","0"]) {
				translate3d = "";
			}else{
				translate3d = "translate3d(" + translate3d + ")";
			}

			if (scale === "1") {
				scale = "";
			}else{
				scale = "scale(" + scale + ")"
			}
			transformCSS = translate3d + " " + scale;

			$this.css("transform", transformCSS);

		})
	},
});

var scrolling = false;


/*setTimeout(function() {
	watchApp.core.notify({
		title: "Did you know?",
		subtitle: watchApp.core.apps.getAppInfo("tips").title,
		message: "Harvard is officially free for those with less than $65,000 in annual family income.",
		icon: "img/icons/AppIcon-Tips.png",
		color: watchApp.core.apps.getAppInfo("tips").color,
		buttons: [
			{
				title: "Like",
			}
		]
	});
}, 1000);*/