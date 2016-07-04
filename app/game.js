'use strict';

let games = [],
	quicksort = require('./quicksort'),
	id = require('./id');

function Game() {
	this._players = [];
	this._hostName = '';
	this._guestName = '';
	this._gameName = '';
	this._id = id();
	this._open = true;
	games.push(this);
}

Object.defineProperties(Game.prototype, {
	'name': {
		get: function() {
			return this._name;
		},
		set: function(name) {
			this._name = name;
		}
	},
	'gameName': {
		get: function() {
			return this._gameName;
		},
		set: function(gameName) {
			this._gameName = gameName;
		}
	},
	'open': {
		get: function() {
			return this._open;
		}
	},
	'players': {
		get: function() {
			return this._players;
		}
	},
	'id': {
		get: function() {
			return this._id;
		}
	},
	'end': {
		value: end
	},
	'addPlayer': {
		value: addPlayer
	}
});

function end() {
	games.splice(games.indexOf(this), 1);
};

function addPlayer(name) {
	if(this._players.length === 0) {
		this._hostName = name;
	} else {
		this._guestName = name;
	}
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
				hostName: game.hostName,
				gameName: game.gameName
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