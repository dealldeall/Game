var async			= require('async');
var log				= require('libs/log')(module);
var templateRender	= require('libs/widgets').getRender(__dirname);

var render = function( callback ) {
	var html = templateRender('forces')

	var data = {
		name: 'battleForces'
		,html: html
	}

	callback( null, data );
}

module.exports.render = render;