let Sprite = require('./sprite'),
	settings = require('./settings'),
	GameObject = require('./gameObject'),
	cycle = require('./cycle');

function Bullet() {
	GameObject.prototype.constructor.call(this);
}

Bullet.prototype = Object.create(GameObject.prototype);

Bullet.prototype.fire = function() {
	cycle.addGameObjectUpdateFunction(this, this.move.bind(this));
};

Bullet.prototype.onCollidedWith = function(collidedObject) {
	if(collidedObject.type === 'bullet')
		return;
};


Bullet.prototype.onCollision = function(collidedObject) {
	if(collidedObject.type !== 'bullet')
		this.destroyed = true;
};

Bullet.prototype.move = function() {
	GameObject.prototype.move.call(this);
	this.checkCollision();
}

module.exports = Bullet;