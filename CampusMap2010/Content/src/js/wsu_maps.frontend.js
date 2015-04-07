// JavaScript Document
(function($,window,WSU_MAP) {
	$.extend( WSU_MAP, {
		frontend : {
			defaults:{ },
			ini:function(){
				WSU_MAP.is_frontend = true;
				WSU_MAP.state.map_jObj = $( '#' + WSU_MAP.state.view_id  );
	
				if(WSU_MAP.state.map_jObj.length){
					WSU_MAP.apply_loader();
					if($('.veiw_base_layout').length || WSU_MAP.state.inview ){
						WSU_MAP.views.ini_map_view(WSU_MAP.setup);
					}else{
						WSU_MAP.iniMap("",WSU_MAP.setup);
					}
					if(WSU_MAP.state.map_jObj.length){
						
						$(window).resize(function(){
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
	
							map_obj.height($(window).height()-mHeight);
							map_obj.width($('main').width());
	
							mHeight = $('#header_bar').outerHeight();
							WSU_MAP.responsive.resizeBg($('.cAssest'),mHeight);
						}).trigger("resize");
					}
					$('#directionsTo').hide();
					WSU_MAP.state.map_jObj.find('input[type="text"]').val('');
					WSU_MAP.general.prep_html();
				}
				$('#resetmap').on('click',function(e){
					WSU_MAP.util.nullout_event(e);
					
					WSU_MAP.listings.reset();
					$('#main_nav .active').removeClass('active');
					WSU_MAP.state.map_jObj.find('input[type="text"]').val('');
					if($('#directionsTo').is(':visible')){
						$('#directionsTo').hide();
					}
					//if(window._defined($.jtrack)){
						//$.jtrack.trackEvent(pageTracker,"Map status", "Reset");
					//}
					//google.maps.event.clearListeners(map_jObj.gmap("get","map")); 
					//$('.mapControl').remove();
					WSU_MAP.state.map_jObj.gmap("destroy",function(){//ele){
						WSU_MAP.state.map_jObj.html('');
						$('.mapControl').remove(); 
						if($('.veiw_base_layout').length || WSU_MAP.state.inview ){
							WSU_MAP.views.ini_map_view(WSU_MAP.setup);
						}else{
							WSU_MAP.iniMap("",WSU_MAP.setup);
						}
						$(window).trigger("resize");
					});
				});
			},
		}
	});
})(jQuery,window,jQuery.wsu_maps||(jQuery.wsu_maps={}));