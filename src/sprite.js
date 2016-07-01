let global = require('./global'),
	resources = require('./resources'),
	socket = require('./socket'),
	cycle = require('./cycle'),
	id = require('./id'),
	sprites = Object.create(null),
	stage = Object.create(null),
	spritesToUpdate = [],
	rotation = 0,
	hosting = false;

function Sprite(spriteSheetPath, imageMeta, spriteId) {
	this.spriteSheet = resources.get(spriteSheetPath);
	this.spriteSheetPath = spriteSheetPath;
	this._id = spriteId || id();
	this._stage = false;
	
	if(!!imageMeta) {
		this.imageMeta = imageMeta;
		this.currFrame = 0;
		this.imageWidth = imageMeta[0].frame.w;
		this.imageHeight = imageMeta[0].frame.h;
	} else {
		this.imageWidth = this.spriteSheet.width;
		this.imageHeight = this.spriteSheet.height;
	}
	
	this.width = this.imageWidth * global.resolution;
	this.height = this.imageHeight * global.resolution;
	
	this.addUpdate('spriteSheetPath', spriteSheetPath);
	this.addUpdate('imageMeta', imageMeta);
	this.addUpdate('id', id);
}

Object.defineProperties(Sprite.prototype, {
	'label': {
		get: function() {
			return this._label;
		},
		set: function(label) {
			this._label = label;
		}
	},
	'updating': {
		set: function(updating) {
			this._updating = updating;
		},
		get: function() {
			return this._updating;
		}
	},
	'id': {
		get: function() {
			return this._id;
		},
		set: function(id) {
			this._id = id;
		}
	},
	'stage': {
		get: function() {
			return this._stage;
		},
		set: function(_stage) {
			let z = this._z;
			if(!this._stage && _stage) {
				this._stage = true;
				sprites[this.id] = this;
				if(!!stage[z])
					stage[z].push(this);
				else {
					stage[z] = [];
					stage[z].push(this);
				}
			} else if(this._stage && !_stage) {
				let arr = stage[z],
					index = arr.indexOf(this);
				this._stage = false;
				delete sprites[this.id];
				if(index !== -1) {
					arr.splice(index, 1);
				}
			}
			if(hosting) {
				this.addUpdate('stage', _stage);
			}
		}
	},
	'destroyed': {
		get: function() {
			return this._destroyed;
		},
		set: function(destroyed) {
			if(!this._destroyed && destroyed) {
				delete sprites[this.id];
				if(this._stage) {
					this.stage = false;
				}
				if(hosting) {
					this.addUpdate('destroyed', destroyed);
				}
			}
		}
	},
	'x': {
		set: function(x) {
			this._x = Math.floor(x);
			if(hosting) {
				this.addUpdate('x', x);
			}
		},
		get: function() {
			return this._x;
		}
	},
	'y': {
		set: function(y) {
			this._y = Math.floor(y);
			if(hosting) {
				this.addUpdate('y', y);
			}
		},
		get: function() {
			return this._y;
		}
	},
	'z': {
		set: function(z) {
			this._z = z;
			if(hosting) {
				this.addUpdate('z', z);
			}
		},
		get: function() {
			return this._z;
		}
	},
	'boundingBox': {
		get: function() {
			let x = this.x,
				y = this.y,
			width = this.imageWidth,
			height = this.imageHeight;
			if(isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height))
				return false;
			return {
				x: Math.floor(x - width / 2),
				y: Math.floor(y - height / 2),
				width: width,
				height: height
			}
		}
	},
	'draw': {
		value: draw
	},
	'addUpdate': {
		value: addUpdate
	}
});

function addUpdate(property, value) {
	let updateObj = spritesToUpdate.find((obj)=>{
		return (obj.id === this.id);
	});
	if(!updateObj) {
		updateObj = {id: this.id}
		spritesToUpdate.push(updateObj);
	}
	updateObj[property] = this[property];
}

function draw() {
	let boundingBox = this.boundingBox,
		resolution = global.resolution,
		imageX = null,
		imageY = null;
	
	if(!!this.imageMeta) {
		let currFrame = this.currFrame,
			imageInfo = this.imageMeta[currFrame];
		this.currFrame = currFrame >= this.imageMeta.length-1 ? 0 : currFrame + 1;
		imageX = imageInfo.frame.x;
		imageY = imageInfo.frame.y;
	} else {
		imageX = 0;
		imageY = 0;
	}
	
	global.canvasContext.drawImage(
		this.spriteSheet,
		imageX,
		imageY, 
		this.imageWidth, 
		this.imageHeight, 
		boundingBox.x * resolution, 
		boundingBox.y * resolution, 
		boundingBox.width * resolution, 
		boundingBox.height * resolution);
}

function receiveUpdate(serverSprites) {
	let i = 0, l = serverSprites.length, spriteData = null, sprite = null, property;
	for(i; i<l; i++) {
		spriteData = serverSprites[i];
		sprite = sprites[spriteData.id] 
			|| new Sprite(spriteData.spriteSheetPath, spriteData.imageMeta, spriteData.id);
		for(property in spriteData) {
			if(property !== 'spriteSheetPath' 
				&& property !== 'id' 
				&& property !== 'imageMeta')
				
				sprite[property] = spriteData[property];
		}
	}
}

function sendUpdate() {
	if(spritesToUpdate.length > 0)
		socket.emit('sprite update', spritesToUpdate);
	spritesToUpdate = [];
}

Sprite.draw = function() {
	for(let z in stage) {
		let i = 0, l = stage[z].length;
		for(i=0; i<l; i++) {
			stage[z][i].draw.call(stage[z][i]);
		}
	}
};

Sprite.setHosting = function(isHosting) {
	hosting = isHosting;
	if(hosting)
		cycle.addServerUpdate(sendUpdate);
	else 
		socket.on('sprite update', receiveUpdate);
}

module.exports = Sprite;