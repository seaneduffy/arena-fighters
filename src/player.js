let Character = require('./character');

function Player(label) {
	Character.prototype.constructor.call(this, label);
}

Player.prototype = Object.create(Character.prototype);

Player.prototype.die = function() {
	console.log('player die');
	this.stage = false;
	this.updateState();
	this.sendState();
}

Player.prototype.move = function(direction) {
	Character.prototype.move.call(this, direction);
	this.checkCollision();
	this.updateState();
	this.sendState();
}

Player.prototype.onCollision = function(collisionObject) {
	if(collisionObject.type === 'grunt' && this.onStage) {
		this.die();
	}
}

module.exports = Player;