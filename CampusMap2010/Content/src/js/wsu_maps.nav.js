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
				var jObj = WSU_MAP.state.map_jObj;
				WSU_MAP.nav.menuDressChild($(self));
				if(WSU_MAP.state.ib.length>0){
					$.each(WSU_MAP.state.ib, function(i) {
						if( window._defined(WSU_MAP.state.ib[i]) && WSU_MAP.state.ib[i].opened === true){
							WSU_MAP.state.ib[i].close();
						}
					});
				}
				jObj.gmap('clear','markers');
				jObj.gmap('clear','overlays');
				if($(self).is($('.active'))){
					WSU_MAP.nav.setup_Navscrollbar();
					
					if(_url===null){
						url = encodeURI( $(self).find('a:first').attr('href').split('=')[1] );
					}
					WSU_MAP.updateMap(url);
				}else{
					WSU_MAP.listings.reset();
				}
				if(WSU_MAP.nav.onpop===false){
					if(_url===null){
						WSU_MAP.nav.update_history( { url:url } );
					}
				}
			},
			reacton_child:function(self,_url){
				_url = _url || null;
				var url = _url;
				var jObj = WSU_MAP.state.map_jObj;
				WSU_MAP.nav.menuDressChild($(self));
				if(WSU_MAP.state.ib.length>0){
					$.each(WSU_MAP.state.ib, function(i) {
						if( window._defined(WSU_MAP.state.ib[i]) && WSU_MAP.state.ib[i].opened === true){
							WSU_MAP.state.ib[i].close();
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
					WSU_MAP.nav.reset_Navscrollbar();
					
					if(_url===null){
						url = encodeURI(params.substring(0, params.length - 1));
					}
					WSU_MAP.updateMap(url,true);
				}else{
					WSU_MAP.nav.destroy_Navscrollbar(function(){});
					$('*:focus').blur();
					$(self).closest('.parent').find('.parentalLink').trigger('click');
				}
				if(WSU_MAP.nav.onpop===false){
					if(_url===null){
						WSU_MAP.nav.update_history( { url:url } );
					}
				}
			},		
			setup_nav:function (){
				//var jObj = WSU_MAP.state.map_jObj;
				window._d("setting up nav");
				$('#main_nav li.parent:not(".altAction")').off().on('click',function(e){
					WSU_MAP.util.nullout_event(e);
					WSU_MAP.nav.reacton_parent(this);
				});
				$('#main_nav .parent li a').off().on('click',function(e){
					WSU_MAP.util.nullout_event(e);
					WSU_MAP.nav.reacton_child(this);
				});
				if( !WSU_MAP.state.inview ){
					WSU_MAP.nav.listen_for_popstate();
				}
				$(window).on('resize', function(){				
					WSU_MAP.responsive.resizeBg( $('#mainNavArea') );
					WSU_MAP.responsive.resizeMaxMinBg( $('#spine-navigation'), ($('#placeSearch').outerHeight()) + ($('.spine-header').outerHeight()) + ($('.spine-footer').outerHeight()) );
					
					WSU_MAP.listings.reset_Dirscrollbar();
					WSU_MAP.listings.reset_Listscrollbar();
					WSU_MAP.nav.reset_Navscrollbar();
				}).trigger('resize');
			},
			setup_Navscrollbar:function (){
				window._d("setting up nav scrollbar");
				var settings = {
					maintainPosition:true,
					stickToBottom:true,
					contentWidth: '0px'
					//showArrows: true
				};
				var pane = $("#spine-navigation");
				pane.jScrollPane(settings);
				WSU_MAP.state.api_nav = pane.data('jsp');/**/
				if($('#nav').height()>$('#spine-navigation').height()){//@todo i am not 100% this is needed, track back and weed
					$('#spine-navigation').addClass('active');
				}else{
					$('#spine-navigation').removeClass('active');	
				}
			},
			reset_Navscrollbar:function (){
				if(WSU_MAP.state.api_nav!==null){
					window._d("reset nav scrollbar");
					WSU_MAP.nav.destroy_Navscrollbar(function(){
						WSU_MAP.nav.setup_Navscrollbar();
					});
				}
			},
			destroy_Navscrollbar:function (callback){
				window._d("destroying nav scrollbar");
				WSU_MAP.state.api_nav = WSU_MAP.state.api_nav || null;
				if(WSU_MAP.state.api_nav!==null && !$.isEmptyObject(WSU_MAP.state.api_nav.jObj)){
					WSU_MAP.state.api_nav.scrollToY(0);
					WSU_MAP.state.api_nav.destroy();
					WSU_MAP.state.api_nav=null;
					window._d("destroyed nav scrollbar");
				}
				if($.isFunction(callback)){
					callback();
				}
			},
			push_state : function(obj,url){
				window._d("pushing history state");
				window.history.pushState(obj||{}, $(document).find("title").text(), url);
			},
			update_history:function(obj){
				WSU_MAP.getSmUrl("",function(url){
					WSU_MAP.nav.push_state(obj,url);
				});
			},
			listen_for_popstate:function(){
				window.addEventListener('popstate', function(event) {
					WSU_MAP.nav.onpop=true;
					window._d(event.state);
					window._d(event);
					
					$('#main_nav .active').removeClass('active');
					$('#main_nav .checked').removeClass('checked');
					$('#main_nav .childSelected').removeClass('childSelected');
					WSU_MAP.nav.setup_Navscrollbar();
					
					if(event.state === null){
						WSU_MAP.clean_map();
					}else{
						WSU_MAP.nav.setup_Navscrollbar();
						event.state.url = event.state.url || "";
						$.each(event.state.url.split(','), function(idx,val){
							WSU_MAP.nav.reacton_child($('#main_nav .parent li a[href$="'+val+'"]'));
						});	
					}
					WSU_MAP.nav.onpop=false;
				});
			},
			get_current_url:function(){
				
			},
		}
	});
})(jQuery,window,jQuery.wsu_maps||(jQuery.wsu_maps={}));