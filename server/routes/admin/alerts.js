var adminRoute		= require('./index');

var index = function ( req, res) {
	adminRoute.render(res, 'alerts', {} );
}

exports.index = index;