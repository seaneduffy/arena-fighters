'use strict';

let Character,
	Projectile,
	Firearm,
	Ammunition,
	GameObject,
	global = require('./global');

module.exports = {
	init: function() {
		Character = require('./character');
		Projectile = require('./projectile');
		Firearm = require('./firearm');
		Ammunition = require('./ammunition');
		GameObject = require('./gameObject');
	},
	createGameObject: function(type, additionalProperties) {
		let gameObject = null,
			property = null, 
			value = null,
			gameObjectData = global.settings[type], 
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
			value = properties[property];				
			if(typeof value === 'string' && value.indexOf('global.') !== -1) {
				value = global[value.replace('global.','')];
			}
			gameObject[property] = value;
		}
		for(property in additionalProperties) {
			value = additionalProperties[property];
			if(typeof value === 'string' && value.indexOf('global.') !== -1) {
				value = global[value.replace('global.','')];
			}
			gameObject[property] = value;
		}
		return gameObject;
	}
}