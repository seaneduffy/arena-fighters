let state = require('./state'),
	socket = require('./socket'),
	Sprite = require('./sprite'),
	cycle = require('./cycle'),
	id = require('./id'),
	settings = require('./settings'),
	gameObjects = [];

function cleanup() {
	let i = 0, l = gameObjects.length;
	for(i=0; i<l; i++) {
		if(gameObjects[i].destroyed) {
			gameObjects.splice(i, 1);
			i--;
			l--;
		}
	}
}

cycle.addCleanup(cleanup);

function GameObject() {
	this.spriteData = Object.create(null);
	this.ignoreCollisionObjects = [];
	this.xPos = null;
	this.yPos = null;
	this.prevXPos = null;
	this.prevYPos = null;
	this.zPos = 0;
	this.onStage = false;
	this.objectInteracts = false;
	this.objectDestroyed = false;
	gameObjects.push(this);
}

Object.defineProperty(GameObject.prototype, 'front', {
	get: function() {
		let direction = this.direction,
			boundingBox = this.boundingBox;
		if(direction === settings.UP) {
			return {
				x: this.xPos,
				y: this.yPos - boundingBox.height / 2
			}
		} else if(direction === settings.DOWN) {
			return {
				x: this.xPos,
				y: this.yPos + boundingBox.height / 2
			}
		} else if(direction === settings.LEFT) {
			return {
				x: this.xPos - boundingBox.width / 2,
				y: this.yPos
			}
		} else if(direction === settings.RIGHT) {
			return {
				x: this.xPos + boundingBox.width / 2,
				y: this.yPos
			}
		} else if(direction === settings.UP_LEFT) {
			return {
				x: this.xPos - settings.cos45 * boundingBox.width / 2,
				y: this.yPos - settings.cos45 * boundingBox.height / 2
			}
		} else if(direction === settings.UP_RIGHT) {
			return {
				x: this.xPos + settings.cos45 * boundingBox.width / 2,
				y: this.yPos - settings.cos45 * boundingBox.height / 2
			}
		} else if(direction === settings.DOWN_LEFT) {
			return {
				x: this.xPos - settings.cos45 * boundingBox.width / 2,
				y: this.yPos + settings.cos45 * boundingBox.height / 2
			}
		} else if(direction === settings.DOWN_RIGHT) {
			return {
				x: this.xPos + settings.cos45 * boundingBox.width / 2,
				y: this.yPos + settings.cos45 * boundingBox.height / 2
			}
		}
		return false;
	}
});

Object.defineProperty(GameObject.prototype, 'destroyed', {
	get: function() {
		return this.objectDestroyed;
	},
	set: function(destroyed) {
		if(!this.objectDestroyed && destroyed) {
			let label = null, sprites = this.spriteData;
			this.stage = false;
			for(label in sprites) {
				sprites[label].destroyed = true;
			}
			this.objectDestroyed = true;
		}
	}
});

Object.defineProperty(GameObject.prototype, 'interacts', {
	get: function() {
		return this.objectInteracts;
	},
	set: function(interacts) {
		this.objectInteracts = interacts;
	}
});

Object.defineProperty(GameObject.prototype, 'stage', {
	get: function(){
		return this.onStage;
	},
	set: function(onStage) {
		let sprite = this.spriteData[this.displayLabel];
		if(onStage && !this.onStage) {
			this.onStage = true;
			if(!!sprite)
				sprite.stage = true;
		} else if(!onStage && this.onStage) {
			this.onStage = false;
			if(!!sprite)
				sprite.stage = false;
		}
	}
});

Object.defineProperty(GameObject.prototype, 'direction', {
	set: function(direction) {
		this.directionLabel = direction;
	},
	get: function() {
		return this.directionLabel;
	}
});

Object.defineProperty(GameObject.prototype, 'label', {
	set: function(label) {
		this.stateLabel = label;
	},
	get: function() {
		return this.stateLabel;
	}
})

Object.defineProperty(GameObject.prototype, 'speed', {
	set: function(speed) {
		this.objectSpeed = speed;
		this.diagonalSpeed = settings.cos45 * speed;
	},
	get: function() {
		return this.objectSpeed;
	}
});

Object.defineProperty(GameObject.prototype, 'sprites', {
	set: function(sprites) {
		let spriteData = this.spriteData, sprite = null;
		for(let spriteLabel in sprites) {
			sprite = new Sprite(sprites[spriteLabel]);
			if(!!this.xPos)
				sprite.x = this.xPos;
			if(!!this.yPos)
				sprite.y = this.yPos;
			if(!!this.zPos)
				sprite.z = this.zPos;
			spriteData[spriteLabel] = sprite;
		}
	}
});

Object.defineProperty(GameObject.prototype, 'x', {
	set: function(x) {
		this.prevXPos = this.xPos;
		this.xPos = x;
		let sprites = this.spriteData, label = null;
		for(label in sprites) {
			sprites[label].x = x;
		}
	},
	get: function() {
		return this.xPos;
	}
});

Object.defineProperty(GameObject.prototype, 'y', {
	set: function(y) {
		this.prevYPos = this.yPos;
		this.yPos = y;
		let sprites = this.spriteData, label = null;
		for(label in sprites) {
			sprites[label].y = y;
		}
	},
	get: function() {
		return this.yPos;
	}
});

Object.defineProperty(GameObject.prototype, 'z', {
	set: function(z) {
		this.zPos = z;
		let sprites = this.spriteData, label = null;
		for(label in sprites) {
			sprites[label].z = z;
		}
	},
	get: function() {
		return this.zPos;
	}
});

