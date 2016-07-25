'use strict';

let config = require('./config'),
	cycle = require('./cycle'),
	joystickCallback = null,
	fireCallback = null,
	joystick = require('./controls/joystick'),
	fireBtn = document.getElementById('fire-btn'),
	controlsJson = config.controls,
	joystickAngle = 0,
	joystickAmount = 0,
	frameRate = config.joystickFrameRate;

	document.querySelector('#controls').addEventListener('touchstart', (e)=>{e.preventDefault()});

joystick.init(document.getElementById('joystick'), config.joystickMax, config.joystickMin, controlsJson);
joystick.addCallback(onJoystickMove);

fireBtn.style.background = 'url('+config.controlsImage+')';
fireBtn.style.width = controlsJson['fire_up'].frame.w + 'px';
fireBtn.style.height = controlsJson['fire_up'].frame.h + 'px';
fireBtn.style.backgroundPosition = (-controlsJson['fire_up'].frame.x)+'px '+(-controlsJson['fire_up'].frame.y)+'px';
fireBtn.addEventListener('touchstart', onFire, false);
fireBtn.addEventListener('touchend', onFireEnd, false);
	
cycle.addUpdate(joystickFrame, frameRate);

function joystickFrame() {
	joystickCallback(joystickAngle, joystickAmount);
}

function onFire() {
	fireBtn.className = 'active';
	fireBtn.style.backgroundPosition = (-controlsJson['fire_down'].frame.x)+'px '+(-controlsJson['fire_down'].frame.y)+'px';
	fireCallback();
}

function onFireEnd() {
	fireBtn.className = '';
	fireBtn.style.backgroundPosition = (-controlsJson['fire_up'].frame.x)+'px '+(-controlsJson['fire_up'].frame.y)+'px';
}

function onJoystickMove(angle, amount) {
	joystickAngle = angle;
	joystickAmount = amount;
}

document.addEventListener('keydown', (e)=>{
	if(e.keyCode === 32) {
		if(!!fireCallback)
			fireCallback();
	}
}, false);
	
module.exports = function(_joystickCallback, _fireCallback){
	joystickCallback = _joystickCallback;
	fireCallback = _fireCallback;
}