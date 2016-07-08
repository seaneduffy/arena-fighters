let global = require('./global'),
	clientUpdateFunctions = [],
	uiUpdateFunctions = [],
	gameObjectUpdateFunctions = [],
	serverUpdateFunctions = [],
	cleanupFunctions = [],
	toRemove = [],
	active = false,
	i = 0,
	l = 0,
	tmpFunc = null,
	tmpArr = null,
	tmpGameObject = null,
	counter = 0,
	frameRate = null;

function cycle() {
	if(active) {
		if(counter % frameRate === 0) {
			clientUpdateFunctions.forEach(func=>{ func() });
			gameObjectUpdateFunctions.filter(funcObject=>{
				if(!!funcObject) {
					if(!funcObject.obj.destroyed) {
						funcObject.func();
						return funcObject;
					}
				}
				return false;
			});
			uiUpdateFunctions.forEach(func=>{ func() });
			serverUpdateFunctions.forEach(func=>{ func() });
			cleanupFunctions.forEach(func=>{ func() });
			toRemove.forEach(removeObj=>{
				removeObj.arr.splice(removeObj.arr.indexOf(removeObj.func), 1);
			});
			toRemove = [];
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
		frameRate = global.settings.frameRate;
		window.requestAnimationFrame(cycle);
	},
	stop: function() {
		active = false;
		counter = 0;
	},
	addUIUpdateFunction: function(func) {
		uiUpdateFunctions.push(func);
	},
	removeUIUpdateFunction: function(func) {
		toRemove.push({
			arr: uiUpdateFunctions,
			func: func
		});
	},
	addGameObjectUpdateFunction: function(obj, func) {
		gameObjectUpdateFunctions.push({
			obj: obj,
			func: func
		});
	},
	addClientUpdate: function(func) {
		clientUpdateFunctions.push(func);
	},
	removeClientUpdate: function(func) {
		toRemove.push({
			arr: clientUpdateFunctions,
			func: func
		});
	},
	addServerUpdate: function(func) {
		serverUpdateFunctions.push(func);
	},
	removeServerUpdate: function(func) {
		toRemove.push({
			arr: serverUpdateFunctions,
			func: func
		});
	},
	addCleanup: function(func) {
		cleanupFunctions.push(func);
	},
	removeCleanup: function(func) {
		toRemove.push({
			arr: cleanupFunctions,
			func: func
		});
	},
};