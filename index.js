'use strict';

let express = require('express'),
	app = express(),
http = require('http').Server(app);

app.use(express.static('./public'));
app.set('views', __dirname);
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.render('game', {});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});


let socketManager = require('socket.io-connection-manager')(http),
	Game = require('./app/game');
	
socketManager.onConnection(function(connection){
	socketManager.listenToConnection(connection, 'games list', ()=>{
		var sessions = socketManager.sessions().map((session)=>{
				return {
					name: session.getName(),
					sessionId: session.getId()
				}
			});
		socketManager.sendToConnection(connection, 'games list', sessions);
	});
});
socketManager.onRegistration(function(connection){
	let session = connection.getSession(),
		playerName = connection.getLabel();
	
	socketManager.listenToConnection(connection, 'update state', (data)=>{
		let game = Game.getGameBySession(session);
		if(!!game) {
			game.updateState(data.label, data.state);
			let otherConnection = game.getOtherPlayerConnection(connection);
		    socketManager.sendToConnection(otherConnection, 'update state', data);
		}
	});
	
	let game = Game.getGameBySession(session);
	
	if(!game) {
		game = new Game(session);
	}
	socketManager.sendToConnection(connection, 'game id', game.id);
	game.addPlayer(playerName, connection);
	let players = game.getPlayers(),
		playerNames = players.map((player)=>{
			return player.name;
		}),
		playersLength = players.length;
	socketManager.sendToSession(session, 'player joined', playerNames);
	if(playersLength > 1) {
		/*for(let i=0; i<playersLength; i++) {
			let player = players[i];
			socketManager.sendToSession(session, 'update state', {
				label: player.name+'-hero',
				state: game.getState(player.name+'-hero')
			});
		}*/
		socketManager.listenToSession(session, 'joystick', (label)=>{
			socketManager.sendToConnection(players[0].connection, 'joystick', label, true);
		});
		socketManager.listenToSession(session, 'sprite update', (sprites)=>{
			socketManager.sendToConnection(players[1].connection, 'sprite update', sprites);
		});
		socketManager.sendToSession(session, 'game start', game.getState());
	}
	socketManager.listenToConnection(connection, 'end game', ()=>{
		socketManager.endSession(session);
	});
});
socketManager.onSessionEnd(function(session){
	let game = Game.getGameBySession(session);
	if(!!game) {
		socketManager.sendToSession(session, 'end game');
		game.end();
	}
});