(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _handleStartTwoPlayerGame2 = null,
    _handleConfirmPlayerName2 = null,
    _handleCreateGame2 = null,
    _handleGameListSelect2 = null,
    _handleJoinGame2 = null,
    _handleStartSinglePlayerGame2 = null,
    _handleHostReady2 = null,
    _handleGuestReady2 = null,
    _handleEndGame2 = null,
    _handlePauseGame2 = null,
    _handleRestartGame2 = null,
    _handleResumeGame2 = null,
    PlayerHUD = React.createClass({
	displayName: 'PlayerHUD',

	render: function render() {
		var healthElements = new Array(),
		    counter = 1,
		    totalHealth = this.props.totalHealth,
		    health = this.props.health;
		while (counter <= totalHealth) {
			healthElements.push(React.createElement('span', { key: counter, className: counter > health ? 'off' : 'on' }));
			counter++;
		}
		return React.createElement(
			'div',
			null,
			React.createElement(
				'div',
				null,
				React.createElement(
					'div',
					{ className: 'name' },
					this.props.playerName
				),
				React.createElement(
					'div',
					{ className: 'health' },
					healthElements
				),
				React.createElement(
					'div',
					{ className: 'weapon' },
					React.createElement(
						'span',
						null,
						'Weapon'
					),
					React.createElement(
						'span',
						null,
						this.props.weapon
					)
				)
			)
		);
	}
}),
    GamesList = React.createClass({
	displayName: 'GamesList',

	render: function render() {
		var _this = this;

		return React.createElement(
			'ul',
			null,
			this.props.items.map(function (item) {
				return React.createElement(
					'li',
					{ key: item.id },
					React.createElement(
						'button',
						{ 'data-game-id': item.id, 'data-player-name': item.hostName, onClick: _this.props.handleClick },
						item.gameName
					)
				);
			})
		);
	}
}),
    Game = React.createClass({
	displayName: 'Game',

	getInitialState: function getInitialState() {
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
		};
	},
	onPlayerNameChange: function onPlayerNameChange(e) {
		this.setState({ playerName: e.target.value });
	},
	onGameNameChange: function onGameNameChange(e) {
		this.setState({ gameName: e.target.value });
	},
	_handleStartSinglePlayerGame: function _handleStartSinglePlayerGame(e) {
		_handleStartSinglePlayerGame2(e);
	},
	_handleStartTwoPlayerGame: function _handleStartTwoPlayerGame(e) {
		_handleStartTwoPlayerGame2(e);
	},
	_handleConfirmPlayerName: function _handleConfirmPlayerName(e) {
		_handleConfirmPlayerName2(e);
	},
	_handleCreateGame: function _handleCreateGame(e) {
		_handleCreateGame2(e);
	},
	_handleGameListSelect: function _handleGameListSelect(e) {
		_handleGameListSelect2(e);
	},
	_handleJoinGame: function _handleJoinGame(e) {
		_handleJoinGame2(e);
	},
	_handleHostReady: function _handleHostReady(e) {
		_handleHostReady2(e);
	},
	_handleGuestReady: function _handleGuestReady(e) {
		_handleGuestReady2(e);
	},
	_handlePauseGame: function _handlePauseGame(e) {
		_handlePauseGame2(e);
	},
	_handleEndGame: function _handleEndGame(e) {
		_handleEndGame2(e);
	},
	_handleRestartGame: function _handleRestartGame(e) {
		_handleRestartGame2(e);
	},
	_handleResumeGame: function _handleResumeGame(e) {
		_handleResumeGame2(e);
	},
	render: function render() {
		var _this2 = this;

		var playerHud = function playerHud() {
			if (_this2.state.gameType === 'two') {
				return React.createElement(
					'div',
					{ id: 'hud' },
					React.createElement(PlayerHUD, { playerName: 'Player 1',
						health: _this2.state.player1Health, totalHealth: _this2.state.player1HealthTotal,
						weapon: _this2.state.player1Weapon }),
					React.createElement(PlayerHUD, {
						playerName: 'Player 2', health: _this2.state.player2Health,
						totalHealth: _this2.state.player2HealthTotal, weapon: _this2.state.player2Weapon })
				);
			}
			return React.createElement(
				'div',
				{ id: 'hud' },
				React.createElement(PlayerHUD, { playerName: 'Player 1',
					health: _this2.state.player1Health, totalHealth: _this2.state.player1HealthTotal,
					weapon: _this2.state.player1Weapon })
			);
		};
		return React.createElement(
			'div',
			{ id: 'arena-fighters' },
			React.createElement(
				'div',
				{ id: 'menus', className: this.state.gameActive ? 'hidden' : '' },
				React.createElement(
					'div',
					{ className: this.state.gameType ? 'hidden' : 'menuForm' },
					React.createElement(
						'button',
						{ onClick: this._handleStartSinglePlayerGame },
						'1 Player'
					),
					React.createElement(
						'button',
						{ onClick: this._handleStartTwoPlayerGame },
						'2 Players'
					)
				),
				React.createElement(
					'div',
					{ className: this.state.gameType === 'two' && !this.state.playerNameSet ? 'menuForm' : 'hidden' },
					React.createElement(
						'p',
						null,
						'Enter your name'
					),
					React.createElement('input', { type: 'text', onChange: this.onPlayerNameChange }),
					React.createElement(
						'button',
						{ onClick: this._handleConfirmPlayerName },
						'Confirm name'
					)
				),
				React.createElement(
					'div',
					{ className: this.state.gameType === 'two' && this.state.playerNameSet && !(this.state.gameCreated || this.state.gameJoined) ? '' : 'hidden' },
					React.createElement(
						'div',
						{ className: 'menuForm' },
						React.createElement(
							'p',
							null,
							'Create new game'
						),
						React.createElement(
							'label',
							null,
							'Name of game'
						),
						React.createElement('input', { type: 'text', onChange: this.onGameNameChange }),
						React.createElement(
							'button',
							{ onClick: this._handleCreateGame },
							'Submit'
						)
					),
					React.createElement(
						'div',
						{ className: this.state.games.length > 0 ? 'menuForm' : 'hidden' },
						React.createElement(
							'p',
							null,
							'Or choose game to join'
						),
						React.createElement(GamesList, { items: this.state.games, handleClick: this._handleGameListSelect }),
						React.createElement(
							'button',
							{ onClick: this._handleJoinGame },
							'Join Game'
						)
					)
				),
				React.createElement(
					'div',
					{ className: this.state.gameType === 'two' && this.state.gameCreated && !this.state.playerJoined ? 'menuForm' : 'hidden' },
					React.createElement(
						'p',
						null,
						'Created game. Waiting for partner to join...'
					)
				),
				React.createElement(
					'div',
					{ className: this.state.gameType === 'two' && this.state.gameJoined && !this.state.hostReady ? 'menuForm' : 'hidden' },
					React.createElement(
						'p',
						null,
						'You have joined ',
						this.state.hostName,
						'’s game. Waiting for them to be ready...'
					)
				),
				React.createElement(
					'div',
					{ className: this.state.gameType === 'two' && this.state.playerJoined && !this.state.hostReady ? 'menuForm' : 'hidden' },
					React.createElement(
						'p',
						null,
						this.state.guestName,
						' has joined the game! Press "start" let them know you are ready!'
					),
					React.createElement(
						'button',
						{ onClick: this._handleHostReady },
						'Start'
					)
				),
				React.createElement(
					'div',
					{ className: this.state.gameType === 'two' && this.state.gameJoined && this.state.hostReady ? 'menuForm' : 'hidden' },
					React.createElement(
						'p',
						null,
						this.state.hostName,
						' is ready. Press "start"!'
					),
					React.createElement(
						'button',
						{ onClick: this._handleGuestReady },
						'Start'
					)
				),
				React.createElement(
					'div',
					{ className: this.state.gameType === 'two' && this.state.hostReady && this.state.playerJoined ? 'menuForm' : 'hidden' },
					React.createElement(
						'p',
						null,
						'Waiting for ',
						this.state.guestName,
						' to be ready.'
					)
				)
			),
			React.createElement(
				'div',
				{ id: 'gameScreen', className: this.state.gameActive ? '' : 'hidden' },
				React.createElement('div', { id: 'canvas' }),
				playerHud(),
				React.createElement(
					'div',
					{ className: 'levelTitle' },
					React.createElement('span', null)
				),
				React.createElement(
					'div',
					{ id: 'controls' },
					React.createElement(
						'span',
						{ id: 'joystick', className: 'center' },
						React.createElement('span', { className: 'ball' })
					),
					React.createElement('span', { id: 'fire-btn' }),
					React.createElement('span', { id: 'pause-btn', onTouchStart: this._handlePauseGame }),
					React.createElement(
						'div',
						{ id: 'menu', className: this.state.paused ? '' : 'hidden' },
						React.createElement(
							'div',
							null,
							React.createElement(
								'span',
								{ onClick: this._handleRestartGame },
								'Restart Game'
							),
							React.createElement(
								'span',
								{ onClick: this._handleEndGame },
								'End Game'
							),
							React.createElement(
								'span',
								{ onClick: this._handleResumeGame },
								'Resume'
							)
						)
					)
				)
			)
		);
	}
});

