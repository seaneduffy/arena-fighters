'use strict';

let config = require('./config'),
	utils = require('./utils'),
	callback = null;

function processData(json) {
	let settings = json.settings,
		windowInnerWidth = window.innerWidth,
		windowInnerHeight = window.innerHeight;
	config.settings = json.settings;
	config.levels = json.levels;
	config.gameObjects = settings.gameObjects;
	config.windowWidth = windowInnerWidth > windowInnerHeight ? windowInnerWidth : windowInnerHeight;
	config.windowHeight = windowInnerWidth < windowInnerHeight ? windowInnerWidth : windowInnerHeight;
	config.maxWidth = utils.processValue(settings.maxWidth);
	config.maxHeight = utils.processValue(settings.maxHeight);
	config.wallPadding = utils.processValue(settings.wallPadding);
	settings.sdWidth = utils.processValue(settings.sdWidth);
	settings.sdHeight = utils.processValue(settings.sdHeight);
	settings.mdWidth = utils.processValue(settings.mdWidth);
	settings.mdHeight = utils.processValue(settings.mdHeight);
	settings.hdWidth = utils.processValue(settings.hdWidth);
	settings.hdHeight = utils.processValue(settings.hdHeight);

	if(config.windowWidth <= settings.sdWidth) {
		config.stageWidth = settings.sdWidth;
		config.stageHeight = settings.sdHeight;
		config.spriteImgPath = config.sdImgPath;
		config.joystick = json['joystick-sd'];
		config.fire = json['fire-sd'];
	} else if(config.windowWidth <= settings.mdWidth) {
		config.stageWidth = settings.mdWidth;
		config.stageHeight = settings.mdHeight;
		config.spriteImgPath = config.mdImgPath;
		config.joystick = json['joystick-md'];
		config.fire = json['fire-md'];
	} else {
		config.stageWidth = settings.hdWidth;
		config.stageHeight = settings.hdHeight;
		config.spriteImgPath = config.hdImgPath;
		config.joystick = json['joystick-hd'];
		config.fire = json['fire-hd'];
	}

	config.resolution = config.windowWidth / config.stageWidth;
	
	config.positionScale = config.stageWidth / config.maxWidth;
	config.stageCenterX = utils.processValue(settings.stageCenterX);
	config.stageCenterY = utils.processValue(settings.stageCenterY);
	config.joystickMin = settings.joystickMin * config.positionScale;
	config.joystickMax = settings.joystickMax * config.positionScale;
	config.wallPadding = settings.wallPadding * config.positionScale;
	config.topWall = {
		x: 0,
		y: 0,
		width: config.stageWidth,
		height: config.wallPadding
	};
	config.leftWall = {
		x: 0,
		y: 0,
		width: config.wallPadding,
		height: config.stageHeight
	};
	config.rightWall = {
		x: config.stageWidth - config.wallPadding,
		y: 0,
		width: config.wallPadding,
		height: config.stageHeight
	};
	config.bottomWall = {
		x: 0,
		y: config.stageHeight - config.wallPadding,
		width: config.stageWidth,
		height: config.wallPadding
	};
	config.imagesToLoad = [
		config.fireBtnImage,
		config.joystickImage
	];
	
	let property = '',
		type = '';

	config.levels.forEach(level=>{
		level.forEach(levelData=>{
			if(!!levelData.properties) {
				for(property in levelData.properties) {
					levelData.properties[property] = utils.processValue(levelData.properties[property]);
					if(property === 'x' || property === 'y' || property === 'speed')
						levelData.properties[property] *= config.positionScale;
				}
			}
		});
	});

	for(type in config.gameObjects) {
		for(property in config.gameObjects[type].properties) {
			config.gameObjects[type].properties[property] = utils.processValue(config.gameObjects[type].properties[property]);
			if(property === 'x' || property === 'y' || property === 'speed')
				config.gameObjects[type].properties[property] *= config.positionScale;
		}
		if(!!config.gameObjects[type].properties.sprites) {
			config.imagesToLoad.push(config.spriteImgPath+type+'.png');
			config.gameObjects[type].spriteMeta = {
				img: config.spriteImgPath+type+'.png',
				frames: config.gameObjects[type].properties.sprites
			};
		}
		if(!!config.gameObjects[type].properties.sprite) {
			config.imagesToLoad.push(config.spriteImgPath+type+'.png');
			config.gameObjects[type].properties.sprite = config.spriteImgPath+type+'.png';
		}
	}
	callback();
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