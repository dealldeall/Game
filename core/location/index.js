var log         = require('libs/log')(module);

//Town
var alcovdTown = require('./region/beginner/alcovd');

//Area
var location 	= {
	beginner: {
		alcovd: alcovdTown
	}
}

var getMap = function(name){
	var path = 'location/map/' + name;
	return require(path);
}

var map = function(region, zone, map) {
	var loc = location[region][zone];

	if(loc.mapAvailable(map) === false) {
		return false;
	}

	return getMap(map);
}

exports.map = map;