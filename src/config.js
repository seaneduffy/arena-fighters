'use strict';

let config = {
	"hdImgPath": "/img/sprites/hd/",
	"hdJsonPath": "/data/sprites/hd/",
	"mdImgPath": "/img/sprites/md/",
	"mdJsonPath": "/data/sprites/md/",
	"sdImgPath": "/img/sprites/sd/",
	"sdJsonPath": "/data/sprites/sd/",
	"jsonUri": "/data.json",
	"fireBtnImage": "/img/fire.png",
	"joystickImage": "/img/joystick.png",
	"UP": 0,
	"LEFT": 3 * Math.PI / 2,
	"RIGHT": Math.PI / 2,
	"DOWN": Math.PI,
	"UP_LEFT": 7 * Math.PI / 4,
	"UP_RIGHT": Math.PI / 4,
	"DOWN_LEFT": 5 * Math.PI / 4,
	"DOWN_RIGHT": 3 * Math.PI / 4,
	"CENTER": -1,
	"dev": true
}

module.exports = config

if(config.dev) {
	window.getConfig = function(properties) {
		let value = config;
		if(!!properties) {
			properties = properties.split('.');
			properties.forEach( property => {
				value = value[property];
			});
		}
		return value;
	}

	window.setConfig = function(properties, setValue) {
		properties = properties.split('.');
		let value = config,
			lastValue = config,
			length = properties.length;
		properties.forEach( (property, index) => {
			if(index === length-1)
				value[property] = setValue;
			else
				value = value[property];
		});
		return value;
	}
}