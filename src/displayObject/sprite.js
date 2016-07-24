'use strict';

let config = require('../config'),
	cycle = require('../cycle'),
	resources = require('../resources'),
	id = require('../id'),
	socket = require('../socket'),
	sprites = new Array(),
	spritesToUpdate = new Array(),
	availableSprites = Object.create(null);

function Sprite(label, sheetPath, frameData, frameRate, loops) {
	this.domElement = config.domElement;
	this.sheetPath = sheetPath;
	this.sheet = resources.get(sheetPath);
	if(!!frameData && !!frameRate) {
		this.frameData = frameData;
		this.width = frameData[0].frame.w;
		this.height = frameData[0].frame.h;
		this.frameRate = frameRate;
		this.loops = loops;
		this.frameElapsedTime = 0;
	} else {
		this.frameMeta = {
			x: 0,
			y: 0,
			w: this.sheet.width,
			h: this.sheet.height
		}
		this.width = this.sheet.width;
		this.height = this.sheet.height;
	}
	this.label = label;
	this.id = id.id();
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
			x = x * this.distanceScale - this.width * this.resolutionScale / 2;
			let y = this.y * this.distanceScale - this.height * this.resolutionScale / 2;
			this.canvas.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
			if(this.hosting && this.stage) {
				this.addUpdate();
			}
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
			y = y * this.distanceScale - this.height * this.resolutionScale / 2;
			let x = this.x * this.distanceScale - this.width * this.resolutionScale / 2;
			this.canvas.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
			if(this.hosting && this.stage) {
				this.addUpdate();
			}
		}
	},
	'z': {
		get: function(){
			if(!!this._z)
				return this._z;
			return this._z = 1;
		},
		set: function(z){
			this._z = z;
			this.canvas.style.zIndex = z;
			if(this.hosting && this.stage) {
				this.addUpdate();
			}
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
			this.canvas.style.display = stage ? 'block' : 'none';
			if(stage) {
				this.frame = 0;
				this.frameElapsedTime = 0;
				this.draw();
				this.frame = 1;
			}
			if(this.hosting) {
				this.addUpdate();
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
			this._canvas.className = this.label;
			this._canvas.style.display = 'none';
			this._canvas.style.zIndex = 1;
			this._canvas.style.position = 'absolute';
			this._canvas.style.transform = 'translate(0, 0)';
			this._canvas.style.transition = 'transform ' + config.frameRate + 'ms linear';
			this._canvas.setAttribute('width', this.width * this.resolutionScale + 'px');
			this._canvas.setAttribute('height', this.height * this.resolutionScale + 'px');
			this.domElement.appendChild(this._canvas);
			return this._canvas;
		}
	},
	'resolutionScale': {
		get: function() {
			if(!!this._resolutionScale)
				return this._resolutionScale;
			return this._resolutionScale = config.resolutionScale;
		}
	},
	'distanceScale': {
		get: function() {
			if(!!this._distanceScale)
				return this._distanceScale;
			return this._distanceScale = config.distanceScale;
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
				this.width * this.resolutionScale, 
				this.height * this.resolutionScale);
		}
	},
	'addUpdate': {
		value: addUpdate
	},
	'destroy': {
		value: function() {
			if(!this.destroyed) {
				this.stage = false;
				this.frame = 0;
				availableSprites[this.label] = availableSprites[this.label] || new Array();
				availableSprites[this.label].push(this);
				this.destroyed = true;
				if(this.hosting) {
					this.addUpdate();
				}
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
	'hosting': {
		get: function() {
			if(typeof this._hosting === 'undefined')
				return this._hosting = config.hosting;
			return this._hosting;
		}
	}
});

function addUpdate() {
	let updateObj = spritesToUpdate.find((obj)=>{
		return (obj.id === this.id);
	}),
	values = {
		stage: this.stage,
		x: this.x,
		y: this.y,
		z: this.z,
		sheetPath: this.sheetPath,
		label: this.label,
		frameData: this.frameData,
		id: this.id,
		frameRate: this.frameRate,
		loops: this.loops,
		destroyed: this.destroyed
	};
	if(typeof updateObj === 'undefined') {
		spritesToUpdate.push(values);
	} else {
		for(let property in values)
			updateObj[property] = values[property];
	}
}

Sprite.getSprite = function(label, sheetPath, frameData, frameRate, loops) {
	let sprite = null, 
		availArray = availableSprites[label];
	if(!!availArray && availArray.length > 0) {
		sprite = availArray.pop();
		sprite.destroyed = false;
		return sprite;
	}
	return new Sprite(label, sheetPath, frameData, frameRate, loops);
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
	
	sprites.forEach( sprite => {

		if(sprite.stage && !!sprite.frameData && sprite.frameRate 
			&& (!!sprite.loops || sprite.frame < sprite.frameData.length) ) {
				
			if(sprite.frameElapsedTime < sprite.frameRate) {
				
				sprite.frameElapsedTime += config.frameRate;
				
			} else {
				
				sprite.frameElapsedTime = 0;
				
				sprite.draw();
				
				if(sprite.frame >= sprite.frameData.length-1 && sprite.loops) {
					sprite.frame = 0;
				}
				if(sprite.frame < sprite.frameData.length-1) {
					sprite.frame++;
				}
			}
		}
	} );
}

Sprite.receiveUpdate = function(serverSprites) {
	let sprite = null, property;
	serverSprites.forEach( spriteData => {
		sprite = sprites.find( s => {
			return s.id === spriteData.id;
		});
		if(typeof sprite === 'undefined' && !spriteData.destroyed) {
			sprite = Sprite.getSprite(spriteData.label, 
				spriteData.sheetPath, 
				spriteData.frameData, 
				spriteData.frameRate, 
				spriteData.loops);
		}
		if(!!sprite) {
			for(property in spriteData) {
				if(property !== 'sheetPath'
					&& property !== 'label'
					&& property !== 'frameData'
					&& property !== 'frameRate'
					&& property !== 'loops')
				
					sprite[property] = spriteData[property];
			}
		}
	});
}

Sprite.sendUpdate = function() {
	if(spritesToUpdate.length > 0)
		socket.emit('sprite update', spritesToUpdate);
	spritesToUpdate = new Array();
}

if(config.dev) {
	window.getSpriteTotal = function() {
		return sprites.length;
	}
}


/*
var slimmerState = new Float64Array([
  0,
  15.290663048624992,
  2.0000000004989023,
  -24.90756910131313,
  0.32514392007855847,
  -0.8798439564294107,
  0.32514392007855847,
  0.12015604357058937,
  1,
  7.490254936274141,
  2.0000000004989023,
  -14.188117316225544,
  0,
  0.018308020720336753,
  0.1830802072033675,
  0.9829274917854702
]);

// Impose an 8-bit unsigned format onto the bytes
// stored in the ArrayBuffer.
var ucharView  = new Uint8Array( slimmerState.buffer );
var slimmerMsg = String.fromCharCode.apply(
  String, [].slice.call( ucharView, 0 )
);
var slimmerMsgSize = getUTF8Size( slimmerMsg ); // 170 bytes


// Decode
var decodeBuffer = new ArrayBuffer( slimmerMsg.length );
var decodeView   = new Uint8Array( decodeBuffer );

// Put message back into buffer as 8-bit unsigned.
for ( var i = 0; i < slimmerMsg.length; ++i ) {
  decodeView[i] = slimmerMsg.charCodeAt( i );
}

// Interpret the data as JavaScript Numbers
var decodedState = new Float64Array( decodeBuffer );
*/


module.exports = Sprite;