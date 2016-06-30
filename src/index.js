'use strict';

(function(){
	
	let Sprite = require('./sprite'),
		Player = require('./player'),
		Enemy = require('./enemy'),
		Projectile = require('./projectile'),
		resources = require('./resources.js'),
		settings = require('./settings'),
		GameObject = require('./gameObject'),
		projectile = require('./projectile'),
		React = require('react'),
		ReactDOM = require('react-dom'),
		cycle = require('./cycle'),
		data = require('./data'),
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
				return <li key={item.id}><button data-game-id={item.id} onClick={handleClick}>{item.name}</button></li>;
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
			let levelData = levelsData[index],
				stageWidth = settings.stageWidth,
				stageHeight = settings.stageHeight;
			
			if(this.state.hosting) {
				let stageWidth = settings.stageWidth,
					stageHeight = settings.stageHeight,
					i = 0, l = 0,
					obstacle = null,
				bg = this._createGameObject('background', settings.spritesData[levelData.background].img);
					//leftWall = this._createGameObject('obstacle', {default:levelData.leftWall}),
					//rightWall = this._createGameObject('obstacle', {default:levelData.rightWall}),
					//topWall = this._createGameObject('obstacle', {default:levelData.topWall}),
					//bottomWall = this._createGameObject('obstacle', {default:levelData.bottomWall});
				bg.x = stageWidth / 2;
				bg.y = stageHeight / 2;
				bg.stage = true;
				/*leftWall.x = 0;
				leftWall.y = stageHeight / 2;
				leftWall.stage = true;
				rightWall.x = stageWidth;
				rightWall.y = stageHeight / 2;
				rightWall.stage = true;
				topWall.x = stageWidth / 2;
				topWall.y = 0;
				topWall.stage = true;
				bottomWall.x = stageWidth / 2;
				bottomWall.y = stageHeight;
				bottomWall.stage = true;
				l = levelData.obstacles.length;
				for(i=0; i<l; i++) {
					obstacle = this._createGameObject('obstacle', {default:levelData.obstacles[i].sprite});
					obstacle.x = levelData.obstacles[i].x;
					obstacle.y = levelData.obstacles[i].y;
					obstacle.stage = true;
				}
				l = levelData.enemies.length;
				let enemyData = null, enemy;
				for(i=0; i<l; i++) {
					enemyData = levelData.enemies[i];
					enemy = this._createGameObject(enemyData.type);
					enemy.stage = true;
					enemy.x = enemyData.x;
					enemy.y = enemyData.y;
					enemy.direction = -1;
					enemy.display = enemyData.display;
					enemy.aiStart();
				}*/
				let player1 = settings.player1 = this._createGameObject('player1');
				player1.x = levelData.player1.x;
				player1.y = levelData.player1.y;
				player1.direction = -1;
				player1.display = levelData.player1.display;
				player1.stage = true;
				if(this.state.playerConnected) {
					let player2 = settings.player2 = this._createGameObject('player2');
					player2.x = levelData.player2.x;
					player2.y = levelData.player2.y;
					player2.directionLabel = levelData.player2.direction;
					player2.display = levelData.player2.display;
					player2.stage = true;
				}
			}
			this.setState({gameActive:true});
			cycle.start();
		},
		_createGameObject: function(type, sprite) {
			let gameObject = null, property = null, gameObjectData = gameObjectsData[type];
			
			if(type === 'player1' || type === 'player2') {
				gameObject = new Player();
			} else if(type === 'background' || type === 'obstacle') {
				gameObject = new GameObject();
			} else if(type === 'projectile') {
				gameObject = new Projectile();
			} else if(type === 'grunt') {
				gameObject = new Enemy();
			}
			gameObject.type = type;
			if(!gameObject)
				return false;
			if(!!sprite)
				gameObject.sprite = sprite;
			this.state.gameObjects.push(gameObject);
			if(!!gameObjectData) {
				for(property in gameObjectData) {
					gameObject[property] = gameObjectData[property];
				}
			}
			return gameObject;
		},
		_setPlayerNames: function(playerNames) {
			this.setState({playerNames: playerNames});
		},
		_setPlayerName: function() {
			this.setState({playerNameSet:true});
			socket.emit('games list');
		},
		_fire: function(player) {
			let projectile = this._createGameObject('projectile'),
				point = player.front;
			projectile.direction = player.direction;
			projectile.x = point.x;
			projectile.y = point.y;
			point = projectile.front;
			projectile.x = point.x;
			projectile.y = point.y;
			projectile.ignoreCollision = player;
			projectile.stage = true;
			projectile.fire();
		},
		_movePlayer: function(player, angle) {
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
				if(settings.player2.dead)
					return
				socket.emit('joystick', angle);
			} else {
				if(settings.player1.dead)
					return
				this._movePlayer(settings.player1, angle);
			}
		},
		onFire: function() {
			if(!this.state.hosting) {
				if(settings.player2.dead)
					return
				socket.emit('fire');
			} else {
				if(settings.player1.dead)
					return
				this._fire(settings.player1);
			}
		},
		onServerFire: function() {
			this._fire(settings.player2);
		},
		onServerJoystick: function(angle) {
			this._movePlayer(settings.player2, angle);
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

	data(settings.levelsJsonUri, (json)=>{
		levelsData = json.levels;
		data(settings.gameObjectsJsonUri, (json)=>{
			gameObjectsData = json.gameobjects;
			data(settings.spritesJsonUri, (json)=>{
				let spritesData = settings.spritesData = json.sprites,
					imagesToLoad = [
						settings.fireBtnImage,
						settings.joystickImage,
						'/img/bullet.png'
					];
				for(let key in spritesData) {
					let spriteData = spritesData[key];
					imagesToLoad.push(spriteData.img);
					if(!!spriteData.data) {
						data(spriteData.data, (json)=>{
							spriteData.frames = json.frames;
						});
					}
				}
				resources.load(imagesToLoad);
			});
		});
	});
	
	resources.onReady(function(){
		ReactDOM.render(<Game/>, document.getElementById('game'));
	});
	

}());
