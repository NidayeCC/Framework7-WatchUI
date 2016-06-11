## watchUI is back! And it's better than ever before!

watchUI 2 has been rewritten from the ground up, with improved speed and look in mind. Now it's possible to transform your existing Framework7 app into a watchUI app with minimal additional work.

Based on the groundbreaking Framework7, watchUI allows you to to create stunning apps with a carefully recreated Apple Watch design. Every pixel and every animation has been analyzed to create the illusion of running a native Watch app.

## What is included?

* "Carousel" home screen
* List Views
* Buttons
* Radio Buttons/Checkboxes
* Switches
* Picker
* Scroll Indicator
* Update Progress


* Modals (Alert/Confirm)
* Notifications
* Clock
* Force Touch Support (iPhone 6s, Simulator)

## Before getting started

watchUI uses `-webkit-backdrop-filter: blur()` in a few places, like Notifications and Modals. This is currently only supported by Safari on OS X. If you only see an opaque background without blur, your browser probably doesn't support `-webkit-backdrop-filter: blur()`.

Additionally, watchUI uses a slightly modified Framework7, where one line of code has moved to a different place. In version 1.4.2, line 442 has been moved beneath line 456:

```js
/* Old code, unmodified Framework7 */

container.trigger('swipeBackMove', callbackData);

// Transform pages
var activePageTranslate = touchesDiff * inverter;
var previousPageTranslate = (touchesDiff / 5 - viewContainerWidth / 5) * inverter;
if (app.device.pixelRatio === 1) {
    activePageTranslate = Math.round(activePageTranslate);
    previousPageTranslate = Math.round(previousPageTranslate);
}

activePage.transform('translate3d(' + activePageTranslate + 'px,0,0)');
if (view.params.swipeBackPageAnimateShadow && !app.device.android) pageShadow[0].style.opacity = 1 - 1 * percentage;

previousPage.transform('translate3d(' + previousPageTranslate + 'px,0,0)');
if (view.params.swipeBackPageAnimateOpacity) previousPage[0].style.opacity = 0.9 + 0.1 * percentage;
```

```js
/* New code, modified Framework7 */
/* Notice the "swipeBackMove" trigger has been moved after the transforms to allow a custom swipe back animation */

// Transform pages
var activePageTranslate = touchesDiff * inverter;
var previousPageTranslate = (touchesDiff / 5 - viewContainerWidth / 5) * inverter;
if (app.device.pixelRatio === 1) {
    activePageTranslate = Math.round(activePageTranslate);
    previousPageTranslate = Math.round(previousPageTranslate);
}

activePage.transform('translate3d(' + activePageTranslate + 'px,0,0)');
if (view.params.swipeBackPageAnimateShadow && !app.device.android) pageShadow[0].style.opacity = 1 - 1 * percentage;

previousPage.transform('translate3d(' + previousPageTranslate + 'px,0,0)');
if (view.params.swipeBackPageAnimateOpacity) previousPage[0].style.opacity = 0.9 + 0.1 * percentage;

container.trigger('swipeBackMove', callbackData);
```

