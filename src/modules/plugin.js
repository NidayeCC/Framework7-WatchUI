module.exports = function(watch) {
	Framework7.prototype.plugins.watchUI = function(app, params) {
		var _$ = Dom7;

		function handleSwipeBackOpacity(el, percentage) {
			el[0].parentNode.classList.add("visible");
		}

		document.querySelector("div.views").addEventListener("swipeBackMove", function(_data) {
			var data = _data.detail;
			data.activePage.classList.add("active-page");
			data.activePage.style.transform = "translate3d(0,0,0) scale("+(1-(0.2*data.percentage))+")";
			data.activePage.style.opacity = 1 - 1*data.percentage;

			data.previousPage.classList.add("previous-page");
			data.previousPage.style.transform = 'translate3d(-' + (100 - (100*data.percentage)) + '%,0,0)';
			data.previousPage.style.opacity = 1;
			
			_$("div.navbar-on-left").addClass("visible");
		});

		// Manipulate existing functions
		var oldFunctions = {
			openModal: app.openModal,
			closeModal: app.closeModal,
			pageInitCallback: app.pageInitCallback,
			routerLoad: app.router.load,
			routerBack: app.router.back,
		}

		var back = false;
		app.pageInitCallback = function(view, params) {
			if (back) {
				back = false;
				return;
			}
			oldFunctions.pageInitCallback(view, params);
		}
		
		app.router.back = function (view, options) {
			back = true;
			oldFunctions.routerBack(view, options);
		}
		app.router.load = function(view, options) {
			options.url += "?r="+(new Date).getTime();
			oldFunctions.routerLoad(view, options);
		}

		app.openModal = function(modal) {
			modal.remove();
			if (_$("div.watch-wrapper")[0]) {
				_$('div.watch-wrapper').append(modal[0]);
			} else {
				_$('body').append(modal[0]);
			}
			
			oldFunctions.openModal(modal);
			
			_$(".modal-overlay").remove();
			_$(".popup-overlay").remove();

			var isPopover = modal.hasClass('popover');
			var isPopup = modal.hasClass('popup');
			var isLoginScreen = modal.hasClass('login-screen');
			var isPickerModal = modal.hasClass('picker-modal');
			if (!isLoginScreen && !isPickerModal) {
				if (_$('.modal-overlay').length === 0 && !isPopup) {
					if (_$("div.watch-wrapper")[0]) {
						_$('div.watch-wrapper').append('<div class="modal-overlay"></div>');
					} else {
						_$('body').append('<div class="modal-overlay"></div>');
					}
					setTimeout(function() {
						_$("div.modal-overlay").addClass("modal-overlay-visible");
					}, 10)
				}
				if (_$('.popup-overlay').length === 0 && isPopup) {
					if (_$("div.watch-wrapper")[0]) {
						_$('div.watch-wrapper').append('<div class="popup-overlay"></div>');
					} else {
						_$('body').append('<div class="popup-overlay"></div>');
					}
				}
			}
			_$("div.views").addClass("modal-in");

			if (_$("div.modal.modal-in div.modal-inner")[0].offsetHeight < watch.paramsInternal.screenH) {
				var marginTop = (watch.paramsInternal.screenH-64)/2 - (_$("div.modal.modal-in div.modal-inner")[0].offsetHeight/2);
				marginTop = (marginTop < 0 ? 0 : marginTop);
				modal[0].querySelector("div.modal-inner").style.marginTop = marginTop+"px";
			} else {
				modal[0].querySelector("div.modal-buttons").style.top = _$("div.modal.modal-in div.modal-inner")[0].offsetHeight+"px";
			}
		}
		app.closeModal = function(modal) {
			oldFunctions.closeModal(modal);
			_$("div.views").removeClass("modal-in");
		}
		app.notify = function(options) {
			require('./notifications')(watch, options);
		}
		watch.notify = app.notify;
		
		return {
			hooks: {
				// App init hook
				swipeBackSetOpacity: handleSwipeBackOpacity,
			}
		};
	}

}