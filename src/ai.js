'use strict';

let global = require('./global'),
	geom = require('./geom');

function gruntAI() {
	let distancePlayer1 = null,
		distancePlayer2 = null,
		player1 = global.player1,
		player2 = global.player2,
		player1OnStage = player1.stage,
		player2OnStage = null,
		closestPlayer = null;
	
	if(!player2)
		if(player1OnStage)
			closestPlayer = player1
		else
			return;
	else {
		player2OnStage = player2.stage;
		if(!player1OnStage && !player2OnStage) {
			return;
		} else if(!player1OnStage) {
			closestPlayer = player2;
		} else if(!player2OnStage) {
			closestPlayer = player1;
		} else {
			distancePlayer1 = geom.getDistance(this._x, this._y, player1.x, player1.y);
			distancePlayer2 = geom.getDistance(this._x, this._y, player2.x, player2.y);
			closestPlayer = distancePlayer2 < distancePlayer1 ? global.player2 : global.player1;
		}
	}
	if(!!closestPlayer) {
		this.move(geom.getAngle(this.x, this.y, closestPlayer.x, closestPlayer.y));
	} else {
		this.move(-1);
	}
}

module.exports = {
	grunt: gruntAI
}