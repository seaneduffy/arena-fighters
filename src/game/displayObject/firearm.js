'use strict';

let DisplayObject = require('./displayObject'),
	Ammunition = require('./ammunition'),
	cycle = require('../cycle'),
	config = require('../config');

function Firearm(){
	DisplayObject.call(this);
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
	let point = this.getEdgePointFromDirection(character.direction),
		ammunitionData = config.displayObjects[this.ammunition],
		property = null,
		ammunition = new Ammunition();
	
	for(property in ammunitionData) {
		ammunition[property] = ammunitionData[property];
	}
	ammunition.origin = character;
	ammunition.direction = character.direction;
	ammunition.x = point.x;
	ammunition.y = point.y;
	ammunition.ignoreObject(character);
	character.ignoreObject(ammunition);
	
	DisplayObject.getDisplayObjects().forEach(displayObject => {
		if(!character.hostiles.match(new RegExp(displayObject.id.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')))) {
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
	cycle.wait(this.cycleEndBlastAnimation, 100);
}

function endBlastAnimation() {
	delete this.cycleEndBlastAnimation;
	this.display = this.display.replace(/_.+/, '_off');
}

module.exports = Firearm;