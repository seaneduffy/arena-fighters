'use strict';

let pi = Math.PI,
	a45 = pi / 4,
	a90 = pi / 2,
	a135 = 3 * pi / 4,
	a180 = pi,
	a225 = 5 * pi / 4,
	a270 = 3 * pi / 2,
	a315 = 7 * pi / 4,
	a360 = 2 * pi,
	deg = 180/pi;

module.exports = {
	getAngle: function(x1, y1, x2, y2) {
		let deltaX = x2 - x1,
			deltaY = y2 - y1,
			angle = null,
			angle2 = null,
			rad;
		
		if(deltaX === 0 && deltaY === 0)
			angle = 0;
		else if(deltaX === 0 && deltaY < 0)
			angle = 0;
		else if(deltaX === 0 && deltaY > 0)
			angle = Math.PI;
		else if(deltaX < 0 && deltaY === 0)
			angle = 3 * Math.PI / 2;
		else if(deltaX > 0 && deltaY === 0)
			angle = Math.PI / 2;
		else {
			angle = Math.atan2(Math.abs(deltaY), Math.abs(deltaX));
			if(deltaX > 0 && deltaY > 0)
				angle2 = angle + Math.PI / 2;
			if(deltaX > 0 && deltaY < 0)
				angle2 = Math.PI / 2 - angle;
			if(deltaX < 0 && deltaY > 0)
				angle2 = 3 * Math.PI / 2 - angle;
			if(deltaX < 0 && deltaY < 0)
				angle2 += angle + 3 * Math.PI / 2;
			return angle2;
		}
		return angle;
	},
	getDistance: function(x1, y1, x2, y2) {
		let deltaX = x2 - x1,
			deltaY = y2 - y1;
		return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
	},
	getXYFromVector: function(x, y, angle, distance) {
		let point = {}, 
			tmpAngle = 0, 
			xModifier = 1,
			yModifier = 1;
		
		if(angle === 0 || angle === a360) {
			point.x = 0;
			point.y = -distance;
			return point;
		} else if(angle === a90) {
			point.x = distance;
			point.y = 0;
			return point;
		} else if(angle === a180) {
			point.x = 0;
			point.y = distance;
			return point;
		} else if(angle === a270) {
			point.x = -distance;
			point.y = 0;
			return point;
		} else if(angle < a90) {
			tmpAngle = a90 - angle;
			xModifier = 1;
			yModifier = -1;
		} else if(angle < a180) {
			tmpAngle = angle - a90;
			xModifier = 1;
			yModifier = 1;
		} else if(angle < a270) {
			tmpAngle = a270 - angle;
			xModifier = -1;
			yModifier = 1;
		} else {
			tmpAngle = angle - a270;
			xModifier = -1;
			yModifier = -1;
		}
		point.x = Math.cos(tmpAngle) * distance * xModifier; 
		point.y = Math.sin(tmpAngle) * distance * yModifier;
		return point;
	},
	getVectorFromXYAngle: function(x, y, angle) {
		let point = {};
		if(angle === 0 || angle === a360) {
			point.x = 0;
			point.y = -y;
			return point;
		} else if(angle === a45) {
			point.x = x;
			point.y = -y;
			return point;
		} else if(angle === a90) {
			point.x = x;
			point.y = 0;
			return point;
		} else if(angle === a135) {
			point.x = x;
			point.y = y;
			return point;
		} else if(angle === a180) {
			point.x = 0;
			point.y = y;
			return point;
		} else if(angle === a225) {
			point.x = -x;
			point.y = y;
			return point;
		} else if(angle === a270) {
			point.x = -x;
			point.y = 0;
			return point;
		} else if(angle === a315) {
			point.x = -x;
			point.y = -y;
			return point;
		} else {
			let n = Math.floor(angle / a45),
				tmpAngle = angle % a45,
				xModifier = 1,
				yModifier = 1,
				divBy2 = n / 2;
			if(n === 0 || n === 3 || n === 4 || n === 7) {
				tmpAngle = angle % a90;
				if(tmpAngle > a45)
					tmpAngle = a90 - tmpAngle;
				point.x = Math.tan(tmpAngle) * x;
				point.y = y;
			} else {
				tmpAngle = angle % a90;
				if(tmpAngle > a45)
					tmpAngle = a90 - tmpAngle;
				point.x = x;
				point.y = Math.tan(tmpAngle) * y;
			}
			if(angle < a90) {
				point.y *= -1;
			} else if(angle < a180) {
			} else if(angle < a270) {
				point.x *= -1;
			} else {
				point.x *= -1;
				point.y *= -1;
			}
		}
		return point;
	}
}