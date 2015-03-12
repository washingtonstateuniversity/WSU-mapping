(function($) {
	var pageTracker = pageTracker || null;
	$.wsu_maps.markers = {
		
		defaults:{
			width:30,
			height:50,
		},
		
		
		alter_marker_icon:function(marker,multiplier){
			multiplier = multiplier||1;
			var width = marker.marker_style.icon.width * multiplier;
			var height = marker.marker_style.icon.height * multiplier;
			marker.marker_style.icon.scaledSize  = new google.maps.Size(width,height);
			marker.marker_style.icon.size  = new google.maps.Size(width,height);
			marker.marker_style.icon.anchor = new google.maps.Point( (multiplier>1 ? (width*0.125) : 0) ,  (multiplier>1 ? height+(height*0.125) : height) );	
			return marker;
		},
		highlight_marker:function(marker){
			if($.wsu_maps.state.in_pano){
				marker = $.wsu_maps.markers.alter_marker_icon(marker,8);				
			}else{
				marker = $.wsu_maps.markers.alter_marker_icon(marker,1.25);	
			}
			marker.setZIndex(99);
			marker.setIcon(marker.marker_style.icon);
		},
		unhighlight_marker:function(marker){
			if($.wsu_maps.state.in_pano){
				marker = $.wsu_maps.markers.alter_marker_icon(marker,6.5);	
			}else{
				marker = $.wsu_maps.markers.alter_marker_icon(marker);
			}
			marker.setZIndex(marker.marker_style.zFrezze);
			marker.setIcon(marker.marker_style.icon);
		},
		init_street_view_markers:function(){
			$.each($.wsu_maps.state.markerLog, function(idx,marker){
				$.wsu_maps.markers.set_street_view_marker_size(marker);
			});
		},
		init_map_markers:function(){
			$.each($.wsu_maps.state.markerLog, function(idx,marker){
				$.wsu_maps.markers.set_map_marker_size(marker);
			});
		},
		set_street_view_marker_size:function(marker){
			marker = $.wsu_maps.markers.alter_marker_icon(marker,7.5);	
			marker.setIcon(marker.marker_style.icon);
		},
		set_map_marker_size:function(marker){
			marker = $.wsu_maps.markers.alter_marker_icon(marker);
			marker.setIcon(marker.marker_style.icon);
		},
		get_lat_zIndex: function(latitude){
			var intLat = parseInt( latitude.toString().split('.').join('').substring(0, 4) );
			/*
			console.log( latitude );
			console.log( intLat*(-1) );
			*/
			return intLat*(-1);
		},
		make_Marker:function (jObj,i,id,marker_obj,markerCallback){	
		
			//console.log(marker_obj.style.icon);
			var idx = i+1;
			var marker_style = $.extend(marker_obj.style,{
					'position': new google.maps.LatLng(marker_obj.position.latitude, marker_obj.position.longitude),
					'z-index':$.wsu_maps.markers.get_lat_zIndex(marker_obj.position.latitude),
					'zFrezze':$.wsu_maps.markers.get_lat_zIndex(marker_obj.position.latitude),
					'title':'',//marker_obj.title,//why? cause we do our own tool tips
					'optimized':false,
					icon:{
						/* note that this is tmp.. defaults. should be used and the rest of this should be over writable */
						width:$.wsu_maps.markers.defaults.width,
						height:$.wsu_maps.markers.defaults.height,
						url : marker_obj.style.icon === "null" ? $.wsu_maps.state.siteroot+"public/markerSVG.castle?idx="+idx : marker_obj.style.icon,
						scaledSize: new google.maps.Size($.wsu_maps.markers.defaults.width,$.wsu_maps.markers.defaults.height),
						size: new google.maps.Size($.wsu_maps.markers.defaults.width,$.wsu_maps.markers.defaults.height),
						origin: new google.maps.Point(0,0), // origin
						anchor: new google.maps.Point(0, $.wsu_maps.markers.defaults.height), // anchor
						original_scaledSize: new google.maps.Size($.wsu_maps.markers.defaults.width,$.wsu_maps.markers.defaults.height),
						original_size: new google.maps.Size($.wsu_maps.markers.defaults.width,$.wsu_maps.markers.defaults.height),
						original_origin: new google.maps.Point(0,0), // origin
						original_anchor: new google.maps.Point(0, $.wsu_maps.markers.defaults.height) // anchor
					}
				});

			
			jObj.gmap('addMarker', marker_style,function(ops,marker){
				marker.marker_style = marker_style;
				$.wsu_maps.state.markerLog[i]=marker;
				$.wsu_maps.state.markerbyid[id] = $.wsu_maps.state.markerLog[i];
				// these too are needing to be worked together
				//jObj.gmap('setOptions', {'zIndex':1}, $.wsu_maps.state.markerLog[i]);
				if( typeof(markerCallback) !== "undefined" && $.isFunction( markerCallback ) ){
					markerCallback( marker );
				}
				
			})
			.click(function() {
				if($.wsu_maps.state.active.marker !== null){
					$.wsu_maps.markers.unhighlight_marker($.wsu_maps.state.active.marker);
				}
				$.wsu_maps.state.active.marker = null;
				$.wsu_maps.infobox.open_info(jObj,i,$.wsu_maps.state.markerLog[i]);
				$.wsu_maps.markers.highlight_marker($.wsu_maps.state.markerLog[i]);
				$.wsu_maps.state.active.marker = $.wsu_maps.state.markerLog[i];
				if(typeof($.jtrack)!=="undefined"){
					//$.jtrack.trackEvent(pageTracker,"infowindow via marker", "opened", marker.title);
				}
			})
			.rightclick(function(event){$.wsu_maps.showContextMenu(event.latLng);})
			.mouseover(function(){//event){
				//$('[src*="public/markerSVG.castle?idx='+idx+'"]').closest('div').addClass('svg_clip');
				$.wsu_maps.infobox.open_toolTip(jObj,i,$.wsu_maps.state.markerLog[i]);
				$.wsu_maps.markers.highlight_marker($.wsu_maps.state.markerLog[i]);
			})
			.mouseout(function(){//event){
				$.wsu_maps.infobox.close_toolTips();
				if( $.wsu_maps.state.active.marker !== $.wsu_maps.state.markerLog[i]){
					$.wsu_maps.markers.unhighlight_marker($.wsu_maps.state.markerLog[i]);
				}
			});
		}
	};

})(jQuery);