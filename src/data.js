'use strict';

let config = require('./config'),
	cycle = require('./cycle'),
	callback = null;

function processData(json) {
	let settings = json.settings,
		windowInnerWidth = window.innerWidth,
		windowInnerHeight = window.innerHeight,
		resAppend = '',
		stageWidth = 0,
		stageHeight = 0,
		wallPadding = processValue(settings.wallPadding),
		sdWidth = processValue(settings.sdWidth),
		sdHeight = processValue(settings.sdHeight),
		mdWidth = processValue(settings.mdWidth),
		mdHeight = processValue(settings.mdHeight),
		hdWidth = processValue(settings.hdWidth),
		hdHeight = processValue(settings.hdHeight),
		spriteImgPath = '/img/sprites/',
		resolution = 1,
		windowWidth = config.windowWidth = windowInnerWidth > windowInnerHeight ? windowInnerWidth : windowInnerHeight,
		windowHeight = config.windowHeight = windowInnerWidth < windowInnerHeight ? windowInnerWidth : windowInnerHeight,
		gameObjects = config.gameObjects = settings.gameObjects,
		levels = config.levels = json.levels,
		stageCenterX = 0,
		stageCenterY = 0,
		imagesToLoad = config.imagesToLoad = new Array(),
		property = '',
		type = '',
		sprite = '',
		frames = null;
	
	cycle.setFrameRate(settings.frameRate);

	if(windowWidth <= settings.sdWidth) {
		stageWidth = settings.sdWidth;
		stageHeight = settings.sdHeight;
		resAppend = '-sd';
	} else if(windowWidth <= settings.mdWidth) {
		stageWidth = settings.mdWidth;
		stageHeight = settings.mdHeight;
		resAppend = '-md';
	} else {
		stageWidth = settings.hdWidth;
		stageHeight = settings.hdHeight;
		resAppend = '-hd';
	}
	
	config.stageWidth = stageWidth;
	config.stageHeight = stageHeight;
	
	
	
	stageCenterX = config.stageCenterX = stageWidth / 2;
	stageCenterY = config.stageCenterY = stageHeight / 2;
	config.joystick = json['joystick'+resAppend];
	config.fire = json['fire'+resAppend];
	config.fireBtnImage = spriteImgPath+'fire'+resAppend+'.png';
	imagesToLoad.push(config.fireBtnImage);
	config.joystickImage = spriteImgPath+'joystick'+resAppend+'.png';
	imagesToLoad.push(config.joystickImage);

	resolution = config.resolution = windowWidth / stageWidth;
	
	config.domElement.style.width = stageWidth * resolution + 'px';
	config.domElement.style.height = stageHeight * resolution + 'px';
	config.joystickMin = settings.joystickMin * resolution;
	config.joystickMax = settings.joystickMax * resolution;
	wallPadding *= resolution;
	
	config.topWall = {
		x: 0,
		y: 0,
		width: stageWidth * resolution,
		height: wallPadding
	};
	config.leftWall = {
		x: 0,
		y: 0,
		width: wallPadding,
		height: stageHeight * resolution
	};
	config.rightWall = {
		x: stageWidth * resolution - wallPadding,
		y: 0,
		width: wallPadding,
		height: stageHeight * resolution
	};
	config.bottomWall = {
		x: 0,
		y: stageHeight * resolution - wallPadding,
		width: stageWidth * resolution,
		height: wallPadding
	};

	levels.forEach(level=>{
		level.forEach(levelData=>{
			if(!!levelData.properties) {
				for(property in levelData.properties) {
					levelData.properties[property] = processValue(levelData.properties[property]);
					if(property === 'x' || property === 'y' || property === 'speed')
						levelData.properties[property] *= resolution;
				}
			}
		});
	});

	for(type in gameObjects) {
		for(property in gameObjects[type].properties) {
			gameObjects[type].properties[property] = processValue(gameObjects[type].properties[property]);
			if(property === 'x' || property === 'y' || property === 'speed')
				gameObjects[type].properties[property] *= resolution;
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