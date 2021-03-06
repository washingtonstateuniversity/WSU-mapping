// JavaScript Document
var pos=pos||{};
var base=base||{};
(function($,window,WSU_MAP) {
	WSU_MAP.views = {
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
			WSU_MAP.views.inital_options = map_op;
		},
		ini_map_view: function () {//callback){
            window._d("starting map view");
			WSU_MAP.state.inview = true;
			var override = window._defined(WSU_MAP.state.json_style_override) && WSU_MAP.state.json_style_override!==false && WSU_MAP.state.json_style_override!=="";
			var map_op = {
				'center': WSU_MAP.state.campus_latlng_str,
				'zoom': WSU_MAP.defaults.map.zoom, 
				'styles': override ? WSU_MAP.state.json_style_override : WSU_MAP.defaults.map.styles//WSU_MAP.defaults.map.home_styles//needs to be built!!
			};
			window._i("override", override);
			window._i("WSU_MAP.state.json_style_override", WSU_MAP.state.json_style_override);
			window._i("WSU_MAP.defaults.map.styles", WSU_MAP.defaults.map.styles);
			window._i("map_op initial override", map_op.styles);
			window._i("map_op", map_op);
			//map_op = $.extend(map_op,{"mapTypeControl":false,"panControl":false});
			
			var ops = "";
			
			if($('#runningOptions').length && !($('#runningOptions').html()==="{}"||$('#runningOptions').html()==="") ){
				$('#runningOptions').html($('#runningOptions').html().replace(/(\"mapTypeId\":"\w+",)/g,''));
				ops = $('#runningOptions').html();
			}
			if( WSU_MAP.state.running_options !== false ){
				ops = WSU_MAP.state.running_options;
			}
			window._i("running options",ops);
			
			if(ops!==""){
			    //var mapType = jsonStr.replace(/.*?(\"mapTypeId\":"(\w+)".*$)/g,"$2");
			    window._i("ops", ops);
			    window._i("ops", $.parseJSON(ops));
			    ops = ops.replace(/("\w+":\"\",)/g, '').replace(/(\"mapTypeId\":"\w+",)/g, '');
			    window._i("ops after replace", ops);
			    window._i("pos", pos);
			    window._i("base", base);
			    window._i("ops", JSON.parse(ops));
			    window._i("map_op", map_op);
			    $.extend(map_op, JSON.parse(ops));
			    map_op = JSON.parse(JSON.stringify(map_op));
			    window._d(JSON.parse(JSON.stringify(map_op)));
			   // window._i("map_op string", JSON.stringify(map_op));
			    window._i("zoom", map_op.zoom);
			    window._i("center", map_op.center);
			}
			window._i("extended options", map_op);
			var op_override = WSU_MAP.state.map_jObj.triggerHandler('wsu_maps:loaded_options', [map_op]);
			if(window._defined(op_override)){	
				window._i('received a value for the `wsu_maps:loaded_options` event', op_override);
				map_op = $.extend(map_op,op_override||{});
			}
			//map_op.zoom = 10;
			window._i('for view, using options of', map_op);
			WSU_MAP.state.map_jObj.map_options = map_op;
			//map_op.zoom = 3;
			WSU_MAP.state.map_jObj.gmap(map_op).bind('init', function () {
			    window._d("created map view");
			    WSU_MAP.state.map_inst = WSU_MAP.state.map_jObj.gmap('get', 'map');
			    window._d(WSU_MAP.state.map_inst);
				if(window._defined(WSU_MAP.state.map_jObj.map_options.center)){		
					var center = WSU_MAP.state.map_jObj.map_options.center;	
					var latLng = center.split(',');
					//$.wsu_maps.state.center = new google.maps.LatLng(latLng[0],latLng[1]);
					window._d('set center state as:' + center);
				}else{
					WSU_MAP.set_center();	
				}
				WSU_MAP.views.set_inital_options(WSU_MAP.state.map_jObj.map_options);

				//var map = map_ele_obj.gmap("get","map");
				WSU_MAP.ini_GAtracking('UA-17815664-13');
				WSU_MAP.poi_setup();
				if($('.mobile').length){
					WSU_MAP.geoLocate();
				}

			    $(window).resize(function () {
			        if( WSU_MAP.state.fit_to_bound !== false ){
			           // WSU_MAP.fit_to_location(WSU_MAP.state.fit_to_bound);
			            window._i("maps view fit to location", WSU_MAP.state.fit_to_bound);
					}else{
						window.setTimeout(function(){
						   // WSU_MAP.state.map_inst.fitBounds(WSU_MAP.shapes.bounds);
						    window._i("maps view fit to bounds", WSU_MAP.shapes.bounds);
						},500);
			        }
			        //window.
					WSU_MAP.keep_center();
					WSU_MAP.watch_map();
			    }).trigger("resize");
			    
				WSU_MAP.on_zoom_corrections();
				WSU_MAP.on_pan_corrections();
				WSU_MAP.on_bounds_changed_corrections();
				WSU_MAP.state.map_jObj.trigger('wsu_maps:completed');
				WSU_MAP.state.map_jObj.trigger('wsu_maps:view_setup');
				window._i("zoom after viewsetup", WSU_MAP.state.map_inst.get("zoom"));
				//console.log(WSU_MAP.state.map_jObj.gmap('get', 'map').zoom);
			//	$(window).trigger("resize");
				//callback();
			});
		},
	};
})(jQuery,window,jQuery.wsu_maps||(jQuery.wsu_maps={}));