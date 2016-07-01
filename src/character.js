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
	'damage': {
		value: damage
	},
	'move': {
		value: move
	},
	'onCollidedWith': {
		value: onCollidedWith
	},
	'ai': {
		set: function(ai) {
			this._ai = aiFunctions[ai];
			cycle.addGameObjectUpdateFunction(this, this._ai.bind(this));
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
			let z = null,
				directionLabel = this.directionLabel,
				display = null;
			if(directionLabel === global.UP 
				|| directionLabel === global.UP_LEFT
				|| directionLabel === global.UP_RIGHT
			) {
				z = this.z - 1;
			} else {
				z = this.z + 1;
			}
			if(directionLabel === global.UP) {
				display = '$up';
			} else if(directionLabel === global.DOWN) {
				display = '$down';
			} else if(directionLabel === global.LEFT) {
				display = '$left';
			} else if(directionLabel === global.RIGHT) {
				display = '$right';
			} else if(directionLabel === global.UP_LEFT) {
				display = '$upleft';
			} else if(directionLabel === global.UP_RIGHT) {
				display = '$upright';
			} else if(directionLabel === global.DOWN_LEFT) {
				display = '$downleft';
			} else if(directionLabel === global.DOWN_RIGHT) {
				display = '$downright';
			}
			this._firearm = utils.createGameObject(firearm, {
				x: this.x,
				y: this.y,
				z: z,
				display: display
			});
		}
	}
});

function onCollidedWith(collidedObject) {
	if(!!this.melee && this.enemies.find(type=>{ return type === collidedObject.type; })) {
		collidedObject.damage(this.melee);
	}	
	GameObject.prototype.onCollidedWith.call(this);
}

function move(direction) {
	let display = this.display;
	this.direction = direction;
	if(direction < 0) {
		this.display = display.replace('walking', 'standing');
		console.log(this.display);
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
		GameObject.prototype.move.call(this);
	}
	this.checkCollision();
}

function damage(amount) {
	this.health -= amount;
}

module.exports = Character;