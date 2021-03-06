(function($,window,WSU_MAP) {
	$.extend( WSU_MAP, {
		markers : {
		
			defaults:{
				width:30,
				height:50,
			},
			routemarkers: {},
			alter_marker_icon:function(marker,multiplier){
				multiplier = multiplier||1;
				var min_width = marker.marker_style.icon.width*0.5;
				var width = marker.marker_style.icon.width * multiplier;
				var height = marker.marker_style.icon.height * multiplier;
				marker.marker_style.icon.cur_width = width;
				marker.marker_style.icon.cur_height = height;
				marker.marker_style.icon.scaledSize  = new google.maps.Size(width,height);
				marker.marker_style.icon.size  = new google.maps.Size(width,height);
				marker.marker_style.icon.anchor = new google.maps.Point( (multiplier>1 ? (min_width * multiplier) : min_width) ,  (multiplier>1 ? height+(height*0.125) : height) );	
				return marker;
			},
			highlight_marker:function(marker){
				
				if(WSU_MAP.state.in_pano){
					marker = WSU_MAP.markers.alter_marker_icon(marker,8);				
				}else{
					marker = WSU_MAP.markers.alter_marker_icon(marker,1.25);	
				}
				
				//WSU_MAP.state.map_jObj.addClass('active_marker');
				/*WSU_MAP.kill_time('de_highlight');
				$.each(WSU_MAP.state.markerLog,function(idx,notmarker){
					notmarker.setOpacity(0.5);
				});*/
				
				
				marker.setIcon(marker.marker_style.icon);
				marker.setZIndex(9999);
				
				//marker.setOpacity(1);
				//$("[src*='"+marker.marker_style.icon.url+"']").addClass('active_marker');
				//$("[src*='"+marker.marker_style.icon.url+"']").closest('div:not(.gmnoprint)').addClass('markers');
			},
			unhighlight_marker:function(marker){
				if(WSU_MAP.state.in_pano){
					marker = WSU_MAP.markers.alter_marker_icon(marker,6.5);	
				}else{
					marker = WSU_MAP.markers.alter_marker_icon(marker);
				}
				/*WSU_MAP.time_it('de_highlight',200,function(){
					$.each(WSU_MAP.state.markerLog,function(idx,notmarker){
						notmarker.setOpacity(1);
					});
				});*/
				$.each(WSU_MAP.state.markerLog,function(idx,notmarker){
					if( window._defined(notmarker.marker_style.zFrezze) && notmarker !== WSU_MAP.state.active.marker ){
						notmarker.setZIndex(notmarker.marker_style.zFrezze);
					}
				});
				//$( $('.open_marker').length ? '.active_marker ':'' +'.active_marker:not(.open_marker)').removeClass('active_marker');
				marker.setIcon(marker.marker_style.icon);
				marker.setZIndex(marker.marker_style.zFrezze);
			},
			init_street_view_markers:function(){
				$.each(WSU_MAP.state.markerLog, function(idx,marker){
					WSU_MAP.markers.set_street_view_marker_size(marker);
				});
			},
			init_map_markers:function(){
				$.each(WSU_MAP.state.markerLog, function(idx,marker){
					WSU_MAP.markers.set_map_marker_size(marker);
				});
			},
			set_street_view_marker_size:function(marker){
				marker = WSU_MAP.markers.alter_marker_icon(marker,7.5);	
				marker.setIcon(marker.marker_style.icon);
			},
			set_map_marker_size:function(marker){
				marker = WSU_MAP.markers.alter_marker_icon(marker);
				marker.setIcon(marker.marker_style.icon);
			},
			get_lat_zIndex: function(latitude){
				var intLat = parseInt( latitude.toString().split('.').join('').substring(0, 8) );
				
				window._d( latitude );
				window._d( intLat*(-1) );
				
				//return 1;//intLat/3;
				return intLat*(-1);
				
			},
			centerOnMarkers: function()
			{
			    var jObj = WSU_MAP.state.map_jObj;
			    jObj.gmap('fitBoundsToVisibleMarkers',WSU_MAP.state.displayedMarkers, {height:jObj.height(),width:jObj.width()});
			},
			centerOnMarkersWorker: function(_markers)
			{
                var numberofmarkers = Object.keys(_markers).length;
                //  Create a new viewpoint bound
                var bounds = new google.maps.LatLngBounds ();
                //  Go through each...
                for (var m in _markers) {
                    if(_markers[m])
                        //  And increase the bounds to take this point
                        try{
                            //logDebug(_markers[m]);
                            bounds.extend (_markers[m].getPosition());
                        }
                        catch (e) { window._d(e);}
                }
                WSU_MAP.state.map_inst.fitBounds(bounds);
            },
			make_Marker:function (i,id,marker_obj,markerCallback){	
				var jObj = WSU_MAP.state.map_jObj;
				window._d("starting to make a marker for "+id);
				window._d(marker_obj);
				marker_obj.style = marker_obj.style || {};

				//console.log(marker_obj.style.icon);
				var idx = i+1;
				var icon = null;
				//this is just for tmp reasons.. will come back in a day or so to fix.. mark it 3-17-15 my b day so I'll remeber right.. right? .. sure.. 
				if(WSU_MAP.state.inview || ( window._defined(WSU_MAP.admin) && WSU_MAP.admin.action === "view_editor" ) ){
					WSU_MAP.markers.defaults.width=15;
					WSU_MAP.markers.defaults.height=25;
					var title = marker_obj.labels.title;
					var titles_to_mark = [
						"WSU Pullman",
						"WSU Spokane",
						"WSU Tri-Cities",
						"WSU Vancouver",
						"WSU North Puget Sound at Everett",
					];
					//window._d(title);
					icon = ( !window._defined(marker_obj.style.icon) || marker_obj.style.icon === "null" ? WSU_MAP.state.siteroot+"public/markerSVG.castle?idx=" : marker_obj.style.icon );
					if(window.map_view.alias!=="wsu-home"){
						titles_to_mark = [
							"WSU Pullman",
						];
					}
					if(titles_to_mark.indexOf(title)> -1){	
						icon =	WSU_MAP.state.siteroot+"public/coug_marker.castle";
						WSU_MAP.markers.defaults.width=45;
						WSU_MAP.markers.defaults.height=75;
					}
				}else{
					icon = ( marker_obj.style.icon === "null" ? WSU_MAP.state.siteroot+"public/markerSVG.castle?idx="+idx : marker_obj.style.icon );
				}
				//re NS position, it should have a new json name but this is as far as time lets on the correction atm
				marker_obj.marker_position = marker_obj.position;
				var zIndex = WSU_MAP.markers.get_lat_zIndex(marker_obj.marker_position.latitude);
				var marker_style = $.extend(marker_obj.style,{
					'position': new google.maps.LatLng(marker_obj.marker_position.latitude, marker_obj.marker_position.longitude),
					'z-index':zIndex,
					'zFrezze':zIndex,
					'title':'',//marker_obj.title,//why? cause we do our own tool tips
					'optimized':false,
					icon:{
						/* note that this is tmp.. defaults. should be used and the rest of this should be over writable */
						width:WSU_MAP.markers.defaults.width,
						height:WSU_MAP.markers.defaults.height,
						url : icon,
						scaledSize: new google.maps.Size(WSU_MAP.markers.defaults.width,WSU_MAP.markers.defaults.height),
						size: new google.maps.Size(WSU_MAP.markers.defaults.width,WSU_MAP.markers.defaults.height),
						origin: new google.maps.Point(0,0), // origin
						anchor: new google.maps.Point((WSU_MAP.markers.defaults.width*0.5), WSU_MAP.markers.defaults.height), // anchor
						original_scaledSize: new google.maps.Size(WSU_MAP.markers.defaults.width,WSU_MAP.markers.defaults.height),
						original_size: new google.maps.Size(WSU_MAP.markers.defaults.width,WSU_MAP.markers.defaults.height),
						original_origin: new google.maps.Point(0,0), // origin
						original_anchor: new google.maps.Point((WSU_MAP.markers.defaults.width*0.5), WSU_MAP.markers.defaults.height) // anchor
					}
				});
				
				/*
					Override marker styles
				*/
				var override = window._defined(WSU_MAP.state.marker_json_style_override) && WSU_MAP.state.marker_json_style_override!==false && WSU_MAP.state.marker_json_style_override!=="";
				var custom_url = false;
				if( override && window._defined(WSU_MAP.state.marker_json_style_override.general) ){
					var gen = WSU_MAP.state.marker_json_style_override.general;
					if( window._defined(gen.icon) && window._defined(gen.icon.url) ){
						custom_url = $.runTemplate( gen.icon.url , { site_root : WSU_MAP.state.siteroot } );	
					}
					marker_style = $.extend( true, marker_obj.style, gen );
					if( custom_url !== false ){
						marker_style.icon.url = custom_url;
					}
				}
				if( override && window._defined(WSU_MAP.state.marker_json_style_override[id]) ){
					var style = WSU_MAP.state.marker_json_style_override[id];
					if( window._defined(style.icon) && window._defined(style.icon.url) ){
						custom_url = $.runTemplate( style.icon.url , { site_root : WSU_MAP.state.siteroot } );	
					}
					marker_style = $.extend( true, marker_obj.style, style );
					if( custom_url !== false ){
						marker_style.icon.url = custom_url;
					}
				}
				
				
				jObj.gmap('addMarker', marker_style,function(ops,made_marker){
					
					
					made_marker.marker_style = marker_style;
					made_marker.content = marker_obj.content;
					//made_marker.title = marker_obj.labels.title;
					made_marker.marker_position = marker_obj.marker_position;
					made_marker.labels = marker_obj.labels;
					made_marker.prime_image = marker_obj.prime_image;
					made_marker.media = marker_obj.media;
					made_marker.id = marker_obj.id;

					made_marker.setZIndex(made_marker.marker_style.zFrezze);
					
					
					WSU_MAP.state.displayedMarkers[i]=made_marker;
					WSU_MAP.state.markerLog[i]=made_marker;
					WSU_MAP.state.markerbyid[id] = WSU_MAP.state.markerLog[i];
					WSU_MAP.infobox.make_InfoWindow(i,made_marker);
					WSU_MAP.infobox.make_ToolTip(i,made_marker);
					WSU_MAP.infobox.apply_panoramas(made_marker);

					// these too are needing to be worked together
					//jObj.gmap('setOptions', {'zIndex':1}, WSU_MAP.state.markerLog[i]);
					//window._d(made_marker);
					//window._d("made a marker for "+id);
					WSU_MAP.state.map_jObj.trigger('wsu_maps:marker_added',[ made_marker ]);
					if( window._defined(markerCallback) && $.isFunction( markerCallback ) ){
						markerCallback( made_marker );
					}
				})
				.click(function () {
				    if(WSU_MAP.state.active.marker !== null){
						WSU_MAP.markers.unhighlight_marker(WSU_MAP.state.active.marker);
					}
					var marker = WSU_MAP.state.markerLog[i];
					WSU_MAP.markers.highlight_marker( marker );
					WSU_MAP.state.active.marker = marker;
					$(".open_marker").removeClass('open_marker');
					$("[src*='"+WSU_MAP.state.active.marker.marker_style.icon.url+"']").addClass('open_marker');
					
					if (!WSU_MAP.state.in_pano) {
						WSU_MAP.infobox.open_info(i);
					} else {
						window._d("react from a pano marker click");
						WSU_MAP.infobox.pano_marker_click( marker );
					}
					WSU_MAP.state.map_jObj.trigger('wsu_maps:marker_clicked',[ marker ]);
					if( window._defined($.jtrack) ){
						//$.jtrack.trackEvent(pageTracker,"infowindow via marker", "opened", marker.title);
					}
				})
				.dragend(function(){//e) {
					WSU_MAP.state.map_jObj.trigger('wsu_maps:marker_dragend',[ WSU_MAP.state.markerLog[i] ]);
				})
				.rightclick(function(event){
					WSU_MAP.controlls.showContextMenu(event.latLng);
				})
				.mouseover(function(){//event){
					//$('[src*="public/markerSVG.castle?idx='+idx+'"]').closest('div').addClass('svg_clip');
					WSU_MAP.infobox.open_toolTip(i);
					WSU_MAP.markers.highlight_marker(WSU_MAP.state.markerLog[i]);
				})
				.mouseout(function(){//event){
					WSU_MAP.infobox.close_toolTips();
					if( WSU_MAP.state.active.marker !== WSU_MAP.state.markerLog[i]){
						WSU_MAP.markers.unhighlight_marker(WSU_MAP.state.markerLog[i]);
					}
				});
			}
		}
	});
})(jQuery,window,jQuery.wsu_maps||(jQuery.wsu_maps={}));