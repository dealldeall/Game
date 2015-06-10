var mongoose	= require('mongoose');
var Schema		= mongoose.Schema;

var Battle = new Schema({
	type: {
		type: String
	}
	,created: {
		type: Date
		,default: Date.now
	}
	,forces: {
		type:  Schema.Types.Mixed
	}
	,turn: {
		type: Number
		,default: 1
	}
	,log: {
		type: Object
		,default: new Object()
	}
	,data: {
		type: Object
		,default: new Object()
	}
});

var BattleModel = mongoose.model('Battle', Battle);
module.exports = BattleModel;
