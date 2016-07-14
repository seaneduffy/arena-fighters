'use strict';

let config = require('../config'),
	GameObject = require('./gameObject'),
	aiFunctions = require('../ai'),
	cycle = require('../cycle'),
	utils = require('./utils');

function Character() {
	GameObject.prototype.constructor.call(this);
}

Character.prototype = Object.create(GameObject.prototype, {
	'dead': {
		set: function(dead) {
			this._dead = dead;
			if(dead) {
				this.destroy();
				if(!!this.firearm)
					this.firearm.destroy();
			}
		}, 
		get: function() {
			if(typeof this._dead === 'undefined')
				return this._dead = false;
			return this._dead;
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
	'ai': {
		set: function(ai) {
			this._ai = new aiFunctions[ai](this);
		},
		get: function() {
			return this._ai;
		}
	},
	'melee': {
		set: function(melee) {
			this._melee = melee;
		},
		get: function() {
			return this._melee;
		}
	},
	'firearm': {
		set: function(firearm) {
			this._firearmType = firearm;
			if(!!this._directionLabel)
				this.initFirearm();
		},
		get: function() {
			return this._firearm;
		}
	},
	'directionLabel': {
		set: function(directionLabel) {
			Object.getOwnPropertyDescriptor(GameObject.prototype, 'directionLabel').set.call(this, directionLabel);
			if(!!this._firearmType && !this.firearm)
				this.initFirearm();
		},
		get: function() {
			return Object.getOwnPropertyDescriptor(GameObject.prototype, 'directionLabel').get.call(this);
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
			Object.getOwnPropertyDescriptor(GameObject.prototype, 'x').set.call(this, x);
			if(!!this.firearm)
				this.firearm.x = this.firearmOffset[this.display].x + x;
		},
		get: function() {
			return Object.getOwnPropertyDescriptor(GameObject.prototype, 'x').get.call(this);
		}
	},
	'y': {
		set: function(y) {
			Object.getOwnPropertyDescriptor(GameObject.prototype, 'y').set.call(this, y);
			if(!!this.firearm)
				this.firearm.y = this.firearmOffset[this.display].y + y;
		},
		get: function() {
			return Object.getOwnPropertyDescriptor(GameObject.prototype, 'y').get.call(this);
		}
	},
	'direction': {
		set: function(angle) {
			Object.getOwnPropertyDescriptor(GameObject.prototype, 'direction').set.call(this, angle);
			if(!!this.firearm)
				this.updateFirearmDisplay();
		},
		get: function() {
			return Object.getOwnPropertyDescriptor(GameObject.prototype, 'direction').get.call(this);
		}
	}
});

function initFirearm() {
	this._firearm = utils.createGameObject(this._firearmType);
	this._firearm.x = this.x;
	this._firearm.y = this.y;
	this.updateFirearmDisplay();
	this._firearm.stage = true;
}

function updateFirearmDisplay() {
	let z = null,
		directionLabel = this._directionLabel,
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
	if(z !== this._firearm.z) {
		this._firearm.stage = false;
		this._firearm.z = z;
		this._firearm.stage = true;
	}
}

function onCollision(collidedObject) {
	if(!!this.ai) {
		this.ai.onCollision();
	}
	if(!collidedObject !== 'wall' && !!this.melee && this.friends.indexOf(collidedObject.type) === -1) {
		if(!!collidedObject.takeDamage)
			collidedObject.takeDamage(this.melee);
	}
}

function walk(power, direction) {
	let display = this.display;
	this.direction = direction;
	if(direction < 0) {
		this.display = display.replace('walking', 'standing');
		this.velocity = {
			speed: 0,
			direction: -1,
			dX: 0,
			dY: 0
		};
		
	}
	else {
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
			speed: this.speed * power
		})
	}
}

function takeDamage(amount) {
	this.health -= amount;
}

module.exports = Character;