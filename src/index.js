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
		Background = require('./background'),
		React = require('react'),
		ReactDOM = require('react-dom'),
		cycle = require('./cycle'),
		gameCanvas = null,
		windowWidth = null,
		windowHeight = null,
		resScaleWidth = null,
		resScaleHeight = null,
		levelsData = null,
		gameObjectsData = null,
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
			
			/*let stageWidth = settings.stageWidth,
				stageHeight = settings.stageHeight,
				leftWall = this._createGameObject(0, stageHeight / 2, settings.zObstacle, 'left-wall', settings.wallSprite),
				rightWall = this._createGameObject(stageWidth, stageHeight / 2, settings.zObstacle, 'right-wall', settings.wallSprite),
				ceiling = this._createGameObject(stageWidth / 2, 0, settings.zObstacle, 'ceiling', settings.floorSprite),
				floor = this._createGameObject(stageWidth / 2, stageHeight, settings.zObstacle, 'floor', settings.floorSprite);
			*/
			require('./controls.js')(this.onJoystick, this.onFire);
			socket = require('./socket');
			socket.on('games list', this._listGames);
			socket.on('player joined', this._setPlayerNames);
			socket.on('game start', this._startGame);
			socket.on('joystick', this.onJoystickServer);
			//socket.on('update state', this._updateGameState);
			socket.on('end game', this._endGame);
			
			cycle.addUI(Sprite.draw);
		},
		_endGame: function() {
			cycle.stop();
			let gameObjects = this.state.gameObjects, i = 0, l = gameObjects.length;
			for(i=0; i<l; i++) {
				gameObjects[i].destroy();
			}
			this.setState({
				gameObjects: [],
				playerName: '',
				sessionId: '',
				gameName: '',
				gameCreated: false,
				gameActive: false,
				hosting: false
			});
			socket.emit('games list');
			socket.emit('end game');
		},
		_startLevel: function(index) {
			let levelData = levelsData[index],
				stageWidth = settings.stageWidth,
				stageHeight = settings.stageHeight;
			
			if(this.state.hosting) {
				let player1 = settings.player1 = this._createGameObject('player'),
					player2 = settings.player2 = this._createGameObject('player'),
					bg = this._createGameObject('background');
				bg.stage = true;
				player1.x = levelData.player1.x;
				player1.y = levelData.player1.y;
				player1.direction = levelData.player1.direction;
				player1.display = levelData.player1.display;
				player2.x = levelData.player2.x;
				player2.y = levelData.player2.y;
				player2.direction = levelData.player2.direction;
				player2.display = levelData.player2.display;
				player1.stage = true;
				player2.stage = true;
			}
			
			/*let i = 0, l = levelData.obstacles.length, obstacleData = null;
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
					//enemy.state = enemyData;
					enemy.stage = true;
					enemy.aiStart();
					this.state.gameObjects[enemy.label] = enemy;
				}
			}*/
			this.setState({gameActive:true});
			cycle.start();
			setTimeout(()=>{
				console.log(this.state.gameObjects);
			}, 100);
		},
		_createGameObject: function(type) {
			let gameObject = null, property = null, gameObjectData = gameObjectsData[type];
			if(type === 'player') {
				gameObject = new Player();
			} else if(type === 'background') {
				gameObject = new Background();
			} else if(type === 'bullet') {
				gameObject = new Bullet();
			}
			if(!gameObject)
				return false;
			this.state.gameObjects.push(gameObject);
			if(!!gameObjectData) {
				for(property in gameObjectData) {
					gameObject[property] = gameObjectData[property];
				}
			}
			return gameObject;
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
					gameObject.sprites = gameObjectsData.player.sprites;
					gameObject.state = serverState;
				} else if(type === 'bullet') {
					gameObject = new Bullet(label);
					gameObject.state = serverState;
				} else if(type === 'grunt') {
					gameObject = new Enemy(label);
					gameObject.sprites = gameObjectsData.grunt.sprites;
					gameObject.state = serverState;
				}
				gameObject.stage = true;
				this.state.gameObjects[label] = gameObject;	
			}
		},
		_startGame: function() {
			let playerNames = this.state.playerNames;
			if(playerNames[0] === this.state.playerName) {
				this.setState({hosting: true});
				Sprite.setHosting(true);
			} else {
				this.setState({hosting: false});
				Sprite.setHosting(false);
			}
			this._startLevel(0);
		},
		_setPlayerNames: function(playerNames) {
			this.setState({playerNames: playerNames});
		},
		_setPlayerName: function() {
			this.setState({playerNameSet:true});
			socket.emit('games list');
		},
		_fire: function(player) {
			let bullet = this._createGameObject('bullet');
			bullet.direction = player.direction;
			bullet.x = player.x;
			bullet.y = player.y;
			bullet.ignoreCollision(player);
			bullet.stage = true;
			bullet.fire();
		},
		_movePlayer: function(player, label) {
			player.move(label);
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
				gameActive: false,
				hosting: false
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
		onJoystick: function(label, client) {
			if(!this.state.hosting) {
				socket.emit('joystick');
			} else {
				this._movePlayer(settings.player1, label);
			}
		},
		onJoystickServer: function(label) {
			this._movePlayer(settings.player2, label);
		},
		onFire: function(caller) {
			if(!this.state.hosting) {
				socket.emit('fire');
			} else {
				this._fire(settings.player1);
			}
		},
		onFireServer: function() {
			this._fire(settings.player2);
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
			require('./data')(settings.gameObjectsJsonUri, (data)=>{
				gameObjectsData = data.gameobjects;
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
