var ItemsOriginalModel		= require( 'libs/db').ItemsOriginalModel;
var async					= require( 'async');
var log						= require( 'libs/log')(module);
var itemsCore				= require( 'core/items');

var ItemsOriginalSave			= require('./itemOriginal');

var check = function(){

	async.parallel(
		[
			function( callback) {

				ItemsOriginalModel.count(function (err, count) {

					if( count == 0) {
						async.concat(
							ItemsOriginalSave,

                            function( item, itemsCallback ) {



                                ItemsOriginalModel.create( item, function ( err, data) {
									itemsCallback( err);
								})

							}
							,function(err, result){
								callback( err, 'items original' );
							}
						);
					} else {
						callback( err );
					}
				});
			}
		]
		,function( err, result ) {
			if ( err ) { log.error( 'Install fail', err ); }

			var resultString = result.join(', ');

			if( resultString ) {
				log.info('installed: %s', resultString);
			} else {
				log.info('Installation is not needed');
			}
		}
	)
}

module.exports.check = check;