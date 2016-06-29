let Character = require('./character'),
	GameObject = require('./gameObject'),
	settings = require('./settings'),
	cycle = require('./cycle'),
	geom = require('./geom');

function Enemy() {
	Character.prototype.constructor.call(this);
}

Enemy.prototype = Object.create(Character.prototype, {
	'aggression': {
		set: function(aggression) {
			this._aggression = aggression;
		},
		get: function() {
			return this._aggression;
		}
	},
	'ai': {
		value: ai
	},
	'aiStart': {
		value: aiStart
	},
	'onCollidedWith': {
		value: onCollidedWith
	},
	'onCollidedBy': {
		value: onCollision
	}
});

function aiStart() {
	cycle.addGameObjectUpdateFunction(this, this.ai.bind(this));
}

function ai() {
	let distancePlayer1 = null,
		distancePlayer2 = null,
		player1 = settings.player1,
		player2 = settings.player2,
		player1OnStage = player1.stage,
		player2OnStage = null,
		closestPlayer = null;
		
	if(!player2)
		if(player1OnStage)
			closestPlayer = player1
		else
			return;
	else {
		player2OnStage = player2.stage;
		if(!player1OnStage && !player2OnStage) {
			return;
		} else if(!player1OnStage) {
			closestPlayer = player2;
		} else if(!player2OnStage) {
			closestPlayer = player1;
		} else {
			distancePlayer1 = geom.getDistance(this._x, this._y, player1.x, player1.y);
			distancePlayer2 = geom.getDistance(this._x, this._y, player2.x, player2.y);
			closestPlayer = distancePlayer2 < distancePlayer1 ? settings.player2 : settings.player1;
		}
	}
	if(!!closestPlayer) {
		let angle = this.getAngleToObject(closestPlayer),
			direction = this.getDirectionToObject(angle);
		this.move(direction);
	}
}

function onCollidedWith(collisionObject) {
	GameObject.prototype.onCollidedWith.call(this, collisionObject);
	onCollision(collisionObject);
}

function onCollision(collisionObject) {
	if(collisionObject.type === 'projectile' && this._stage) {
		this.dead = true;
	}
}

module.exports = Enemy;