'use strict';

let Character,
	Projectile,
	Firearm,
	Ammunition,
	DisplayObject,
	config = require('../config');

module.exports = {
	init: function() {
		Character = require('./character');
		Projectile = require('./projectile');
		Firearm = require('./firearm');
		Ammunition = require('./ammunition');
		DisplayObject = require('./displayObject');
	},
	createDisplayObject: function(type, additionalProperties) {
		let displayObject = null,
			property = null, 
			value = null,
			displayObjectData = config.displayObjects[type], 
			properties = displayObjectData.properties,
			className = displayObjectData.className;
		if(className === 'Character') {
			displayObject = new Character();
		} else if(className === 'DisplayObject') {
			displayObject = new DisplayObject();
		} else if(className === 'Projectile') {
			displayObject = new Projectile();
		} else if(className === 'Ammunition') {
			displayObject = new Ammunition();
		} else if(className === 'Firearm') {
			displayObject = new Firearm();
		} else {
			return false;
		}
		displayObject.type = type;
		for(property in properties) {
			displayObject[property] = properties[property];
		}
		for(property in additionalProperties) {
			displayObject[property] = additionalProperties[property];
		}
		return displayObject;
	}
}