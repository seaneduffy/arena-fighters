'use strict';

let Character = require('../character'),
	cycle = require('../../cycle'),
	config = require('../../config'),
	geom = require('../../geom');

function Enemy() {
	Character.call(this);
	
	this.cycleActions = this.actions.bind(this);
	cycle.addUpdate(this.cycleActions);
}

Enemy.prototype = Object.create(Character.prototype, {
	'player1': {
		get: function(){
			if(typeof this._player1 === 'undefined')
				return this._player1 = config.player1;
			return this._player1;
		}
	},
	'player2': {
		get: function(){
			if(typeof this._player2 === 'undefined')
				return this._player2 = config.player2;
			return this._player2;
		}
	},
	'actionsCounter': {
		get: function() {
			if(typeof this._actionsCounter === 'undefined')
				return this._actionsCounter = 0;
			return this._actionsCounter;
		},
		set: function(actionsCounter) {
			this._actionsCounter = actionsCounter;
		}
	},
	'actions': {
		value: function() {
			if(this.actionsCounter > this.actionSpeed) {
				this.actionsCounter = 0;
				this.distancePlayer1 = this.getDistanceToPlayer(this.player1);
				this.distancePlayer2 = this.getDistanceToPlayer(this.player2);
				this.closestPlayer = this.getClosestPlayer();
				if(!!this.movement) {
					this.movement();
				}
				if(!!this.fire && !!this.firearm) {
					this.fire();
				} 
			} else {
				this.actionsCounter++;
			}
		}
	},
	'getDistanceToPlayer': {
		value: function(player) {
			if(!!player && player.stage) {
				return geom.getDistance(this.x, this.y, player.x, player.y)
			} else {
				return false;
			}
		}
	},
	'getClosestPlayer': {
		value: function() {
			if(!this.distancePlayer1 && !this.distancePlayer2) {
				return false;
			} else if(this.distancePlayer1 && !this.distancePlayer2) {
				return this.player1;
			} else if(!this.distancePlayer1 && this.distancePlayer2) {
				return this.player2;
			} else {
				return this.distancePlayer2 < this.distancePlayer1 ? this.player2 : this.player1;
			}	
		}
	},
	'destroy': {
		value: function() {
			cycle.removeUpdate(this.cycleActions);
			Character.prototype.destroy.call(this);
		}
	}
});

module.exports = Enemy;