// JavaScript Document
(function($,window,WSU_MAP) {
	$.extend( WSU_MAP, {
		listings : {
			setup_listingsBar:function (){
				window._d("setting up 'listingsBar'");
				/* Other after gmap ini */
				$('#selectedPlaceList_btn').off().on('click', function(e){
					WSU_MAP.util.nullout_event(e);
					
					var btn=$(this);
					$('.gmnoprint[controlheight]:first').css({'margin-left':'21px'});
	
					if($('#directions_area').length===0){
						if($('#directions-panel').length===0){
							$('#selectedPlaceList_area').append('<div id="directions-panel">');
						}
						if($('#directions-panel #output').length===0){
							$('#directions-panel').prepend('<div id="output"><a href="#" id="printDir">Print</a><a href="#" id="emailDir">Email</a></div>');
						}
						$('#directions-panel').append('<div id="directions_area">');
					}	
	
					
								
					if( ! $('#selectedPlaceList').is(".active") ){
						
						$('#selectedPlaceList').stop().animate({
							width:WSU_MAP.defaults.listings.width+"px"
							}, 250, function() {
								btn.addClass("active");
								$('#selectedPlaceList').addClass("active");
								WSU_MAP.listings.setup_Dirscrollbar($('#directions-panel'));
								//$('#selectedPlaceList_area').css({'overflow-y':'auto'});
								//setup_scrollbar($('#listing'));	
								
								//$(window).trigger("resize");
						});
						$('.central_layout.public.central #centralmap').animate({
							'margin-left':WSU_MAP.defaults.listings.width+'px',
							'width':$('.central_layout.public.central #centralmap').width()-WSU_MAP.defaults.listings.width
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
						$('.central_layout.public.central #centralmap').animate({
							'margin-left':'0px',
							'width':$('.central_layout.public.central #centralmap').width()+WSU_MAP.defaults.listings.width
						}, 500, function() {
						}).removeClass("opended");
						//$(window).trigger("resize");
						//listOffset=0;
					}
				});
			},
		
			setup_Listscrollbar:function (jObj){
				if(window._defined(jObj)){
					WSU_MAP.state.apiL=null;
					jObj.removeAttr('height');
					
					jObj.find('.cAssest').removeAttr('style');
					
					jObj.height($('#selectedPlaceList_area').height()-(window._defined(jObj.css("margin-top"))?jObj.css("margin-top").split('px')[0]:0) );
					
					var settings = {
						contentWidth: '0px'
						//showArrows: true
					};
					var pane = jObj;
					pane.jScrollPane(settings);
					WSU_MAP.state.apiL = pane.data('jsp');
					$.extend(WSU_MAP.state.apiL,{jObj:jObj});
					$.extend(WSU_MAP.state.apiL,{settings:settings});
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
					WSU_MAP.state.apiD = pane.data('jsp');
					$.extend(WSU_MAP.state.apiD,{jObj:jObj});
					$.extend(WSU_MAP.state.apiD,{settings:settings});
				}
			},
			
			/* setup */
			/* reset */
			reset_Listscrollbar:function(){
				if(WSU_MAP.state.apiL!==null){
					WSU_MAP.listings.destroy_Listscrollbar(function(){
						WSU_MAP.listings.setup_Listscrollbar($('#listing'));
						//apiL.reinitialise();
					});
				}
			},
			reset_listings:function (){
				if(!$('#selectedPlaceList').is($('.ini'))){
					WSU_MAP.listings.destroy_Dirscrollbar(function(){
						WSU_MAP.listings.destroy_Listscrollbar(function(){
							$('#selectedPlaceList').width()>0?$('#selectedPlaceList_btn').trigger('click'):null;
							$('#selectedPlaceList').addClass('ini');
							$('#selectedPlaceList_area').html("");
						});
					});
				}
				$('#selectedPlaceList_btn').css('display',"none");
				WSU_MAP.listings.reset_Listscrollbar();
			},
			reset_Dirscrollbar:function(){
				if(WSU_MAP.state.apiD!==null){
					WSU_MAP.listings.destroy_Dirscrollbar(function(){
						WSU_MAP.listings.setup_Dirscrollbar($('#directions-panel'));
						//apiD.reinitialise();
					});
				}
			},
			reset:function(){
				WSU_MAP.listings.reset_listings();
				WSU_MAP.listings.reset_Dirscrollbar();
			},
			/* destroy */
			destroy_Listscrollbar:function (callback){
				if(WSU_MAP.state.apiL!==null && !$.isEmptyObject(WSU_MAP.state.apiL.jObj)){
					WSU_MAP.state.apiL.destroy();
					WSU_MAP.state.apiL=null;
				}
				if($.isFunction(callback)){
					callback();
				}
			},
			destroy_Dirscrollbar:function (callback){
				if(WSU_MAP.state.apiD!==null && !$.isEmptyObject(WSU_MAP.state.apiD.jObj)){
					WSU_MAP.state.apiD.destroy();
					WSU_MAP.state.apiD=null;
				}
				if($.isFunction(callback)){
					callback();
				}
			},
			destroy:function(){
				WSU_MAP.listings.destroy_Listscrollbar();
				WSU_MAP.listings.destroy_Dirscrollbar();
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
					if(window._defined(marker.labels)){
						var sum="";
						
						if(window._defined(marker.summary) && !$.isEmptyObject(marker.summary)){
							sum='<div '+(showSum?'':'style="display:none;"')+'>'+marker.summary+'</div>';
						}
						var p_id = marker.id;
						var acro = window._defined(marker.labels.prime_abbrev) && marker.labels.prime_abbrev !== ""  ? " (" +marker.labels.prime_abbrev + ")" : "";
						var title = marker.labels.title + acro;
						listing+='<li class="">'+
									'<a href="#" class="" role="'+p_id+'"><span class="place_order">'+(i+1)+'</span>'+title+'</a>'+
									sum+
								'</div>';
						WSU_MAP.state.hasListing = false;
					}
				});
				if($('#selectedPlaceList_area #listing').length===0){
					$('#selectedPlaceList_area').append('<div id="listing" class="cAssest">');
				}
				WSU_MAP.listings.destroy_Listscrollbar();
				WSU_MAP.listings.listTabs("locations");
				
				$('#selectedPlaceList_area #listing').html('<ul class="cAssest">'+listing+'</ul>');
				WSU_MAP.listings.setup_Listscrollbar($('#listing'));
			
				
				
				
				
				
				$.each($('#selectedPlaceList_area #listing a'),function(i){//,v){
					var btn=$(this);
					btn.off().on('click',function(e){
						WSU_MAP.util.nullout_event(e);
						if(!btn.is('active') && !btn.next('div').is(':visible')){// changed hasClass for is for speed
							//$('#selectedPlaceList_area .active').next('div').toggle('showOrHide');
							$('#selectedPlaceList_area .active').removeClass('active');
							//btn.next('div').toggle('showOrHide');
							btn.addClass('active');
						}
						$.each(WSU_MAP.state.ib, function(i){//,v) {
							if(window._defined(WSU_MAP.state.ib[i]) && WSU_MAP.state.ib[i].opened === true){
								WSU_MAP.state.ib[i].close();
							}
						});
						//var pid = btn.attr("role");
						WSU_MAP.state.ib[i].open(WSU_MAP.state.map_inst, WSU_MAP.state.markerLog[i]);
						if(window._defined($.jtrack)){
							//$.jtrack.trackEvent(pageTracker,"infowindow via place list", "opened",btn.text());
						}
						WSU_MAP.state.cur_mid = WSU_MAP.state.mid[i];
					});
				});
				/*google.maps.event.addListener(WSU_MAP.state.map_inst, 'zoom_changed',function(){
					$('#selectedPlaceList_area .active').trigger('click');
				});*///not sure on why or what this solves...
				
				
			},
			listTabs:function (prime){
				
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
			
			},
			reset_listingarea:function (){
				WSU_MAP.listings.destroy_Listscrollbar(function(){
					/* this may need to be restored
					$('#selectedPlaceList').width()>0?$('#selectedPlaceList_btn').trigger('click'):null;
					$('#selectedPlaceList').addClass('ini');
					$('#selectedPlaceList_area').html("");*/
					
					$('#listing').remove();
					$('#option').remove();
					
				});
			},
		}
	});
})(jQuery,window,jQuery.wsu_maps||(jQuery.wsu_maps={}));