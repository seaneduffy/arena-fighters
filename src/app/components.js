'use strict';

let React = require('react'),

_handleStartTwoPlayerGame = null,
_handleConfirmPlayerName = null,
_handleCreateGame = null,
_handleGameListSelect = null,
_handleJoinGame = null,
_handleStartSinglePlayerGame = null,
_handleHostReady = null,
_handleGuestReady = null,
_handleEndGame = null,
	
GamesList = React.createClass({
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
	getInitialState: function() {
		return {
			gameObjects: [],
			playerName: '',
			gameId: '',
			gameName: false,
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
			dev1Player: false,
			gameType: false
		}
	},
	onPlayerNameChange: function(e) {
		this.setState({playerName: e.target.value});
	},
	onGameNameChange: function(e) {
		this.setState({gameName: e.target.value});
	},
	_handleStartSinglePlayerGame: function() {
		_handleStartSinglePlayerGame();
	},
	_handleStartTwoPlayerGame: function() {
		_handleStartTwoPlayerGame();
	},
	_handleConfirmPlayerName: function() {
		_handleConfirmPlayerName();
	},
	_handleCreateGame: function() {
		_handleCreateGame();
	},
	_handleGameListSelect: function() {
		_handleGameListSelect();
	},
	_handleJoinGame: function() {
		_handleJoinGame();
	},
	_handleHostReady: function() {
		_handleHostReady();
	},
	_handleGuestReady: function() {
		_handleGuestReady();
	},
	render: function() {
		return (
		
<div id="arena-fighters" className={this.state.gameActive ? 'minimal-ui' : ''}>
	<div className={this.state.gameActive ? 'hidden' : ''}>
		
		<div className={this.state.gameType ? 'hidden' : 'menuForm'}>
			<button onClick={this._handleStartSinglePlayerGame}>1 Player</button>
			<button onClick={this._handleStartTwoPlayerGame}>2 Players</button>
		</div>
		
		<div className={this.state.gameType === 'two' && !this.state.playerNameSet ? 'menuForm' : 'hidden'}>
			<p>Enter your name</p>
			<input type="text" onChange={this.onPlayerNameChange} />
			<button onClick={this._handleConfirmPlayerName}>Confirm name</button>
		</div>
		<div className={this.state.gameType === 'two' && this.state.playerNameSet && !(this.state.gameCreated || this.state.gameJoined) ? '' : 'hidden'}>
			<div className='menuForm'>
				<p>Create new game</p>
				<label>Name of game</label>
				<input type="text" onChange={this.onGameNameChange} />
				<button onClick={this._handleCreateGame}>Submit</button>
			</div>
			<div className={this.state.games.length > 0 ? 'menuForm' : 'hidden'}>
				<p>Or choose game to join</p>
				<GamesList items={this.state.games} handleClick={this._handleGameListSelect}/>
				<button onClick={this._handleJoinGame}>Join Game</button>
			</div>
		</div>
		<div className={this.state.gameType === 'two' && this.state.gameCreated && !this.state.playerJoined ? 'menuForm' : 'hidden'}>
			<p>Created game. Waiting for partner to join...</p>
		</div>
		<div className={this.state.gameType === 'two' && this.state.gameJoined && !this.state.hostReady ? 'menuForm' : 'hidden'}>
			<p>You have joined {this.state.hostName}&rsquo;s game. Waiting for them to be ready...</p>
		</div>
		<div className={this.state.gameType === 'two' && this.state.playerJoined && !this.state.hostReady ? 'menuForm' : 'hidden'}>
			<p>{this.state.guestName} has joined the game! Press "start" let them know you are ready!</p>
			<button onClick={this._handleHostReady}>Start</button>
		</div>
		<div className={this.state.gameType === 'two' && this.state.gameJoined && this.state.hostReady ? 'menuForm' : 'hidden'}>
			<p>{this.state.hostName} is ready. Press "start"!</p>
			<button onClick={this._handleGuestReady}>Start</button>
		</div>
		<div className={this.state.gameType === 'two' && this.state.hostReady && this.state.playerJoined ? 'menuForm' : 'hidden'}>
			<p>Waiting for {this.state.guestName} to be ready.</p>
		</div>
	</div>
	<div id="gameScreen" className={this.state.gameActive ? '' : 'hidden'}>
		<div id="canvas"></div>
		<div id="controls">
			<span id="joystick" className="center"></span>
			<span id="fire-btn"></span>
			<span id="end-game-btn" onTouchStart={_handleEndGame}></span>
		</div>
	</div>
</div>		
		
	)}
});

module.exports = {
	Game: Game,
	addHandlers: function(
		handleStartSinglePlayerGame,
		handleStartTwoPlayerGame,
		handleConfirmPlayerName, 
		handleCreateGame, 
		handleGameListSelect, 
		handleJoinGame,
		handleHostReady,
		handleGuestReady,
		handleEndGame
	) {
		_handleStartTwoPlayerGame = handleStartTwoPlayerGame;
		_handleConfirmPlayerName = handleConfirmPlayerName;
		_handleCreateGame = handleCreateGame;
		_handleGameListSelect = handleGameListSelect;
		_handleJoinGame = handleJoinGame;
		_handleStartSinglePlayerGame = handleStartSinglePlayerGame;
		_handleHostReady = handleHostReady;
		_handleGuestReady = handleGuestReady;
		_handleEndGame = handleEndGame;
	}
}