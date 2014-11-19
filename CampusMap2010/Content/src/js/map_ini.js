$(function(){
	
	mapInst=$('#centralMap');
	
	$(window).resize(function(){
		if($('.veiw_base_layout.public').length){
			if(mapInst.width()<=320){
				$('html').removeClass('narrow');
				$('html').addClass('mobile');
			}else if(mapInst.width()<=600){
				$('html').addClass('narrow');
				$('html').removeClass('mobile');
			}else{
				$('html').removeClass('narrow');
				$('html').removeClass('mobile');
			}
			$("#campusmap .ui-tabs .ui-tabs-panel .content").width(($('#campusmap .ui-tabs .ui-tabs-panel').width()<400?$('#campusmap .ui-tabs .ui-tabs-panel').width()-35:365)+"px")
		}else{
			if($(window).width()<=320){
				$('html').removeClass('narrow');
				$('html').addClass('mobile');
			}else if($(window).width()<=600){
				$('html').addClass('narrow');
				$('html').removeClass('mobile');
			}else{
				$('html').removeClass('narrow');
				$('html').removeClass('mobile');
			}
		}
	}).trigger("resize");
	var listOffset=0;
	//$(' [placeholder] ').defaultValue();
	if(mapInst.length){
		mapInst.append('<img src="/Content/images/loading.gif" style="position:absolute; top:50%; left:50%;" id="loading"/>');
		if($('.veiw_base_layout').length){
			ini_map_view(mapInst,setup);
		}else{
			iniMap("",setup);
		}
		if(mapInst.length){
							var mHeight = ($(window).height()<=404?0:130);
				if($('.embeded').length)mHeight = 0;
				if($('.layoutfree').length)mHeight = 93;
			$(window).resize(function(){
				//alert( ($('.embeded').length||$('.layoutfree').length) ?0:130 );
				// can't us mapInst here cause it's still in the admin area.  Split that.

				
				$.wsu_maps.resizeBg($('.central_layout.public.central #centralMap'), ( mHeight),($('.embeded').length?0:($(window).width()<=404?0:($(window).width()<=600?155:201))) + $('#selectedPlaceList').width())
			}).trigger("resize");
			$(window).resize(function(){
				// can't us mapInst here cause it's still in the admin area.  Split that.

				
				$('#navwrap').height($('#centralMap_wrap').height()-70);
				$.wsu_maps.resizeBg($('.cAssest'),mHeight);
				
				reset_Dirscrollbar();
				reset_Listscrollbar();
				reset_Navscrollbar();
				//if($('#listing').length)setup_scrollbar($('#listing'));
				
			}).trigger("resize");
		}
		$('#directionsTo').hide();
		$('#campusmap input[type="text"]').val('');
		prep();
	}

	$('#resetmap').on('click',function(e){
		e.stopPropagation();
		e.preventDefault();
		
		reset_listings();
		$('#main_nav').find('.active').removeClass('active');
		$('#campusmap input[type="text"]').val('');
		if($('#directionsTo').is(':visible'))$('#directionsTo').hide();
		if(typeof($.jtrack)!=="undefined")$.jtrack.trackEvent(pageTracker,"Map status", "Reset");
		//google.maps.event.clearListeners(mapInst.gmap("get","map")); 
		//$('.mapControl').remove();
		mapInst.gmap("destroy",function(ele){
			mapInst.html('');
			$('.mapControl').remove(); 
			if($('.veiw_base_layout').length){
				ini_map_view(mapInst,setup);
			}else{
				iniMap("",setup);
			}
			$(window).trigger("resize");
		});

	});
	
});