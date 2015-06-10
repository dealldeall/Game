var log         		= require('libs/log')(module);

var util				= require('util');
var EventEmitter		= require('events').EventEmitter;

var profiles			= require('./bots');

var randProfile = function(){
	var maxIdx = profiles.length;
	var profileIdx = Math.floor(Math.random() * maxIdx);
	return profiles[profileIdx];
}

var botsList = {};

var getActiveBots = function() {
	var count = Object.keys( botsList).length;
	return count;
}

var generateBotId = function() {
	return '_' + Date.now();
}

var createBotProfile = function(userPrototype) {
	var id = generateBotId();

	var bot = {
		id: id
		,equipment:  userPrototype['equipment']
		,stats: userPrototype['stats']
		,counters: {}
		,profile: randProfile()
		,team: userPrototype['team']
	}

	for (var i in bot.stats) {
		var rate = -3 + Math.floor(Math.random() * 7) // min -3, max 3
		var rate = rate / 100; // min -0.03, max 0.03
		var stat = bot.stats[i] + (bot.stats[i] * rate);

		bot.stats[i] = stat;
	}

	var self = this;

	setTimeout(function() {
		self.emit( 'complete', bot );
	});
}
util.inherits(createBotProfile, EventEmitter);

var createBotWorker = function(battleId, bot) {
	log.debug('(PIKE) Create bot worker, for battle ID %s', battleId);
}

exports.createBotProfile	= createBotProfile;
exports.createBotWorker		= createBotWorker;
exports.getActiveBots		= getActiveBots;
