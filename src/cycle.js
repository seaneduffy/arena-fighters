let clientUpdateFunctions = [],
	uiFunctions = [],
	serverUpdateFunctions = [],
	cleanupFunctions = [],
	active = false,
	i = 0,
	l = 0;

function cycle() {
	if(active) {
		l = clientUpdateFunctions.length;
		for(i=0; i<l; i++) {
			clientUpdateFunctions[i]();
		}
		l = uiFunctions.length;
		for(i=0; i<l; i++) {
			uiFunctions[i]();
		}
		l = serverUpdateFunctions.length;
		for(i=0; i<l; i++) {
			serverUpdateFunctions[i]();
		}
		l = cleanupFunctions.length;
		for(i=0; i<l; i++) {
			cleanupFunctions[i]();
		}
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
	addUI: function(func) {
		uiFunctions.push(func);
	},
	removeUI: function(func) {
		uiFunctions.splice(uiFunctions.indexOf(func), 1);
	},
	addClientUpdate: function(func) {
		clientUpdateFunctions.push(func);
	},
	removeClientUpdate: function(func) {
		clientUpdateFunctions.splice(clientUpdateFunctions.indexOf(func), 1);
	},
	addServerUpdate: function(func) {
		serverUpdateFunctions.push(func);
	},
	removeServerUpdate: function(func) {
		serverUpdateFunctions.splice(serverUpdateFunctions.indexOf(func), 1);
	},
	addCleanup: function(func) {
		cleanupFunctions.push(func);
	},
	removeCleanup: function(func) {
		cleanupFunctions.splice(cleanupFunctions.indexOf(func), 1);
	},
};