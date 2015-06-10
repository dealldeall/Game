var mongoose	= require('mongoose');
var Schema		= mongoose.Schema;

var Items = new Schema({
	data: {
		type: Schema.Types.Mixed
	}
	,original: {
		type: String
		,required: true
	}
});

var ItemsModel = mongoose.model('Items', Items);
module.exports = ItemsModel;