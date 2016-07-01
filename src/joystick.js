let global = require('./global'),
	geom = require('./geom'),
	element = null,
	callbacks = [],
	isTouch = checkTouch(),
	centerX = null,
	centerY = null,
	touchX = null,
	touchY = null,
	deltaX = null,
	deltaY = null,
	sensitivity = 10,
	directions = Object.create(null),
	spriteJson = null,
	xobj = new XMLHttpRequest();

function updateDisplay(label) {
	let imageInfo = spriteJson[label + '.png'].frame;
	element.style.backgroundPosition = (-imageInfo.x) + 'px ' + (-imageInfo.y) + 'px';
}

function checkTouch() {
	try {  
		document.createEvent("TouchEvent");  
		return true;
	} catch (e) {
		return false;
	}
}

function init() {
	if(isTouch) {
		element.addEventListener('touchstart', startTouch, false);
		element.addEventListener('touchmove', touchMove, false);
		element.addEventListener('touchend', endTouch, false);
	}
	element.style.background = 'url('+global.joystickImage+')';
	let imageInfo = spriteJson[global.CENTER+'.png'].frame;
	element.style.width = imageInfo.w + 'px';
	element.style.height = imageInfo.h + 'px';
	updateDisplay(global.CENTER);
}

function startTouch(e) {
	e.preventDefault();
	centerX = e.touches[0].pageX;
	centerY = e.touches[0].pageY;
}

function callback(angle) {
	let pi = Math.PI, l = callbacks.length;
	element.className = 'active';
	if(angle === -1){
		updateDisplay(global.CENTER);
	} else if(angle <= pi / 8 || angle > 15 * pi / 8)
		updateDisplay(global.UP);
	else if(angle <= 3 * pi / 8)
		updateDisplay(global.UP_RIGHT);
	else if(angle <= 5 * pi / 8)
		updateDisplay(global.RIGHT);
	else if(angle <= 7 * pi / 8)
		updateDisplay(global.DOWN_RIGHT);
	else if(angle <= 9 * pi / 8)
		updateDisplay(global.DOWN);
	else if(angle <= 11 * pi / 8)
		updateDisplay(global.DOWN_LEFT);
	else if(angle <= 13 * pi / 8)
		updateDisplay(global.LEFT);
	else if(angle <= 15 * pi / 8)
		updateDisplay(global.UP_LEFT);
	for(let i=0; i<l; i++)
		callbacks[i](angle);
}

function touchMove(e) {
	touchX = e.touches[0].pageX;
	touchY = e.touches[0].pageY;
	deltaX = touchX - centerX;
	deltaY = touchY - centerY;
	if(Math.abs(deltaX) > sensitivity || Math.abs(deltaY) > sensitivity){
		let angle = geom.getAngle(centerX, centerY, touchX, touchY);
		callback(angle);
	} else {
		callback(-1);
	}
}

function endTouch(e) {
	callback(-1);
	element.className = '';
}

module.exports = {
	init: function(_element, data){
		element = _element;
		spriteJson = data.frames;
		init();
	},
	addCallback: function(_callback) {
		callbacks.push(_callback);
	}
};