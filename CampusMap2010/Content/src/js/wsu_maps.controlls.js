// JavaScript Document
(function($,window,WSU_MAP) {
	$.extend( WSU_MAP, {
		controlls : {
			defaults:{ },
			setup_map_type_controlls:function (){
				if($('.mapControl').length===0){
					// Set CSS for the control border.
					var controlText,controlUI;
					controlUI = document.createElement('div');
					
					controlUI.title = 'Click Get Aerial photos';
					controlUI.className = 'mapControl TOP';
					
					
					if(!$('.embedded').length && WSU_MAP.state.campus==="Pullman"){
						// Set CSS for the control interior.
						controlText = document.createElement('div');
						controlText.className = 'text';
						controlText.innerHTML = 'Aerial Views';
						controlUI.appendChild(controlText);
						WSU_MAP.state.map_jObj.gmap("addControl", controlUI, google.maps.ControlPosition.RIGHT_TOP);
						google.maps.event.addDomListener(controlUI, 'click', function() {
							$('.mapControl').removeClass('activeControl');
							$(this).addClass('activeControl');
						 //WSU_MAP.state.map_jObj.gmap("setOptions",{'mapTypeId':google.maps.MapTypeId.ROADMAP});
							/*$('[rel="aerial_gouped"]').colorbox({
								photo:true,
								scrolling:false,
								scalePhotos:true,
								opacity:0.7,
								maxWidth:"75%",
								maxHeight:"75%",
								transition:"none",
								slideshow:true,
								slideshowAuto:false,
								open:true,
								current:"<span id='cur'>{current}</span><span id='ttl'>{total}</span>",
								onClosed:function(){
									$('.activeControl').removeClass('activeControl');
									$('#'+WSU_MAP.state.currentControl).addClass('activeControl');
									//$('#'+currentControl).trigger('click');
									//WSU_MAP.state.map_jObj.gmap("setOptions",{'mapTypeId':currentControl.toLowerCase()});
								},
								onComplete:function(){
									if($('#colorbox #cb_nav').length){
										$('#colorbox #cb_nav').html("");
									}
									if($('#ttl').length){
										var t=parseInt($('#ttl').text(), 10);
										var li="";
										if(t>1){
											for(var j=0; j<t; j++){
												li+="<li><a href='#'></a></li>";
											}
											if($('#colorbox #cb_nav').length===0){
												$('#cboxCurrent').after('<ul id="cb_nav">'+li+'</ul>');
											}else{
												$('#colorbox #cb_nav').html(li);
											}
										}
										if($('#colorbox #cb_nav').length){
											$('#colorbox #cb_nav .active').removeClass('active');
											$('#colorbox #cb_nav').find('li:eq('+ ( parseInt($('#cboxCurrent #cur').text(), 10) -1) +')').addClass('active');
										}
									}
								}
							});*/
						});
					}
				
				
					// Set CSS for the control border.
					controlUI = document.createElement('div');
				
					controlUI.title = 'Switch map to Roadmap';
					controlUI.className = 'mapControl TYPE activeControl';
					controlUI.id="ROADMAP";
					
					// Set CSS for the control interior.
					controlText = document.createElement('div');
					controlText.className = 'text';
					controlText.innerHTML = 'Map';
					controlUI.appendChild(controlText);
					WSU_MAP.state.map_jObj.gmap("addControl", controlUI, google.maps.ControlPosition.RIGHT_TOP);
					google.maps.event.addDomListener(controlUI, 'click', function() {
						$('.mapControl').removeClass('activeControl');
						$(this).addClass('activeControl');
						WSU_MAP.state.map_jObj.gmap("setOptions",{'mapTypeId':google.maps.MapTypeId.ROADMAP});
						WSU_MAP.state.currentControl="ROADMAP";
					});
					
					
					
				
					// Set CSS for the control border.
					controlUI = document.createElement('div');
					controlUI.title = 'Switch map to Satellite';
					controlUI.className = 'mapControl';
					controlUI.id="SATELLITE";
					
					// Set CSS for the control interior.
					controlText = document.createElement('div');
					controlText.className = 'text';
					controlText.innerHTML = 'Satellite';
					controlUI.appendChild(controlText);
					WSU_MAP.state.map_jObj.gmap("addControl", controlUI, google.maps.ControlPosition.RIGHT_TOP);
					google.maps.event.addDomListener(controlUI, 'click', function() {
						$('.mapControl').removeClass('activeControl');
						$(this).addClass('activeControl');
						WSU_MAP.state.map_jObj.gmap("setOptions",{'mapTypeId':google.maps.MapTypeId.SATELLITE});
						WSU_MAP.state.currentControl="SATELLITE";
					});
					
					
					
						
				
					// Set CSS for the control border.
					controlUI = document.createElement('div');
					controlUI.title = 'Switch map to Hybrid (satellite + roadmap)';
					controlUI.className = 'mapControl';
					controlUI.id="HYBRID";
					
					// Set CSS for the control interior.
					controlText = document.createElement('div');
					controlText.className = 'text';
					
					controlText.innerHTML = 'Hybrid';
					controlUI.appendChild(controlText);
					WSU_MAP.state.map_jObj.gmap("addControl", controlUI, google.maps.ControlPosition.RIGHT_TOP);
					google.maps.event.addDomListener(controlUI, 'click', function() {
						$('.mapControl').removeClass('activeControl');
						$(this).addClass('activeControl');
						WSU_MAP.state.map_jObj.gmap("setOptions",{'mapTypeId':google.maps.MapTypeId.HYBRID});
						WSU_MAP.state.currentControl="HYBRID";
					});
				}
				/**/
			},
			setMenuXY:function (caurrentLatLng){
				var mapWidth = WSU_MAP.state.map_jObj.width();
				var mapHeight = WSU_MAP.state.map_jObj.height();
				var menuWidth = $('.contextmenu').width();
				var menuHeight = $('.contextmenu').height();
				var clickedPosition = WSU_MAP.util.getCanvasXY(caurrentLatLng);
				var x = clickedPosition.x ;
				var y = clickedPosition.y ;
				
				if((mapWidth - x ) < menuWidth){
					x = x - menuWidth;
				}
				if((mapHeight - y ) < menuHeight){
					y = y - menuHeight;
				}
				
				$('.contextmenu').css('left',x  );
				$('.contextmenu').css('top',y );
			},
			showContextMenu:function(caurrentLatLng  ){
				/* this need to be abstracked out into the jMap plugin */
				window._d("altering the right click options");
				var map = WSU_MAP.state.map_inst;
				var projection;
				var contextmenuDir;
				projection = map.getProjection();
				WSU_MAP.controlls.hideContextMenu();
				contextmenuDir = document.createElement("div");
				contextmenuDir.className  = 'contextmenu';
				contextmenuDir.innerHTML = '<a id="from">Directions from here...</a><a id="to">Directions to here...</a>';
				$(map.getDiv()).append(contextmenuDir);
				WSU_MAP.controlls.setMenuXY(caurrentLatLng);
				contextmenuDir.style.visibility = "visible";
				if(WSU_MAP.state.cTo==="" && WSU_MAP.state.cFrom ===""){
					WSU_MAP.directions.clearHereToThere();
				}
				if(WSU_MAP.state.cTo!==""){
					$('.contextmenu #to').addClass('active');
				}
				if(WSU_MAP.state.cFrom!==""){
					$('.contextmenu #from').addClass('active');
				}
				$('.contextmenu #to').on('click',function(){
					WSU_MAP.state.cTo=caurrentLatLng.lat()+","+caurrentLatLng.lng();
					//alert(WSU_MAP.state.cTo);
					$(this).addClass('active');
					WSU_MAP.controlls.hideContextMenu();
					if(WSU_MAP.state.cTo==="" || WSU_MAP.state.cFrom ===""){
						return false;
					}
					WSU_MAP.directions.clearHereToThere();
					WSU_MAP.directions.hereToThere();
				});
				$('.contextmenu #from').click(function(){
					WSU_MAP.state.cFrom=caurrentLatLng.lat()+","+caurrentLatLng.lng();
					//alert(WSU_MAP.state.cFrom);
					$(this).addClass('active');
					WSU_MAP.controlls.hideContextMenu();
					if(WSU_MAP.state.cTo==="" || WSU_MAP.state.cFrom ===""){
						return false;
					}
					WSU_MAP.directions.clearHereToThere();
					WSU_MAP.directions.hereToThere();
				});
			},
			hideContextMenu:function() {
				$('.contextmenu').remove();
			},
		}
	});
})(jQuery,window,jQuery.wsu_maps||(jQuery.wsu_maps={}));