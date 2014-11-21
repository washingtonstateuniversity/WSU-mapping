/* NOTE THERE IS A LOT OF EXTRA THAT NEEDS DELETING */

$.wsu_maps.defaults = {
	gmap_location_types:['building','accounting','airport','amusement_park','aquarium','art_gallery','atm','bakery','bank','bar',
						'beauty_salon','bicycle_store','book_store','bowling_alley','bus_station','cafe','campground','car_dealer',
						'car_rental','car_repair','car_wash','casino','cemetery','church','city_hall','clothing_store','convenience_store',
						'courthouse','dentist','department_store','doctor','electrician','electronics_store','embassy','establishment',
						'finance','fire_station','florist','food','funeral_home','furniture_store','gas_station','general_contractor',
						'geocode','grocery_or_supermarket','gym','hair_care','hardware_store','health','hindu_temple','home_goods_store',
						'hospital','insurance_agency','jewelry_store','laundry','lawyer','library','liquor_store','local_government_office',
						'locksmith','lodging','meal_delivery','meal_takeaway','mosque','movie_rental','movie_theater','moving_company',
						'museum','night_club','painter','park','parking','pet_store','pharmacy','physiotherapist','place_of_worship',
						'plumber','police','post_office','real_estate_agency','restaurant','roofing_contractor','rv_park','school',
						'shoe_store','shopping_mall','spa','stadium','storage','store','subway_station','synagogue','taxi_stand',
						'train_station','travel_agency','university','veterinary_care','zoo','administrative_area_level_1',
						'administrative_area_level_2','administrative_area_level_3','colloquial_area','country','floor','intersection',
						'locality','natural_feature','neighborhood','political','point_of_interest','post_box','postal_code',
						'postal_code_prefix','postal_town','premise','room','route','street_address','street_number','sublocality',
						'sublocality_level_4','sublocality_level_5','sublocality_level_3','sublocality_level_2','sublocality_level_1',
						'subpremise','transit_station'],
	/* rework to move into the default cache folder */
	get_wsu_logo_shape:function (){
		var Coords = [];
		var shaped = [];
		var shape = "-117.151680,46.737567,\n-117.152281,46.737390,\n-117.152753,46.737067,\n-117.153225,46.736655,\n-117.153397,46.736155,\n-117.153482,46.735449,\n-117.153268,46.734831,\n-117.153053,46.733949,\n-117.152710,46.732919,\n-117.152581,46.732331,\n-117.152538,46.731743,\n-117.152710,46.731066,\n-117.153010,46.730684,\n-117.153568,46.730390,\n-117.154341,46.730272,\n-117.155242,46.730272,\n-117.155199,46.730860,\n-117.155199,46.731301,\n-117.155800,46.730772,\n-117.156572,46.730125,\n-117.157817,46.729537,\n-117.156658,46.729448,\n-117.155199,46.729331,\n-117.153826,46.729213,\n-117.152796,46.729095,\n-117.151937,46.729125,\n-117.151251,46.729389,\n-117.150650,46.729860,\n-117.150350,46.730419,\n-117.150307,46.731184,\n-117.150650,46.732272,\n-117.150865,46.733155,\n-117.151165,46.734243,\n-117.151079,46.734978,\n-117.150693,46.735419,\n-117.150092,46.735861,\n-117.149405,46.736037,\n-117.148547,46.736008,\n-117.148204,46.735861,\n-117.147861,46.735567,\n-117.147560,46.735184,\n-117.147517,46.735684,\n-117.147646,46.736155,\n-117.147517,46.736390,\n-117.147517,46.736655,\n-117.145371,46.736684,\n-117.145371,46.736861,\n-117.147517,46.736890,\n-117.147560,46.737008,\n-117.145500,46.737272,\n-117.145543,46.737449,\n-117.147646,46.737243,\n-117.147646,46.737361,\n-117.145715,46.737831,\n-117.145844,46.738037,\n-117.147903,46.737596,\n-117.148204,46.737831,\n-117.150393,46.737714,\n-117.150092,46.738714,\n-117.150393,46.738714,\n-117.150865,46.737655,\n-117.151294,46.737655,\n-117.150865,46.738772,\n-117.151122,46.738743";
		
		var Rows=shape.split('\n');
		if(Rows.length){
			/*for(i=0; i<=Rows.length-1; i++){
				var cord=Rows[i].split(',');
				shaped.push(new google.maps.LatLng(parseFloat(cord[1]),parseFloat(cord[0])));
			}*/
			$.each(Rows.length,function(i){
				var cord=Rows[i].split(',');
				shaped.push(new google.maps.LatLng(parseFloat(cord[1]),parseFloat(cord[0])));
			});
		}
		Coords.push(shaped.reverse());
		
		shaped = [];
		shape = "-117.149577,46.736390,\n-117.150435,46.736537,\n-117.150908,46.736508,\n-117.151508,46.736449,\n-117.151937,46.736243,\n-117.152238,46.735949,\n-117.152367,46.735537,\n-117.152023,46.735743,\n-117.151594,46.736037,\n-117.151122,46.736184,\n-117.150564,46.736302,\n-117.150221,46.736361";
		
		Rows=shape.split('\n');
		if(Rows.length){
			/*for(i=0; i<=Rows.length-1; i++){
				var cord=Rows[i].split(',');
				shaped.push(new google.maps.LatLng(parseFloat(cord[1]),parseFloat(cord[0])));
			}*/
			$.each(Rows.length,function(i){
				var cord=Rows[i].split(',');
				shaped.push(new google.maps.LatLng(parseFloat(cord[1]),parseFloat(cord[0])));
			});
		}
		Coords.push(shaped);
		
		shaped = [];
		shape = "-117.153010,46.737331,\n-117.154212,46.737037,\n-117.155070,46.736625,\n-117.156014,46.736155,\n-117.156487,46.735831,\n-117.155628,46.735214,\n-117.155328,46.735449,\n-117.155285,46.734802,\n-117.155242,46.734008,\n-117.155714,46.734449,\n-117.156143,46.734772,\n-117.155929,46.734978,\n-117.156658,46.735625,\n-117.157130,46.735214,\n-117.157688,46.734537,\n-117.157903,46.734096,\n-117.156873,46.733508,\n-117.156744,46.733772,\n-117.156487,46.733361,\n-117.156487,46.732919,\n-117.156572,46.732507,\n-117.156701,46.732213,\n-117.156959,46.732655,\n-117.157216,46.732890,\n-117.157044,46.733272,\n-117.157946,46.733802,\n-117.158418,46.733066,\n-117.158976,46.732302,\n-117.159662,46.731566,\n-117.160220,46.731154,\n-117.159019,46.731301,\n-117.158074,46.731478,\n-117.158160,46.730860,\n-117.158504,46.730095,\n-117.159019,46.729507,\n-117.158160,46.729684,\n-117.157130,46.730154,\n-117.156229,46.730860,\n-117.155457,46.731625,\n-117.155156,46.732184,\n-117.154899,46.731596,\n-117.154813,46.730566,\n-117.154427,46.730537,\n-117.153912,46.730566,\n-117.153482,46.730743,\n-117.153654,46.730713,\n-117.153225,46.731007,\n-117.153010,46.731507,\n-117.153010,46.732184,\n-117.153139,46.733008,\n-117.153397,46.733713,\n-117.153654,46.734537,\n-117.153869,46.735302,\n-117.153869,46.735919,\n-117.153783,46.736419,\n-117.153482,46.736802,\n-117.153311,46.737067,\n-117.153010,46.737331";	
		Rows=shape.split('\n');
		if(Rows.length){
			/*for(i=0; i<=Rows.length-1; i++){
				var cord=Rows[i].split(',');
				shaped.push(new google.maps.LatLng(parseFloat(cord[1]),parseFloat(cord[0])));
			}*/
			$.each(Rows.length,function(i){
				var cord=Rows[i].split(',');
				shaped.push(new google.maps.LatLng(parseFloat(cord[1]),parseFloat(cord[0])));
			});
		}
		Coords.push(shaped);
		
		shaped = [];
		shape = "-117.150521,46.733684,\n-117.150435,46.733066,\n-117.150307,46.732537,\n-117.150092,46.732096,\n-117.149792,46.731596,\n-117.149448,46.731213,\n-117.148976,46.730919,\n-117.148461,46.730801,\n-117.148075,46.730772,\n-117.147689,46.730801,\n-117.147346,46.730949,\n-117.147045,46.731125,\n-117.146745,46.731449,\n-117.146616,46.731860,\n-117.146616,46.732243,\n-117.146702,46.732743,\n-117.146788,46.733213,\n-117.146916,46.733508,\n-117.147131,46.733919,\n-117.147088,46.733537,\n-117.147088,46.733155,\n-117.147217,46.732802,\n-117.147431,46.732478,\n-117.147818,46.732272,\n-117.148290,46.732184,\n-117.148719,46.732213,\n-117.149277,46.732419,\n-117.149620,46.732625,\n-117.150006,46.732919,\n-117.150221,46.733155,\n-117.150350,46.733390,\n-117.150521,46.733684";	
		Rows=shape.split('\n');
		if(Rows.length){
			/*for(i=0; i<=Rows.length-1; i++){
				var cord=Rows[i].split(',');
				shaped.push(new google.maps.LatLng(parseFloat(cord[1]),parseFloat(cord[0])));
			}*/
			$.each(Rows.length,function(i){
				var cord=Rows[i].split(',');
				shaped.push(new google.maps.LatLng(parseFloat(cord[1]),parseFloat(cord[0])));
			});
		}
		Coords.push(shaped);
		
		shaped = [];
		shape = "-117.150006,46.730154,\n-117.150221,46.729684,\n-117.150693,46.729331,\n-117.151165,46.729125,\n-117.149706,46.729095,\n-117.149749,46.729566,\n-117.149835,46.729890,\n-117.150006,46.730154";	
		Rows=shape.split('\n');
		if(Rows.length){
			/*for(i=0; i<=Rows.length-1; i++){
				var cord=Rows[i].split(',');
				shaped.push(new google.maps.LatLng(parseFloat(cord[1]),parseFloat(cord[0])));
			}*/
			$.each(Rows.length,function(i){
				var cord=Rows[i].split(',');
				shaped.push(new google.maps.LatLng(parseFloat(cord[1]),parseFloat(cord[0])));
			});
		}
		Coords.push(shaped);
		return Coords;
	},


	DOMAIN:'http://localhost:50759',
	//DEFAULT_overlay:null,
	//DEFAULT_polylines:[],

};

