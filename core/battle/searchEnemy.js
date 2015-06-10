var util				= require('util');
var EventEmitter		= require('events').EventEmitter;

var search = function( argesor) {
	var self = this;

	setTimeout(function() {
		self.emit( 'fail' );
	});
}
util.inherits(search, EventEmitter);

exports.search = search