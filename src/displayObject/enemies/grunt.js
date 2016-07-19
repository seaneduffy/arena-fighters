'use strict';

let Enemy = require('./enemy'),
	Character = require('../character'),
	cycle = require('../../cycle'),
	geom = require('../../geom'),
	config = require('../../config');

function Grunt() {
	Enemy.call(this);
	this.fireCounter = 0;
}

Grunt.prototype = Object.create(Enemy.prototype, {
	'movement': {
		value: function() {
			let velocity = this.velocity;
			if(!!this.closestPlayer) {
				let direction = geom.getAngle(this.x, this.y, this.closestPlayer.x, this.closestPlayer.y);
				this.walk(direction);
			} else if(velocity.dX !== 0 || velocity.dY !== 0) {
				this.stop();
			}
		}
	},
	'actions': {
		value: function() {
			if(this.actionsCounter > this.actionSpeed + Math.ceil(Math.random() * 5)) {
				this.actionsCounter = 0;
				this.distancePlayer1 = this.getDistanceToPlayer(this.player1);
				this.distancePlayer2 = this.getDistanceToPlayer(this.player2);
				this.closestPlayer = this.getClosestPlayer();
				this.movement();
				if(this.fireCounter > this.fireSpeed + Math.ceil(Math.random() * 5)) {
					this.fire();
					this.fireCounter = 0;
				} else {
					this.fireCounter++;
				}
			} else {
				this.actionsCounter++;
			}
		}
	},
	'fire': {
		value: function() {
			if(!!this.closestPlayer) {
				//let direction = geom.getAngle(this.x, this.y, this.closestPlayer.x, this.closestPlayer.y);
				this.firearm.fire(this);
			}
		}
	},
	'walk': {
		value: function(direction) {
			this.direction = direction;

			let directionLabel = this.directionLabel;

			if(directionLabel === config.UP) {
				this.display = '$right_standing';
			} else if(directionLabel === config.DOWN) {
				this.display = '$left_standing';
			} else if(directionLabel === config.LEFT) {
				this.display = '$left_standing';
			} else if(directionLabel === config.RIGHT) {
				this.display = '$right_standing';
			} else if(directionLabel === config.UP_LEFT) {
				this.display = '$left_standing';
			} else if(directionLabel === config.UP_RIGHT) {
				this.display = '$right_standing';
			} else if(directionLabel === config.DOWN_LEFT) {
				this.display = '$left_standing';
			} else if(directionLabel === config.DOWN_RIGHT) {
				this.display = '$right_standing';
			}
			
			this.applyForce({
				direction: direction,
				speed: this.speed
			});
		}
	},
	'stop': {
		value: function() {
			this.display = this.display.replace('standing', 'standing');
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

module.exports = Grunt;