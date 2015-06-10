var mongoose	= require('mongoose');
var Schema		= mongoose.Schema;

var SkillsSchema = new Schema({
	name: {
		type: String,
		unique: true,
		required: true
	}
	,must: {
		type: Array
		,default: null
	}
	,type: {
		type: String
		,enum: ['damage', 'heal', 'aoe', 'dot']
		,required: true
	}
	,quality: {
		type: String
		,enum: ['gray', 'green', 'blue', 'purple']
		,required: true
		,default: 'gray'
	}
	,data: {
		type: Object
		,default: null
	}
});

var SkillsModel = mongoose.model('Skills', SkillsSchema);

module.exports = SkillsModel;
