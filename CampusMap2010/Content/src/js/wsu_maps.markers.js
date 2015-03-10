(function($) {
	var pageTracker = pageTracker || null;
	$.wsu_maps.markers = {
		make_Marker:function (jObj,i,id,marker_obj,markerCallback){	
		
			console.log(marker_obj.style.icon);
			var idx = i+1;
			var marker_style = $.extend(marker_obj.style,{
					'position': new google.maps.LatLng(marker_obj.position.latitude, marker_obj.position.longitude),
					'z-index':1,
					'title':marker_obj.title,
					'optimized':false,
					icon:{
						url : marker_obj.style.icon === "null" ? $.wsu_maps.state.siteroot+"public/markerSVG.castle?idx="+idx : marker_obj.style.icon,
						scaledSize: new google.maps.Size(30,50),
						size: new google.maps.Size(30,50),
						origin: new google.maps.Point(0,0), // origin
						anchor: new google.maps.Point(0, 0) // anchor
					}
				});

			
			jObj.gmap('addMarker', marker_style,function(ops,marker){
					$.wsu_maps.state.markerLog[i]=marker;
					$.wsu_maps.state.markerbyid[id] = $.wsu_maps.state.markerLog[i];
					// these too are needing to be worked together
					//jObj.gmap('setOptions', {'zIndex':1}, $.wsu_maps.state.markerLog[i]);
					if( typeof(markerCallback) !== "undefined" && $.isFunction( markerCallback ) ){
						markerCallback( marker );
					}
				})
			.click(function() {
					$.wsu_maps.infobox.open_info(jObj,i,$.wsu_maps.state.markerLog[i]);
					if(typeof($.jtrack)!=="undefined"){
						//$.jtrack.trackEvent(pageTracker,"infowindow via marker", "opened", marker.title);
					}
				})
			.rightclick(function(event){$.wsu_maps.showContextMenu(event.latLng);})
			.mouseover(function(){//event){
				$.wsu_maps.infobox.open_toolTip(jObj,i,$.wsu_maps.state.markerLog[i]);
				marker_style.icon.scaledSize  = new google.maps.Size(45,75);
				marker_style.icon.size  = new google.maps.Size(45,75);
				//jObj.gmap('setOptions', marker_style, $.wsu_maps.state.markerLog[i]);
				//[src*="placeholder.png?1"]
				console.log(marker_style);
				$.wsu_maps.state.markerLog[i].setIcon(marker_style.icon);
			})
			.mouseout(function(){//event){
				$.wsu_maps.infobox.close_toolTips();
				marker_style.icon.scaledSize  = new google.maps.Size(30,50);
				marker_style.icon.size  = new google.maps.Size(30,50);
				//jObj.gmap('setOptions', marker_style, $.wsu_maps.state.markerLog[i]);
				console.log(marker_style);
				$.wsu_maps.state.markerLog[i].setIcon(marker_style.icon);
			});
		}
	};

})(jQuery);