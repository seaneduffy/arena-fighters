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


//let socketManager = require('socket.io-connection-manager')(http),
let io = require('socket.io')(http),
	Connection = require('./app/connection'),
	Game = require('./app/game');
	
Connection.io = io;
	
io.on('connection', onConnection);

function onConnection(socket) {
	let connection = new Connection(socket);
}

/*function onRegistration(connection) {
	let session = connection.getSession(), 
		playerNames = session.getConnections().map(function(connection){
			return connection.getLabel();
		});
	socketManager.sendToSession(session, 'player joined', playerNames);
	socketManager.listenToConnection(connection, 'game start', onGameStart);
}

function onGameStart(data) {
	let connections = session.getConnections(), 
		i=0, 
		l = connections.length,
		game = new Game(session);
	
		for(i=0; i<l; i++) {
			game.addPlayer(connections[i].playerName, connection);
		}
		socketManager.listenToSession(session, 'joystick', (label)=>{
			socketManager.sendToConnection(players[0].connection, 'joystick', label);
		});
		socketManager.listenToSession(session, 'fire', ()=>{
			socketManager.sendToConnection(players[0].connection, 'fire');
		});
		socketManager.listenToSession(session, 'sprite update', (sprites)=>{
			socketManager.sendToConnection(players[1].connection, 'sprite update', sprites);
		});
		socketManager.sendToSession(session, 'game start', game.getState());
	});
	socketManager.listenToConnection(connection, 'end game', ()=>{
		socketManager.endSession(session);
	});
}
	
socketManager.onConnection(onConnection);
socketManager.onRegistration(function(connection){
	
});
socketManager.onSessionEnd(function(session){
	let game = Game.getGameBySession(session);
	if(!!game) {
		socketManager.sendToSession(session, 'end game');
		game.end();
	}
});*/