'use strict';

let Enemy = require('./enemy'),
	Character = require('../character'),
	cycle = require('../../cycle'),
	geom = require('../../geom'),
	config = require('../../config');

function Devil() {
	Enemy.call(this);
}

Devil.prototype = Object.create(Enemy.prototype, {
	'readyToJump': {
		get: function() {
			if(typeof this._readyToJump === 'undefined')
				return this._readyToJump = true;
			return this._readyToJump;
		},
		set: function(readyToJump) {
			this._readyToJump = readyToJump;
		}
	},
	'jump': {
		value: function(direction) {
			this.direction = direction;

			let directionLabel = this.directionLabel;

			if(directionLabel === config.UP) {
				this.display = '$up_walking';
			} else if(directionLabel === config.DOWN) {
				this.display = '$down_walking';
			} else if(directionLabel === config.LEFT) {
				this.display = '$left_walking';
			} else if(directionLabel === config.RIGHT) {
				this.display = '$right_walking';
			} else if(directionLabel === config.UP_LEFT) {
				this.display = '$upleft_walking';
			} else if(directionLabel === config.UP_RIGHT) {
				this.display = '$upright_walking';
			} else if(directionLabel === config.DOWN_LEFT) {
				this.display = '$downleft_walking';
			} else if(directionLabel === config.DOWN_RIGHT) {
				this.display = '$downright_walking';
			}
			
			this.applyForce({
				direction: direction,
				speed: this.speed
			});
		}
	},
	'stop': {
		value: function() {
			this.display = this.display.replace('walking', 'standing');
			this.velocity.speed = 0;
			this.velocity.dX = 0;
			this.velocity.dY = 0;
		}
	},
	'moveTime': {
		get: function() {
			return this._moveTime;
		},
		set: function(moveTime) {
			this._moveTime = moveTime;
		}
	},
	'movement': {
		value: function() {
			let counter = cycle.getCounter();
			this.jumpCounter = this.jumpCounter || 0;
			if(this.jumpCounter >= this.moveTime + Math.ceil(Math.random() * this.moveTime * 2)) {
				let direction = geom.getAngle(this.x, this.y, this.closestPlayer.x, this.closestPlayer.y);
				if(this.readyToJump) {
					let v = this.velocity;
					if(!!this.closestPlayer) {
						this.jump(direction);
					} else {
						if(v.dX !== 0 || v.dY !== 0)
							this.stop();
					}
					this.readyToJump = false;
				} else {
					this.stop();
					this.readyToJump = true;
				}
				this.jumpCounter = 0;
			} else {
				this.jumpCounter++;
			}
		}
	},
	'onCollision': {
		value: function(collidedObject) {
			/*let v = this._character.velocity,
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
			this._character.walk(1, angle);*/
			Character.prototype.onCollision.call(this, collidedObject);
		}
	}
});

module.exports = Devil;