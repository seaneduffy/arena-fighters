'use strict';

let Character,
	Projectile,
	Firearm,
	Ammunition,
	GameObject,
	config = require('../config');

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
			gameObjectData = config.gameObjects[type], 
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
			gameObject[property] = properties[property];
		}
		for(property in additionalProperties) {
			gameObject[property] = additionalProperties[property];
		}
		return gameObject;
	}
}