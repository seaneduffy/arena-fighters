let clientUpdateFunctions = [],
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
	tmpGameObject = null;
	
function cycle() {
	if(active) {
		l = clientUpdateFunctions.length;
		for(i=0; i<l; i++) {
			clientUpdateFunctions[i]();
		}
		l = gameObjectUpdateFunctions.length;
		for(i=0; i<l; i++) {
			tmpGameObject = gameObjectUpdateFunctions[i].obj;
			tmpFunc = gameObjectUpdateFunctions[i].func;
			if(tmpGameObject.destroyed) {
				gameObjectUpdateFunctions.splice(i,1);
				i--;
				l--;
			} else {
				tmpFunc();
			}
		}
		l = uiUpdateFunctions.length;
		for(i=0; i<l; i++) {
			uiUpdateFunctions[i]();
		}
		l = serverUpdateFunctions.length;
		for(i=0; i<l; i++) {
			serverUpdateFunctions[i]();
		}
		l = cleanupFunctions.length;
		for(i=0; i<l; i++) {
			cleanupFunctions[i]();
		}
		l = toRemove.length;
		for(i=0; i<l; i++) {
			tmpArr = toRemove[i].arr;
			tmpFunc = toRemove[i].func;
			tmpArr.splice(tmpArr.indexOf(tmpFunc), 1);
			i--;
			l--;
		}
		toRemove = [];
		window.requestAnimationFrame(cycle);
	}
}



module.exports = {
	start: function() {
		active = true;
		window.requestAnimationFrame(cycle);
	},
	stop: function() {
		active = false;
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