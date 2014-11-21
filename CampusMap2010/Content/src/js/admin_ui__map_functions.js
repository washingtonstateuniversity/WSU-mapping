

var pageTracker = pageTracker || null;
var needsMoved = needsMoved || 0;
var map = map || null;





/*
 * puts element on map via set map 
 * mapOjb thru $(selector) set by $(selector).gmap()
 * type Marker|Polyline|etc
 *
 * style {
 * 		rest:{options:{},callback:function(){}},
 * 		hover:{options:{},callback:function(){}}
 * }
 *
*/














/* -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* this is where the fuss start and needs to be 
cleaned out or refactored back up the chain here */
/*function turnOnPOI(){
	var onPOIbiz = [
	  {
		featureType: 'poi',
		elementType: 'geometry',
		stylers: [
		  { visibility: 'on' }
		]
	  }
	];

	var mapType = new google.maps.StyledMapType(onPOIbiz, { name:
'No Stations' });	
	map.mapTypes.set('nostations', mapType);
	map.setMapTypeId('nostations');
}*/
/*function turnOffPOI(){
	var offPOIbiz = [
	  {
		featureType: 'poi',
		elementType: 'all',
		stylers: [
		  { visibility: 'off' }
		]
	  }
	];

	var mapType = new google.maps.StyledMapType(offPOIbiz, { name:
'No Stations' });	
	map.mapTypes.set('nostations', mapType);
	map.setMapTypeId('nostations');
	
	
	}*/

/*function applyType(type){
	var applyTypeOf = [
	  {
		featureType: 'poi',
		elementType: 'all',
		stylers: [
		  { visibility: 'off' }
		]
	  },
	  {
		featureType: type,
		elementType: 'all',
		stylers: [
		  { visibility: 'on' }
		]
	  }
	];
	var mapType = new google.maps.StyledMapType(applyTypeOf, { name:'No Stations' });	
	map.mapTypes.set('nostations', mapType);
	map.setMapTypeId('nostations');
}*/

/* check for deletion 
function getResolution(lat, zoom, tile_side){
	var grid = tile_side || 256;
	var ret = {};
	ret.meterperpixel = 2 * Math.PI * 6378100 * Math.cos(lat * Math.PI/180) / Math.pow(2, zoom) / grid;
	ret.cmperpixel = ret.meterperpixel * 100;
	ret.mmperpixel = ret.meterperpixel * 1000;
	ret.pretty = ( Math.round(ret.meterprepixel) ) + ' meters/px';
	if (ret.meterperpixel < 10) {
	  ret.pretty = ( Math.round( ret.meterperpixel * 10 ) / 10 ) + ' meters/px';
	}
	if (ret.meterperpixel < 2) {
		ret.pretty = ( Math.round( ret.cmperpixel ) ) + ' cm/px';
	}
	if (ret.cmperpixel < 10) {
		ret.pretty = ( Math.round( ret.cmperpixel * 10 ) / 10 ) + ' cm/px';
	}
	if (ret.cmperpixel < 2) {
		ret.pretty = ( Math.round( ret.mmperpixel ) ) + ' mm/px';
	}
	return ret;
}
function setZoomTooltip(){
	var res = getResolution(map.getCenter().lat(), map.getZoom()).pretty;
	var text = 'Zoom = ' + map.getZoom() + '  (' + res + ')';
	var divs = map.getDiv().getElementsByTagName('div');
	for (var i=0, len=divs.length; i<len; i++){
		if (divs[i].title.toLowerCase().indexOf("zoom") > -1) {
			divs[i].title = text;
		}
	}
}
*/	



