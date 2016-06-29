let Sprite = require(projectilete'),
	settings = require('./settings'),
	gameObjects = [];

function GameObject() {
	this._sprites = Object.create(null);
	this._stage = false;
	this._interacts = false;
	this._destroyed = false;
	gameObjects.push(this);
}

GameObject.cleanup = cleanup;

Object.defineProperties(GameObject.prototype, {
	'move': {
		value: move
	},
	'onCollidedWith': {
		value: onCollidedWith
	},
	'front': {
		get: getFrontPoint
	},
	'destroyed': {
		get: function() {
			return this._destroyed;
		},
		set: function(destroyed) {
			if(!this._destroyed && destroyed) {
				let label = null, sprites = this._sprites;
				this.stage = false;
				for(label in sprites) {
					sprites[label].destroyed = true;
				}
				this._destroyed = true;
			}
		}
	},
	'ignoreCollision': {
		get: function() {
			return this._ignoreCollision;
		},
		set: function(obj) {
			this._ignoreCollision = obj;
		}
	},
	'interacts': {
		get: function() {
			return this._interacts;
		},
		set: function(interacts) {
			this._interacts = interacts;
		}
	},
	'stage': {
		get: function() {
			return this._stage;
		},
		set: function(onStage) {
			let sprite = this._sprites[this._display];
			if(onStage && !this._stage) {
				this._stage = true;
				if(!!sprite)
					sprite.stage = true;
			} else if(!onStage && this._stage) {
				this._stage = false;
				if(!!sprite)
					sprite.stage = false;
			}
		}
	},
	'direction': {
		set: function(direction) {
			this._direction = direction;
		},
		get: function() {
			return this._direction;
		}
	},
	'speed': {
		set: function(speed) {
			this._speed = speed;
			this._diagonalSpeed = settings.cos45 * speed;
		},
		get: function() {
			return this._speed;
		}
	},
	'sprites': {
		set: function(spritesToAdd) {
			let sprite = null,
				sprites = this._sprites;
			for(let label in spritesToAdd) {
				sprite = new Sprite(spritesToAdd[label]);
				if(!!this._x)
					sprite.x = this._x;
				if(!!this._y)
					sprite.y = this._y;
				if(!!this._z)
					sprite.z = this._z;
				sprites[label] = sprite;
			}
		}
	},
	'x': {
		set: function(x) {
			this._prevX = this._x;
			this._x = x;
			let label = null,
				sprites = this._sprites;
			for(label in sprites) {
				sprites[label].x = x;
			}
		},
		get: function() {
			return this._x;
		}
	},
	'y': {
		set: function(y) {
			this._prevY = this._y;
			this._y = y;
			let sprites = this._sprites, label = null;
			for(label in sprites) {
				sprites[label].y = y;
			}
		},
		get: function() {
			return this._y;
		}
	},
	'z': {
		set: function(z) {
			this._z = z;
			let sprites = this._sprites, label = null;
			for(label in sprites) {
				sprites[label].z = z;
			}
		},
		get: function() {
			return this._z;
		}
	},
	'display': {
		set: function(display) {
			if(this._display !== display) {
				let label = null, sprites = this._sprites, sprite = null;
				sprite = sprites[this._display];
				if(!!sprite) sprite.stage = false;
				this._display = display;
				if(this._stage) {
					sprite = sprites[display];
					sprite.stage = true;
				}
			}
		},
		get: function() {
			return this._display;
		}
	},
	'boundingBox': {
		get: function(){
			return this._sprites[this._display].boundingBox;
		}
	},
	'getAngleToObject': {
		value: getAngleToObject
	},
	'getDirectionToObject': {
		value: getDirectionToObject
	},
	'checkCollision': {
		value: checkCollision
	}
});

function getAngleToObject(obj) {
	let thisX = this._x,
		thisY = this._y,
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

function getDirectionToObject(angle) {
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

function checkCollision() {
	if(!this._interacts || !this._stage) return false;
	
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
		
		if(this._ignoreCollision === objectToCheck || objectToCheck.ignoreCollision === this) {
			
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
						if(this.__proto__.hasOwnProperty('onCollidedWith')) {
							this.onCollidedWith(objectToCheck);
						}
						if(objectToCheck.__proto__.hasOwnProperty('onCollidedBy')) {
							objectToCheck.onCollidedBy(this);
						}
					}
			}
		}
	}
	return false;
};

function move() {
	let x = null,
		y = null;
	if(this._direction === settings.UP) {
		x = 0;
		y = -this._speed;
	} else if(this._direction === settings.DOWN) {
		x = 0;
		y = this._speed;
	} else if(this._direction === settings.LEFT) {
		x = -this._speed;
		y = 0;
	} else if(this._direction === settings.RIGHT) {
		x = this._speed;
		y = 0;
	} else if(this._direction === settings.UP_LEFT) {
		x = -this._diagonalSpeed;
		y = -this._diagonalSpeed;
	} else if(this._direction === settings.UP_RIGHT) {
		x = this._diagonalSpeed;
		y = -this._diagonalSpeed;
	} else if(this._direction === settings.DOWN_LEFT) {
		x = -this._diagonalSpeed;
		y = this._diagonalSpeed;
	} else if(this._direction === settings.DOWN_RIGHT) {
		x = this._diagonalSpeed;
		y = this._diagonalSpeed;
	}
	this.y += y;
	this.x += x;
}

function getFrontPoint() {
	let direction = this._direction,
		boundingBox = this.boundingBox;
	if(direction === settings.UP) {
		return {
			x: this._x,
			y: this._y - boundingBox.height / 2
		}
	} else if(direction === settings.DOWN) {
		return {
			x: this._x,
			y: this._y + boundingBox.height / 2
		}
	} else if(direction === settings.LEFT) {
		return {
			x: this._x - boundingBox.width / 2,
			y: this._y
		}
	} else if(direction === settings.RIGHT) {
		return {
			x: this._x + boundingBox.width / 2,
			y: this._y
		}
	} else if(direction === settings.UP_LEFT) {
		return {
			x: this._x - settings.cos45 * boundingBox.width / 2,
			y: this._y - settings.cos45 * boundingBox.height / 2
		}
	} else if(direction === settings.UP_RIGHT) {
		return {
			x: this._x + settings.cos45 * boundingBox.width / 2,
			y: this._y - settings.cos45 * boundingBox.height / 2
		}
	} else if(direction === settings.DOWN_LEFT) {
		return {
			x: this._x - settings.cos45 * boundingBox.width / 2,
			y: this._y + settings.cos45 * boundingBox.height / 2
		}
	} else if(direction === settings.DOWN_RIGHT) {
		return {
			x: this._x + settings.cos45 * boundingBox.width / 2,
			y: this._y + settings.cos45 * boundingBox.height / 2
		}
	}
	return false;
}

function onCollidedWith(collidedObject) {
	this.x = this._prevX;
	this.y = this._prevY;
}

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

module.exports = GameObject;