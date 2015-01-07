// JavaScript Document
/*
* globals from the page, inline
*/
var siteroot=siteroot||"";
var view=view||"";
var mcv_action=mcv_action||"";
var campus=campus||"";
var campus_latlng_str=campus_latlng_str||"";

/* seed it */
(function($) {
	$.wsu_maps={
		is_frontend:true,
		state:{
			mapInst:null,
			
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
				
			cTo:"",
			cFrom:"",
			hasDirection:false,
			mapview:"central",
			
			cur_nav:"",
			cur_mid:0,
			hasListing:false,
			hasDirections:false,
		
			
			api:null,
			apiL:null,
			apiD:null,
			api_nav:null,
		
			//sensor:false,
			//lang:'',
			//vbtimer:null,
		
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
		resizeBg:function(obj,height,width) {
			obj.height($(window).height()-height);
			if(typeof(width)!=="undefined"&&width>0){
				obj.width($(window).width()-width);
			}
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
			url='http://images.wsu.edu/javascripts/campus_map_configs/pick.asp';			
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
				styles={};
				map_op = $.extend(map_op,{"mapTypeControl":false,"panControl":false});
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
				if($('#runningOptions').length){
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
				}
				$('#centralMap').gmap(map_op).bind('init', function() { 
					$.wsu_maps.ini_GAtracking('UA-22127038-5');
					$.wsu_maps.poi_setup($('#centralMap'));
					addCentralControlls();
					if(typeof(data)!=='undefined'){
						$.wsu_maps.general.loadData($('#centralMap'),data);
					}
					if($('.mobile').length){
						$.wsu_maps.geoLocate();
					}
					callback();
					$(window).trigger('resize');
					$('.gmnoprint[controlheight]:first').css({'margin-left':'21px'});
					/* addthis setup */
					$.wsu_maps.ini_addthis("mcwsu");
				});
			//});
		},
		updateMap:function (jObj,_load,showSum,callback){
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
					$.wsu_maps.general.loadData(jObj,cleanedData,callback);
				}
				$.wsu_maps.general.loadListings(cleanedData,showSum);
			}
			$.wsu_maps.general.prep_html();
		});
	},
	};
	$.wsu_maps.ini();
})(jQuery);