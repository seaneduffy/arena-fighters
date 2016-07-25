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
	frameRate = 1,
	startTime = 0;

function cycle() {
	if(active) {
		
		window.requestAnimationFrame(cycle);
		
		let time = Date.now(),
			elapsedTime = time - startTime;
		
		if(elapsedTime >= frameRate) {

			startTime = time;
			
			updateFunctions.forEach(funcObj=>{
				if(funcObj.elapsedTime >= funcObj.rate) {
					funcObj.func();
					funcObj.elapsedTime = 0;
				} else {
					funcObj.elapsedTime += frameRate;
				}
			});
			
			serverFunctions.forEach(func=>{ func() });
			
			cleanupFunctions.forEach(func=>{ func() });
			
			waitFunctions.forEach(funcObj=>{
				if(funcObj.elapsedTime >= funcObj.endTime) {
					funcObj.func();
					waitToRemove.push(funcObj.func);
				} else {
					funcObj.elapsedTime += frameRate;
				}
			});
	
			if(updateToRemove.length > 0) {
				arr = new Array();
				updateFunctions.forEach(funcObj=>{ 
					if(typeof updateToRemove.find( removeFunc => {
						return funcObj.func === removeFunc
					}) === 'undefined') {
						arr.push(funcObj);
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
						arr.push(funcObj);
					}
				});
				waitFunctions = arr;
				waitToRemove = new Array();
			}
		}
	}
}

module.exports = {
	start: function() {
		startTime = Date.now();
		active = true;
		window.requestAnimationFrame(cycle);
	},
	stop: function() {
		active = false;
	},
	addUpdate: function(func, rate) {
		updateFunctions.push({
			func: func,
			elapsedTime: 0,
			rate: rate || frameRate
		});
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
	wait: function(func, endTime, log) {
		waitFunctions.push({func:func, elapsedTime:0, endTime:endTime, log: log || false});
	},
	endWait: function(func) {
		let arr = new Array();
		waitFunctions.forEach(funcObj=>{ 
			if(funcObj.func !== func) {
				arr.push(funcObj);
			}
		});
		waitFunctions = arr;
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