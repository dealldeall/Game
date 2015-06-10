var log         		= require( 'libs/log')(module);
var frontCore         	= require( 'core/front');

function setActiveProfile( uid, idx) {

    var data = { result: 'success', idx: idx}
    frontCore.sendToUid( uid, 'in_game', data)
}

module.exports.setActiveProfile = setActiveProfile;