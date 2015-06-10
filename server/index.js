var config				= require( 'config')
	,log         		= require( 'libs/log')( module)
	,http				= require( 'http')
	,routes				= require( './routes')
	,adminRoute			= require( './routes/admin')
	,sockets			= require( './sockets');

function up( app){

	//Http server
	httpServer = module.exports.http = http.createServer( app).listen( config.get( 'port'));

	httpServer.on( 'listening', function() {
		log.info( 'Http express server listening on port %d', config.get( 'port'));

		//routes
		routes( app);
		adminRoute.run( app);
		log.info( 'Http routes up');

		//Socket server
		sockets.up( httpServer);
        module.exports.sockets = sockets.server;
	});
}

module.exports.up = up;