A pull request has been submitted under [Framework7#928](https://github.com/nolimits4web/Framework7/pull/982).

To use the San Francisco Compact font, you need to download it [from Apple](http://adcdownload.apple.com/iOS/San_Francisco_Fonts/SFCompact.zip), which is only available if you pay $99 to get access to the Apple Developer Program.

## Getting started

First of all, you need to clone the watchUI Repo, or download the latest Release (currently v2.0_13V240). All the files you need are in the `/dist/` folder.

You can then either use the precompiled version from the `/dist/` folder, or (if you have installed Node and Grunt), install the required Grunt modules to build it yourself:

```bash
cd ~/Downloads/Framework7-WatchUI-master/
npm install

[...]
grunt # Run Grunt to build all Source files, including JavaScript and Less
grunt js # Build JavaScript files only (does not include minified version)
grunt less # Build Less files only
```

### Getting started (from scratch)

*If you have an existing project, skip this step and continue with "Getting started - Existing project".*

Add watchUI's CSS file from `/dist/css/` right after Framework7's CSS file. This is to ensure nothing override the things watchUI is overriding.

watchUI is based on two views: the "Main" view, which contains the "Carousel" home screen and all installed apps (more on apps in "Your app in your app"). The second view is the actual content view, which displays all of your app's contents. You start by having a slightly changed default Framework7 Page layout.

```html
<body class="watch theme-blue"> <!-- Add the watch class to body to enable watchUI -->
	<div class="views">
		<div class="view view-main" data-page="index"> <!-- watchUI's main view, which contains the Carousel home screen -->
			<div class="pages">
				<div data-page="index" class="page">
					<div class="page-content">
						<div id="screen-container"></div> <!-- The actual home screen -->
					</div>
				</div>
			</div>
		</div>
		<div class="view view-app"> <!-- This is the content view, which shows every app's content -->
			<div class="navbar navbar-hiding"></div>
			<div class="pages navbar-through"></div>
			<div class="clock"><p class="time">10:09</p></div> <!-- An always present clock, should always be present -->
			<div class="scroll-indicator"> <!-- This thing is supposed to show your current scroll position. And it actually works! -->
				<div class="scroll-indicator-inner"></div>
			</div>
		</div>
	</div>
[...]
```

The content view's `<div class="pages navbar-through"></div>` should be empty when initializing watchUI, because apps are loaded as AJAX pages. This is one of the reasons why you should be running watchUI at least from `http://localhost`.

Next, you add Framework7's JavaScript file (either the regular version or the minified one, it's your choice) and watchUI's JavaScript file (from `/dist/js/`, regular or minified) right before the closing `</body>` tag. It's important to add watchUI after Framework7 because it's being registered as a plugin.

To initialize watchUI, you simply specify the following script:

```js
var myApp = new WATCH(params)
```

Doing this is all you have to to. watchUI takes care of the rest. The `params` object can contain any of the parameters in "Configuring watchUI". Keep in mind that the current release does not support custom Framework7 parameters, but the most important one are already set.

To add apps to watchUI, have a look at "Your app in your app".

### Getting started - Existing project

*From "Getting started (from scratch)":*

> Add watchUI's CSS file from `/dist/css/` right after Framework7's CSS file. This is to ensure nothing override the things watchUI is overriding.

> watchUI is based on two views: the "Main" view, which contains the "Carousel" home screen and all installed apps (more on apps in "Your app in your app"). The second view is the actual content view, which displays all of your app's contents.

You probably already have an existing view called `view-main` or anything else. If that's the case, rename it to `view-app` and, if needed, change you JavaScript accordingly. Add the following code right after the `.pages` container:

```html
<div class="clock"><p class="time">10:09</p></div>
<div class="scroll-indicator">
	<div class="scroll-indicator-inner"></div>
</div>
```

Also, make sure that the `.pages` container is empty. But don't throw away that content, as we'll need it later to create an app.

Before the content view, you add a view called `view-main`. This will be the container for the "Carousel" home screen. Add the following code before the content view:

```html
<div class="view view-main" data-page="index"> <!-- watchUI's main view, which contains the Carousel home screen -->
	<div class="pages">
		<div data-page="index" class="page">
			<div class="page-content">
				<div id="screen-container"></div> <!-- The actual home screen -->
			</div>
		</div>
	</div>
</div>
```

Scratch the Framework7 initialization from your code, as it will be replaced by the following line:

```js
var myApp = new WATCH(params)
```

The `params` object can contain any of the parameters in "Configuring watchUI". Keep in mind that the current release does not support custom Framework7 parameters, but the most important one are already set. Framework7 will still be accessible through `myApp.framework`, so change any existing page callbacks etc. accordingly.

## Configuring watchUI

When initializing watchUI, you can specify various parameters to change its behaviour. Let's take a look on what exactly you can customize:

| Variable | Default value | Purpose |
|--------------------|------------------------|--------------------------------------------------------------|
| applicationGrid | "grid.json" | The file to load app information from |
| carouselSize | 120 | Change the bubble size of the home screen |
| clockInterval | 100 | Interval to refresh the clock. Can be reduced (say: higher interval) to reduce battery impact |
| clockRevealAnimation | true | Enable the experimental animation when opening a Clock app |
| edgeZoom | true | App icons are scaled down when they reach the screen edge |
| iconSize | 75 | Icon size, measured in px |
| iconSpacing | 1 | Icon spacing multiplier |
| localApps | null | Currently no use |
| onInit | null | Function to call when watchUI has finished initializing |
| precedingZero | false | Add a preceding zero in Clocks (eg. 09:41 instead of 9:41)
| target | $("div#screen-container") | Target container for the home screen

## Your app in your app

watchUI is based on apps. At FESTIVAL, we call it "Appception" (insert bad Inception reference here), and it powers a few of our projects (like watchUI or MetroUI). Creating apps for watchUI is actually simple. Just have a look at the `/grid.json`, which contains all the apps information used in the demo:

```json
{
	"apps": [
		{
		    "title": "watchUI demo",
		    "identifier": "demo",
		    "bundleID": "de.sniperger.watchui.demo",
		    "executable": "app-index.html",
		    "icon": "apps/de.sniperger.watchui.demo/WatchUI.png",
		    "color": "#ff730f",
		    "position": [1,-1,0]
		}, {
		[...]
	"grid": [
		[-2,0,0],
		[-2,1,0],
		[-2,2,0],

		[-1,-1,0],
		[-1,0,0],
		[-1,1,0],
		[-1,2,0],
		[...]
	]
}
```

As you can see, the demo file consists of two sections, called `apps` and `grid`. The `grid` section contains a few example positions for apps, which of course you can customize to your likings. It has no actual use within watchUI, it's just there for reference. What's actually relevant here is the `apps` section, as it contains any information for any installed app. Let's have a look at all the existing keys:

| Variable | Default value | Purpose |
|--------------------|------------------------|--------------------------------------------------------------|
| title | "" | The title of an app. Used when the app couldn't be opened and an error message appears. When it's an empty string, it just says "The app couldn't be opened". |
| identifier | "" | No actual use yet |
| bundleID | "" | Used to identify your app. Should always be set, otherwise your app won't appear on the home screen. Also used as the folder name in `/apps/` |
| executable | "" | Specifies which file should be loaded when opening the app. Relative to `bundleID` |
| icon | "" | The app icon. Should be set if you want to see where your app is on the home screen. |
| color | "#ff9500" | The app's accent color. Used in the Navbar and in Notifications. Requires a String with a Hex Value
| isClockApp | false | Turns an app into the Clock app found on Apple Watch. Has a dynamic icon that shows the current time and changes a few animations. Should be used only once on the home screen. |
| position | [0, 0, 0] | An app's position in the grid. Must be specified in order to appear on the home screen. Format [x, y, z] (z is not necessary).

You can get application info by calling `myApp.loadedApps[appId]`, where `appId` is the ID of the app you want to get information about.

The actual application is located in `apps/[bundleId]/[executable]`. All pages are loaded via AJAX, which is why their content is based on the minimal layout found [here](http://framework7.io/docs/pages-ajax.html#internal-file-structure-with-page). To load resources relative to the app's bundle, use `{{app}}/` in any required `src` or `href` attribute.

## Methods

watchUI introduces a few new JavaScript methods to extend the functionality of Framework7. Right now, we've got Notifications, Update progress rings (not Activity Rings!) and Force Touch/Menus.

### Notifications

While Framework7's notification is able to display a simple Notification with a title, text and an image, it's not sufficient for watchUI. A watchUI Notification consists of two scenes, the "Short Look" interface, and the "Long Look" interface.

The "Short Look" interface shows a brief overview about which app has sent a Notification, what happened and, of course, the app icon. The "Long Look" interface shows the content of the Notification and a few actions (eg. Like or Share).

To call a Notification, use the `.notify()` method:

```js
// Show a Notification based on existing app info
myApp.notify({
	appId: "de.sniperger.watchui.demo",
	title: "Sample Notification",
	messageTitle: "This is a title",
	message: "This is the actual text body.",
	buttons: [
		{
			title: "Like",
			onClick: function() {}
		}
	]
}

// Show a completely customized Notification
myApp.notify({
	subtitle: "watchUI Demo",
	title: "Sample Notification",
	color: "#ff9500",
	backgroundColor: "#ff9500",
	icon: "apps/de.sniperger.watchui.demo/WatchUI.png",
	messageTitle: "This is a title",
	message: "This is the actual text body.",
	buttons: [
		{
			title: "Like",
			onClick: function() {}
		}
	]
}

```

You can either have it easy and show a Notification that takes all the relevant information from the loaded apps database by specifying the app ID, or customize it completely by your likings. When adding buttons, you don't need to add a "Dismiss" button, as that is done automatically by watchUI.

### Update progress rings

Update progress rings (not Activity rings) are shown when the Apple Watch is currently updating itself. To create such a progress ring, just call `myApp.displayProgress()`:

| Method | Parameter Type | Purpose |
|--------------------|------------------------|--------------------------------------------------------------|
| myApp.displayProgress | none | Show a Update progress ring |
| myApp.addProgress | (value, [percent]) | Add a certain value to the progress. If `percent` is true, value must be a whole number. |
| myApp.setProgress | (value, [percent]) | Set progress to certain value. If `percent` is true, value must be a whole number. |
| myApp.hideProgress | none | Hides the progress ring. |

Here is an example which creates a progress ring and adds a value of 1% every 50ms. After the progress ring is filled 100%, the page reloads.

```js
var interval;
var _update = function() {
	var test = myApp.displayProgress();
	interval = setInterval(function() {
		if (test.currentProgress >= 100) {
			location.reload(true);
			clearInterval(interval);
			interval = undefined;
			return;
		}
		myApp.addProgress(1, true)
	}, 50);
}
```

### Menus

watchUI introduces Force Touch support for the iPhone 6s and the Simulator. MacBooks with Force Touch Trackpad are currently unsupported because I couldn't test them. Coming with Force Touch are Context Menus, which are invoked by "Force Touching". They show up to 4 actions and are set up per page.

To listen to a Force Touch event, you use the `app.onForceTouch(appId, pageName, callback)` method. To invoke a menu, use `app.openMenu(items)`, where `items` is an array containing up to four actions. This is the example used in the watchUI demo:

```js
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
```

The `icon` attribute can either be one of the images included in `/img/menu/` or a custom icon. Always keep the [official guidelines](https://developer.apple.com/watch/human-interface-guidelines/) in mind when creating your own icons.

## The watchUI Simulator - Available for OS X

watchUI 2 also has its own Simulator, which is based on the iOS Simulator bundled with Xcode on OS X. But instead of running the software in an emulated environment, the Simulator shows watchUI running on your sever in a window the same size as an Apple Watch.

You can choose between the 38mm and 42mm models (Hardware -> Device), save screenshots (Cmd+S) and even emulate Force Touch (Cmd+Shift+2 for Deep Press, Cmd+Shift+1 for normal press). The Simulator also has its own User Agent containing the words "Apple Watch", so if you ever need testing of an Apple Watch specific feature, the Simulator will detect it.

The Simulator is currently only available on OS X, but will soon follow on Windows (if someone actually makes WebKit show -webkit-backdrop-filter on Windows). The Source Code will be available once it's cleaned up.