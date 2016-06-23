'use strict';

let games = [],
	quicksort = require('./quicksort'),
	id = require('./id');

function Game() {
	this._players = [];
	this._id = id();
	this._open = true;
	games.push(this);
}

Object.defineProperty(Game.prototype, 'name', {
	get: function() {
		return this._name;
	},
	set: function(name) {
		this._name = name;
	}
});

Object.defineProperty(Game.prototype, 'open', {
	get: function() {
		return this._open;
	}
});

Object.defineProperty(Game.prototype, 'players', {
	get: function() {
		return this._players;
	}
});

Object.defineProperty(Game.prototype, 'id', {
	get: function() {
		return this._id;
	}
});

Game.prototype.end = function() {
	games.splice(games.indexOf(this), 1);
};

Game.prototype.addPlayer = function(name) {
	this._players.push(name);
}

Game.getGames = function() {
	return games;
};

Game.getGamesList = function(id) {
	return games.map(function(game) {
		if(game.open)
			return {
				id: game.id,
				name: game.name
			}
	});
};

Game.getGameById = function(id) {
	let i=0, l=games.length;
	for(i=0; i<l; i++) {
		if(games[i].id === id)
			return games[i];
	}
};

module.exports = Game