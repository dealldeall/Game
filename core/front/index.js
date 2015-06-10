var log         		= require( 'libs/log')( module)
    ,server      		= require( 'server')

var app    				= require( 'app' );
var locationCore    	= require( 'core/location' );
var characterCore		= require( 'core/character' );

function sendToUid( uid, path, data) {

    var socketServer = server.sockets;
    socketServer.sockets.to( 'users/' + uid).emit( path, data);
}

function sendToPid( pid) {
    return sockets.sockets.to( 'profiles/' + uid);
}

/*




var init = function( socket ) {
	var uid = socket.handshake.uid;

	store(uid, {uid: uid});

	characterCore.getProfile( uid, function( err, user ) {
		if( err ) { log.error( err ); return false; }

		var map = {
			name: user.location.map
		};

		move( map, uid );
	});
}

var move = function( map, uid ){
	var user = characterCore.getProfile( uid, function( err, user ) {
		if( err ) { log.error( err ); return false; }

		var locPath = '';
		var data = {
			type: ''
			,template: ''
		};

		var mapData = locationCore.map( user.location.region, user.location.zone, map.name );

		if( !mapData ) {
			log.error( 'user %s, request loc `%s`, zone `%s`, map `%s`', uid, user.location.region, user.location.zone, map.name );
			return false;
		}

		mapData.render( uid );

		return true;
	});
}

var bookmark = function( uid, name ){
	var data = {
		name: name
	}

	sendToUid(uid).emit( 'bookmark', data );
}

var message = function( uid, html ){
	var data = {
		html: html
	}

	sendToUid( uid ).emit( 'message', data );
}

var store = function( uid, data ){
	sendToUid(uid).emit( 'store/set', data );
}

module.exports.init = init;
module.exports.move = move;
module.exports.bookmark = bookmark;
module.exports.message = message;
module.exports.store = store;
*/

module.exports.sendToUid = sendToUid;
module.exports.sendToPid = sendToPid;