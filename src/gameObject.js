let state = require('./state'),
	socket = require('./socket'),
	Sprite = require('./sprite'),
	cycle = require('./cycle'),
	id = require('./id'),
	gameObjects = [],
	settings = require('./settings');

function cleanup() {
	let i = 0, l = gameObjects.length;
	for(i=0; i<l; i++) {
		if(gameObjects[i].destroyed) {
			gameObjects.splice(i, 1);
			i--;
		}
	}
}

cycle.addCleanup(cleanup);

function GameObject(stateLabel) {
	this.displayLabel = null;
	this.spriteData = Object.create(null);
	this.ignoreCollisionObjects = [];
	this.zPos = 0;
	this.onStage = false;
	if(!!stateLabel)
		this.stateLabel = stateLabel;
	else 
		this.stateLabel = id();
	this.state = Object.create(null);
	gameObjects.push(this);
}

Object.defineProperty(GameObject.prototype, 'stage', {
	get: function(){
		return this.onStage;
	},
	set: function(onStage) {
		if(onStage && !this.onStage && !!this.displayLabel && !!this.spriteData[this.displayLabel]) {
			this.onStage = this.state.stage = true;
			this.spriteData[this.displayLabel].addToStage(this.zPos);
		} else if(!onStage && this.onStage) {
			this.onStage = this.state.stage = false;
			if(!!this.displayLabel && !!this.spriteData[this.displayLabel])
				this.spriteData[this.displayLabel].removeFromStage(this.zPos);
		}
	}
})

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
	},
	get: function() {
		return this.objectSpeed;
	}
});

Object.defineProperty(GameObject.prototype, 'sprites', {
	set: function(sprites) {
		for(let spriteLabel in sprites) {
			this.addSprite(spriteLabel, new Sprite(sprites[spriteLabel]));
		}
	}
});

Object.defineProperty(GameObject.prototype, 'state', {
	set: function(gameState) {
		this.gameState = gameState;
		if(gameState.destroyed) {
			this.destroy();
		}
		else {
			for(let prop in gameState) {
				let value = gameState[prop];
				if(typeof value === 'string' && value.indexOf('settings.') !== -1) {
					this[prop] = settings[value.replace('settings.','')];
				} else {
					this[prop] = value;
				}
			}
		}
		this.updateState();
	},
	get: function() {
		return this.gameState;
	}
});

Object.defineProperty(GameObject.prototype, 'x', {
	set: function(x) {
		this.xPos = this.state.x = x;
		let label = null,
			sprites = this.spriteData;
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
		this.yPos = this.state.y = y;
		let label = null,
			sprites = this.spriteData;
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
		this.zPos = this.state.z = z;
	},
	get: function() {
		return this.zPos;
	}
});

Object.defineProperty(GameObject.prototype, 'display', {
	set: function(display) {
		if(this.displayLabel !== display) {
			let newSprite = this.spriteData[display];
			if(!!newSprite && this.onStage) {
				if(!!this.displayLabel)
					this.spriteData[this.displayLabel].removeFromStage(this.zPos);
				newSprite.addToStage(this.zPos);	
			}
			this.displayLabel = this.state.display = display;
		}
	},
	get: function() {
		return this.displayLabel;
	}
});

Object.defineProperty(GameObject.prototype, 'sprite', {
	get: function() {
		let displayLabel = this.displayLabel,
			sprites = this.spriteData;
		if(!!displayLabel && !!sprites && !!sprites[displayLabel])
			return sprites[displayLabel];
		return false;
	}
});

Object.defineProperty(GameObject.prototype, 'boundingBox', {
	get: function(){
		return this.sprite.boundingBox;
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

GameObject.prototype.move = function() {
	let speed = this.speed,
		direction = this.direction,
		x = null,
		y = null;
	if(direction === settings.UP) {
		x = 0;
		y = -speed;
	} else if(direction === settings.DOWN) {
		x = 0;
		y = speed;
	} else if(direction === settings.LEFT) {
		x = -speed;
		y = 0;
	} else if(direction === settings.RIGHT) {
		x = speed;
		y = 0;
	} else if(direction === settings.UP_LEFT) {
		x = -speed;
		y = -speed;
	} else if(direction === settings.UP_RIGHT) {
		x = speed;
		y = -speed;
	} else if(direction === settings.DOWN_LEFT) {
		x = -speed;
		y = speed;
	} else if(direction === settings.DOWN_RIGHT) {
		x = speed;
		y = speed;
	}
	this.y += y;
	this.x += x;
}

GameObject.prototype.bounce = function() {
	let speed = this.speed;
	this.speed = -3 * speed;
	this.move();
	this.speed = speed;
};

GameObject.prototype.checkCollision = function() {
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
		if(objectToCheck !== this) {
			if(this.ignoreCollisionObject !== objectToCheck && objectToCheck.stage) {
				objectToCheckBoundingBox = objectToCheck.boundingBox;
				if(objectToCheckBoundingBox) {
					objectToCheckX = objectToCheckBoundingBox.x;
					objectToCheckY = objectToCheckBoundingBox.y;
					objectToCheckWidth = objectToCheckBoundingBox.width;
					objectToCheckHeight = objectToCheckBoundingBox.height;
					if((thisX + thisWidth > objectToCheckX && thisX < objectToCheckX + objectToCheckWidth)
						&& (thisY + thisHeight > objectToCheckY && thisY < objectToCheckY + objectToCheckHeight)) {
							if(!!this.onCollision)
								this.onCollision(objectToCheck);
							if(!!objectToCheck.onCollision)
								objectToCheck.onCollision(this);
						}
				}
			}
		}
	}
	return false;
};

GameObject.prototype.destroy = function() {
	if(!!this.displayLabel && this.onStage)
		this.spriteData[this.displayLabel].removeFromStage(this.zPos);
	this.state.destroyed = true;
}

GameObject.prototype.addSprite = function(displayLabel, sprite){
	this.spriteData[displayLabel] = sprite;
};

GameObject.prototype.updateState = function(){
	state.setProperty(this.stateLabel, this.gameState);
};

GameObject.prototype.sendState = function() {
	socket.emit('update state', {
		label: this.stateLabel,
		state: this.gameState
	});
};

module.exports = GameObject;