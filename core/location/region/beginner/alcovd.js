var maps = {
	'arena/basic' : true
	,'home' : true
	,'town' : true
	,'battle-training/alcovd' : true
	,'market/alcovd' : true
}

exports.mapAvailable = function(name){
	var map = maps[name];

	if(!map) {
		return false;
	}
	return map;
}
