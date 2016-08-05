// JavaScript Document
(function($,window,WSU_MAP) {
	$.extend( WSU_MAP, {
		search : {
			focuseitem:{},
			last_searched:0,
			setup_mapsearch:function (){
				/* Search autocomplete */
				//var cur_search = "";
				//var termTemplate = "<strong>%s</strong>";
				window._d("setting up 'mapsearch'");
				var term = "";
				$( "#placeSearch input[type=text]" ).autocomplete({
					source: function( request, response ) {
						term = request.term;
						$.ajax({
							url: WSU_MAP.state.siteroot+"public/keywordAutoComplete.castle",
							dataType: "jsonp",
							data: {
								featureClass: "P",
								style: "full",
								maxRows: 12,
								name_startsWith: request.term
							},
							success: function( data){//, status, xhr  ) {
								var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
								response( $.map( data, function( item ) {
									var text = item.label;
									if ( (item.value && ( !request.term || matcher.test(text)) || item.related === "header" || item.related === "true" ) ){
										return {
											label: item.label,
											value: item.value,
											place_id: item.place_id,
											related: item.related,
										};
									}
								}));
							}
						});
					},
					search: function(){//event, ui) {
						WSU_MAP.search.focuseitem={};
						/**/
					},
					minLength: 2,
					select: function( e, ui ) {
						var id  =parseInt(ui.item.place_id);
						//var term = ui.item.label;
			
						//var url=WSU_MAP.state.siteroot+"public/get_place.castle";
						if ( e.which !== 13 ){
							if(window._defined($.jtrack)){
								//$.jtrack.trackPageview(pageTracker,url+(id!==""?'?id='+id:'')+(term!==""?'&term='+term:''));
							}
							WSU_MAP.places.getSinglePlace(id);
						}
						
						$( "#placeSearch input[type=text]" ).autocomplete("close");
					},
					autocompleteselect:function(e, ui) {
						var id = ui.item.place_id;
						WSU_MAP.places.getSinglePlace(id);
					},
					focus: function( event, ui ) {
						//$( "#placeSearch [type=text]" ).val( ui.item.label );
						WSU_MAP.search.focuseitem={
							label:ui.item.label,
							id:ui.item.place_id
						};
						return false;
					},
					open: function(){//e,ui) {
						$('.ui-autocomplete.ui-menu').removeClass( "ui-corner-all" );
					 }
				}).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
					var text =item.label;
					var related = false;
					if(item.related==="header"){
						related = true;
						text = "<em>Related search items</em>";
					}else{
						text ="<a>" + text.replace( new RegExp( "(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi" ), "<strong>$1</strong>" )+"</a>";
					}
					return $( "<li class='"+(related?"related":"")+"'></li>" )
						.data( "ui-autocomplete-item", item )
						.append( text )
						.appendTo( ul );
				};
				$( "#placeSearch input[type='text']" ).on('keyup',function(e) {
					if ( e.which === 13){
						var id   = (window._defined(WSU_MAP.search.focuseitem.id)&&WSU_MAP.search.focuseitem.id!=="")?WSU_MAP.search.focuseitem.id:$( "#placeSearch .ui-autocomplete-input" ).val();
						//var url=WSU_MAP.state.siteroot+"public/get_place.castle";
						if(window._defined($.jtrack)){
							//$.jtrack.trackPageview(pageTracker,url+(id!==""?'?id='+id:'')+(term!==""?'&term='+term:''));
						}
						$( "#placeSearch input[type=text]" ).autocomplete("close");
						WSU_MAP.places.getSinglePlace(id);
						
					}
				});	
				$("#placeSearch input[type='submit']").off().on('click',function(e){
					WSU_MAP.util.nullout_event(e);
					//var btn=$(this);
					var url = url||"";
					var id   = (window._defined(WSU_MAP.search.focuseitem.id)&&WSU_MAP.search.focuseitem.id!=="")?WSU_MAP.search.focuseitem.id:$( "#placeSearch .ui-autocomplete-input" ).val();
					WSU_MAP.places.getSinglePlace(id);
					if(window._defined($.jtrack)){
						//$.jtrack.trackPageview(pageTracker,url+(id!==""?'?id='+id:'')+(term!==""?'&term='+term:''));
					}
				});
			},
		}
	});
})(jQuery,window,jQuery.wsu_maps||(jQuery.wsu_maps={}));