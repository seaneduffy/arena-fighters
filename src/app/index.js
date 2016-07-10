'use strict';

let React = require('react'),
	ReactDOM = require('react-dom'),

	components = require('./components'),
	dataLoader = require('../data'),
	config = require('../config'),
	resources = require('../resources');

dataLoader.load(()=>{
	console.log(config);
	resources.load(config.imagesToLoad);
});

ReactDOM.render(React.createElement(components.Game), document.getElementById('game'));