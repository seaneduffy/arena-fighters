let Sprite = require('./sprite'),
	settings = require('./settings'),
	GameObject = require('./gameObject'),
	cycle = require('./cycle');

function Projectile() {
	GameObject.prototype.constructor.call(this);
}

Projectile.prototype = Object.create(GameObject.prototype, {
	'fire': {
		value: fire
	},
	'move': {
		value: move
	},
	'onCollidedWith': {
		value: onCollision
	},
	'onCollidedBy': {
		value: onCollision
	}
});

function fire() {
	cycle.addGameObjectUpdateFunction(this, this.move.bind(this));
};

function move() {
	GameObject.prototype.move.call(this);
	this.checkCollision();
}

function onCollision(collidedObject) {
	if(collidedObject.type !== 'projectile')
		this.destroyed = true;
};

module.exports = Projectile;