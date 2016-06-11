module.exports = function(file, callback, callbackError) {
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', file, true);

	xobj.onreadystatechange = function() {
		if (xobj.readyState == 4) {
			if (xobj.status == "200") {
				if (typeof(callback) === "function") {
					callback(JSON.parse(xobj.responseText));
				}
			} else {
				if (typeof(callbackError) === "function") {
					callbackError();
				}
			}
		}
	};
	xobj.send(null);
};