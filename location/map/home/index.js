var async					= require('async');
var app 					= require('app');
var characterCore			= require('core/character');
var widgetCharacterProfile	= require('widgets/characterProfile');
var log						= require('libs/log')(module);
var frontCore 	        	= require('core/front');

var type = 'home';

var render = function( uid ){

	characterCore.getProfile( uid, function( err, user ) {
		if( err ) { log.error( err ); return false; }

		var expressApp = app.getApp();
		var sio = app.getSocketServer();

		var home = user.realty[user.location.region].home;
		var path = 'game/home/' + home;

		var widgets = {};

		async.parallel(
			[
				function(callback) {
					widgetCharacterProfile.render( user, callback );
				}
			]
			,function(err, result) {
				if(err) { log.error(err); }

				var widgets = {};
				result.forEach(function(value) {
					widgets[value.name] = value.html
				});

				var data = {
					widgets: widgets
				}

				expressApp.render( path, data, function( err, html ){
					if( err ) { log.error( err ); }

					var data = {
						type: type
						,template: html
					};

					frontCore.sendToUid( uid ).emit( 'template', data );
				});

				user.location.map = 'home';
			}
		);
	});
}

exports.render = render;