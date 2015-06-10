var log         		= require('libs/log')(module);
var frontCore         	= require('core/front');
var battleCore			= require('core/battle');
var characterCore		= require('core/character');

var init = function( battleId) {

	new battleCore.getBattle( battleId)
	.once( 'complete', function( battle) {

		battle.getPublicData( function( data){

			for( var uid in data.forces) {
				if( characterCore.uidTypeOf( uid) != 'user') {
					continue;
				}

				log.debug( 'send public info battle id %s, from uid %s', battleId, uid);
				frontCore.sendToUid( uid).emit( 'battle/init', data);
			}
		});
	});
}

var escape = function( uid, data ) {
	frontCore.sendToUid( uid ).emit( 'battle/escape', data );
}

var cancel = function( uid, data ) {
	frontCore.sendToUid( uid ).emit( 'battle/cancel', data );
}

module.exports.init = init;
module.exports.escape = escape;
module.exports.cancel = cancel;