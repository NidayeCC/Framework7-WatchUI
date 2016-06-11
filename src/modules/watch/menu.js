var menuOpen = false;

module.exports = {
	onMenu: function(pageName, items) {
		var watch = this;

		watch.menus[pageName] = items;
	},
	openMenu: function(menuItems) {
		var watch = this;
		var _$ = Dom7;
		var touchEventEnd = ("ontouchend" in window) ? "touchend" : "mouseup";
		
		if (menuOpen || $("div.modal")) {
			return;
		}

		var _menu = "<div class=\"menu\"><div class=\"menu-inner\">{{items}}</div></div>";
		if (menuItems) {
			var items = menuItems;
			var _items = "";
			for (var i=0; i<items.length; i++) {
				var _item = "<div class=\"icon\"><div class=\"icon-inner\">{{icon}}</div><div class=\"item-description\">{{label}}</div></div>";
				if (items[i].icon) {
					_item = _item.replace(/{{icon}}/g, "<i style=\"background-image: url("+items[i].icon+")\"></i>");
				}
				if (items[i].label) {
					_item = _item.replace(/{{label}}/g, items[i].label);
				}
				
				_items += _item;
			}
			_menu = _menu.replace(/{{items}}/g, _items);
			if (_$("div.watch-wrapper")[0]) {
				_$('div.watch-wrapper').append(_menu);
			} else {
				_$('body').append(_menu);
			}
			
			$("div.menu").classList.add("visible");

			var findRow3 = function(node) {
			    var i = 1;
			    while (node = node.previousSibling) {
			        if (node.nodeType === 1) { ++i }
			    }
			    return i;
			}
			
			var icons = $$("div.menu div.icon");
			for (var i=0; i<icons.length; i++) {
				if (typeof items[i].action === "function") {
					icons[i].addEventListener(touchEventEnd, function() {
						var el = this;
						watch.closeMenu();
						setTimeout(items[findRow3(el)-1].action, 450);
					});
				} else {
					icons[i].addEventListener(touchEventEnd, function() {
						watch.closeMenu();
					});
				}
			}
			setTimeout(function() {
				$("div.menu").classList.add("menu-in");
				
				setTimeout(function() {
					$("div.menu").classList.remove("menu-in");
					$("div.menu").classList.add("menu-done");
				}, 500);
			}, 10);
			menuOpen = true;
		}
	},
	closeMenu: function() {
		var watch = this;
		setTimeout(function() {
			$("div.menu").classList.remove("menu-done");
			setTimeout(function() {
				$("div.menu").classList.remove("visible");
				Dom7("div.menu").remove();
				watch.forceTouch = false;
				menuOpen = false;
			}, 350);
		}, 100);
	}
}