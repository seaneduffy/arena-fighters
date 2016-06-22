let Sprite = require('./sprite'),
	settings = require('./settings'),
	state = require('./state'),
	GameObject = require('./gameObject'),
	joystick = require('./joystick'),
	characterSpeed = settings.characterSpeed,
	characterSpriteUpWalking = settings.characterSpriteUpWalking,
	characterSpriteDownWalking = settings.characterSpriteDownWalking,
	characterSpriteLeftWalking = settings.characterSpriteLeftWalking,
	characterSpriteRightWalking = settings.characterSpriteRightWalking,
	characterSpriteUp = settings.characterSpriteUp,
	characterSpriteDown = settings.characterSpriteDown,
	characterSpriteLeft = settings.characterSpriteLeft,
	characterSpriteRight = settings.characterSpriteRight;

function Character(stateLabel) {
	GameObject.prototype.constructor.call(this, stateLabel);
}

Character.prototype = Object.create(GameObject.prototype);

Character.prototype.move = function(direction) {
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
}

module.exports = Character;