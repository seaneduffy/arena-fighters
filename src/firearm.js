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
	}
});

function fire(origin){
	let ammunition = utils.createGameObject(this.ammunition, {
		x: this.x,
		y: this.y,
		origin: origin
	});
	ammunition.emit();
}

module.exports = Firearm;