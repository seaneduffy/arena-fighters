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
	'endFire': {
		value: endFire
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
	ammunition.applyForce({speed:ammunition.speed, direction:ammunition.direction});
	this.display = this.display.replace(/_.+/, '_firing');
	console.log('this.cycleEndFire', this.cycleEndFire);
	if(!!this.cycleEndFire)
		cycle.endWait(this.cycleEndFire);
	this.cycleEndFire = this.endFire.bind(this);
	cycle.wait(this.cycleEndFire, 3);
}

function endFire() {
	console.log('end fire');
	delete this.cycleEndFire;
	this.display = this.display.replace(/_.+/, '_off');
}

module.exports = Firearm;