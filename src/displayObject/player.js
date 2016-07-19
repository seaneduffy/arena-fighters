'use strict';

let config = require('../config'),
	Character = require('./character'),
	DisplayObject = require('./displayObject'),
	aiFunctions = require('../ai'),
	cycle = require('../cycle'),
	utils = require('./utils');

function Player() {
	Character.call(this);
}

Player.prototype = Object.create(Character.prototype, {
	'walk': {
		value: walk
	}
});

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

module.exports = Player;