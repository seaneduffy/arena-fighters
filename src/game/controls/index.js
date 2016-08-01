'use strict';

let config = require('../config'),
	cycle = require('../cycle'),
	joystickCallback = null,
	fireCallback = null,
	joystick = require('./joystick'),
	fireBtn = require('./fire'),
	controlsJson = config.controls,
	joystickAngle = 0,
	joystickAmount = 0,
	joystickFrameRate = config.joystickFrameRate;

document.querySelector('#controls').addEventListener('touchmove', (e)=>{e.preventDefault()});

joystick.init(document.getElementById('joystick'), config.joystickMax, config.joystickMin, controlsJson, function(angle, amount){
	joystickAngle = angle;
	joystickAmount = amount;
});

cycle.addUpdate(joystickFrame, joystickFrameRate);

fireBtn.init(document.getElementById('fire-btn'), controlsJson, function(){
	fireCallback();
});

function joystickFrame() {
	joystickCallback(joystickAngle, joystickAmount);
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