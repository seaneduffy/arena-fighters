let Character = require('./character'),
	settings = require('./settings'),
	cycle = require('./cycle');

function Enemy(stateLabel) {
	Character.prototype.constructor.call(this, stateLabel);
}

Enemy.prototype = Object.create(Character.prototype);

Object.defineProperty(Enemy.prototype, 'aggression', {
	set: function(aggression) {
		this.enemyAggression = aggression;
	},
	get: function() {
		return this.enemyAggression;
	}
});

Enemy.prototype.aiStart = function() {
	cycle.addCycle(this.ai.bind(this));
};

Enemy.prototype.aiStop = function() {
	cycle.removeCycle(this.ai.bind(this));
};

Enemy.prototype.ai = function() {
	let distancePlayer1 = null,
		distancePlayer2 = null,
		player1 = settings.player1,
		player2 = settings.player2,
		player1OnStage = player1.stage,
		player2OnStage = player2.stage,
		closestPlayer = null;
	
	if(!player1OnStage && !player2OnStage) {
		return
	} else if(!player1OnStage) {
		closestPlayer = player2;
	} else if(!player2OnStage) {
		closestPlayer = player1;
	} else {
		distancePlayer1 = this.getDistanceToObject(player1);
		distancePlayer2 = this.getDistanceToObject(player2);
		closestPlayer = distancePlayer2 < distancePlayer1 ? settings.player2 : settings.player1;
	}
	if(!!closestPlayer) {
		let angle = this.getAngleToObject(closestPlayer),
			direction = this.getDirectionToObject(angle);
		this.move(direction);
		this.checkCollision();
		this.updateState();
		this.sendState();
	}
};

Enemy.prototype.die = function() {
	console.log('enemy destroy');
	this.aiStop();
	this.destroy();
	this.updateState();
	this.sendState();
};

Enemy.prototype.onCollision = function(collisionObject) {
	if(collisionObject.type === 'bullet' && this.onStage) {
		this.die();
	}
};

module.exports = Enemy;