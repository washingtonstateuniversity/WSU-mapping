(function($) {
	var pageTracker = pageTracker || null;
	$.wsu_maps.markers = {
		make_Marker:function (jObj,i,id,marker,markerCallback){	
			if(marker.style.icon){
				marker.style.icon = marker.style.icon.replace('{$i}',i+1);
			}
			jObj.gmap('addMarker', $.extend({ 
					'position': new google.maps.LatLng(marker.position.latitude, marker.position.longitude),
					'z-index':1,
					'title':marker.title
				},marker.style),function(ops,marker){
					$.wsu_maps.state.markerLog[i]=marker;
					$.wsu_maps.state.markerbyid[id] = $.wsu_maps.state.markerLog[i];
					 // these too are needing to be worked together
					jObj.gmap('setOptions', {'zIndex':1}, $.wsu_maps.state.markerLog[i]);
					if(typeof(markerCallback)!=="undefined" && $.isFunction(markerCallback)){
						markerCallback(marker);
					}
				})
			.click(function() {
					$.wsu_maps.infobox.open_info(jObj,i,marker);
					if(typeof($.jtrack)!=="undefined"){
						$.jtrack.trackEvent(pageTracker,"infowindow via marker", "opened", marker.title);
					}
				})
			.rightclick(function(event){$.wsu_maps.showContextMenu(event.latLng);})
			.mouseover(function(){//event){
				$.wsu_maps.infobox.open_toolTip(jObj,i,marker);
			})
			.mouseout(function(){//event){
				$.wsu_maps.infobox.close_toolTips();
			});
		}
	};

})(jQuery);