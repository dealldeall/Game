var async 				= require('async');
var log         		= require('libs/log')(module);
var characterCore		= require('core/character');
var botsCore			= require('core/bots');
var battleCore			= require('core/battle');
var battleFrontCore		= require('core/front/battle');

var util				= require('util');
var EventEmitter		= require('events').EventEmitter;

exports.init = function( socket, data ) {
	var uid = socket.handshake.uid;

	if(data.type == 'arena') {
		initArenaBattle( uid );
	}
}

exports.cancel = function( socket, data ) {
	var uid = socket.handshake.uid;

	characterCore.getProfile( uid, function( err, user ) {
		if( err ){ log.error( err ) }

		var action = user.location.action;

		if( action != 'arenaEnemySearch' ) {
			return false;
		}

		var cancel = new battleCore.cancel( uid );

		cancel.once( 'complete', function( uid ) {

			user.location.action = '';
			battleFrontCore.cancel( uid );
		})
	});
}

exports.escape = function( socket, data ) {
	var uid = socket.handshake.uid;
	battleCore.escape( uid );
}

var initArenaBattle = function( uid) {

	new characterCore.getProfile( uid)
	.once( 'complete', function( user) {

		user.location.action = 'arenaEnemySearch';

		new battleCore.searchEnemy( user)
			.once( 'fail', function() {
				var self = this;

				new botsCore.createBotProfile( user)
					.once( 'complete', function( bot){
						self.emit( 'complete', bot);
					})
			})
			.once( 'complete', function( enemy) {

				this.removeAllListeners();

				var sides = [
					user,
					enemy
				];

				new battleCore.beginBattle( sides, 'arena')
				.once( 'begin', function( battleId){
					log.debug( 'Battle id %s is begin', battleId );

					user.location.action = 'inBattle';
					user.location.data = {battleId : battleId };

					battleFrontCore.init( battleId);
				});
		});
	});
}