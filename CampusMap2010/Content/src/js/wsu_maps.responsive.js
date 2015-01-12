// JavaScript Document
(function($) {
	$.wsu_maps.responsive={
		ini:function (options){
			$.wsu_maps.ready(options||{});
		},
		ready:function (options){
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
	$.wsu_maps.ini();
})(jQuery);