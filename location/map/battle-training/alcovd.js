var app 					= require('app');
var characterCore			= require('core/character');
var log						= require('libs/log')(module);
var async					= require('async');
var frontCore				= require('core/front');
var battleFrontCore			= require('core/front/battle');
var widgets					= require('libs/widgets');

var type = 'battle-training';
var path = '/battle-training/alcovd';

var render = function( uid ){
	characterCore.getProfile( uid, function( err, user ) {
		if( err ) { log.error( err ); return false; }

		var expressApp = app.getApp();

		expressApp.render('game' + path, function( err, html ){
			if( err ) { log.error( err ) }

			var data = {
				type: type
				,template: html
			}

			frontCore.sendToUid( uid ).emit( 'template', data );
		});

		user.location.map = type + '/alcovd';
	});

}

exports.render = render;