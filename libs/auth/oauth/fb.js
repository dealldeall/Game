var config				= require( 'config')
    ,log				= require( 'libs/log')(module)
    ,url				= require( 'url')
    ,querystring        = require( 'querystring')
    ,oauth2				= require( 'simple-oauth2')
    ,request			= require( 'request')

if( process.env.NODE_ENV == 'DEBUG'){
    var client = config.get( 'host:dev');
} else {
    var client = config.get( 'host:main');
}

var site = config.get( 'oauth:fb:site')
    ,id = config.get( 'oauth:fb:id')
    ,secret = config.get( 'oauth:fb:secret')
    ,callbackUri = client + config.get( 'oauth:fb:callbackUri')
    ,authorizationUri = config.get( 'oauth:fb:authorizationUri')
    ,tokenGetUri = config.get( 'oauth:fb:tokenGetUri')

//Scope
var permissions = [
    'email'
    ,'public_profile'
    //,'user_likes'
    ,'user_friends'
    ,'offline_access'
];

var getScope = function(){

    var scope = permissions.join( ',');
	return scope;
}

//init
var authObj = oauth2({
	clientID: id
	,clientSecret: secret
	,site: site
	,authorizationPath: authorizationUri
	,tokenPath: tokenGetUri
});


//Login URI
var getLoginUri = function(){

	var scope = getScope();

	var uri = authObj.authCode.authorizeURL({
		redirect_uri: callbackUri
        ,scope: scope
	});

	return uri;
}


//Get token
var execCode = function( code, callback){

    authObj.authCode.getToken(
        {
            code: code
            ,redirect_uri: callbackUri
            ,client_id: id
        }, function( err, result) {
            if ( err) { log.error( 'Access Token Error', err); return callback( null);}
            //var token = vk.accessToken.create( result);

            result = querystring.parse( result);
            var token = result.access_token

            var uri = 'https://graph.facebook.com/me?access_token=' + token;
            request( uri, function( err, res, body) {

                var profile = JSON.parse( body)
                    ,uid = profile.id;

                callback( uid, token, profile);
            });
        }
    );
}


module.exports.getLoginUri = getLoginUri;
module.exports.execCode = execCode;
