var log						= require('libs/log')(module);
var app 					= require('app');
var characterCore			= require('core/character');
var frontCore 	        	= require('core/front');

var type = 'town';

var render = function( uid ){
	characterCore.getProfile( uid, function( err, user ) {
		if( err ) { log.error( err ); return false; }

		var expressApp = app.getApp();
		var sio = app.getSocketServer();

		var zone = user.location.zone;
		var path = 'game/town/' + zone;

		expressApp.render(path, function(err, html){
			var data = {
				type: type
				,template: html
			};

			frontCore.sendToUid( uid ).emit( 'template', data );
		});

		user.location.map = 'town';
	});
}

exports.render = render;