var mongoose			= require( 'mongoose')
	,log				= require( 'libs/log')(module)
	,config				= require( 'config')
    ,SessionExpress		= require( 'express-session')


mongoose.connect( config.get( 'mongoose:uri'));
var db = mongoose.connection;

db.on( 'error', function ( err) {
	log.error( 'connection error:', err.message);
});

db.once( 'open', function () {
	log.info( 'Connected to DB!');
});

var session = SessionExpress({
    secret: config.get('session:secret')
    , key: config.get('session:key')
    , saveUninitialized: true
    , resave: true
})


module.exports.mongoose				= mongoose;
module.exports.session  			= session;

module.exports.AuthModel			= require( './schema/Auth');
module.exports.UserModel			= require( './schema/User');
module.exports.BattleModel 			= require( './schema/Battle');
module.exports.ItemsOriginalModel	= require( './schema/ItemsOriginal');
module.exports.ItemsModel			= require( './schema/Items');