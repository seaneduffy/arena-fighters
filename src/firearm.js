'use strict';

let GameObject = require('./gameObject')

function Firearm(){
	GameObject.prototype.constructor.call(this);
}

Firearm.prototype = Object.create(GameObject.prototype, {
	'ammunition': {
		get: function(){
			return this._ammunition;
		},
		set: function(ammunition){
			this._ammunition = ammunition;
		}
	}
});

module.exports = Firearm;