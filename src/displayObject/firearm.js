'use strict';

let DisplayObject = require('./displayObject'),
	utils = require('./utils'),
	cycle = require('../cycle');

function Firearm(){
	DisplayObject.prototype.constructor.call(this);
}

Firearm.prototype = Object.create(DisplayObject.prototype, {
	'ammunition': {
		get: function(){
			return this._ammunition;
		},
		set: function(ammunition){
			this._ammunition = ammunition;
		}
	},
	'fire': {
		value: fire
	},
	'endBlastAnimation': {
		value: endBlastAnimation
	},
	'startBlastAnimation': {
		value: startBlastAnimation
	}
});

function fire(character){
	let point = this.getEdgePointFromDirection(character.direction);
	let	ammunition = utils.createDisplayObject(this.ammunition, {
		origin: character,
		direction: character.direction
	});
	ammunition.x = point.x;
	ammunition.y = point.y;
	ammunition.ignoreObject(character);
	character.ignoreObject(ammunition);
	let friendsString = character.friends.join(',');
	DisplayObject.getDisplayObjects().forEach(displayObject => {
		if(friendsString.match(new RegExp(displayObject.type.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')))) {
			ammunition.ignoreObject(displayObject);
			displayObject.ignoreObject(ammunition);
		}
	});
	ammunition.stage = true;
	ammunition.emit();
	this.startBlastAnimation();
}

function startBlastAnimation() {
	if(!!this.cycleEndBlastAnimation) {
		cycle.endWait(this.cycleEndBlastAnimation);
	} else {
		this.display = this.display.replace(/_.+/, '_firing');
		this.cycleEndBlastAnimation = this.endBlastAnimation.bind(this);
	}
	cycle.wait(this.cycleEndBlastAnimation, 3);
}

function endBlastAnimation() {
	delete this.cycleEndBlastAnimation;
	this.display = this.display.replace(/_.+/, '_off');
}

module.exports = Firearm;