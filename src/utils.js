'use strict';

let Character,
	Projectile,
	Firearm,
	Ammunition,
	GameObject,
	config = require('./config');

function processValue(value) {
	if(typeof value === 'string' && value.indexOf('config.') !== -1) {
		let values = value.match(/[config\.|a-z|A-Z|0-9]+/g),
			operators = value.match(/[\+|\/|\-|\*]/g),
			operator = '',
			l = values.length;
	
		for(let i=0; i<l; i++) {
			if(values[i].indexOf('config.') !== -1) {
				values[i] = config[values[i].replace('config.','')] * 1;
			}
			values[i] *= 1;
			if(i !== 0) {
				operator = operators[i-1];
				if(operator === '+')
					value += values[i];
				else if(operator === '-')
					value -= values[i];
				else if(operator === '*')
					value *= values[i];
				else if(operator === '/')
					value /= values[i];
			} else {
				value = values[i];
			}
		}
	}
	return value;
}

module.exports = {
	init: function() {
		Character = require('./character');
		Projectile = require('./projectile');
		Firearm = require('./firearm');
		Ammunition = require('./ammunition');
		GameObject = require('./gameObject');
	},
	processValue: processValue,
	createGameObject: function(type, additionalProperties) {
		let gameObject = null,
			property = null, 
			value = null,
			gameObjectData = config.settings[type], 
			properties = gameObjectData.properties,
			className = gameObjectData.className;
			
		if(className === 'Character') {
			gameObject = new Character();
		} else if(className === 'GameObject') {
			gameObject = new GameObject();
		} else if(className === 'Projectile') {
			gameObject = new Projectile();
		} else if(className === 'Ammunition') {
			gameObject = new Ammunition();
		} else if(className === 'Firearm') {
			gameObject = new Firearm();
		} else {
			return false;
		}
		gameObject.type = type;
		for(property in properties) {
			gameObject[property] = processValue(properties[property]);
		}
		for(property in additionalProperties) {
			gameObject[property] = processValue(additionalProperties[property]);
		}
		return gameObject;
	}
}