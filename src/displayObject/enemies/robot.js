'use strict';

let Enemy = require('./enemy'),
	Character = require('../character'),
	cycle = require('../../cycle'),
	geom = require('../../geom'),
	config = require('../../config');

function Robot() {
	Enemy.call(this);
	this.attacking = false;
	cycle.wait(this.cycleWalk = this.walk.bind(this), 100);
}

Robot.prototype = Object.create(Enemy.prototype, {
	'walkDelay': {
		get: function() {
			if(typeof this._walkDelay !== 'undefined')
				return this._walkDelay;
			return this._walkDelay = config.frameRate * this.walkFrameDelay;
		}
	},
	'attackDelay': {
		get: function() {
			if(typeof this._attackDelay !== 'undefined')
				return this._attackDelay;
			let sprite = this.sprites['$down_attacking'];
			return this._attackDelay = sprite.frameRate;
		}
	},
	'endAttackDelay': {
		get: function() {
			if(typeof this._endAttackDelay !== 'undefined')
				return this._endAttackDelay;
			let sprite = this.sprites['$down_attacking'];
			return this._endAttackDelay = sprite.frameRate;
		}
	},
	'walk': {
		value: function() {
			
			if(this.attacking)
				return;
			
			this.distancePlayer1 = this.getDistanceToPlayer(this.player1);
			this.distancePlayer2 = this.getDistanceToPlayer(this.player2);
			this.closestPlayer = this.getClosestPlayer();
			
			this.direction = geom.getAngle(this.x, this.y, this.closestPlayer.x, this.closestPlayer.y);
			
			let directionLabel = this.directionLabel;
			
			if(directionLabel === config.UP) {
				this.display = '$down_walking';
			} else if(directionLabel === config.DOWN) {
				this.display = '$down_walking';
			} else if(directionLabel === config.LEFT) {
				this.display = '$down_walking';
			} else if(directionLabel === config.RIGHT) {
				this.display = '$down_walking';
			} else if(directionLabel === config.UP_LEFT) {
				this.display = '$down_walking';
			} else if(directionLabel === config.UP_RIGHT) {
				this.display = '$down_walking';
			} else if(directionLabel === config.DOWN_LEFT) {
				this.display = '$down_walking';
			} else if(directionLabel === config.DOWN_RIGHT) {
				this.display = '$down_walking';
			}
			
			this.applyForce({
				direction: this.direction,
				speed: this.speed
			});
			
			if(!!this.cycleWalk)
				cycle.endWait(this.cycleWalk);
			cycle.wait(this.cycleWalk = this.walk.bind(this), this.walkDelay);
		}
	},
	'melee': {
		value: function(target) {
			if(this.attacking)
				return;
			
			cycle.endWait(this.cycleWalk);
			this.stop();
			this.attacking = true;
			this.display = this.display.replace(/\_.+/, '_attacking');
			
			let sprite = this.sprites[this.display];
			
			if(!!this.cycleMeleeAttack)
				cycle.endWait(this.cycleMeleeAttack);
			cycle.wait(this.cycleMeleeAttack = this.meleeAttack.bind(this, target), this.attackDelay);
			
		}
	},
	'endAttack': {
		value: function() {
			
			this.attacking = false;
			this.display = this.display.replace(/\_.+/, '_standing');
			
			this.walk();
		}
	},
	'meleeAttack': {
		value: function(target) {
			
			let boundingBox = {
				x: this.x + this.meleeHitbox.x - this.meleeHitbox.width / 2,
				y: this.y + this.meleeHitbox.y - this.meleeHitbox.height / 2,
				width: this.meleeHitbox.width,
				height: this.meleeHitbox.height
			}
			if(!!this.checkCollision(boundingBox, target.boundingBox, 0, 0)) {
				//target.health -= this.meleeDamage;
			}
			if(!!this.cycleEndAttack)
				cycle.endWait(this.cycleEndAttack);
			cycle.wait(this.cycleEndAttack = this.endAttack.bind(this), this.endAttackDelay);
		}
	},
	
	'stop': {
		value: function() {
			this.display = this.display.replace(/\_.+/, '_standing');
			this.velocity.speed = 0;
			this.velocity.dX = 0;
			this.velocity.dY = 0;
		}
	},
	'onCollision': {
		value: function(collidedObject) {
			/*let v = this.velocity,
				ran = 0,
				angle = 0;
			if(v.dX === 0 && v.dY !== 0) {
				if(Math.round(Math.random()) === 0)
					angle = Math.PI;
				else
					angle = 0;
			} else if(v.dY === 0 && v.dX !== 0) {
				if(Math.round(Math.random()) === 0)
					angle = 3 * Math.PI / 2;
				else
					angle = Math.PI / 2;
			} else {
				let ran = Math.round(Math.random() * 3);
				if(ran === 0) {
					angle = 0;
				} else if(ran === 1) {
					angle = Math.PI / 2;
				} else if(ran === 2) {
					angle = Math.PI;
				} else {
					angle = 3 * Math.PI / 2;
				}
			}
			this.walk(1, angle);*/
			Character.prototype.onCollision.call(this, collidedObject);
		}
	}
});

module.exports = Robot;