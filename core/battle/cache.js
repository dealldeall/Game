var log         		= require('libs/log')(module);

var BattleModel			= require('libs/db').BattleModel;

var util				= require('util');
var EventEmitter		= require('events').EventEmitter;

var battleList = {};

/*
 {
 id: 1391923298842,
 ,type: 'arena'
 ,created: Date
 ,turn: 1
 ,status: 'active'
 ,forces: {
 '52f47bf633898ba808d03e7f' : { uid: '52f47bf633898ba808d03e7f'
 ,status: 'active'
 ,side: 0
 ,team: {
 '52f47bf633898ba808d03e7f' : {}
 ,1: false
 ,2: false
 }
 }
 ,log: {
 Date : {}
 ,Date : {}
 ,Date : {}
 }
 ,data :  Object
 }
 */

var dropBattle = function( id ) {

}

var saveBattle = function( id){
	var data = clone( battleList[id]);

	BattleModel.update({_id : id}, data, function(err, doc) {
		if( err ) {
			log.error( err );
		} else {
			log.debug( 'Battle id %s, updated in db', id );
		}
	});
}


var getBattle = function( id) {

	var self = this;

	var returnBattle = function( battleId) {

		setTimeout( function() {
			self.emit( 'complete', battleList[battleId]);
		});
	}

	if( battleList[id]) {
		returnBattle( id);
	} else {

		BattleModel.findById( id, function( err, doc){
			if( err) { log.error( err); return false; }

			if( ! doc) {
				log.error( 'no battle in db');
				return false;
			}

			var battle = doc.toObject();
			var battleId =  battle._id.toString();
			battle.id = battleId;

			setBattle(battle);
			returnBattle( battleId);
		});
	}
}
util.inherits( getBattle, EventEmitter);

var setBattle = function( battle) {
	battleList[battle.id] = battle;
}


//db saver
var dbSaver = function(){
	for(var id in battleList) {
		saveBattle( id);
	}
}

//for statistic page in ACP
var getActiveBattleCount = function() {
	return Object.keys( battleList).length;
}

exports.getBattle				= getBattle;
exports.setBattle				= setBattle;

exports.dbSaver					= dbSaver;
exports.getActiveBattleCount	= getActiveBattleCount;