let Character = require('./character'),
	GameObject = require('./gameObject');

function Player(label) {
	Character.prototype.constructor.call(this, label);
}

Player.prototype = Object.create(Character.prototype, {
	'onCollidedWith': {
		value: onCollidedWith
	},
	'onCollidedBy': {
		value: onCollision
	}
});

function onCollidedWith(collisionObject) {
	GameObject.prototype.onCollidedWith.call(this, collisionObject);
	onCollision(collisionObject);
}

function onCollision(collisionObject) {
	if(collisionObject.type === 'grunt' && this._stage) {
		this.dead = true;
	}
}

module.exports = Player;