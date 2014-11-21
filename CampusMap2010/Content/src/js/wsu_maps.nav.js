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
		setup_nav:function (jObj){
			$('#main_nav li.parent:not(".altAction")').off().on('click',function(e){
				e.stopPropagation();
				e.preventDefault();
				$.wsu_maps.nav.menuDressChild($(this));
				if($.wsu_maps.state.ib.length>0){
					$.each($.wsu_maps.state.ib, function(i) {$.wsu_maps.state.ib[i].close();});
				}
				jObj.gmap('clear','markers');
				jObj.gmap('clear','overlays');
				if($(this).is($('.active'))){
					$.wsu_maps.nav.setup_Navscrollbar();
					updateMap(jObj,encodeURI($(this).find('a:first').attr('href').split('=')[1]));
				}else{
					if($('#directions-panel').length){
						$('#directions').trigger('click');
						reset_listingarea();
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
					$.each($.wsu_maps.state.ib, function(i) {$.wsu_maps.state.ib[i].close();});
				}
				jObj.gmap('clear','markers');
				jObj.gmap('clear','overlays');
				var params='';
				if($('li.checked a').length){
					$.each($('li.checked a'),function(){
						params=params+$(this).attr('href').split('=')[1]+',';
					});
					$.wsu_maps.nav.reset_Navscrollbar();
					
					updateMap(jObj,encodeURI(params.substring(0, params.length - 1)),true);
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
	
})(jQuery);