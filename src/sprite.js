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
		sprite = sprites[spriteData.id] || new Sprite(spriteData.label, spriteData.id);
		for(property in spriteData) {
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
		spriteData.label = sprite.label;
		spriteData.stage = sprite.stage;
		arr.push(spriteData);
		sprite.updating = false;
	}
	spritesToUpdate = [];
	if(arr.length > 0)
		socket.emit('sprite update', arr);
}

function Sprite(gameObjectType, label, defaultImageSrc) {
	if(label === 'default') {
		this.spriteSheet = resources.get(defaultImageSrc);
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
		this.imageWidth = images[0].frame.w;
		this.imageHeight = images[0].frame.h;
	}
	this.spriteId = id();
	this.spriteLabel = label;
	this.onStage = false;
	this.width = this.imageWidth * settings.resolution;
	this.height = this.imageHeight * settings.resolution;
}

Object.defineProperty(Sprite.prototype, 'label', {
	get: function() {
		return this.spriteLabel;
	},
	set: function(label) {
		this.spriteLabel = label;
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
		return this.spriteId;
	},
	set: function(id) {
		this.spriteId = id;
	}
});

Object.defineProperty(Sprite.prototype, 'stage', {
	get: function() {
		return this.onStage;
	},
	set: function(onStage) {
		let z = this.zPos;
		if(!this.onStage && onStage) {
			this.onStage = true;
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
		} else if(this.onStage && !onStage) {
			let arr = stage[z],
				index = arr.indexOf(this);
			this.onStage = false;
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
			if(this.onStage) {
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