module.exports = {
	Game: Game,
	addHandlers: function addHandlers(handleStartSinglePlayerGame, handleStartTwoPlayerGame, handleConfirmPlayerName, handleCreateGame, handleGameListSelect, handleJoinGame, handleHostReady, handleGuestReady, handleEndGame, handlePauseGame, handleRestartGame, handleResumeGame) {
		_handleStartSinglePlayerGame2 = handleStartSinglePlayerGame;
		_handleStartTwoPlayerGame2 = handleStartTwoPlayerGame;
		_handleConfirmPlayerName2 = handleConfirmPlayerName;
		_handleCreateGame2 = handleCreateGame;
		_handleGameListSelect2 = handleGameListSelect;
		_handleJoinGame2 = handleJoinGame;
		_handleHostReady2 = handleHostReady;
		_handleGuestReady2 = handleGuestReady;
		_handleEndGame2 = handleEndGame;
		_handlePauseGame2 = handlePauseGame;
		_handleRestartGame2 = handleRestartGame;
		_handleResumeGame2 = handleResumeGame;
	}
};

},{}],2:[function(require,module,exports){
'use strict';

var config = {
	"jsonUri": "/data.json",
	"pi": Math.PI,
	"UP": 0,
	"LEFT": 3 * Math.PI / 2,
	"RIGHT": Math.PI / 2,
	"DOWN": Math.PI,
	"UP_LEFT": 7 * Math.PI / 4,
	"UP_RIGHT": Math.PI / 4,
	"DOWN_LEFT": 5 * Math.PI / 4,
	"DOWN_RIGHT": 3 * Math.PI / 4,
	"CENTER": -1,
	"dev": true,
	"console": true,
	"dev1": false,
	"dev2": true
};

module.exports = config;

if (config.dev) {
	window.getConfig = function (properties) {
		var value = config;
		if (!!properties) {
			properties = properties.split('.');
			properties.forEach(function (property) {
				value = value[property];
			});
		}
		return value;
	};

	window.setConfig = function (properties, setValue) {
		properties = properties.split('.');
		var value = config,
		    lastValue = config,
		    length = properties.length;
		properties.forEach(function (property, index) {
			if (index === length - 1) value[property] = setValue;else value = value[property];
		});
		return value;
	};
}

},{}],3:[function(require,module,exports){
'use strict';

var config = require('../config'),
    element = null,
    json = null,
    callback = null;

function press() {
	element.className = 'active';
	element.style.backgroundPosition = -json['fire_down'].frame.x + 'px ' + -json['fire_down'].frame.y + 'px';
	callback();
}

function release() {
	element.className = '';
	element.style.backgroundPosition = -json['fire_up'].frame.x + 'px ' + -json['fire_up'].frame.y + 'px';
}

module.exports = {
	init: function init(_element, _json, _callback) {
		element = _element;
		json = _json;
		callback = _callback;
		element.style.background = 'url(' + config.controlsImage + ')';
		element.style.width = json['fire_up'].frame.w + 'px';
		element.style.height = json['fire_up'].frame.h + 'px';
		element.style.backgroundPosition = -json['fire_up'].frame.x + 'px ' + -json['fire_up'].frame.y + 'px';
		element.addEventListener('touchstart', press, false);
		element.addEventListener('touchend', release, false);
	}
};

},{"../config":2}],4:[function(require,module,exports){
'use strict';

var config = require('../config'),
    cycle = require('../cycle'),
    joystickCallback = null,
    fireCallback = null,
    joystick = require('./joystick'),
    fireBtn = require('./fire'),
    controlsJson = config.controls,
    joystickAngle = 0,
    joystickAmount = 0,
    joystickFrameRate = config.joystickFrameRate;

document.querySelector('#controls').addEventListener('touchmove', function (e) {
	e.preventDefault();
});

joystick.init(document.getElementById('joystick'), config.joystickMax, config.joystickMin, controlsJson, function (angle, amount) {
	joystickAngle = angle;
	joystickAmount = amount;
});

cycle.addUpdate(joystickFrame, joystickFrameRate);

fireBtn.init(document.getElementById('fire-btn'), controlsJson, function () {
	fireCallback();
});

function joystickFrame() {
	joystickCallback(joystickAngle, joystickAmount);
}

document.addEventListener('keydown', function (e) {
	if (e.keyCode === 32) {
		if (!!fireCallback) fireCallback();
	}
}, false);

module.exports = function (_joystickCallback, _fireCallback) {
	joystickCallback = _joystickCallback;
	fireCallback = _fireCallback;
};

},{"../config":2,"../cycle":6,"./fire":3,"./joystick":5}],5:[function(require,module,exports){
'use strict';

var config = require('../config'),
    geom = require('../../utils/geom'),
    element = null,
    callback = null,
    isTouch = checkTouch(),
    centerX = null,
    centerY = null,
    touchX = null,
    touchY = null,
    deltaX = null,
    deltaY = null,
    sensitivity = null,
    maxDistance = null,
    ball = null,
    directions = Object.create(null),
    json = null,
    xobj = new XMLHttpRequest();

function checkTouch() {
	try {
		document.createEvent("TouchEvent");
		return true;
	} catch (e) {
		return false;
	}
}

function _init() {
	if (isTouch) {
		element.addEventListener('touchstart', startTouch, false);
		element.addEventListener('touchmove', touchMove, false);
		element.addEventListener('touchend', endTouch, false);
	} else {
		element.addEventListener('mousedown', onPress, false);
		element.addEventListener('mouseup', onRelease, false);
	}
	element.style.background = 'url(' + config.controlsImage + ')';
	var imageInfo = json['bg'].frame;
	element.style.width = imageInfo.w + 'px';
	element.style.height = imageInfo.h + 'px';
	element.style.backgroundPosition = -imageInfo.x + 'px ' + -imageInfo.y + 'px';
	imageInfo = json['ball'].frame;
	ball.style.width = imageInfo.w + 'px';
	ball.style.height = imageInfo.h + 'px';
	ball.style.background = 'url(' + config.controlsImage + ')';
	ball.style.backgroundPosition = -imageInfo.x + 'px ' + -imageInfo.y + 'px';
}

function startTouch(e) {
	e.preventDefault();
	centerX = e.touches[0].pageX;
	centerY = e.touches[0].pageY;
	element.className = 'active';
}

function touchMove(e) {
	touchX = e.touches[0].pageX;
	touchY = e.touches[0].pageY;
	deltaX = touchX - centerX;
	deltaY = touchY - centerY;
	var amount = geom.getDistance(centerX, centerY, touchX, touchY),
	    angle = geom.getAngle(centerX, centerY, touchX, touchY),
	    per = 0;
	if (amount > maxDistance) amount = maxDistance;
	if (Math.abs(deltaX) > sensitivity || Math.abs(deltaY) > sensitivity) {
		var _per = amount / maxDistance;
		callback(angle, _per);
	} else {
		callback(angle, per);
	}
	var ballXY = geom.getXYFromVector(0, 0, angle, amount);
	ball.style.transform = 'translate(' + (ballXY.x - 50) + '%,' + (ballXY.y - 50) + '%)';
}

function endTouch(e) {
	callback(-1, 0);
	element.className = '';
	ball.style.transform = 'translate(-50%, -50%)';
}

function onPress(e) {
	centerX = e.pageX;
	centerY = e.pageY;
	element.addEventListener('mousemove', pressMove, false);
}

function pressMove(e) {
	var x = e.pageX,
	    y = e.pageY,
	    deltaX = x - centerX,
	    deltaY = y - centerY;
	var amount = geom.getDistance(centerX, centerY, touchX, touchY),
	    angle = geom.getAngle(centerX, centerY, touchX, touchY),
	    per = 0;
	if (amount > maxDistance) amount = maxDistance;
	if (Math.abs(deltaX) > sensitivity || Math.abs(deltaY) > sensitivity) {
		var _per2 = amount / maxDistance;
		callback(angle, _per2);
	} else {
		callback(angle, per);
	}
	var ballXY = geom.getXYFromVector(0, 0, angle, amount);
	ball.style.transform = 'translate(' + (ballXY.x - 50) + '%,' + (ballXY.y - 50) + '%)';
}

function onRelease(e) {
	callback(-1, 0);
	element.className = '';
	ball.style.transform = 'translate(-50%, -50%)';
}

module.exports = {
	init: function init(_element, _maxDistance, _sensitivity, _json, _callback) {
		element = _element;
		ball = element.querySelector('.ball');
		maxDistance = _maxDistance;
		sensitivity = _sensitivity;
		json = _json;
		callback = _callback;
		_init();
	}
};

},{"../../utils/geom":22,"../config":2}],6:[function(require,module,exports){
'use strict';

var config = require('./config'),
    updateFunctions = new Array(),
    serverFunctions = new Array(),
    cleanupFunctions = new Array(),
    updateToRemove = new Array(),
    serverToRemove = new Array(),
    cleanupToRemove = new Array(),
    waitFunctions = new Array(),
    waitToRemove = new Array(),
    arr = null,
    active = false,
    frameRate = 1,
    startTime = 0;

function cycle() {
	if (active) {

		window.requestAnimationFrame(cycle);

		var time = Date.now(),
		    elapsedTime = time - startTime;

		if (elapsedTime >= frameRate) {

			startTime = time;

			updateFunctions.forEach(function (funcObj) {
				if (funcObj.elapsedTime >= funcObj.rate) {
					funcObj.func();
					funcObj.elapsedTime = 0;
				} else {
					funcObj.elapsedTime += frameRate;
				}
			});

			serverFunctions.forEach(function (func) {
				func();
			});

			cleanupFunctions.forEach(function (func) {
				func();
			});

			waitFunctions.forEach(function (funcObj) {
				if (funcObj.elapsedTime >= funcObj.endTime) {
					funcObj.func();
					waitToRemove.push(funcObj.func);
				} else {
					funcObj.elapsedTime += frameRate;
				}
			});

			if (updateToRemove.length > 0) {
				arr = new Array();
				updateFunctions.forEach(function (funcObj) {
					if (typeof updateToRemove.find(function (removeFunc) {
						return funcObj.func === removeFunc;
					}) === 'undefined') {
						arr.push(funcObj);
					}
				});
				updateFunctions = arr;
				updateToRemove = new Array();
			}

			if (serverToRemove.length > 0) {
				arr = new Array();
				serverFunctions.forEach(function (func) {
					if (typeof serverToRemove.find(function (removeFunc) {
						return func === removeFunc;
					}) === 'undefined') {
						arr.push(func);
					}
				});
				serverFunctions = arr;
				serverToRemove = new Array();
			}

			if (cleanupToRemove.length > 0) {
				arr = new Array();
				cleanupFunctions.forEach(function (func) {
					if (typeof cleanupToRemove.find(function (removeFunc) {
						return func === removeFunc;
					}) === 'undefined') {
						arr.push(func);
					}
				});
				cleanupFunctions = arr;
				cleanupToRemove = new Array();
			}

			if (waitToRemove.length > 0) {
				arr = new Array();
				waitFunctions.forEach(function (funcObj) {
					if (typeof waitToRemove.find(function (removeFunc) {
						return funcObj.func === removeFunc;
					}) === 'undefined') {
						arr.push(funcObj);
					}
				});
				waitFunctions = arr;
				waitToRemove = new Array();
			}
		}
	}
}

module.exports = {
	start: function start() {
		startTime = Date.now();
		active = true;
		window.requestAnimationFrame(cycle);
	},
	stop: function stop() {
		active = false;
	},
	addUpdate: function addUpdate(func, rate) {
		updateFunctions.push({
			func: func,
			elapsedTime: 0,
			rate: rate || frameRate
		});
	},
	removeUpdate: function removeUpdate(func) {
		updateToRemove.push(func);
	},
	addServer: function addServer(func) {
		serverFunctions.push(func);
	},
	removeServer: function removeServer(func) {
		serverToRemove.push(func);
	},
	addCleanup: function addCleanup(func) {
		cleanupFunctions.push(func);
	},
	removeCleanup: function removeCleanup(func) {
		cleanupToRemove.push(func);
	},
	setFrameRate: function setFrameRate(rate) {
		frameRate = rate;
	},
	wait: function wait(func, endTime, log) {
		waitFunctions.push({ func: func, elapsedTime: 0, endTime: endTime, log: log || false });
	},
	endWait: function endWait(func) {
		var arr = new Array();
		waitFunctions.forEach(function (funcObj) {
			if (funcObj.func !== func) {
				arr.push(funcObj);
			}
		});
		waitFunctions = arr;
	}
};

if (config.dev) {
	window.getCycleUpdateTotal = function () {
		return updateFunctions.length;
	};
	window.getCycleServerTotal = function () {
		return serverFunctions.length;
	};
	window.getCycleCleanupTotal = function () {
		return cleanupFunctions.length;
	};
}

},{"./config":2}],7:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var config = require('./config'),
    cycle = require('./cycle'),
    Grunt = require('./displayObject/enemies/grunt'),
    Devil = require('./displayObject/enemies/devil'),
    Robot = require('./displayObject/enemies/robot'),
    Player = require('./displayObject/player'),
    Firearm = require('./displayObject/firearm'),
    Ammunition = require('./displayObject/ammunition'),
    DisplayObject = require('./displayObject/displayObject'),
    callback = null;

