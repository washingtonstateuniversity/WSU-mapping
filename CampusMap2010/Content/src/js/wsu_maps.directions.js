// JavaScript Document
(function($) {
	$.wsu_maps.directions = {
		setup_directions:function(){
			var kStroke;
			if($('#directionsTo').is(':visible')){
				$('#directionsTo').show();
			}
			$('#directionsFrom input,#directionsTo input').off().on('keyup',function(e){
				e.preventDefault();
				e.stopPropagation();
				if($('#directionsFrom input').val() !==''){
					if($('#directionsTo').css('display')==='none'){
						$('#directionsTo').show();
						$.wsu_maps.nav.reset_Navscrollbar();
					}
					window.clearTimeout(kStroke);
					kStroke=window.setTimeout(function(){
						$.wsu_maps.directions.fireDirections();
					},2000);
							
					if ( e.which === 13 ){
						window.clearTimeout(kStroke);
						$.wsu_maps.directions.fireDirections();
					}
				}			
			});
		},
		fireDirections:function (){
			//$.wsu_maps.state.map_jObj.gmap('clear','markers');
			//$.wsu_maps.state.map_jObj.gmap('clear','overlays');
			var jObj = $.wsu_maps.state.map_jObj;
			jObj.gmap('clear','serivces');
			jObj.append('<img src="/Content/images/loading.gif" style="position:absolute; top:50%; left:50%;" id="loading"/>');
			var from = $('#directionsFrom input').val();
			var to = $('#directionsTo input').val();
			if( from !== '' ){
				if( to === "" || to === "WSU "+$.wsu_maps.state.campus ){
					to = $.wsu_maps.state.campus_latlng_str;
				}else{
					jObj.gmap('search',{address:to+' USA'},function(results, status){
						if (status === google.maps.GeocoderStatus.OK) {
							to = results[0].geometry.location;
						} else {
							to = $.wsu_maps.state.campus_latlng_str;
						}
					});
				}
				jObj.gmap('search',{address:from+' USA'},function(results, status){
					if (status === google.maps.GeocoderStatus.OK) {
						from = results[0].geometry.location;
						jObj.gmap('displayDirections',
							{origin:from,destination:to,travelMode: google.maps.DirectionsTravelMode.DRIVING},
							{draggable: true},
							function(results){//, status){
								$.wsu_maps.directions.display_directions(results);
								if($('#directions_area').length){
									$('#printDir').off().on('click',function(e){
										e.preventDefault();
										e.stopPropagation();
										var map = $.wsu_maps.state.map_inst;
										var baseUrl = "http://maps.googleapis.com/maps/api/staticmap?";
										 
										var params = [];
										params.push("sensor=false");
										params.push("size=700x504");
										params.push("center=" + map.getCenter().lat().toFixed(6) + "," + map.getCenter().lng().toFixed(6));
										//params.push("zoom=" + map.getZoom());
	
										var markersArray = [];
										markersArray.push("markers=color:green%7Clabel:A%7C"+results.routes[0].legs[0].start_location.toString().replace(')','').replace('(',''));
										markersArray.push("markers=color:green%7Clabel:B%7C"+results.routes[0].legs[0].end_location.toString().replace(')','').replace('(',''));
										params.push(markersArray.join("&"));
										var path = google.maps.geometry.encoding.decodePath(results.routes[0].overview_polyline.points);   
	
										params.push("path=weight:3%7Ccolor:blue%7Cenc:" + google.maps.geometry.encoding.encodePath(path) );
										baseUrl += params.join("&");
	
										   
										if($("#hide").length===0){
											$('body').append('<div id="hide" ><div id="pArea"></div></div>');
										}
										
										$("#pArea").html($('#directions_area').html()+'<img src="'+baseUrl+'" alt="map" width="700" height="504"/>');
										/*if($.browser.msie){
											$("#pArea").prepend("<style>@media print {#header_bar,#centralMap_wrap,#mainNavArea {display:none;}}</style>");
											window.print();
										}else{
											$("#pArea").jprint();
										}*/
										
										$("#pArea").jprint();
										
									});
									
								}
							});
					} else {
						$.colorbox({
							html:function(){
								return '<div id="errorReporting"><h2>Error</h2><h3>Google couldn\'t pull up the directions, Please try again</h3><h4>Google was having a hard time finding your location for this reason:'+ status +' </h4></div>';
							},
							scrolling:false,
							opacity:0.7,
							transition:"none",
							width:450,
							open:true,
							onComplete:function(){
								$.wsu_maps.general.prep_html();
								$.colorbox.resize();
							}
						});
					}
					$('#loading').remove();
				});
			}
		},
		display_directions:function (results){
			var jObj = $.wsu_maps.state.map_jObj;
			$.wsu_maps.listings.autoOpenListPanel(function(){
				
				
				if($('#directions-panel').length===0){
					$('#selectedPlaceList_area').append('<div id="directions-panel">');
				}
				if($('#directions_area').length===0){
					$('#directions-panel').append('<div id="directions_area">');
				}
				$.wsu_maps.listings.destroy_Dirscrollbar();
				
				var directionsDisplay = jObj.gmap('get','services > DirectionsRenderer');
				directionsDisplay.setPanel(document.getElementById('directions_area'));
				directionsDisplay.setDirections(results);
											
				if($('#directions-panel #output').length===0){
					$('#directions-panel').prepend('<div id="output"><a href="#" id="printDir">Print</a><a href="#" id="emailDir">Email</a></div>');
				}
				google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
					$.wsu_maps.listings.destroy_Dirscrollbar();
					$.wsu_maps.listings.setup_Dirscrollbar($('#directions-panel'));
				}); 
				directionsDisplay.setDirections(results);
				$.wsu_maps.listings.listTabs("directions");
				$.wsu_maps.general.addEmailDir();
			});
		},
		hereToThere:function (){
			var jObj = $.wsu_maps.state.map_jObj;
			if($.wsu_maps.state.cTo===""||$.wsu_maps.state.cFrom ===""){
				return false;
			}
			$.wsu_maps.directions.clearHereToThere();
			
			$.colorbox.remove();
			$.colorbox({
				rel:'gouped',
				html:function(){
					return '<div id="modeArea"><h2>Choose Mode</h2><select id="trasMode"><option value="Walk">Walk</option><option value="Bike">Bike</option><option value="Car">Car</option><option value="Transit">Transit</option></select><br/><input type="Submit" value="Continue" name="modeSubmit"/></div>';
				},
				scrolling:false,
				opacity:0.7,
				transition:"none",
				width:275,
				open:true,
				onComplete:function(){
					//if($('#colorbox #cb_nav').length)$('#colorbox #cb_nav').html("");
					$('#modeArea [type="Submit"]').off().on('click',function(e){
						$.colorbox.close();
						e.stopPropagation();
						e.preventDefault();
						var mode;
						switch($('#trasMode').val()){
							case "Walk":
								mode = google.maps.DirectionsTravelMode.WALKING;
								break;
							case "Bike":
								mode = google.maps.DirectionsTravelMode.BICYCLING;
								break;
							case "Car":
								mode = google.maps.DirectionsTravelMode.DRIVING;
								break;
							case "Transit":
								mode = google.maps.DirectionsTravelMode.TRANSIT;
								break;
						}
						jObj.gmap('displayDirections',
							{origin:$.wsu_maps.state.cFrom,destination:$.wsu_maps.state.cTo,travelMode: mode},
							{draggable: true},
							function(results){
								$.wsu_maps.state.cFrom="";
								$.wsu_maps.state.cTo="";
								$.wsu_maps.state.hasDirection=true;
								$('#loading').remove();
								$.wsu_maps.directions.display_directions(results);
						});
					});
				}
			});	
		
		},
		clearHereToThere:function (){
			if($.wsu_maps.state.hasDirection){
				$.wsu_maps.state.hasDirection=false;
				$.wsu_maps.state.cFrom="";
				$.wsu_maps.state.cTo="";
				$.wsu_maps.state.map_jObj.gmap('clear','overlays');
				$.wsu_maps.state.map_jObj.gmap('clear','serivces');
			}
		},
	};
})(jQuery);