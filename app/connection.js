'use strict';

let Game = require('./game');

function Connection(socket) {
	this._socket = socket;
	this._game = null;
	this._host = false;
	socket.on('disconnect', onDisconnect.bind(this));
	socket.on('create game', onCreateGame.bind(this));
	socket.on('join game', onJoinGame.bind(this));
	socket.on('request games list', ()=>{this._socket.emit('games list', Game.getGamesList())});
	socket.on('host ready', ()=>{this._socket.to(this._game.id).emit('host ready')});
	socket.on('guest ready', ()=>{this._socket.to(this._game.id).emit('guest ready')});
	socket.on('sprite update', sprites=>{if(!!this._game) this._socket.to(this._game.id).emit('sprite update', sprites)});
	socket.on('joystick', angle=>{this._socket.to(this._game.id).emit('joystick', angle)});
	socket.on('fire', label=>{this._socket.to(this._game.id).emit('fire', label)});
}

function onDisconnect() {
	if(this._host) {
		this._game.end();
	}
}

function onJoinGame(data) {
	this._host = false;
	this._game = Game.getGameById(data.gameId);
	this._socket.join(this._game.id);
	this._game.guestName = data.name;
	this._socket.to(this._game.id).emit('player joined', data.name);
}

function onCreateGame(data) {
	this._host = true;
	let game = new Game();
	game.hostName = data.name;
	game.gameName = data.gameName;
	this._game = game;
	this._socket.join(game.id);
	this._socket.emit('game created');
};

module.exports = Connection;