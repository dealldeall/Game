var mongoose	= require( 'mongoose');
var Schema		= mongoose.Schema;

var AuthSchema = new Schema({
	providers: {
        type: Schema.Types.Mixed
        ,required: true
	}
	,created: {
		type: Date
		,default: Date.now
	}
    ,profiles: {
        type: [ Schema.Types.Mixed]
        ,default: [ null, null, null]
    }
});

var AuthModel = mongoose.model( 'Auth', AuthSchema);

module.exports = AuthModel;