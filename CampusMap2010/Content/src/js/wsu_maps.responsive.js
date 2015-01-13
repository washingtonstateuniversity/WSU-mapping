// JavaScript Document
(function($) {
	$.wsu_maps.responsive={
		ini:function (options){
			$.wsu_maps.ready(options||{});
		},
		ready:function (options){
			return options;
		},
		set_body_resp_state:function(){
			$(window).resize(function(){
				if($('.veiw_base_layout.public').length){
					if($.wsu_maps.state.mapInst.width()<=320){
						$('html').removeClass('narrow');
						$('html').addClass('mobile');
					}else if($.wsu_maps.state.mapInst.width()<=600){
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
			obj.height($(window).height()-height);
			if(typeof(width)!=="undefined"&&width>0){
				obj.width($(window).width()-width);
			}
		},
		resizeMaxBg:function(obj,height,width) {
			obj.css({"max-height":$(window).height()-height});
			if(typeof(width)!=="undefined"&&width>0){
				obj.css({"max-width":$(window).width()-width});
			}
		},
	};
})(jQuery);