var log         		= require( 'libs/log')(module);
var config				= require( 'config');

var BattleModel			= require( 'libs/db').BattleModel;

var BattleCore			= require( './index');

var cache				= require( './cache');

var util				= require( 'util');
var EventEmitter		= require( 'events').EventEmitter;


var battle = function( data) {
	this.created	= Date.now();
	this.turn		= 1;
	this.status		= 'active';
	this.data		= {};

	//function
	this.escape = function( uid) {
		log.debug( 'uid ' + uid + ' escaped');
	}

	this.getPublicData = getPublicData;

	//log
	var time = Date.now();

	this.log = {}
	this.log[time] = { message: 'battle create'};

	//set data
	for( var name in data) {
		var value = data[name];
		this[name] = value;
	}

	//need id?
	var self = this;

	if( this.id) {
		setTimeout( function() {
			self.emit( 'complete');
		});

		return;
	}

	new BattleModel().save( function( err, doc) {
		if( err) { log.error( err); return false; }

		var id = doc.toObject()._id.toString();

		self.id = id;

		setTimeout(function() {
			self.emit( 'complete');
		});
	});
}
util.inherits(battle, EventEmitter);


var begin = function( sides, type) {

	var forces = {};

	for(var idx in sides){

		var force = [];

		if(typeof sides[idx] != 'array') {
			force.push( sides[idx] );
		} else {
			force = sides[idx];
		}

		for(var forceIdx in force) {
			var uid = force[forceIdx]['id'];

			var team = force[forceIdx]['team'];

			forces[uid] = {
				uid: uid
				,status : 'active'
				,side : idx
			}
		}
	}

	var self = this;

	var data = {
		forces: forces
		,type: type
	}

	var newBattle = new battle( data);
	newBattle.once( 'complete', function(){
		cache.setBattle( newBattle);

		setTimeout(function() {
			self.emit( 'begin', newBattle.id);
		});
	})
}
util.inherits(begin, EventEmitter);

var getPublicData = function() {
	var self = this;

	var pubBattle = clone( battle);
	log.debug( pubBattle);

	delete( pubBattle.log );
	delete( pubBattle.data );
	pubBattle.forces = {};

	var forcesCount = Object.keys( battle.forces).length;

	var addTeam = function( team) {

		pubBattle.forces[team.uid] = team

		var pubForcesCount = Object.keys( pubBattle.forces).length;

		if( pubForcesCount == forcesCount ) {

			setTimeout(function() {
				self.emit( 'complete', pubBattle);
			});
		}
	}

	for( var idx in battle.forces) {
		var force = battle.forces[idx];

		var uid = force.uid;

		if( characterCore.uidTypeOf( uid) != 'user') {
			addTeam( force);
		} else {(
			new characterCore.getProfile( uid)
				.once( 'complete', function( user) {

					force.team = [
						characterCore.generatePublicProfile( user)
						,true
						,true
					]

					addTeam( force);
				})
			)}
	}
}
util.inherits(getPublicData, EventEmitter);

module.exports.begin = begin;