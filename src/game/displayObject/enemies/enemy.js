'use strict';

let Character = require('../character'),
	cycle = require('../../cycle'),
	config = require('../../config'),
	geom = require('../../../utils/geom');

function Enemy() {
	Character.call(this);
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