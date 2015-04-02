/*
* globals from the page, inline
*/


/* think these should be removed at some point when cleared */
var pos=pos||{};
var base=base||{};
var pageTracker=pageTracker||null;
var styles=styles||{};

var startingUrl=startingUrl||null;



function _defined(n){ return typeof n !== "undefined"; }
function _d(n){
	return _defined(jQuery.wsu_maps) && (jQuery.wsu_maps.defaults.debug===true) && _defined(window.console) && _defined(window.console.debug) && window.console.debug(n);
}
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(obj, start) {
		 for (var i = (start || 0), j = this.length; i < j; i++) {
			 if (this[i] === obj) { return i; }
		 }
		 return -1;
	};
}
/* seed it */
(function($,window) {

	$.wsu_maps={
		is_frontend:true,
		state:{
			map_jObj:null,
			map_inst:null,
			view_id:'centralmap',
			
			running_options:false,
			fit_to_bound:false,
			embeded_place_ids:false,
			json_style_override:false,
			
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
		
			siteroot: "",
			view: "",
			mcv_action: "",
			campus: "",
			campus_latlng_str: "",
			
			in_pano:false,
			hold_bounds:true,
			hold_center:true,
			
			center:null,
			
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
			debug:false,
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
            },
            {
                "weight": 2
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#adadad"
            },
            {
                "weight": 1
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
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ffffff"
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
],//note this is the right one, but we are tmping for the home page
				home_styles:[{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"visibility":"off"},{"saturation":"-39"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#2a3033"}]},{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#981e32"},{"weight":"1.26"}]},{"featureType":"administrative.land_parcel","elementType":"geometry.fill","stylers":[{"visibility":"off"},{"color":"#b06a6a"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"saturation":"-28"},{"color":"#ffffff"}]},{"featureType":"landscape.man_made","elementType":"geometry.stroke","stylers":[{"color": "#cfe2e6"},{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"labels.text.fill","stylers":[{"color":"#981e32"}]},{"featureType":"landscape.man_made","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"labels.icon","stylers":[{"color":"#ff0000"},{"visibility":"off"}]},{"featureType":"landscape.natural.landcover","elementType":"geometry.fill","stylers":[{"visibility":"off"},{"color":"#c33737"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry.fill","stylers":[{"color":"#eeeeee"},{"visibility":"on"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#dddddd"}]},{"featureType":"poi.school","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#b5babe"}]},{"featureType":"poi.school","elementType":"geometry.stroke","stylers":[{"color":"#895959"},{"visibility":"off"}]},{"featureType":"poi.school","elementType":"labels.text.fill","stylers":[{"color":"#2a3033"}]},{"featureType":"poi.school","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#2a3033"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#4e4e4e"}]},{"featureType":"road.highway","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"color":"#2a3033"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"color":"#2a3033"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#d4e4eb"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#e6f0f4"},{"visibility":"on"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#8f8fb1"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]}]
			}
			//DEFAULT_overlay:null,
			//DEFAULT_polylines:[],
		},







		ini:function (options){
			$.extend($.wsu_maps.state,options);
			$.wsu_maps.ready();
		},
		ready:function (options){
			$.wsu_maps.state.currentLocation = $.wsu_maps.state.siteroot+$.wsu_maps.state.mapview;
			$(document).ready(function() {
				var page,location;
				
				$.wsu_maps[$.wsu_maps.is_frontend?"frontend":"admin"].ini();
				
				location=window.location.pathname;
				page=location.substring(location.lastIndexOf("/") + 1);
				page=page.substring(0,page.lastIndexOf("."));
				if(window._defined($.wsu_maps[page])){
					$.wsu_maps[page].ini();
				}
				
				return options;
			});
		},
		
		iniMap:function (url,callback){
			/*var padder = 130;
			if($('.layoutfree').lenght){
				padder = 0;
			}
			var winH = $(window).height()-padder;
			var winW = $(window).width();*/
			var zoom = $.wsu_maps.defaults.map.zoom;
			/*if(winW>=500 && winH>=200){zoom = 14;}
			if(winW>=700 && winH>=400){zoom = 15;}
			if(winW>=900 && winH>=600){zoom = 16;}*/
			//var _load = false;
			//url='http://images.wsu.edu/javascripts/campus_map_configs/pick.asp';			
			//$.getJSON(url+'?callback=?'+(_load!=false?'&loading='+_load:''), function(data) {
				var data = {};
				var map_op = {};
				if( $.isEmptyObject( data.mapOptions )){
					map_op = {'center': $.wsu_maps.state.campus_latlng_str , 'zoom':zoom };
				}else{
					map_op = data.mapOptions;
					/*if(winW>=500 && winH>=300){map_op.zoom = map_op.zoom;}
					if(winW>=700 && winH>=500){map_op.zoom = map_op.zoom+1;}
					if(winW>=900 && winH>=700){map_op.zoom = map_op.zoom;}*/
				}
				//styles={};
				var override = window._defined($.wsu_maps.defaults.json_style_override) && $.wsu_maps.defaults.json_style_override!==false && $.wsu_maps.defaults.json_style_override!=="";
				map_op = $.extend(map_op,{
					"mapTypeControl":false,
					"panControl":false,
					styles: override ? $.wsu_maps.defaults.json_style_override:$.wsu_maps.defaults.map.styles
				});
				if($('.layoutfree').length){
					styles={
						zoom:17
					};
				}
				
				map_op=$.extend(map_op,styles);
				
				
				var ops = "";
				
				if($('#runningOptions').length && !($('#runningOptions').html()==="{}"||$('#runningOptions').html()==="") ){
					$('#runningOptions').html($('#runningOptions').html().replace(/(\"mapTypeId\":"\w+",)/g,''));
					ops = $('#runningOptions').html();
				}
				if( $.wsu_maps.state.running_options !== false ){
					ops=$.wsu_maps.state.running_options;
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
					$.wsu_maps.state.center = $.wsu_maps.state.map_jObj.gmap("get_map_center");
					//$.wsu_maps.ini_GAtracking('UA-22127038-5');
					$.wsu_maps.poi_setup();
					$.wsu_maps.controlls.setup_map_type_controlls();
					if(window._defined(data)){
						$.wsu_maps.general.loadData(data);
					}
					if($('.mobile').length){
						$.wsu_maps.geoLocate();
					}
					callback();
					

					$(window).resize(function(){
						if( $.wsu_maps.state.fit_to_bound !== false ){
							$.wsu_maps.fit_to_location( $.wsu_maps.state.fit_to_bound );
						}
						$.wsu_maps.keep_center();
					}).trigger("resize");
					
					$.wsu_maps.on_zoom_corrections();
					$.wsu_maps.on_pan_corrections();
					$.wsu_maps.on_bounds_changed_corrections();
					
					$('.gmnoprint[controlheight]:first').css({'margin-left':'21px'});
					/* addthis setup */
					//$.wsu_maps.ini_addthis("mcwsu");
				});
			//});
		},

		setup:function (){//jObj){
			$('#loading').remove();
			if(window._defined(startingUrl) && startingUrl!==null){
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
			$.wsu_maps.errors.addErrorReporting();
			
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
			if( $('.veiw_base_layout.public').length || $.wsu_maps.state.inview ){	
				$.wsu_maps.shapes.reloadShapes();
				$.wsu_maps.places.reloadPlaces();
			}
		},
		get_option:function(){//prop){
			//the goal is that we will pull any option not directly 
			
		},
		clean_map:function(){
			var jObj = $.wsu_maps.state.map_jObj;
			jObj.gmap('clear','markers');
			jObj.gmap('clear','overlays');
			$.each($.wsu_maps.state.ib,function(i){
				if( window._defined( $.wsu_maps.state.ib[i] ) && $.wsu_maps.state.ib[i].opened === true ){
					$.wsu_maps.state.ib[i].close();
				}
				$.wsu_maps.state.ib[i].onRemove();
			});
			$.wsu_maps.state.ib=[];
			$.wsu_maps.state.ibh=[];
			$.wsu_maps.listings.reset_listings();
			$.wsu_maps.listings.reset_Dirscrollbar();
			$.wsu_maps.listings.reset_Listscrollbar();
			$.wsu_maps.nav.reset_Navscrollbar();
			

			$('#main_nav').find('.active').removeClass('active');
			$.wsu_maps.state.map_jObj.find('input[type="text"]').val('');
			if($('#directionsTo').is(':visible')){
				$('#directionsTo').hide();
			}
			
			//$.wsu_maps.listings.reset_listings();
		},
		updateMap:function (_load,showSum,callback){
			//var jObj = $.wsu_maps.state.map_jObj;
			if(!window._defined(_load)){
				_load = false;
			}
			if(!window._defined(showSum)){
				showSum = false;
			}
			if(!window._defined(callback)){
				callback = false;
			}
			$.wsu_maps.state.cur_mid = 0;
			$.wsu_maps.state.cur_nav = _load;
			var url="";
			if($.isNumeric(_load)){
				url=$.wsu_maps.state.siteroot+"public/get_place_obj.castle";
			}else{
				url=$.wsu_maps.state.siteroot+"public/get_place_obj_by_category.castle";	
			}
			$.getJSON(url+'?callback=?'+(_load!==false && !$.isNumeric(_load)?'&cat[]='+_load:($.isNumeric(_load)?'&id='+_load:'')), function(data) {
				if(!$.isNumeric(_load)){
					$.wsu_maps.listings.autoOpenListPanel();
				}
				var cleanedData = [];
				cleanedData.markers = [];
				if(window._defined(data.markers) &&  !$.isEmptyObject( data.markers )){
					$.each( data.markers, function(i, marker) {
						if($.isNumeric(_load)){
							marker.bounds=true;
						}
						if(!window._defined(marker.id)){
							delete data.markers[i];
						}else if(window._defined(marker.error)){
							delete data.markers[i]; 
						}else{
							cleanedData.markers.push(data.markers[i]);		
						}
					});
					if(window._defined(cleanedData)){
						$.wsu_maps.general.loadData(cleanedData,callback);
					}
					$.wsu_maps.listings.loadListings(cleanedData,showSum);
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
									'<div><h3><a href="https://map.wsu.edu/pdfs/areamap-10-18-12.pdf" target="_blank">Area<br/><span id="area" style="background-image:url('+$.wsu_maps.state.siteroot+'Content/images/print/area_icon-10-18-12.jpg);"></span></a></h3></div>'+
									'<div class="last"><h3><a href="https://map.wsu.edu/pdfs/washingtonmap.pdf" target="_blank">Washington State<br/><span id="state" style="background-image:url('+$.wsu_maps.state.siteroot+'Content/images/print/state_icon.jpg);"></span></a></h3></div>'+
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
			/*if(!window._defined(username)){
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
			if($.wsu_maps.state.hold_bounds===false || $.wsu_maps.state.in_pano){
				return;
			}
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode( { 'address': localation}, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					if (status !== google.maps.GeocoderStatus.ZERO_RESULTS) {
						if (results && results[0]&& results[0].geometry && results[0].geometry.viewport){
							$.wsu_maps.state.map_inst.fitBounds(results[0].geometry.viewport);
							window.tmp_fuc = function(){
								google.maps.event.addListenerOnce($.wsu_maps.state.map_inst, 'idle', function() {
									$.wsu_maps.state.hold_bounds=true;
									window.tmp_fuc = null;
								});
							};
							window.tmp_fuc();
						}
					}
				}
			});
		},
		
		keep_center:function(){
			if( ( $.wsu_maps.state.hold_center !== false && $.wsu_maps.state.center !== null ) || $.wsu_maps.state.in_pano ){
				$.wsu_maps.state.map_inst.panTo($.wsu_maps.state.center);
			}
		},
		
		
		poi_setup:function (){//jObj){
			var proto = google.maps.InfoWindow.prototype, open = proto.open;
			proto.open = function(map, anchor, please) {
				if (please) {
					return open.apply(this, arguments);
				}
			};
		},
		set_center:function(){
			$.wsu_maps.state.map_jObj.dequeue("set_center");
			$.wsu_maps.state.map_jObj.queue("set_center", function() {
				setTimeout(function() {
					$.wsu_maps.state.center = $.wsu_maps.state.map_jObj.gmap("get_map_center");
					$.wsu_maps.state.map_jObj.dequeue("set_center");
				}, 750);
			});
		},
		
		poi_rest:function(){
			$.wsu_maps.state.map_jObj.dequeue("poi_rest");
			$.wsu_maps.state.map_jObj.queue("poi_rest", function() {
				setTimeout(function() {
					$.wsu_maps.poi_setup();	
					$.wsu_maps.state.map_jObj.dequeue("poi_rest");
				}, 750);
			});
		},
		on_zoom_corrections:function(){
			google.maps.event.addListener($.wsu_maps.state.map_inst, 'zoom_changed',function(){
				$.wsu_maps.poi_rest();
				$.wsu_maps.set_center();
			});
		},
		on_pan_corrections:function(){
			google.maps.event.addListener($.wsu_maps.state.map_inst, 'drag', function() {
				$.wsu_maps.state.hold_bounds=false;
				$.wsu_maps.set_center();
				$.wsu_maps.poi_rest();
				
			});
			google.maps.event.addListener($.wsu_maps.state.map_inst, 'center_changed', function() {
				$.wsu_maps.poi_rest();
			});
		},
		on_bounds_changed_corrections:function(){
			google.maps.event.addListener($.wsu_maps.state.map_inst, 'bounds_changed',function(){
				$.wsu_maps.poi_rest();
				$.wsu_maps.set_center();
			});
		},

		getSmUrl:function (query,callback){
			
			var url = $.wsu_maps.getUrlPath(query);
			
			$.get('/public/get_sm_url.castle?_url=/'+encodeURIComponent(url),function(data){
				if(data!=="false"){
					//alert(data)
					url = "t/"+data;
				}
				if(window._defined(callback)){
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
			url+=(window._defined(query)?(url.indexOf('?')>-1?'&':'?')+query:'');
		
			return url;
		},
		/*updateUrl:function (nav,pid){
			$.wsu_maps.state.cur_nav = nav;
			$.wsu_maps.state.cur_mid = pid;
		}*/
		time_it:function(name,time,func){
			$.wsu_maps.state.map_jObj.dequeue(name);
			$.wsu_maps.state.map_jObj.queue(name, function() {
				setTimeout(function() {
					func();
					$.wsu_maps.state.map_jObj.dequeue(name);
				}, time);
			});
		},
		kill_time:function(name){
			$.wsu_maps.state.map_jObj.dequeue(name);
		},
	};
})(jQuery,window,_d);