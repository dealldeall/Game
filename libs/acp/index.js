var config				= require( 'config')
	,log				= require( 'libs/log')(module)

var util				= require('util')
	,EventEmitter		= require('events').EventEmitter;


var init = function(){
}

module.exports.init = init;


var commands = function(){

	var self = this;

	//BD saver
	var dbSaver = setInterval(
		function(){
			self.emit( 'dbsave');
		}, config.get( 'cron:dbSaverInterval')
	);
	dbSaver.unref();
}
util.inherits( commands, EventEmitter);

module.exports.chanels = {
	commands: new commands()
}