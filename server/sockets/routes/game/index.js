var app					= require( 'app');
var log					= require( 'libs/log')(module);
var actionLocStatus		= require( 'core/action/locStatus');
var battleRoute			= require( './battle');
var itemRoute			= require( './item');
var frontCore			= require( 'core/front');
var characterCore		= require( 'core/character');


exports.up = function(socket) {
	var server = app.getSocketServer();
	var uid = socket.handshake.uid;

	socket.on('move', function( data ){
		var uid = socket.handshake.uid;

		characterCore.getProfile(uid, function(err, user) {
			if(err){log.error(err)}

			var action = user.location.action;

			if(action) {
				var actionOptions = actionLocStatus[action];

				if(actionOptions && actionOptions.blockMove === true) {
					return false;
				}
			}

			var map = {
				name: data.to
			}

			frontCore.move(map, uid);
		});
	});

	socket.on('battle', function(data){
		switch( data.action ) {
			case 'init' :
				server.sockets.to(uid).emit('bookmark', {name: 'wait'});
				battleRoute.init(socket, data);
			break;
			case 'cancel' :
				battleRoute.cancel(socket, data);
				server.sockets.to(uid).emit('bookmark', {name: 'main'});
			break;
			case 'escape' :
				battleRoute.escape(socket, data);
			break;
			case 'use' :
			break;
		}
	});

	socket.on('item/exchange', function( data ){
		var uid = socket.handshake.uid;
		itemRoute.exchange( uid, data );
	});
}