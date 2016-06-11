var animations = [];

var _setClockIcon = require('../_initClockIcon').setClock;
var _setAnalogClockIcon = require('./_setAnalog');

module.exports = function() {
	var watch = this;
	
	return {
		init: function() {
			this.set();
			watch.clockInterval = setInterval(this.set, watch.params.clockInterval);
			
			if ($("svg#app-reveal g.small-watch")) {
				this.setAnalog();
				watch.analogClockInterval = setInterval(this.setAnalog, 1000);
			}
		},
		set: function() {
			var today = new Date();
			var h = today.getHours();
			var m = today.getMinutes();
	
			if (typeof demo !== 'undefined' && demo) {
				h = "10";
				m = "09";
			} else {
				if (watch.params.precedingZero) {
					h = (h < 10) ? "0" + h : h;
				}
				m = (m < 10) ? "0" + m : m;
			}
				
			var clockElements = $$("p.time, span.time");
			for (var i=0; i<clockElements.length; i++) {
				clockElements[i].innerHTML = h + ":" + m;
			}
		},
		setAnalog: function() {
			_setClockIcon();
			_setAnalogClockIcon();
		},
		toggleDemo: function() {
			this.demo = !this.demo;
		}
	}
}