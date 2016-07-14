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
	'onCollision': {
		value: onCollision
	}
});

function onCollision(collidedObject) {
	if(collidedObject !== this.origin && this.origin.friends.indexOf(collidedObject.type) === -1) {
			
		if(!!collidedObject.takeDamage) {
			collidedObject.takeDamage(this.impact);
		}
		Projectile.prototype.onCollision.call(this, collidedObject);
	}
};

module.exports = Ammunition;