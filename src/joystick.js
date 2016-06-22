let settings = require('./settings'),
	element = null,
	callbacks = [],
	isTouch = checkTouch(),
	centerX = null,
	centerY = null,
	touchX = null,
	touchY = null,
	deltaX = null,
	deltaY = null,
	sensitivity = 40,
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
	element.style.background = 'url('+settings.joystickImage+')';
	let imageInfo = spriteJson[directions.center+'.png'].frame;
	element.style.width = imageInfo.w + 'px';
	element.style.height = imageInfo.h + 'px';
	updateDisplay(directions.center);
}

function startTouch(e) {
	e.preventDefault();
	centerX = e.touches[0].pageX;
	centerY = e.touches[0].pageY;
}

function callback(label) {
	updateDisplay(label);
	element.className = 'active';
	let l = callbacks.length;
	for(let i=0; i<l; i++)
		callbacks[i](label);
}

function touchMove(e) {
	touchX = e.touches[0].pageX;
	touchY = e.touches[0].pageY;
	deltaX = touchX - centerX;
	deltaY = touchY - centerY;
	if(deltaX < -sensitivity && deltaY > sensitivity) {
		callback(directions.downLeft);
	} else if(deltaX > sensitivity && deltaY > sensitivity) {
		callback(directions.downRight);
	} else if(deltaX < -sensitivity && deltaY < -sensitivity) {
		callback(directions.upLeft);
	} else if(deltaX > sensitivity && deltaY < -sensitivity) {
		callback(directions.upRight);
	} else if(deltaX < -sensitivity) {
		callback(directions.left);
	} else if(deltaX > sensitivity) {
		callback(directions.right);
	} else if(deltaY > sensitivity) {
		callback(directions.down);
	} else if(deltaY < -sensitivity) {
		callback(directions.up);
	} else {
		callback(directions.center);
	}
}

function endTouch(e) {
	callback(directions.center);
	element.className = '';
}

module.exports = {
	init: function(_element, data, up, down, left, right, upLeft, upRight, downLeft, downRight, center){
		element = _element;
		directions.up = up;
		directions.down = down;
		directions.left = left;
		directions.right = right;
		directions.upLeft = upLeft;
		directions.upRight = upRight;
		directions.downLeft = downLeft;
		directions.downRight = downRight;
		directions.center = center;
		spriteJson = data.frames;
		init();
	},
	addCallback: function(_callback) {
		callbacks.push(_callback);
	}
};