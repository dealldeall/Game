var app 					= require( 'app');
var characterCore			= require( 'core/character');
var log						= require( 'libs/log')(module);
var async					= require( 'async');
var frontCore				= require( 'core/front');
var battleFrontCore			= require( 'core/front/battle');
var widgets					= require( 'libs/widgets');

var type	= 'arena';
var path	= '/arena/basic';

var render = function( uid){
	new characterCore.getProfile( uid)
	.once( 'complete', function( user) {
		var expressApp = app.getApp();

		expressApp.render('game' + path, function( err, html){
			if( err) { log.error( err)}

			var data = {
				type: type
				,template: html
			}

			frontCore.sendToUid( uid).emit( 'template', data);

			if( user.location.action == 'arenaEnemySearch') {
				frontCore.sendToUid( uid).emit( 'bookmark', {name: 'wait'});
			}

			if( user.location.action == 'inBattle') {
				var battleId = user.location.data['battleId'];
				battleFrontCore.init( battleId);
			}
		});

		user.location.map = type + '/basic';
	});

}

exports.render = render;