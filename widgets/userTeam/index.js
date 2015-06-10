var async			= require('async');
var widgetUserCard	= require('widgets/userCard');
var log				= require('libs/log')(module);
var templateRender	= require('libs/widgets').getRender(__dirname);

var render = function( user, finalCallback ) {
	async.parallel(
		[
			function(callback) {
				var character = generateCardData(user);
				widgetUserCard.render( character, function(err, data) {
					callback( err, data );
				});
			}
			,function(callback) {
				var character = generateCardData(user.team[0]);
				widgetUserCard.render( null, function(err, data) {
					callback( err, data );
				});
			}
			,function(callback) {
				var character = generateCardData(user.team[1]);
				widgetUserCard.render( null, function(err, data) {
					callback( err, data );
				});
			}
		]

		,function(err, result) {
			if(err) { log.debug(); }

			var data = {
				renderTeam: [
					result[0].html
					,result[1].html
					,result[2].html
				]
			}

			var html = templateRender('team', data)

			var data = {
				name: 'userTeam'
				,html: html
			}

			finalCallback(null, data);
		}
	)
}

var generateCardData = function( character ) {
	if( !character ) {
		return null;
	}

	var data = {
		username: character.profile.username
		,healthPoint: {
			cur: character.counters.healthPoint
			,max: character.stat.healthPoint
		}
		,energy: {
			cur: character.counters.healthPoint
			,max: character.stat.energy
		}
		,adrenaline: {
			cur: character.counters.healthPoint
			,max: character.stat.adrenaline
		}
	}

	return data;
}

module.exports.render = render;