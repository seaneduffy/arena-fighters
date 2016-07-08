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

let io = require('socket.io')(http),
	Connection = require('./app/connection'),
	Game = require('./app/game');
	
Connection.io = io;
	
io.on('connection', onConnection);

function onConnection(socket) {
	let connection = new Connection(socket);
}
