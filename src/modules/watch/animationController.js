(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var animation = function(params) {
	this.params = {
		el: null,
		animationFunction: null,
		frame: 1,
		frameLength: 60,
		delay: 0,
		animationDone: false,
	};
	for (var param in params) {
		this.params[param] = params[param];
	}
	if (this.params.delay > 0) {
		this.params.frame -= ((60/1000) * this.params.delay);
		this.params._startFrame = -((60/1000) * this.params.delay) + 1;
	} else {
		this.params._startFrame = 1;
	}
	
	this._playAnimFrame = function() {
		this.params.frame = this.params._startFrame;
		this.params.animationDone = false;
	}
	this.playAnimFrame = function() {
		if (this.params.frame > this.params.frameLength || !this.params.animationFunction) {
			this.params.animationDone = true;
			return true;
		} else {
			this.params.animationDone = false;
		}
		this.params.animationFunction(this.params.frame);
		this.params.frame++;
		return false;
	}
	
	this._playAnimFrameReverse = function() {
		this.params.frame = this.params.frameLength;
		this.params.animationDone = false;
	}
	this.playAnimFrameReverse = function() {
		if (this.params.frame < this.params._startFrame-1 || !this.params.animationFunction) {
			this.params.animationDone = true;
			return true;
		} else {
			this.params.animationDone = false;
		}
		this.params.animationFunction(this.params.frame)
		this.params.frame--;
	}

}

var animationController = {
	animations: [],
	animationFrame: null,
	addAnimation: function(params) {
		this.animations.push(new animation(params));
	},

	playAnimation: function() {
		for (var i=0; i<animationController.animations.length; i++) {
			animationController.animations[i]._playAnimFrame();
		}
		animationController._playAnimation();
		animationController.animationFrame = requestAnimationFrame(animationController._playAnimation);
	},
	_playAnimation: function() {
		var animationDone = [];
		for (var i=0; i<animationController.animations.length; i++) {
			animationController.animations[i].playAnimFrame();
			animationDone.push(animationController.animations[i].params.animationDone);
		}
		if (animationDone.indexOf(false) == -1) {
			cancelAnimationFrame(animationController.animationFrame);
			animationController.animationFrame = null;
			animationController.animations = [];
		} else {
			animationController.animationFrame = requestAnimationFrame(animationController._playAnimation);
		}
	},
	playAnimationReverse: function() {

		animationController._playAnimationReverse();
		animationController.animationFrame = requestAnimationFrame(animationController._playAnimationReverse);
	},
	_playAnimationReverse: function() {
		var animationDone = [];
		for (var i=0; i<animationController.animations.length; i++) {
			animationController.animations[i].playAnimFrameReverse();
			animationDone.push(animationController.animations[i].params.animationDone);
		}
		if (animationDone.indexOf(false) == -1) {
			cancelAnimationFrame(animationController.animationFrame);
			animationController.animationFrame = null;
			animationController.animations = [];
		} else {
			animationController.animationFrame = requestAnimationFrame(animationController._playAnimationReverse);
		}
	},
}

module.exports = animationController;