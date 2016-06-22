'use strict';

let games = [],
	quicksort = require('./quicksort');
	
function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

function initPlayerCharacterState(name, x, y, display, direction) {
	let state = Object.create(null);
	state.name = name;
	state.x = x;
	state.y = y;
	state.display = display;
	state.direction = direction;
	state.type = 'hero';
	return state;
}

function Game(session) {
	this.players = [];
	this.session = session;
	this.sessionID = parseFloat(session.getId());
	this.id = guidGenerator();
	this.state = Object.create(null);
	games.push(this);
	games = quicksort.sort(games, 'sessionID');
}

Game.prototype.getPlayers = function() {
	return this.players;
};

Game.prototype.updateState = function(label, playerState) {
	let state = this.state;
	if(state.destroyed)
		delete state[label];
	else
		state[label] = playerState;
	return state;
};

Game.prototype.getState = function(label) {
	return this.state[label];
}

Game.prototype.getOtherPlayerConnection = function(connection) {
	let players = this.players,
		l = players.length;
	for(let i=0; i<l; i++) {
		if(players[i].connection !== connection)
			return players[i].connection;
	}
}

Game.prototype.addPlayer = function(playerName, connection){
	let x = null, y = null, display, direction, players = this.players, playerObj = Object.create(null);
	playerObj.name = playerName;
	playerObj.connection = connection;
	players.push(playerObj);
	if(players.length === 1) {
		x = 'settings.player1StartingX';
		y = 'settings.player1StartingY';
		display = 'right_standing';
		direction = 'settings.RIGHT';
	} else {
		x = 'settings.player2StartingX';
		y = 'settings.player2StartingY';
		display = 'left_standing';
		direction = 'settings.LEFT';
	}
	this.state[playerName + '-hero'] = initPlayerCharacterState(playerName, x, y, display, direction);
};

Game.prototype.end = function() {
	games.splice(games.indexOf(this), 1);
}

Game.prototype.sessionID = '';

Game.prototype.id = null;

Game.getGames = function() {
	return games;
};

Game.getGameBySession = function(session) {
	if(games.length > 0) {
		return quicksort.find(session.getId(), games, 'sessionID');
	}
	return false;
};

module.exports = Game