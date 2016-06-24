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
			if(health === 0)
				this.dead = true;
		},
		get: function() {
			return this._health;
		}
	},
	"move": {
		value: move
	}
});

function move(direction) {
	let display = this.display,
		x = this.x,
		y = this.y;
	if(direction === settings.CENTER) {
		if(display === 'up_walking') {
			this.display = 'up_standing';
		} else if(display === 'left_walking') {
			this.display = 'left_standing';
		} else if(display === 'right_walking') {
			this.display = 'right_standing';
		} else if(display === 'down_walking') {
			this.display = 'down_standing';
		}
	}
	else {
		this.direction = direction;
		if(direction === settings.UP) {
			this.display = 'up_walking';
		} else if(direction === settings.DOWN) {
			this.display = 'down_walking';
		} else if(direction === settings.LEFT) {
			this.display = 'left_walking';
		} else if(direction === settings.RIGHT) {
			this.display = 'right_walking';
		} else if(direction === settings.UP_LEFT) {
			this.display = 'left_walking';
		} else if(direction === settings.UP_RIGHT) {
			this.display = 'right_walking';
		} else if(direction === settings.DOWN_LEFT) {
			this.display = 'left_walking';
		} else if(direction === settings.DOWN_RIGHT) {
			this.display = 'right_walking';
		}
		GameObject.prototype.move.call(this);
	}
	this.checkCollision();
}

module.exports = Character;