let Sprite = require('./sprite'),
	global = require('./global'),
	geom = require('./geom'),
	cycle = require('./cycle'),
	gameObjects = [],
	id = require('./id');

function GameObject() {
	this._sprites = Object.create(null);
	this._stage = false;
	this._interacts = false;
	this._destroyed = false;
	gameObjects.push(this);
	this.id = id();
	this.ignoreObjectList = [];
}

GameObject.cleanup = cleanup;
GameObject.clear = clear;

Object.defineProperties(GameObject.prototype, {
	'move': {
		value: move
	},
	'getEdgePointFromDirection': {
		value: getEdgePointFromDirection
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
				if(!!sprite) {
					sprite.stage = true;
					this.boundingBox = sprite.boundingBox;
					cycle.addGameObjectUpdateFunction(this, this.move.bind(this));
				}
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
				this.directionLabel = global.UP;
			else if(angle <= 3 * pi / 8)
				this.directionLabel = global.UP_RIGHT;
			else if(angle <= 5 * pi / 8)
				this.directionLabel = global.RIGHT;
			else if(angle <= 7 * pi / 8)
				this.directionLabel = global.DOWN_RIGHT;
			else if(angle <= 9 * pi / 8)
				this.directionLabel = global.DOWN;
			else if(angle <= 11 * pi / 8)
				this.directionLabel = global.DOWN_LEFT;
			else if(angle <= 13 * pi / 8)
				this.directionLabel = global.LEFT;
			else if(angle <= 15 * pi / 8)
				this.directionLabel = global.UP_LEFT;
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
		},
		get: function() {
			return this._speed;
		}
	},
	'sprite': {
		set: function(src) {
			let sprite = new Sprite(src);
			if(!!this._x)
				sprite.x = this._x;
			if(!!this._y)
				sprite.y = this._y;
			if(!!this._z)
				sprite.z = this._z;
			this._sprites.default = sprite;
			this.boundingBox = sprite.boundingBox;
		}
	},
	'sprites': {
		set: function(spriteLabels) {
			this._spriteLabels = spriteLabels;
			if(!!this._spriteMeta)
				this.initSprites();
		}
	},
	'spriteMeta': {
		set: function(spriteMeta) {
			this._spriteMeta = spriteMeta;
			if(!!this._spriteLabels)
				this.initSprites();
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
			if(!!this._sprites[this._display]) {
				
				this.boundingBox = this._sprites[this._display].boundingBox;
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
			if(!!this._sprites[this._display]) {
				this.boundingBox = this._sprites[this._display].boundingBox;
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
					this.boundingBox = sprites[display].boundingBox;
				}
			}
		},
		get: function() {
			return this._display;
		}
	},
	'boundingBox': {
		get: function(){
			return this._boundingBox;
		},
		set: function(boundingBox) {
			this._boundingBox = boundingBox;
		}
	},
	'checkCollision': {
		value: checkCollision
	},
	'initSprites': {
		value: initSprites
	},
	'ignoreObject': {
		value: ignoreObject
	},
	'velocity': {
		get: function() {
			return this._velocity || {
				direction: 0,
				speed: 0,
				dX: 0,
				dY: 0
			};
		},
		set: function(velocity) {
			this._velocity = velocity;
		}
	},
	'applyForce': {
		value: applyForce
	}
});

function applyForce(velocity) {

	let thisVelocity = this.velocity;
	if(!!thisVelocity.dX && !!thisVelocity.dY) {
		var tmp = geom.getXYFromVector(0, 0, thisVelocity.direction, thisVelocity.speed);
		thisVelocity.dX = tmp.x;
		thisVelocity.dY = tmp.y;
	}
	if(typeof velocity.dX === 'undefined' || typeof velocity.dY === 'undefined') {
		var tmp = geom.getXYFromVector(0, 0, velocity.direction, velocity.speed);
		velocity.dX = tmp.x;
		velocity.dY = tmp.y;
	}
	thisVelocity.dX = thisVelocity.dX * velocity.dX > 0 
		? (Math.abs(thisVelocity.dX) >= Math.abs(velocity.dX) ? thisVelocity.dX : velocity.dX) 
		: thisVelocity.dX + velocity.dX;
	thisVelocity.dY = thisVelocity.dY * velocity.dY > 0 
		? (Math.abs(thisVelocity.dY) >= Math.abs(velocity.dY) ? thisVelocity.dY : velocity.dY) 
		: thisVelocity.dY + velocity.dY;
	this.velocity = thisVelocity;
}

