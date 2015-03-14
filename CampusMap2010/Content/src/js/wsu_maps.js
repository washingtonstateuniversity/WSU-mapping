/*
* globals from the page, inline
*/
var siteroot=siteroot||"";
var view=view||"";
var mcv_action=mcv_action||"";
var campus=campus||"";
var campus_latlng_str=campus_latlng_str||"";

/* think these should be removed at some point when cleared */
var pos=pos||{};
var base=base||{};
var pageTracker=pageTracker||null;
var styles=styles||{};

var startingUrl=startingUrl||null;

/* seed it */
(function($) {
	$.wsu_maps={
		is_frontend:true,
		state:{
			map_jObj:null,
			map_inst:null,
			
			active:{
				marker:null,
				iw:null,
			},
			
			ib:[],
			ibh:[],
			ibHover:false,
			ibOpen:false,
			reopen:false,
				
			markerLog:[],
			markerbyid:[],
			mid:[],
			shapes:[],
			listOffset:0,
			
			currentControl:"ROADMAP",
		
			siteroot:siteroot||"",
			view:view||"",
			mcv_action:mcv_action||"",
			campus:campus||"",
			campus_latlng_str:campus_latlng_str||"",
			
			in_pano:false,
			
			cTo:"",
			cFrom:"",
			hasDirection:false,
			mapview:"central",
			
			cur_nav:"",
			cur_mid:0,
			hasListing:false,
			hasDirections:false,
		
			
			api:[],
			apiL:null,
			apiD:null,
			api_nav:null,
		
			//sensor:false,
			//lang:'',
			//vbtimer:null,
		
		},	
		defaults:{
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
			
			listings:{
				width:235
			},
			map:{
				zoom:15,
				styles:[
					{
						"featureType": "administrative",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#2a3033"
							}
						]
					},
					{
						"featureType": "administrative.province",
						"elementType": "geometry.stroke",
						"stylers": [
							{
								"visibility": "on"
							},
							{
								"color": "#981e32"
							},
							{
								"weight": "1.26"
							}
						]
					},
					{
						"featureType": "administrative.land_parcel",
						"elementType": "geometry.fill",
						"stylers": [
							{
								"visibility": "off"
							},
							{
								"color": "#b06a6a"
							}
						]
					},
					{
						"featureType": "landscape",
						"elementType": "all",
						"stylers": [
							{
								"color": "#f2f2f2"
							}
						]
					},
					{
						"featureType": "landscape",
						"elementType": "geometry.fill",
						"stylers": [
							{
								"color": "#ffffff"
							}
						]
					},
					{
						"featureType": "landscape.man_made",
						"elementType": "geometry.fill",
						"stylers": [
							{
								"visibility": "on"
							},
							{
								"saturation": "-28"
							},
							{
								"color": "#ffffff"
							}
						]
					},
					{
						"featureType": "landscape.man_made",
						"elementType": "geometry.stroke",
						"stylers": [
							{
								"color": "#ff0000"
							},
							{
								"visibility": "off"
							}
						]
					},
					{
						"featureType": "landscape.man_made",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#981e32"
							}
						]
					},
					{
						"featureType": "landscape.man_made",
						"elementType": "labels.text.stroke",
						"stylers": [
							{
								"visibility": "off"
							}
						]
					},
					{
						"featureType": "landscape.man_made",
						"elementType": "labels.icon",
						"stylers": [
							{
								"color": "#ff0000"
							},
							{
								"visibility": "off"
							}
						]
					},
					{
						"featureType": "landscape.natural.landcover",
						"elementType": "geometry.fill",
						"stylers": [
							{
								"visibility": "off"
							},
							{
								"color": "#c33737"
							}
						]
					},
					{
						"featureType": "landscape.natural.terrain",
						"elementType": "geometry.fill",
						"stylers": [
							{
								"color": "#eeeeee"
							},
							{
								"visibility": "on"
							}
						]
					},
					{
						"featureType": "poi.school",
						"elementType": "geometry.fill",
						"stylers": [
							{
								"visibility": "on"
							},
							{
								"color": "#b5babe"
							}
						]
					},
					{
						"featureType": "poi.school",
						"elementType": "geometry.stroke",
						"stylers": [
							{
								"color": "#895959"
							},
							{
								"visibility": "off"
							}
						]
					},
					{
						"featureType": "poi.school",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#2a3033"
							}
						]
					},
					{
						"featureType": "poi.school",
						"elementType": "labels.text.stroke",
						"stylers": [
							{
								"visibility": "off"
							}
						]
					},
					{
						"featureType": "road",
						"elementType": "all",
						"stylers": [
							{
								"saturation": -100
							},
							{
								"lightness": 45
							}
						]
					},
					{
						"featureType": "road",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#2a3033"
							}
						]
					},
					{
						"featureType": "road",
						"elementType": "labels.text.stroke",
						"stylers": [
							{
								"visibility": "off"
							}
						]
					},
					{
						"featureType": "road.highway",
						"elementType": "all",
						"stylers": [
							{
								"visibility": "simplified"
							}
						]
					},
					{
						"featureType": "road.highway",
						"elementType": "geometry.fill",
						"stylers": [
							{
								"color": "#4e4e4e"
							}
						]
					},
					{
						"featureType": "road.highway",
						"elementType": "labels.text.stroke",
						"stylers": [
							{
								"visibility": "off"
							}
						]
					},
					{
						"featureType": "road.arterial",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"visibility": "on"
							},
							{
								"color": "#2a3033"
							}
						]
					},
					{
						"featureType": "road.arterial",
						"elementType": "labels.icon",
						"stylers": [
							{
								"visibility": "off"
							}
						]
					},
					{
						"featureType": "road.local",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"visibility": "on"
							},
							{
								"color": "#2a3033"
							}
						]
					},
					{
						"featureType": "transit",
						"elementType": "all",
						"stylers": [
							{
								"visibility": "off"
							}
						]
					},
					{
						"featureType": "water",
						"elementType": "all",
						"stylers": [
							{
								"color": "#d4e4eb"
							},
							{
								"visibility": "on"
							}
						]
					},
					{
						"featureType": "water",
						"elementType": "geometry.fill",
						"stylers": [
							{
								"color": "#e6f0f4"
							},
							{
								"visibility": "on"
							}
						]
					},
					{
						"featureType": "water",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#8f8fb1"
							}
						]
					},
					{
						"featureType": "water",
						"elementType": "labels.text.stroke",
						"stylers": [
							{
								"visibility": "off"
							}
						]
					}
				]
			}
			//DEFAULT_overlay:null,
			//DEFAULT_polylines:[],
		},

		ini:function (options){
			$.wsu_maps.ready(options||{});
		},
		ready:function (options){
			$.wsu_maps.state.currentLocation=$.wsu_maps.state.siteroot+$.wsu_maps.state.mapview;
			$(document).ready(function() {
				var page,location;
				
				$.wsu_maps[$.wsu_maps.is_frontend?"frontend":"admin"].ini();
				
				location=window.location.pathname;
				page=location.substring(location.lastIndexOf("/") + 1);
				page=page.substring(0,page.lastIndexOf("."));
				if(typeof($.wsu_maps[page])!=="undefined"){
					$.wsu_maps[page].ini();
				}
				
				return options;
			});
		},
		
		iniMap:function (url,callback){
			var padder = 130;
			if($('.layoutfree').lenght){
				padder = 0;
			}
			var winH = $(window).height()-padder;
			var winW = $(window).width();
			var zoom = 15;
			if(winW>=500 && winH>=200){zoom = 14;}
			if(winW>=700 && winH>=400){zoom = 15;}
			if(winW>=900 && winH>=600){zoom = 16;}
			//var _load = false;
			//url='http://images.wsu.edu/javascripts/campus_map_configs/pick.asp';			
			//$.getJSON(url+'?callback=?'+(_load!=false?'&loading='+_load:''), function(data) {
				var data = {};
				var map_op = {};
				if( $.isEmptyObject( data.mapOptions )){
					map_op = {'center': $.wsu_maps.state.campus_latlng_str , 'zoom':zoom };
				}else{
					map_op = data.mapOptions;
					if(winW>=500 && winH>=300){map_op.zoom = map_op.zoom;}
					if(winW>=700 && winH>=500){map_op.zoom = map_op.zoom+1;}
					if(winW>=900 && winH>=700){map_op.zoom = map_op.zoom;}
				}
				//styles={};
				map_op = $.extend(map_op,{
					"mapTypeControl":false,
					"panControl":false,
					styles:$.wsu_maps.defaults.map.styles
				});
				if($('.layoutfree').length){
					styles={
						zoom:17
					};
				}
				/*,
				styles:[{
				featureType:"poi",
				elementType:"labels",
				stylers:[{
					visibility:"off"
				}]
				}]*/					
				map_op=$.extend(map_op,styles);
				
				
				var ops = "";
				
				if($('#runningOptions').length && !($('#runningOptions').html()==="{}"||$('#runningOptions').html()==="") ){
					$('#runningOptions').html($('#runningOptions').html().replace(/(\"mapTypeId\":"\w+",)/g,''));
					ops = $('#runningOptions').html();
				}
				if( typeof(window.running_options) !== "undefined" ){
					ops=window.running_options;
				}
				
				
				if(ops!==""){
					//var mapType = jsonStr.replace(/.*?(\"mapTypeId\":"(\w+)".*$)/g,"$2");
					ops = ops.replace(/("\w+":\"\",)/g,'').replace(/(\"mapTypeId\":"\w+",)/g,'');
					$.extend(map_op,pos,base,$.parseJSON(ops));
				}
				
				
				/*if($('#runningOptions').length){
					if($('#runningOptions').html()==="{}"||$('#runningOptions').html()===""){
				
					}else{
						//map_op= {}
						$('#runningOptions').html($('#runningOptions').html().replace(/(\"mapTypeId\":"\w+",)/g,''));
						var jsonStr = $('#runningOptions').html();
						//var mapType = jsonStr.replace(/.*?(\"mapTypeId\":"(\w+)".*$)/g,"$2");
						jsonStr = jsonStr.replace(/("\w+":\"\",)/g,'').replace(/(\"mapTypeId\":"\w+",)/g,'');
						//$.extend(map_op,base,$.parseJSON(jsonStr));
						//map_op = $.parseJSON(jsonStr);
						//$(this).val().replace(/[^a-zA-Z0-9-_]/g, '-'); 
						//alert(dump(map_op));
					}
				}*/
				$.wsu_maps.state.map_jObj.gmap(map_op).bind('init', function() { 
					$.wsu_maps.state.map_inst = $.wsu_maps.state.map_jObj.gmap('get','map');
					$.wsu_maps.ini_GAtracking('UA-22127038-5');
					$.wsu_maps.poi_setup();
					$.wsu_maps.controlls.setup_map_type_controlls();
					if(typeof(data)!=='undefined'){
						$.wsu_maps.general.loadData(data);
					}
					if($('.mobile').length){
						$.wsu_maps.geoLocate();
					}
					callback();
					$(window).trigger('resize');
					$.wsu_maps.on_zoom_corrections();
					$('.gmnoprint[controlheight]:first').css({'margin-left':'21px'});
					/* addthis setup */
					//$.wsu_maps.ini_addthis("mcwsu");
				});
			//});
		},

		setup:function (){//jObj){
			$('#loading').remove();
			if(typeof(startingUrl)!=="undefined" && startingUrl!==null){
				$.wsu_maps.updateMap(encodeURI(startingUrl.indexOf("&")?startingUrl.split('=')[1].split('&')[0]:startingUrl.split('=')[1]),false,function(){
						if(parseInt(startingUrl.split('=')[1], 10)>0){
							var marker = $.wsu_maps.state.markerbyid[parseInt(startingUrl.split('=')[1], 10)];
							
							//google.maps.event.trigger(marker, 'click');
							$(marker).triggerEvent('click');
						}
					});
				var link = startingUrl.split('=')[1].split('&')[0].toString(); 
				//alert(link);
				if(startingUrl.split('=')[1].indexOf(',')>0){
					$.each(startingUrl.split('=')[1].split(','),function(i,v){
						$.wsu_maps.nav.menuDressChild($('#main_nav a[href$="'+v+'"]'));
					});
				}else{
					$.wsu_maps.nav.menuDressChild($('#main_nav a[href$="'+link+'"]'));
				}		
			}
		
		
			$.wsu_maps.listings.setup_listingsBar($.wsu_maps.state.map_jObj);
			$.wsu_maps.directions.setup_directions();
			$.wsu_maps.nav.setup_nav();
			$.wsu_maps.general.setup_embeder();
			$.wsu_maps.general.addErrorReporting();
			
			$.wsu_maps.setup_pdfprints();
			if($('.layoutfree').length){
				$('a').not('#nav a').on("click",function(e){
					e.stopPropagation();
					e.preventDefault();	
				});
				$('.ui-tabs-panel .content a').on("click",function(e){
					e.stopPropagation();
					e.preventDefault();	
				});
			}
			if($( "#placeSearch input[type=text]" ).length){
				$.wsu_maps.search.setup_mapsearch();
			}
			if($('.veiw_base_layout.public').length|| ( typeof(window.map_view) !== "undefined" && window.map_view === true)){	
				$.wsu_maps.shapes.reloadShapes();
				$.wsu_maps.places.reloadPlaces();
			}
		},

		updateMap:function (_load,showSum,callback){
			//var jObj = $.wsu_maps.state.map_jObj;
			if(typeof(_load)==='undefined'){
				_load = false;
			}
			if(typeof(showSum)==='undefined'){
				showSum = false;
			}
			if(typeof(callback)==='undefined'){
				callback = false;
			}
			$.wsu_maps.state.cur_mid = 0;
			$.wsu_maps.state.cur_nav = _load;
			var url="";
			if($.isNumeric(_load)){
				url=$.wsu_maps.state.siteroot+"public/get_place.castle";
			}else{
				url=$.wsu_maps.state.siteroot+"public/get_place_by_category.castle";	
			}
			$.getJSON(url+'?callback=?'+(_load!==false && !$.isNumeric(_load)?'&cat[]='+_load:($.isNumeric(_load)?'&id='+_load:'')), function(data) {
				if(!$.isNumeric(_load)){
					$.wsu_maps.general.autoOpenListPanel();
				}
				var cleanedData = [];
				cleanedData.markers = [];
				if(typeof(data.markers)!=='undefined' &&  !$.isEmptyObject( data.markers )){
					$.each( data.markers, function(i, marker) {
						if($.isNumeric(_load)){
							marker.bounds=true;
						}
						if(typeof(marker.id)==='undefined'){
							delete data.markers[i];
						}else if(typeof(marker.error)!=='undefined'){
							delete data.markers[i]; 
						}else{
							cleanedData.markers.push(data.markers[i]);		
						}
					});
					if(typeof(cleanedData)!=='undefined'){
						$.wsu_maps.general.loadData(cleanedData,callback);
					}
					$.wsu_maps.general.loadListings(cleanedData,showSum);
				}
				$.wsu_maps.general.prep_html();
			});
		},

		setup_pdfprints:function (){
			$('#printPdfs').off().on("click",function(e){
				e.stopPropagation();
				e.preventDefault();
				//var trigger=$(this);
				$.colorbox.remove();
				$.colorbox({
					html:function(){
						return '<div id="printPdfs">'+
									'<h2>Printable Maps</h2>'+
									'<div><h3><a href="http://www.parking.wsu.edu/docs/map.pdf" target="_blank">Parking<br/><span id="parking" style="background-image:url('+$.wsu_maps.state.siteroot+'Content/images/print/parking_icon.jpg);"></span></a></h3></div>'+
									'<div><h3><a href="http://map.wsu.edu/pdfs/areamap-10-18-12.pdf" target="_blank">Area<br/><span id="area" style="background-image:url('+$.wsu_maps.state.siteroot+'Content/images/print/area_icon-10-18-12.jpg);"></span></a></h3></div>'+
									'<div class="last"><h3><a href="http://map.wsu.edu/pdfs/washingtonmap.pdf" target="_blank">Washington State<br/><span id="state" style="background-image:url('+$.wsu_maps.state.siteroot+'Content/images/print/state_icon.jpg);"></span></a></h3></div>'+
								'</div>';
					},
					scrolling:false,
					opacity:0.7,
					transition:"none",
					width:710,
					height:350,
					open:true,
					onComplete:function(){
						if($('#colorbox #cb_nav').length){
							$('#colorbox #cb_nav').html("");
						}
						$.each($('#printPdfs a'),function(){
							var self = $(this); 
							self.off().on('click',function(){//e){
								//$.jtrack.trackEvent(pageTracker,"pdf", "clicked", self.text());
							});
						});
					}
				});
			});	
		},

		ini_GAtracking:function (){//gacode){
			/*var data = [
				{
					"element":"a[href^='http']:not([href*='wsu.edu'])",
					"options":{
						"mode":"event,_link",
						"category":"outbound"
						}
				},{
					"element":"a[href*='wsu.edu']:not([href^='/'],[href*='**SELF_DOMAIN**'])",
					"options":{
						"skip_internal":"true",
						"category":"internal",
						"overwrites":"true"
						}
				},{
					"element":"a[href*='.rss']",
					"options":{
						"category":"Feed",
						"action":"RSS",
						"overwrites":"true"
						}
				},{
					"element":"a[href*='mailto:']",
					"options":{
						"category":"email",
						"overwrites":"true"
						}
				}
			];*/
			//$.jtrack.defaults.debug.run = false;
			//$.jtrack.defaults.debug.v_console = false;
			//$.jtrack.defaults.debug.console = true;
			//$.jtrack({load_analytics:{account:gacode}, trackevents:data });
		},
		ini_addthis:function (){//username){
			/*if(typeof(username)==="undefined"){
				username="mcwsu";
			}*/
			/*var addthis_config = {
				  services_compact: 'email, facebook, twitter, myspace, google, more',
				  services_exclude: 'print',
				  ui_click: true
			};*/
			/*var addthis_share ={
				templates: {twitter: 'check out {{url}} '}
			};*/
			/*if($('body.addthis').length===0){
				$.wsu_maps.getSmUrl("",function(url){
					$('#addthisScript').attr('src', "http://s7.addthis.com/js/250/addthis_widget.js#async=1&username="+username+"&" + Math.random() );
					$.getScript( "http://s7.addthis.com/js/250/addthis_widget.js#async=1&username="+username+"&" + Math.random());
					addthis.init(); 
					
					addthis.ost = 0;
					addthis.update('share', 'url', url);
					addthis.ready();
					$('body').addClass('addthis');
				});
			}
			addthis.addEventListener('addthis.menu.open', function(){
				$.wsu_maps.getSmUrl("",function(url){
					addthis.ost = 0; 
					addthis.update('share', 'url', url); // new url 
					//addthis.update('share', 'title', window.document.title); // new title. 
					addthis.ready();
				});
			});*/
		},
		
		geoLocate:function (){
			if($('.geolocation').length){
				$.wsu_maps.state.map_jObj.gmap("geolocate",true,false,function(mess, pos){
					//$.wsu_maps.state.map_jObj.gmap("make_latlng_str",pos)//alert('hello');
					$.wsu_maps.state.map_jObj.gmap('addMarker', { 
							position: pos,
							icon:$.wsu_maps.state.siteroot+"Content/images/map_icons/geolocation_icon.png"
						},function(){//ops,marker){
						//markerLog[i]=marker;
						//$.wsu_maps.state.map_jObj.gmap('setOptions', {'zIndex':1}, markerLog[i]);
						//if($.isFunction(callback))callback(marker);
					});
				});
			}
		},
		fit_to_location:function(localation){
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode( { 'address': localation}, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					if (status !== google.maps.GeocoderStatus.ZERO_RESULTS) {
						if (results && results[0]&& results[0].geometry && results[0].geometry.viewport){
							$.wsu_maps.state.map_inst.fitBounds(results[0].geometry.viewport);
						}
					}
				}
			});
		},
		poi_setup:function (){//jObj){
			var proto = google.maps.InfoWindow.prototype,
				open = proto.open;
			proto.open = function(map, anchor, please) {
				if (please) {
					return open.apply(this, arguments);
				}
			};
		},
		on_zoom_corrections:function(){
			google.maps.event.addListener($.wsu_maps.state.map_inst, 'zoom_changed',function(){
				//var zoomLevel = $.wsu_maps.state.map_inst.getZoom();
				//$('#zoom').val( zoomLevel );//var zoom = 	
				$.wsu_maps.state.timed_event = null;
				window.clearTimeout($.wsu_maps.state.timed_event);
				$.wsu_maps.state.timed_event = window.setTimeout(function() {
				//map.panTo(marker.getPosition());
					$.wsu_maps.poi_setup();	 // point is to null out any new POI that may come up
				}, 750);
			});
		},
		on_pan_corrections:function(){
			$.wsu_maps.state.timed_event = $.wsu_maps.state.timed_event ||  null;
			google.maps.event.addListener($.wsu_maps.state.map_inst, 'center_changed', function() {
				// 3 seconds after the center of the map has changed, pan back to the
				// marker.
				$.wsu_maps.state.timed_event = null;
				window.clearTimeout($.wsu_maps.state.timed_event);
				$.wsu_maps.state.timed_event = window.setTimeout(function() {
				//map.panTo(marker.getPosition());
					$.wsu_maps.poi_setup();	 // point is to null out any new POI that may come up
				}, 750);
			});
		},

		getSmUrl:function (query,callback){
			
			var url = $.wsu_maps.getUrlPath(query);
			
			$.get('/public/get_sm_url.castle?_url=/'+encodeURIComponent(url),function(data){
				if(data!=="false"){
					//alert(data)
					url = "t/"+data;
				}
				if(typeof(callback)!=="undefined"){
					callback($.wsu_maps.state.siteroot+url);
				}
				return $.wsu_maps.state.siteroot+url;
			});
			
		},
		getUrl:function (query){//maybe deleting
			return $.wsu_maps.state.siteroot+$.wsu_maps.getUrlPath(query);
		},
		getUrlPath:function (query){
			var url = $.wsu_maps.state.mapview;
			
			url+=($.wsu_maps.state.cur_nav!==false?'?cat[]='+$.wsu_maps.state.cur_nav:'');
			url+=($.wsu_maps.state.cur_mid>0?(url.indexOf('?')>-1?'&':'?')+'pid='+$.wsu_maps.state.cur_mid:'');
			url+=(typeof(query)!=="undefined"?(url.indexOf('?')>-1?'&':'?')+query:'');
		
			return url;
		},

		/*updateUrl:function (nav,pid){
			$.wsu_maps.state.cur_nav = nav;
			$.wsu_maps.state.cur_mid = pid;
		}*/
		
	};
	$.wsu_maps.ini();
})(jQuery);