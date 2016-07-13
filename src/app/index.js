'use strict';

let React = require('react'),
ReactDOM = require('react-dom'),

components = require('./components'),
dataLoader = require('../data'),
config = require('../config'),
resources = require('../resources'),
utils = require('../utils'),
socket = require('../socket'),
cycle = require('../cycle'),
GameObject = require('../gameObject'),
Sprite = require('../sprite'),

controls = null,

gameComponent = ReactDOM.render(React.createElement(components.Game), document.getElementById('game'), ()=>{
	dataLoader.load(()=>{
		resources.onReady(function(){
			utils.init();
			controls = require('../controls');
			controls(onJoystick, onFire);
			config.gameCanvas = document.getElementById('gameScreen').querySelector('canvas');
			config.gameCanvas.setAttribute('width', config.windowWidth);
			config.gameCanvas.setAttribute('height', config.windowHeight);
			config.canvasContext = config.gameCanvas.getContext('2d');
			cycle.addUIUpdateFunction(Sprite.draw);
			cycle.addCleanup(GameObject.cleanup);
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
		let i = 0, l = levelData.length, gameObject = null, type = null, properties = null;
		for(i; i<l; i++) {
			type = levelData[i].type;
			properties = levelData[i].properties;
			if(type !== 'player2') {
				gameObject = utils.createGameObject(type, properties);
				if(!!gameObject)
					gameObject.stage = true;
				if(type === 'player1')
					config.player1 = gameObject;
				else if(type === 'player2')
					config.player2 = gameObject;
			}
		}
	}
	gameComponent.setState({gameActive:true});
	cycle.start();
}

function startSinglePlayerGame() {
	
}

function startTwoPlayerGame() {
	
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
	/*socket.on('games list', games=>{
		//this.setState({games: games});
	});
	socket.on('game created', id=>{
		Sprite.setHosting(true);
		this.setState({
			hosting: true,
			gameId: id
		});
	});
	socket.on('player joined', playerName=>{
		this.setState({guestName: playerName});
		this.setState({playerJoined: true});
	});
	socket.on('host ready', ()=>{
		this.setState({hostReady:true});
	});
	socket.on('guest ready', ()=>{
		this._startLevel(0);
	});
	socket.on('joystick', data=>{
		this._movePlayer(config.player2, data.angle, data.amount);
	});
	socket.on('fire', ()=>{
		this._fire(config.player2);
	});
	socket.on('end game', ()=>{
	});*/
}

function handleJoinGame() {
	Sprite.setHosting(false);
	socket.emit('join game', {
		name: this.state.playerName,
		gameId: this.state.gameId
	});
	gameComponent.setState({gameJoined:true});
}
function handleGameListSelect(e) {
	let element = e.target;
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
	GameObject.clear();
	gameComponent.setState({gameActive:false});
}
function handleConfirmPlayerName() {
	gameComponent.setState({playerNameSet:true});
	socket.emit('request games list');
}
function handleStartSinglePlayerGame() {
	config.gameType = 'single';
	startLevel(0);
}
function handleStartTwoPlayerGame() {
}
function handleHostReady() {
	gameComponent.setState({hostReady:true});
	socket.emit('host ready');
}
function handleGuestReady() {
	socket.emit('guest ready');
	startLevel(0);
}