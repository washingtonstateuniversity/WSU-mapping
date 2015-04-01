(function($,window) {
	var pageTracker = pageTracker || null;
	$.wsu_maps.markers = {
		
		defaults:{
			width:30,
			height:50,
		},
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
			
			if($.wsu_maps.state.in_pano){
				marker = $.wsu_maps.markers.alter_marker_icon(marker,8);				
			}else{
				marker = $.wsu_maps.markers.alter_marker_icon(marker,1.25);	
			}
			
			//$.wsu_maps.state.map_jObj.addClass('active_marker');
			/*$.wsu_maps.kill_time('de_highlight');
			$.each($.wsu_maps.state.markerLog,function(idx,notmarker){
				notmarker.setOpacity(0.5);
			});*/
			
			
			marker.setIcon(marker.marker_style.icon);
			marker.setZIndex(99);
			
			//marker.setOpacity(1);
			//$("[src*='"+marker.marker_style.icon.url+"']").addClass('active_marker');
			//$("[src*='"+marker.marker_style.icon.url+"']").closest('div:not(.gmnoprint)').addClass('markers');
		},
		unhighlight_marker:function(marker){
			if($.wsu_maps.state.in_pano){
				marker = $.wsu_maps.markers.alter_marker_icon(marker,6.5);	
			}else{
				marker = $.wsu_maps.markers.alter_marker_icon(marker);
			}

			/*$.wsu_maps.time_it('de_highlight',200,function(){
				$.each($.wsu_maps.state.markerLog,function(idx,notmarker){
					notmarker.setOpacity(1);
				});
			});*/
			
			//$( $('.open_marker').length ? '.active_marker ':'' +'.active_marker:not(.open_marker)').removeClass('active_marker');
			marker.setIcon(marker.marker_style.icon);
			marker.setZIndex(marker.marker_style.zFrezze);
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
			var intLat = parseInt( latitude.toString().split('.').join('').substring(0, 5) );
			/*
			console.log( latitude );
			console.log( intLat*(-1) );
			*/
			return intLat*(-1);
		},
		make_Marker:function (i,id,marker_obj,markerCallback){	
			var jObj = $.wsu_maps.state.map_jObj;
			
			
			
			//console.log(marker_obj.style.icon);
			var idx = i+1;
			var icon = null;
			//this is just for tmp reasons.. will come back in a day or so to fix.. mark it 3-17-15 my b day so I'll remeber right.. right? .. sure.. 
			if($.wsu_maps.state.inview){
				$.wsu_maps.markers.defaults.width=15;
				$.wsu_maps.markers.defaults.height=25;
				var title = marker_obj.labels.title;
				var titles_to_mark = [
					"WSU Pullman",
					"WSU Spokane",
					"WSU Tri-Cities",
					"WSU Vancouver",
					"WSU North Puget Sound at Everett",
				];
				//console.log(title);
				icon = ( marker_obj.style.icon === "null" ? $.wsu_maps.state.siteroot+"public/markerSVG.castle?idx=" : marker_obj.style.icon );
	
				if(titles_to_mark.indexOf(title)> -1){	
					icon =	$.wsu_maps.state.siteroot+"public/coug_marker.castle";
					$.wsu_maps.markers.defaults.width=45;
					$.wsu_maps.markers.defaults.height=75;
				}
			}else{
				icon = ( marker_obj.style.icon === "null" ? $.wsu_maps.state.siteroot+"public/markerSVG.castle?idx="+idx : marker_obj.style.icon );
			}
			//re NS position, it should have a new json name but this is as far as time lets on the correction atm
			marker_obj.marker_position = marker_obj.position;
			var zIndex = $.wsu_maps.markers.get_lat_zIndex(marker_obj.marker_position.latitude);
			var marker_style = $.extend(marker_obj.style,{
					'position': new google.maps.LatLng(marker_obj.marker_position.latitude, marker_obj.marker_position.longitude),
					'z-index':zIndex,
					'zFrezze':zIndex,
					'title':'',//marker_obj.title,//why? cause we do our own tool tips
					'optimized':false,
					icon:{
						/* note that this is tmp.. defaults. should be used and the rest of this should be over writable */
						width:$.wsu_maps.markers.defaults.width,
						height:$.wsu_maps.markers.defaults.height,
						url : icon,
						scaledSize: new google.maps.Size($.wsu_maps.markers.defaults.width,$.wsu_maps.markers.defaults.height),
						size: new google.maps.Size($.wsu_maps.markers.defaults.width,$.wsu_maps.markers.defaults.height),
						origin: new google.maps.Point(0,0), // origin
						anchor: new google.maps.Point(($.wsu_maps.markers.defaults.width*0.5), $.wsu_maps.markers.defaults.height), // anchor
						original_scaledSize: new google.maps.Size($.wsu_maps.markers.defaults.width,$.wsu_maps.markers.defaults.height),
						original_size: new google.maps.Size($.wsu_maps.markers.defaults.width,$.wsu_maps.markers.defaults.height),
						original_origin: new google.maps.Point(0,0), // origin
						original_anchor: new google.maps.Point(($.wsu_maps.markers.defaults.width*0.5), $.wsu_maps.markers.defaults.height) // anchor
					}
				});

			jObj.gmap('addMarker', marker_style,function(ops,made_marker){
				made_marker.marker_style = marker_style;
				made_marker.content = marker_obj.content;
				//made_marker.title = marker_obj.labels.title;
				made_marker.marker_position = marker_obj.marker_position;
				made_marker.labels = marker_obj.labels;
				
				$.wsu_maps.state.markerLog[i]=made_marker;
				$.wsu_maps.state.markerbyid[id] = $.wsu_maps.state.markerLog[i];
				$.wsu_maps.infobox.make_InfoWindow(i,made_marker);
				$.wsu_maps.infobox.make_ToolTip(i,made_marker);
				$.wsu_maps.infobox.apply_panoramas(made_marker);

				// these too are needing to be worked together
				//jObj.gmap('setOptions', {'zIndex':1}, $.wsu_maps.state.markerLog[i]);
				if( window._defined(markerCallback) && $.isFunction( markerCallback ) ){
					markerCallback( made_marker );
				}
				
			})
			.click(function() {
				if($.wsu_maps.state.active.marker !== null){
					$.wsu_maps.markers.unhighlight_marker($.wsu_maps.state.active.marker);
				}
				$.wsu_maps.state.active.marker = null;
				$.wsu_maps.markers.highlight_marker($.wsu_maps.state.markerLog[i]);
				$.wsu_maps.state.active.marker = $.wsu_maps.state.markerLog[i];
				$("[src*='"+$.wsu_maps.state.active.marker.marker_style.icon.url+"']").addClass('open_marker');
				
				if(!$.wsu_maps.state.in_pano){
					$.wsu_maps.infobox.open_info(i);
				}else{
					window._d("react from a pano marker click");
					$.wsu_maps.infobox.pano_marker_click($.wsu_maps.state.markerLog[i]);	
				}

				if( window._defined($.jtrack) ){
					//$.jtrack.trackEvent(pageTracker,"infowindow via marker", "opened", marker.title);
				}
			})
			.rightclick(function(event){
				$.wsu_maps.controlls.showContextMenu(event.latLng);
			})
			.mouseover(function(){//event){
				//$('[src*="public/markerSVG.castle?idx='+idx+'"]').closest('div').addClass('svg_clip');
				$.wsu_maps.infobox.open_toolTip(i);
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

})(jQuery,window);