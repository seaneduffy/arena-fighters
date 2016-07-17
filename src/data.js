'use strict';

let config = require('./config'),
	cycle = require('./cycle'),
	callback = null;

function processData(json) {
	let settings = json.settings,
		scalar = settings.scalar,
		maxWidth = config.maxWidth = processValue(settings.maxWidth),
		maxHeight = config.maxHeight = processValue(settings.maxHeight),
		windowInnerWidth = window.innerWidth,
		windowInnerHeight = window.innerHeight,
		resAppend = '',
		stageWidth = 0,
		stageHeight = 0,
		resValues = ','+settings.resValues.join(',')+',',
		distanceValues = ','+settings.distanceValues.join(',')+',',
		scalars = settings.scalars,
		wallPadding = 0,
		resolutions = processValue(settings.resolutions),
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
		
	cycle.setFrameRate(settings.frameRate);
	
	for(let resolution in resolutions) {
		
		var width = processValue(resolutions[resolution].width),
			height = processValue(resolutions[resolution].height);
		if(width > windowWidth && height > windowHeight) {
			resAppend = '-' + resolution;
			stageWidth = config.stageWidth = width;
			stageHeight = config.stageHeight = height;
			break;
		}
	}
	
	stageCenterX = config.stageCenterX = stageWidth / 2;
	stageCenterY = config.stageCenterY = stageHeight / 2;
	config.joystick = json['joystick'+resAppend];
	config.fire = json['fire'+resAppend];
	config.fireBtnImage = spriteImgPath+'fire'+resAppend+'.png';
	imagesToLoad.push(config.fireBtnImage);
	config.joystickImage = spriteImgPath+'joystick'+resAppend+'.png';
	imagesToLoad.push(config.joystickImage);

	resolutionScale = config.resolutionScale = windowHeight / stageHeight;
	distanceScale = config.distanceScale = windowHeight / maxHeight;
	
	config.domElement.style.width = stageWidth * resolutionScale + 'px';
	config.domElement.style.height = stageHeight * resolutionScale + 'px';
	config.joystickMin = settings.joystickMin * resolutionScale;
	config.joystickMax = settings.joystickMax * resolutionScale;
	wallPadding = processValue(settings.wallPadding) * resolutionScale;
	
	config.topWall = {
		x: 0,
		y: 0,
		width: stageWidth * resolutionScale,
		height: wallPadding
	};
	config.leftWall = {
		x: 0,
		y: 0,
		width: wallPadding,
		height: stageHeight * resolutionScale
	};
	config.rightWall = {
		x: stageWidth * resolutionScale - wallPadding,
		y: 0,
		width: wallPadding,
		height: stageHeight * resolutionScale
	};
	config.bottomWall = {
		x: 0,
		y: stageHeight * resolutionScale - wallPadding,
		width: stageWidth * resolutionScale,
		height: wallPadding
	};

	levels.forEach(level=>{
		level.forEach(levelData=>{
			if(!!levelData.properties) {
				for(property in levelData.properties) {
					levelData.properties[property] = processValue(levelData.properties[property]);
					if(resValues.match(new RegExp(property)))
						levelData.properties[property] *= resolutionScale;
					if(distanceValues.match(new RegExp(','+property+',')))
						levelData.properties[property] *= distanceScale;
					if(!!scalars[property])
						levelData.properties[property] *= scalars[property];
				}
			}
		});
	});

	for(type in displayObjects) {
		for(property in displayObjects[type].properties) {
			displayObjects[type].properties[property] = processValue(displayObjects[type].properties[property]);
			if(resValues.match(new RegExp(','+property+',')))
				displayObjects[type].properties[property] *= resolutionScale;
			if(distanceValues.match(new RegExp(','+property+',')))
				displayObjects[type].properties[property] *= distanceScale;
			if(!!scalars[property])
				displayObjects[type].properties[property] *= scalars[property];
		}
		if(!!displayObjects[type].properties.spriteLabels) {
			imagesToLoad.push(spriteImgPath+type+resAppend+'.png');
			frames = {};
			for(sprite in json[type+resAppend]) {
				frames[sprite] = json[type+resAppend][sprite];
			}
			displayObjects[type].properties.spriteMeta = {
				img: spriteImgPath+type+resAppend+'.png',
				frames: frames
			};
		}
		if(!!displayObjects[type].properties.image) {
			image = displayObjects[type].properties.image;
			image = spriteImgPath + image + resAppend + '.png';
			displayObjects[type].properties.image = image;
			imagesToLoad.push(image);
		}
	}
	callback();
}

function processValue(value) {
	if(typeof value === 'string' && value.match(/config\./)) {
		if(value.match(/[0-9]+/)) {
			let operator = '',
				values = value;
			value = 0;
			values.match(/[\+|\/|\-|\*|config\.|a-z|A-Z|0-9]+/g).forEach( function(tmp){
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