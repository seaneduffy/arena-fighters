'use strict';

let React = require('react'),
ReactDOM = require('react-dom'),

components = require('./components'),
dataLoader = require('../data'),
config = require('../config'),
resources = require('../resources'),
utils = require('../displayObject/utils'),
socket = require('../socket'),
cycle = require('../cycle'),
Sprite = require('../displayObject/sprite'),
DisplayObject = require('../displayObject/displayObject'),

controls = null,

gameComponent = ReactDOM.render(React.createElement(components.Game), document.getElementById('game'), ()=>{
	
	config.domElement = document.getElementById('canvas');
	
	initSocket();
	
	dataLoader.load(()=>{
		resources.onReady(function(){
			utils.init();
			controls = require('../controls');
			controls(onJoystick, onFire);
			cycle.addUpdate(Sprite.draw);
			cycle.addCleanup(DisplayObject.cleanup);
			cycle.addCleanup(Sprite.cleanup);
			components.addHandlers(
				handleStartSinglePlayerGame,
				handleStartTwoPlayerGame,
				handleConfirmPlayerName, 
				handleCreateGame, 
				handleGameListSelect, 
				handleJoinGame,
				handleHostReady,
				handleGuestReady,
				handleEndGame
			);
		});
		resources.load(config.imagesToLoad);
	});
});

function startLevel(index) {
	let levelData = config.levels[index];
	if(config.hosting || config.gameType === 'single') {
		let displayObject = null, type = null, properties = null;
		levelData.forEach( level => {
			if(level.type !== 'player2' || config.gameType === 'two') {
				displayObject = utils.createDisplayObject(level.type, level.properties);
				if(!!displayObject) {
					displayObject.stage = true;
					if(level.type === 'player1')
						config.player1 = displayObject;
					else if(level.type === 'player2')
						config.player2 = displayObject;
				}
			}
		} );
	}
}

function startGame() {
	gameComponent.setState({gameActive:true});
	cycle.start();
	startLevel(0);
}

function movePlayer(player, angle, amount) {
	if(!player.dead)
		player.walk(amount,angle);
}

function fire(player) {
	if(player.dead)
		return;
	player.firearm.fire(player);
}

function onJoystick(angle, amount) {
	if(config.gameType === 'two' && !config.hosting) {
		socket.emit('joystick', {angle:angle, amount:amount});
	} else {
		movePlayer(config.player1, angle, amount);
	}
}

function onFire() {
	if(config.gameType === 'two' && !config.hosting) {
		socket.emit('fire');
	} else {
		fire(config.player1);
	}
}

function initSocket() {
	socket.on('games list', games=>{
		gameComponent.setState({games: games});
	});
	socket.on('game created', id=>{
		Sprite.setHosting(true);
		config.hosting = true;
		gameComponent.setState({
			hosting: true,
			gameId: id
		});
	});
	socket.on('player joined', playerName=>{
		gameComponent.setState({guestName: playerName});
		gameComponent.setState({playerJoined: true});
	});
	socket.on('host ready', ()=>{
		gameComponent.setState({hostReady:true});
	});
	socket.on('guest ready', ()=>{
		startGame();
	});
	socket.on('joystick', data=>{
		movePlayer(config.player2, data.angle, data.amount);
	});
	socket.on('fire', ()=>{
		fire(config.player2);
	});
	socket.on('end game', ()=>{
	});
}

function handleJoinGame() {
	Sprite.setHosting(false);
	config.hosting = false;
	socket.emit('join game', {
		name: gameComponent.state.playerName,
		gameId: gameComponent.state.gameId
	});
	gameComponent.setState({gameJoined:true});
}
function handleGameListSelect(event) {
	let element = event.target;
	gameComponent.setState({
		gameId: element.getAttribute('data-game-id'),
		hostName: element.getAttribute('data-player-name')
	});
}
function handleCreateGame() {
	gameComponent.setState({gameCreated: true});
	socket.emit('create game', {
		name: gameComponent.state.playerName,
		gameName: gameComponent.state.gameName
	});
}
function handleEndGame(e) {
	cycle.stop();
	DisplayObject.clear();
	gameComponent.setState({gameActive:false});
}
function handleConfirmPlayerName() {
	gameComponent.setState({playerNameSet:true});
	socket.emit('request games list');
}
function handleStartSinglePlayerGame() {
	config.gameType = 'single';
	gameComponent.setState({gameType: 'single'});
	startGame();
}
function handleStartTwoPlayerGame() {
	config.gameType = 'two';
	gameComponent.setState({gameType: 'two'});
}
function handleHostReady() {
	gameComponent.setState({hostReady:true});
	socket.emit('host ready');
}
function handleGuestReady() {
	socket.emit('guest ready');
	startGame();
}