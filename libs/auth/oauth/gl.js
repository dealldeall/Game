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

var site = config.get( 'oauth:gl:site')
    ,id = config.get( 'oauth:gl:id')
    ,secret = config.get( 'oauth:gl:secret')
    ,callbackUri = client + config.get( 'oauth:gl:callbackUri')
    ,authorizationUri = config.get( 'oauth:gl:authorizationUri')
    ,tokenGetUri = config.get( 'oauth:gl:tokenGetUri')

//Scope
var permissions = [
    'userinfo.email'
    ,'userinfo.profile'
];

var getScope = function(){
    var uri = 'https://www.googleapis.com/auth/';

    var scope = uri + permissions.join( '+'+uri);
    scope = querystring.stringify( scope);


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

    //response_type=code
    //&client_id={client_id}&
    //scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile" title="Войти через Google

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
