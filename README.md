# WatchUI for Framework7
Apple Watch UI (including optional Home Screen) for Framework7

<img src="promo/logo.png">

## Introduction
Framework7 is the best HTML Application Framework for iOS 7-styled apps I can imagine. Fast, versatile, modular. But something was missing.

Apple introduced the  ᴡᴀᴛᴄʜ at the September Special Event, alongside the iPhone 6 and iPhone 6 Plus. It seems to run something like iOS, but with a stripped down UI, easy to read on small screens. I though this would be the perfect addition to Framework7, so I recently started working on WatchUI.

WatchUI is something game developers would call "total conversion", something like what FakeFactory's Cinematic Mod is to Half-Life 2. It changes almost every aspect, but it still keeps that original feeling. That's why my recreation of Bug Reporter⁸, Bug Watch, will be based on WatchUI.

## What is included
_As this is the first public beta, not everything might be included._

* Watch Home Screen (more on that in the docs)
* Lists
* Forms (still working on that)
* Modals (including Alerts and Notifications)
* Status Bar clock
* Colored Status Bar titles

## How does it work
Framework7 is initialized by creating a global variable:

`var myApp = new Framework7([params])`

WatchUI is initalized by injecting into this variable, which then sets up WatchCore and WatchUI:

`myApp.watchCore = new WatchCore([watch_params])`

WatchCore accepts several parameters which enable or disable modules, like the WatchUI Home Screen:

Variable | Default value | Purpose
------------- | -------------
initHomeScreen | true | Enables/disables the WatchUI Home Screen.
loadAppsRemote | false | Enables or disables remote app loading for WatchUI.
appListSource | "apps/apps.json" | Specifies the origin for the remotely loaded apps.
homeView | $('div.view#home') | Sets the Home container element.
screenContainer | $("#screen-container") | Sets the Screen container element.
indexIdentifier | "index" | Gets the `data-page` attribute for the inital Framework7 page.
hideNavbars | true | Hides or shows Navigation Bar on WatchUI Homescreen (beta).
navbarClock | true | Enables/disables clock in the upper right corner.
navbarClockElement | $('p.time') | Specifies the Element the clock should be applied on.
appPages | true | Treat pages like apps (initally hidden on load) (beta)

### Required libraries
WatchUI requires some libraries to work correctly. These libraries include:

* jQuery
* Easing for jQuery
* fastclick.js
* Veloctiy.js

Each of these libraries is included in `js/lib/`

### Including WatchUI in your app
First, include the required CSS files.

```html
<link rel="stylesheet" type="text/css" href="css/screen.css">
<link rel="stylesheet" type="text/css" href="css/watchui.css">
```

_If you are not going to use the WatchUI Home Screen, you can ignore_ `screen.css`

After you have included the stylesheets, you can continue to include the JavaScript files. You might want to include WatchUI at the end of the page. After you did that, you can initalize WatchUI alongside Framework7.

```html
[...]
<script type="text/javascript" src="js/lib/jquery.js"></script>
<script type="text/javascript" src="js/lib/jquery.easing.1.3.js"></script>
<script type="text/javascript" src="js/lib/fastclick.js"></script>
<script type="text/javascript" src="js/libvelocity.min.js"></script>

<script type="text/javascript" src="js/watchui.js"></script>
<script>
	var myApp = new Framework7();
	
	myApp.core = new WatchCore({
		/* Optional parameters */
	});
<script>
```

## WatchUI Home Screen
Notes:

* `initHomeScreen` needs to be `true`
* Navigation Bars should be hidden on Home Screen (`hideNavbars`)

The Home Screen uses a special DOM layout. You start by creating a simple Framework7 page until you get to the `page-content` container. This is an example that is used in Bug Watch:

```html
<div data-page="index" data-watch-home class="page no-navbar">
	<div class="page-content">
		<div id="screen-container">
			<div class="view" id="home" style="">
				<div class="appicon bugs" id="apps/de.sniperger.bugs/index.html"></div>
					<div class="appicon settings" id="apps/de.sniperger.preferences/index.html"></div>
					<div class="appicon update" id="apps/de.sniperger.update/index.html"></div>
					<div class="appicon usercp" id="apps/de.sniperger.usercp/index.html"></div>
					<div class="appicon tips" id="apps/de.sniperger.tips/index.html"></div>
					<div class="appicon setup" id="apps/de.sniperger.setup/index.html"></div>
					<div class="appicon feedback" id="apps/de.sniperger.feedback/index.html"></div>
				</div>
			</div>
		</div>
	</div>
</div>
```

This is what it will look like:

<img src="promo/watch_layout.png" width="200">

_Note: These app icons are not included in WatchUI. This is a beta screenshot from Bug Watch_

As you can see, the apps are rendered around the first app in a weird way. I can't explain it myself, it just happened this way.

You might need some time to get familiar with how App Icons are ordered. Just play around with it until you're happy.

### App API
If you are using Remote Apps, you can easily create your own apps using JSON. This is what the apps.json file is for. The basic syntax is very easy:

```
{
	"apps": [
		[YOUR APPS HERE]
	]
}
```
Apps are added to the `apps` array, which is, if enabled, loaded into WatchUI and generates the Home Screen. If you want to create your own app, just set the following keys to your desire:

```
{
	"title": "Your App Title",
	"identifier": "yourapp",
	"bundleID": "com.yourcompany.yourapp",
	"executable": "index.html",
	"preinstalled": true,		<-- currently not used
	"icon": "AppIcon.png",		<-- currently not used
	"color": "#ff0045"
},
```

The following method returns an app's info as a JavaScript object, which can be used in notifications:

```
myApp.core.apps.getAppInfo(appID);
```
Just replace `appID` with the application ID you require information from.

## Notifications
Framework7 has a great modal system. But for WatchUI, it's not good enough.

 ᴡᴀᴛᴄʜ Notification consist of two "scenes", 

* the "Short Look" interface, which displays the app icon, the app title and a brief description of what happened, and
* the "Long Look" interface, which is the notification itself and contains the message and action buttons.

<img src="promo/notification_short.png" width="200">
<img src="promo/notification_long.png" width="200">

<sub><sup>__Left:__ Short Look interface, __Right:__ Long Look interface with custom "Like" button</sup></sub>

Because of that more content, WatchUI needed a custom Notification method. Here is the example that is used in the screenshots above:

```
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
```

You might have noticed that only one of the two buttons is specified in this example. This is because the  ᴡᴀᴛᴄʜ OS automatically adds the "Dismiss" button. The same happens in WatchUI. You'll only need to specify the buttons that contain actions.

Buttons only have `title` and `onClick` attributes. The `onClick` attribute can contain a function that gets called when the button is pressed and the notification is gone (so there's not too much action at once).

## Debugging
If you want to display the versions of Framework7, WatchCore or WatchUI anywhere, you can access these attributes from your Framework7 object:

```
myApp.version /* Framework7 Version */
myApp.core.version /* WatchCore Version (1.1) */
myApp.core.watchUI.version /* WatchUI.Version */
```