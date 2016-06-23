let Character = require('./character');

function Player(label) {
	Character.prototype.constructor.call(this, label);
	this.isDead = false;
}

Player.prototype = Object.create(Character.prototype);

Object.defineProperty(Player.prototype, 'dead', {
	set: function(dead) {
		this.isDead = dead;
		if(dead) {
			this.destroyed = true;
		}
	}, 
	get: function() {
		return this.isDead;
	}
});

Player.prototype.move = function(direction) {
	Character.prototype.move.call(this, direction);
	this.checkCollision();
}

Player.prototype.onCollision = function(collisionObject) {
	if(collisionObject.type === 'grunt' && this.onStage) {
		this.dead = true;
	}
}

module.exports = Player;