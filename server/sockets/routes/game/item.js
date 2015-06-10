var async 				= require('async');
var log         		= require('libs/log')(module);
var characterCore		= require('core/character');
var characterFrontCore	= require('core/front/character');

var exchange = function( uid, data ) {

	characterCore.getProfile( uid, function( err, user ) {
		if( err ){ log.error( err ) }

		var afterExchange = {
			refreshEffect : false
		}

		var detectItem = function( itemData, item ) {
			if( itemData.type == 'equipment') {

				afterExchange.refreshEffect = true;

				var equipmentType = itemData.subType;

				if( typeof item != 'undefined' ) {
					user.equipment[equipmentType] = item;
				} else {
					return user.equipment[equipmentType];
				}

			} else if ( itemData.type == 'backpack' ) {

				if( typeof item != 'undefined' ) {
					user.backpack[itemData.index] = item;
				} else {
					return user.backpack[itemData.index];
				}

			}
		}

		//get
		var _items = [
			detectItem( data[0] )
			,detectItem( data[1] )
		];

		//set
		detectItem( data[0], _items[1] );
		detectItem( data[1], _items[0] );

		if( afterExchange.refreshEffect ){
			characterCore.refreshEffect( user, function( err, user ) {
				var data = {};

				for(var statIdx in user.stat) {
					var value = user.stat[statIdx];
					data[ 'stat-' + statIdx ] = value;
				}

				for(var modIdx in user.mod) {
					var value = user.stat[modIdx];
					data[ 'mod-' + modIdx ] = value;
				}

				for(var battleStatIdx in user.battleStat) {
					var value = user.stat[battleStatIdx];
					data[ 'battle-stat-' + battleStatIdx ] = value;
				}

				characterFrontCore.variables( user.id, data );
			});
		}
	});
}

module.exports.exchange = exchange;