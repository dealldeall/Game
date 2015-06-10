var log		    		= require( 'libs/log')(module)
    ,httpUtil			= require( 'server/middleware/httpUtil')
	,auth				= require( 'libs/auth')
    ,config				= require( 'config')
    ,characterCore		= require( 'core/character')

module.exports = function( app) {

	//oauth
	app.get( '/auth/oauth/:provider', function ( req, res){

		//logout
		if( req.session.uid) {
            delete( req.session.uid);
		}

		var code = req.query.code;

		if( ! code) {
			return res.sendHttpError( { status: 500});
		}

		var providerName = req.params.provider
			,provider = auth.oauth[ providerName];

		if( typeof provider == 'undefined') {
			return res.sendHttpError( { status: 500});
		}

		//exec code
		provider.execCode( code, function( uid, token){

            if( ! ( uid)) {
                return res.sendHttpError( 500)
            }

			auth.login( providerName, uid, token, function( err, uid){
                if( err){ res.sendHttpError( 500); return; }

				req.session.uid = uid;
				res.redirect( '/auth/characters');
			});
		});
	});


    app.get( '/auth/characters', httpUtil.onlyAuthUser, function ( req, res){

        var characterOfProfile = config.get( 'game:characterOfProfile')
            ,uid = req.session.uid
            ,profilesId = auth.getProfile( uid).profiles
            ,profiles = []

        var race = config.get( 'character:race')
            ,gender = config.get( 'character:gender');

        //get profile data
        for( var idx = 0; idx < characterOfProfile; idx++){

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

        var data = {
            profiles: profiles
            ,race: race
            ,gender: gender
            ,avatarsCount: config.get( 'character:avatarsCount')
        }

        res.renderPage( 'characters', data);
    });


	//logout
	app.get( '/auth/logout', function ( req, res){

        delete( req.session.uid);
		res.redirect( '/');
	});
}