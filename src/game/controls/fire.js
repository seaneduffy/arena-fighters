let config = require('../config'),
	element = null,
	json = null,
	callback = null;

function press() {
	element.className = 'active';
	element.style.backgroundPosition = (-json['fire_down'].frame.x)+'px '+(-json['fire_down'].frame.y)+'px';
	callback();
}

function release() {
	element.className = '';
	element.style.backgroundPosition = (-json['fire_up'].frame.x)+'px '+(-json['fire_up'].frame.y)+'px';
}

module.exports = {
	init: function(_element, _json, _callback) {
		element = _element;
		json = _json;
		callback = _callback;
		element.style.background = 'url('+config.controlsImage+')';
		element.style.width = json['fire_up'].frame.w + 'px';
		element.style.height = json['fire_up'].frame.h + 'px';
		element.style.backgroundPosition = (-json['fire_up'].frame.x)+'px '+(-json['fire_up'].frame.y)+'px';
		element.addEventListener('touchstart', press, false);
		element.addEventListener('touchend', release, false);
	}
}