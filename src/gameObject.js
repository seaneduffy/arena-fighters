let Sprite = require('./sprite'),
	config = require('./config'),
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
	this.moveCycle = false;
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
					if(!this.moveCycle) {
						cycle.addGameObjectUpdateFunction(this, this.move.bind(this));
						
						this.moveCycle = true;
					}
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
				this.directionLabel = config.UP;
			else if(angle <= 3 * pi / 8)
				this.directionLabel = config.UP_RIGHT;
			else if(angle <= 5 * pi / 8)
				this.directionLabel = config.RIGHT;
			else if(angle <= 7 * pi / 8)
				this.directionLabel = config.DOWN_RIGHT;
			else if(angle <= 9 * pi / 8)
				this.directionLabel = config.DOWN;
			else if(angle <= 11 * pi / 8)
				this.directionLabel = config.DOWN_LEFT;
			else if(angle <= 13 * pi / 8)
				this.directionLabel = config.LEFT;
			else if(angle <= 15 * pi / 8)
				this.directionLabel = config.UP_LEFT;
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
					if(!!sprite) {
						sprite.stage = true;
						this.boundingBox = sprite.boundingBox;
						if(!this.moveCycle) {
							cycle.addGameObjectUpdateFunction(this, this.move.bind(this));
							this.moveCycle = true;
						}
					}
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

function onCollision(gameObject, x, y, newX, newY, collidedObject) {
	gameObject.velocity.dX = newX - x;
	gameObject.velocity.dY = newY - y;
	if(!!gameObject.onCollision)
		gameObject.onCollision(collidedObject);
}

function move() {
	if(!this._stage || this.static || !this.boundingBox || (this.velocity.dX === 0 && this.velocity.dY ===0)) return;
	if(!this._interacts) {
		this.x += this.velocity.dX;
		this.y += this.velocity.dY;
		return
	}
	
	let boundingBox = this.boundingBox,
		collisionCheck = false;
	if(this.velocity.dX > 0 && !!(collisionCheck = checkCollision(boundingBox, config.rightWall, this.velocity.dX, this.velocity.dY)))
		onCollision(this, boundingBox.x, boundingBox.y, collisionCheck.x, collisionCheck.y, 'wall');
	if(this.velocity.dX < 0 && !!(collisionCheck = checkCollision(boundingBox, config.leftWall, this.velocity.dX, this.velocity.dY)))
		onCollision(this, boundingBox.x, boundingBox.y, collisionCheck.x, collisionCheck.y, 'wall');
	if(this.velocity.dY > 0 && !!(collisionCheck = checkCollision(boundingBox, config.bottomWall, this.velocity.dX, this.velocity.dY)))
		onCollision(this, boundingBox.x, boundingBox.y, collisionCheck.x, collisionCheck.y, 'wall');
	if(this.velocity.dY < 0 && !!(collisionCheck = checkCollision(boundingBox, config.topWall, this.velocity.dX, this.velocity.dY))){
		onCollision(this, boundingBox.x, boundingBox.y, collisionCheck.x, collisionCheck.y, 'wall');
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
				
			if(!!(collisionCheck = checkCollision(boundingBox, objectToCheck.boundingBox, this.velocity.dX, this.velocity.dY)))
				
				onCollision(this, boundingBox.x, boundingBox.y, collisionCheck.x, collisionCheck.y, objectToCheck);
			
		}
	} );
	this.x += this.velocity.dX;
	this.y += this.velocity.dY;
}

function checkCollision(boundingBox, objectToCheckBoundingBox, dx, dy) {
	let x = -1,
		y = -1;
	if(!!objectToCheckBoundingBox && !!boundingBox) {
		let x1a = boundingBox.x,
			x1b = boundingBox.x + boundingBox.width,
			x2a = objectToCheckBoundingBox.x,
			x2b = objectToCheckBoundingBox.x + objectToCheckBoundingBox.width,
			y1a = boundingBox.y,
			y1b = boundingBox.y + boundingBox.height,
			y2a = objectToCheckBoundingBox.y,
			y2b = objectToCheckBoundingBox.y + objectToCheckBoundingBox.height,
			dx1a = x1a + dx,
			dx1b = x1b + dx,
			dy1a = y1a + dy,
			dy1b = y1b + dy,
			collision = ((dx1a < x2a && dx1b > x2a) || (dx1a < x2b && dx1b > x2a))
				&& ((dy1a < y2a && dy1b > y2a) || (dy1a < y2b && dy1b > y2a));
		if(!collision)
			return false;

		let xPrevWithin = (x1a < x2a && x1b > x2a) || (x1a < x2b && x1b > x2a),
			yPrevWithin = (y1a < y2a && y1b > y2a) || (y1a < y2b && y1b > y2a),
			xMovingInLeft = dx < 0 && x1a > x2b && x1a + dx < x2b,
			xMovingInRight = dx > 0 && x1b < x2a && x1b + dx > x2a,
			yMovingInUp = dy < 0 && y1a > y2b && y1a + dy < y2b,
			yMovingInDown = dy > 0 && y1b < y2a && y1b + dy > y2a;
			
		if(xMovingInLeft && yPrevWithin) {
			x = x1a;//x2b;
			y = dy1a;
		} else if(xMovingInRight && yPrevWithin) {
			x = x1a;//x2a - x1b + x1a;
			y = dy1a;
		} else if(xPrevWithin && yMovingInDown) {
			x = dx1a;
			y = y1a;//y2a - y1b + y1a; 
		} else if(xPrevWithin && yMovingInUp) {
			x = dx1a;
			y = y1a;//y2b;
		} else {
			x = x1a;
			y = y1a;
		}
		return {x: x, y: y}
	}
	return false;
}
var c = 0;
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
		this.boundingBox = sprites[this.display].boundingBox;
		if(!!this.stage) {
			sprite.stage = true;
			if(!this.moveCycle) {
				cycle.addGameObjectUpdateFunction(this, this.move.bind(this));
				this.moveCycle = true;
			}
		}
	}
}

function ignoreObject(gameObject) {
	this.ignoreObjectList.push(gameObject);
}

module.exports = GameObject;