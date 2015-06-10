var authRoute			= require( './auth')
	,siteRoute			= require( './site')
	,gameRoute			= require( './game');

module.exports = function( app) {
	authRoute( app);
	siteRoute( app);
	gameRoute( app);
}