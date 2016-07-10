let config = require('./config'),
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
	sensitivity = null,
	maxDistance = null,
	directions = Object.create(null),
	spriteJson = null,
	xobj = new XMLHttpRequest();

function updateDisplay(label) {
	let imageInfo = spriteJson[label].frame;
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
	} else {
		element.addEventListener('mousedown', onPress, false);
		element.addEventListener('mouseup', onRelease, false);
	}
	element.style.background = 'url('+config.joystickImage+')';
	let imageInfo = spriteJson['center'].frame;
	element.style.width = imageInfo.w + 'px';
	element.style.height = imageInfo.h + 'px';
	updateDisplay('center');
}

function startTouch(e) {
	e.preventDefault();
	centerX = e.touches[0].pageX;
	centerY = e.touches[0].pageY;
}

function touchMove(e) {
	touchX = e.touches[0].pageX;
	touchY = e.touches[0].pageY;
	deltaX = touchX - centerX;
	deltaY = touchY - centerY;
	let amount = geom.getDistance(centerX, centerY, touchX, touchY);
	if(amount > maxDistance) amount = maxDistance;
	if(Math.abs(deltaX) > sensitivity || Math.abs(deltaY) > sensitivity){
		callback(
			geom.getAngle(centerX, centerY, touchX, touchY), 
			amount / maxDistance
		);
	} else {
		callback(-1, 0);
	}
}

function endTouch(e) {
	callback(-1, 0);
	element.className = '';
}

function onPress(e) {
	centerX = e.pageX;
	centerY = e.pageY;
	element.addEventListener('mousemove', pressMove, false);
}

function pressMove(e) {
	let x = e.pageX,
		y = e.pageY,
		deltaX = x - centerX,
		deltaY = y - centerY;
	if(Math.abs(deltaX) > sensitivity || Math.abs(deltaY) > sensitivity){
		let angle = geom.getAngle(centerX, centerY, x, y);
		callback(angle);
	} else {
		callback(-1, 0);
	}
}

function onRelease(e) {
	element.removeEventListener('mousemove', pressMove, false);
	callback(-1, 0);
	element.className = '';
}

function callback(angle, amount) {
	let pi = Math.PI, l = callbacks.length;
	element.className = 'active';
	if(angle === -1){
		updateDisplay('center');
	} else if(angle <= pi / 8 || angle > 15 * pi / 8)
		updateDisplay('up');
	else if(angle <= 3 * pi / 8)
		updateDisplay('upright');
	else if(angle <= 5 * pi / 8)
		updateDisplay('right');
	else if(angle <= 7 * pi / 8)
		updateDisplay('downright');
	else if(angle <= 9 * pi / 8)
		updateDisplay('down');
	else if(angle <= 11 * pi / 8)
		updateDisplay('downleft');
	else if(angle <= 13 * pi / 8)
		updateDisplay('left');
	else if(angle <= 15 * pi / 8)
		updateDisplay('upleft');
	for(let i=0; i<l; i++)
		callbacks[i](angle, amount);
}

module.exports = {
	init: function(_element, _maxDistance, _sensitivity, json){
		element = _element;
		maxDistance = _maxDistance;
		sensitivity = _sensitivity;
		spriteJson = json;
		init();
	},
	addCallback: function(_callback) {
		callbacks.push(_callback);
	}
};