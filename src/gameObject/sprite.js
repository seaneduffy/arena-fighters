'use strict';

let config = require('../config'),
	cycle = require('../cycle'),
	resources = require('../resources'),
	sprites = new Array(),
	availableSprites = Object.create(null);

function Sprite(id, sheetPath, frameData) {
	this.domElement = config.domElement;
	this.sheetPath = sheetPath;
	this.sheet = resources.get(sheetPath);
	if(!!frameData) {
		this.frameData = frameData;
		this.width = frameData[0].frame.w * config.resolution;
		this.height = frameData[0].frame.h * config.resolution;
	} else {
		this.frameMeta = {
			x: 0,
			y: 0,
			w: this.sheet.width,
			h: this.sheet.height
		}
		this.width = this.sheet.width * config.resolution;
		this.height = this.sheet.height * config.resolution;
	}
	this.id = id;
	this.draw();
	sprites.push(this);
}

Object.defineProperties(Sprite.prototype, {
	'x': {
		get: function(){
			if(!!this._x)
				return this._x;
			return this._x = 0;
		},
		set: function(x){
			this._x = x;
			let boundingBox = this.boundingBox;
			this.canvas.style.transform = 'translate('+boundingBox.x+'px, '+boundingBox.y+'px)';
		}
	},
	'y': {
		get: function(){
			if(!!this._y)
				return this._y;
			return this._y = 0;
		},
		set: function(y){
			this._y = y;
			let boundingBox = this.boundingBox;
			this.canvas.style.transform = 'translate('+boundingBox.x+'px, '+boundingBox.y+'px)';
		}
	},
	'z': {
		get: function(){
			if(!!this._z)
				return this._z;
			return this._z = 0;
		},
		set: function(z){
			this._z = z;
			this.canvas.style.zIndex = z;
		}
	},
	'stage': {
		get: function(){
			if(!!this._stage)
				return this._stage;
			return this._stage = false;
		},
		set: function(stage){
			this._stage = stage;
			this.canvas.style.position = 'absolute';
			this.canvas.style.display = stage ? 'block' : 'none';
			if(stage) {
				this.cycleStart = cycle.getCounter();
			}
		}
	},
	'boundingBox': {
		get: function() {
			return {
				x: this.x - this.width / 2,
				y: this.y - this.height / 2,
				width: this.width,
				height: this.height
			}
		}
	},
	'frame': {
		get: function() {
			if(!!this._frame)
				return this._frame;
			return this._frame = 0;
		},
		set: function(frame) {
			this._frame = frame;
		}
	},
	'frameMeta': {
		get: function() {
			if(!!this.frameData)
				return this.frameData[this.frame].frame;
			return this._frameMeta;
		},
		set: function(frameMeta) {
			this._frameMeta = frameMeta;
		}
	},
	'canvas': {
		get: function() {
			if(!!this._canvas)
				return this._canvas;
			this._canvas = document.createElement('canvas');
			this._canvas.className = this.id;
			this._canvas.style.display = 'none';
			this._canvas.style.transform = 'translate(0, 0)';
			this._canvas.setAttribute('width', this.width);
			this._canvas.setAttribute('height', this.height);
			this.domElement.appendChild(this._canvas);
			return this._canvas;
		}
	},
	'resolution': {
		get: function() {
			if(!!this._resolution)
				return this._resolution;
			return this._resolution = config.resolution;
		}
	},
	'context': {
		get: function() {
			return this.canvas.getContext('2d');
		}
	},
	'draw': {
		value: function(){
			let frameMeta = this.frameMeta;
			this.context.clearRect(0, 0, this.width, this.height);
			this.context.drawImage(
				this.sheet, 
				frameMeta.x, 
				frameMeta.y, 
				frameMeta.w, 
				frameMeta.h,
				0,
				0, 
				this.width, 
				this.height);
		}
	},
	'destroy': {
		value: function() {
			if(!this.destroyed) {
				this.stage = false;
				this.frame = 0;
				availableSprites[this.id] = availableSprites[this.id] || new Array();
				availableSprites[this.id].push(this);
				this.destroyed = true;
			}
		}
	},
	'destroyed': {
		get: function() {
			if(typeof this._destroyed === 'undefined')
				return this._destroyed = false;
			else return this._destroyed;
		},
		set: function(destroyed) {
			this._destroyed = destroyed;
		}
	},
	'cycleStart': {
		get: function() {
			if(this._cycleStart === 'undefined')
				return this._cycleStart = 0;
			return this._cycleStart
		}, 
		set: function(c) {
			this._cycleStart = c;
		}
	}
});

Sprite.getSprite = function(id, sheetPath, frameData) {
	let sprite = null, 
		availArray = availableSprites[id];
	if(!!availArray && availArray.length > 0) {
		sprite = availArray.pop();
		sprite.destroyed = false;
		return sprite;
	}
	return new Sprite(id, sheetPath, frameData);
}

Sprite.cleanup = function() {
	let tmp = new Array();
	sprites.forEach( sprite => {
		if(!sprite.destroyed)
			tmp.push(sprite);
	} );
	sprites = tmp;
}

Sprite.draw = function() {
	
	let counter = cycle.getCounter();
	sprites.forEach( sprite => {
		if(sprite.stage && !!sprite.frameData) {
			let frame = sprite.frame,
				counterDiff = counter - sprite.cycleStart;
			if(counterDiff >= sprite.frameData.length) {
				counterDiff = 0;
				sprite.cycleStart = counter;
			}
			sprite.frame = counterDiff;
			if(frame !== sprite.frame) {
				sprite.draw();
			}
		}
	} );
}

window.getSpriteTotal = function() {
	return sprites.length;
}

module.exports = Sprite;