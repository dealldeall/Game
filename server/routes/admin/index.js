var log   				= require('libs/log')(module);
var app					= require('app');
var ItemsOriginalModel	= require('libs/db').ItemsOriginalModel;
var UserModel			= require('libs/db').UserModel;
var mongoose			= require('libs/db').mongoose;
var auth				= require('libs/auth');
var characterCore		= require('core/character');
var botsCore			= require('core/bots');
var battleCore			= require('core/battle');
var config				= require('config');

var alertsPage			= require('./alerts');

var acpLink = function(link) {
	var adminConfig = config.get('admin');
	if(!this.cache) {
		if( process.env.NODE_ENV == 'development' ) {
			this.cache = '/' + adminConfig.acpLinkDev;
		} else if ( adminConfig.acpLink ) {
			this.cache = '/' + adminConfig.acpLink;
		} else {
			this.cache = '/_' + Math.random().toString(36).split('.')[1];
		}
	}

	return this.cache + link;
}


var run = function( app ) {
	log.info('ACP: %s', acpLink('/'));

	app.get(acpLink('/'), function (req, res){
		statistics(req, res);
	});

	app.get(acpLink('/alerts'), function (req, res){
		alertsPage.index(req, res);
	});

	app.get(acpLink('/items'), function (req, res){
		items(req, res);
	});
	app.post(acpLink('/items'), function (req, res){
		itemsPost(req, res);
	});

	app.post(acpLink('/message'), function (req, res){
		message(req, res);
	});

	app.get(acpLink('/users'), function (req, res){
		users(req, res);
	});

	app.post( acpLink( '/user/:action' ), function ( req, res ){
		usersPost( req, res )
	});

	app.get(acpLink('/user/:id'), function (req, res){
		user(req, res);
	});
};




var render = function(res, template, data) {
	var appExpress = app.getApp();
	template = 'admin/' + template;

	appExpress.render(template, data, function(err, html){
		if( err) { log.debug( 'template error:', err);}
		res.render('layout/admin', { title: template, content: html, acpLink: acpLink('/') });
	});
}

var statistics = function( req, res){
	var sioRooms =  app.getSocketServer().rooms;

	var online				= 0;
	var connected			= 0;
	var maxConnectedOneUser	= 0;

	var activeBots			= botsCore.getActiveBots();
	var getActiveBattle		= battleCore.getActiveBattle();

	for( var room in sioRooms) {
		if( room.indexOf( '/users/') == 0) {
			online++;
			var userConected = sioRooms[room].length;
			connected += userConected;

			if( maxConnectedOneUser < userConected) {
				maxConnectedOneUser = userConected
			}
		}
	}

	var data = {
		online : online
		,connected : connected
		,maxConnectedOneUser : maxConnectedOneUser
		,getActiveBattle : getActiveBattle
		,activeBots : activeBots
	}

	render(res, 'index', data);
}

var user = function(req, res){
	var id = req.params.id;

	UserModel.findById( id, function( err, user) {
		render(res, 'user', { user: user } );
	});
}

var dropUser = function(req, res){
	var uid = req.body.uid;

	UserModel.findOneAndRemove( {id : uid}, function( err, result ) {
		if( err ) { log.error( err ); }
		res.json( { message: 'completed' } );
	});

	characterCore.dropCache( uid );
}

var cleanUsers = function(req, res){

	UserModel.find( function ( err, users ) {
		if( err ) { log.error( err ); }

		var db = mongoose.connection.db;
		db.dropCollection("users", function( err ) {
			if( err ) { log.error( err ); }

			log.info('admin cleaning users profile');
			res.json( { message: 'completed' } );
		});

		characterCore.dropCache();

		users.forEach( function( user ) {

			var data = {
				_id: user.id
				,email: user.email
				,profile: {
					lang: user.profile.lang
				}
				,subscriptionTo: user.subscriptionTo
			}

			auth.createEmptyProfile( data );
		});
	});
}


var users = function(req, res){

	var query = UserModel.find();
	query.limit(10);

	query.exec(function ( err, users ) {
		if( err ) { log.error( err ); }

		var data = { users: users }

		render(res, 'users', data );
	});
}

var usersPost = function( req, res ) {
	var action = req.params.action;


	switch( action ) {
		case( 'clean' ):
			cleanUsers(req, res);
			break;
		case( 'remove' ):
			dropUser( req, res );
			break;
		default:
			res.status(	500 );
			break;
	}
}

var items = function(req, res){
	ItemsOriginalModel.find( function ( err, items ) {
		if( err ) { log.error( err ); }

		var data = {
			items: items
		}

		render(res, 'items', data);
	});
}

var itemsPost = function(req, res){
	var post = req.body;
	for(var postIdx in post ) {
		if( post[postIdx] == '') {
			delete(post[postIdx]);
		}
	}

	var ItemOriginal = new ItemsOriginalModel;

	ItemOriginal.name = post.name;
	ItemOriginal.type = post.type;
	ItemOriginal.quality = post.quality;

	delete(post.name);
	delete(post.type);
	delete(post.quality);

	ItemOriginal.data = post;

	ItemOriginal.save(function (err, doc) {
		if ( err ) { log.error ( err ); return false; }
		res.json( { message: 'completed' } );
	});
}

var message = function(req, res){
    log.debug( req.body);
	res.send({message: 'message send'});
}

exports.run		= run;
exports.render	= render;

