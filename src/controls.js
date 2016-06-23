'use strict';

let settings = require('./settings'),
	joystickCallback = null,
	fireCallback = null,
	activeControl = null,
	fireBtnJson = null,
	controls = Object.create(null);

document.getElementById('controls').addEventListener('touchstart', function(e){e.preventDefault()});

let joystick = require('./joystick');
require('./data')(settings.joystickJsonUri, (data)=>{
	joystick.init(document.getElementById('joystick'), data,
		settings.UP, 
		settings.DOWN, 
		settings.LEFT, 
		settings.RIGHT,
		settings.UP_LEFT,
		settings.UP_RIGHT,
		settings.DOWN_LEFT,
		settings.DOWN_RIGHT,
		settings.CENTER
	);
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
})

let Control = function(label, callback){
	this.label = label;
	this.callback = callback;
	this.active = false;
}

Control.prototype.start = function() {
	if(!this.active) {
		this.fire();
		this.active = true;
		window.requestAnimationFrame(this.fire.bind(this));
	}
};

Control.prototype.stop = function() {
	this.active = false;
};

Control.prototype.fire = function() {
	if(this.active) {
		this.callback(this.label);
		window.requestAnimationFrame(this.fire.bind(this));
	}
		
};

function onFire() {
	fireBtn.className = 'active';
	fireCallback();
}

function onFireEnd() {
	fireBtn.className = '';
}

function onJoystickMove(label) {
	if(activeControl !== controls[label]) {
		if(!!activeControl)
			activeControl.stop();
		if(label === settings.CENTER) {
			joystickCallback(settings.CENTER);
		}	
		else 
			controls[label].start();
		activeControl = controls[label];
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
	
	controls[settings.UP] = new Control(settings.UP, joystickCallback);
	controls[settings.DOWN] = new Control(settings.DOWN, joystickCallback);
	controls[settings.LEFT] = new Control(settings.LEFT, joystickCallback);
	controls[settings.RIGHT] = new Control(settings.RIGHT, joystickCallback);
	controls[settings.UP_LEFT] = new Control(settings.UP_LEFT, joystickCallback);
	controls[settings.UP_RIGHT] = new Control(settings.UP_RIGHT, joystickCallback);
	controls[settings.DOWN_LEFT] = new Control(settings.DOWN_LEFT, joystickCallback);
	controls[settings.DOWN_RIGHT] = new Control(settings.DOWN_RIGHT, joystickCallback);
	controls[settings.CENTER] = new Control(settings.CENTER, joystickCallback);
}