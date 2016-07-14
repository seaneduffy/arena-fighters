'use strict';

let GameObject = require('./gameObject'),
	utils = require('./utils');

function Firearm(){
	GameObject.prototype.constructor.call(this);
}

Firearm.prototype = Object.create(GameObject.prototype, {
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
	}
	
});

function fire(origin){
	let point = this.getEdgePointFromDirection(origin.direction);
	let	ammunition = utils.createGameObject(this.ammunition, {
		origin: origin,
		direction: origin.direction
	});
	ammunition.x = point.x;
	ammunition.y = point.y;
	ammunition.ignoreObject(origin);
	origin.ignoreObject(ammunition);
	ammunition.stage = true;
	ammunition.applyForce({speed:ammunition.speed, direction:ammunition.direction});
	this.display = this.display.replace(/_.+/, '_firing');
	setTimeout(()=>{
		this.display = this.display.replace(/_.+/, '_off');
	}, 100);
}

module.exports = Firearm;