let Sprite = require('./sprite'),
	settings = require('./settings'),
	GameObject = require('./gameObject'),
	cycle = require('./cycle');

function Projectile() {
	GameObject.prototype.constructor.call(this);
}

Projectile.prototype = Object.create(GameObject.prototype, {
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
	if(collidedObject.type !== 'projectile')
		this.destroyed = true;
};

module.exports = Projectile;