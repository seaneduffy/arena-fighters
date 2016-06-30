'use strict';

let settings = require('./settings'),
	joystickCallback = null,
	fireCallback = null,
	activeControl = null,
	fireBtnJson = null;

document.getElementById('controls').addEventListener('touchstart', function(e){e.preventDefault()});

let joystick = require('./joystick');
require('./data')(settings.joystickJsonUri, (data)=>{
	joystick.init(document.getElementById('joystick'), data);
	joystick.addCallback(onJoystickMove);
});

let fireBtn = document.getElementById('fire-btn');
require('./data')(settings.fireBtnJsonUri, (data)=>{
	fireBtnJson = data.frames;
	fireBtn.style.background = 'url('+settings.fireBtnImage+')';
	let imageInfo = fireBtnJson['fire_up.png'].frame;
	fireBtn.style.width = imageInfo.w + 'px';
	fireBtn.style.height = imageInfo.h + 'px';
	fireBtn.style.backgroundPosition = (-imageInfo.x)+'px '+(-imageInfo.y)+'px';
	fireBtn.addEventListener('touchstart', onFire, false);
	fireBtn.addEventListener('touchend', onFireEnd, false);
});

let joystickActive = false,
	joystickAngle = -1;

function joystickFrame() {
	if(joystickActive) {
		joystickCallback(joystickAngle);
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

function onJoystickMove(angle) {
	joystickAngle = angle;
	if(angle === -1) {
		joystickActive = false;
		joystickCallback(angle);
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