let prepFunctions = [],
	cycleFunctions = [],
	cleanupFunctions = [],
	active = false,
	i = 0,
	l = 0;

function cycle() {
	if(active) {
		l = prepFunctions.length;
		for(i=0; i<l; i++) {
			prepFunctions[i]();
		}
		l = cycleFunctions.length;
		for(i=0; i<l; i++) {
			cycleFunctions[i]();
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
	addPrep: function(func) {
		prepFunctions.push(func);
	},
	addCycle: function(func) {
		cycleFunctions.push(func);
	},
	removeCycle: function(func) {
		cycleFunctions.splice(cycleFunctions.indexOf(func), 1);
	},
	addCleanup: function(func) {
		cleanupFunctions.push(func);
	}
};