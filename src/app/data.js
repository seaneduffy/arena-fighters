'use strict';

let config = require('./config'),
	cycle = require('./cycle'),
	Grunt = require('./displayObject/enemies/grunt'),
	Devil = require('./displayObject/enemies/devil'),
	Robot = require('./displayObject/enemies/robot'),
	Player = require('./displayObject/player'),
	Firearm = require('./displayObject/firearm'),
	Ammunition = require('./displayObject/ammunition'),
	DisplayObject = require('./displayObject/displayObject'),
	callback = null;

function processData(json) {
	let settings = json.settings,
		scalar = settings.scalar,
		stageWidth = config.stageWidth = processValue(settings.stageWidth),
		stageHeight = config.stageHeight = processValue(settings.stageHeight),
		windowInnerWidth = window.innerWidth,
		windowInnerHeight = window.innerHeight,
		resAppend = '',
		resWidth = 0,
		resHeight = 0,
		resValues = config.resValues = ','+settings.resValues.join(',')+',',
		distanceValues = config.distanceValues = ','+settings.distanceValues.join(',')+',',
		scalars = config.scalars = settings.scalars,
		wallPadding = 0,
		resolutions = settings.resolutions,
		spriteImgPath = '/img/sprites/',
		resolutionScale = 1,
		distanceScale = 1,
		windowWidth = config.windowWidth = windowInnerWidth > windowInnerHeight ? windowInnerWidth : windowInnerHeight,
		windowHeight = config.windowHeight = windowInnerWidth < windowInnerHeight ? windowInnerWidth : windowInnerHeight,
		displayObjects = config.displayObjects = settings.displayObjects,
		levels = config.levels = json.levels,
		stageCenterX = 0,
		stageCenterY = 0,
		imagesToLoad = config.imagesToLoad = new Array(),
		property = '',
		type = '',
		sprite = '',
		frames = null,
		image = '';

	config.frameRate = 1000 / settings.frameRate;
	cycle.setFrameRate(config.frameRate);
	
	for(let resolution in resolutions) {
		
		resWidth = processValue(resolutions[resolution].width),
		resHeight = processValue(resolutions[resolution].height);
		if(resWidth > windowWidth && resHeight > windowHeight) {
			resAppend = '-' + resolution;
			break;
		}
	}
	
	stageCenterX = config.stageCenterX = stageWidth / 2;
	stageCenterY = config.stageCenterY = stageHeight / 2;

	resolutionScale = config.resolutionScale = windowHeight / resHeight;
	distanceScale = config.distanceScale = windowHeight / stageHeight;
	
	config.domElement.style.width = resWidth * resolutionScale + 'px';
	config.domElement.style.height = resHeight * resolutionScale + 'px';
	
	config.joystickFrameRate = processValue(settings.joystickFrameRate);
	config.controls = json['controls'+resAppend];
	config.controlsImage = spriteImgPath+'controls'+resAppend+'.png';
	imagesToLoad.push(config.controlsImage);
	config.joystickMin = settings.joystickMin * distanceScale;
	config.joystickMax = settings.joystickMax * distanceScale;
	
	wallPadding = processValue(settings.wallPadding);
	config.topWall = {
		x: 0,
		y: 0,
		width: stageWidth,
		height: wallPadding
	};
	config.leftWall = {
		x: 0,
		y: 0,
		width: wallPadding,
		height: stageHeight
	};
	config.rightWall = {
		x: stageWidth - wallPadding,
		y: 0,
		width: wallPadding,
		height: stageHeight
	};
	config.bottomWall = {
		x: 0,
		y: stageHeight - wallPadding,
		width: stageWidth,
		height: wallPadding
	};

	levels.forEach(level=>{
		level.forEach(levelData=>{
			if(!!levelData.properties) {
				processConfig(levelData.properties)
				for(property in levelData.properties) {
					levelData.properties[property] = processValue(levelData.properties[property]);
				}
			}
		});
	});
	
	processConfig(displayObjects);
	
	for(type in displayObjects) {
		displayObjects[type].forEach(function(displayObjectData){
			if(type === 'enemy') {
				if(displayObjectData.id === 'devil')
					displayObjectData.class = Devil;
				if(displayObjectData.id === 'grunt')
					displayObjectData.class = Grunt;
				if(displayObjectData.id === 'robot')
					displayObjectData.class = Robot;
			} else if(type === 'player')
				displayObjectData.class = Player;
			else if(type === 'ammunition')
				displayObjectData.class = Ammunition;
			else if(type === 'firearm')
				displayObjectData.class = Firearm;
			else if(type === 'displayObject')
				displayObjectData.class = DisplayObject;
			if(!!displayObjectData.spriteData) {
				imagesToLoad.push(spriteImgPath+displayObjectData.id+resAppend+'.png');
				frames = {};
				for(sprite in json[displayObjectData.id+resAppend]) {
					frames[sprite] = json[displayObjectData.id+resAppend][sprite];
				}
				displayObjectData.spriteMeta = {
					img: spriteImgPath+displayObjectData.id+resAppend+'.png',
					frames: frames
				};
			}
			if(!!displayObjectData.image) {
				displayObjectData.image = spriteImgPath + displayObjectData.image + resAppend + '.png';
				imagesToLoad.push(displayObjectData.image);
			}
			config.displayObjects[displayObjectData.id] = displayObjectData;
		});
		delete displayObjects[type];
	}
	callback();
}

function processValue(value) {

	if(typeof value === 'string' && value.match(/config\./)) {
		
		if(value.match(/[0-9]+/)) {
			let operator = '',
				values = value;
			value = 0;
			values.match(/[\+|\/|-|\*|config\.|a-z|A-Z|0-9]+/g).forEach( function(tmp){
				if(tmp.match(/[\+|-|\/|\*]/))
					operator = tmp;
				else {
					if(tmp.match(/config\.[a-z|A-Z|0-9]/))
						tmp = config[tmp.replace(/config\./,'')];
					else
						tmp *= 1;
					if(operator === '+')
						value += tmp;
					else if(operator === '-')
						value -= tmp;
					else if(operator === '*')
						value *= tmp;
					else if(operator === '/')
						value /= tmp;
					else value = tmp;
				} 
			} );
		} else {
			value = config[value.replace(/config\./,'')];
		}
	} else if(typeof value === 'string' && value.match(/[0-9]+/) && value.match(/^((?![a-z|A-Z]).)*$/)) {
		value *= 1;
	}
	return value;
}

function processConfig(obj) {
	if(typeof obj ==='array') {
		obj.forEach(function(value, index){
			if(typeof value === 'number' || typeof value === 'string') {
				obj[index] = processValue(value);
			} else {
				processConfig(value);
			}
		});
	} else if(typeof obj === 'object') {
		let property = null,
			value = null;
		for(property in obj) {
			value = obj[property];
			if(property === 'hostiles') {
				obj[property] = new String(',').concat(value.join(',')).concat(',');
			} else if(typeof value === 'object') {
				processConfig(value);
			} else {
				value = processValue(value);
				if(!!config.scalars[property])
					value *= config.scalars[property];
				obj[property] = value;
			}
		}
	}
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