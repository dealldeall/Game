var mongoose	= require('mongoose');
var Schema		= mongoose.Schema;

var UserSchema = new Schema({
    created: {
		type: Date
		,default: Date.now
	}
	,subscriptionTo: {
		type: Date
		,default: Date.now
	}
	,profile: {
		nickname: {
			type: String
			,default: ''
		}
		,race: {
			type: String
			,enum: ['human', 'raksasah', 'seylees']
			,default: 'human'
		}
		,gender: {
			type: String
			,enum: ['male', 'female']
			,default: 'male'
		}
		,avatar: {
			type: Number
			,default: 0
		}
		,lang: {
			type: String
			,enum: ['en', 'ru']
			,default: 'en'
		}
	}
	,location: {
		region: {
			type: String
			,default: 'beginner'
		}
		,zone: {
			type: String
			,default: 'alcovd'
		}
		,map: {
			type: String
			,default: 'town'
		}
		,action: {
			type: String
			,default: null
		}
		,data: {
			type: Schema.Types.Mixed
			,default: {}
		}
	}
	,realty: {
		beginner: {
			home: {
				type: String
				,default: 'social'
			}
		}
	}
	,equipment: {
		bracelets: {
			type: Schema.Types.Mixed
			,default: true
		}
		,hands: {
			type: Schema.Types.Mixed
			,default: true
		}
		,clothing: {
			type: Schema.Types.Mixed
			,default: true
		}
		,amulet: {
			type: Schema.Types.Mixed
			,default: true
		}
		,ring: {
			type: Array
			,default: [true, true, true]
		}
		,patronage: {
			type: Schema.Types.Mixed
			,default: true
		}
	}
	,backpack: {
		type: Array
		,default: null
	}
	,activeEffect: {
		type: Array
		,default: new Array(0)
	}
	,team: {
		type: Array
		,default: [true, true]
	}
	,quests: {
		type: Object
		,default: new Object()
	}
	,counters: {
		type: Object
		,default: new Object()
	}
	,countersUpdate: {
		type: Date
		,default: Date.now
	}
	,reputation: {
		type: Number
		,default: 0
	}
	,data: {
		type: Object
		,default: new Object()
	}
	,skills: {
		type: Array
		,default: [true, true, true, true]
	}
});

var UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;