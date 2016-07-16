let Sprite = require('./sprite'),
	config = require('../config'),
	DisplayObject = require('./displayObject'),
	cycle = require('../cycle'),
	geom = require('../geom');
	
function Projectile() {
	DisplayObject.prototype.constructor.call(this);
}

Projectile.prototype = Object.create(DisplayObject.prototype, {
	'origin': {
		set: function(origin) {
			this._origin = origin;
		},
		get: function() {
			return this._origin;
		}
	},
	'onCollision': {
		value: function() {
			cycle.removeUpdate(this.cycleUpdateVelocity);
			this.destroy();
		}
	},
	'updateVelocity': {
		value: function() {
			let counter = cycle.getCounter(),
				diff = counter - this.startCounter,
				per = diff % this.velocityModifierFrequency / this.velocityModifierFrequency,
				sin = Math.sin(per * 2 * Math.PI),
				amplitude = this.velocityModifierAmplitude * sin,
				perpendicularVelocity = geom.getXYFromVector(0, 0,
					this.perpendicularDirection,
					amplitude);
			this.x += perpendicularVelocity.x - this.perpendicularVelocity.x;
			this.y += perpendicularVelocity.y - this.perpendicularVelocity.y;
			this.perpendicularVelocity = perpendicularVelocity;
		}
	},
	'velocity': {
		set: function(velocity) {
			this._velocity = this.processVelocity(velocity);
			let rad2pi = Math.PI * 2,
				angle = this.velocity.direction + Math.PI / 2;
			angle < 0 ? rad2pi + angle : angle;
			angle = angle > rad2pi ? angle - rad2pi : angle;
			this.perpendicularDirection = angle;
			this.perpendicularVelocity = {
				x: 0,
				y: 0
			}
		},
		get: function() {
			return Object.getOwnPropertyDescriptor(DisplayObject.prototype, 'velocity').get.call(this);
		}
	},
	'emit': {
		value: function() {
			this.applyForce({speed:this.speed, direction:this.direction});
			if(!!this.velocityModifierFrequency && !!this.velocityModifierAmplitude) {
				this.cycleUpdateVelocity = this.updateVelocity.bind(this);
				this.startCounter = cycle.getCounter();
				cycle.addUpdate(this.cycleUpdateVelocity);
			}
		}
	}
});

module.exports = Projectile;