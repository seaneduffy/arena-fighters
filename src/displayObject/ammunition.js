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
		value: function(collidedObject) {
			if(collidedObject !== this.origin) {
				if(!!collidedObject.takeDamage) {
					collidedObject.takeDamage(this.impact);
				}
				Projectile.prototype.onCollision.call(this, collidedObject);
			}
		}
	}
});

module.exports = Ammunition;