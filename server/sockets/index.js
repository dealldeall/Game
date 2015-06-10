var log         		= require( 'libs/log')( module)
	,io					= require( 'socket.io')
    ,cookieParser       = require( 'cookie-parser')()
    ,session			= require( 'libs/db').session
    ,auth               = require( 'libs/auth')

var authSockets     	= require( './auth')
	//,gameSocketRoutes	= require( './routes/game')
	//,frontCore			= require( 'core/front')


function up( server){

	var socketServer = module.exports.server = io.listen( server);
    log.info( 'Socket.io server listening');


    socketServer.use( function( socket, next) {

        var req = socket.handshake;
        var res = {};

        cookieParser( req, res, function( err) {
            if (err) return next(err);
            session( req, res, next);
        });
    });


	socketServer.sockets.on( 'connection', function( socket) {

        var session = socket.handshake.session
            ,uid = null
            ,pid = null;


        if( typeof session.uid != 'undefined') {

            uid = session.uid;
            socket.join( 'users/' + uid );

            //Socket routes
            //gameSocketRoutes.up( socket);
            //frontCore.init( socket);
            authSockets.init( socket)
        } else {

            return;
        }


		socket.on( 'disconnect', function(){

        });
	});
}

module.exports.up = up;