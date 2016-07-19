'use strict';

let config = {
	"jsonUri": "/data.json",
	"pi": Math.PI,
	"UP": 0,
	"LEFT": 3 * Math.PI / 2,
	"RIGHT": Math.PI / 2,
	"DOWN": Math.PI,
	"UP_LEFT": 7 * Math.PI / 4,
	"UP_RIGHT": Math.PI / 4,
	"DOWN_LEFT": 5 * Math.PI / 4,
	"DOWN_RIGHT": 3 * Math.PI / 4,
	"CENTER": -1,
	"dev": true,
	"console": true,
	"dev1": false,
	"dev2": false
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