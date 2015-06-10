var async 					= require('async');
var merge					= require( 'merge');
var config					= require('config');
var log         			= require('libs/log')(module);
var ItemsOriginalModel		= require('libs/db').ItemsOriginalModel;
var ItemsModel				= require('libs/db').ItemsModel;

var itemsOriginalList = {};
var itemsList = {};

//Item manager
var getItemOriginal = function( name, callback){
	if(itemsOriginalList[name]) {
		callback(null, itemsOriginalList[name]);
		return true;
	}

	ItemsOriginalModel.findOne({name: name}, function(err, itemOriginal){
		if( err ) { log.error( err ); return false; }

		if( !itemOriginal ) {
			var err = new Error( 'no item original: ' + name )
			callback( err );
			return false;
		}

		var data = itemOriginal.toObject();
			data.id = data._id.toString();

		//clear
		delete(itemOriginal);
		delete(data.__v);
		delete(data._id);

		itemsOriginalList[name] = data;
		callback( err, itemsOriginalList[name] );
	});
}

var getItem = function(id, callback){
	if( itemsList[id] ) {

		generateCompleteItem( id, function( err, completeItem ) {
			callback(err, completeItem);
		});
	} else {

		ItemsModel.findById(id, function( err, item ){
			if( err ) { log.error( err ); return false; }
			if( !item ) { log.error( 'No item id %s', id ); return false; }

			var data = item.toObject();

			//clear
			delete(item);
			delete(data.__v);
			delete(data._id);

			data.id = id;

			itemsList[id] = data;

			generateCompleteItem( id, function( err, completeItem ) {
				callback(err, completeItem);
			});
		});
	}
}

function createItem( name, callback ){

	getItemOriginal( name, function( err, itemOriginal ) {
		if( err ) { return log.error( err );}

		var Item = new ItemsModel( { original: name, data: {} } );

		Item.save(function ( err, doc ) {
			if( err ) { log.error( err ); return false; }

			var id = doc.id.toString();
			var data = doc.toObject();

			//clear
			delete(doc);
			delete(data.__v);
			delete(data._id);

			data.id = id;
			data.data = {}

			itemsList[id] = data;
			callback( err,  id );
		});
	})
}

var generateCompleteItem = function( id, callback ) {
	var item = itemsList[id];

	getItemOriginal(item.original, function(err, original){
		var completeItem = {
			id: id
			,data: item.data
			,original: original
		}
		callback(err, completeItem);
	})
}


module.exports.createItem = createItem;
module.exports.getItem = getItem;
/*
 var stats = {
 health: 0
 ,fortitude: 0
 ,martialArts: 0

 ,healthPoint: 0
 ,attack: 0
 ,armor: 0
 ,resistance: 0
 ,dodgeRate: 0
 ,blockRate: 0
 ,criticalRate: 0
 ,energy: 0
 ,adrenaline: 0
 }
 */