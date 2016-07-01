let settings = require('./settings'),
	resources = require('./resources'),
	socket = require('./socket'),
	cycle = require('./cycle'),
	id = require('./id'),
	sprites = Object.create(null),
	stage = Object.create(null),
	spritesToUpdate = [],
	rotation = 0,
	hosting = false;

function receiveUpdate(serverSprites) {
	let i = 0, l = serverSprites.length, spriteData = null, sprite = null, property;
	for(i=0; i<l; i++) {
		spriteData = serverSprites[i];
		sprite = sprites[spriteData.id] || new Sprite(spriteData.gameObjectType, spriteData.label, spriteData.id, spriteData.defaultImageSrc);
		for(property in spriteData) {
			if(property !== 'gameObjectType' 
				&& property !== 'label' 
				&& property !== 'id' 
				&& property !== 'defaultImageSrc')
				
				sprite[property] = spriteData[property];
		}
	}
}

function sendUpdate() {
	let i = 0, l = spritesToUpdate.length, sprite = null, arr = [], spriteData = null;
	for(i=0; i<l; i++) {
		sprite = spritesToUpdate[i];
		spriteData = Object.create(null);
		spriteData.x = sprite.x;
		spriteData.y = sprite.y;
		spriteData.id = sprite.id;
		spriteData.gameObjectType = sprite.gameObjectType;
		if(!!sprite.defaultImageSrc)
			spriteData.defaultImageSrc = sprite.defaultImageSrc;
		spriteData.label = sprite.label;
		spriteData.stage = sprite.stage;
		arr.push(spriteData);
		sprite.updating = false;
	}
	spritesToUpdate = [];
	if(arr.length > 0)
		socket.emit('sprite update', arr);
}

function Sprite(gameObjectType, label, spriteId, defaultImageSrc) {
	if(label === 'default') {
		this.spriteSheet = resources.get(defaultImageSrc);
		this.defaultImageSrc = defaultImageSrc;
		this.imageWidth = this.spriteSheet.width;
		this.imageHeight = this.spriteSheet.height;
	} else {
		let images = this.images = [],
			spriteData = settings.spritesData[gameObjectType],
			frames = spriteData.frames;
		this.spriteSheet = resources.get(spriteData.img);
		for(let key in frames) {
			
			if(key.indexOf(label) != -1) {
				images.push(frames[key]);
			}
		}
		this.currFrame = 0;
		if(!images[0]) {
			console.log(label, frames);
		}
		this.imageWidth = images[0].frame.w;
		this.imageHeight = images[0].frame.h;
	}
	this._id = spriteId || id();
	this.gameObjectType = gameObjectType;
	this._label = label;
	this._stage = false;
	this.width = this.imageWidth * settings.resolution;
	this.height = this.imageHeight * settings.resolution;
}

Object.defineProperty(Sprite.prototype, 'label', {
	get: function() {
		return this._label;
	},
	set: function(label) {
		this._label = label;
	}
});

Object.defineProperty(Sprite.prototype, 'images', {
	set: function(images) {
		this.spriteImages = images;
	},
	get: function() {
		return this.spriteImages;
	}
});

Object.defineProperty(Sprite.prototype, 'updating', {
	set: function(updating) {
		this.isUpdating = updating;
	},
	get: function() {
		return this.isUpdating;
	}
});

Object.defineProperty(Sprite.prototype, 'id', {
	get: function() {
		return this._id;
	},
	set: function(id) {
		this._id = id;
	}
});

Object.defineProperty(Sprite.prototype, 'stage', {
	get: function() {
		return this._stage;
	},
	set: function(_stage) {
		let z = this.zPos;
		if(!this._stage && _stage) {
			this._stage = true;
			sprites[this.id] = this;
			if(!!stage[z])
				stage[z].push(this);
			else {
				stage[z] = [];
				stage[z].push(this);
			}
			if(hosting && !this.updating) {
				this.updating = true;
				spritesToUpdate.push(this);
			}	
		} else if(this._stage && !_stage) {
			let arr = stage[z],
				index = arr.indexOf(this);
			this._stage = false;
			delete sprites[this.id];
			if(index !== -1) {
				arr.splice(index, 1);
				if(hosting && !this.updating) {
					this.updating = true;
					spritesToUpdate.push(this);
				}	
			}
		}
	}
});

Object.defineProperty(Sprite.prototype, 'destroyed', {
	get: function() {
		return this.spriteDestroyed;
	},
	set: function(destroyed) {
		if(!this.spriteDestroyed && destroyed) {
			delete sprites[this.id];
			if(this._stage) {
				this.stage = false;
			}
			if(hosting && !this.updating) {
				this.updating = true;
				spritesToUpdate.push(this);
			}
		}
	}
});

Object.defineProperty(Sprite.prototype, 'x', {
	set: function(x) {
		this.xPos = Math.floor(x);
		if(hosting && !this.updating) {
			this.updating = true;
			spritesToUpdate.push(this);
		}
	},
	get: function() {
		return this.xPos;
	}
});
Object.defineProperty(Sprite.prototype, 'y', {
	set: function(y) {
		this.yPos = Math.floor(y);
		if(hosting && !this.updating) {
			this.updating = true;
			spritesToUpdate.push(this);
		}
	},
	get: function() {
		return this.yPos;
	}
});

Object.defineProperty(Sprite.prototype, 'boundingBox', {
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
});

Sprite.prototype.draw = function() {
	let boundingBox = this.boundingBox,
		resolution = settings.resolution,
		imageX = null,
		imageY = null;
	
	if(!!this.images) {
		let currFrame = this.currFrame,
			imageInfo = this.images[currFrame];
		this.currFrame = currFrame >= this.images.length-1 ? 0 : currFrame + 1;
		imageX = imageInfo.frame.x;
		imageY = imageInfo.frame.y;
	} else {
		imageX = 0;
		imageY = 0;
	}
	
	settings.canvasContext.drawImage(
		this.spriteSheet,
		imageX,
		imageY, 
		this.imageWidth, 
		this.imageHeight, 
		boundingBox.x * resolution, 
		boundingBox.y * resolution, 
		boundingBox.width * resolution, 
		boundingBox.height * resolution);
};

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