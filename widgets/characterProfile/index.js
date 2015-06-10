var async					= require('async');
var i18n					= require('i18n');
var log						= require('libs/log')(module);
var templateRender			= require('libs/widgets').getRender(__dirname);

var render = function( user, callback ) {
	i18n.setLocale('en');

	var data = {
		user: user
		,i18n: i18n
	}

	var html = templateRender( 'profile', data)

	var data = {
		name: 'characterProfile'
		,html: html
	}

	callback( null, data );
}

module.exports.render = render;