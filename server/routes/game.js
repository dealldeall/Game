var config				= require( 'config')
	,async				= require( 'async')
	,log				= require( 'libs/log')(module)
	,UserModel			= require( 'libs/db').UserModel
	,auth	    		= require( 'libs/auth')
	,httpUtil			= require( 'server/middleware/httpUtil')
	,widgetBattleForce	= require( 'widgets/widgetBattleForce')

var  character      	= require( 'core/character')

module.exports = function( app) {

	app.get( '/game', httpUtil.onlyAuthUser, function(req, res) {

        var uid = req.session.uid
            ,user = auth.getProfile( uid);

        var data = {
            uid: uid
            ,user: user
        }
        res.json( data);

        return;


        var idx = req.session.activeProfile;


        if( idx == null) {
            res.redirect( '/auth/characters')
        }

        //FOR TEST
        return res.sendHttpError( 403);

		var pid = session.profiles[ idx]
            ,profile = character.get( pid);

        if ( user.data.profile.username == '') {
            res.redirect( '/characters');
        } else {
            res.redirect( '/game');
        }

        //render template
        async.parallel(
            [
                function( callback) {
                    widgetBattleForce.render( callback);
                }
            ]

            ,function(err, result) {
                if ( err ) { res.end( 500); return log.error( err); }

                var data = {
                    title: 'My Game'
                    ,widgets: {}
                }

                result.forEach( function( value) {
                    data.widgets[ value.name] = value.html
                });

                res.render( 'layout/game', data);
            }
        );
	});


	app.get('/user/:name', function(req, res) {
		var condition = {profile : {username : req.params.name}};

		UserModel.findOne(condition, function(err, user) {
			if ( err ) { log.debug(err); return false; }

			if(user) {

				app.render('user', {user : user}
					,function(err, html){
						res.render('layout/main', {
							title: 'Testers login'
							,content: html
							,template: template
						});
					}
				);

				res.render('layout/main', {
					title: 'Master ' + user.profile.username
					,user : user
				}, function(){

				});
			} else {
				res.end();
			}
		});
	});
}