function processData(json) {
	var settings = json.settings,
	    scalar = settings.scalar,
	    stageWidth = config.stageWidth = processValue(settings.stageWidth),
	    stageHeight = config.stageHeight = processValue(settings.stageHeight),
	    windowInnerWidth = window.innerWidth,
	    windowInnerHeight = window.innerHeight,
	    resAppend = '',
	    resWidth = 0,
	    resHeight = 0,
	    resValues = config.resValues = ',' + settings.resValues.join(',') + ',',
	    distanceValues = config.distanceValues = ',' + settings.distanceValues.join(',') + ',',
	    scalars = config.scalars = settings.scalars,
	    wallPadding = 0,
	    resolutions = settings.resolutions,
	    spriteImgPath = '/img/sprites/',
	    resolutionScale = 1,
	    distanceScale = 1,
	    windowWidth = config.windowWidth = windowInnerWidth > windowInnerHeight ? windowInnerWidth : windowInnerHeight,
	    windowHeight = config.windowHeight = windowInnerWidth < windowInnerHeight ? windowInnerWidth : windowInnerHeight,
	    displayObjects = config.displayObjects = settings.displayObjects,
	    levels = config.levels = json.levels,
	    stageCenterX = 0,
	    stageCenterY = 0,
	    imagesToLoad = config.imagesToLoad = new Array(),
	    property = '',
	    type = '',
	    sprite = '',
	    frames = null,
	    image = '';

	config.frameRate = 1000 / settings.frameRate;
	cycle.setFrameRate(config.frameRate);

	for (var resolution in resolutions) {

		resWidth = processValue(resolutions[resolution].width), resHeight = processValue(resolutions[resolution].height);
		if (resWidth > windowWidth && resHeight > windowHeight) {
			resAppend = '-' + resolution;
			break;
		}
	}

	stageCenterX = config.stageCenterX = stageWidth / 2;
	stageCenterY = config.stageCenterY = stageHeight / 2;

	resolutionScale = config.resolutionScale = windowHeight / resHeight;
	distanceScale = config.distanceScale = windowHeight / stageHeight;

	config.domElement.style.width = resWidth * resolutionScale + 'px';
	config.domElement.style.height = resHeight * resolutionScale + 'px';

	config.joystickFrameRate = processValue(settings.joystickFrameRate);
	config.controls = json['controls' + resAppend];
	config.controlsImage = spriteImgPath + 'controls' + resAppend + '.png';
	imagesToLoad.push(config.controlsImage);
	config.joystickMin = settings.joystickMin * distanceScale;
	config.joystickMax = settings.joystickMax * distanceScale;

	wallPadding = processValue(settings.wallPadding);
	config.topWall = {
		x: 0,
		y: 0,
		width: stageWidth,
		height: wallPadding
	};
	config.leftWall = {
		x: 0,
		y: 0,
		width: wallPadding,
		height: stageHeight
	};
	config.rightWall = {
		x: stageWidth - wallPadding,
		y: 0,
		width: wallPadding,
		height: stageHeight
	};
	config.bottomWall = {
		x: 0,
		y: stageHeight - wallPadding,
		width: stageWidth,
		height: wallPadding
	};

	levels.forEach(function (level) {
		level.forEach(function (levelData) {
			if (!!levelData.properties) {
				processConfig(levelData.properties);
				for (property in levelData.properties) {
					levelData.properties[property] = processValue(levelData.properties[property]);
				}
			}
		});
	});

	processConfig(displayObjects);

	for (type in displayObjects) {
		displayObjects[type].forEach(function (displayObjectData) {
			if (type === 'enemy') {
				if (displayObjectData.id === 'devil') displayObjectData.class = Devil;
				if (displayObjectData.id === 'grunt') displayObjectData.class = Grunt;
				if (displayObjectData.id === 'robot') displayObjectData.class = Robot;
			} else if (type === 'player') displayObjectData.class = Player;else if (type === 'ammunition') displayObjectData.class = Ammunition;else if (type === 'firearm') displayObjectData.class = Firearm;else if (type === 'displayObject') displayObjectData.class = DisplayObject;
			if (!!displayObjectData.spriteData) {
				imagesToLoad.push(spriteImgPath + displayObjectData.id + resAppend + '.png');
				frames = {};
				for (sprite in json[displayObjectData.id + resAppend]) {
					frames[sprite] = json[displayObjectData.id + resAppend][sprite];
				}
				displayObjectData.spriteMeta = {
					img: spriteImgPath + displayObjectData.id + resAppend + '.png',
					frames: frames
				};
			}
			if (!!displayObjectData.image) {
				displayObjectData.image = spriteImgPath + displayObjectData.image + resAppend + '.png';
				imagesToLoad.push(displayObjectData.image);
			}
			config.displayObjects[displayObjectData.id] = displayObjectData;
		});
		delete displayObjects[type];
	}
	callback();
}

function processValue(value) {

	if (typeof value === 'string' && value.match(/config\./)) {

		if (value.match(/[0-9]+/)) {
			(function () {
				var operator = '',
				    values = value;
				value = 0;
				values.match(/[\+|\/|-|\*|config\.|a-z|A-Z|0-9]+/g).forEach(function (tmp) {
					if (tmp.match(/[\+|-|\/|\*]/)) operator = tmp;else {
						if (tmp.match(/config\.[a-z|A-Z|0-9]/)) tmp = config[tmp.replace(/config\./, '')];else tmp *= 1;
						if (operator === '+') value += tmp;else if (operator === '-') value -= tmp;else if (operator === '*') value *= tmp;else if (operator === '/') value /= tmp;else value = tmp;
					}
				});
			})();
		} else {
			value = config[value.replace(/config\./, '')];
		}
	} else if (typeof value === 'string' && value.match(/[0-9]+/) && value.match(/^((?![a-z|A-Z]).)*$/)) {
		value *= 1;
	}
	return value;
}

function processConfig(obj) {
	if (typeof obj === 'array') {
		obj.forEach(function (value, index) {
			if (typeof value === 'number' || typeof value === 'string') {
				obj[index] = processValue(value);
			} else {
				processConfig(value);
			}
		});
	} else if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
		var property = null,
		    value = null;
		for (property in obj) {
			value = obj[property];
			if (property === 'hostiles') {
				obj[property] = new String(',').concat(value.join(',')).concat(',');
			} else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
				processConfig(value);
			} else {
				value = processValue(value);
				if (!!config.scalars[property]) value *= config.scalars[property];
				obj[property] = value;
			}
		}
	}
}

function loadData(uri) {
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', uri, true);
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			processData(JSON.parse(xobj.responseText));
		}
	};
	xobj.send(null);
}

