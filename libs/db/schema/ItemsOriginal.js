var mongoose	= require('mongoose');
var Schema		= mongoose.Schema;

var ItemsOriginal = new Schema({
	name: {
		type: String
		,required: true
	}
	,type: {
		type: String
		,enum: ['bracelets', 'hands', 'clothing', 'patronage', 'amulet', 'ring', 'potion', 'scroll', 'rod', 'rune', 'other']
		,required: true
	}
	,quality: {
		type: String
		,enum: ['gray', 'green', 'blue', 'purple']
		,required: true
		,default: 'gray'
	}
	,data: {
		type: Schema.Types.Mixed
	}
});

var ItemsOriginalModel = mongoose.model('ItemsOriginal', ItemsOriginal);
module.exports = ItemsOriginalModel;