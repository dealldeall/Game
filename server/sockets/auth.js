var config				= require( 'config')
    ,async				= require( 'async')
    ,log				= require( 'libs/log')(module)
    ,itemsCore			= require( 'core/items')
    ,characterCore      = require( 'core/character')
    ,auth               = require( 'libs/auth')
    ,UserModel          = require( 'libs/db').UserModel
    ,validator          = require( 'validator')
    ,frontCore  	    = require( 'core/front');

var characterConfig     = config.get( 'character');

function init( socket) {
    //Sockets for auth user
    socket.on( 'auth/create', createCharacter)
    socket.on( 'in_game', loginCharacter)
}

function loginCharacter( data){

    var socket = this
        ,uid = socket.handshake.session.uid
        ,idx = data.idx
        ,characterOfProfile = config.get( 'game:characterOfProfile')

    if( idx < 0 || idx > characterOfProfile ) {

        return log.warn( 'Uid request profile idx %s', idx);
    }

    characterCore.setActiveProfile( uid, idx);
}

function createCharacter ( data){
    var socket = this;

    //validation data
    var maxIndex = {
        idx: ( config.get( 'game:characterOfProfile') - 1)
        ,race: ( characterConfig.race.length - 1)
        ,gender: ( characterConfig.gender.length - 1)
        ,avatar: ( characterConfig.avatarsCount - 1)
    }

    if( ! (
        validator.isLength( data.nickname, 1, 120)
        && validator.isInt( data.race) && data.race >= 0 && data.race <= maxIndex.race
        && validator.isInt( data.gender) && data.gender >= 0 && data.gender <= maxIndex.gender
        && validator.isInt( data.avatar) && data.avatar >= 0 && data.avatar <= maxIndex.avatar
        && validator.isInt( data.idx) && data.idx >= 0 && data.idx <= maxIndex.idx
    )) {

        return log.warn( 'The data for a profile is not valid', data);
    }

    //get uid & check slot
    var uid = socket.handshake.session.uid
        ,profileIdx = data.idx
        ,pid = auth.getProfile( uid)[ profileIdx];

    if( pid != null) {
        return log.warn( 'Profile ' + pid + ' is exist');
    }

    //create new profile
    var race = characterConfig.race[ data.race]
        ,gender = characterConfig.gender[ data.race]
        ,backpack = new Array( characterConfig.backpackSize);

    for( var idx = 0; idx < characterConfig.backpackSize; idx++) {
        backpack[ idx] = null;
    }

    async.concat(
        characterConfig.startEquipment
        ,function( equipmentName, callback ) {

            itemsCore.createItem( equipmentName, function( err, itemId ){
                callback( err, itemId );
            });
        }
        ,function( err, result ) {
            if( err ) { return log.error( err ); }

            log.debug( 'create %s items for new pid', result.length);

            for( var idx in result) {
                backpack[ idx] = result[ idx];
            }

            var profile =  {
                profile: {
                    nickname: data.nickname
                    ,race: race
                    ,gender: gender
                    ,avatar: data.avatar
                }
                ,backpack: backpack
                ,data: {
                    equipmentSlot: characterConfig.baseEquipmentSlot
                    ,reputation: 100
                }
            }

            UserModel.create( profile, function( err, profile){
                if( err) { log.error( err); return;}

                profile = profile.toObject();
                var pid = profile._id;

                log.debug( 'create new pid %s', pid.toString());

                characterCore.setCache( pid, profile);
                auth.updateProfile( uid, profileIdx, pid, function( profilesId){

                    var profiles = []

                    var race = config.get( 'character:race')
                        ,gender = config.get( 'character:gender');

                    //get profile data
                    for( var idx in profilesId){

                        if( typeof profilesId[ idx] == 'undefined' || profilesId[ idx] == null) {

                            profiles[ idx] = null;
                        } else {

                            var pid = profilesId[ idx];

                            var data = characterCore.get( pid).data.profile
                                ,profile = {
                                    nickname: data.nickname
                                    ,avatar: data.avatar
                                    ,race: race.indexOf( data.race)
                                    ,gender: gender.indexOf( data.gender)
                                }

                            profiles[ idx] = profile;
                        }
                    }

                    var data = { profiles: profiles};
                    frontCore.sendToUid( uid, 'auth/profiles', data)
                })
            });
        }
    );
}

module.exports.createCharacter      = createCharacter;
module.exports.init                 = init;