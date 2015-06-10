/**
 *  authorization module SMO Project.
 *	Copyright (c) 2015-2025 Alexander Litvinenko <lenDesakura@gmail.com>
 *	Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
 *	Version: 1.0 (2015\03\04)
 */
var async				= require( 'async')
    ,config				= require( 'config')
    ,log				= require( 'libs/log')( module)
	,AuthModel			= require( 'libs/db').AuthModel
	,authFrontCore		= require( 'core/front/auth')

//list of oauth provider
var oauth = {
	gl					: require( './oauth/gl')
	,vk					: require( './oauth/vk')
	,tw					: require( './oauth/tw')
	,fb					: require( './oauth/fb')
}

var users = {};


function setActiveProfile( uid, idx) {

    users[ uid].active = idx;
    authFrontCore.setActiveProfile( uid, idx)
}

function updateProfile( uid, idx, pid, callback) {

    var condition = 'profiles.' + idx
        ,data = {};

    data[ condition] = pid
    AuthModel.findByIdAndUpdate( uid, data, function( err, user) {
        if( err) { log.error( err); return;}

        user = user.toObject();

        var profilesId = user.profiles;

        users[ uid].profiles[ idx] = pid;
        if( typeof callback == 'function') {

            callback( profilesId)
        }
    });
}

function getProfile( uid) {
    var data = JSON.parse( JSON.stringify( users[ uid]));

    return data;
}

//login user by oauth provider
function login( provider, id, token, callback) {

    async.waterfall(
        [
            function( callback){

                var condition = 'providers.' + provider + '.uid'
                    ,criteria = {}

                criteria[ condition] = id;
                AuthModel.findOne( criteria, function( err, doc){
                    if( err){ callback( err); return; }

                    var profiles = []
                        ,uid = null;

                    if( doc != null) {

                        doc = doc.toObject();
                        profiles = doc.profiles;
                        uid = doc._id;
                    }


                    callback( null, uid, profiles);
                })
            },
            function( uid, profiles, callback) {

                //if the current user is not registered
                if (uid === null) {

                    //create profile
                    var data = {
                        providers: {}
                    }

                    data.providers[provider] = {
                        uid: id
                        , token: token
                    }

                    AuthModel.create( data, function ( err, doc) {
                        if ( err) { callback( err); return; }

                        var uid = doc.id
                            , profiles = doc.profiles

                        callback( null, uid, profiles);
                    });
                } else {

                    callback( null, uid, profiles);
                }
            }
            ,function( uid, profiles, callback) {

                if( typeof users[ uid] == 'undefined') {

                    users[ uid] = {
                        profiles: profiles
                        ,active: null
                    }
                }

                callback( null, uid);
            }
        ], callback
    );
}

module.exports.setActiveProfile = setActiveProfile;
module.exports.updateProfile = updateProfile;
module.exports.getProfile = getProfile;

module.exports.login = login;
module.exports.oauth = oauth;