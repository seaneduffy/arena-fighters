'use strict';

let Projectile = require('./projectile')

function Ammunition() {
	Projectile.prototype.constructor.call(this);
}

Ammunition.prototype = Object.create(Projectile.prototype, {
	'impact': {
		set: function(impact) {
			this._impact = impact;
		},
		get: function() {
			return this._impact;
		}
	},
	'onCollidedWith': {
		value: onCollidedWith
	}
});

function onCollidedWith(collidedObject) {
	if(collidedObject !== this.origin 
		&& this.origin.friends.indexOf(collidedObject.type) === -1
		&& this.friends.indexOf(collidedObject.type) === -1) {
			
		if(!!collidedObject.takeDamage) {
			collidedObject.takeDamage(this.impact);
		}
		Projectile.prototype.onCollidedWith.call(this);
	}
};

module.exports = Ammunition;