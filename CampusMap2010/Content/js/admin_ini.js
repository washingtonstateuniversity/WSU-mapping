
	
$(document).ready(function(){
	if($('.admin.view._editor').length){
		load_view_editor();
		ed = true;
	 }		
	if($('#geometrics_drawing_map').length){
		load_geometrics_editor();
		ed = true;
	 }	
	if($('.admin.place._editor').length){
		load_place_editor();
		tinyResize();
		ed = true;
	 }	
	if($('#style_map').length){
		load_style_editor();
		ed = true;
	}	
	if($('#map_canvas').length){
		initialize();
		if($('.home #map_canvas').length){$(window).resize(function(){resizeBg($('#map_canvas'),170)}).trigger("resize");}
		ed = true;
	}
	

	
	
	
	
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


	$('.ListingChoices').on('click',function(e) {
		var obj=$(this);
		if(!$(this).is('active')){// changed hasClass for is for speed
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
					$.cookie('tabedArea', href, {expires: 1, path: '/'+view+mcv_action+'.castle' });
					history.replaceState(null, null,  href);
				});
			});
		}
		return false;
	});
	var returnArea = $.cookie('tabedArea');
	var hash = window.location.hash;
	if(returnArea!=="undefined" || $("[href='#"+hash+"']").length){
		href=returnArea;
		if($("[href='#"+hash+"']").length){
			href=hash;
			//$.cookie('tabedArea', href, {expires: 1, path: '/'+view+mcv_action+'.castle' });
		}
		$("[href='"+href+"']").trigger('click');
	}
});