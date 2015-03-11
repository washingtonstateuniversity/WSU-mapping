(function($) {
	var pageTracker = pageTracker || null;
	$.wsu_maps.markers = {
		highlight_marker:function(marker){
				marker.marker_style.icon.scaledSize  = new google.maps.Size(37.5,62.5);
				marker.marker_style.icon.size  = new google.maps.Size(37.5,62.5);
				marker.marker_style.icon.anchor = new google.maps.Point(3.75, 62.5);
				marker.setZIndex(99);
				marker.setIcon(marker.marker_style.icon);
		},
		unhighlight_marker:function(marker){
				marker.marker_style.icon.scaledSize  = new google.maps.Size(30,50);
				marker.marker_style.icon.size  = new google.maps.Size(30,50);
				marker.marker_style.icon.anchor = new google.maps.Point(0, 50);
				marker.setZIndex(marker.marker_style.zFrezze);
				marker.setIcon(marker.marker_style.icon);
		},
		get_lat_zIndex: function(latitude){
			var intLat = parseInt( ( parseFloat( latitude ).toFixed(2) ).toString().split('.').join('') );
			
			console.log( latitude );
			console.log( intLat*(-1) );
			
			
			return intLat*(-1);
		},
		make_Marker:function (jObj,i,id,marker_obj,markerCallback){	
		
			console.log(marker_obj.style.icon);
			var idx = i+1;
			var marker_style = $.extend(marker_obj.style,{
					'position': new google.maps.LatLng(marker_obj.position.latitude, marker_obj.position.longitude),
					'z-index':$.wsu_maps.markers.get_lat_zIndex(marker_obj.position.latitude),
					'zFrezze':$.wsu_maps.markers.get_lat_zIndex(marker_obj.position.latitude),
					'title':'',//marker_obj.title,//why? cause we do our own tool tips
					'optimized':false,
					icon:{
						url : marker_obj.style.icon === "null" ? $.wsu_maps.state.siteroot+"public/markerSVG.castle?idx="+idx : marker_obj.style.icon,
						scaledSize: new google.maps.Size(30,50),
						size: new google.maps.Size(30,50),
						origin: new google.maps.Point(0,0), // origin
						anchor: new google.maps.Point(0, 50) // anchor
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
					if($.wsu_maps.state.active_marker !== null){
						$.wsu_maps.markers.unhighlight_marker($.wsu_maps.state.active_marker);
					}
					$.wsu_maps.state.active_marker = null;
					$.wsu_maps.infobox.open_info(jObj,i,$.wsu_maps.state.markerLog[i]);
					$.wsu_maps.markers.highlight_marker($.wsu_maps.state.markerLog[i]);
					$.wsu_maps.state.active_marker = $.wsu_maps.state.markerLog[i];
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
				if( $.wsu_maps.state.active_marker !== $.wsu_maps.state.markerLog[i]){
					$.wsu_maps.markers.unhighlight_marker($.wsu_maps.state.markerLog[i]);
				}
			});
		}
	};

})(jQuery);