module.exports = function(watch, options) {
	var $ = Dom7;
	options = options || {};
	var appId = options.appId ? options.appId : null;
	
	var subtitle, icon, color, backgroundColor;
	if (watch.loadedApps[appId]) {
		subtitle = watch.loadedApps[appId].title;
		icon = watch.loadedApps[appId].icon;
		color = watch.loadedApps[appId].color ? watch.loadedApps[appId].color : "#808080";
		backgroundColor = watch.loadedApps[appId].color ? watch.loadedApps[appId].color : "#c4beba";
	} else {
		subtitle = options.subtitle ? options.subtitle : "Title";
		icon = options.icon ? options.icon : "img/icons/AppIcon-Generic.png";
		color = options.color ? options.color : "#808080";
		backgroundColor = options.color ? options.color : "#c4beba";
	}
	var title = options.title ? options.title : "1 notification";

	var messageTitle = options.messageTitle ? "<span>"+options.messageTitle+"</span><br>" : ""
	var message = options.message ? options.message : "No content";

	var buttons = options.buttons ? options.buttons : [];
		
	var dismissFunction = function(el) {
		$(".watch-notification").removeClass("done");
		$(".watch-notification div.clock").removeClass("hidden");
		new Velocity($('div.image-wrapper')[0], {
			opacity: 0
		}, {
			duration: 200,
		});
		
		var buttons = Array.prototype.slice.call(document.querySelectorAll("div.long-look .modal-button"));
		buttons.splice(buttons.indexOf(el),1);
		buttons.push(document.querySelector(".long-look .watch-notification-title"));
		buttons.push(document.querySelector(".long-look .watch-notification-text"));
		
		new Velocity(buttons, {
			opacity: 0
		}, {
			duration: 200,
			complete: function() {
				new Velocity($('div.long-look')[0], {
					opacity: 0
				}, {
					delay: 200,
					duration: 200,
					complete: function() {
						new Velocity($('div.watch-notification')[0], {
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
			}
		})

		$('.watch-notification').removeClass("modal-to-long-look");
		$('.watch-notification').addClass("modal-out");
	};
	
	function hexToRgb(hex) {
		// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, function(m, r, g, b) {
			return r + r + g + g + b + b;
		});
	
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	}
	var _backgroundColor = "rgba({{r}}, {{g}}, {{b}}, 0.55)".replace(/{{r}}/, hexToRgb(backgroundColor).r).replace(/{{g}}/, hexToRgb(backgroundColor).g).replace(/{{b}}/, hexToRgb(backgroundColor).b);
	
	var toAppend = '<div class="notifications watch-notification"><div class="clock"><p class="time"></p></div><div class="notification-container"><div class="image-wrapper"><img src="' + icon + '"></div><div class="short-look"><div class="watch-notification-title">' + title + '</div><div class="watch-notification-subtitle" style="color: ' + color + '">' + subtitle + '</div></div><div class="long-look"><div class="watch-notification-title" style="background-color: ' + _backgroundColor + '">' + subtitle + '</div><div class="watch-notification-text">' + messageTitle + message + '</div></div></div></div>';
	
	if ($("div.watch-wrapper")[0]) {
		$('div.watch-wrapper').append(toAppend);
	} else {
		$('body').append(toAppend);
	}

	$("div.long-look").append('<div class="modal-buttons"></div>');
	for (var i=0; i < buttons.length; i++) {
		$('div.long-look div.modal-buttons').append("<span class=\"modal-button\">" + buttons[i].title + "</span>");
	}
	
	$('div.long-look div.modal-buttons').append("<span class=\"modal-button dismiss\">Dismiss</span>")

	// Show short look interface
	setTimeout(function() {
		$('div.long-look').css("margin-left", - $('div.long-look').outerWidth() / 2);
		$('.watch-notification span.dismiss').on("click", function() {
			dismissFunction();
		});
		$(".watch-notification").addClass("modal-in");

		$('div.long-look').children().find(".modal-button").each(function(index, el) {
			if (typeof(buttons[index]) !== "undefined") {
				$(el).on("click", function() {
					dismissFunction(el);
					setTimeout(buttons[index].onClick, 600);
				})
			} else {
				$(el).on("click", function() {
					dismissFunction(el);
				});
			}
		});
	}, 50);
	
	// Show long look interface
	setTimeout(function() {
		$(".watch-notification").removeClass("modal-in");
		$(".watch-notification").addClass("modal-to-long-look");
		$(".watch-notification").on("scroll", function(e) {
			if (window.innerWidth >= 768 || (watch.params.watchFrame && window.innerWidth <= 480)) {
				if ($(".watch-notification")[0].scrollTop > 0) {
					$(".watch-notification div.clock").addClass("hidden");
				} else {
					$(".watch-notification div.clock").removeClass("hidden");
				}
			} else {
				$(".watch-notification div.clock").removeClass("hidden");
			}
		})

		new Velocity($("div.watch-notification div.long-look")[0], {
			top: [[42], window.innerHeight],
		}, {
			duration: 600,
			easing: [0.645, 0.045, 0.355, 1],
			complete: function() {
				$(".watch-notification").addClass("done");
			}
		});
	}, 1550);
}