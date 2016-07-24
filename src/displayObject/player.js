'use strict';

let config = require('../config'),
	Character = require('./character'),
	DisplayObject = require('./displayObject'),
	aiFunctions = require('../ai'),
	cycle = require('../cycle');

function Player() {
	Character.call(this);
	
	this.sliding = false;
}

Player.prototype = Object.create(Character.prototype, {
	'walk': {
		value: walk
	},
	'slide': {
		value: slide
	},
	'joystick': {
		value: joystick
	},
	'fire': {
		value: fire
	}
});

function fire() {
	if(this.dead)
		return;
	
	this.firearm.fire(this);
}

function joystick(percentage, angle) {
	if(this.dead)
		return;
	
	if(
		this.velocity.speed >= this.speed && percentage >= 1 &&
		((angle > this.direction 
			&& angle > this.direction + Math.PI - 30 * Math.PI / 180 
			&& angle < this.direction + Math.PI + 30 * Math.PI / 180)
		|| (angle < this.direction 
			&& angle > this.direction - Math.PI - 30 * Math.PI / 180 
			&& angle < this.direction - Math.PI + 30 * Math.PI / 180))
	)
		
		this.slide();
	else
		this.walk(percentage, angle);
}

function walk(percentage, direction) {
	
	if(this.sliding)
		return;

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
	
	if(percentage <= 0) {
		this.display = this.display.replace('walking', 'standing');
		this.velocity = {
			dX: 0,
			dY: 0,
			direction: direction,
			speed: 0
		};
	} else {
		this.velocity = {
			direction: this.direction,
			speed: this.speed * percentage
		}
	}
}

function slide() {
	if(this.sliding)
		return;

	this.sliding = true;
	
	let direction = this.direction + Math.PI;
	
	direction = direction >= 2 * Math.PI ? direction - 2 * Math.PI : direction;

	this.direction = direction;
	
	let directionLabel = this.directionLabel;

	if(directionLabel === config.UP) {
		this.display = '$up_standing';
	} else if(directionLabel === config.DOWN) {
		this.display = '$down_standing';
	} else if(directionLabel === config.LEFT) {
		this.display = '$left_standing';
	} else if(directionLabel === config.RIGHT) {
		this.display = '$right_standing';
	} else if(directionLabel === config.UP_LEFT) {
		this.display = '$upleft_standing';
	} else if(directionLabel === config.UP_RIGHT) {
		this.display = '$upright_standing';
	} else if(directionLabel === config.DOWN_LEFT) {
		this.display = '$downleft_standing';
	} else if(directionLabel === config.DOWN_RIGHT) {
		this.display = '$downright_standing';
	}
	
	cycle.wait( ()=>{
		this.sliding = false;
	}, config.frameRate * 20);
	
}

module.exports = Player;