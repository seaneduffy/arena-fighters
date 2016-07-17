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
_handlePauseGame = null,
_handleRestartGame = null,
_handleResumeGame = null,
	
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
			displayObjects: [],
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
			gameType: false,
			paused: false
		}
	},
	onPlayerNameChange: function(e) {
		this.setState({playerName: e.target.value});
	},
	onGameNameChange: function(e) {
		this.setState({gameName: e.target.value});
	},
	_handleStartSinglePlayerGame: function(e) {
		_handleStartSinglePlayerGame(e);
	},
	_handleStartTwoPlayerGame: function(e) {
		_handleStartTwoPlayerGame(e);
	},
	_handleConfirmPlayerName: function(e) {
		_handleConfirmPlayerName(e);
	},
	_handleCreateGame: function(e) {
		_handleCreateGame(e);
	},
	_handleGameListSelect: function(e) {
		_handleGameListSelect(e);
	},
	_handleJoinGame: function(e) {
		_handleJoinGame(e);
	},
	_handleHostReady: function(e) {
		_handleHostReady(e);
	},
	_handleGuestReady: function(e) {
		_handleGuestReady(e);
	},
	_handlePauseGame: function(e) {
		_handlePauseGame(e);
	},
	_handleEndGame: function(e) {
		_handleEndGame(e);
	},
	_handleRestartGame: function(e) {
		_handleRestartGame(e);
	},
	_handleResumeGame: function(e) {
		_handleResumeGame(e);
	},
	render: function() {
		return (
		
<div id="arena-fighters">
	<div id="menus" className={this.state.gameActive ? 'hidden' : ''}>
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
			<span id="pause-btn" onTouchStart={this._handlePauseGame}></span>
			<div id="menu" className={this.state.paused ? '' : 'hidden'}>
				<div>
					<span onClick={this._handleRestartGame}>Restart Game</span>
					<span onClick={this._handleEndGame}>End Game</span>
					<span onClick={this._handleResumeGame}>Resume</span>
				</div>
			</div>
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
		handleEndGame,
		handlePauseGame,
		handleRestartGame,
		handleResumeGame
	) {
		_handleStartSinglePlayerGame = handleStartSinglePlayerGame;
		_handleStartTwoPlayerGame = handleStartTwoPlayerGame;
		_handleConfirmPlayerName = handleConfirmPlayerName;
		_handleCreateGame = handleCreateGame;
		_handleGameListSelect = handleGameListSelect;
		_handleJoinGame = handleJoinGame;
		_handleHostReady = handleHostReady;
		_handleGuestReady = handleGuestReady;
		_handleEndGame = handleEndGame;
		_handlePauseGame = handlePauseGame;
		_handleRestartGame = handleRestartGame;
		_handleResumeGame = handleResumeGame;
	}
}