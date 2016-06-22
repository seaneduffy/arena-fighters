'use strict';

let state = Object.create(null);

module.exports = {
	setProperty: function(key, value){
		if(value.destroyed)
			delete state[key];
		else {
			if(!state[key]) {
				state[key] = Object.create(null);
			}
			state[key] = value;
		}
	},
	getProperty: function(key){
		return state[key];
	},
	getState: function(){
		return state;
	},
	setState: function(obj) {
		state = obj;
	}
}