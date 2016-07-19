'use strict';

let config = require('../config'),
	DisplayObject = require('./displayObject'),
	Firearm = require('./firearm'),
	cycle = require('../cycle');

function Character() {
	DisplayObject.prototype.constructor.call(this);
}

Character.prototype = Object.create(DisplayObject.prototype, {
	'dead': {
		set: function(dead) {
			this._dead = dead;
			if(dead) {
				this.destroy();
			}
		}, 
		get: function() {
			if(typeof this._dead === 'undefined')
				return this._dead = false;
			return this._dead;
		}
	},
	'destroy': {
		value: function() {
			if(!!this.firearm)
				this.firearm.destroy();
			DisplayObject.prototype.destroy.call(this);
		}
	},
	'health': {
		set: function(health) {
			this._health = health;
			if(health <= 0)
				this.dead = true;
		},
		get: function() {
			return this._health;
		}
	},
	'takeDamage': {
		value: takeDamage
	},
	'walk': {
		value: walk
	},
	'onCollision': {
		value: onCollision
	},
	'melee': {
		set: function(melee) {
			this._melee = melee;
		},
		get: function() {
			return this._melee;
		}
	},
	'firearmType': {
		set: function(firearmType) {
			this._firearmType = firearmType;
			if(!!this._directionLabel)
				this.initFirearm();
		},
		get: function() {
			return this._firearmType;
		}
	},
	'directionLabel': {
		set: function(directionLabel) {
			Object.getOwnPropertyDescriptor(DisplayObject.prototype, 'directionLabel').set.call(this, directionLabel);
			if(!!this._firearmType && !this.firearm)
				this.initFirearm();
		},
		get: function() {
			return Object.getOwnPropertyDescriptor(DisplayObject.prototype, 'directionLabel').get.call(this);
		}
	},
	'initFirearm': {
		value: initFirearm
	},
	'updateFirearmDisplay': {
		value: updateFirearmDisplay
	},
	'x': {
		set: function(x) {
			Object.getOwnPropertyDescriptor(DisplayObject.prototype, 'x').set.call(this, x);
		},
		get: function() {
			return Object.getOwnPropertyDescriptor(DisplayObject.prototype, 'x').get.call(this);
		}
	},
	'y': {
		set: function(y) {
			Object.getOwnPropertyDescriptor(DisplayObject.prototype, 'y').set.call(this, y);
		},
		get: function() {
			return Object.getOwnPropertyDescriptor(DisplayObject.prototype, 'y').get.call(this);
		}
	},
	'direction': {
		set: function(angle) {
			Object.getOwnPropertyDescriptor(DisplayObject.prototype, 'direction').set.call(this, angle);
		},
		get: function() {
			return Object.getOwnPropertyDescriptor(DisplayObject.prototype, 'direction').get.call(this);
		}
	},
	'move': {
		value: function() {
			DisplayObject.prototype.move.call(this);
			if(!!this.firearm)
				this.updateFirearmDisplay();
		}
	}
});

function initFirearm() {
	this.firearm = new Firearm();
	let firearmData = config.displayObjects[this.firearmType],
		property = null;
	for(property in firearmData) {
		this.firearm[property] = firearmData[property];
	}
	this.firearm.x = this.x;
	this.firearm.y = this.y;
	this.updateFirearmDisplay();
	this.firearm.stage = true;
}

function updateFirearmDisplay() {
	let z = null,
		directionLabel = this.directionLabel,
		display = this.firearm.display || '$up_off';
	if(directionLabel === config.UP 
		|| directionLabel === config.UP_LEFT
		|| directionLabel === config.UP_RIGHT
	)
		z = this.z - 1;
	else
		z = this.z + 1;
	if(directionLabel === config.UP) {
		display = display.replace(/\$.+_/, '$up_');
	} else if(directionLabel === config.DOWN) {
		display = display.replace(/\$.+_/, '$down_');
	} else if(directionLabel === config.LEFT) {
		display = display.replace(/\$.+_/, '$left_');
	} else if(directionLabel === config.RIGHT) {
		display = display.replace(/\$.+_/, '$right_');
	} else if(directionLabel === config.UP_LEFT) {
		display = display.replace(/\$.+_/, '$upleft_');
	} else if(directionLabel === config.UP_RIGHT) {
		display = display.replace(/\$.+_/, '$upright_');
	} else if(directionLabel === config.DOWN_LEFT) {
		display = display.replace(/\$.+_/, '$downleft_');
	} else if(directionLabel === config.DOWN_RIGHT) {
		display = display.replace(/\$.+_/, '$downright_');
	}
	this.firearm.display = display;
	if(z !== this.firearm.z) {
		this.firearm.stage = false;
		this.firearm.z = z;
		this.firearm.stage = true;
	}
	this.firearm.x = this.firearmOffset[this.display].x + this.x;
	this.firearm.y = this.firearmOffset[this.display].y + this.y;
}

function onCollision(collidedObject) {
	if(!collidedObject !== 'wall' 
		&& !!this.melee 
		&& !this.friends.join(',').match(new RegExp(collidedObject.id))) {
				
		if(!!collidedObject.takeDamage)
			collidedObject.takeDamage(this.melee);
		
	}
}

function walk(power, direction) {

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
	
	if(power <= 0) {
		this.display = this.display.replace('walking', 'standing');
		this.velocity = {
			dX: 0,
			dY: 0,
			direction: direction,
			speed: 0
		};
	} else {
		this.applyForce({
			direction: direction,
			speed: this.speed * power
		});
	}
}

function takeDamage(amount) {
	this.health -= amount;
}

module.exports = Character;