var config						= require( 'config')
	,log						= require( 'libs/log')(module)
	,UserModel					= require( 'libs/db').UserModel

var EventEmitter				= require( 'events').EventEmitter
	,merge						= require( 'merge');

var userCache = {};

//load user
UserModel.find( {}, function( err, docs) {
    if( err) { return log.error( err)}

    var count = 0;
    if( docs !== null) {

        docs.forEach( function( doc){

            var uid = doc._id;
            setCache( uid, doc);
        })

        count = Object.keys( docs).length;
    }

    log.info( 'Load ' + count + ' users');
});


//get user profile
function get( uid){
    return userCache[ uid];
}

//set in cache
var setCache = function( uid, user){

	var user = JSON.stringify( user)
	user = JSON.parse( user);

	userCache[ uid] = {
		data: user
		,dataEffectCache: {}
		,effect: {}
		,counters: {}
	}
}


//update user profile
var update = function( uid, data){

	UserModel.findByIdAndUpdate( uid, data, function( err, doc){
		log.debug( doc);
	});

	userCache[ uid].data = merge( userCache[ uid].data, data);
}

/*

var characterConfig	= config.get( 'character');

var userList = {};

var dropCache = function( uid ) {

	if( uid ) {
		delete(userList[uid]);
	} else {
		userList = {};
	}
}

//Counters
var countersRate = config.get( 'game:counters:list');
var timerCounters = setInterval(function(){
	for(var uid in userList) {
		for(var counter in userList[uid].counters) {
			userList[uid].counters[counter] += countersRate[counter];

			if(userList[uid].counters[counter] > userList[uid].stat[counter]) {
				userList[uid].counters[counter] = userList[uid].stat[counter];
			}
		}

		characterFrontCore.counters(uid, userList[uid].counters);
	}

}, config.get( 'game:counters:tickSize' ));
timerCounters.unref();

//BD saver
var dbSaver = function(){
	for(var uid in userList) {
		saveProfile(uid);
	}
}

//Profile manager
var getProfile = function( uid, callback ){

	var self = this;

	var returnUser = function() {
		if( callback ) {
			callback( null, userList[uid] );
		} else {
			setTimeout(function() {
				self.emit( 'complete', userList[uid] );
			});
		}
	}

	if( userList[uid] ) {
		returnUser();
	} else {

		UserModel.findById(uid, function(err, user){
			if( err ) { log.error( err ); return false; }

			generateCompleteProfile( user.toObject(), function( err, user ){
				userList[uid] = user;
				returnUser();
			});
		});
	}
}
util.inherits(getProfile, EventEmitter);

var saveProfile = function(uid){
	var data = clone(userList[uid]);

	delete(data.mod);
	delete(data.stat);
	delete(data.combatStat);

	for(var itemIdx in data.backpack) {
		if( typeof data.backpack[itemIdx] == 'object') {
			data.backpack[itemIdx] = data.backpack[itemIdx].id;
		}
	}

	data.countersUpdate = Date.now();

	UserModel.update({_id : uid}, data, function(err, doc) {
		if( err ) {
			log.error( err );
		} else {
			log.debug( 'uid %s, updated in db', uid );
		}
	});
}

var generateCompleteProfile = function( user, callback ) {

	//Items
	var equipment = [true, true, true]
	var warehouse = [true, true, true]

	var allItemsSets = [
		user.backpack
		,equipment
		,warehouse
	]

	async.concatSeries(
		allItemsSets
		,function( itemsSet, allItemsSetsCallback ) {

			//items set. equipment, backpack and other
			async.concatSeries(
				itemsSet
				,function( itemId, itemsSetCallback ) {

					if( typeof itemId == 'string') {

						itemsCore.getItem( itemId, function( err, item ){
							itemsSetCallback( err, item );
						})

					} else {
						itemsSetCallback( null, itemId );
					}
				}
				,function( err, itemsSetResults ){
					if( err ) { log.error( err ); }

					//async push fix
					var itemsSetResults = [itemsSetResults];
					allItemsSetsCallback( err, itemsSetResults );
				}
			)
		}
		,function( err, allItemsSetResults ) {
			if( err ) { log.error(err); }

			//see result structure in allItemsSets variable
			var backpack = allItemsSetResults[0];

			var data = {
				id: user._id.toString()
				,activeEffect: user.activeEffect
				,backpack: backpack
				,equipment: user.equipment
				,location: user.location
				,profile: user.profile
				,realty: user.realty
				,mod: {}
				,stat: {}
				,team: user.team
				,counters: {}
				,data: user.data
			}

			delete(user);

			refreshEffect( data, function( err, user ){
				callback( err, user );
			});
		}
	);
}

var uidTypeOf = function( uid ) {
	if( uid.charAt(0) == '_') {
		return 'bot';
	} else {
		return 'user';
	}
}

var refreshEffect = function( user, callback ) {

	var race = user.profile.race;
	var mod = characterConfig.raceBaseMod[race];
	var stats = characterConfig.baseStat;

	user.mod = clone(mod);
	user.stat = clone(stats);

	log.debug('(PIKE) - For equipment and buff effect');

	var sumBonuses = {};

	for(var equipmentIdx in user.equipment ) {
		var item = user.equipment[equipmentIdx]
		if( !item.id ) {
			continue;
		}

		var itemBonuses = [item.original.data, item.data];
		for(var itemBonusesIdx in itemBonuses) {
			var bonusData = itemBonuses[itemBonusesIdx];

			if( !bonusData ) {
				continue;
			}

			if( bonusData.baseBonus ) {
				for(var name in bonusData.baseBonus) {
					var value = bonusData.baseBonus[name];

					if( !sumBonuses[name] ) {
						sumBonuses[name] = 0
					}

					sumBonuses[name] += value;
				}
			}

			if( bonusData.baseBonus ) {
				for(var name in bonusData.baseBonus) {
					var value = bonusData.baseBonus[name];

					if( !sumBonuses[name] ) {
						sumBonuses[name] = 0
					}

					sumBonuses[name] += value;
				}
			}
		}
	}

	for(var name in sumBonuses) {
		var value = sumBonuses[name];

		user.stat[name] += value;
	}

	//apply limits
	var maxModRate = characterConfig.maxModRate;
	var maxStat = characterConfig.maxStat;

	for (var name in user.mod) {
		var value = user.mod[name];

		var maxMod = mod[name] * maxModRate;

		if(mod > maxMod) {
			user.mod[name] = maxMod;
		}
	}

	var modsStatsRate = characterConfig.modRate;

	for (var name in user.stat) {
		var stat = user.stat[name];

		var modStatRate = modsStatsRate[name];

		if( modStatRate ) {
			var sumStatRate = (modStatRate['health'] * user.mod['health']) + (modStatRate['fortitude'] * user.mod['fortitude']) + (modStatRate['martial-arts'] * user.mod['martial-arts'])
			stat = stat * (sumStatRate + 1);
		}

		if(stat > maxStat[name]) {
			user.stat[name] = maxStat[name];
		} else {

			if( maxStat[name] <= 1 ) {

				user.stat[name] = Math.floor(stat * 100) / 100;
			} else {
				user.stat[name] = Math.floor(stat);
			}
		}
	}

	//counters
	if( !user.counters['health-point'] ) {
		user.counters['health-point'] = clone(user.stat['health-point'])
	}

	if( !user.counters.energy ) {
		user.counters.energy = clone(user.stat.energy)
	}

	if( !user.counters.adrenaline ) {
		user.counters.adrenaline = clone(user.stat.adrenaline)
	}

	callback( null, user );
}

var generatePublicProfile = function( character ) {

	var data = {
		id: character.id
		,activeEffect: character.activeEffect
		,stat: character.stat
		,profile: character.profile
		,counters: character.counters
	}

	return data;
}


module.exports.uidTypeOf				= uidTypeOf;
module.exports.refreshEffect			= refreshEffect;

module.exports.generatePublicProfile	= generatePublicProfile;
module.exports.dropCache				= dropCache;
module.exports.dbSaver					= dbSaver;

*/

module.exports.get						= get;
module.exports.update					= update;
module.exports.setCache					= setCache;
