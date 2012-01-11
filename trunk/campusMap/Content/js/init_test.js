function resizeBg(obj) {
	obj.height($(window).height()-170);
} 

$(document).ready(function(){
	if($('#map_canvas').length){
		initialize();
		$(window).resize(function(){resizeBg($('#map_canvas'))}).trigger("resize");
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
			
			$('#dialog-form').load('../place/editor.castle',function(){
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


	(function( $ ) {
		$.widget( "ui.combobox", {
			_create: function() {
				var self = this,
					select = this.element.hide(),
					selected = select.children( ":selected" ),
					value = selected.val() ? selected.text() : "";
				var input = this.input = $( "<input>" )
					.insertAfter( select )
					.val( value )
					.autocomplete({
						delay: 0,
						minLength: 0,
						source: function( request, response ) {
							var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
							response( select.children( "option" ).map(function() {
								var text = $( this ).text();
								if ( this.value && ( !request.term || matcher.test(text) ) )
									return {
										label: text.replace(
											new RegExp(
												"(?![^&;]+;)(?!<[^<>]*)(" +
												$.ui.autocomplete.escapeRegex(request.term) +
												")(?![^<>]*>)(?![^&;]+;)", "gi"
											), "<strong>$1</strong>" ),
										value: text,
										option: this
									};
							}) );
						},
						select: function( event, ui ) {
							ui.item.option.selected = true;
							self._trigger( "selected", event, {
								item: ui.item.option
							});
						},
						change: function( event, ui ) {
							if ( !ui.item ) {
								var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( $(this).val() ) + "$", "i" ),
									valid = false;
								select.children( "option" ).each(function() {
									if ( $( this ).text().match( matcher ) ) {
										this.selected = valid = true;
										return false;
									}
								});
								if ( !valid ) {
									// remove invalid value, as it didn't match anything
									$( this ).val( "" );
									select.val( "" );
									input.data( "autocomplete" ).term = "";
									return false;
								}
							}
						}
					})
					.addClass( "ui-widget ui-widget-content ui-corner-left" );

				input.data( "autocomplete" )._renderItem = function( ul, item ) {
					return $( "<li></li>" )
						.data( "item.autocomplete", item )
						.append( "<a>" + item.label + "</a>" )
						.appendTo( ul );
				};

				this.button = $( "<button type='button'>&nbsp;</button>" )
					.attr( "tabIndex", -1 )
					.attr( "title", "Show All Items" )
					.insertAfter( input )
					.button({
						icons: {
							primary: "ui-icon-triangle-1-s"
						},
						text: false
					})
					.removeClass( "ui-corner-all" )
					.addClass( "ui-corner-right ui-button-icon" )
					.click(function() {
						// close if already visible
						if ( input.autocomplete( "widget" ).is( ":visible" ) ) {
							input.autocomplete( "close" );
							return;
						}

						// work around a bug (likely same cause as #5265)
						$( this ).blur();

						// pass empty string as value to search for, displaying all results
						input.autocomplete( "search", "" );
						input.focus();
					});
			},

			destroy: function() {
				this.input.remove();
				this.button.remove();
				this.element.show();
				$.Widget.prototype.destroy.call( this );
			}
		});
	})( jQuery );
	
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