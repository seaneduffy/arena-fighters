'use strict';

(function(){
	
	let Sprite = require('./sprite'),
		GameObject = require('./gameObject'),
		resources = require('./resources.js'),
		global = require('./global'),
		React = require('react'),
		ReactDOM = require('react-dom'),
		cycle = require('./cycle'),
		data = require('./data'),
		utils = require('./utils'),
		gameCanvas = null,
		windowWidth = null,
		windowHeight = null,
		resScaleWidth = null,
		resScaleHeight = null,
		levelsData = null,
		settings = null,
		socket = null;
		
	let GamesList = React.createClass({
		render: function() {
			let handleClick = this.props.handleClick,
				createItem = function(item, handleGameListSelect) {
				return <li key={item.id}><button data-game-id={item.id} onClick={handleClick}>{item.name}</button></li>;
			};
			return <ul>{this.props.items.map(createItem)}</ul>;
		}
	});
		
	let Game = React.createClass({
		componentDidMount: function() {
			utils.init();
			gameCanvas = document.getElementById('gameScreen').querySelector('canvas');
			global.canvasContext = gameCanvas.getContext('2d');
			windowWidth = window.innerWidth;
			windowHeight = window.innerHeight;
			resScaleWidth = windowWidth / global.stageWidth;
			resScaleHeight = windowHeight / global.stageHeight;
			global.resolution = (resScaleWidth < resScaleHeight) ? resScaleWidth : resScaleHeight;
			gameCanvas.setAttribute('width', windowWidth);
			gameCanvas.setAttribute('height', windowHeight);
			require('./controls.js')(this.onJoystick, this.onFire);
			socket = require('./socket');
			socket.on('games list', this.onServerListGames);
			socket.on('game created', this.onServerGameCreated);
			socket.on('player joined', this.onServerPlayerJoined);
			socket.on('start game', this.onServerStartGame);
			socket.on('joystick', this.onServerJoystick);
			socket.on('fire', this.onServerFire);
			socket.on('end game', this.onServerEndGame);
			cycle.addUIUpdateFunction(Sprite.draw);
			cycle.addCleanup(GameObject.cleanup);
			if(this.state.dev1Player)
				this.handleCreateGame();
		},
		_startLevel: function(index) {
			let levelData = levelsData[index];
			
			if(this.state.hosting) {
				let i = 0, l = levelData.length, gameObject = null, type = null, properties = null;
				for(i; i<l; i++) {
					type = levelData[i].type;
					properties = levelData[i].properties;
					//if(type === 'player2' && !this.state.playerJoined)
						//break;
					gameObject = utils.createGameObject(type, properties);
					if(!!gameObject)
						gameObject.stage = true;
					if(type === 'player1')
						global.player1 = gameObject;
					else if(type === 'player2')
						global.player2 = gameObject;
				}
				this.setState({gameActive:true});
				cycle.start();
			}
		},
		_setPlayerNames: function(playerNames) {
			this.setState({playerNames: playerNames});
		},
		_setPlayerName: function() {
			this.setState({playerNameSet:true});
			socket.emit('games list');
		},
		_fire: function(player) {
			/*if(player.dead)
				return;
			let projectile = this._createGameObject('bullet'),
				point = player.front;
			projectile.direction = player.direction;
			projectile.x = point.x;
			projectile.y = point.y;
			point = projectile.front;
			projectile.x = point.x;
			projectile.y = point.y;
			projectile.ignoreCollision = player;
			projectile.stage = true;
			projectile.emit();*/
		},
		_movePlayer: function(player, angle) {
			if(!player.dead)
				player.move(angle);
		},
		getInitialState: function() {
			return {
				gameObjects: [],
				playerName: '',
				sessionId: '',
				gameName: '',
				games: [],
				gameCreated: false,
				playerNameSet: false,
				gameJoined: false,
				gameActive: false,
				hosting: false,
				playerConnected: false,
				dev1Player: true
			}
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
			this.setState({gameId: e.target.getAttribute('data-game-id')});
		},
		handleCreateGame: function() {
			this.setState({gameCreated: true});
			socket.emit('create game', {
				name: this.state.playerName,
				gameName: this.state.gameName
			});
		},
		handleEndGame: function(e) {
			//this._endGame();
		},
		handleStartGame: function() {
			socket.emit('start game');
			this._startLevel(0);
		},
		onPlayerNameChange: function(e) {
			this.setState({playerName: e.target.value});
		},
		onGameNameChange: function(e) {
			this.setState({gameName: e.target.value});
		},
		onJoystick: function(angle) {
			if(!this.state.hosting) {
				socket.emit('joystick', angle);
			} else {
				this._movePlayer(global.player1, angle);
			}
		},
		onFire: function() {
			if(!this.state.hosting) {
				socket.emit('fire');
			} else {
				this._fire(global.player1);
			}
		},
		onServerFire: function() {
			this._fire(global.player2);
		},
		onServerJoystick: function(angle) {
			this._movePlayer(global.player2, angle);
		},
		onServerPlayerJoined: function() {
			this.setState({playerConnected:true});
		},
		onServerGameCreated: function(id) {
			Sprite.setHosting(true);
			this.setState({
				hosting: true,
				gameJoined: true,
				gameId: id
			});
			if(this.state.dev1Player)
				this.handleStartGame();
		},
		onServerStartGame: function() {
			this._startLevel(0);
		},
		onServerListGames: function(games) {
			this.setState({games: games});
		},
		onServerEndGame: function() {
			/*cycle.stop();
			let gameObjects = this.state.gameObjects, i = 0, l = gameObjects.length;
			for(i=0; i<l; i++) {
				gameObjects[i].destroy();
			}
			this.replaceState(this.getInitialState());
			socket.emit('games list');
			socket.emit('end game');*/
		},
		render: function() {
			return (
<div id="arena-fighters">
	<div id="gameRegistration" className={this.state.gameActive ? 'hidden' : ''}>
		<div id="nameForm" class="registrationForm" className={this.state.playerNameSet ? 'hidden' : ''}>
			<p>Enter your name</p>
			<input type="text" id="playerName" onChange={this.onPlayerNameChange} />
			<button onClick={this._setPlayerName}>Confirm name</button>
		</div>
		<div id="createGameForm" class="registrationForm" className={this.state.playerNameSet ? '' : 'hidden'}>
			<p>Create new game</p>
			<label>Name of game</label>
			<input type="text" id="gameName" onChange={this.onGameNameChange} />
			<button id="createGameBtn" onClick={this.handleCreateGame}>Submit</button>
			<p className={this.state.gameCreated ? '' : 'hidden'}>Created game. Waiting for partner</p>
		</div>		
		<div id="gamesList" class="registrationForm" className={this.state.games.length > 0 && this.state.playerNameSet ? '' : 'hidden'}>
			<p>Choose game to join</p>
			<GamesList items={this.state.games} handleClick={this.handleGameListSelect}/>
			<button onClick={this.handleJoinGame}>Join Game</button>
		</div>
		<button onClick={this.handleStartGame} className={this.state.gameJoined ? '' : 'hidden'}>Start Game</button>
	</div>
	<div id="gameScreen" className={this.state.gameActive ? '' : 'hidden'}>
		<canvas></canvas>
		<div id="controls">
			<span id="joystick" class="center"></span>
			<span id="fire-btn"></span>
			<span id="end-game-btn" onTouchStart={this.handleEndGame}></span>
		</div>
	</div>
</div>
)}});

	data(global.levelsJsonUri, (json)=>{
		levelsData = json.levels;
		data(global.settingsJsonUri, (json)=>{
			settings = global.settings = json.settings;
			let imagesToLoad = [
				global.fireBtnImage,
				global.joystickImage
			];
			for(let type in settings) {
				if(!!settings[type].properties.spriteMeta) {
					let spriteMeta = settings[type].properties.spriteMeta;
					imagesToLoad.push(spriteMeta.img);
					if(!!spriteMeta.data) {
						data(spriteMeta.data, (json)=>{
							spriteMeta.frames = json.frames;
						});
					}
				}
				if(!!settings[type].properties.sprite) {
					imagesToLoad.push(settings[type].properties.sprite);
				}
			}
			resources.load(imagesToLoad);
		});
	});
	
	resources.onReady(function(){
		ReactDOM.render(<Game/>, document.getElementById('game'));
	});
	

}());
