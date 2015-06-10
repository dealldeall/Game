var log         		= require('libs/log')(module);
var frontCore         	= require('core/front');

var counters = function( uid, counters ){
	var data = {
		counters: counters
	}

	frontCore.sendToUid( uid ).emit( 'counters', data );
}

var variables = function( uid, variables ){
	var data = {
		variables: variables
		,uid: uid
	}

	frontCore.sendToUid( uid ).emit( 'variables', data );
}

module.exports.variables = variables;
module.exports.counters = counters;