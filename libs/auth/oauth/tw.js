//http://habrahabr.ru/post/150756/
var log					= require( 'libs/log')(module)
	,url				= require( 'url')
	,oauth2				= require( 'simple-oauth2')

if( process.env.NODE_ENV == 'DEBUG'){
	var client = 'http://localhost';
} else {
	var client = 'http://masters-way.sx'
}

var site = 'https://oauth.vk.com'
	,id = 4636354
	,secret = 'f6mIiPp8c9P7M2WX5C1O'
	,callbackUri = client + '/auth/oauth/vk'
	,tokenCallbackUri = client + '/auth/oauth/vk/token'
	,authorizationUri = '/authorize'
	,tokenGetUri = '/access_token' //'https://api.vk.com/oauth/token?client_id=4636354&client_secret=f6mIiPp8c9P7M2WX5C1O&redirect_uri=&code=xxx'
	,apiVersion = '5.26'

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
		redirect_uri: callbackUri,
		scope: scope,
		//state: '34(#q0/dsf!f~'
	});

	return uri;
}


//Get token
var execCode = function( code, callback){
	//log.debug(  site + tokenGetUri + '?code=' + code + '&redirect_uri=' + callbackUri + '&client_id=' + id + '&client_secret=' +secret );
	//return callback( null)
//work https://oauth.vk.com/access_token?code=ff729cb501051760f9&redirect_uri=http://localhost/auth/oauth/vk&client_id=4636354&client_secret=f6mIiPp8c9P7M2WX5C1O
	vk.authCode.getToken(
		{
			code: code
			,redirect_uri: callbackUri
			,client_id: id
		}, function( err, result) {
			if ( err) { log.error( 'Access Token Error'); return callback( null);}

			//var token = vk.accessToken.create( result);
			var token = result.access_token
				,uid = user_id;
			callback( { token: token, uid: uid});
		}
	);
}


module.exports.getLoginUri = getLoginUri;
module.exports.execCode = execCode;
