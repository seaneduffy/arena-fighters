'use strict';

let Enemy = require('./enemy'),
	Character = require('../character'),
	cycle = require('../../cycle'),
	geom = require('../../../utils/geom'),
	config = require('../../config');

function Grunt() {
	Enemy.call(this);
	this.cycleWalk = this.walk.bind(this);
	this.cycleFire = this.fire.bind(this);
}

Grunt.prototype = Object.create(Enemy.prototype, {
	'fire': {
		value: function() {
			this.distancePlayer1 = this.getDistanceToPlayer(this.player1);
			this.distancePlayer2 = this.getDistanceToPlayer(this.player2);
			this.closestPlayer = this.getClosestPlayer();
			if(!this.closestPlayer)
				return;
				
			this.firearm.fire(this);
		}
	},
	'walkFrameDelay': {
		set: function(delay) {
			this._walkFrameDelay = delay;
			cycle.addUpdate(this.cycleWalk, config.frameRate * this._walkFrameDelay);
		},
		get: function() {
			return this._walkFrameDelay;
		}
	},
	'fireFrameDelay': {
		set: function(delay) {
			this._fireFrameDelay = delay;
			cycle.addUpdate(this.cycleFire, config.frameRate * this._fireFrameDelay);
		},
		get: function() {
			return this._fireFrameDelay;
		}
	},
	'walk': {
		value: function() {
			if(!this.closestPlayer) {
				cycle.removeUpdate(this.cycleWalk);
				this.stop();
				return;
			}	

			this.direction = geom.getAngle(this.x, this.y, this.closestPlayer.x, this.closestPlayer.y);

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
			
			this.velocity = {
				direction: this.direction,
				speed: this.speed
			};
		}
	},
	'stop': {
		value: function() {
			this.display = this.display.replace('standing', 'standing');
			this.velocity = {
				speed: 0,
				direction: 0
			};
		}
	},
	'destroy': {
		value: function() {
			cycle.removeUpdate(this.cycleWalk);
			cycle.removeUpdate(this.cycleFire);
			Character.prototype.destroy.call(this);
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