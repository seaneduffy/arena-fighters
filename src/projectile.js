let Sprite = require('./sprite'),
	config = require('./config'),
	GameObject = require('./gameObject'),
	cycle = require('./cycle');

function Projectile() {
	GameObject.prototype.constructor.call(this);
}

Projectile.prototype = Object.create(GameObject.prototype, {
	'origin': {
		set: function(origin) {
			this._origin = origin;
		},
		get: function() {
			return this._origin;
		}
	},
	'onCollision': {
		value: onCollision
	}
});

function onCollision(collidedObject) {
	this.destroyed = true;
};

module.exports = Projectile;