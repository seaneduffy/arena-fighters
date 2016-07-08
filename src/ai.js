'use strict';

let global = require('./global'),
	geom = require('./geom'),
	cycle = require('./cycle');
	
function Ai(character) {
	this._character = character;
	this._player1 = global.player1;
	this._player2 = global.player2;
	this._counter = 0;
	cycle.addGameObjectUpdateFunction(character, this.actions.bind(this));
}
Object.defineProperties(Ai.prototype, {
	'actions': {
		value: function() {
			if(this._counter > this._character.actionSpeed) {
				this._counter = 0;
				this._distancePlayer1 = this.getDistanceToPlayer(this._player1);
				this._distancePlayer2 = this.getDistanceToPlayer(this._player2);
				this._closestPlayer = this.getClosestPlayer();
				if(!!this.move) {
					this.move();
				} else if(!!this.fire && !!this._character.firearm) {
					this.fire();
				} 
			} else {
				this._counter++;
			}
		}
	},
	'getDistanceToPlayer': {
		value: function(player) {
			if(!!player && player.stage) {
				return geom.getDistance(this._character._x, this._character._y, player.x, player.y)
			} else {
				return false;
			}
		}
	},
	'getClosestPlayer': {
		value: function() {
			if(!this._distancePlayer1 && !this._distancePlayer2) {
				return false;
			} else if(this._distancePlayer1 && !this._distancePlayer2) {
				return this._player1;
			} else if(!this._distancePlayer1 && this._distancePlayer2) {
				return this._player2;
			} else {
				return this._distancePlayer2 < this._distancePlayer1 ? this._player2 : this._player1;
			}	
		}
	},
	'onCollision': {
		value: function() { return }
	}
});

function Grunt(character) {
	Ai.prototype.constructor.call(this, character);
}
Grunt.prototype = Object.create(Ai.prototype, {
	'move': {
		value: function() {
			let v = this._character.velocity;
			if(!!this._closestPlayer) {
				this._character.walk(1, geom.getAngle(this._character.x, this._character.y, this._closestPlayer.x, this._closestPlayer.y));
			} else {
				if(v.dX !== 0 || v.dY !== 0)
					this._character.walk(0,-1);
			}
		}
	},
	'onCollision': {
		value: function() {
			let v = this._character.velocity,
				ran = 0,
				angle = 0;
			if(v.dX === 0 && v.dY !== 0) {
				if(Math.round(Math.random()) === 0)
					angle = Math.PI;
				else
					angle = 0;
			} else if(v.dY === 0 && v.dX !== 0) {
				if(Math.round(Math.random()) === 0)
					angle = 3 * Math.PI / 2;
				else
					angle = Math.PI / 2;
			} else {
				let ran = Math.round(Math.random() * 3);
				if(ran === 0) {
					angle = 0;
				} else if(ran === 1) {
					angle = Math.PI / 2;
				} else if(ran === 2) {
					angle = Math.PI;
				} else {
					angle = 3 * Math.PI / 2;
				}
			}
			this._character.walk(1, angle);
		}
	}
});

function Devil(character) {
	this.jump = true;
	Ai.prototype.constructor.call(this, character);
}
Devil.prototype = Object.create(Ai.prototype, {
	'move': {
		value: function() {
			let counter = cycle.getCounter();
			this.counter = this.counter || 0;
			if(this.counter >= this._character.moveTime) {
				if(this.jump) {
					let v = this._character.velocity;
					if(!!this._closestPlayer) {
						this._character.walk(1, geom.getAngle(this._character.x, this._character.y, this._closestPlayer.x, this._closestPlayer.y));
					} else {
						if(v.dX !== 0 || v.dY !== 0)
							this._character.walk(0,-1);
					}
					this.jump = false;
				} else {
					this._character.walk(0, -1);
					this.jump = true;
				}
				this.counter = 0;
			} else {
				this.counter++;
			}
		}
	},
	'onCollision': {
		value: function() {
			let v = this._character.velocity,
				ran = 0,
				angle = 0;
			if(v.dX === 0 && v.dY !== 0) {
				if(Math.round(Math.random()) === 0)
					angle = Math.PI;
				else
					angle = 0;
			} else if(v.dY === 0 && v.dX !== 0) {
				if(Math.round(Math.random()) === 0)
					angle = 3 * Math.PI / 2;
				else
					angle = Math.PI / 2;
			} else {
				let ran = Math.round(Math.random() * 3);
				if(ran === 0) {
					angle = 0;
				} else if(ran === 1) {
					angle = Math.PI / 2;
				} else if(ran === 2) {
					angle = Math.PI;
				} else {
					angle = 3 * Math.PI / 2;
				}
			}
			this._character.walk(1, angle);
		}
	}
});

module.exports = {
	grunt: Grunt,
	devil: Devil
}