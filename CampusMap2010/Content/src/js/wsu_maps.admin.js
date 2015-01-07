// JavaScript Document
(function($) {
	$.wsu_maps.admin = {
		ini:function(){
			$.wsu_maps.is_frontend=false;
			var ed=ed||false;
			if($('.admin.view._editor').length){
				$.wsu_maps.admin.view.load_editor();
				ed = true;
			 }		
			if($('#geometrics_drawing_map').length){
				$.wsu_maps.admin.geometrics.load_editor();
				ed = true;
			 }	
			if($('.admin.place._editor').length){
				$.wsu_maps.admin.place.load_editor();
				$.wsu_maps.admin.ui.tinymce.tinyResize();
				ed = true;
			 }	
			if($('#style_map').length){
				$.wsu_maps.admin.style.load_editor();
				ed = true;
			}	
			if($('#map_canvas').length){
				$.wsu_maps.initialize();
				if($('.home #map_canvas').length){
					$(window).resize(function(){
						$.wsu_maps.resizeBg($('#map_canvas'),170);
					}).trigger("resize");
				}
				ed = true;
			}

			var cache = {},lastXhr;
			$( "#tags" ).bind( "keydown", function( event ) {
				if ( event.keyCode === $.ui.keyCode.TAB &&
						$( this ).data( "autocomplete" ).menu.active ) {
					event.preventDefault();
				}
			}).autocomplete({
				minLength: 0,
				source: function( request, response ) {
					// delegate back to autocomplete, but extract the last term
					/*response( $.ui.autocomplete.filter(
						availableTags, $.wsu_maps.util.extractLast( request.term ) ) );*/
						var term = request.term;
						if ( term in cache ) {
							response( cache[ term ] );
							return;
						}
			
						lastXhr = $.getJSON( $.wsu_maps.defaults.DOMAIN+"/public/get_pace_type.castle", request, function( data, status, xhr ) {
							cache[ term ] = data;
							if ( xhr === lastXhr ) {
								response( $.ui.autocomplete.filter(
								data, $.wsu_maps.util.extractLast( request.term ) ) );
							}
						});
				},
				focus: function() {
					// prevent value inserted on focus
					return false;
				},
				select: function( event, ui ) {
					var terms = $.wsu_maps.util.split( this.value );
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
			
			
			
			
			/*
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
			*/
			
			$('.ListingChoices').on('click',function(){//e) {
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
							$.cookie('tabedArea', href, {expires: 1, path: '/'+$.wsu_maps.state.view+$.wsu_maps.state.mcv_action+'.castle' });
							window.history.replaceState(null, null,  href);
						});
					});
				}
				return false;
			});
			var returnArea = $.cookie('tabedArea');
			var hash = window.location.hash;
			if(returnArea!=="undefined" || $("[href='#"+hash+"']").length){
				var href=returnArea;
				if($("[href='#"+hash+"']").length){
					href=hash;
					//$.cookie('tabedArea', href, {expires: 1, path: '/'+view+mcv_action+'.castle' });
				}
				$("[href='"+href+"']").trigger('click');
			}
		},
		defaults:{
			place_id:-1,
		},
		removeAlertLoadingSaving:function (){
			$( "#dialog" ).dialog( "close" );
		},
		setup_fixedNav:function (){
			if ($(window).scrollTop()>= 122) {
				$('.admin #adminNav').addClass('fixed');
			}
			$(window).scroll(function (){//event) {
				if ($(this).scrollTop()>= 122) {     
					$('.admin #adminNav').addClass('fixed');
				} else { 
					$('.admin #adminNav').removeClass('fixed');
				}  
			});
			$('.Cancel a').on("click",function(e){
				e.stopPropagation();
				e.preventDefault();
				$("input[value='Cancel']:first").trigger('click');
			});
			$('.Submit a').on("click",function(e){
				e.stopPropagation();
				e.preventDefault();
				$("input[value='Submit']:first").trigger('click');
			});	
			$('.Apply a').on("click",function(e){
				e.stopPropagation();
				e.preventDefault();
				$("input[value='Apply']:first").trigger('click');
			});
		},
		addToggle:function (){
			$('.imageBox').hover(
				function(){
					$(this).find('.imgInfo').fadeIn('slow');
					$(this).find('.DeleteImage').fadeIn('slow');
				},
				function(){
					$(this).find('.imgInfo').fadeOut('fast');
					$(this).find('.DeleteImage').fadeOut('fast');
				}
			);
		},
		alertLoadingSaving:function (mess){
			mess=mess||'Saving . . .';
			if($('dialog').length===0){
				$('body').append('<div id="dialog" style="display:none;"><h3>'+mess+'</h3></div>');
			}
			$( "#dialog" ).dialog({
				position: ['center','top'],
				minHeight:'55px',
				hide: 'slide',
				resizable: false,
				draggable: false,
				close: function(){//event, ui) {
				}
			});
		},
		setup_massTags:function (){
			$('#massTagging').on('click',function(e){
				e.stopPropagation();
				e.preventDefault();
				$('#massTaggingarea').slideToggle();
			});	
		},
	};

})(jQuery);