/*

var ib = [];
var timeouts;

var map;
var infowindow,
	service;
*/

//var	rest_Options={fillColor: "#a90533"};
//var	hover_Options={fillColor: "#5f1212"};	

//var element_pool = [];

// Our global state

//var boxHtmls;
//var referenceId;
//var localSearches;
//var selectedResults = [];
//var currentResults = [];
//var searchForm; 
/*var waypts = [],
	markers = [],
	checkboxArray = [],
	polylineOptions = [],
	overlay_pool = [],
	depth=0,
	fractal=0,
	iterator = 0,
	points=[],
	lableStyles=[],
	keysOrder=[],
	pullman = new google.maps.LatLng(46.730904390653876,-117.16101408004698);*/
//var pullman_str = '46.730904390653876,-117.16101408004698';

/*function gob(e){
	if(typeof(e)==='object'){
		return(e);
	}
	if(document.getElementById){
		return(document.getElementById(e));
	}
	return(eval(e));
}*/

//to show and hide controls base
//var controlsOut = {scaleControl: false,mapTypeControl:false,zoomControl:false,panControl:false,streetViewControl:false};
//var controlsIn  = {scaleControl: true,mapTypeControl:true,zoomControl:true,panControl:true,streetViewControl:true};



//var polyShape;
//var markerShape;
//var oldDirMarkers = [];
//var tmpPolyLine;
//var drawnShapes = [];
//var holeShapes = [];
//var startMarker;
//var nemarker;
//var tinyMarker;
//var markers = [];
//var midmarkers = [];
//var markerlistener1;
//var markerlistener2;
//var rectangle;
//var circle;
//var southWest;
//var northEast;
//var centerPoint;
//var radiusPoint;
//var calc;
//var startpoint;
//var dirpointstart = null;
//var dirpointend = 0;
//var dirline;
//var waypts = [];
////var waypots = [];
//var polyPoints = [];
//var pointsArray = [];
//var markersArray = [];
//var addresssArray = [];
//var pointsArrayKml = [];
//var markersArrayKml = [];
//var toolID = 1;
//var codeID = 1;
//var shapeId = 0;
//var adder = 0;
//var plmcur = 0;
//var lcur = 0;
//var pcur = 0;
////var rcur = 0;
//var ccur = 0;
//var mcur = 0;
//var outerPoints = [];
//var holePolyArray = [];
//var outerShape;
//var anotherhole = false;
////var it;
//var outerArray = [];
//var innerArray = [];
//var innerArrays = [];
//var outerArrayKml = [];
//var innerArrayKml = [];
//var innerArraysKml = [];
//var placemarks = [];





