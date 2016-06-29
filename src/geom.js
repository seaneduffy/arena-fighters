'use strict';

module.exports = {
	getAngle: function() {
		
	},
	getDistance: function(x1, x2, y1, y2) {
		let deltaX = x2 - x1,
			deltaY = y2 - y1;
		return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
	},
	getQuadrantOfAngle: function(angle) {
		
	}
}