'use strict';

let global = require('./global'),
	GameObject = require('./gameObject'),
	aiFunctions = require('./ai'),
	cycle = require('./cycle'),
	utils = require('./utils');

function Character() {
	GameObject.prototype.constructor.call(this);
	this._dead = false;
}

Character.prototype = Object.create(GameObject.prototype, {
	'dead': {
		set: function(dead) {
			this._dead = dead;
			if(dead) {
				this.destroyed = true;
				if(!!this.firearm)
					this.firearm.destroyed = true;
			}
		}, 
		get: function() {
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
				this.firearm.x = x;
		},
		get: function() {
			return Object.getOwnPropertyDescriptor(GameObject.prototype, 'x').get.call(this);
		}
	},
	'y': {
		set: function(y) {
			Object.getOwnPropertyDescriptor(GameObject.prototype, 'y').set.call(this, y);
			if(!!this.firearm)
				this.firearm.y = y;
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
	},
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
	if(directionLabel === global.UP 
		|| directionLabel === global.UP_LEFT
		|| directionLabel === global.UP_RIGHT
	)
		z = this.z - 1;
	else
		z = this.z + 1;
	if(directionLabel === global.UP) {
		display = display.replace(/\$.+_/, '$up_');
	} else if(directionLabel === global.DOWN) {
		display = display.replace(/\$.+_/, '$down_');
	} else if(directionLabel === global.LEFT) {
		display = display.replace(/\$.+_/, '$left_');
	} else if(directionLabel === global.RIGHT) {
		display = display.replace(/\$.+_/, '$right_');
	} else if(directionLabel === global.UP_LEFT) {
		display = display.replace(/\$.+_/, '$upleft_');
	} else if(directionLabel === global.UP_RIGHT) {
		display = display.replace(/\$.+_/, '$upright_');
	} else if(directionLabel === global.DOWN_LEFT) {
		display = display.replace(/\$.+_/, '$downleft_');
	} else if(directionLabel === global.DOWN_RIGHT) {
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
		if(directionLabel === global.UP) {
			this.display = '$up_walking';
		} else if(directionLabel === global.DOWN) {
			this.display = '$down_walking';
		} else if(directionLabel === global.LEFT) {
			this.display = '$left_walking';
		} else if(directionLabel === global.RIGHT) {
			this.display = '$right_walking';
		} else if(directionLabel === global.UP_LEFT) {
			this.display = '$upleft_walking';
		} else if(directionLabel === global.UP_RIGHT) {
			this.display = '$upright_walking';
		} else if(directionLabel === global.DOWN_LEFT) {
			this.display = '$downleft_walking';
		} else if(directionLabel === global.DOWN_RIGHT) {
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