// JavaScript Document
(function($) {
	var pageTracker = pageTracker||null;
	$.wsu_maps.frontend = {
		ini:function(){
			$.wsu_maps.is_frontend=true;
			$.wsu_maps.state.mapInst=$('#centralMap');
			

			//var listOffset=0;
			//$(' [placeholder] ').defaultValue();
			if($.wsu_maps.state.mapInst.length){
				$.wsu_maps.state.mapInst.append('<img src="/Content/images/loading.gif" style="position:absolute; top:50%; left:50%;" id="loading"/>');
				if($('.veiw_base_layout').length){
					$.wsu_maps.ini_map_view($.wsu_maps.state.mapInst,$.wsu_maps.setup);
				}else{
					$.wsu_maps.iniMap("",$.wsu_maps.setup);
				}
				if($.wsu_maps.state.mapInst.length){
					var mHeight = ($(window).height()<=404?0:43);
					if($('.embeded').length){
						mHeight = 0;
					}
					if($('.layoutfree').length){
						mHeight = 93;
					}
					$(window).resize(function(){
						//alert( ($('.embeded').length||$('.layoutfree').length) ?0:130 );
						// can't us mapInst here cause it's still in the admin area.  Split that.
		
						var map_obj = $('.central_layout.public.central #centralMap');
						var win_w = $(window).width();
						var mWidth = ( $('.embeded').length?0:( win_w<=404?0:(win_w<=600?155:201) ) ) + $('#selectedPlaceList').width();
						$.wsu_maps.responsive.resizeBg(map_obj, mHeight, mWidth);
					}).trigger("resize");
					$(window).resize(function(){
						// can't us mapInst here cause it's still in the admin area.  Split that.
		
						
						$('#navwrap').height($('#centralMap_wrap').height()-70);
						$.wsu_maps.responsive.resizeBg($('.cAssest'),mHeight);
						
						$.wsu_maps.listings.reset_Dirscrollbar();
						$.wsu_maps.listings.reset_Listscrollbar();
						$.wsu_maps.nav.reset_Navscrollbar();
						//if($('#listing').length)setup_scrollbar($('#listing'));
						
					}).trigger("resize");
				}
				$('#directionsTo').hide();
				$('#campusmap input[type="text"]').val('');
				$.wsu_maps.general.prep_html();
			}
			$('#resetmap').on('click',function(e){
				e.stopPropagation();
				e.preventDefault();
				
				$.wsu_maps.listings.reset_listings();
				$('#main_nav').find('.active').removeClass('active');
				$('#campusmap input[type="text"]').val('');
				if($('#directionsTo').is(':visible')){
					$('#directionsTo').hide();
				}
				if(typeof($.jtrack)!=="undefined"){
					//$.jtrack.trackEvent(pageTracker,"Map status", "Reset");
				}
				//google.maps.event.clearListeners(mapInst.gmap("get","map")); 
				//$('.mapControl').remove();
				$.wsu_maps.state.mapInst.gmap("destroy",function(){//ele){
					$.wsu_maps.state.mapInst.html('');
					$('.mapControl').remove(); 
					if($('.veiw_base_layout').length){
						$.wsu_maps.ini_map_view($.wsu_maps.state.mapInst,$.wsu_maps.setup);
					}else{
						$.wsu_maps.iniMap("",$.wsu_maps.setup);
					}
					$(window).trigger("resize");
				});
			});
		},
		defaults:{ },
	};
})(jQuery);