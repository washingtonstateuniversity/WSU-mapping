// JavaScript Document
var pos=pos||{};
var base=base||{};
(function($,window) {
	$.wsu_maps.views = {
		inital_options:null,
		set_inital_options:function(map_op){
			if(window._defined(map_op.center)){
				delete(map_op.center);
			}
			if(window._defined(map_op.styles)){
				delete(map_op.styles);
			}
			if(window._defined(map_op.zoom)){
				delete(map_op.zoom);
			}
			$.wsu_maps.views.inital_options = map_op;
		},
		ini_map_view:function (callback){
			var map_op = {
				'center': $.wsu_maps.state.campus_latlng_str,
				'zoom': $.wsu_maps.defaults.map.zoom, 
				'styles': $.wsu_maps.defaults.map.home_styles//needs to be built!!
			};
			//map_op = $.extend(map_op,{"mapTypeControl":false,"panControl":false});
			
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
			$.wsu_maps.state.map_jObj.gmap(map_op).bind('init', function() { 
				$.wsu_maps.state.map_inst = $.wsu_maps.state.map_jObj.gmap('get','map');
				$.wsu_maps.views.set_inital_options(map_op);
				$.wsu_maps.state.inview = true;
				$.wsu_maps.set_center();
				//var map = map_ele_obj.gmap("get","map");
				$.wsu_maps.ini_GAtracking('UA-22127038-5');
				$.wsu_maps.poi_setup();
				if($('.mobile').length){
					$.wsu_maps.geoLocate();
				}

				$(window).resize(function(){
					if( $.wsu_maps.state.fit_to_bound !== false ){
						$.wsu_maps.fit_to_location( $.wsu_maps.state.fit_to_bound );
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
})(jQuery,window);