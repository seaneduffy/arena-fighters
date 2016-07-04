let Sprite = require('./sprite'),
	global = require('./global'),
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
	'emit': {
		value: emit
	},
	'move': {
		value: move
	},
	'onCollidedWith': {
		value: onCollidedWith
	}
});

function emit() {
	cycle.addGameObjectUpdateFunction(this, this.move.bind(this));
};

function move() {
	GameObject.prototype.move.call(this);
	this.checkCollision();
}

function onCollidedWith(collidedObject) {
	this.destroyed = true;
};

module.exports = Projectile;