////var mylistener;
//var editing = false;
//var notext = false;
//var kmlcode = "";
//var javacode = "";
//var polylineDecColorCur = "255,0,0";
//var polygonDecColorCur = "255,0,0";
//var docuname = "My document";
//var docudesc = "Content";
//var polylinestyles = [];
//var polygonstyles = [];
////var rectanglestyles = [];
//var circlestyles = [];
//var markerstyles = [];
// //var geocoder; = new google.maps.Geocoder();
////var startLocation;
//var endLocation;
////var dircount;
//var dircountstart;
//var directionsDisplay;
//var directionsService = new google.maps.DirectionsService();
//var directionsYes = 0;
//var dirtool = 0;
////var oldDirections = [];
//var destinations = [];
////var currentDirections = null;
//var oldpoint = null;
////var infowindow = new google.maps.InfoWindow({size: new google.maps.Size(150,50)});
//var tinyIcon = new google.maps.MarkerImage(
//	$.wsu_maps.defaults.DOMAIN+'/Content/Content/images/marker_20_red.png',
//	new google.maps.Size(12,20),
//	new google.maps.Point(0,0),
//	new google.maps.Point(6,16)
//);
//var tinyShadow = new google.maps.MarkerImage(
//	$.wsu_maps.defaults.DOMAIN+'/Content/images/marker_20_shadow.png',
//	new google.maps.Size(22,20),
//	new google.maps.Point(6,20),
//	new google.maps.Point(5,1)
//);
//var imageNormal = new google.maps.MarkerImage(
//	$.wsu_maps.defaults.DOMAIN+'/Content/images/square.png',
//	new google.maps.Size(11, 11),
//	new google.maps.Point(0, 0),
//	new google.maps.Point(6, 6)
//);
//var imageHover = new google.maps.MarkerImage(
//	$.wsu_maps.defaults.DOMAIN+'/Content/images/square_over.png',
//	new google.maps.Size(11, 11),
//	new google.maps.Point(0, 0),
//	new google.maps.Point(6, 6)
//);
//var imageNormalMidpoint = new google.maps.MarkerImage(
//	$.wsu_maps.defaults.DOMAIN+'/Content/images/square_transparent.png',
//	new google.maps.Size(11, 11),
//	new google.maps.Point(0, 0),
//	new google.maps.Point(6, 6)
//);
///*var imageHoverMidpoint = new google.maps.MarkerImage(
//	"square_transparent_over.png",
//	new google.maps.Size(11, 11),
//	new google.maps.Point(0, 0),
//	new google.maps.Point(6, 6)
//);*/
//// Create our "tiny" marker icon
//var gYellowIcon = new google.maps.MarkerImage(
//	"http://labs.google.com/ridefinder/images/mm_20_yellow.png",
//	new google.maps.Size(12, 20),
//	new google.maps.Point(0, 0),
//	new google.maps.Point(6, 20)
//	);
//var gRedIcon = new google.maps.MarkerImage(
//	"http://labs.google.com/ridefinder/images/mm_20_red.png",
//	new google.maps.Size(12, 20),
//	new google.maps.Point(0, 0),
//	new google.maps.Point(6, 20)
//	);
//var gSmallShadow = new google.maps.MarkerImage(
//	"http://labs.google.com/ridefinder/images/mm_20_shadow.png",
//	new google.maps.Size(22, 20),
//	new google.maps.Point(0, 0),
//	new google.maps.Point(6, 20)
//	);
//var boxText = document.createElement("div");
//
//
//
//		//var geocoder; 
//		var temp_var;
//		
//		
//
//		
		