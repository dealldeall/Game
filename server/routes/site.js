var config				= require( 'config')
	,log				= require( 'libs/log')(module)
	,auth				= require( 'libs/auth')

var async				= require( 'async')
	,widgetBattleForce	= require( 'widgets/widgetBattleForce')

module.exports = function( app) {

	app.get( '/', function ( req, res){

		var isGuest = true;
		if( req.session.uid) {
			isGuest = false;
		}

		var oauthUri = {
			gl: auth.oauth.gl.getLoginUri()
			,vk: auth.oauth.vk.getLoginUri()
			//,tw: auth.oauth.tw.getLoginUri()
			,fb: auth.oauth.fb.getLoginUri()
		}

		res.renderPage( 'index', { 'title' : 'New Adult World', oauthUri: oauthUri, isGuest: isGuest});
	});

	//common page
	app.get( '/faq', function( req, res) {
		res.renderPage( 'faq', { 'title': 'FaQ'});
	});

	app.get( '/mythology', function(req, res) {
		res.renderPage( 'mythology', { 'title': 'Mythology'});
	});

	app.get( '/test', function( req, res){
        async.waterfall([
            function( callback){
                callback( null, 'one', 'two');
            },
            function( arg1, arg2, callback){
                // arg1 now equals 'one' and arg2 now equals 'two'
                callback( null, 'three');
            },
            function( arg1, callback){
                // arg1 now equals 'three'
                callback( null, 'done');
            }
        ], function ( err, result) {
            // result now equals 'done'
        });
	});
}