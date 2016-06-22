'use strict';

(function(){
	
	let id = require('./id'),
		Sprite = require('./sprite'),
		Character = require('./character'),
		Player = require('./player'),
		Enemy = require('./enemy'),
		Bullet = require('./bullet'),
		resources = require('./resources.js'),
		state = require('./state'),
		settings = require('./settings'),
		GameObject = require('./gameObject'),
		React = require('react'),
		ReactDOM = require('react-dom'),
		cycle = require('./cycle'),
		gameCanvas = null,
		windowWidth = null,
		windowHeight = null,
		resScaleWidth = null,
		resScaleHeight = null,
		levelsData = null,
		characterData = null,
		socket = null;
		
	let GamesList = React.createClass({
		render: function() {
			let handleClick = this.props.handleClick,
				createItem = function(item, handleGameListSelect) {
				return <li key={item.sessionId}><button data-session-id={item.sessionId} onClick={handleClick}>{item.name}</button></li>;
			};
			return <ul>{this.props.items.map(createItem)}</ul>;
		}
	});
		
	let Game = React.createClass({
		componentDidMount: function() {
			gameCanvas = document.getElementById('gameScreen').querySelector('canvas');
			settings.canvasContext = gameCanvas.getContext('2d');
			windowWidth = window.innerWidth;
			windowHeight = window.innerHeight;
			resScaleWidth = windowWidth / settings.stageWidth;
			resScaleHeight = windowHeight / settings.stageHeight;
			settings.resolution = (resScaleWidth < resScaleHeight) ? resScaleWidth : resScaleHeight;
			gameCanvas.setAttribute('width', windowWidth);
			gameCanvas.setAttribute('height', windowHeight);
			
			let stageWidth = settings.stageWidth,
				stageHeight = settings.stageHeight,
				leftWall = this._createGameObject(0, stageHeight / 2, settings.zObstacle, 'left-wall', settings.wallSprite),
				rightWall = this._createGameObject(stageWidth, stageHeight / 2, settings.zObstacle, 'right-wall', settings.wallSprite),
				ceiling = this._createGameObject(stageWidth / 2, 0, settings.zObstacle, 'ceiling', settings.floorSprite),
				floor = this._createGameObject(stageWidth / 2, stageHeight, settings.zObstacle, 'floor', settings.floorSprite);
			
			require('./controls.js')(this.onJoystick, this.onFire);
			socket = require('./socket');
			socket.on('games list', this._listGames);
			socket.on('player joined', this._setPlayerNames);
			socket.on('game start', this._startGame);
			socket.on('update state', this._updateGameState);
			socket.on('end game', this._endGame);
			
			cycle.addCycle(Sprite.draw);
		},
		_endGame: function() {
			cycle.stop();
			let gameObjects = this.state.gameObjects, key = null;
			for(key in gameObjects) {
				gameObjects[key].destroy();
			}
			this.setState({
				gameObjects: Object.create(null),
				playerName: '',
				sessionId: '',
				gameName: '',
				gameCreated: false,
				gameActive: false
			});
			socket.emit('games list');
			socket.emit('end game');
		},
		_startLevel: function(index) {
			let levelData = levelsData[index],
				stageWidth = settings.stageWidth,
				stageHeight = settings.stageHeight,
				playerNames = this.state.playerNames,
				player1 = settings.player1,
				player2 = settings.player2,
				bg = new Sprite(levelData.background);
			bg.x = stageWidth / 2;
			bg.y = stageHeight / 2;
			bg.addToStage(0);
			let i = 0, l = levelData.obstacles.length, obstacleData = null;
			for(i=0; i<l; i++) {
				obstacleData = levelData.obstacles[i];
				this._createGameObject(obstacleData.x, obstacleData.y, settings.zObstacle, 'obstacle-'+i, settings.obstacleSprite);
			}
			if(playerNames[0] === this.state.playerName) {
				l = levelData.enemies.length;
				let enemyData = null, enemy;
				for(i=0; i<l; i++) {
					enemyData = levelData.enemies[i];
					enemy = new Enemy();
					enemy.sprites = characterData.grunt.sprites;
					enemy.speed = characterData.grunt.speed;
					enemy.z = characterData.grunt.z;
					enemy.state = enemyData;
					enemy.stage = true;
					enemy.aiStart();
					this.state.gameObjects[enemy.label] = enemy;
				}
			}
			player1.state = levelData.player1;
			player2.state = levelData.player2;
			player1.stage = true;
			player2.stage = true;
			this.setState({gameActive:true});
			cycle.start();
		},
		_createGameObject: function(x, y, z, label, display) {
			let go = new GameObject(z, label),
				stateObj = Object.create(null);
			go.state = stateObj;
			go.addSprite(display, new Sprite(display));		
			go.display = display;
			go.x = x;
			go.y = y;
		},
		_listGames: function(games) {
			this.setState({games: games});
		},
		_updateGameState: function(data) {
			let label = data.label,
				serverState = data.state;
			if(!!this.state.gameObjects[label]) {
				this.state.gameObjects[label].state = serverState;
				if(serverState.destroyed) {
					delete this.state.gameObjects[label];
				}
			} else {
				let type = serverState.type,
					gameObject = null;
				if(type === 'player') {
					gameObject = new Player(label);
					gameObject.sprites = characterData.player.sprites;
					gameObject.state = serverState;
				} else if(type === 'bullet') {
					gameObject = new Bullet(label);
					gameObject.state = serverState;
				} else if(type === 'grunt') {
					gameObject = new Enemy(label);
					gameObject.sprites = characterData.grunt.sprites;
					gameObject.state = serverState;
					console.log(gameObject);
				}
				gameObject.stage = true;
				this.state.gameObjects[label] = gameObject;	
			}
		},
		_startGame: function() {
			let playerNames = this.state.playerNames,
				gameObjects = this.state.gameObjects,
				player1Label = playerNames[0] + '-player',
				player2Label = playerNames[1] + '-player',
				player1 = null,
				player2 = null;
			if(!gameObjects[player1Label]) {
				player1 = new Player(player1Label);
				gameObjects[player1Label] = player1;
				player1.sprites = characterData.player.sprites;
				player1.speed = characterData.player.speed;
				player1.z = characterData.player.z;
			}
			if(!gameObjects[player2Label]) {
				player2 = new Player(player2Label);
				gameObjects[player2Label] = player2;
				player2.sprites = characterData.player.sprites;
				player2.speed = characterData.player.speed;
				player2.z = characterData.player.z;
			}
			if(!!player1 && !!player2) {
				settings.player1 = player1;
				settings.player2 = player2;
				this._startLevel(0);
			}
		},
		_setPlayerNames: function(playerNames) {
			this.setState({playerNames: playerNames});
		},
		_setPlayerName: function() {
			this.setState({playerNameSet:true});
			socket.emit('games list');
		},
		getInitialState: function() {
			return {
				gameObjects: Object.create(null),
				playerName: '',
				sessionId: '',
				gameName: '',
				games: [],
				gameCreated: false,
				playerNameSet: false,
				gameActive: false
			}
		},
		onPlayerNameChange: function(e) {
			this.setState({playerName: e.target.value});
		},
		onGameNameChange: function(e) {
			this.setState({gameName: e.target.value});
		},
		handleJoinGame: function() {
			socket.emit('register', {
				label: this.state.playerName,
				sessionId: this.state.sessionId
			});
		},
		handleGameListSelect: function(e) {
			this.setState({sessionId: e.target.getAttribute('data-session-id')});
		},
		handleCreateGame: function() {
			this.setState({gameCreated: true});
			socket.emit('register', {
				label: this.state.playerName,
				name: this.state.gameName
			});
		},
		handleEndGame: function(e) {
			this._endGame();
		},
		onJoystick: function(label) {
			this.state.gameObjects[this.state.playerName+'-player'].move(label);
		},
		onFire: function() {
			let player = this.state.gameObjects[this.state.playerName+'-player'],
				bulletState = Object.create(null);
			bulletState.direction = player.direction;
			bulletState.speed = settings.bulletSpeed;
			bulletState.x = player.x;
			bulletState.y = player.y;
			bulletState.type = 'bullet';
			bulletState.display = settings.bulletSprite;
			let bullet = new Bullet();
			bullet.ignoreCollision(player);
			bullet.state = bulletState;
			bullet.stage = true;
			bullet.fire();
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
	
	resources.onReady(function(){
		require('./data')(settings.levelsJsonUri, (data)=>{
			levelsData = data.levels;
			require('./data')(settings.charactersJsonUri, (data)=>{
				characterData = data.characters;
				ReactDOM.render(<Game/>, document.getElementById('game'));
			});
		});
	});
	resources.load([
		settings.spritesImage,
		settings.fireBtnImage,
		settings.joystickImage
	]);
}());
