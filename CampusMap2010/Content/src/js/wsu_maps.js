// JavaScript Document
(function($) {
	$.wsu_maps={};		
	$.wsu_maps.ini=	function (){//options){
		return '';//$.wsu_maps.ready(options);
	};

	$.wsu_maps.resizeBg=function(obj,height,width) {
		obj.height($(window).height()-height);
		if(typeof(width)!=="undefined"&&width>0){
			obj.width($(window).width()-width);
		}
	};

})(jQuery);