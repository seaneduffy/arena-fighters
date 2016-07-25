let config = require('../config'),
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

function init() {
	if(isTouch) {
		element.addEventListener('touchstart', startTouch, false);
		element.addEventListener('touchmove', touchMove, false);
		element.addEventListener('touchend', endTouch, false);
	} else {
		element.addEventListener('mousedown', onPress, false);
		element.addEventListener('mouseup', onRelease, false);
	}
	element.style.background = 'url('+config.controlsImage+')';
	let imageInfo = json['bg'].frame;
	element.style.width = imageInfo.w + 'px';
	element.style.height = imageInfo.h + 'px';
	element.style.backgroundPosition = -imageInfo.x+'px '+-imageInfo.y+'px';
	imageInfo = json['ball'].frame;
	ball.style.width = imageInfo.w + 'px';
	ball.style.height = imageInfo.h + 'px';
	ball.style.background = 'url('+config.controlsImage+')';
	ball.style.backgroundPosition = -imageInfo.x+'px '+-imageInfo.y+'px';
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
	let amount = geom.getDistance(centerX, centerY, touchX, touchY),
		angle = geom.getAngle(centerX, centerY, touchX, touchY),
		per = 0;
	if(amount > maxDistance) amount = maxDistance;
	if(Math.abs(deltaX) > sensitivity || Math.abs(deltaY) > sensitivity) {
		let per = amount / maxDistance;
		callback(angle, per);
	} else {
		callback(angle, per);
	}
	let ballXY = geom.getXYFromVector(0, 0, angle, amount);
	ball.style.transform = 'translate('+(ballXY.x-50)+'%,'+(ballXY.y-50)+'%)';
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
	let x = e.pageX,
		y = e.pageY,
		deltaX = x - centerX,
		deltaY = y - centerY;
	let amount = geom.getDistance(centerX, centerY, touchX, touchY),
		angle = geom.getAngle(centerX, centerY, touchX, touchY),
		per = 0;
	if(amount > maxDistance) amount = maxDistance;
	if(Math.abs(deltaX) > sensitivity || Math.abs(deltaY) > sensitivity) {
		let per = amount / maxDistance;
		callback(angle, per);
	} else {
		callback(angle, per);
	}
	let ballXY = geom.getXYFromVector(0, 0, angle, amount);
	ball.style.transform = 'translate('+(ballXY.x-50)+'%,'+(ballXY.y-50)+'%)';
}

function onRelease(e) {
	callback(-1, 0);
	element.className = '';
	ball.style.transform = 'translate(-50%, -50%)';
}

module.exports = {
	init: function(_element, _maxDistance, _sensitivity, _json, _callback){
		element = _element;
		ball = element.querySelector('.ball');
		maxDistance = _maxDistance;
		sensitivity = _sensitivity;
		json = _json;
		callback = _callback;
		init();
	}
};