'use strict';

let React = require('react'),
ReactDOM = require('react-dom'),

components = require('./components'),
dataLoader = require('../data'),
config = require('../config'),
resources = require('../resources'),
socket = require('../socket'),
cycle = require('../cycle'),
Sprite = require('../displayObject/sprite'),
DisplayObject = require('../displayObject/displayObject'),
id = require('../id'),

controls = null,

gameComponent = ReactDOM.render(React.createElement(components.Game), document.getElementById('game'), ()=>{
	
	config.domElement = document.getElementById('canvas');
	config.domElement.style.position = 'relative';
	config.domElement.style.overflow = 'hidden';
	
	initSocket();
	
	dataLoader.load(()=>{
		resources.onReady(function(){
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
				handleEndGame,
				handlePauseGame,
				handleRestartGame,
				handleResumeGame
			);
			
			if(config.dev1) {
				config.gameType = 'single';
				gameComponent.setState({gameType: 'single'});
				startGame();
			} else if(config.dev2) {
				config.gameType = 'two';
				gameComponent.setState({
					name: id.id()
				});
				handleConfirmPlayerName();
			}
			
		});
		resources.load(config.imagesToLoad);
	});
});

function startLevel(index) {
	let levelData = config.levels[index];
	if(config.hosting || config.gameType === 'single') {
		let displayObject = null, property = null;
		levelData.forEach( level => {
			if(level.id !== 'player2' || config.gameType === 'two') {
				displayObject = new config.displayObjects[level.id].class();
				for(property in config.displayObjects[level.id]) {
					displayObject[property] = config.displayObjects[level.id][property];
				}
				for(let property in level.properties) {
					displayObject[property] = level.properties[property];
				}
				displayObject.stage = true;
				if(level.id === 'player1')
					config.player1 = displayObject;
				else if(level.id === 'player2')
					config.player2 = displayObject;
			}
		} );
	}
}

function startGame() {
	gameComponent.setState({gameActive:true});
	if(config.hosting) {
		cycle.addServer(Sprite.sendUpdate);
	} else {
		socket.on('sprite update', Sprite.receiveUpdate);
	}	
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
		if(config.dev2) {
			if(games.length > 0) {
				gameComponent.setState({
					gameId: games[0].id
				});
				handleJoinGame();
			} else {
				gameComponent.setState({
					gameName: id.id()
				});
				handleCreateGame();
			}
		}
	});
	socket.on('game created', id=>{
		gameComponent.setState({
			hosting: true,
			gameId: id
		});
	});
	socket.on('player joined', playerName=>{
		gameComponent.setState({guestName: playerName});
		gameComponent.setState({playerJoined: true});
		
		if(config.dev2) {
			handleHostReady();
		}
	});
	socket.on('host ready', ()=>{
		gameComponent.setState({hostReady:true});
		
		if(config.dev2) {
			handleGuestReady();
		}
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
	config.hosting = true;
	socket.emit('create game', {
		name: gameComponent.state.playerName,
		gameName: gameComponent.state.gameName
	});
}
function handlePauseGame(e) {
	cycle.stop()
	gameComponent.setState({paused: true});
}
function handleResumeGame(e) {
	gameComponent.setState({paused: false});
	cycle.start();
}
function handleRestartGame(e) {
	cycle.stop();
	DisplayObject.clear();
	gameComponent.setState({paused: false});
	startGame();
}
function handleEndGame(e) {
	cycle.stop();
	DisplayObject.clear();
	gameComponent.setState(gameComponent.getInitialState());
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