function move() {
	if(!this._stage || this.static || !this.boundingBox || (this.velocity.dX === 0 && this.velocity.dY ===0)) return;
	if(!this._interacts) {
		this.x += this.velocity.dX;
		this.y += this.velocity.dY;
		return
	}
	
	let boundingBox = this.boundingBox,
		speedX = this.velocity.dX,
		speedY = this.velocity.dY,
		collidedWithObject = false,
		tmpBoundingBox = {
			x: boundingBox.x,
			y: boundingBox.y,
			width: boundingBox.width,
			height: boundingBox.height
		};
	
	if(speedX > 0) {
		tmpBoundingBox.x += speedX;
		if(checkCollision(tmpBoundingBox, global.rightWall)) {
			speedX = 0;
			collidedWithObject = true;
		}
		tmpBoundingBox.x = boundingBox.x;
	}
	if(speedX < 0) {
		boundingBox.x += speedX;
		if(checkCollision(tmpBoundingBox, global.leftWall)) {
			speedX = 0;
			collidedWithObject = true;
		}
		tmpBoundingBox.x = boundingBox.x;
	}
	if(speedY > 0) {
		boundingBox.y += speedY;
		if(checkCollision(tmpBoundingBox, global.bottomWall)) {
			speedY = 0;
			collidedWithObject = true;
		}
		tmpBoundingBox.y = boundingBox.y;
	}
	if(speedY < 0) {
		boundingBox.y += speedY;
		if(checkCollision(tmpBoundingBox, global.topWall)) {
			speedY = 0;
			collidedWithObject = true;
		}
		tmpBoundingBox.y = boundingBox.y;
	}
	if(collidedWithObject) {
		this.velocity.dX = speedX;
		this.velocity.dY = speedY;
		this.onCollision('wall');
	}
	
	gameObjects.forEach( objectToCheck => {
		let doesNotInteractWith = false;
		if(!!this.noInteraction) {
			doesNotInteractWith = typeof this.noInteraction.find(type=>{
				return (type === objectToCheck.type)
			}) !== 'undefined';
		}

		if(typeof this.ignoreObjectList.find(ignoredObject=>{return ignoredObject === objectToCheck}) === 'undefined'
			&& !doesNotInteractWith
			&& objectToCheck !== this 
			&& objectToCheck.stage 
			&& objectToCheck.interacts) {
				
			let objectToCheckBoundingBox = objectToCheck.boundingBox;
				
			collidedWithObject = false;
			
			tmpBoundingBox.x += speedX;
			if(this.checkCollision(tmpBoundingBox, objectToCheckBoundingBox)) {
				collidedWithObject = true;
				tmpBoundingBox.x -= speedX;
				speedX = 0;
			}
			tmpBoundingBox.y += speedY;
			if(this.checkCollision(tmpBoundingBox, objectToCheckBoundingBox)){
				collidedWithObject = true;
				speedY = 0;
			}
			if(collidedWithObject) {
				this.velocity.dX = speedX;
				this.velocity.dY = speedY;
				if(!!this.onCollision) {
					this.onCollision(objectToCheck);
				}
			}
				
		}
	} );
	this.x += speedX;
	this.y += speedY;
}

function checkCollision(boundingBox, objectToCheckBoundingBox) {
	return objectToCheckBoundingBox 
		&& (boundingBox.x + boundingBox.width > objectToCheckBoundingBox.x 
			&& boundingBox.x < objectToCheckBoundingBox.x + objectToCheckBoundingBox.width)
		&& (boundingBox.y + boundingBox.height > objectToCheckBoundingBox.y 
			&& boundingBox.y < objectToCheckBoundingBox.y + objectToCheckBoundingBox.height)
}

function getEdgePointFromDirection(direction) {
	let boundingBox = this._boundingBox,
		delta = geom.getVectorFromXYAngle(boundingBox.width / 2, boundingBox.height / 2, direction);
	return {
		x: this._x + delta.x,
		y: this._y + delta.y
	};
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

function clear() {
	gameObjects.forEach(gameObject=>{
		gameObject.destroyed = true;
	});
}

function initSprites() {
	let sprites = this._sprites,
		frames = this._spriteMeta.frames,
		spriteSheetPath = this._spriteMeta.img;
	this._spriteLabels.forEach( spriteLabel => {
		let images = [];
		for(let key in frames) {
			if(key.indexOf(spriteLabel) != -1) {
				images.push(frames[key]);
			}
		}
		let sprite = new Sprite(spriteSheetPath, images);
		if(!!this._x)
			sprite.x = this._x;
		if(!!this._y)
			sprite.y = this._y;
		if(!!this._z)
			sprite.z = this._z;
		sprites[spriteLabel] = sprite;
	});
	if(!!this.display) {
		thisboundingBox = sprites[this.display].boundingBox;
	}
}

function ignoreObject(gameObject) {
	this.ignoreObjectList.push(gameObject);
}

module.exports = GameObject;