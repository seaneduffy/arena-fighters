'use strict';

let Game = require('./game');

function Connection(socket) {
	this._socket = socket;
	this._game = null;
	this._host = false;
	socket.on('disconnect', this.onDisconnect.bind(this));
	socket.on('create game', this.createGame.bind(this));
	socket.on('join game', this.onJoinGame.bind(this));
	socket.on('games list', this.onGamesList.bind(this));
	socket.on('start game', this.onStartGame.bind(this));
	socket.on('sprite update', this.onSpriteUpdate.bind(this));
	socket.on('joystick', (label)=>{
		this._socket.to(this._game.id).emit('joystick', label);
	});
	socket.on('fire', (label)=>{
		this._socket.to(this._game.id).emit('fire', label);
	});
}

Connection.prototype.onSpriteUpdate = function(sprites) {
	this._socket.to(this._game.id).emit('sprite update', sprites);
}

Connection.prototype.onDisconnect = function() {
	if(this._host) {
		this._game.end();
	}
}

Connection.prototype.onJoinGame = function(data) {
	this._host = false;
	this._game = Game.getGameById(data.gameId);
	this._socket.join(data.gameId);
	this._socket.to(data.gameId).emit('player joined');
};

Connection.prototype.onStartGame = function() {
	this._socket.to(this._game.id).emit('start game');
};

Connection.prototype.onGamesList = function() {
	let games = Game.getGamesList();
	this._socket.emit('games list', games);
};

Connection.prototype.createGame = function(data) {
	this._host = true;
	let game = new Game();
	game.name = data.name;
	game.addPlayer(data.playerName);
	this._game = game;
	this._socket.join(game.id);
	this._socket.emit('game created');
};

module.exports = Connection;