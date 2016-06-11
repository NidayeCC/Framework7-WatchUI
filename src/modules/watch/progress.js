var _progress = {
	target: null,
	currentProgress: 0
}

module.exports = {
	displayProgress: function() {
		var watch = this;
		var $ = Dom7;
		
		if ($("div.watch-wrapper")[0]) {
			$('div.watch-wrapper').append('<div class="update-progress"><canvas width="312" height="312"></canvas></div>');
		} else {
			$('body').append('<div class="update-progress"><canvas width="312" height="312"></canvas></div>');
		}
		
		var canvas = $("div.update-progress canvas")[0];
		var ctx = canvas.getContext("2d");

		ctx.translate(156,156);
		ctx.rotate(90*Math.PI/180)
		for (var i=0; i<100; i++) {
			ctx.fillStyle="rgba(255,255,255,0.3)"
			ctx.fillRect(-156, -1, 12, 2);
			ctx.rotate(3.6*Math.PI/180)
		}
		
		_progress.target = canvas;
		return _progress;
	},
	setProgress: function(progress, percent) {
		var watch = this;
		var $ = Dom7;

		if (!$("div.update.progress")) {
			throw new Error("No update progress active!");
		}
		
		if (!percent) {
			progress = Math.round(progress*100);
		} else {
			progress = Math.round(progress);
		}
		progress = progress > 100 ? 100 : progress;
		progress = progress < 0 ? 0 : progress;
		
		_progress.currentProgress = progress;

		var canvas = $("div.update-progress canvas")[0];
		var ctx = canvas.getContext("2d");

		ctx.clearRect(-156,-156,312,312);
		for (var i=0; i<100; i++) {
			ctx.fillStyle="rgba(255,255,255,0.3)"
			if (i<progress) {
				ctx.fillStyle="#FFFFFF";
			}
			
			
			ctx.fillRect(-156, -1, 12, 2);
			ctx.rotate(3.6*Math.PI/180)
		}
	},
	addProgress: function(progress, percent) {
		var watch = this;
		var $ = Dom7;
		
		if (!$("div.update-progress")) {
			throw new Error("No update progress active!");
		}
		
		if (!percent) {
			progress = Math.round(progress*100);
		} else {
			progress = Math.round(progress);
		}
		progress = progress > 100 ? 100 : progress;
		progress = progress < 0 ? 0 : progress;

		watch.setProgress(_progress.currentProgress+progress, true);
	},
	hideProgress: function() {
		var watch = this;
		var $ = Dom7;
		
		$("div.update-progress").remove();
	}
}