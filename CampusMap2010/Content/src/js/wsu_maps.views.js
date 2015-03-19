// JavaScript Document
var pos=pos||{};
var base=base||{};
(function($) {
	$.wsu_maps.views = {
		inital_options:null,
		inview:false,
		set_inital_options:function(map_op){
			if(typeof(map_op.center)!=="undefined"){
				delete(map_op.center);
			}
			if(typeof(map_op.styles)!=="undefined"){
				delete(map_op.styles);
			}
			$.wsu_maps.views.inital_options = map_op;
		},
		ini_map_view:function (callback){
			var map_op = {
				'center': $.wsu_maps.state.campus_latlng_str,
				'zoom': $.wsu_maps.defaults.map.zoom, 
				'styles': $.wsu_maps.defaults.map.styles
			};
			//map_op = $.extend(map_op,{"mapTypeControl":false,"panControl":false});
			
			var ops = "";
			
			if($('#runningOptions').length && !($('#runningOptions').html()==="{}"||$('#runningOptions').html()==="") ){
				$('#runningOptions').html($('#runningOptions').html().replace(/(\"mapTypeId\":"\w+",)/g,''));
				ops = $('#runningOptions').html();
			}
			if( typeof(window.map_view) !== "undefined" && typeof(window.map_view.running_options) !== "undefined" ){
				ops=window.map_view.running_options;
			}
			
			
			if(ops!==""){
				//var mapType = jsonStr.replace(/.*?(\"mapTypeId\":"(\w+)".*$)/g,"$2");
				ops = ops.replace(/("\w+":\"\",)/g,'').replace(/(\"mapTypeId\":"\w+",)/g,'');
				$.extend(map_op,pos,base,$.parseJSON(ops));
			}
			$.wsu_maps.state.map_jObj.gmap(map_op).bind('init', function() { 
				$.wsu_maps.state.map_inst = $.wsu_maps.state.map_jObj.gmap('get','map');
				$.wsu_maps.views.set_inital_options(map_op);
				$.wsu_maps.views.inview = true;
				$.wsu_maps.set_center();
				//var map = map_ele_obj.gmap("get","map");
				$.wsu_maps.ini_GAtracking('UA-22127038-5');
				$.wsu_maps.poi_setup();
				if($('.mobile').length){
					$.wsu_maps.geoLocate();
				}

				$(window).resize(function(){
					if(  typeof(window.map_view) !== "undefined" && typeof(window.map_view.fit_to_bound) !== "undefined" && window.map_view.fit_to_bound !==""  ){
						$.wsu_maps.fit_to_location(window.map_view.fit_to_bound);
					}
					$.wsu_maps.keep_center();
				}).trigger("resize");
				$.wsu_maps.on_zoom_corrections();
				$.wsu_maps.on_pan_corrections();
				$.wsu_maps.on_bounds_changed_corrections();
				callback();
			});
		},
	};
})(jQuery);