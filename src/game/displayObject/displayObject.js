let Sprite = require('./sprite'),
	config = require('../config'),
	geom = require('../../utils/geom'),
	cycle = require('../cycle'),
	displayObjects = [];

function DisplayObject() {
	displayObjects.push(this);
}

DisplayObject.cleanup = cleanup;
DisplayObject.clear = clear;

Object.defineProperties(DisplayObject.prototype, {
	'cycleMove': {
		get: function() {
			if(typeof this._cycleMove === 'undefined')
				return this._cycleMove = this.move.bind(this);
			return this._cycleMove;
		}
	},
	'move': {
		value: move
	},
	'getEdgePointFromDirection': {
		value: getEdgePointFromDirection
	},
	'destroy': {
		value: function() {
			if(!this.destroyed) {
				let sprites = this.sprites;
				for(let label in sprites) {
					sprites[label].destroy();
				}
				this.stage = false;
				this.destroyed = true;
			}
		}
	},
	'ignoreObjectList': {
		get: function() {
			if(!!this._ignoreObjectList)
				return this._ignoreObjectList;
			return this._ignoreObjectList = new Array();
		}
	},
	'destroyed': {
		get: function() {
			if(typeof this._destroyed === 'undefined')
				return this._destroyed = false;
			else return this._destroyed;
		},
		set: function(destroyed) {
			this._destroyed = destroyed;
		}
	},
	'interacts': {
		get: function() {
			if(typeof this._interacts === 'undefined')
				return this._interacts = false;
			return this._interacts;
		},
		set: function(interacts) {
			this._interacts = interacts;
		}
	},
	'stage': {
		get: function() {
			if(typeof this._stage === 'undefined')
				return this._stage = false;
			return this._stage;
		},
		set: function(stage) {
			let sprites = this.sprites,
				sprite = sprites[this.display];
				
			if(stage && !this.stage) {
				this._stage = stage;
				if(!!sprite) {
					sprite.stage = true;
				}
				cycle.addUpdate(this.cycleMove);
			} else if(!stage && this.stage) {
				this._stage = false;
				if(!!sprite)
					sprite.stage = false;
				cycle.removeUpdate(this.cycleMove);
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
	'image': {
		set: function(src) {
			let sprite = Sprite.getSprite(this.id + '-default', src, null, false, false);
			sprite.x = this.x;
			sprite.y = this.y;
			sprite.z = this.z;
			this.sprites.default = sprite;
		}
	},
	'sprites': {
		get: function() {
			if(typeof this._sprites === 'undefined')
				return this._sprites = Object.create(null);
			return this._sprites;
		}
	},
	'spriteData': {
		set: function(spriteData) {
			this._spriteData = spriteData;
			if(!!this.spriteMeta)
				this.initSprites();
		},
		get: function() {
			return this._spriteData;
		}
	},
	'spriteMeta': {
		set: function(spriteMeta) {
			this._spriteMeta = spriteMeta;
			if(!!this.spriteData)
				this.initSprites();
		},
		get: function() {
			return this._spriteMeta;
		}
	},
	'x': {
		set: function(x) {
			this._x = x;
			let sprites = this.sprites;
			for(let label in sprites) {
				sprites[label].x = x;
			}
		},
		get: function() {
			if(!!this._x)
				return this._x;
			return this._x = 0;
		}
	},
	'y': {
		set: function(y) {
			this._y = y;
			let sprites = this.sprites;
			for(let label in sprites) {
				sprites[label].y = y;
			}
		},
		get: function() {
			if(!!this._y)
				return this._y;
			return this._y = 0;
		}
	},
	'z': {
		set: function(z) {
			this._z = z;
			let sprites = this.sprites;
			for(let label in sprites) {
				sprites[label].z = z;
			}
		},
		get: function() {
			if(!!this._z)
				return this._z;
			return this._z = 10;
		}
	},
	'display': {
		set: function(display) {
			if(this._display !== display) {
				let sprites = this.sprites,
					sprite = sprites[this._display];
				if(!!sprite) sprite.stage = false;
				this._display = display;
				sprite = sprites[display];
				if(this.stage && !!sprite) {
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
			if(!!this.hitbox && !!this.x && !!this.y) {
				return {
					x: this.x + this.hitbox.x - this.hitbox.width / 2,
					y: this.y + this.hitbox.y - this.hitbox.height / 2,
					width: this.hitbox.width,
					height: this.hitbox.height
				}
			}
			let sprite = this.sprites[this.display];
			return {
				x: this.x - sprite.width / 2,
				y: this.y - sprite.height / 2,
				width: sprite.width,
				height: sprite.height
			}
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
			this._velocity = processVelocity(velocity);
		}
	},
	'applyForce': {
		value: applyForce
	},
	'processVelocity': {
		value: processVelocity
	}
});

function processVelocity(velocity) {
	if((typeof velocity.dX !== 'undefined' && typeof velocity.dY != 'undefined') 
		&& (typeof velocity.direction === 'undefined' || typeof velocity.speed === 'undefined')) {
		velocity.direction = geom.getAngle(0,0,velocity.dX,velocity.dY);
		velocity.speed = geom.getDistance(0,0,velocity.dX,velocity.dY);
	} else if((typeof velocity.dX === 'undefined' || typeof velocity.dY === 'undefined') 
		&& (typeof velocity.direction !== 'undefined' && typeof velocity.speed !== 'undefined')) {
		var tmp = geom.getXYFromVector(0, 0, velocity.direction, velocity.speed);
		velocity.dX = tmp.x;
		velocity.dY = tmp.y;
	}
	return velocity;
}

function applyForce(velocity) {	
	let v1 = processVelocity(this.velocity),
		v2 = processVelocity(velocity);
		/*dX = v1.dX * v2.dX > 0 
			? (Math.abs(v1.dX) >= Math.abs(v2.dX) ? v1.dX : v2.dX) 
			: v1.dX + v2.dX,
		dY = v1.dY * v2.dY > 0 
		? (Math.abs(v1.dY) >= Math.abs(v2.dY) ? v1.dY : v2.dY) 
		: v1.dY + v2.dY;*/
	
	this.velocity = {
		dX: v1.dX + v2.dX,
		dY: v1.dY + v2.dY
	};
}

function onCollision(displayObject, x, y, newX, newY, collidedObject) {
	displayObject.velocity = {
		dX: newX - x,
		dY: newY - y
	}
	if(!!displayObject.onCollision)
		displayObject.onCollision(collidedObject);
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

	displayObjects.forEach( objectToCheck => {
		let doesNotInteractWith = false;
		if(!!this.noInteraction) {
			doesNotInteractWith = typeof this.noInteraction.find(id=>{
				return (id === objectToCheck.id)
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
	
	if(this.velocity.dX !== 0)
		this.x += this.velocity.dX;
	if(this.velocity.dY !== 0)
		this.y += this.velocity.dY;
	
	this.z = Math.floor(this.boundingBox.y + this.boundingBox.height);
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
			x = x1a;
			y = dy1a;
		} else if(xMovingInRight && yPrevWithin) {
			x = x1a;
			y = dy1a;
		} else if(xPrevWithin && yMovingInDown) {
			x = dx1a;
			y = y1a;
		} else if(xPrevWithin && yMovingInUp) {
			x = dx1a;
			y = y1a;
		} else {
			x = x1a;
			y = y1a;
		}
		return {x: x, y: y}
	}
	return false;
}

function getEdgePointFromDirection(direction) {
	let boundingBox = this.boundingBox,
		delta = geom.getVectorFromXYAngle(boundingBox.width / 2, boundingBox.height / 2, direction);
	return {
		x: this.x + delta.x,
		y: this.y + delta.y
	};
}

function cleanup() {
	let tmp = new Array();
	displayObjects.forEach( displayObject => {
		if(!displayObject.destroyed)
			tmp.push(displayObject);
	} );
	displayObjects = tmp;
}

function clear() {
	displayObjects.forEach(displayObject=>{
		displayObject.destroy();
	});
}

function initSprites() {
	let frames = this.spriteMeta.frames,
		spriteSheetPath = this.spriteMeta.img,
		sprite = null,
		sprites = this.sprites;
	this.spriteData.forEach( data => {
		let frameData = new Array(),
			spriteLabel = data.label;
		for(let key in frames) {
			if(key.match(new RegExp(spriteLabel.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')))) {
				frameData.push(frames[key]);
			}
		}
		sprite = Sprite.getSprite(this.id + '-' + spriteLabel, spriteSheetPath, frameData, data.frameRate, data.loop);
		sprite.x = this.x;
		sprite.y = this.y;
		sprite.z = this.z;
		sprites[spriteLabel] = sprite;
	});
	if(typeof this.display === 'undefined') {
		this.display = this.spriteData[0].label;
	}
	sprite = sprites[this.display];
	if(this.stage)
		sprite.stage = true;
}

function ignoreObject(displayObject) {
	this.ignoreObjectList.push(displayObject);
}

DisplayObject.getDisplayObjects = function() {
	return displayObjects;
}

if(config.dev) {
	window.getDisplayObjectTotal = function() {
		return displayObjects.length;
	}
	window.getDisplayObjects = DisplayObject.getDisplayObjects;
	window.updateDisplayObject = function(id, properties) {
		let object = displayObjects.find( displayObject => {
			if(displayObject.id === id)
				return true;
			return false;
		});
		if(!!object) {
			for(let property in properties) {
				object[property] = properties[property];
			}
		}
	}
	window.updateDisplayObjectsFromConfig = function() {
		let configDisplayObjects = config.displayObjects, 
			configObject = null,
			properties = null,
			property = null;
		displayObjects.forEach( displayObject => {
			configObject = configDisplayObjects[displayObject.id];
			properties = configObject.properties;
			for(property in properties) {
				displayObject[property] = properties[property];
			}
		});
	}
}

module.exports = DisplayObject;