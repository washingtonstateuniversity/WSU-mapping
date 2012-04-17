function resizeBg(obj,height) {
	obj.height($(window).height()-height);
} 

$(document).ready(function(){
	
	if($('#centralMap').length){
		
			var winH = $(window).height()-160;
			var winW = $(window).width();
			var zoom = 15;
			if(winW>=500 && winH>=200){zoom = 13;}
			if(winW>=700 && winH>=400){zoom = 14;}
			if(winW>=900 && winH>=600){zoom = 15;}
			var _load = false;
			var url='http://images.wsu.edu/javascripts/campus_map_configs/pick.asp';			
			$.getJSON(url+'?callback=?'+(_load!=false?'&loading='+_load:''), function(data) { 
				if( $.isEmptyObject( data.mapOptions )){
					var map_op = {'center': pullman_str , 'zoom':zoom };
				}else{
					var map_op = data.mapOptions;
					if(winW>=500 && winH>=200){map_op.zoom = map_op.zoom-1;}
					if(winW>=700 && winH>=400){map_op.zoom = map_op.zoom;}
					if(winW>=900 && winH>=600){map_op.zoom = map_op.zoom+1;}
				}
				$('#centralMap').gmap(map_op).bind('init', function() { 
				
				
				var ib = [];
				
					$.each( data.markers, function(i, marker) {
		
		
		
		var box='<div id="taby'+i+'" class="ui-tabs ui-widget ui-widget-content ui-corner-all" style="margin-bottom:73px;">'+
				'<ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">'+
					'<li class="ui-state-default ui-corner-top ui-tabs-selected ui-state-active"><a href="#tabs-1">First</a></li>'+
				'	<li class="ui-state-default ui-corner-top"><a href="#tabs-2">Second</a></li>'+
				'	<li class="ui-state-default ui-corner-top"><a href="#tabs-3">Third</a></li>'+
				'</ul>'+
				'<div id="tabs-1" class="ui-tabs-panel ui-widget-content ui-corner-bottom">'+marker.info.content+'</div>'+
				'<div id="tabs-2" class="ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide">Phasellus mattis tincidunt nibh. Cras orci urna, blandit id, pretium vel, aliquet ornare, felis. Maecenas scelerisque sem non nisl. Fusce sed lorem in enim dictum bibendum.</div>'+
				'<div id="tabs-3" class="ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide">Nam dui erat, auctor a, dignissim quis, sollicitudin eu, felis. Pellentesque nisi urna, interdum eget, sagittis et, consequat vestibulum, lacus. Mauris porttitor ullamcorper augue.</div>'+
			'</div>';
		
		
		
		
		
		
		
		
						
						/* so need to remove this and create the class for it */
						var boxText = document.createElement("div");
						boxText.style.cssText = "border: 1px solid black; margin-top: 8px; background: yellow; padding: 5px;";
						boxText.innerHTML = marker.info.content;
				
						var myOptions = {
							alignBottom:true,
							 content: box//boxText
							,disableAutoPan: false
							,maxWidth: 0
							,pixelOffset: new google.maps.Size(-200, -36)
							,zIndex: 99
							,boxStyle: {
							  background: "url('/Content/images/sudo_infobottom.png') no-repeat center bottom"
							  ,width: "400px"
							 }
							,closeBoxMargin: "10px 2px 2px 2px"
							,closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
							,infoBoxClearance: new google.maps.Size(1, 1)
							,isHidden: false
							,pane: "floatPane"
							,enableEventPropagation: false
						};
						ib[i] = new InfoBox(myOptions,function(content_){
							$('#taby'+i).tabs();
						});
						//end of the bs that is well.. bs of a implamentation
						
						
						
						$('#centralMap').gmap('addMarker', $.extend({ 
							'position': new google.maps.LatLng(marker.position.latitude, marker.position.longitude)
						},marker.style)).click(function() {
							$.each(ib, function(i) {ib[i].close();});
							ib[i].open($('#centralMap').gmap('get','map'), this);
							
							//$('#centralMap').gmap('openInfoWindow', { 'content': marker.info.content }, this);
						});
					});
				});
			});
			if($('#centralMap').length){
				$(window).resize(function(){resizeBg($('#centralMap'),160)}).trigger("resize");
			}
	}	
	

	if($('#drawing_map').length){
		load_editor();
		
	 }	
	
	if($('#map_canvas').length){
		initialize();
		if($('.home #map_canvas').length){$(window).resize(function(){resizeBg($('#map_canvas'),170)}).trigger("resize");}
	 }
	$('.quickActions').click(function() {
		$(this).find('.action_nav').slideToggle('fast', function() {
		// Animation complete.
	});

//* from here is the start of the form *//
	$( "#findPlace" ).click(function(){
		//if($('#dialog-form').length==0){$('#staging').append('<div id="dialog-form" title="Create new location"></div>');}
		$( "#mapSearch" ).dialog({
			minimize:true,
			maximize:false,
			autoOpen: false,
			title:"Map Search",
			//modal: true,
			width:475,
			buttons: {
				"Add": function() {
					
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			},
			close: function() {
				//allFields.val( "" ).removeClass( "ui-state-error" );
			}
		});
		var geocoder = new google.maps.Geocoder();  
		$("#searchbox").autocomplete({
			source: function(request, response) {
				if (geocoder == null){
					geocoder = new google.maps.Geocoder();
				}
				geocoder.geocode( {'address': request.term }, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						var searchLoc = results[0].geometry.location;
						var lat = results[0].geometry.location.lat();
						var lng = results[0].geometry.location.lng();
						var latlng = new google.maps.LatLng(lat, lng);
						var bounds = results[0].geometry.bounds;
						
						geocoder.geocode({'latLng': latlng}, function(results1, status1) {
							if (status1 == google.maps.GeocoderStatus.OK) {
								if (results1[1]) {
									response($.map(results1, function(loc) {
										return {
											label  : loc.formatted_address,
											value  : loc.formatted_address,
											bounds   : loc.geometry.bounds
										}
									}));
								}
							}
						});
					}
				});
			},
			select: function(event,ui){
				var pos = ui.item.position;
				var lct = ui.item.locType;
				var bounds = ui.item.bounds;
				if (bounds){
					map.fitBounds(bounds);
				}
			}
		});
	  $( "#mapSearch" ).dialog("open").dialog('widget');
	});



$( "#addGeometrics" ).click(function(){
		//if($('#dialog-form').length==0){$('#staging').append('<div id="dialog-form" title="Create new location"></div>');}
		$( "#addGeom" ).dialog({
			minimize:true,
			maximize:false,
			autoOpen: false,
			title:"Add Geometrics",
			//modal: true,
			width:525,
			buttons: {
				"Add": function() {
					
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			},
			close: function() {
				//allFields.val( "" ).removeClass( "ui-state-error" );
			}
		});
	  $( "#addGeom" ).dialog("open").dialog('widget');
	});

		var cache = {},
			lastXhr;	
		$( "#addPlace" ).click(function(){
			if($('#dialog-form').length==0){$('#staging').append('<div id="dialog-form" title="Create new location"></div>');}
			$( "#dialog-form" ).dialog({
				minimize:true,
				maximize:true,
				autoOpen: false,
				//modal: true,
				width:560,
				buttons: {
					"Add": function() {
						
					},
					Cancel: function() {
						$( this ).dialog( "close" );
					}
				},
				close: function() {
					//allFields.val( "" ).removeClass( "ui-state-error" );
				}
			});
			
			$('#dialog-form').load('../place/editor.castle?ajax=true',function(){
					/*if($('#tabs.place_new').length>0){
						taboptions={cookie:{expires: 1,path:'/place/'}};
					} */taboptions={};
					$( "#tabs" ).tabs(typeof(place_id) !== 'undefined'&&place_id==0?{ disabled: [3] }:taboptions);
					if(typeof(tinyMCE) !== 'undefined' && $('.tinyEditor').length>0){
						if($("#tabs-2 #place_Bodytext").length>0){
							load_tiny("bodytext");
							load_tiny("simple");
						}else{
							load_tiny();
						}
					}
					$( "#LocationTypeSelect" ).combobox();
					$( "#LocationModelSelect" ).combobox();
				});
			$( "#dialog-form" ).dialog("open").dialog('widget');//.position({my: 'left',at: 'left',of: $('#map_canvas')}); 
			drop1(); 

			$( "#tags" )
				// don't navigate away from the field on tab when selecting an item
				.bind( "keydown", function( event ) {
					if ( event.keyCode === $.ui.keyCode.TAB &&
							$( this ).data( "autocomplete" ).menu.active ) {
						event.preventDefault();
					}
				})
				.autocomplete({
					minLength: 0,
					source: function( request, response ) {
						// delegate back to autocomplete, but extract the last term
						/*response( $.ui.autocomplete.filter(
							availableTags, extractLast( request.term ) ) );*/
				            var term = request.term;
				            if ( term in cache ) {
					            response( cache[ term ] );
					            return;
				            }

				            lastXhr = $.getJSON( DOMAIN+"/public/get_pace_type.castle", request, function( data, status, xhr ) {
					            cache[ term ] = data;
					            if ( xhr === lastXhr ) {
						            response( $.ui.autocomplete.filter(
									data, extractLast( request.term ) ) );
					            }
				            });
					},
					focus: function() {
						// prevent value inserted on focus
						return false;
					},
					select: function( event, ui ) {
						var terms = split( this.value );
						// remove the current input
						terms.pop();
						// add the selected item
						terms.push( ui.item.value );
						// add placeholder to get the comma-and-space at the end
						terms.push( "" );
						this.value = terms.join( ", " );
						return false;
					}
				});
			});
		});
			
			$('.actions button:first').button({
				icons: {
					primary: "ui-icon-gear",
					secondary: "ui-icon-triangle-1-s"
				}
			});
			$('.optionsLink a').button({
				icons: {
					primary: "ui-icon-gear",
					secondary: "ui-icon-triangle-1-s"
				}
			}).click(function(){
			
			});
		
		
		
			$( ".options button:first" ).button({
				icons: {
					primary: "ui-icon-gear",
					secondary: "ui-icon-triangle-1-s"
				}
			}).click(function(){
			
			}).next('button').button({
				icons: {
					primary: "ui-icon-gear",
					secondary: "ui-icon-triangle-1-s"
				}
			}).click(function(){
			
			}).next('button').button({
				icons: {
					primary: "ui-icon-gear",
					secondary: "ui-icon-triangle-1-s"
				}
			});	



	
	$('.ListingChoices').click(function(e) {
		var obj=$(this);
		if(!$(this).hasClass('active')){
			var href = $(this).attr('href');
			$('.tabactive').animate({
				width:0,
				height:0
			}, 250, function() {
				$('.tabactive').removeClass('tabactive');
				$('.active').removeClass('active ui-state-hover');
				$(href).animate({
					width:'100%',
					height:'100%'
				}, 250, function() {
					$(href).addClass('tabactive');
					obj.addClass('active ui-state-hover');
				// Animation complete.
				});
			});
		}
		return false;
	});

});