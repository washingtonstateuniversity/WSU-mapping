// JavaScript Document
var pos=pos||{};
var base=base||{};
(function($) {
	$.wsu_maps.views = {
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
			if( typeof(window.running_options) !== "undefined" ){
				ops=window.running_options;
			}
			
			
			if(ops!==""){
				//var mapType = jsonStr.replace(/.*?(\"mapTypeId\":"(\w+)".*$)/g,"$2");
				ops = ops.replace(/("\w+":\"\",)/g,'').replace(/(\"mapTypeId\":"\w+",)/g,'');
				$.extend(map_op,pos,base,$.parseJSON(ops));
			}
			$.wsu_maps.state.map_jObj.gmap(map_op).bind('init', function() { 
				$.wsu_maps.state.map_inst = $.wsu_maps.state.map_jObj.gmap('get','map');
				$.wsu_maps.set_center();
				//var map = map_ele_obj.gmap("get","map");
				$.wsu_maps.ini_GAtracking('UA-22127038-5');
				$.wsu_maps.poi_setup();
				if($('.mobile').length){
					$.wsu_maps.geoLocate();
				}
				$.wsu_maps.on_zoom_corrections();
				$.wsu_maps.on_pan_corrections();
				$.wsu_maps.on_bounds_changed_corrections();
				$(window).resize(function(){
					$.wsu_maps.fit_to_location('WA');
					$.wsu_maps.keep_center();
				}).trigger("resize");
				callback();
			});
		},
	};
})(jQuery);