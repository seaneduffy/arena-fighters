let Character = require('./character');

function Player(label) {
	Character.prototype.constructor.call(this, label);
}

Player.prototype = Object.create(Character.prototype, {
	'onCollidedWith': {
		value: onCollision
	},
	'onCollidedBy': {
		value: onCollision
	}
});

function onCollision(collisionObject) {
	if(collisionObject.type === 'grunt' && this._stage) {
		this.dead = true;
	}
}

module.exports = Player;