Object.defineProperty(GameObject.prototype, 'display', {
	set: function(display) {
		if(this.displayLabel !== display) {
			let label = null, sprites = this.spriteData, sprite = null;
			sprite = sprites[this.displayLabel];
			if(!!sprite) sprite.stage = false;
			this.displayLabel = display;
			if(this.onStage) {
				sprite = sprites[this.displayLabel];
				sprite.stage = true;
			}
		}
	},
	get: function() {
		return this.displayLabel;
	}
});

Object.defineProperty(GameObject.prototype, 'boundingBox', {
	get: function(){
		return this.spriteData[this.displayLabel].boundingBox;
	}
});

GameObject.prototype.getDistanceToObject = function(obj) {
	let thisX = this.x,
		thisY = this.y,
		objX = obj.x,
		objY = obj.y,
		deltaX = objX - thisX,
		deltaY = objY - thisY;
	return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
};

GameObject.prototype.getAngleToObject = function(obj) {
	let thisX = this.x,
		thisY = this.y,
		objX = obj.x,
		objY = obj.y,
		deltaX = objX - thisX,
		deltaY = objY - thisY,
		angle = null,
		rad;
	if(deltaX === 0 && deltaY === 0)
		angle = 0;
	else if(deltaX === 0 && deltaY < 0)
		angle = 0;
	else if(deltaX === 0 && deltaY > 0)
		angle = 180;
	else if(deltaX < 0 && deltaY === 0)
		angle = 270;
	else if(deltaX > 0 && deltaY === 0)
		angle = 90;
	else {
		rad = Math.atan2(Math.abs(deltaY), Math.abs(deltaX));
		if(deltaX > 0 && deltaY > 0)
			angle = rad * 180 / Math.PI + 90;
		if(deltaX > 0 && deltaY < 0)
			angle = 90 - rad * 180 / Math.PI;
		if(deltaX < 0 && deltaY > 0)
			angle = 270 - rad * 180 / Math.PI;
		if(deltaX < 0 && deltaY < 0)
			angle = rad * 180 / Math.PI + 270;
	}
	return angle;
};

GameObject.prototype.getDirectionToObject = function(angle) {
	if(angle <= 22 || angle > 337)
		return settings.UP;
	else if(angle <= 67)
		return settings.UP_RIGHT;
	else if(angle <= 112)
		return settings.RIGHT;
	else if(angle <= 157)
		return settings.DOWN_RIGHT;
	else if(angle <= 202)
		return settings.DOWN;
	else if(angle <= 247)
		return settings.DOWN_LEFT;
	else if(angle <= 292)
		return settings.LEFT;
	else if(angle <= 337)
		return settings.UP_LEFT;
	else
		return settings.CENTER;
};

GameObject.prototype.ignoreCollision = function(obj) {
	this.ignoreCollisionObject = obj;
};

GameObject.prototype.onCollidedWith = function(collidedObject) {
	this.xPos = this.prevXPos;
	this.yPos = this.prevYPos;
}

GameObject.prototype.move = function() {
	let x = null,
		y = null;
	if(this.direction === settings.UP) {
		x = 0;
		y = -this.objectSpeed;
	} else if(this.direction === settings.DOWN) {
		x = 0;
		y = this.objectSpeed;
	} else if(this.direction === settings.LEFT) {
		x = -this.objectSpeed;
		y = 0;
	} else if(this.direction === settings.RIGHT) {
		x = this.objectSpeed;
		y = 0;
	} else if(this.direction === settings.UP_LEFT) {
		x = -this.diagonalSpeed;
		y = -this.diagonalSpeed;
	} else if(this.direction === settings.UP_RIGHT) {
		x = this.diagonalSpeed;
		y = -this.diagonalSpeed;
	} else if(this.direction === settings.DOWN_LEFT) {
		x = -this.diagonalSpeed;
		y = this.diagonalSpeed;
	} else if(this.direction === settings.DOWN_RIGHT) {
		x = this.diagonalSpeed;
		y = this.diagonalSpeed;
	}
	this.y += y;
	this.x += x;
}

GameObject.prototype.checkCollision = function() {
	if(!this.interacts || !this.stage) return false;
	
	let i = 0,
		l = gameObjects.length,
		objectToCheck = null,
		thisBoundingBox = this.boundingBox,
		thisX = thisBoundingBox.x,
		thisY = thisBoundingBox.y,
		thisWidth = thisBoundingBox.width,
		thisHeight = thisBoundingBox.height,
		objectToCheckX = null,
		objectToCheckY = null,
		objectToCheckWidth = null,
		objectToCheckHeight = null,
		objectToCheckBoundingBox = null;
	for(i=0; i<l; i++) {
		objectToCheck = gameObjects[i];
		
		if(this.ignoreCollisionObject === objectToCheck || objectToCheck.ignoreCollisionObject === this) {
			
		} else if(
			objectToCheck !== this && objectToCheck.stage && objectToCheck.interacts
		) {
			objectToCheckBoundingBox = objectToCheck.boundingBox;
			if(objectToCheckBoundingBox) {
				objectToCheckX = objectToCheckBoundingBox.x;
				objectToCheckY = objectToCheckBoundingBox.y;
				objectToCheckWidth = objectToCheckBoundingBox.width;
				objectToCheckHeight = objectToCheckBoundingBox.height;
				if((thisX + thisWidth > objectToCheckX && thisX < objectToCheckX + objectToCheckWidth)
					&& (thisY + thisHeight > objectToCheckY && thisY < objectToCheckY + objectToCheckHeight)) {
						this.onCollidedWith(objectToCheck);
						if(!!this.onCollision) {
							this.onCollision(objectToCheck);
						}
						if(!!objectToCheck.onCollision) {
							objectToCheck.onCollision(this);
						}
					}
			}
		}
	}
	return false;
};

module.exports = GameObject;