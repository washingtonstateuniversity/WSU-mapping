// JavaScript Document
(function($,window,WSU_MAP) {
	$.extend( WSU_MAP, {
		nav: {
			onpop:false,
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
			
			reacton_parent:function(self,_url){
				_url = _url || null;
				var url = _url;
				var jObj = $.wsu_maps.state.map_jObj;
				$.wsu_maps.nav.menuDressChild($(self));
				if($.wsu_maps.state.ib.length>0){
					$.each($.wsu_maps.state.ib, function(i) {
						if( window._defined($.wsu_maps.state.ib[i]) && $.wsu_maps.state.ib[i].opened === true){
							$.wsu_maps.state.ib[i].close();
						}
					});
				}
				jObj.gmap('clear','markers');
				jObj.gmap('clear','overlays');
				if($(self).is($('.active'))){
					$.wsu_maps.nav.setup_Navscrollbar();
					
					if(_url===null){
						url = encodeURI( $(self).find('a:first').attr('href').split('=')[1] );
					}
					$.wsu_maps.updateMap(url);
				}else{
					$.wsu_maps.listings.reset();
				}
				if($.wsu_maps.nav.onpop===false){
					if(_url===null){
						$.wsu_maps.nav.update_history( { url:url } );
					}
				}
			},
			reacton_child:function(self,_url){
				_url = _url || null;
				var url = _url;
				var jObj = $.wsu_maps.state.map_jObj;
				$.wsu_maps.nav.menuDressChild($(self));
				if($.wsu_maps.state.ib.length>0){
					$.each($.wsu_maps.state.ib, function(i) {
						if( window._defined($.wsu_maps.state.ib[i]) && $.wsu_maps.state.ib[i].opened === true){
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
					
					if(_url===null){
						url = encodeURI(params.substring(0, params.length - 1));
					}
					$.wsu_maps.updateMap(url,true);
				}else{
					$.wsu_maps.nav.destroy_Navscrollbar(function(){});
					$('*:focus').blur();
					$(self).closest('.parent').find('.parentalLink').trigger('click');
				}
				if($.wsu_maps.nav.onpop===false){
					if(_url===null){
						$.wsu_maps.nav.update_history( { url:url } );
					}
				}
			},		
			setup_nav:function (){
				//var jObj = $.wsu_maps.state.map_jObj;
				window._d("setting up nav");
				$('#main_nav li.parent:not(".altAction")').off().on('click',function(e){
					$.wsu_maps.util.nullout_event(e);
					$.wsu_maps.nav.reacton_parent(this);
				});
				$('#main_nav .parent li a').off().on('click',function(e){
					$.wsu_maps.util.nullout_event(e);
					$.wsu_maps.nav.reacton_child(this);
				});
				$.wsu_maps.nav.listen_for_popstate();
				$(window).on('resize', function(){				
					$.wsu_maps.responsive.resizeBg( $('#mainNavArea') );
					$.wsu_maps.responsive.resizeMaxMinBg( $('#navwrap'), ($('#nav_head').outerHeight()) + ($('.spine-footer').outerHeight()) );
					
					$.wsu_maps.listings.reset_Dirscrollbar();
					$.wsu_maps.listings.reset_Listscrollbar();
					$.wsu_maps.nav.reset_Navscrollbar();
				}).trigger('resize');
			},
			setup_Navscrollbar:function (){
				var settings = {
					maintainPosition:true,
					stickToBottom:true
					//showArrows: true
				};
				var pane = $("#navwrap");
				pane.jScrollPane(settings);
				$.wsu_maps.state.api_nav = pane.data('jsp');/**/
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
			update_history:function(obj){
				$.wsu_maps.getSmUrl("",function(url){
					window.history.pushState(obj, $(document).find("title").text(), url);
				});
			},
			listen_for_popstate:function(){
				window.addEventListener('popstate', function(event) {
					$.wsu_maps.nav.onpop=true;
					window._d(event.state);
					window._d(event);
					
					$('#main_nav .active').removeClass('active');
					$('#main_nav .checked').removeClass('checked');
					$('#main_nav .childSelected').removeClass('childSelected');
					$.wsu_maps.nav.setup_Navscrollbar();
					
					if(event.state === null){
						$.wsu_maps.clean_map();
					}else{
						$.wsu_maps.nav.setup_Navscrollbar();
						$.each(event.state.url.split(','), function(idx,val){
							$.wsu_maps.nav.reacton_child($('#main_nav .parent li a[href$="'+val+'"]'));
						});	
					}
					$.wsu_maps.nav.onpop=false;
				});
			},
			get_current_url:function(){
				
			},
		}
	});
})(jQuery,window,jQuery.wsu_maps||(jQuery.wsu_maps={}));