module.exports = {
	load: function load(callbackFunction) {
		callback = callbackFunction;
		loadData(config.jsonUri);
	}
};

},{"./config":2,"./cycle":6,"./displayObject/ammunition":8,"./displayObject/displayObject":10,"./displayObject/enemies/devil":11,"./displayObject/enemies/grunt":13,"./displayObject/enemies/robot":14,"./displayObject/firearm":15,"./displayObject/player":16}],8:[function(require,module,exports){
'use strict';

var Projectile = require('./projectile');

function Ammunition() {
	Projectile.call(this);
}

Ammunition.prototype = Object.create(Projectile.prototype, {
	'impact': {
		set: function set(impact) {
			this._impact = impact;
		},
		get: function get() {
			return this._impact;
		}
	},
	'onCollision': {
		value: function value(collidedObject) {

			if (!!collidedObject.health) {
				collidedObject.health -= this.impact;
			}
			Projectile.prototype.onCollision.call(this, collidedObject);
		}
	}
});

module.exports = Ammunition;

},{"./projectile":17}],9:[function(require,module,exports){
'use strict';

var config = require('../config'),
    DisplayObject = require('./displayObject'),
    Firearm = require('./firearm'),
    cycle = require('../cycle');

function Character() {
	DisplayObject.prototype.constructor.call(this);
}

Character.prototype = Object.create(DisplayObject.prototype, {
	'dead': {
		set: function set(dead) {
			this._dead = dead;
			if (dead) {
				this.destroy();
			}
		},
		get: function get() {
			if (typeof this._dead === 'undefined') return this._dead = false;
			return this._dead;
		}
	},
	'destroy': {
		value: function value() {
			if (!!this.firearm) this.firearm.destroy();
			DisplayObject.prototype.destroy.call(this);
		}
	},
	'health': {
		set: function set(health) {
			this._health = health;
			if (health <= 0) this.dead = true;
		},
		get: function get() {
			return this._health;
		}
	},
	'onCollision': {
		value: onCollision
	},
	'melee': {
		set: function set(melee) {
			this._melee = melee;
		},
		get: function get() {
			return this._melee;
		}
	},
	'firearmType': {
		set: function set(firearmType) {
			this._firearmType = firearmType;
			if (!!this._directionLabel) this.initFirearm();
		},
		get: function get() {
			return this._firearmType;
		}
	},
	'directionLabel': {
		set: function set(directionLabel) {
			Object.getOwnPropertyDescriptor(DisplayObject.prototype, 'directionLabel').set.call(this, directionLabel);
			if (!!this._firearmType && !this.firearm) this.initFirearm();
		},
		get: function get() {
			return Object.getOwnPropertyDescriptor(DisplayObject.prototype, 'directionLabel').get.call(this);
		}
	},
	'initFirearm': {
		value: initFirearm
	},
	'updateFirearmDisplay': {
		value: updateFirearmDisplay
	},
	'x': {
		set: function set(x) {
			Object.getOwnPropertyDescriptor(DisplayObject.prototype, 'x').set.call(this, x);
		},
		get: function get() {
			return Object.getOwnPropertyDescriptor(DisplayObject.prototype, 'x').get.call(this);
		}
	},
	'y': {
		set: function set(y) {
			Object.getOwnPropertyDescriptor(DisplayObject.prototype, 'y').set.call(this, y);
		},
		get: function get() {
			return Object.getOwnPropertyDescriptor(DisplayObject.prototype, 'y').get.call(this);
		}
	},
	'direction': {
		set: function set(angle) {
			Object.getOwnPropertyDescriptor(DisplayObject.prototype, 'direction').set.call(this, angle);
		},
		get: function get() {
			return Object.getOwnPropertyDescriptor(DisplayObject.prototype, 'direction').get.call(this);
		}
	},
	'move': {
		value: function value() {
			DisplayObject.prototype.move.call(this);
			if (!!this.firearm) this.updateFirearmDisplay();
		}
	}
});

function initFirearm() {
	this.firearm = new Firearm();
	var firearmData = config.displayObjects[this.firearmType],
	    property = null;
	for (property in firearmData) {
		this.firearm[property] = firearmData[property];
	}
	this.firearm.x = this.x;
	this.firearm.y = this.y;
	this.updateFirearmDisplay();
	this.firearm.stage = true;
}

function updateFirearmDisplay() {
	var _this = this;

	var z = null,
	    directionLabel = this.directionLabel,
	    display = this.firearm.display || '$up_off';
	if (directionLabel === config.UP || directionLabel === config.UP_LEFT || directionLabel === config.UP_RIGHT) z = this.z - 1;else z = this.z + 1;
	if (directionLabel === config.UP) {
		display = display.replace(/\$.+_/, '$up_');
	} else if (directionLabel === config.DOWN) {
		display = display.replace(/\$.+_/, '$down_');
	} else if (directionLabel === config.LEFT) {
		display = display.replace(/\$.+_/, '$left_');
	} else if (directionLabel === config.RIGHT) {
		display = display.replace(/\$.+_/, '$right_');
	} else if (directionLabel === config.UP_LEFT) {
		display = display.replace(/\$.+_/, '$upleft_');
	} else if (directionLabel === config.UP_RIGHT) {
		display = display.replace(/\$.+_/, '$upright_');
	} else if (directionLabel === config.DOWN_LEFT) {
		display = display.replace(/\$.+_/, '$downleft_');
	} else if (directionLabel === config.DOWN_RIGHT) {
		display = display.replace(/\$.+_/, '$downright_');
	}
	this.firearm.display = display;
	if (z !== this.firearm.z) {
		this.firearm.stage = false;
		this.firearm.z = z;
		this.firearm.stage = true;
	}
	var spriteDatum = this.spriteData.find(function (sd) {
		return sd.label === _this.display;
	});
	this.firearm.x = spriteDatum.firearmOffset.x + this.x;
	this.firearm.y = spriteDatum.firearmOffset.y + this.y;
}

function onCollision(collidedObject) {
	if (collidedObject !== 'wall' && !!this.melee && this.hostiles.match(new RegExp(collidedObject.id))) {

		this.melee(collidedObject);
	}
}

module.exports = Character;

},{"../config":2,"../cycle":6,"./displayObject":10,"./firearm":15}],10:[function(require,module,exports){
'use strict';

var Sprite = require('./sprite'),
    config = require('../config'),
    geom = require('../../utils/geom'),
    cycle = require('../cycle'),
    displayObjects = [];

function DisplayObject() {
	displayObjects.push(this);
}

DisplayObject.cleanup = cleanup;
DisplayObject.clear = clear;

Object.defineProperties(DisplayObject.prototype, {
	'cycleMove': {
		get: function get() {
			if (typeof this._cycleMove === 'undefined') return this._cycleMove = this.move.bind(this);
			return this._cycleMove;
		}
	},
	'move': {
		value: move
	},
	'getEdgePointFromDirection': {
		value: getEdgePointFromDirection
	},
	'destroy': {
		value: function value() {
			if (!this.destroyed) {
				var sprites = this.sprites;
				for (var label in sprites) {
					sprites[label].destroy();
				}
				this.stage = false;
				this.destroyed = true;
			}
		}
	},
	'ignoreObjectList': {
		get: function get() {
			if (!!this._ignoreObjectList) return this._ignoreObjectList;
			return this._ignoreObjectList = new Array();
		}
	},
	'destroyed': {
		get: function get() {
			if (typeof this._destroyed === 'undefined') return this._destroyed = false;else return this._destroyed;
		},
		set: function set(destroyed) {
			this._destroyed = destroyed;
		}
	},
	'interacts': {
		get: function get() {
			if (typeof this._interacts === 'undefined') return this._interacts = false;
			return this._interacts;
		},
		set: function set(interacts) {
			this._interacts = interacts;
		}
	},
	'stage': {
		get: function get() {
			if (typeof this._stage === 'undefined') return this._stage = false;
			return this._stage;
		},
		set: function set(stage) {
			var sprites = this.sprites,
			    sprite = sprites[this.display];

			if (stage && !this.stage) {
				this._stage = stage;
				if (!!sprite) {
					sprite.stage = true;
				}
				cycle.addUpdate(this.cycleMove);
			} else if (!stage && this.stage) {
				this._stage = false;
				if (!!sprite) sprite.stage = false;
				cycle.removeUpdate(this.cycleMove);
			}
		}
	},
	'direction': {
		set: function set(angle) {
			if (angle < 0 || angle === this._direction) return;
			this._direction = angle;
			var pi = Math.PI;
			if (angle <= pi / 8 || angle > 15 * pi / 8) this.directionLabel = config.UP;else if (angle <= 3 * pi / 8) this.directionLabel = config.UP_RIGHT;else if (angle <= 5 * pi / 8) this.directionLabel = config.RIGHT;else if (angle <= 7 * pi / 8) this.directionLabel = config.DOWN_RIGHT;else if (angle <= 9 * pi / 8) this.directionLabel = config.DOWN;else if (angle <= 11 * pi / 8) this.directionLabel = config.DOWN_LEFT;else if (angle <= 13 * pi / 8) this.directionLabel = config.LEFT;else if (angle <= 15 * pi / 8) this.directionLabel = config.UP_LEFT;
		},
		get: function get() {
			return this._direction;
		}
	},
	'directionLabel': {
		set: function set(label) {
			this._directionLabel = label;
		},
		get: function get() {
			return this._directionLabel;
		}
	},
	'speed': {
		set: function set(speed) {
			this._speed = speed;
		},
		get: function get() {
			return this._speed;
		}
	},
	'image': {
		set: function set(src) {
			var sprite = Sprite.getSprite(this.id + '-default', src, null, false, false);
			sprite.x = this.x;
			sprite.y = this.y;
			sprite.z = this.z;
			this.sprites.default = sprite;
		}
	},
	'sprites': {
		get: function get() {
			if (typeof this._sprites === 'undefined') return this._sprites = Object.create(null);
			return this._sprites;
		}
	},
	'spriteData': {
		set: function set(spriteData) {
			this._spriteData = spriteData;
			if (!!this.spriteMeta) this.initSprites();
		},
		get: function get() {
			return this._spriteData;
		}
	},
	'spriteMeta': {
		set: function set(spriteMeta) {
			this._spriteMeta = spriteMeta;
			if (!!this.spriteData) this.initSprites();
		},
		get: function get() {
			return this._spriteMeta;
		}
	},
	'x': {
		set: function set(x) {
			this._x = x;
			var sprites = this.sprites;
			for (var label in sprites) {
				sprites[label].x = x;
			}
		},
		get: function get() {
			if (!!this._x) return this._x;
			return this._x = 0;
		}
	},
	'y': {
		set: function set(y) {
			this._y = y;
			var sprites = this.sprites;
			for (var label in sprites) {
				sprites[label].y = y;
			}
		},
		get: function get() {
			if (!!this._y) return this._y;
			return this._y = 0;
		}
	},
	'z': {
		set: function set(z) {
			this._z = z;
			var sprites = this.sprites;
			for (var label in sprites) {
				sprites[label].z = z;
			}
		},
		get: function get() {
			if (!!this._z) return this._z;
			return this._z = 10;
		}
	},
	'display': {
		set: function set(display) {
			if (this._display !== display) {
				var sprites = this.sprites,
				    sprite = sprites[this._display];
				if (!!sprite) sprite.stage = false;
				this._display = display;
				sprite = sprites[display];
				if (this.stage && !!sprite) {
					sprite.stage = true;
				}
			}
		},
		get: function get() {
			return this._display;
		}
	},
	'boundingBox': {
		get: function get() {
			if (!!this.hitbox && !!this.x && !!this.y) {
				return {
					x: this.x + this.hitbox.x - this.hitbox.width / 2,
					y: this.y + this.hitbox.y - this.hitbox.height / 2,
					width: this.hitbox.width,
					height: this.hitbox.height
				};
			}
			var sprite = this.sprites[this.display];
			return {
				x: this.x - sprite.width / 2,
				y: this.y - sprite.height / 2,
				width: sprite.width,
				height: sprite.height
			};
		}
	},
	'checkCollision': {
		value: checkCollision
	},
	'initSprites': {
		value: initSprites
	},
	'ignoreObject': {
		value: ignoreObject
	},
	'velocity': {
		get: function get() {
			return this._velocity || {
				direction: 0,
				speed: 0,
				dX: 0,
				dY: 0
			};
		},
		set: function set(velocity) {
			this._velocity = processVelocity(velocity);
		}
	},
	'applyForce': {
		value: applyForce
	},
	'processVelocity': {
		value: processVelocity
	}
});

function processVelocity(velocity) {
	if (typeof velocity.dX !== 'undefined' && typeof velocity.dY != 'undefined' && (typeof velocity.direction === 'undefined' || typeof velocity.speed === 'undefined')) {
		velocity.direction = geom.getAngle(0, 0, velocity.dX, velocity.dY);
		velocity.speed = geom.getDistance(0, 0, velocity.dX, velocity.dY);
	} else if ((typeof velocity.dX === 'undefined' || typeof velocity.dY === 'undefined') && typeof velocity.direction !== 'undefined' && typeof velocity.speed !== 'undefined') {
		var tmp = geom.getXYFromVector(0, 0, velocity.direction, velocity.speed);
		velocity.dX = tmp.x;
		velocity.dY = tmp.y;
	}
	return velocity;
}

function applyForce(velocity) {
	var v1 = processVelocity(this.velocity),
	    v2 = processVelocity(velocity);
	/*dX = v1.dX * v2.dX > 0 
 	? (Math.abs(v1.dX) >= Math.abs(v2.dX) ? v1.dX : v2.dX) 
 	: v1.dX + v2.dX,
 dY = v1.dY * v2.dY > 0 
 ? (Math.abs(v1.dY) >= Math.abs(v2.dY) ? v1.dY : v2.dY) 
 : v1.dY + v2.dY;*/

	this.velocity = {
		dX: v1.dX + v2.dX,
		dY: v1.dY + v2.dY
	};
}

function onCollision(displayObject, x, y, newX, newY, collidedObject) {
	displayObject.velocity = {
		dX: newX - x,
		dY: newY - y
	};
	if (!!displayObject.onCollision) displayObject.onCollision(collidedObject);
}

function move() {
	var _this = this;

	if (!this._stage || this.static || !this.boundingBox || this.velocity.dX === 0 && this.velocity.dY === 0) return;
	if (!this._interacts) {
		this.x += this.velocity.dX;
		this.y += this.velocity.dY;
		return;
	}

	var boundingBox = this.boundingBox,
	    collisionCheck = false;
	if (this.velocity.dX > 0 && !!(collisionCheck = checkCollision(boundingBox, config.rightWall, this.velocity.dX, this.velocity.dY))) onCollision(this, boundingBox.x, boundingBox.y, collisionCheck.x, collisionCheck.y, 'wall');
	if (this.velocity.dX < 0 && !!(collisionCheck = checkCollision(boundingBox, config.leftWall, this.velocity.dX, this.velocity.dY))) onCollision(this, boundingBox.x, boundingBox.y, collisionCheck.x, collisionCheck.y, 'wall');
	if (this.velocity.dY > 0 && !!(collisionCheck = checkCollision(boundingBox, config.bottomWall, this.velocity.dX, this.velocity.dY))) onCollision(this, boundingBox.x, boundingBox.y, collisionCheck.x, collisionCheck.y, 'wall');
	if (this.velocity.dY < 0 && !!(collisionCheck = checkCollision(boundingBox, config.topWall, this.velocity.dX, this.velocity.dY))) {
		onCollision(this, boundingBox.x, boundingBox.y, collisionCheck.x, collisionCheck.y, 'wall');
	}

	displayObjects.forEach(function (objectToCheck) {
		var doesNotInteractWith = false;
		if (!!_this.noInteraction) {
			doesNotInteractWith = typeof _this.noInteraction.find(function (id) {
				return id === objectToCheck.id;
			}) !== 'undefined';
		}

		if (typeof _this.ignoreObjectList.find(function (ignoredObject) {
			return ignoredObject === objectToCheck;
		}) === 'undefined' && !doesNotInteractWith && objectToCheck !== _this && objectToCheck.stage && objectToCheck.interacts) {
			if (!!(collisionCheck = checkCollision(boundingBox, objectToCheck.boundingBox, _this.velocity.dX, _this.velocity.dY))) onCollision(_this, boundingBox.x, boundingBox.y, collisionCheck.x, collisionCheck.y, objectToCheck);
		}
	});

	if (this.velocity.dX !== 0) this.x += this.velocity.dX;
	if (this.velocity.dY !== 0) this.y += this.velocity.dY;

	this.z = Math.floor(this.boundingBox.y + this.boundingBox.height);
}

function checkCollision(boundingBox, objectToCheckBoundingBox, dx, dy) {
	var x = -1,
	    y = -1;
	if (!!objectToCheckBoundingBox && !!boundingBox) {
		var x1a = boundingBox.x,
		    x1b = boundingBox.x + boundingBox.width,
		    x2a = objectToCheckBoundingBox.x,
		    x2b = objectToCheckBoundingBox.x + objectToCheckBoundingBox.width,
		    y1a = boundingBox.y,
		    y1b = boundingBox.y + boundingBox.height,
		    y2a = objectToCheckBoundingBox.y,
		    y2b = objectToCheckBoundingBox.y + objectToCheckBoundingBox.height,
		    dx1a = x1a + dx,
		    dx1b = x1b + dx,
		    dy1a = y1a + dy,
		    dy1b = y1b + dy,
		    collision = (dx1a < x2a && dx1b > x2a || dx1a < x2b && dx1b > x2a) && (dy1a < y2a && dy1b > y2a || dy1a < y2b && dy1b > y2a);
		if (!collision) return false;

		var xPrevWithin = x1a < x2a && x1b > x2a || x1a < x2b && x1b > x2a,
		    yPrevWithin = y1a < y2a && y1b > y2a || y1a < y2b && y1b > y2a,
		    xMovingInLeft = dx < 0 && x1a > x2b && x1a + dx < x2b,
		    xMovingInRight = dx > 0 && x1b < x2a && x1b + dx > x2a,
		    yMovingInUp = dy < 0 && y1a > y2b && y1a + dy < y2b,
		    yMovingInDown = dy > 0 && y1b < y2a && y1b + dy > y2a;

		if (xMovingInLeft && yPrevWithin) {
			x = x1a;
			y = dy1a;
		} else if (xMovingInRight && yPrevWithin) {
			x = x1a;
			y = dy1a;
		} else if (xPrevWithin && yMovingInDown) {
			x = dx1a;
			y = y1a;
		} else if (xPrevWithin && yMovingInUp) {
			x = dx1a;
			y = y1a;
		} else {
			x = x1a;
			y = y1a;
		}
		return { x: x, y: y };
	}
	return false;
}

function getEdgePointFromDirection(direction) {
	var boundingBox = this.boundingBox,
	    delta = geom.getVectorFromXYAngle(boundingBox.width / 2, boundingBox.height / 2, direction);
	return {
		x: this.x + delta.x,
		y: this.y + delta.y
	};
}

function cleanup() {
	var tmp = new Array();
	displayObjects.forEach(function (displayObject) {
		if (!displayObject.destroyed) tmp.push(displayObject);
	});
	displayObjects = tmp;
}

function clear() {
	displayObjects.forEach(function (displayObject) {
		displayObject.destroy();
	});
}

function initSprites() {
	var _this2 = this;

	var frames = this.spriteMeta.frames,
	    spriteSheetPath = this.spriteMeta.img,
	    sprite = null,
	    sprites = this.sprites;
	this.spriteData.forEach(function (data) {
		var frameData = new Array(),
		    spriteLabel = data.label;
		for (var key in frames) {
			if (key.match(new RegExp(spriteLabel.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')))) {
				frameData.push(frames[key]);
			}
		}
		sprite = Sprite.getSprite(_this2.id + '-' + spriteLabel, spriteSheetPath, frameData, data.frameRate, data.loop);
		sprite.x = _this2.x;
		sprite.y = _this2.y;
		sprite.z = _this2.z;
		sprites[spriteLabel] = sprite;
	});
	if (typeof this.display === 'undefined') {
		this.display = this.spriteData[0].label;
	}
	sprite = sprites[this.display];
	if (this.stage) sprite.stage = true;
}

function ignoreObject(displayObject) {
	this.ignoreObjectList.push(displayObject);
}

DisplayObject.getDisplayObjects = function () {
	return displayObjects;
};

if (config.dev) {
	window.getDisplayObjectTotal = function () {
		return displayObjects.length;
	};
	window.getDisplayObjects = DisplayObject.getDisplayObjects;
	window.updateDisplayObject = function (id, properties) {
		var object = displayObjects.find(function (displayObject) {
			if (displayObject.id === id) return true;
			return false;
		});
		if (!!object) {
			for (var property in properties) {
				object[property] = properties[property];
			}
		}
	};
	window.updateDisplayObjectsFromConfig = function () {
		var configDisplayObjects = config.displayObjects,
		    configObject = null,
		    properties = null,
		    property = null;
		displayObjects.forEach(function (displayObject) {
			configObject = configDisplayObjects[displayObject.id];
			properties = configObject.properties;
			for (property in properties) {
				displayObject[property] = properties[property];
			}
		});
	};
}

module.exports = DisplayObject;

},{"../../utils/geom":22,"../config":2,"../cycle":6,"./sprite":18}],11:[function(require,module,exports){
'use strict';

var Enemy = require('./enemy'),
    Character = require('../character'),
    cycle = require('../../cycle'),
    geom = require('../../../utils/geom'),
    config = require('../../config');

function Devil() {
	Enemy.call(this);

	this.cycleJump = this.jump.bind(this);
	this.cycleLand = this.land.bind(this);
	this.cycleStop = this.stop.bind(this);
	cycle.wait(this.cycleJump, 100);
}

Devil.prototype = Object.create(Enemy.prototype, {
	'destroy': {
		value: function value() {
			Enemy.prototype.destroy.call(this);
		}
	},
	'jump': {
		value: function value() {

			this.distancePlayer1 = this.getDistanceToPlayer(this.player1);
			this.distancePlayer2 = this.getDistanceToPlayer(this.player2);
			this.closestPlayer = this.getClosestPlayer();

			if (!!this.closestPlayer) {
				this.direction = geom.getAngle(this.x, this.y, this.closestPlayer.x, this.closestPlayer.y);

				var directionLabel = this.directionLabel;

				if (directionLabel === config.UP) {
					this.display = '$down_jumping';
				} else if (directionLabel === config.DOWN) {
					this.display = '$down_jumping';
				} else if (directionLabel === config.LEFT) {
					this.display = '$down_jumping';
				} else if (directionLabel === config.RIGHT) {
					this.display = '$down_jumping';
				} else if (directionLabel === config.UP_LEFT) {
					this.display = '$down_jumping';
				} else if (directionLabel === config.UP_RIGHT) {
					this.display = '$down_jumping';
				} else if (directionLabel === config.DOWN_LEFT) {
					this.display = '$down_jumping';
				} else if (directionLabel === config.DOWN_RIGHT) {
					this.display = '$down_jumping';
				}

				this.applyForce({
					direction: this.direction,
					speed: this.speed
				});

				cycle.wait(this.cycleLand, this.landDelay);
				cycle.wait(this.cycleStop, this.stopDelay);
			}
		}
	},
	'land': {
		value: function value() {
			this.display = this.display.replace(/_.+/, '_landing');
		}
	},
	'stop': {
		value: function value() {
			this.display = this.display.replace(/_.+/, '_standing');
			this.velocity.speed = 0;
			this.velocity.dX = 0;
			this.velocity.dY = 0;
			cycle.wait(this.cycleJump, this.jumpDelay);
		}
	},
	'jumpDelay': {
		get: function get() {
			if (typeof this._jumpDelay !== 'undefined') return this._jumpDelay;
			return this._jumpDelay = this.jumpFrameDelay * config.frameRate;
		}
	},
	'stopDelay': {
		get: function get() {
			if (typeof this._stopDelay !== 'undefined') return this._stopDelay;

			return this._stopDelay = config.frameRate * this.jumpTime;
		}
	},
	'landDelay': {
		get: function get() {
			if (typeof this._landDelay !== 'undefined') return this._landDelay;
			var sprite = this.sprites['$down_landing'];
			return this._landDelay = this.stopDelay - sprite.frameData.length * sprite.frameRate;
		}
	},
	'onCollision': {
		value: function value(collidedObject) {
			/*let v = this._character.velocity,
   	ran = 0,
   	angle = 0;
   if(v.dX === 0 && v.dY !== 0) {
   	if(Math.round(Math.random()) === 0)
   		angle = Math.PI;
   	else
   		angle = 0;
   } else if(v.dY === 0 && v.dX !== 0) {
   	if(Math.round(Math.random()) === 0)
   		angle = 3 * Math.PI / 2;
   	else
   		angle = Math.PI / 2;
   } else {
   	let ran = Math.round(Math.random() * 3);
   	if(ran === 0) {
   		angle = 0;
   	} else if(ran === 1) {
   		angle = Math.PI / 2;
   	} else if(ran === 2) {
   		angle = Math.PI;
   	} else {
   		angle = 3 * Math.PI / 2;
   	}
   }
   this._character.walk(1, angle);*/
			Character.prototype.onCollision.call(this, collidedObject);
		}
	}
});

module.exports = Devil;

},{"../../../utils/geom":22,"../../config":2,"../../cycle":6,"../character":9,"./enemy":12}],12:[function(require,module,exports){
'use strict';

var Character = require('../character'),
    cycle = require('../../cycle'),
    config = require('../../config'),
    geom = require('../../../utils/geom');

function Enemy() {
	Character.call(this);
}

Enemy.prototype = Object.create(Character.prototype, {
	'player1': {
		get: function get() {
			if (typeof this._player1 === 'undefined') return this._player1 = config.player1;
			return this._player1;
		}
	},
	'player2': {
		get: function get() {
			if (typeof this._player2 === 'undefined') return this._player2 = config.player2;
			return this._player2;
		}
	},
	'getDistanceToPlayer': {
		value: function value(player) {
			if (!!player && player.stage) {
				return geom.getDistance(this.x, this.y, player.x, player.y);
			} else {
				return false;
			}
		}
	},
	'getClosestPlayer': {
		value: function value() {
			if (!this.distancePlayer1 && !this.distancePlayer2) {
				return false;
			} else if (this.distancePlayer1 && !this.distancePlayer2) {
				return this.player1;
			} else if (!this.distancePlayer1 && this.distancePlayer2) {
				return this.player2;
			} else {
				return this.distancePlayer2 < this.distancePlayer1 ? this.player2 : this.player1;
			}
		}
	},
	'destroy': {
		value: function value() {
			cycle.removeUpdate(this.cycleActions);
			Character.prototype.destroy.call(this);
		}
	}
});

module.exports = Enemy;

},{"../../../utils/geom":22,"../../config":2,"../../cycle":6,"../character":9}],13:[function(require,module,exports){
'use strict';

var Enemy = require('./enemy'),
    Character = require('../character'),
    cycle = require('../../cycle'),
    geom = require('../../../utils/geom'),
    config = require('../../config');

function Grunt() {
	Enemy.call(this);
	this.cycleWalk = this.walk.bind(this);
	this.cycleFire = this.fire.bind(this);
}

Grunt.prototype = Object.create(Enemy.prototype, {
	'fire': {
		value: function value() {
			this.distancePlayer1 = this.getDistanceToPlayer(this.player1);
			this.distancePlayer2 = this.getDistanceToPlayer(this.player2);
			this.closestPlayer = this.getClosestPlayer();
			if (!this.closestPlayer) return;

			this.firearm.fire(this);
		}
	},
	'walkFrameDelay': {
		set: function set(delay) {
			this._walkFrameDelay = delay;
			cycle.addUpdate(this.cycleWalk, config.frameRate * this._walkFrameDelay);
		},
		get: function get() {
			return this._walkFrameDelay;
		}
	},
	'fireFrameDelay': {
		set: function set(delay) {
			this._fireFrameDelay = delay;
			cycle.addUpdate(this.cycleFire, config.frameRate * this._fireFrameDelay);
		},
		get: function get() {
			return this._fireFrameDelay;
		}
	},
	'walk': {
		value: function value() {
			if (!this.closestPlayer) {
				cycle.removeUpdate(this.cycleWalk);
				this.stop();
				return;
			}

			this.direction = geom.getAngle(this.x, this.y, this.closestPlayer.x, this.closestPlayer.y);

			var directionLabel = this.directionLabel;

			if (directionLabel === config.UP) {
				this.display = '$right_standing';
			} else if (directionLabel === config.DOWN) {
				this.display = '$left_standing';
			} else if (directionLabel === config.LEFT) {
				this.display = '$left_standing';
			} else if (directionLabel === config.RIGHT) {
				this.display = '$right_standing';
			} else if (directionLabel === config.UP_LEFT) {
				this.display = '$left_standing';
			} else if (directionLabel === config.UP_RIGHT) {
				this.display = '$right_standing';
			} else if (directionLabel === config.DOWN_LEFT) {
				this.display = '$left_standing';
			} else if (directionLabel === config.DOWN_RIGHT) {
				this.display = '$right_standing';
			}

			this.velocity = {
				direction: this.direction,
				speed: this.speed
			};
		}
	},
	'stop': {
		value: function value() {
			this.display = this.display.replace('standing', 'standing');
			this.velocity = {
				speed: 0,
				direction: 0
			};
		}
	},
	'destroy': {
		value: function value() {
			cycle.removeUpdate(this.cycleWalk);
			cycle.removeUpdate(this.cycleFire);
			Character.prototype.destroy.call(this);
		}
	},
	'onCollision': {
		value: function value(collidedObject) {
			/*let v = this.velocity,
   	ran = 0,
   	angle = 0;
   if(v.dX === 0 && v.dY !== 0) {
   	if(Math.round(Math.random()) === 0)
   		angle = Math.PI;
   	else
   		angle = 0;
   } else if(v.dY === 0 && v.dX !== 0) {
   	if(Math.round(Math.random()) === 0)
   		angle = 3 * Math.PI / 2;
   	else
   		angle = Math.PI / 2;
   } else {
   	let ran = Math.round(Math.random() * 3);
   	if(ran === 0) {
   		angle = 0;
   	} else if(ran === 1) {
   		angle = Math.PI / 2;
   	} else if(ran === 2) {
   		angle = Math.PI;
   	} else {
   		angle = 3 * Math.PI / 2;
   	}
   }
   this.walk(1, angle);*/
			Character.prototype.onCollision.call(this, collidedObject);
		}
	}
});

module.exports = Grunt;

},{"../../../utils/geom":22,"../../config":2,"../../cycle":6,"../character":9,"./enemy":12}],14:[function(require,module,exports){
'use strict';

var Enemy = require('./enemy'),
    Character = require('../character'),
    cycle = require('../../cycle'),
    geom = require('../../../utils/geom'),
    config = require('../../config');

function Robot() {
	Enemy.call(this);
	this.attacking = false;
	cycle.wait(this.cycleWalk = this.walk.bind(this), 100);
}

Robot.prototype = Object.create(Enemy.prototype, {
	'walkDelay': {
		get: function get() {
			if (typeof this._walkDelay !== 'undefined') return this._walkDelay;
			return this._walkDelay = config.frameRate * this.walkFrameDelay;
		}
	},
	'attackDelay': {
		get: function get() {
			if (typeof this._attackDelay !== 'undefined') return this._attackDelay;
			var sprite = this.sprites['$down_attacking'];
			return this._attackDelay = sprite.frameRate;
		}
	},
	'endAttackDelay': {
		get: function get() {
			if (typeof this._endAttackDelay !== 'undefined') return this._endAttackDelay;
			var sprite = this.sprites['$down_attacking'];
			return this._endAttackDelay = sprite.frameRate * 3;
		}
	},
	'walk': {
		value: function value() {

			if (this.attacking) return;

			this.distancePlayer1 = this.getDistanceToPlayer(this.player1);
			this.distancePlayer2 = this.getDistanceToPlayer(this.player2);
			this.closestPlayer = this.getClosestPlayer();

			this.direction = geom.getAngle(this.x, this.y, this.closestPlayer.x, this.closestPlayer.y);

			var directionLabel = this.directionLabel;

			if (directionLabel === config.UP) {
				this.display = '$down_walking';
			} else if (directionLabel === config.DOWN) {
				this.display = '$down_walking';
			} else if (directionLabel === config.LEFT) {
				this.display = '$down_walking';
			} else if (directionLabel === config.RIGHT) {
				this.display = '$down_walking';
			} else if (directionLabel === config.UP_LEFT) {
				this.display = '$down_walking';
			} else if (directionLabel === config.UP_RIGHT) {
				this.display = '$down_walking';
			} else if (directionLabel === config.DOWN_LEFT) {
				this.display = '$down_walking';
			} else if (directionLabel === config.DOWN_RIGHT) {
				this.display = '$down_walking';
			}

			this.applyForce({
				direction: this.direction,
				speed: this.speed
			});

			if (!!this.cycleWalk) cycle.endWait(this.cycleWalk);
			cycle.wait(this.cycleWalk = this.walk.bind(this), this.walkDelay);
		}
	},
	'melee': {
		value: function value(target) {
			if (this.attacking) return;

			cycle.endWait(this.cycleWalk);
			this.stop();
			this.attacking = true;
			this.display = this.display.replace(/\_.+/, '_attacking');

			var sprite = this.sprites[this.display];

			if (!!this.cycleMeleeAttack) cycle.endWait(this.cycleMeleeAttack);

			cycle.wait(this.cycleMeleeAttack = this.meleeAttack.bind(this, target), this.attackDelay);
		}
	},
	'endAttack': {
		value: function value() {

			this.attacking = false;
			this.display = this.display.replace(/\_.+/, '_standing');

			this.walk();
		}
	},
	'meleeAttack': {
		value: function value(target) {

			var boundingBox = {
				x: this.x + this.meleeHitbox.x - this.meleeHitbox.width / 2,
				y: this.y + this.meleeHitbox.y - this.meleeHitbox.height / 2,
				width: this.meleeHitbox.width,
				height: this.meleeHitbox.height
			};
			if (!!this.checkCollision(boundingBox, target.boundingBox, 0, 0)) {
				//target.health -= this.meleeDamage;
			}
			if (!!this.cycleEndAttack) cycle.endWait(this.cycleEndAttack);

			cycle.wait(this.cycleEndAttack = this.endAttack.bind(this), this.endAttackDelay);
		}
	},

	'stop': {
		value: function value() {
			this.display = this.display.replace(/\_.+/, '_standing');
			this.velocity.speed = 0;
			this.velocity.dX = 0;
			this.velocity.dY = 0;
		}
	},
	'onCollision': {
		value: function value(collidedObject) {
			/*let v = this.velocity,
   	ran = 0,
   	angle = 0;
   if(v.dX === 0 && v.dY !== 0) {
   	if(Math.round(Math.random()) === 0)
   		angle = Math.PI;
   	else
   		angle = 0;
   } else if(v.dY === 0 && v.dX !== 0) {
   	if(Math.round(Math.random()) === 0)
   		angle = 3 * Math.PI / 2;
   	else
   		angle = Math.PI / 2;
   } else {
   	let ran = Math.round(Math.random() * 3);
   	if(ran === 0) {
   		angle = 0;
   	} else if(ran === 1) {
   		angle = Math.PI / 2;
   	} else if(ran === 2) {
   		angle = Math.PI;
   	} else {
   		angle = 3 * Math.PI / 2;
   	}
   }
   this.walk(1, angle);*/
			Character.prototype.onCollision.call(this, collidedObject);
		}
	}
});

module.exports = Robot;

},{"../../../utils/geom":22,"../../config":2,"../../cycle":6,"../character":9,"./enemy":12}],15:[function(require,module,exports){
'use strict';

var DisplayObject = require('./displayObject'),
    Ammunition = require('./ammunition'),
    cycle = require('../cycle'),
    config = require('../config');

function Firearm() {
	DisplayObject.call(this);
}

Firearm.prototype = Object.create(DisplayObject.prototype, {
	'ammunition': {
		get: function get() {
			return this._ammunition;
		},
		set: function set(ammunition) {
			this._ammunition = ammunition;
		}
	},
	'fire': {
		value: fire
	},
	'endBlastAnimation': {
		value: endBlastAnimation
	},
	'startBlastAnimation': {
		value: startBlastAnimation
	}
});

function fire(character) {
	var point = this.getEdgePointFromDirection(character.direction),
	    ammunitionData = config.displayObjects[this.ammunition],
	    property = null,
	    ammunition = new Ammunition();

	for (property in ammunitionData) {
		ammunition[property] = ammunitionData[property];
	}
	ammunition.origin = character;
	ammunition.direction = character.direction;
	ammunition.x = point.x;
	ammunition.y = point.y;
	ammunition.ignoreObject(character);
	character.ignoreObject(ammunition);

	DisplayObject.getDisplayObjects().forEach(function (displayObject) {
		if (!character.hostiles.match(new RegExp(displayObject.id.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')))) {
			ammunition.ignoreObject(displayObject);
			displayObject.ignoreObject(ammunition);
		}
	});
	ammunition.stage = true;
	ammunition.emit();
	this.startBlastAnimation();
}

function startBlastAnimation() {
	if (!!this.cycleEndBlastAnimation) {
		cycle.endWait(this.cycleEndBlastAnimation);
	} else {
		this.display = this.display.replace(/_.+/, '_firing');
		this.cycleEndBlastAnimation = this.endBlastAnimation.bind(this);
	}
	cycle.wait(this.cycleEndBlastAnimation, 100);
}

function endBlastAnimation() {
	delete this.cycleEndBlastAnimation;
	this.display = this.display.replace(/_.+/, '_off');
}

module.exports = Firearm;

},{"../config":2,"../cycle":6,"./ammunition":8,"./displayObject":10}],16:[function(require,module,exports){
'use strict';

var config = require('../config'),
    Character = require('./character'),
    DisplayObject = require('./displayObject'),
    cycle = require('../cycle');

function Player() {
	Character.call(this);

	this.sliding = false;
}

Player.prototype = Object.create(Character.prototype, {
	'walk': {
		value: walk
	},
	'slide': {
		value: slide
	},
	'joystick': {
		value: joystick
	},
	'fire': {
		value: fire
	},
	'onHealthChange': {
		value: function value(func) {
			this.healthChangeCallback = func;
		}
	},
	'health': {
		set: function set(health) {
			Object.getOwnPropertyDescriptor(Character.prototype, 'health').set.call(this, health);
			if (!!this.healthChangeCallback) this.healthChangeCallback();
		},
		get: function get() {
			return Object.getOwnPropertyDescriptor(Character.prototype, 'health').get.call(this);
		}
	}
});

function fire() {
	if (this.dead) return;

	this.firearm.fire(this);
}

function joystick(percentage, angle) {
	if (this.dead) return;

	if (this.velocity.speed >= this.speed && percentage >= 1 && (angle > this.direction && angle > this.direction + Math.PI - 30 * Math.PI / 180 && angle < this.direction + Math.PI + 30 * Math.PI / 180 || angle < this.direction && angle > this.direction - Math.PI - 30 * Math.PI / 180 && angle < this.direction - Math.PI + 30 * Math.PI / 180)) this.slide();else this.walk(percentage, angle);
}

function walk(percentage, direction) {

	if (this.sliding) return;

	this.direction = direction;

	var directionLabel = this.directionLabel;

	if (directionLabel === config.UP) {
		this.display = '$up_walking';
	} else if (directionLabel === config.DOWN) {
		this.display = '$down_walking';
	} else if (directionLabel === config.LEFT) {
		this.display = '$left_walking';
	} else if (directionLabel === config.RIGHT) {
		this.display = '$right_walking';
	} else if (directionLabel === config.UP_LEFT) {
		this.display = '$upleft_walking';
	} else if (directionLabel === config.UP_RIGHT) {
		this.display = '$upright_walking';
	} else if (directionLabel === config.DOWN_LEFT) {
		this.display = '$downleft_walking';
	} else if (directionLabel === config.DOWN_RIGHT) {
		this.display = '$downright_walking';
	}

	if (percentage <= 0) {
		this.display = this.display.replace('walking', 'standing');
		this.velocity = {
			dX: 0,
			dY: 0,
			direction: direction,
			speed: 0
		};
	} else {
		this.velocity = {
			direction: this.direction,
			speed: this.speed * percentage
		};
	}
}

function slide() {
	var _this = this;

	if (this.sliding) return;

	this.sliding = true;

	var direction = this.direction + Math.PI;

	direction = direction >= 2 * Math.PI ? direction - 2 * Math.PI : direction;

	this.direction = direction;

	var directionLabel = this.directionLabel;

	if (directionLabel === config.UP) {
		this.display = '$up_standing';
	} else if (directionLabel === config.DOWN) {
		this.display = '$down_standing';
	} else if (directionLabel === config.LEFT) {
		this.display = '$left_standing';
	} else if (directionLabel === config.RIGHT) {
		this.display = '$right_standing';
	} else if (directionLabel === config.UP_LEFT) {
		this.display = '$upleft_standing';
	} else if (directionLabel === config.UP_RIGHT) {
		this.display = '$upright_standing';
	} else if (directionLabel === config.DOWN_LEFT) {
		this.display = '$downleft_standing';
	} else if (directionLabel === config.DOWN_RIGHT) {
		this.display = '$downright_standing';
	}

	cycle.wait(function () {
		_this.sliding = false;
	}, config.frameRate * 20);
}

module.exports = Player;

},{"../config":2,"../cycle":6,"./character":9,"./displayObject":10}],17:[function(require,module,exports){
'use strict';

var Sprite = require('./sprite'),
    config = require('../config'),
    DisplayObject = require('./displayObject'),
    cycle = require('../cycle'),
    geom = require('../../utils/geom');

function Projectile() {
	DisplayObject.call(this);
}

Projectile.prototype = Object.create(DisplayObject.prototype, {
	'origin': {
		set: function set(origin) {
			this._origin = origin;
		},
		get: function get() {
			return this._origin;
		}
	},
	'onCollision': {
		value: function value() {
			cycle.removeUpdate(this.cycleUpdateVelocity);
			this.destroy();
		}
	},
	'updateVelocity': {
		value: function value() {
			/*let counter = cycle.getCounter(),
   	diff = counter - this.startCounter,
   	per = diff % this.velocityModifierFrequency / this.velocityModifierFrequency,
   	sin = Math.sin(per * 2 * Math.PI),
   	amplitude = this.velocityModifierAmplitude * sin,
   	perpendicularVelocity = geom.getXYFromVector(0, 0,
   		this.perpendicularDirection,
   		amplitude);
   this.x += perpendicularVelocity.x - this.perpendicularVelocity.x;
   this.y += perpendicularVelocity.y - this.perpendicularVelocity.y;
   this.perpendicularVelocity = perpendicularVelocity;*/
		}
	},
	'velocity': {
		set: function set(velocity) {
			this._velocity = this.processVelocity(velocity);
			var rad2pi = Math.PI * 2,
			    angle = this.velocity.direction + Math.PI / 2;
			angle < 0 ? rad2pi + angle : angle;
			angle = angle > rad2pi ? angle - rad2pi : angle;
			this.perpendicularDirection = angle;
			this.perpendicularVelocity = {
				x: 0,
				y: 0
			};
		},
		get: function get() {
			return Object.getOwnPropertyDescriptor(DisplayObject.prototype, 'velocity').get.call(this);
		}
	},
	'emit': {
		value: function value() {
			this.applyForce({ speed: this.speed, direction: this.direction });
			if (!!this.velocityModifierFrequency && !!this.velocityModifierAmplitude) {
				this.cycleUpdateVelocity = this.updateVelocity.bind(this);
				this.startCounter = cycle.getCounter();
				cycle.addUpdate(this.cycleUpdateVelocity);
			}
		}
	}
});

module.exports = Projectile;

},{"../../utils/geom":22,"../config":2,"../cycle":6,"./displayObject":10,"./sprite":18}],18:[function(require,module,exports){
'use strict';

var config = require('../config'),
    cycle = require('../cycle'),
    resources = require('../../utils/resources'),
    id = require('../../utils/id'),
    socket = require('../../socket'),
    sprites = new Array(),
    spritesToUpdate = new Array(),
    availableSprites = Object.create(null);

function Sprite(label, sheetPath, frameData, frameRate, loops) {

	this.domElement = config.domElement;
	this.sheetPath = sheetPath;
	this.sheet = resources.get(sheetPath);
	if (!!frameData && !!frameRate) {
		this.frameData = frameData;
		this.width = frameData[0].frame.w;
		this.height = frameData[0].frame.h;
		this.frameRate = frameRate;
		this.loops = loops;
		this.frameElapsedTime = 0;
	} else {
		this.frameMeta = {
			x: 0,
			y: 0,
			w: this.sheet.width,
			h: this.sheet.height
		};
		this.width = this.sheet.width;
		this.height = this.sheet.height;
	}
	this.label = label;
	this.id = id.id();
	this.draw();
	sprites.push(this);
}

Object.defineProperties(Sprite.prototype, {
	'x': {
		get: function get() {
			if (!!this._x) return this._x;
			return this._x = 0;
		},
		set: function set(x) {
			this._x = x;
			x = x * this.distanceScale - this.width * this.resolutionScale / 2;
			var y = this.y * this.distanceScale - this.height * this.resolutionScale / 2;
			this.canvas.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
			if (this.hosting && this.stage) {
				this.addUpdate();
			}
		}
	},
	'y': {
		get: function get() {
			if (!!this._y) return this._y;
			return this._y = 0;
		},
		set: function set(y) {
			this._y = y;
			y = y * this.distanceScale - this.height * this.resolutionScale / 2;
			var x = this.x * this.distanceScale - this.width * this.resolutionScale / 2;
			this.canvas.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
			if (this.hosting && this.stage) {
				this.addUpdate();
			}
		}
	},
	'z': {
		get: function get() {
			if (!!this._z) return this._z;
			return this._z = 1;
		},
		set: function set(z) {
			this._z = z;
			this.canvas.style.zIndex = z;
			if (this.hosting && this.stage) {
				this.addUpdate();
			}
		}
	},
	'stage': {
		get: function get() {
			if (!!this._stage) return this._stage;
			return this._stage = false;
		},
		set: function set(stage) {
			this._stage = stage;
			this.canvas.style.display = stage ? 'block' : 'none';
			if (stage) {
				this.frame = 0;
				this.frameElapsedTime = 0;
				this.draw();
				this.frame = 1;
			}
			if (this.hosting) {
				this.addUpdate();
			}
		}
	},
	'frame': {
		get: function get() {
			if (!!this._frame) return this._frame;
			return this._frame = 0;
		},
		set: function set(frame) {
			this._frame = frame;
		}
	},
	'frameMeta': {
		get: function get() {
			if (!!this.frameData) return this.frameData[this.frame].frame;
			return this._frameMeta;
		},
		set: function set(frameMeta) {
			this._frameMeta = frameMeta;
		}
	},
	'canvas': {
		get: function get() {
			if (!!this._canvas) return this._canvas;
			this._canvas = document.createElement('canvas');
			this._canvas.className = this.label;
			this._canvas.style.display = 'none';
			this._canvas.style.zIndex = 1;
			this._canvas.style.position = 'absolute';
			this._canvas.style.transform = 'translate(0, 0)';
			this._canvas.style.transition = 'transform ' + config.frameRate + 'ms linear';
			this._canvas.setAttribute('width', this.width * this.resolutionScale + 'px');
			this._canvas.setAttribute('height', this.height * this.resolutionScale + 'px');
			this.domElement.appendChild(this._canvas);
			return this._canvas;
		}
	},
	'resolutionScale': {
		get: function get() {
			if (!!this._resolutionScale) return this._resolutionScale;
			return this._resolutionScale = config.resolutionScale;
		}
	},
	'distanceScale': {
		get: function get() {
			if (!!this._distanceScale) return this._distanceScale;
			return this._distanceScale = config.distanceScale;
		}
	},
	'context': {
		get: function get() {
			return this.canvas.getContext('2d');
		}
	},
	'draw': {
		value: function value() {
			var frameMeta = this.frameMeta;
			this.context.clearRect(0, 0, this.width, this.height);
			this.context.drawImage(this.sheet, frameMeta.x, frameMeta.y, frameMeta.w, frameMeta.h, 0, 0, this.width * this.resolutionScale, this.height * this.resolutionScale);
		}
	},
	'addUpdate': {
		value: addUpdate
	},
	'destroy': {
		value: function value() {
			if (!this.destroyed) {
				this.stage = false;
				this.frame = 0;
				availableSprites[this.label] = availableSprites[this.label] || new Array();
				availableSprites[this.label].push(this);
				this.destroyed = true;
				if (this.hosting) {
					this.addUpdate();
				}
			}
		}
	},
	'destroyed': {
		get: function get() {
			if (typeof this._destroyed === 'undefined') return this._destroyed = false;else return this._destroyed;
		},
		set: function set(destroyed) {
			this._destroyed = destroyed;
		}
	},
	'hosting': {
		get: function get() {
			if (typeof this._hosting === 'undefined') return this._hosting = config.hosting;
			return this._hosting;
		}
	}
});

function addUpdate() {
	var _this = this;

	var updateObj = spritesToUpdate.find(function (obj) {
		return obj.id === _this.id;
	}),
	    values = {
		stage: this.stage,
		x: this.x,
		y: this.y,
		z: this.z,
		sheetPath: this.sheetPath,
		label: this.label,
		frameData: this.frameData,
		id: this.id,
		frameRate: this.frameRate,
		loops: this.loops,
		destroyed: this.destroyed
	};
	if (typeof updateObj === 'undefined') {
		spritesToUpdate.push(values);
	} else {
		for (var property in values) {
			updateObj[property] = values[property];
		}
	}
}

Sprite.getSprite = function (label, sheetPath, frameData, frameRate, loops) {
	var sprite = null,
	    availArray = availableSprites[label];
	if (!!availArray && availArray.length > 0) {
		sprite = availArray.pop();
		sprite.destroyed = false;
		return sprite;
	}
	return new Sprite(label, sheetPath, frameData, frameRate, loops);
};

Sprite.cleanup = function () {
	var tmp = new Array();
	sprites.forEach(function (sprite) {
		if (!sprite.destroyed) tmp.push(sprite);
	});
	sprites = tmp;
};

Sprite.draw = function () {

	sprites.forEach(function (sprite) {

		if (sprite.stage && !!sprite.frameData && sprite.frameRate && (!!sprite.loops || sprite.frame < sprite.frameData.length)) {

			if (sprite.frameElapsedTime < sprite.frameRate) {

				sprite.frameElapsedTime += config.frameRate;
			} else {

				sprite.frameElapsedTime = 0;

				sprite.draw();

				if (sprite.frame >= sprite.frameData.length - 1 && sprite.loops) {
					sprite.frame = 0;
				}
				if (sprite.frame < sprite.frameData.length - 1) {
					sprite.frame++;
				}
			}
		}
	});
};

Sprite.receiveUpdate = function (serverSprites) {
	var sprite = null,
	    property = void 0;
	serverSprites.forEach(function (spriteData) {
		sprite = sprites.find(function (s) {
			return s.id === spriteData.id;
		});
		if (typeof sprite === 'undefined' && !spriteData.destroyed) {
			sprite = Sprite.getSprite(spriteData.label, spriteData.sheetPath, spriteData.frameData, spriteData.frameRate, spriteData.loops);
		}
		if (!!sprite) {
			for (property in spriteData) {
				if (property !== 'sheetPath' && property !== 'label' && property !== 'frameData' && property !== 'frameRate' && property !== 'loops') sprite[property] = spriteData[property];
			}
		}
	});
};

Sprite.sendUpdate = function () {
	if (spritesToUpdate.length > 0) socket.emit('sprite update', spritesToUpdate);
	spritesToUpdate = new Array();
};

if (config.dev) {
	window.getSpriteTotal = function () {
		return sprites.length;
	};
}

/*
var slimmerState = new Float64Array([
  0,
  15.290663048624992,
  2.0000000004989023,
  -24.90756910131313,
  0.32514392007855847,
  -0.8798439564294107,
  0.32514392007855847,
  0.12015604357058937,
  1,
  7.490254936274141,
  2.0000000004989023,
  -14.188117316225544,
  0,
  0.018308020720336753,
  0.1830802072033675,
  0.9829274917854702
]);

// Impose an 8-bit unsigned format onto the bytes
// stored in the ArrayBuffer.
var ucharView  = new Uint8Array( slimmerState.buffer );
var slimmerMsg = String.fromCharCode.apply(
  String, [].slice.call( ucharView, 0 )
);
var slimmerMsgSize = getUTF8Size( slimmerMsg ); // 170 bytes


// Decode
var decodeBuffer = new ArrayBuffer( slimmerMsg.length );
var decodeView   = new Uint8Array( decodeBuffer );

// Put message back into buffer as 8-bit unsigned.
for ( var i = 0; i < slimmerMsg.length; ++i ) {
  decodeView[i] = slimmerMsg.charCodeAt( i );
}

// Interpret the data as JavaScript Numbers
var decodedState = new Float64Array( decodeBuffer );
*/

module.exports = Sprite;

},{"../../socket":21,"../../utils/id":23,"../../utils/resources":24,"../config":2,"../cycle":6}],19:[function(require,module,exports){
'use strict';

var components = require('./components'),
    dataLoader = require('./data'),
    config = require('./config'),
    resources = require('../utils/resources'),
    socket = require('../socket'),
    cycle = require('./cycle'),
    Sprite = require('./displayObject/sprite'),
    DisplayObject = require('./displayObject/displayObject'),
    id = require('../utils/id'),
    socketAvailable = null,
    controls = null,
    gameComponent = ReactDOM.render(React.createElement(components.Game), document.getElementById('game'), function () {

	config.domElement = document.getElementById('canvas');
	config.domElement.style.position = 'relative';
	config.domElement.style.overflow = 'hidden';

	socketAvailable = initSocket();

	dataLoader.load(function () {
		resources.onReady(function () {
			controls = require('./controls');
			controls(onJoystick, onFire);
			cycle.addUpdate(Sprite.draw);
			cycle.addCleanup(DisplayObject.cleanup);
			cycle.addCleanup(Sprite.cleanup);
			components.addHandlers(handleStartSinglePlayerGame, handleStartTwoPlayerGame, handleConfirmPlayerName, handleCreateGame, handleGameListSelect, handleJoinGame, handleHostReady, handleGuestReady, handleEndGame, handlePauseGame, handleRestartGame, handleResumeGame);

			if (config.dev1) {
				config.gameType = 'single';
				gameComponent.setState({ gameType: 'single' });
				startGame();
			} else if (config.dev2) {
				config.gameType = 'two';
				gameComponent.setState({
					name: id.id()
				});
				handleConfirmPlayerName();
			}
		});
		resources.load(config.imagesToLoad);
	});
});

function startLevel(index) {
	var levelData = config.levels[index];
	if (config.hosting || config.gameType === 'single') {
		(function () {
			var displayObject = null,
			    property = null;
			levelData.forEach(function (level) {
				if (level.id !== 'player2' || config.gameType === 'two') {
					displayObject = new config.displayObjects[level.id].class();
					for (property in config.displayObjects[level.id]) {
						displayObject[property] = config.displayObjects[level.id][property];
					}
					for (var _property in level.properties) {
						displayObject[_property] = level.properties[_property];
					}
					displayObject.stage = true;
					if (level.id === 'player1') config.player1 = displayObject;else if (level.id === 'player2') config.player2 = displayObject;
				}
			});
		})();
	}
	if (config.gameType === 'single' || config.hosting) {
		setHud({
			player1HealthTotal: config.player1.health,
			player1Health: config.player1.health,
			player1Weapon: config.player1.firearmType
		});
		config.player1.onHealthChange(function () {
			setHud({
				player1Health: config.player1.health
			});
		});
	}
	if (config.gameType === 'two' && config.hosting) {
		setHud({
			player2HealthTotal: config.player2.health,
			player2Health: config.player2.health,
			player2Weapon: config.player2.firearmType
		});
		config.player2.onHealthChange(function () {
			setHud({
				player2Health: config.player2.health
			});
		});
	}
}

function setHud(state) {
	gameComponent.setState(state);
	if (config.gameType === 'two' && config.hosting) {
		socket.emit('hud', state);
	}
}

function startGame() {
	gameComponent.setState({ gameActive: true });
	if (config.hosting) {
		cycle.addServer(Sprite.sendUpdate);
	} else {
		socket.on('sprite update', Sprite.receiveUpdate);
	}
	cycle.start();
	startLevel(0);
}

function onJoystick(angle, percentage) {
	if (config.gameType === 'two' && !config.hosting) {
		socket.emit('joystick', { angle: angle, amount: percentage });
	} else {
		config.player1.joystick(percentage, angle);
	}
}

function onFire() {
	if (config.gameType === 'two' && !config.hosting) {
		socket.emit('fire');
	} else {
		config.player1.fire();
	}
}

function initSocket() {
	if (!socket.init()) return false;
	socket.on('games list', function (games) {
		gameComponent.setState({ games: games });
		if (config.dev2) {
			if (games.length > 0) {
				gameComponent.setState({
					gameId: games[0].id
				});
				handleJoinGame();
			} else {
				gameComponent.setState({
					gameName: id.id()
				});
				handleCreateGame();
			}
		}
	});
	socket.on('hud', function (state) {
		setHud(state);
	});
	socket.on('game created', function (id) {
		gameComponent.setState({
			hosting: true,
			gameId: id
		});
	});
	socket.on('player joined', function (playerName) {
		gameComponent.setState({ guestName: playerName });
		gameComponent.setState({ playerJoined: true });

		if (config.dev2) {
			handleHostReady();
		}
	});
	socket.on('host ready', function () {
		gameComponent.setState({ hostReady: true });

		if (config.dev2) {
			handleGuestReady();
		}
	});
	socket.on('guest ready', function () {
		startGame();
	});
	socket.on('joystick', function (data) {
		config.player2.joystick(percentage, angle);
	});
	socket.on('fire', function () {
		config.player2.fire();
	});
	socket.on('end game', function () {});
	return true;
}

function handleJoinGame() {
	config.hosting = false;
	socket.emit('join game', {
		name: gameComponent.state.playerName,
		gameId: gameComponent.state.gameId
	});
	gameComponent.setState({ gameJoined: true });
}
function handleGameListSelect(event) {
	var element = event.target;
	gameComponent.setState({
		gameId: element.getAttribute('data-game-id'),
		hostName: element.getAttribute('data-player-name')
	});
}
function handleCreateGame() {
	gameComponent.setState({ gameCreated: true });
	config.hosting = true;
	socket.emit('create game', {
		name: gameComponent.state.playerName,
		gameName: gameComponent.state.gameName
	});
}
function handlePauseGame(e) {
	cycle.stop();
	gameComponent.setState({ paused: true });
}
function handleResumeGame(e) {
	gameComponent.setState({ paused: false });
	cycle.start();
}
function handleRestartGame(e) {
	cycle.stop();
	DisplayObject.clear();
	gameComponent.setState({ paused: false });
	startGame();
}
function handleEndGame(e) {
	cycle.stop();
	DisplayObject.clear();
	gameComponent.setState(gameComponent.getInitialState());
}
function handleConfirmPlayerName() {
	gameComponent.setState({ playerNameSet: true });
	socket.emit('request games list');
}
function handleStartSinglePlayerGame() {
	config.gameType = 'single';
	gameComponent.setState({ gameType: 'single' });
	startGame();
}
function handleStartTwoPlayerGame() {
	config.gameType = 'two';
	gameComponent.setState({ gameType: 'two' });
}
function handleHostReady() {
	gameComponent.setState({ hostReady: true });
	socket.emit('host ready');
}
function handleGuestReady() {
	socket.emit('guest ready');
	startGame();
}

},{"../socket":21,"../utils/id":23,"../utils/resources":24,"./components":1,"./config":2,"./controls":4,"./cycle":6,"./data":7,"./displayObject/displayObject":10,"./displayObject/sprite":18}],20:[function(require,module,exports){
'use strict';

(function () {
	window.init = function () {
		require('./game');
	};
})();

},{"./game":19}],21:[function(require,module,exports){
"use strict";

var socket = null;

module.exports = {
	emit: function emit(label, data) {
		if (!!socket) socket.emit(label, data);
	},
	on: function on(label, callback) {
		if (!!socket) socket.on(label, function (data) {
			callback(data);
		});
	},
	init: function init() {
		socket = socket || !!io ? io() : false;
		return !!socket;
	}
};

},{}],22:[function(require,module,exports){
'use strict';

var pi = Math.PI,
    a45 = pi / 4,
    a90 = pi / 2,
    a135 = 3 * pi / 4,
    a180 = pi,
    a225 = 5 * pi / 4,
    a270 = 3 * pi / 2,
    a315 = 7 * pi / 4,
    a360 = 2 * pi,
    deg = 180 / pi;

module.exports = {
	getAngle: function getAngle(x1, y1, x2, y2) {
		var deltaX = x2 - x1,
		    deltaY = y2 - y1,
		    angle = null,
		    angle2 = null,
		    rad = void 0;

		if (deltaX === 0 && deltaY === 0) angle = 0;else if (deltaX === 0 && deltaY < 0) angle = 0;else if (deltaX === 0 && deltaY > 0) angle = Math.PI;else if (deltaX < 0 && deltaY === 0) angle = 3 * Math.PI / 2;else if (deltaX > 0 && deltaY === 0) angle = Math.PI / 2;else {
			angle = Math.atan2(Math.abs(deltaY), Math.abs(deltaX));
			if (deltaX > 0 && deltaY > 0) angle2 = angle + Math.PI / 2;
			if (deltaX > 0 && deltaY < 0) angle2 = Math.PI / 2 - angle;
			if (deltaX < 0 && deltaY > 0) angle2 = 3 * Math.PI / 2 - angle;
			if (deltaX < 0 && deltaY < 0) angle2 += angle + 3 * Math.PI / 2;
			return angle2;
		}
		return angle;
	},
	getDistance: function getDistance(x1, y1, x2, y2) {
		var deltaX = x2 - x1,
		    deltaY = y2 - y1;
		return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
	},
	getXYFromVector: function getXYFromVector(x, y, angle, distance) {
		var point = {},
		    tmpAngle = 0,
		    xModifier = 1,
		    yModifier = 1;

		if (angle === 0 || angle === a360) {
			point.x = 0;
			point.y = -distance;
			return point;
		} else if (angle === a90) {
			point.x = distance;
			point.y = 0;
			return point;
		} else if (angle === a180) {
			point.x = 0;
			point.y = distance;
			return point;
		} else if (angle === a270) {
			point.x = -distance;
			point.y = 0;
			return point;
		} else if (angle < a90) {
			tmpAngle = a90 - angle;
			xModifier = 1;
			yModifier = -1;
		} else if (angle < a180) {
			tmpAngle = angle - a90;
			xModifier = 1;
			yModifier = 1;
		} else if (angle < a270) {
			tmpAngle = a270 - angle;
			xModifier = -1;
			yModifier = 1;
		} else {
			tmpAngle = angle - a270;
			xModifier = -1;
			yModifier = -1;
		}
		point.x = Math.cos(tmpAngle) * distance * xModifier;
		point.y = Math.sin(tmpAngle) * distance * yModifier;
		return point;
	},
	getVectorFromXYAngle: function getVectorFromXYAngle(x, y, angle) {
		var point = {};

		if (angle === 0 || angle === a360) {
			point.x = 0;
			point.y = -y;
			return point;
		} else if (angle === a45) {
			point.x = x;
			point.y = -y;
			return point;
		} else if (angle === a90) {
			point.x = x;
			point.y = 0;
			return point;
		} else if (angle === a135) {
			point.x = x;
			point.y = y;
			return point;
		} else if (angle === a180) {
			point.x = 0;
			point.y = y;
			return point;
		} else if (angle === a225) {
			point.x = -x;
			point.y = y;
			return point;
		} else if (angle === a270) {
			point.x = -x;
			point.y = 0;
			return point;
		} else if (angle === a315) {
			point.x = -x;
			point.y = -y;
			return point;
		} else {
			var n = Math.floor(angle / a45),
			    tmpAngle = angle % a45,
			    xModifier = 1,
			    yModifier = 1,
			    divBy2 = n / 2;
			if (n === 0 || n === 3 || n === 4 || n === 7) {
				tmpAngle = angle % a90;
				if (tmpAngle > a45) tmpAngle = a90 - tmpAngle;
				point.x = Math.tan(tmpAngle) * x;
				point.y = y;
			} else {
				tmpAngle = angle % a90;
				if (tmpAngle > a45) tmpAngle = a90 - tmpAngle;
				point.x = x;
				point.y = Math.tan(tmpAngle) * y;
			}
			if (angle < a90) {
				point.y *= -1;
			} else if (angle < a180) {} else if (angle < a270) {
				point.x *= -1;
			} else {
				point.x *= -1;
				point.y *= -1;
			}
		}
		return point;
	}
};

},{}],23:[function(require,module,exports){
"use strict";

var S4 = function S4() {
	return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
};

module.exports = {
	guid: function guid() {
		return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
	},
	id: function id() {
		return S4();
	}
};

},{}],24:[function(require,module,exports){
"use strict";

var resourceCache = {};
var loading = [];
var readyCallbacks = [];

// Load an image url or an array of image urls
function load(urlOrArr) {
	if (urlOrArr instanceof Array) {
		urlOrArr.forEach(function (url) {
			_load(url);
		});
	} else {
		_load(urlOrArr);
	}
}

function _load(url) {
	if (resourceCache[url]) {
		return resourceCache[url];
	} else {
		var img = new Image();
		img.onload = function () {
			resourceCache[url] = img;

			if (isReady()) {
				readyCallbacks.forEach(function (func) {
					func();
				});
			}
		};
		resourceCache[url] = false;
		img.src = url;
	}
}

function get(url) {
	return resourceCache[url];
}

function isReady() {
	var ready = true;
	for (var k in resourceCache) {
		if (resourceCache.hasOwnProperty(k) && !resourceCache[k]) {
			ready = false;
		}
	}
	return ready;
}

function onReady(func) {
	readyCallbacks.push(func);
}

module.exports = {
	load: load,
	get: get,
	onReady: onReady,
	isReady: isReady
};

},{}]},{},[20]);
