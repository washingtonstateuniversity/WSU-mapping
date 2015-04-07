// JavaScript Document
(function($,window,WSU_MAP) {
	$.extend( WSU_MAP, {
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
			loading_html:'<img src="'+WSU_MAP.state.siteroot+'Content/images/loading_icon.svg" />', //note: and id will be applied
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
	});
})(jQuery,window,jQuery.wsu_maps||(jQuery.wsu_maps={}));