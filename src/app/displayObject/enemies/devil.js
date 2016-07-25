'use strict';

let Enemy = require('./enemy'),
	Character = require('../character'),
	cycle = require('../../cycle'),
	geom = require('../../../utils/geom'),
	config = require('../../config');

function Devil() {
	Enemy.call(this);
	
	this.cycleJump = this.jump.bind(this);
	this.cycleLand = this.land.bind(this);
	this.cycleStop = this.stop.bind(this);
	cycle.wait(this.cycleJump, 100);
}

Devil.prototype = Object.create(Enemy.prototype, {
	'destroy': {
		value: function() {
			Enemy.prototype.destroy.call(this);
		}
	},
	'jump': {
		value: function() {
			
			this.distancePlayer1 = this.getDistanceToPlayer(this.player1);
			this.distancePlayer2 = this.getDistanceToPlayer(this.player2);
			this.closestPlayer = this.getClosestPlayer();
			
			if(!!this.closestPlayer) {
				this.direction = geom.getAngle(this.x, this.y, this.closestPlayer.x, this.closestPlayer.y);

				let directionLabel = this.directionLabel;

				if(directionLabel === config.UP) {
					this.display = '$down_jumping';
				} else if(directionLabel === config.DOWN) {
					this.display = '$down_jumping';
				} else if(directionLabel === config.LEFT) {
					this.display = '$down_jumping';
				} else if(directionLabel === config.RIGHT) {
					this.display = '$down_jumping';
				} else if(directionLabel === config.UP_LEFT) {
					this.display = '$down_jumping';
				} else if(directionLabel === config.UP_RIGHT) {
					this.display = '$down_jumping';
				} else if(directionLabel === config.DOWN_LEFT) {
					this.display = '$down_jumping';
				} else if(directionLabel === config.DOWN_RIGHT) {
					this.display = '$down_jumping';
				}
			
				this.applyForce({
					direction: this.direction,
					speed: this.speed
				});

				cycle.wait(this.cycleLand, this.landDelay);
				cycle.wait(this.cycleStop, this.stopDelay);
			}
		}
	},
	'land': {
		value: function() {
			this.display = this.display.replace(/_.+/, '_landing');
		}
	},
	'stop': {
		value: function() {
			this.display = this.display.replace(/_.+/, '_standing');
			this.velocity.speed = 0;
			this.velocity.dX = 0;
			this.velocity.dY = 0;
			cycle.wait(this.cycleJump, this.jumpDelay);
		}
	},
	'jumpDelay': {
		get: function() {
			if(typeof this._jumpDelay !== 'undefined')
				return this._jumpDelay;
			return this._jumpDelay = this.jumpFrameDelay * config.frameRate;
		}
	},
	'stopDelay': {
		get: function() {
			if(typeof this._stopDelay !== 'undefined')
				return this._stopDelay;
			
			return this._stopDelay = config.frameRate * this.jumpTime;
		}
	},
	'landDelay': {
		get: function() {
			if(typeof this._landDelay !== 'undefined')
				return this._landDelay;
			let sprite = this.sprites['$down_landing'];
			return this._landDelay = this.stopDelay - sprite.frameData.length * sprite.frameRate;
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