//var demo = true;
var app = new WATCH({
	environment: navigator.userAgent.indexOf("Apple Watch") != -1 ? "simulator" : "development",
	onInit: function(_app) {
		_app.framework.onPageInit("modals", function() {
			Dom7(".item-link.alert-text-title").click(function() {
				app.framework.alert('Some custom alert text', 'Custom Title!');
			});
			Dom7(".item-link.confirm-ok-cancel").click(function() {
				app.framework.confirm('Are you sure?', 
					function () {
						app.framework.alert('You clicked OK.');
					},
					function () {
						app.framework.alert('You clicked Cancel.');
					}
				);
			})
		});
		_app.framework.onPageInit("notifications", function() {
			Dom7(".item-link.notification").click(_notify);
		});
		_app.framework.onPageInit("ui_update", function() {
			Dom7(".button.update").click(_update);
		});
		_app.framework.onPageInit("ui_picker", function() {
			var pickerInline = app.framework.picker({
				container: '.picker-container',
				toolbar: false,
				cols: [
					{
						values: ("Picker Item 1, Picker Item 2, Picker Item 3, Picker Item 4, Picker Item 5, Picker Item 6, Picker Item 7, Picker Item 8, Picker Item 9, Picker Item 10").split(", "),
						textAlign: "center"
					}
				]
			})
		})
	},
});


var _notify = function() {
	app.framework.notify({
		appId: "de.sniperger.watchui.demo",
		title: "Sample Notification",
		messageTitle: "This is a title",
		message: "This is the actual text body.",
		buttons: [
			{
				title: "Like",
				onClick: function() {

				}
			}
		]
	})
};
var interval;
var _update = function() {
	var test = app.displayProgress();
	interval = setInterval(function() {
		if (test.currentProgress >= 100) {
			location.reload(true);
			clearInterval(interval);
			interval = undefined;
			return;
		}
		app.addProgress(1, true)
	}, 50);
}
app.onForceTouch("de.sniperger.watchui.demo", "force-touch_desc", function() {
	app.openMenu([
		{
			icon: 'img/menu/SPMenuItemAccept-regular@2x.png',
			label: 'Accept',
			action: function() {
				app.framework.alert("You selected Accept!");
			}
		},
		{
			icon: 'img/menu/SPMenuItemDecline-regular@2x.png',
			label: 'Cancel',
			action: function() {
				app.framework.alert("You selected Cancel!");
			}
		}, {
			icon: 'img/menu/SPMenuItemShare-regular@2x.png',
			label: 'Share',
			action: function() {
				app.framework.alert("You selected Share!");
			}
		}
	])
});

app.onForceTouch("com.apple.NanoTimer", "app-index", function() {
	app.framework.alert("Selecting Watch Faces is currently unavailable.", "watchUI");
});
