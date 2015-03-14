// JavaScript Document
(function($) {
	var pageTracker=pageTracker||null;
	$.wsu_maps.search={
		focuseitem:{},
		last_searched:0,
		setup_mapsearch:function (){
			/* Search autocomplete */
			//var cur_search = "";
			//var termTemplate = "<strong>%s</strong>";

			var term = "";
			$( "#placeSearch input[type=text]" ).autocomplete({
				source: function( request, response ) {
					term = request.term;
					$.ajax({
						url: $.wsu_maps.state.siteroot+"public/keywordAutoComplete.castle",
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
					$.wsu_maps.search.focuseitem={};
					/**/
				},
				minLength: 2,
				select: function( e, ui ) {
					var id = ui.item.place_id;
					//var term = ui.item.label;
		
					//var url=$.wsu_maps.state.siteroot+"public/get_place.castle";
					if ( e.which !== 13 ){
						if(typeof($.jtrack)!=="undefined"){
							//$.jtrack.trackPageview(pageTracker,url+(id!==""?'?id='+id:'')+(term!==""?'&term='+term:''));
						}
						$.wsu_maps.places.getSignlePlace(id);
					}
					
					$( "#placeSearch input[type=text]" ).autocomplete("close");
				},
				focus: function( event, ui ) {
					$( "#placeSearch [type=text]" ).val( ui.item.label );
					$.wsu_maps.search.focuseitem={
						label:ui.item.label,
						id:ui.item.place_id
					};
					return false;
				},
				open: function(){//e,ui) {
					$('.ui-autocomplete.ui-menu').removeClass( "ui-corner-all" );
				 }
			}).data( "autocomplete" )._renderItem = function( ul, item ) {
				var text =item.label;
				if(item.related==="header"){
					text = "<em>Related search items</em>";
				}else{
					text ="<a>" + text.replace( new RegExp( "(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi" ), "<strong>$1</strong>" )+"</a>";
				}
				return $( "<li></li>" )
					.data( "item.autocomplete", item )
					.append( text )
					.appendTo( ul );
			};
			$( "#placeSearch input[type='text']" ).on('keyup',function(e) {
				if ( e.which === 13){
					var id   = (typeof($.wsu_maps.search.focuseitem.id)!=="undefined"&&$.wsu_maps.search.focuseitem.id!=="")?$.wsu_maps.search.focuseitem.id:$( "#placeSearch .ui-autocomplete-input" ).val();
					//var url=$.wsu_maps.state.siteroot+"public/get_place.castle";
					if(typeof($.jtrack)!=="undefined"){
						//$.jtrack.trackPageview(pageTracker,url+(id!==""?'?id='+id:'')+(term!==""?'&term='+term:''));
					}
					$( "#placeSearch input[type=text]" ).autocomplete("close");
					$.wsu_maps.places.getSignlePlace(id);
					
				}
			});	
			$("#placeSearch input[type='submit']").off().on('click',function(e){
				e.stopPropagation();
				e.preventDefault();
				//var btn=$(this);
				var url = url||"";
				var id   = (typeof($.wsu_maps.search.focuseitem.id)!=="undefined"&&$.wsu_maps.search.focuseitem.id!=="")?$.wsu_maps.search.focuseitem.id:$( "#placeSearch .ui-autocomplete-input" ).val();
				$.wsu_maps.places.getSignlePlace(id);
				if(typeof($.jtrack)!=="undefined"){
					//$.jtrack.trackPageview(pageTracker,url+(id!==""?'?id='+id:'')+(term!==""?'&term='+term:''));
				}
			});
		},
	};
})(jQuery);