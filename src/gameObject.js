let Sprite = require('./sprite'),
	settings = require('./settings'),
	geom = require('./geom'),
	gameObjects = [],
	id = require('./id');

function GameObject() {
	this._sprites = Object.create(null);
	this._stage = false;
	this._interacts = false;
	this._destroyed = false;
	gameObjects.push(this);
	this.id = id();
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
		set: function(angle) {
			if(angle < 0 || angle === this._direction)
				return;
			this._direction = angle;
			let pi = Math.PI;
			if(angle <= pi / 8 || angle > 15 * pi / 8)
				this._directionLabel = settings.UP;
			else if(angle <= 3 * pi / 8)
				this._directionLabel = settings.UP_RIGHT;
			else if(angle <= 5 * pi / 8)
				this._directionLabel = settings.RIGHT;
			else if(angle <= 7 * pi / 8)
				this._directionLabel = settings.DOWN_RIGHT;
			else if(angle <= 9 * pi / 8)
				this._directionLabel = settings.DOWN;
			else if(angle <= 11 * pi / 8)
				this._directionLabel = settings.DOWN_LEFT;
			else if(angle <= 13 * pi / 8)
				this._directionLabel = settings.LEFT;
			else if(angle <= 15 * pi / 8)
				this._directionLabel = settings.UP_LEFT;
			if(!!this._speed) {
				let point = geom.getXYFromVector(this._x, this._y, this._direction, this._speed);
				this._speedX = point.x;
				this._speedY = point.y;
			}
		},
		get: function() {
			return this._direction;
		}
	},
	'directionLabel': {
		set: function(label) {
			this._directionLabel = label;
		},
		get: function() {
			return this._directionLabel;
		} 
	},
	'speed': {
		set: function(speed) {
			this._speed = speed;
			if(!!this._direction) {
				let point = geom.getXYFromVector(this._x, this._y, this._direction, speed);
				this._speedX = point.x;
				this._speedY = point.y;
			}
		},
		get: function() {
			return this._speed;
		}
	},
	'sprite': {
		set: function(src) {
			this._sprites.default = new Sprite(this.type, 'default', null, src);
		}
	},
	'sprites': {
		set: function(spriteLabels) {
			let sprites = this._sprites;
			spriteLabels.forEach((spriteLabel)=>{
				let sprite = new Sprite(this.type, spriteLabel);
				if(!!this._x)
					sprite.x = this._x;
				if(!!this._y)
					sprite.y = this._y;
				if(!!this._z)
					sprite.z = this._z;
				sprites[spriteLabel] = sprite;
			});
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
	'checkCollision': {
		value: checkCollision
	}
});

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
	this.y += this._speedY;
	this.x += this._speedX;
}

function getFrontPoint() {
	let direction = this._direction,
		boundingBox = this.boundingBox,
		delta = geom.getVectorFromXYAngle(boundingBox.width / 2, boundingBox.height / 2, direction);
	return {
		x: this._x + delta.x,
		y: this._y + delta.y
	};
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