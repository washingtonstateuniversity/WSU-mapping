// JavaScript Document
(function($,window,WSU_MAP) {
	$.extend( WSU_MAP, {
		directions : {
			setup_directions:function(){
				var kStroke;
				if($('#directionsTo').is(':visible')){
					$('#directionsTo').show();
				}
				$('#directionsFrom input,#directionsTo input').off().on('keyup',function(e){
					WSU_MAP.util.nullout_event(e);
					if($('#directionsFrom input').val() !==''){
						if($('#directionsTo').css('display')==='none'){
							$('#directionsTo').show();
							WSU_MAP.nav.reset_Navscrollbar();
						}
						window.clearTimeout(kStroke);
						kStroke=window.setTimeout(function(){
							WSU_MAP.directions.fireDirections();
						},2000);
								
						if ( e.which === 13 ){
							window.clearTimeout(kStroke);
							WSU_MAP.directions.fireDirections();
						}
					}			
				});
			},
			fireDirections:function (){
				//WSU_MAP.state.map_jObj.gmap('clear','markers');
				//WSU_MAP.state.map_jObj.gmap('clear','overlays');
				var jObj = WSU_MAP.state.map_jObj;
				jObj.gmap('clear','serivces');
				jObj.append('<img src="/Content/images/loading.gif" style="position:absolute; top:50%; left:50%;" id="loading"/>');
				var from = $('#directionsFrom input').val();
				var to = $('#directionsTo input').val();
				if( from !== '' ){
					if( to === "" || to === "WSU "+WSU_MAP.state.campus ){
						to = WSU_MAP.state.campus_latlng_str;
					}else{
						jObj.gmap('search',{address:to+' USA'},function(results, status){
							if (status === google.maps.GeocoderStatus.OK) {
								to = results[0].geometry.location;
							} else {
								to = WSU_MAP.state.campus_latlng_str;
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
									WSU_MAP.directions.display_directions(results);
									if($('#directions_area').length){
										$('#printDir').off().on('click',function(e){
											WSU_MAP.util.nullout_event(e);
											var map = WSU_MAP.state.map_inst;
											var baseUrl = "https://maps.googleapis.com/maps/api/staticmap?";
											 
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
												$("#pArea").prepend("<style>@media print {#header_bar,#centralmap_wrap,#mainNavArea {display:none;}}</style>");
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
									WSU_MAP.general.prep_html();
									$.colorbox.resize();
								}
							});
						}
						$('#loading').remove();
					});
				}
			},
			display_directions:function (results){
				var jObj = WSU_MAP.state.map_jObj;
				WSU_MAP.listings.autoOpenListPanel(function(){
					WSU_MAP.listings.destroy_Dirscrollbar();
					
					var directionsDisplay = jObj.gmap('get','services > DirectionsRenderer');
					directionsDisplay.setPanel(document.getElementById('directions_area'));
					directionsDisplay.setDirections(results);
	
					google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
						WSU_MAP.listings.destroy_Dirscrollbar();
						WSU_MAP.listings.setup_Dirscrollbar($('#directions-panel'));
					}); 
					directionsDisplay.setDirections(results);
					WSU_MAP.listings.listTabs("directions");
					WSU_MAP.directions.addEmailDir();
				});
			},
			hereToThere:function (){
				var jObj = WSU_MAP.state.map_jObj;
				if(WSU_MAP.state.cTo===""||WSU_MAP.state.cFrom ===""){
					return false;
				}
				WSU_MAP.directions.clearHereToThere();
				
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
							WSU_MAP.util.nullout_event(e);
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
								{origin:WSU_MAP.state.cFrom,destination:WSU_MAP.state.cTo,travelMode: mode},
								{draggable: true},
								function(results){
									WSU_MAP.state.cFrom="";
									WSU_MAP.state.cTo="";
									WSU_MAP.state.hasDirection=true;
									$('#loading').remove();
									WSU_MAP.directions.display_directions(results);
							});
						});
					}
				});	
			
			},
			clearHereToThere:function (){
				if(WSU_MAP.state.hasDirection){
					WSU_MAP.state.hasDirection=false;
					WSU_MAP.state.cFrom="";
					WSU_MAP.state.cTo="";
					WSU_MAP.state.map_jObj.gmap('clear','overlays');
					WSU_MAP.state.map_jObj.gmap('clear','serivces');
				}
			},
			addEmailDir:function (){
				$('#emailDir').off().on('click',function(e){
					WSU_MAP.util.nullout_event(e);
					//var trigger=$(this);
					$.colorbox({
						html:function(){
							return '<div id="emailDirs"><form action="../public/emailDir.castle" method="post">'+
										'<h2>Want to email the directions?</h2>'+
										'<h4>Please provide you email and the email of the person you wish to send the directions to.</h4>'+
										'<textarea name="directions" style="position:absolute;top:-9999em;left:-9999em;">'+$('#directions-panel').html()+'</textarea>'+
										'<lable>Your Name:<br/><input type="text" value="" required placeholder="First and Last" name="name"></lable><br/>'+
										'<lable>Your Email:<br/><input type="email" value="" required placeholder="Your email address" id="email" name="email"></lable><br/>'+
										'<lable>Recipient Name:<br/><input type="text" value="" required placeholder="First and Last" name="recipientname"></lable><br/>'+
										'<lable>Recipient Email:<br/><input type="email" value="" required placeholder="Destination email address" id="recipientemail" name="recipientemail"></lable><br/>'+
										'<lable>Notes to recipient: <br/>'+
										'<textarea required placeholder="Some notes on the directions" name="notes"></textarea></lable><br/>'+
										'<br/><input type="Submit" id="errorSubmit" value="Submit"/><br/>'+
									'</from></div>';
						},
						scrolling:false,
						opacity:0.7,
						transition:"none",
						innerWidth:450,
						//height:450,
						open:true,
						onClosed:function(){
							$('#colorbox').removeClass('norm');
						},
						onOpen:function(){$('#colorbox').addClass('norm');},
						onComplete:function(){
							WSU_MAP.general.prep_html();
							if($('#colorbox #cb_nav').length){
								$('#colorbox #cb_nav').html("");
							}
							$.colorbox.resize();	
							$('#emailDirs [type="Submit"]').off().on('click',function(e){
								WSU_MAP.util.nullout_event(e);
								$('#valid').remove();
								var valid=true;
								$.each($('#emailDirs [required]'),function(){
									if($(this).val()===""){
										valid=false;
									}
								});
								
								if(valid){
									$.post($('#emailDirs form').attr('action'), $('#emailDirs form').serialize(),function(data){
										if(data==="email:false"){
											$('#emailDirs').prepend("<div id='valid'><h3>Your email is not a valid email.  Please enter it again</h3></div>");
											$('#email').focus();
											$.colorbox.resize();
										}else if(data==="recipientemail:false"){
											$('#emailDirs').prepend("<div id='valid'><h3>The recipient's email is not a valid email.  Please enter it again</h3></div>");
											$('#recipientemail').focus();
											$.colorbox.resize();
										}else{
											$('#emailDirs').html('<h2>You will recive an email shortly as a copy.</h2>'+'');
											$.colorbox.resize();
										}
									});
								}else{
									if($('#valid').length===0){
										$('#emailDirs').prepend("<div id='valid'><h3>Please completely fill out the form.</h3></div>");
									}
								}
							});
						}
					});
				});		
			},
		}
	});
})(jQuery,window,jQuery.wsu_maps||(jQuery.wsu_maps={}));