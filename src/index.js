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
		socket = null;
		
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
			
			let resScaleWidth = windowWidth / global.stageWidth,
				resScaleHeight = windowHeight / global.stageHeight,
				posScaleWidth = global.stageWidth / global.maxWidth,
				posScaleHeight = global.stageHeight / global.maxHeight;
			global.resolution = (resScaleWidth < resScaleHeight) ? resScaleWidth : resScaleHeight;
			global.positionScale = (posScaleWidth < posScaleHeight) ? posScaleWidth : posScaleHeight;
			gameCanvas.setAttribute('width', windowWidth);
			gameCanvas.setAttribute('height', windowHeight);
			require('./controls.js')(
				angle => {
					if(!this.state.hosting) {
						socket.emit('joystick', angle);
					} else {
						this._movePlayer(global.player1, angle);
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
			//let swipeEventHandlers = null;
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
				/*swipeEventHandlers = this._waitForSwipeDown(()=>{
					window.scrollTo(0,1);
					this._startLevel(0);
				});*/
			});
			socket.on('player joined', playerName=>{
				/*this._stopWaitingForSwipeDown(
					swipeEventHandlers.touchStart, 
					swipeEventHandlers.touchEnd, 
					swipeEventHandlers.touchMove
				);*/
				this.setState({guestName: playerName});
				this.setState({playerJoined: true});
				/*swipeEventHandlers = this._waitForSwipeDown(()=>{
					this.setState({hostReady:true});
					window.scrollTo(0,1);
					socket.emit('host ready');
				});*/
			});
			socket.on('host ready', ()=>{
				this.setState({hostReady:true});
				/*swipeEventHandlers = this._waitForSwipeDown(()=>{
					socket.emit('guest ready');
					window.scrollTo(0,1);
					this._startLevel(0);
				});*/
			});
			socket.on('guest ready', ()=>{
				this._startLevel(0);
			});
			socket.on('joystick', angle=>{
				this._movePlayer(global.player2, angle);
			});
			socket.on('fire', ()=>{
				this._fire(global.player2);
			});
			socket.on('end game', ()=>{
				console.log('server end game');
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
		_movePlayer: function(player, angle) {
			if(!player.dead)
				player.move(angle);
		},
		_waitForSwipeDown: function(callback) {
			let startY = 0, 
				currY = 0,
				touchMove = (e)=>{
					currY = e.touches[0].pageY;
				},
				touchStart = (e)=>{
					startY = e.touches[0].pageY;
				},
				touchEnd = (e)=>{
					console.log(currY);
					/*if(currY < -50) {
						callback();
						this._stopWaitingForSwipeDown(touchStart, touchEnd, touchMove);
					}*/
				};
		
			document.body.addEventListener('touchstart', touchStart, false);
			document.body.addEventListener('touchend', touchEnd, false);
			document.body.addEventListener('touchmove', touchMove, false);
			
			return {
				touchStart: touchStart,
				touchEnd: touchEnd,
				touchMove: touchMove
			}
		},
		_stopWaitingForSwipeDown: function(touchStart, touchEnd, touchMove) {
			document.body.removeEventListener('touchstart', touchStart, false);
			document.body.removeEventListener('touchend', touchEnd, false);
			document.body.removeEventListener('touchmove', touchMove, false);
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
			//this._endGame();
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
			let sW = screen.width,
				sH = screen.height;
			windowWidth = sH > sW ? sH : sW;
			windowHeight = sH < sW ? sH : sW;
			if(windowWidth <= global.sdWidth) {
				global.stageWidth = global.sdWidth;
				global.stageHeight = global.sdHeight;
				global.spriteImgPath = settings.sdImgPath;
				global.spriteJsonPath = settings.sdJsonPath;
			} else if(windowWidth <= global.mdWidth) {
				global.stageWidth = global.mdWidth;
				global.stageHeight = global.mdHeight;
				global.spriteImgPath = settings.mdImgPath;
				global.spriteJsonPath = settings.mdJsonPath;
			} else {
				global.stageWidth = global.hdWidth;
				global.stageHeight = global.hdHeight;
				global.spriteImgPath = settings.hdImgPath;
				global.spriteJsonPath = settings.hdJsonPath;
			}
			global.stageWidth = global.hdWidth;
			global.stageHeight = global.hdHeight;
			global.spriteImgPath = settings.hdImgPath;
			global.spriteJsonPath = settings.hdJsonPath;
			let imagesToLoad = [
				global.fireBtnImage,
				global.joystickImage
			];
			for(let type in settings) {
				if(!!settings[type].properties && !!settings[type].properties.sprites) {
					let imagePath = global.spriteImgPath+type+'.png',
						jsonPath = global.spriteJsonPath+type+'.json',
						spriteMeta = {
							img: imagePath
						};
					imagesToLoad.push(imagePath);
					settings[type].properties.spriteMeta = spriteMeta;
					data(jsonPath, (json)=>{
						spriteMeta.frames = json.frames;
					});
				}
				if(!!settings[type].properties && !!settings[type].properties.sprite) {
					let spriteImagePath = global.spriteImgPath+type+'.png'
					imagesToLoad.push(spriteImagePath);
					settings[type].properties.sprite = spriteImagePath;
				}
			}
			resources.load(imagesToLoad);
		});
	});
	
	resources.onReady(function(){
		ReactDOM.render(<Game/>, document.getElementById('game'));
	});
	

}());
