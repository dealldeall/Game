var async 				= require('async');
var log         		= require('libs/log')(module);
var characterCore		= require('core/character');
var battleFrontCore		= require('core/front/battle');
//var clone 				= require('clone');
var config				= require( 'config');

var battle				= require( './battle');
var cache				= require( './cache');
var searchEnemy			= require( './searchEnemy');

var util				= require('util');
var EventEmitter		= require('events').EventEmitter;


var cancel = function( uid ) {
	log.debug( '(PIKE) - For cancel function in battle search' );

	var self = this;

	setTimeout(function() {
		self.emit( 'complete', uid );
	});
}
util.inherits(cancel, EventEmitter);


var finish = function( battleId) {
	log.debug('(PIKE), For finish battle function');
}


var escape = function( uid ) {
	new characterCore.getProfile( uid)
	.once( 'complete', function( user) {

		if( user.location.action != 'inBattle') {
			return log.error( 'user id %s not in combat', user.id);
		} else {
			var battleId = user.location.data.battleId;

			user.location.action = '';
			user.location.data.battleId = '';

			delete(user.location.data);

			new cache.getBattle( battleId)
			.once( 'complete', function( battle) {

				battle.forces[uid].status = 'escape';

				var escapeSide = battle.forces[uid].side;
				var activeForce = 0;

				for(var forceUid in battle.forces) {
					if( battle.forces[forceUid].status == 'active' && battle.forces[forceUid].side == escapeSide) {
						activeForce++;
					}
				}

				var maxPenalty	= config.get( 'battle:penalty:escape')[activeForce];
				var minPenalty	= config.get( 'battle:penalty:min');

				var penalty		= parseFloat(( (Math.random() * ( maxPenalty - minPenalty + 1)) + minPenalty).toFixed(2));

				battle.escape( uid);
return;
				for(var forceUid in battle.forces) {
					if( battle.forces[forceUid].status == 'active' && characterCore.uidTypeOf( forceUid) == 'user') {
						battleFrontCore.escape( forceUid, null );
					}
				}

				var time = Date.now();
				battle.log[time] = { message: 'uid ' + uid + ' is escape'};
			});
		}
	});
}

//old
var checkIsBattleFinish = function( battleId ) {
	var battle = getBattle( battleId );

	var isFinish = false;

	var filterForces = [];

	for( var forceIdx in battle.forces ) {
		filterForces[forceIdx] = battle.forces[forceIdx].filter(function( value ){
			if(value.status == 'active' && value.uid != 'bot') {
				return true;
			}
			return false;
		});
	}

	if( filterForces[0].length == 0 || filterForces[1].length == 0 ) {

	}
}


exports.cancel					= cancel;
exports.escape					= escape;

exports.beginBattle				= battle.begin;
exports.searchEnemy				= searchEnemy.search;
exports.dbSaver					= cache.dbSaver;
exports.getActiveBattleCount	= cache.getActiveBattleCount;
exports.getBattle				= cache.getBattle;