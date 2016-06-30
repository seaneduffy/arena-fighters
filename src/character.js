let settings = require('./settings'),
	GameObject = require('./gameObject');

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
	"health": {
		set: function(health) {
			this._health = health;
			if(health <= 0)
				this.dead = true;
		},
		get: function() {
			return this._health;
		}
	},
	"damage": damage,
	"move": {
		value: move
	}
});

function move(direction) {
	let display = this.display;
	this.direction = direction;
	if(direction === -1) {
		this.display = display.replace('walking', 'standing');
	}
	else {
		let directionLabel = this.directionLabel;
		if(directionLabel === settings.UP) {
			this.display = '_up_walking';
		} else if(directionLabel === settings.DOWN) {
			this.display = '_down_walking';
		} else if(directionLabel === settings.LEFT) {
			this.display = '_left_walking';
		} else if(directionLabel === settings.RIGHT) {
			this.display = '_right_walking';
		} else if(directionLabel === settings.UP_LEFT) {
			this.display = '_upleft_walking';
		} else if(directionLabel === settings.UP_RIGHT) {
			this.display = '_upright_walking';
		} else if(directionLabel === settings.DOWN_LEFT) {
			this.display = '_downleft_walking';
		} else if(directionLabel === settings.DOWN_RIGHT) {
			this.display = '_downright_walking';
		}
		GameObject.prototype.move.call(this);
	}
	this.checkCollision();
}

function damage(amount) {
	this.health -= amount;
}

module.exports = Character;