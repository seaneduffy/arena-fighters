'use strict';

let React = require('react'),
	utils = require('../utils'),
	resources = require('../resources'),
	config = require('../config'),
	socket = require('../socket'),
	Sprite = require('../sprite'),
	cycle = require('../cycle'),
	GameObject = require('../gameObject'),

	gameCanvas = null;

let GamesList = React.createClass({
	render: function(){ return (
		<ul>
		{this.props.items.map(item=>{ return(
			<li key={item.id}>
				<button data-game-id={item.id} data-player-name={item.hostName} onClick={this.props.handleClick}>{item.gameName}</button>
			</li>
		)})}
		</ul>
	)}
}),

Game = React.createClass({
	componentDidMount: function() {
		resources.onReady(function(){
			utils.init();
			gameCanvas = document.getElementById('gameScreen').querySelector('canvas');
			config.canvasContext = gameCanvas.getContext('2d');
			gameCanvas.setAttribute('width', config.windowWidth);
			gameCanvas.setAttribute('height', config.windowHeight);
			require('../controls')(
				(angle, amount) => {
					if(!this.state.hosting) {
						socket.emit('joystick', {angle:angle, amount:amount});
					} else {
						this._movePlayer(config.player1, angle, amount);
					}
				},
				() => {
					if(!this.state.hosting) {
						socket.emit('fire');
					} else {
						this._fire(config.player1);
					}
				}
			);
			socket.on('games list', games=>{
				this.setState({games: games});
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
			});
			cycle.addUIUpdateFunction(Sprite.draw);
			cycle.addCleanup(GameObject.cleanup);
		
			if(this.state.dev1Player)
				this.handleCreateGame();
		});
	},
	getInitialState: function() {
		return {
			gameObjects: [],
			playerName: '',
			gameId: '',
			gameName: '',
			games: [],
			hostName: '',
			guestName: '',
			gameCreated: false,
			playerNameSet: false,
			gameJoined: false,
			gameActive: false,
			hosting: false,
			playerJoined: false,
			hostReady: false,
			dev1Player: false
		}
	},
	_startLevel: function(index) {
		let levelData = levelsData[index];
		if(this.state.hosting) {
			let i = 0, l = levelData.length, gameObject = null, type = null, properties = null;
			for(i; i<l; i++) {
				type = levelData[i].type;
				properties = levelData[i].properties;
				if(this.state.playerJoined || type !== 'player2') {
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
		this.setState({gameActive:true});
		cycle.start();
	},
	_setPlayerNames: function(playerNames) {
		this.setState({playerNames: playerNames});
	},
	_fire: function(player) {
		if(player.dead)
			return;
		player.firearm.fire(player);
	},
	_movePlayer: function(player, angle, amount) {
		if(!player.dead)
			player.walk(amount,angle);
	},
	handleJoinGame: function() {
		Sprite.setHosting(false);
		socket.emit('join game', {
			name: this.state.playerName,
			gameId: this.state.gameId
		});
		this.setState({gameJoined:true});
	},
	handleGameListSelect: function(e) {
		let element = e.target;
		this.setState({
			gameId: element.getAttribute('data-game-id'),
			hostName: element.getAttribute('data-player-name')
		});
	},
	handleCreateGame: function() {
		this.setState({gameCreated: true});
		socket.emit('create game', {
			name: this.state.playerName,
			gameName: this.state.gameName
		});
	},
	handleEndGame: function(e) {
		cycle.stop();
		GameObject.clear();
		this.setState({gameActive:false});
	},
	handleConfirmPlayerName: function() {
		this.setState({playerNameSet:true});
		socket.emit('request games list');
	},
	handleStartSinglePlayer: function() {
		this._startLevel(0);
	},
	handleHostReady: function() {
		this.setState({hostReady:true});
		socket.emit('host ready');
	},
	handleGuestReady: function() {
		socket.emit('guest ready');
		this._startLevel(0);
	},
	onPlayerNameChange: function(e) {
		this.setState({playerName: e.target.value});
	},
	onGameNameChange: function(e) {
		this.setState({gameName: e.target.value});
	},
	render: function() {
		return (
		
<div id="arena-fighters" className={this.state.gameActive ? 'minimal-ui' : ''}>
	<div className={this.state.gameActive ? 'hidden' : ''}>
		<div className={!this.state.playerNameSet ? 'registrationForm' : 'hidden'}>
			<p>Enter your name</p>
			<input type="text" onChange={this.onPlayerNameChange} />
			<button onClick={this.handleConfirmPlayerName}>Confirm name</button>
		</div>
		<div className={this.state.playerNameSet && !(this.state.gameCreated || this.state.gameJoined) ? '' : 'hidden'}>
			<div className='registrationForm'>
				<p>Create new game</p>
				<label>Name of game</label>
				<input type="text" onChange={this.onGameNameChange} />
				<button onClick={this.handleCreateGame}>Submit</button>
			</div>
			<div className={this.state.games.length > 0 ? 'registrationForm' : 'hidden'}>
				<p>Or choose game to join</p>
				<GamesList items={this.state.games} handleClick={this.handleGameListSelect}/>
				<button onClick={this.handleJoinGame}>Join Game</button>
			</div>
		</div>
		<div className={this.state.gameCreated && !this.state.playerJoined ? 'registrationForm' : 'hidden'}>
			<p>Created game. Waiting for partner to join...</p>
			<p>or press "start" to start a single player game</p>
			<button onClick={this.handleStartSinglePlayer}>Start</button>
		</div>
		<div className={this.state.gameJoined && !this.state.hostReady ? 'registrationForm' : 'hidden'}>
			<p>You have joined {this.state.hostName}&rsquo;s game. Waiting for them to be ready...</p>
		</div>
		<div className={this.state.playerJoined && !this.state.hostReady ? 'registrationForm' : 'hidden'}>
			<p>{this.state.guestName} has joined the game! Press "start" let them know you are ready!</p>
			<button onClick={this.handleHostReady}>Start</button>
		</div>
		<div className={this.state.gameJoined && this.state.hostReady ? 'registrationForm' : 'hidden'}>
			<p>{this.state.hostName} is ready. Press "start"!</p>
			<button onClick={this.handleGuestReady}>Start</button>
		</div>
		<div className={this.state.hostReady && this.state.playerJoined ? 'registrationForm' : 'hidden'}>
			<p>Waiting for {this.state.guestName} to be ready.</p>
		</div>
	</div>
	<div id="gameScreen" className={this.state.gameActive ? '' : 'hidden'}>
		<canvas></canvas>
		<div id="controls">
			<span id="joystick" className="center"></span>
			<span id="fire-btn"></span>
			<span id="end-game-btn" onTouchStart={this.handleEndGame}></span>
		</div>
	</div>
</div>		
		
	)}
});

module.exports = {
	Game: Game
}