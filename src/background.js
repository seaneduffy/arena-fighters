'use strict';

let GameObject = require('./gameObject'),
	settings = require('./settings');

function Background(image) {
	GameObject.prototype.constructor.call(this);
	this.x = settings.stageWidth / 2;
	this.y = settings.stageHeight / 2;
	this.interacts = false;
}

Background.prototype = Object.create(GameObject.prototype);

module.exports = Background;