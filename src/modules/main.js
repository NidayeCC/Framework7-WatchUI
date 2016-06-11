require('./libraries/hammer');
require('./libraries/velocity');

(function() {
	"use strict";
	
	window.$ = function(query) { if (document.querySelector(query)) return document.querySelector(query); };
	window.$$ = function(query) { if (document.querySelectorAll(query)) return document.querySelectorAll(query); };
	window._$ = Dom7;
	window.require = require;
	window.Easing = require('./libraries/easing');
	
	window.WATCH = function(params) {
		var watch = this;
		
		require("./plugin")(watch);
		
		watch.params = {
			applicationGrid: "grid.json",
			carouselSize: 120,
			clockInterval: 100,
			clockRevealAnimation: true, // Enable this for highly experimental (and lagging) clock reveal animation
			edgeZoom: true,
			environment: "development",
			iconSize: 75,
			iconSpacing: 1,
			localApps: null,
			onInit: null,
			precedingZero: false,
			target: $("div#screen-container"),
			watchFrame: true
		};
		watch.paramsInternal = {
			scrollX: 0,
			scrollY: 0,
			scrollMoveX: 0,
			scrollMoveY: 0,
			lastX: undefined,
			lastY: undefined,
			deltaX: undefined,
			deltaY: undefined,
			scrollRangeX: 34,
			scrollRangeNegX: 0,
			scrollRangeNegY: 0,
			scrollRangeY: 29,
			inertia: undefined,
			inertiaX: undefined,
			inertiaY: undefined,
			inertiaThreshold: 1,
			scrollAvailable: true,
			scrolling: false
		}
		for (var param in params) {
			watch.params[param] = params[param];
		}
		
		watch.framework = null;
		watch.views = {
			main: null,
			apps: null
		}
		
		watch.ajaxStates = {
			start: false,
			complete: false,
			error: false
		}

		watch.scrollIndicatorTimeout = null;
		watch.loadingTimeout = false;
		watch._loadingTimeout = null;
		watch.timeouts = {
			scrollingIndicator: null,
			loading: null
		}
		
		watch.hexCube = [];
		watch.inertias = [];
		
		// A few things to initalize
		watch.init = require('./watch/init');
		watch.environments = require('./watch/environments');
		watch.clock = require('./watch/clock/clock');
		
		// Open/Close Apps, emulate Digital Crown press
		watch.openAppId = null;
		watch.home = require('./watch/home');
		watch.openApp = require('./watch/openApp/openApp');
		watch._closeApp = require('./watch/closeApp/closeApp');
		watch.closeApp = function() {
			watch._closeApp();
		}
		
		// Progress Circle (not Activity Rings!)
		watch.displayProgress = require('./watch/progress').displayProgress;
		watch.setProgress = require('./watch/progress').setProgress;
		watch.addProgress = require('./watch/progress').addProgress;
		watch.hideProgress = require('./watch/progress').hideProgress;
		
		// watchUI Homescreen Grid
		watch.calculateMaxRange = require('./carousel/calculateMaxRange');
		watch.iconInertia = require('./carousel/iconInertia');
		watch.iconMapRefresh = require('./carousel/iconMapRefresh');
		watch.moveIcons = require('./carousel/moveIcons');

		watch._moveIcons = function(e) {
			watch.moveIcons(e);
		}
		watch._iconInertia = function(e) {
			watch.iconInertia(e);
		}
		
		// Force Touch
		watch.emulatedForceTouch = require('./watch/forceTouch');
		watch.onForceTouch = null;
		watch.triggerForceTouchEvent = null;
		
		// Context Menus
		watch.openMenu = require('./watch/menu').openMenu;
		watch.closeMenu = require('./watch/menu').closeMenu;
		
		// Animation Controller
		watch.animationController = require('./watch/animationController');
		
		// Initialize watchUI
		watch.init();
	}
})();