let config = require('./config'),
	updateFunctions = new Array(),
	serverFunctions = new Array(),
	cleanupFunctions = new Array(),
	updateToRemove = new Array(),
	serverToRemove = new Array(),
	cleanupToRemove = new Array(),
	waitFunctions = new Array(),
	waitToRemove = new Array(),
	arr = null,
	active = false,
	counter = 0,
	frameRate = 1;

function cycle() {
	if(active) {
		if(counter % frameRate === 0) {
			updateFunctions.forEach(func=>{ func() });
			serverFunctions.forEach(func=>{ func() });
			cleanupFunctions.forEach(func=>{ func() });
			waitFunctions.forEach(funcObj=>{
				if(counter >= funcObj.counter) {
					funcObj.func();
					waitToRemove.push(funcObj.func);
				}	
			});
			
			if(updateToRemove.length > 0) {
				arr = new Array();
				updateFunctions.forEach(func=>{ 
					if(typeof updateToRemove.find( removeFunc => {
						return func === removeFunc
					}) === 'undefined') {
						arr.push(func);
					}
				});
				updateFunctions = arr;
				updateToRemove = new Array();
			}
			
			if(serverToRemove.length > 0) {
				arr = new Array();
				serverFunctions.forEach(func=>{ 
					if(typeof serverToRemove.find( removeFunc => {
						return func === removeFunc
					}) === 'undefined') {
						arr.push(func);
					}
				});
				serverFunctions = arr;
				serverToRemove = new Array();
			}
			
			if(cleanupToRemove.length > 0) {
				arr = new Array();
				cleanupFunctions.forEach(func=>{ 
					if(typeof cleanupToRemove.find( removeFunc => {
						return func === removeFunc
					}) === 'undefined') {
						arr.push(func);
					}
				});
				cleanupFunctions = arr;
				cleanupToRemove = new Array();
			}
			
			if(waitToRemove.length > 0) {
				arr = new Array();
				waitFunctions.forEach(funcObj=>{ 
					if(typeof waitToRemove.find( removeFunc => {
						return funcObj.func === removeFunc
					}) === 'undefined') {
						arr.push(func);
					} else {
						console.log('removed in array');
					}
				});
				waitFunctions = arr;
				waitToRemove = new Array();
			}
		}
		counter++;
		if(active)
			window.requestAnimationFrame(cycle);
	}
}

module.exports = {
	getCounter: function() {return counter},
	start: function() {
		active = true;
		window.requestAnimationFrame(cycle);
	},
	stop: function() {
		active = false;
		counter = 0;
	},
	addUpdate: function(func) {
		updateFunctions.push(func);
	},
	removeUpdate: function(func) {
		updateToRemove.push(func);
	},
	addServer: function(func) {
		serverFunctions.push(func);
	},
	removeServer: function(func) {
		serverToRemove.push(func);
	},
	addCleanup: function(func) {
		cleanupFunctions.push(func);
	},
	removeCleanup: function(func) {
		cleanupToRemove.push(func);
	},
	setFrameRate: function(rate) {
		frameRate = rate;
	},
	wait: function(func, time) {
		console.log('wait');
		waitFunctions.push({func:func,counter:counter+time});
	},
	endWait: function(func) {
		console.log('end wait');
		waitToRemove.push(func);
	}
};

if(config.dev) {
	window.getCycleUpdateTotal = function() {
		return updateFunctions.length;
	}
	window.getCycleServerTotal = function() {
		return serverFunctions.length;
	}
	window.getCycleCleanupTotal = function() {
		return cleanupFunctions.length;
	}
}