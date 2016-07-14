'use strict';

let config = require('./config'),
	cycle = require('./cycle'),
	callback = null;

function processData(json) {
	let settings = json.settings,
		windowInnerWidth = window.innerWidth,
		windowInnerHeight = window.innerHeight,
		resAppend = '',
		windowWidth_max = processValue(settings.stageWidth),
		windowHeight_max = processValue(settings.stageHeight),
		windowWidth_srcRes = 0,
		windowHeight_srcRes = 0,
		wallPadding = processValue(settings.wallPadding),
		sdWidth = processValue(settings.sdWidth),
		sdHeight = processValue(settings.sdHeight),
		mdWidth = processValue(settings.mdWidth),
		mdHeight = processValue(settings.mdHeight),
		hdWidth = processValue(settings.hdWidth),
		hdHeight = processValue(settings.hdHeight),
		spriteImgPath = '/img/sprites/',
		positionScale = 1,
		windowWidth = config.windowWidth = windowInnerWidth > windowInnerHeight ? windowInnerWidth : windowInnerHeight,
		windowHeight = config.windowHeight = windowInnerWidth < windowInnerHeight ? windowInnerWidth : windowInnerHeight,
		gameObjects = config.gameObjects = settings.gameObjects,
		levels = config.levels = json.levels,
		resolution = 1,
		windowCenterX = config.windowCenterX = windowWidth / 2,
		windowCenterY = config.windowCenterY = windowHeight / 2,
		imagesToLoad = config.imagesToLoad = new Array(),
		property = '',
		type = '',
		sprite = '',
		frames = null;
	
	
	config.domElement.style.width = windowWidth+'px';
	config.domElement.style.height = windowHeight+'px';
	cycle.setFrameRate(settings.frameRate);

	if(windowWidth <= settings.sdWidth) {
		windowWidth_srcRes = settings.sdWidth;
		windowHeight_srcRes = settings.sdHeight;
		resAppend = '-sd';
	} else if(windowWidth <= settings.mdWidth) {
		windowWidth_srcRes = settings.mdWidth;
		windowHeight_srcRes = settings.mdHeight;
		resAppend = '-md';
	} else {
		windowWidth_srcRes = settings.hdWidth;
		windowHeight_srcRes = settings.hdHeight;
		resAppend = '-hd';
	}

	config.joystick = json['joystick'+resAppend];
	config.fire = json['fire'+resAppend];
	config.fireBtnImage = spriteImgPath+'fire'+resAppend+'.png';
	imagesToLoad.push(config.fireBtnImage);
	config.joystickImage = spriteImgPath+'joystick'+resAppend+'.png';
	imagesToLoad.push(config.joystickImage);

	resolution = config.resolution = windowWidth / windowWidth_srcRes;
	
	positionScale = windowWidth_srcRes / windowWidth_max;
	config.joystickMin = settings.joystickMin * positionScale;
	config.joystickMax = settings.joystickMax * positionScale;
	wallPadding *= positionScale;
	
	config.topWall = {
		x: 0,
		y: 0,
		width: windowWidth,
		height: wallPadding
	};
	config.leftWall = {
		x: 0,
		y: 0,
		width: wallPadding,
		height: windowHeight
	};
	config.rightWall = {
		x: windowWidth - wallPadding,
		y: 0,
		width: wallPadding,
		height: windowHeight
	};
	config.bottomWall = {
		x: 0,
		y: windowHeight - wallPadding,
		width: windowWidth,
		height: wallPadding
	};

	levels.forEach(level=>{
		level.forEach(levelData=>{
			if(!!levelData.properties) {
				for(property in levelData.properties) {
					levelData.properties[property] = processValue(levelData.properties[property]);
					if(property === 'x' || property === 'y' || property === 'speed')
						levelData.properties[property] *= positionScale;
				}
			}
		});
	});

	for(type in gameObjects) {
		for(property in gameObjects[type].properties) {
			gameObjects[type].properties[property] = processValue(gameObjects[type].properties[property]);
			if(property === 'x' || property === 'y' || property === 'speed')
				gameObjects[type].properties[property] *= positionScale;
		}
		if(!!gameObjects[type].properties.spriteLabels) {
			imagesToLoad.push(spriteImgPath+type+resAppend+'.png');
			frames = {};
			for(sprite in json[type+resAppend]) {
				frames[sprite] = json[type+resAppend][sprite];
			}
			gameObjects[type].properties.spriteMeta = {
				img: spriteImgPath+type+resAppend+'.png',
				frames: frames
			};
		} else {
			imagesToLoad.push(spriteImgPath+type+resAppend+'.png');
			gameObjects[type].properties.image = spriteImgPath+type+resAppend+'.png';
		}
	}
	callback();
}

function processValue(value) {
	if(typeof value === 'string' && value.indexOf('config.') !== -1) {
		let values = value.match(/[config\.|a-z|A-Z|0-9]+/g),
			operators = value.match(/[\+|\/|\-|\*]/g),
			operator = '',
			l = values.length;
	
		for(let i=0; i<l; i++) {
			if(values[i].indexOf('config.') !== -1) {
				values[i] = config[values[i].replace('config.','')] * 1;
			}
			values[i] *= 1;
			if(i !== 0) {
				operator = operators[i-1];
				if(operator === '+')
					value += values[i];
				else if(operator === '-')
					value -= values[i];
				else if(operator === '*')
					value *= values[i];
				else if(operator === '/')
					value /= values[i];
			} else {
				value = values[i];
			}
		}
	}
	return value;
}

function loadData(uri) {
	let xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', uri, true);   
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			processData(JSON.parse(xobj.responseText));
		}
	}
	xobj.send(null);
}

module.exports = {
	load: function(callbackFunction) {
		callback = callbackFunction;
		loadData(config.jsonUri);
	}
}