// JavaScript Document
(function($) {
	$.wsu_maps.nav = {
		menuDressChild:function (jObj){
			if(jObj.is($('.parent'))){
				var self_active = jObj.is($('.active'));
				$('#main_nav .active').removeClass('active');
				$('.checked').removeClass('checked');
				$('.childSelected').removeClass('childSelected');
				if(!self_active){
					jObj.addClass('active');
				}
			}else{
				jObj.closest('li').toggleClass('checked');
				jObj.closest('.parent').addClass('active');
				jObj.closest('.parent').find('.parentalLink').addClass('childSelected');
				jObj.closest('.depth_3').closest('.depth_2.checked').removeClass('checked');
			}
		},
		setup_nav:function (){
			var jObj = $.wsu_maps.state.map_jObj;
			$('#main_nav li.parent:not(".altAction")').off().on('click',function(e){
				e.stopPropagation();
				e.preventDefault();
				$.wsu_maps.nav.menuDressChild($(this));
				if($.wsu_maps.state.ib.length>0){
					$.each($.wsu_maps.state.ib, function(i) {
						if( typeof($.wsu_maps.state.ib[i])!=="undefined" && $.wsu_maps.state.ib[i].opened === true){
							$.wsu_maps.state.ib[i].close();
						}
					});
				}
				jObj.gmap('clear','markers');
				jObj.gmap('clear','overlays');
				if($(this).is($('.active'))){
					$.wsu_maps.nav.setup_Navscrollbar();
					$.wsu_maps.updateMap(encodeURI($(this).find('a:first').attr('href').split('=')[1]));
				}else{
					if($('#directions-panel').length){
						$('#directions').trigger('click');
						$.wsu_maps.general.reset_listingarea();
					}else{
						$.wsu_maps.listings.reset_listings();
					}
					$.wsu_maps.nav.reset_Navscrollbar();
				}
			});
			$('#main_nav .parent li a').off().on('click',function(e){
				e.stopPropagation();
				e.preventDefault();
				$.wsu_maps.nav.menuDressChild($(this));
				if($.wsu_maps.state.ib.length>0){
					$.each($.wsu_maps.state.ib, function(i) {
						if( typeof($.wsu_maps.state.ib[i])!=="undefined" && $.wsu_maps.state.ib[i].opened === true){
							$.wsu_maps.state.ib[i].close();
						}
					});
				}
				jObj.gmap('clear','markers');
				jObj.gmap('clear','overlays');
				var params='';
				if($('li.checked a').length){
					$.each($('li.checked a'),function(){
						params=params+$(this).attr('href').split('=')[1]+',';
					});
					$.wsu_maps.nav.reset_Navscrollbar();
					
					$.wsu_maps.updateMap(encodeURI(params.substring(0, params.length - 1)),true);
				}else{
					$.wsu_maps.nav.destroy_Navscrollbar(function(){});
					$('*:focus').blur();
					$(this).closest('.parent').find('.parentalLink').trigger('click');
				}
			});
			
		},
		setup_Navscrollbar:function (){
			
			var settings = {
				maintainPosition:true,
				stickToBottom:true
				//showArrows: true
			};
			var pane = $("#navwrap");
			pane.jScrollPane(settings);
			$.wsu_maps.state.api_nav = pane.data('jsp');
			if($('#nav').height()>$('#navwrap_outer').height()){
				$('#navwrap_outer').addClass('active');
			}else{
				$('#navwrap_outer').removeClass('active');	
			}
		},
		reset_Navscrollbar:function (){
			if($.wsu_maps.state.api_nav!==null){
				$.wsu_maps.nav.destroy_Navscrollbar(function(){
					$.wsu_maps.nav.setup_Navscrollbar();
				});
			}
		},
		destroy_Navscrollbar:function (callback){
			if($.wsu_maps.state.api_nav!==null && !$.isEmptyObject($.wsu_maps.state.api_nav.jObj)){
				$.wsu_maps.state.api_nav.scrollToY(0);
				$.wsu_maps.state.api_nav.destroy();
				$.wsu_maps.state.api_nav=null;
			}
			if($.isFunction(callback)){
				callback();
			}
		},
	};
	$.wsu_maps.listings = {
		setup_listingsBar:function (){//jObj){
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
			if(typeof(jObj)!=="undefined"){
				$.wsu_maps.state.apiL=null;
				jObj.removeAttr('height');
				
				jObj.find('.cAssest').removeAttr('style');
				
				jObj.height($('#selectedPlaceList_area').height()-(typeof(jObj.css("margin-top"))!=="undefined"?jObj.css("margin-top").split('px')[0]:0) );
				
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
			if(typeof(jObj)!=="undefined"){
				jObj.removeAttr('height');
				jObj.find('.cAssest').removeAttr('style');
				jObj.height($('#selectedPlaceList_area').height()-(typeof(jObj.css("margin-top"))!=="undefined"?jObj.css("margin-top").split('px')[0]:0) );
				
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
	};	
})(jQuery);