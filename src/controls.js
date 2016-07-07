'use strict';

let global = require('./global'),
	joystickCallback = null,
	fireCallback = null,
	activeControl = null,
	fireBtnJson = null;

document.getElementById('controls').addEventListener('touchstart', function(e){e.preventDefault()});

let joystick = require('./joystick');
require('./data')(global.joystickJsonUri, (data)=>{
	joystick.init(document.getElementById('joystick'), global.settings.joystickMax, global.settings.joystickMin, data);
	joystick.addCallback(onJoystickMove);
});

let fireBtn = document.getElementById('fire-btn');
require('./data')(global.fireBtnJsonUri, (data)=>{
	fireBtnJson = data.frames;
	fireBtn.style.background = 'url('+global.fireBtnImage+')';
	let imageInfo = fireBtnJson['fire_up.png'].frame;
	fireBtn.style.width = imageInfo.w + 'px';
	fireBtn.style.height = imageInfo.h + 'px';
	fireBtn.style.backgroundPosition = (-imageInfo.x)+'px '+(-imageInfo.y)+'px';
	fireBtn.addEventListener('touchstart', onFire, false);
	fireBtn.addEventListener('touchend', onFireEnd, false);
});

let joystickActive = false,
	joystickAngle = -1,
	joystickAmount = 0;

function joystickFrame() {
	if(joystickActive) {
		joystickCallback(joystickAngle, joystickAmount);
		window.requestAnimationFrame(joystickFrame);
	}
}

function onFire() {
	fireBtn.className = 'active';
	fireCallback();
}

function onFireEnd() {
	fireBtn.className = '';
}

function onJoystickMove(angle, amount) {
	joystickAngle = angle;
	joystickAmount = amount;
	if(angle === -1) {
		joystickActive = false;
		joystickCallback(angle, amount);
	} else if(!joystickActive) {
		joystickActive = true;
		window.requestAnimationFrame(joystickFrame);
	}
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