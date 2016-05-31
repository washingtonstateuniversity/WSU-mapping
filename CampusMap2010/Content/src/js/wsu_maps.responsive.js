// JavaScript Document
(function($,window,WSU_MAP) {
	$.extend( WSU_MAP, {
		responsive:{
			ini:function (options){
				WSU_MAP.ready(options||{});
			},
			ready:function (options){
				return options;
			},
			set_body_resp_state:function(){
				$(window).resize(function(){
					if($('.view_base_layout.public').length  || WSU_MAP.state.inview ){
						if(WSU_MAP.state.map_jObj.width()<=320){
							$('html').removeClass('narrow');
							$('html').addClass('mobile');
						}else if(WSU_MAP.state.map_jObj.width()<=600){
							$('html').addClass('narrow');
							$('html').removeClass('mobile');
						}else{
							$('html').removeClass('narrow');
							$('html').removeClass('mobile');
						}
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
			},
			resizeBg:function(obj,height,width) {
				height = height || 0;
				obj.height($(window).height()-height);
				if(window._defined(width)&&width>0){
					obj.width($(window).width()-width);
				}
			},
			resizeMaxBg:function(obj,height,width) {
				height = height || 0;
				obj.css({"max-height":$(window).height()-height});
				if(window._defined(width)&&width>0){
					obj.css({"max-width":$(window).width()-width});
				}
			},
			resizeMaxMinBg:function(obj,height,width) {
				height = height || 0;
				height = $(window).height()-height;
				obj.css({ "max-height":height, "min-height":height });
				if(window._defined(width)&&width>0){
					obj.css({"max-width":$(window).width()-width});
				}
			},
		}
	});
})(jQuery,window,jQuery.wsu_maps||(jQuery.wsu_maps={}));