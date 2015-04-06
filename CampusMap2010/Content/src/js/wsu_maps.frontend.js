// JavaScript Document
(function($,window) {
	var pageTracker = pageTracker||null;
	$.wsu_maps.frontend = {
		defaults:{ },
		ini:function(){
			$.wsu_maps.is_frontend=true;
			$.wsu_maps.state.map_jObj= $( '#' + $.wsu_maps.state.view_id  );
			

			//var listOffset=0;
			//$(' [placeholder] ').defaultValue();
			if($.wsu_maps.state.map_jObj.length){
				$.wsu_maps.state.map_jObj.append('<img src="'+$.wsu_maps.state.siteroot+'Content/images/loading_icon.svg" id="loading"/>');
				if($('.veiw_base_layout').length || $.wsu_maps.state.inview ){
					$.wsu_maps.views.ini_map_view($.wsu_maps.setup);
				}else{
					$.wsu_maps.iniMap("",$.wsu_maps.setup);
				}
				if($.wsu_maps.state.map_jObj.length){
					
					$(window).resize(function(){
						//alert( ($('.embeded').length||$('.layoutfree').length) ?0:130 );
						// can't us map_jObj here cause it's still in the admin area.  Split that.
						var mHeight = $('#header_bar').outerHeight();//($(window).height()<=404?0:$('#header_bar').outerHeight());
						if($('.embeded').length){
							mHeight = 0;
						}
						if($('.layoutfree').length){
							mHeight = 93;
						}
						
						if($("#spine.shelved").length){
							mHeight = $('.spine-header').outerHeight() + $('#header_bar').outerHeight();
						}
						var map_obj = $('.central_layout.public.central #centralmap');
						//var win_w = $(window).width();
						//var mWidth = $('main').width();//( $('.embeded').length?0:( win_w<=404?0:(win_w<=600?155:201) ) ) + $('#selectedPlaceList').width();
						//$.wsu_maps.responsive.resizeBg(map_obj, mHeight, mWidth);
						
						map_obj.height($(window).height()-mHeight);
						map_obj.width($('main').width());

						// can't us map_jObj here cause it's still in the admin area.  Split that.
						mHeight = $('#header_bar').outerHeight();
						$.wsu_maps.responsive.resizeBg($('.cAssest'),mHeight);
					}).trigger("resize");
				}
				$('#directionsTo').hide();
				$.wsu_maps.state.map_jObj.find('input[type="text"]').val('');
				$.wsu_maps.general.prep_html();
			}
			$('#resetmap').on('click',function(e){
				e.stopPropagation();
				e.preventDefault();
				
				$.wsu_maps.listings.reset_listings();
				$('#main_nav').find('.active').removeClass('active');
				$.wsu_maps.state.map_jObj.find('input[type="text"]').val('');
				if($('#directionsTo').is(':visible')){
					$('#directionsTo').hide();
				}
				//if(window._defined($.jtrack)){
					//$.jtrack.trackEvent(pageTracker,"Map status", "Reset");
				//}
				//google.maps.event.clearListeners(map_jObj.gmap("get","map")); 
				//$('.mapControl').remove();
				$.wsu_maps.state.map_jObj.gmap("destroy",function(){//ele){
					$.wsu_maps.state.map_jObj.html('');
					$('.mapControl').remove(); 
					if($('.veiw_base_layout').length || $.wsu_maps.state.inview ){
						$.wsu_maps.views.ini_map_view($.wsu_maps.setup);
					}else{
						$.wsu_maps.iniMap("",$.wsu_maps.setup);
					}
					$(window).trigger("resize");
				});
			});
		},
		
	};
})(jQuery,window);