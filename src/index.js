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
		levelsData = null,
		settings = null,
		socket = null,
		property = null;
		
	let GamesList = React.createClass({
		render: function() {
			let handleClick = this.props.handleClick,
				createItem = function(item, handleGameListSelect) {
				return <li key={item.id}>
					<button data-game-id={item.id} data-player-name={item.hostName} onClick={handleClick}>{item.gameName}</button>
					</li>;
			};
			return <ul>{this.props.items.map(createItem)}</ul>;
		}
	});
		
	let Game = React.createClass({
		componentDidMount: function() {
			utils.init();
			gameCanvas = document.getElementById('gameScreen').querySelector('canvas');
			global.canvasContext = gameCanvas.getContext('2d');
			gameCanvas.setAttribute('width', windowWidth);
			gameCanvas.setAttribute('height', windowHeight);
			require('./controls.js')(
				(angle, amount) => {
					if(!this.state.hosting) {
						socket.emit('joystick', {angle:angle, amount:amount});
					} else {
						this._movePlayer(global.player1, angle, amount);
					}
				},
				() => {
					if(!this.state.hosting) {
						socket.emit('fire');
					} else {
						this._fire(global.player1);
					}
				}
			);
			socket = require('./socket');
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
				this._movePlayer(global.player2, data.angle, data.amount);
			});
			socket.on('fire', ()=>{
				this._fire(global.player2);
			});
			socket.on('end game', ()=>{
			});
			cycle.addUIUpdateFunction(Sprite.draw);
			cycle.addCleanup(GameObject.cleanup);
			
			if(this.state.dev1Player)
				this.handleCreateGame();
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
				dev1Player: true
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
							global.player1 = gameObject;
						else if(type === 'player2')
							global.player2 = gameObject;
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
			<p>You have joined {this.state.hostName}'s game. Waiting for them to be ready...</p>
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
			windowWidth = screen.width;
			windowHeight = screen.height;
			
			let stageWidth = 0,
				stageHeight = 0,
				spriteImgPath = null,
				spriteJsonPath = null,
				maxWidth = global.maxWidth = utils.processValue(settings.maxWidth),
				maxHeight = global.maxHeight = utils.processValue(settings.maxHeight),
				wallPadding = utils.processValue(settings.wallPadding),
				positionScale = 0,
				sdWidth = utils.processValue(settings.sdWidth),
				sdHeight = utils.processValue(settings.sdHeight),
				mdWidth = utils.processValue(settings.mdWidth),
				mdHeight = utils.processValue(settings.mdHeight),
				hdWidth = utils.processValue(settings.hdWidth),
				hdHeight = utils.processValue(settings.hdHeight);
			
			if(windowWidth <= sdWidth) {
				stageWidth = sdWidth;
				stageHeight = sdHeight;
				spriteImgPath = global.sdImgPath;
				spriteJsonPath = global.sdJsonPath;
			} else if(windowWidth <= mdWidth) {
				stageWidth = mdWidth;
				stageHeight = mdHeight;
				spriteImgPath = global.mdImgPath;
				spriteJsonPath = global.mdJsonPath;
			} else {
				stageWidth = hdWidth;
				stageHeight = hdHeight;
				spriteImgPath = global.hdImgPath;
				spriteJsonPath = global.hdJsonPath;
			}
			
			global.stageWidth = stageWidth;
			global.stageHeight = stageHeight;

			global.resolution = windowWidth / stageWidth;
			positionScale = global.positionScale = stageWidth / maxWidth;
			global.stageCenterX = utils.processValue(settings.stageCenterX);
			global.stageCenterY = utils.processValue(settings.stageCenterY);
			global.settings.joystickMin *= positionScale;
			global.settings.joystickMax *= positionScale;
			wallPadding *= positionScale;
			global.topWall = {
				x: 0,
				y: 0,
				width: stageWidth,
				height: wallPadding
			};
			global.leftWall = {
				x: 0,
				y: 0,
				width: wallPadding,
				height: stageHeight
			};
			global.rightWall = {
				x: stageWidth - wallPadding,
				y: 0,
				width: wallPadding,
				height: stageHeight
			};
			global.bottomWall = {
				x: 0,
				y: stageHeight - wallPadding,
				width: stageWidth,
				height: wallPadding
			};
			let imagesToLoad = [
				global.fireBtnImage,
				global.joystickImage
			];
			
			levelsData.forEach(levelData=>{
				levelData.forEach(levelDataObject=>{
					if(!!levelDataObject.properties) {
						for(property in levelDataObject.properties) {
							levelDataObject.properties[property] = utils.processValue(levelDataObject.properties[property]);
							if(property === 'x' || property === 'y' || property === 'speed')
								levelDataObject.properties[property] *= positionScale;
						}
					}
				});
			});
			
			for(let type in settings) {
				if(!!settings[type].properties) {
					for(property in settings[type].properties) {
						settings[type].properties[property] = utils.processValue(settings[type].properties[property]);
						if(property === 'x' || property === 'y' || property === 'speed')
							settings[type].properties[property] *= positionScale;
					}
				}
				if(!!settings[type].properties && !!settings[type].properties.sprites) {
					let imagePath = spriteImgPath+type+'.png',
						jsonPath = spriteJsonPath+type+'.json',
						spriteMeta = {
							img: imagePath
						};
					imagesToLoad.push(imagePath);
					data(jsonPath, (json)=>{
						spriteMeta.frames = json.frames;
						settings[type].properties.spriteMeta = spriteMeta;
					});
				}
				if(!!settings[type].properties && !!settings[type].properties.sprite) {
					imagesToLoad.push(spriteImgPath+type+'.png');
					settings[type].properties.sprite = spriteImgPath+type+'.png';
				}
			}
			resources.load(imagesToLoad);
		});
	});
	
	resources.onReady(function(){
		ReactDOM.render(<Game/>, document.getElementById('game'));
	});
	

}());
