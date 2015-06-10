var ejs 			= require('ejs');
fs					= require('fs');

var widgetsDir		= 'widgets/';
var viewDir			= 'view/';

var getRender = function(path) {
	var viewPath = path + '/' + viewDir;

	var render = function( template, data ) {
		var path = viewPath + template + '.ejs';
		var str = fs.readFileSync(path, 'utf8');
		var html = ejs.render(str, data);
		return html;
	}

	return render;
}

module.exports.getRender = getRender;