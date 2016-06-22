let settings = require('./settings'),
	resources = require('./resources'),
	id = require('./id'),
	spriteJson = null,
	sprites = Object.create(null),
	rotation = 0;

require('./data')(settings.spriteJsonUri, (data)=>{
	spriteJson = data.frames;
});

function Sprite(label) {
	let images = this.images = [];
	this.id = id();
	this.label = label;
	for(let key in spriteJson) {
		if(key.indexOf(label) != -1) {
			images.push(spriteJson[key])
		}
	}
	this.currFrame = 0;
	this.imageWidth = images[0].frame.w;
	this.imageHeight = images[0].frame.h;
	this.width = this.imageWidth * settings.resolution;
	this.height = this.imageHeight * settings.resolution;
}

Sprite.prototype.images = [];
Sprite.prototype.addToStage = function(z) {
	if(!!sprites[z])
		sprites[z].push(this);
	else {
		sprites[z] = [];
		sprites[z].push(this);
	}
};
Sprite.prototype.removeFromStage = function(z) {
	let arr = sprites[z],
		index = arr.indexOf(this);
	if(index !== -1)
		arr.splice(index, 1);
	//console.log('remove from stage', this, arr[arr.indexOf(this)]);
};
Sprite.prototype.id = null;
Sprite.prototype.xPos = null;
Object.defineProperty(Sprite.prototype, 'x', {
	set: function(x) {
		this.xPos = Math.floor(x);
	},
	get: function() {
		return this.xPos;
	}
});
Sprite.prototype.yPos = null;
Object.defineProperty(Sprite.prototype, 'y', {
	set: function(y) {
		this.yPos = Math.floor(y);
	},
	get: function() {
		return this.yPos;
	}
});
Sprite.prototype.width = null;
Sprite.prototype.height = null;

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
let counter = 0;
Sprite.prototype.draw = function() {
	// img, sx, sy, swidth, sheight, x, y, width, height
	let boundingBox = this.boundingBox,
		currFrame = this.currFrame,
		imageInfo = this.images[currFrame],
		resolution = settings.resolution;
	this.currFrame = currFrame >= this.images.length-1 ? 0 : currFrame + 1;
	if(counter<3000) {
		//console.log('draw', this);
		counter++;
	}
	settings.canvasContext.drawImage(
		resources.get(settings.spritesImage),
		imageInfo.frame.x, 
		imageInfo.frame.y, 
		imageInfo.frame.w, 
		imageInfo.frame.h, 
		boundingBox.x * resolution, 
		boundingBox.y * resolution, 
		boundingBox.width * resolution, 
		boundingBox.height * resolution);
};
Sprite.draw = function() {
	for(let z in sprites) {
		let i = 0, l = sprites[z].length;
		for(i=0; i<l; i++) {
			sprites[z][i].draw.call(sprites[z][i]);
		}
	}
};
module.exports = Sprite;