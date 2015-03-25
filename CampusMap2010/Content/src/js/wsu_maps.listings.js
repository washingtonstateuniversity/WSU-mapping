// JavaScript Document
(function($,window) {
	$.wsu_maps.listings = {
		setup_listingsBar:function (){//jObj){
			window._d("setting up 'listingsBar'");
			/* Other after gmap ini */
			$('#selectedPlaceList_btn').off().on('click', function(e){
				e.stopPropagation();
				e.preventDefault();
				
				var btn=$(this);
				$('.gmnoprint[controlheight]:first').css({'margin-left':'21px'});
				
				if( ! $('#selectedPlaceList').is(".active") ){
					
					$('#selectedPlaceList').stop().animate({
						width:$.wsu_maps.defaults.listings.width+"px"
						}, 250, function() {
							btn.addClass("active");
							$('#selectedPlaceList').addClass("active");
							if($('#directions-panel').length){
								$.wsu_maps.listings.setup_Dirscrollbar($('#directions-panel'));
							}
							//$('#selectedPlaceList_area').css({'overflow-y':'auto'});
							//setup_scrollbar($('#listing'));	
							
							//$(window).trigger("resize");
					});
					$('.central_layout.public.central #centralMap').animate({
						'margin-left':$.wsu_maps.defaults.listings.width+'px',
						'width':$('.central_layout.public.central #centralMap').width()-$.wsu_maps.defaults.listings.width
					},250,function() {
					}).addClass("opended");
					//listOffset=190;
					//$(window).trigger("resize");
				}else{
					
					$('#selectedPlaceList').stop().animate({
						width:"0px"
						}, 250, function() {
							btn.removeClass("active");
							$('#selectedPlaceList').removeClass("active");
							$('#selectedPlaceList_area').css({'overflow-y':'hidden'});
							//$(window).trigger("resize");
					});
					$('.central_layout.public.central #centralMap').animate({
						'margin-left':'0px',
						'width':$('.central_layout.public.central #centralMap').width()+$.wsu_maps.defaults.listings.width
					}, 500, function() {
					}).removeClass("opended");
					//$(window).trigger("resize");
					//listOffset=0;
				}
			});
		},
	
		setup_Listscrollbar:function (jObj){
			if(window._defined(jObj)){
				$.wsu_maps.state.apiL=null;
				jObj.removeAttr('height');
				
				jObj.find('.cAssest').removeAttr('style');
				
				jObj.height($('#selectedPlaceList_area').height()-(window._defined(jObj.css("margin-top"))?jObj.css("margin-top").split('px')[0]:0) );
				
				var settings = {
					//showArrows: true
				};
				var pane = jObj;
				pane.jScrollPane(settings);
				$.wsu_maps.state.apiL = pane.data('jsp');
				$.extend($.wsu_maps.state.apiL,{jObj:jObj});
				$.extend($.wsu_maps.state.apiL,{settings:settings});
			}
		},
		setup_Dirscrollbar:function (jObj){
			if(window._defined(jObj)){
				jObj.removeAttr('height');
				jObj.find('.cAssest').removeAttr('style');
				jObj.height($('#selectedPlaceList_area').height()-(window._defined(jObj.css("margin-top"))?jObj.css("margin-top").split('px')[0]:0) );
				
				var settings = {
					//showArrows: true
				};
				var pane = jObj;
				pane.jScrollPane(settings);
				$.wsu_maps.state.apiD = pane.data('jsp');
				$.extend($.wsu_maps.state.apiD,{jObj:jObj});
				$.extend($.wsu_maps.state.apiD,{settings:settings});
			}
		},
		reset_Listscrollbar:function(){
			if($.wsu_maps.state.apiL!==null){
				$.wsu_maps.listings.destroy_Listscrollbar(function(){
					$.wsu_maps.listings.setup_Listscrollbar($('#listing'));
					//apiL.reinitialise();
				});
			}
		},
		reset_Dirscrollbar:function(){
			if($.wsu_maps.state.apiD!==null){
				$.wsu_maps.listings.destroy_Dirscrollbar(function(){
					$.wsu_maps.listings.setup_Dirscrollbar($('#directions-panel'));
					//apiD.reinitialise();
				});
			}
		},
		destroy_Listscrollbar:function (callback){
			if($.wsu_maps.state.apiL!==null && !$.isEmptyObject($.wsu_maps.state.apiL.jObj)){
				$.wsu_maps.state.apiL.destroy();
				$.wsu_maps.state.apiL=null;
			}
			if($.isFunction(callback)){
				callback();
			}
		},
		destroy_Dirscrollbar:function (callback){
			if($.wsu_maps.state.apiD!==null && !$.isEmptyObject($.wsu_maps.state.apiD.jObj)){
				$.wsu_maps.state.apiD.destroy();
				$.wsu_maps.state.apiD=null;
			}
			if($.isFunction(callback)){
				callback();
			}
		},
		reset_listings:function (){
			if(!$('#selectedPlaceList').is($('.ini'))){
				$.wsu_maps.listings.destroy_Dirscrollbar(function(){
					$.wsu_maps.listings.destroy_Listscrollbar(function(){
						$('#selectedPlaceList').width()>0?$('#selectedPlaceList_btn').trigger('click'):null;
						$('#selectedPlaceList').addClass('ini');
						$('#selectedPlaceList_area').html("");
					});
				});
			}
			$('#selectedPlaceList_btn').css('display',"none");
		},
		autoOpenListPanel:function (callback){
			$('#selectedPlaceList').removeClass('ini');
			if(!$('#selectedPlaceList_btn').is(':visible')){
				$('#selectedPlaceList_btn').css({'display':'block'});
				if($('.embeded').length===0){
					$('#selectedPlaceList_btn').trigger('click');
				}
			}
			if(window._defined(callback)){
				callback();
			}
		},
		
		loadListings:function (data,showSum){
			$('#selectedPlaceList').removeClass('ini');
			var listing="";
			if(data.markers.length>17){
				showSum=false;
			}
			$.each( data.markers, function(i, marker) {	
				if(window._defined(marker.info)){
					var sum="";
					
					if(window._defined(marker.summary) && !$.isEmptyObject(marker.summary)){
						sum='<div '+(showSum?'':'style="display:none;"')+'>'+marker.summary+'</div>';
					}
					var p_id = marker.id;
					listing+='<li class="">'+
								'<a href="#" class="" role="'+p_id+'"><span class="place_order">'+(i+1)+'</span>'+marker.title+'</a>'+
								sum+
							'</div>';
					$.wsu_maps.state.hasListing = false;
				}
			});
			if($('#selectedPlaceList_area #listing').length===0){
				$('#selectedPlaceList_area').append('<div id="listing" class="cAssest">');
			}
			$.wsu_maps.listings.destroy_Listscrollbar();
			$.wsu_maps.listings.listTabs("locations");
			
			$('#selectedPlaceList_area #listing').html('<ul class="cAssest">'+listing+'</ul>');
			$.wsu_maps.listings.setup_Listscrollbar($('#listing'));
		
			
			
			
			
			
			$.each($('#selectedPlaceList_area #listing a'),function(i){//,v){
				var btn=$(this);
				btn.off().on('click',function(e){
					e.stopPropagation();
					e.preventDefault();
					if(!btn.is('active') && !btn.next('div').is(':visible')){// changed hasClass for is for speed
						//$('#selectedPlaceList_area .active').next('div').toggle('showOrHide');
						$('#selectedPlaceList_area .active').removeClass('active');
						//btn.next('div').toggle('showOrHide');
						btn.addClass('active');
					}
					$.each($.wsu_maps.state.ib, function(i){//,v) {
						if(window._defined($.wsu_maps.state.ib[i]) && $.wsu_maps.state.ib[i].opened === true){
							$.wsu_maps.state.ib[i].close();
						}
					});
					//var pid = btn.attr("role");
					$.wsu_maps.state.ib[i].open($.wsu_maps.state.map_inst, $.wsu_maps.state.markerLog[i]);
					if(window._defined($.jtrack)){
						//$.jtrack.trackEvent(pageTracker,"infowindow via place list", "opened",btn.text());
					}
					$.wsu_maps.state.cur_mid = $.wsu_maps.state.mid[i];
				});
			});
			google.maps.event.addListener($.wsu_maps.state.map_inst, 'zoom_changed',function(){
					$('#selectedPlaceList_area .active').trigger('click');
				});
			
			
		},
		listTabs:function (prime){
			
			if($('#selectedPlaceList_area #listing').length>0 && $('#selectedPlaceList_area #directions-panel').length>0){
				if($('#selectedPlaceList_area #option').length===0){
					$('#selectedPlaceList_area').prepend('<ul id="option">');
				}
		
				if($('#selectedPlaceList_area #listing').length>0 && $('#selectedPlaceList_area #option #locations').length===0){
					$('#selectedPlaceList_area #option').append('<li id="locations">Locations</li>');
				}
				if($('#selectedPlaceList_area #directions-panel').length>0 && $('#selectedPlaceList_area #option #directions').length===0){
					$('#selectedPlaceList_area #option').append('<li id="directions">Directions</li>');
				}
				
				if($('#selectedPlaceList_area #option li').length>1){
					$('#selectedPlaceList_area #option li:first').addClass('DIVIT');	
				}else{
					$('#option .DIVIT').removeClass('DIVIT');	
				}
				if($('#option .active').length){
					$('#option .active').removeClass('active');
				}
				
				$('#locations').off().on('click',function(){
					$('#option .active').removeClass('active');
					$('#listing').show();
					$('#directions-panel').hide();
					$('#locations').addClass('active');
				});
				$('#directions').off().on('click',function(){
					$('#option .active').removeClass('active');
					$('#listing').hide();
					$('#directions-panel').show();
					$('#directions').addClass('active');
		
				});
				if(window._defined(prime) && prime!=null){
					if(prime==="locations"){
						$('#locations').trigger('click');
					}
					if(prime==="directions"){
						$('#directions').trigger('click');
					}
				}
			}else{
				if($('#selectedPlaceList_area #option').length>0){
					$('#selectedPlaceList_area #option').remove();
				}
			}
		
		},
		reset_listingarea:function (){
			$.wsu_maps.listings.destroy_Listscrollbar(function(){
				/* this may need to be restored
				$('#selectedPlaceList').width()>0?$('#selectedPlaceList_btn').trigger('click'):null;
				$('#selectedPlaceList').addClass('ini');
				$('#selectedPlaceList_area').html("");*/
				
				$('#listing').remove();
				$('#option').remove();
				
			});
		},		
	};	
})(jQuery,window);