let Sprite = require('./sprite'),
	config = require('../config'),
	DisplayObject = require('./displayObject'),
	cycle = require('../cycle');

function Projectile() {
	DisplayObject.prototype.constructor.call(this);
}

Projectile.prototype = Object.create(DisplayObject.prototype, {
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
	this.destroy();
};

module.exports = Projectile;