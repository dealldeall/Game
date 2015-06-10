//http://habrahabr.ru/post/150756/
var config				= require( 'config')
	,log				= require( 'libs/log')(module)
	,url				= require( 'url')
	,oauth2				= require( 'simple-oauth2')
    ,request			= require( 'request')

if( process.env.NODE_ENV == 'DEBUG'){
	var client = config.get( 'host:dev');
} else {
	var client = config.get( 'host:main');
}



var site = config.get( 'oauth:vk:site')
	,id = config.get( 'oauth:vk:id')
	,secret = config.get( 'oauth:vk:secret')
	,callbackUri = client + config.get( 'oauth:vk:callbackUri')
	,authorizationUri = config.get( 'oauth:vk:authorizationUri')
	,tokenGetUri = config.get( 'oauth:vk:tokenGetUri') //'https://api.vk.com/oauth/token?client_id=4636354&client_secret=f6mIiPp8c9P7M2WX5C1O&redirect_uri=&code=xxx'
	,apiVersion = config.get( 'oauth:vk:apiVersion');

//Scope
var permissions = {
	notify: 1 //Пользователь разрешил отправлять ему уведомления.
	,friends: 2 //Доступ к друзьям.
	//,photos: 4 //Доступ к фотографиям.
	//,audio: 8 //Доступ к аудиозаписям.
	//,video: 16 //Доступ к видеозаписям.
	//,docs: 131072 //Доступ к документам.
	//,notes: 2048 //Доступ к заметкам пользователя.
	//,pages: 128 //Доступ к wiki-страницам.
	,link: 256 //Добавление ссылки на приложение в меню слева.
	//,status: 1024 //Доступ к статусу пользователя.
	//,offers: 32 //Доступ к предложениям (устаревшие методы).
	//,questions: 64 //Доступ к вопросам (устаревшие методы).
	//,wall: 8192 //Доступ к обычным и расширенным методам работы со стеной. Внимание, данное право доступа недоступно для сайтов (игнорируется при попытке авторизации).
	,groups: 262144 //Доступ к группам пользователя.
	//,messages: 4096 //(для Standalone-приложений) Доступ к расширенным методам работы с сообщениями.
	,email: 4194304 //Доступ к email пользователя. Доступно только для сайтов.
	//,notifications: 524288 //Доступ к оповещениям об ответах пользователю.
	//,stats: 1048576 //Доступ к статистике групп и приложений пользователя, администратором которых он является.
	,ads: 32768 //Доступ к расширенным методам работы с рекламным API.
	,offline: 65536 //Доступ к API в любое время со стороннего сервера (при использовании этой опции параметр expires_in, возвращаемый вместе с access_token, содержит 0 — токен бессрочный).
}

var getScope = function(){
	var scope = 0;
	for( var idx in permissions) {
		var val = permissions[ idx];
		scope+= val;
	}
	return scope;
}

//init
var vk = oauth2({
	clientID: id
	,clientSecret: secret
	,site: site
	,authorizationPath: authorizationUri
	,tokenPath: tokenGetUri
});

//Login URI
var getLoginUri = function(){

	var scope = getScope();

	var uri = vk.authCode.authorizeURL({
		redirect_uri: callbackUri
		,scope: scope
		//,state: '34(#q0/dsf!f~'
	});

	return uri;
}


//Get token by code
var execCode = function( code, callback){
	//log.debug(  site + tokenGetUri + '?code=' + code + '&redirect_uri=' + callbackUri + '&client_id=' + id + '&client_secret=' +secret );

	vk.authCode.getToken(
		{
			code: code
			,redirect_uri: callbackUri
			,client_id: id
		}, function( err, result) {
			if ( err) { log.error( 'Access Token Error', err); return callback( null);}
			//var token = vk.accessToken.create( result);

			var token = result.access_token
				,uid = result.user_id


            var uri = 'https://graph.facebook.com/me?access_token=' + token;
            request( uri, function( err, res, body) {
                var profile = JSON.parse( body)

                callback( uid, token, profile);
            });

		}
	);
}


module.exports.getLoginUri = getLoginUri;
module.exports.execCode = execCode;
