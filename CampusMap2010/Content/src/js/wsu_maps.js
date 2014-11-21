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
	$.wsu_maps.updateMap=function (jObj,_load,showSum,callback){
		if(typeof(_load)==='undefined'){
			_load = false;
		}
		if(typeof(showSum)==='undefined'){
			showSum = false;
		}
		if(typeof(callback)==='undefined'){
			callback = false;
		}
		$.wsu_maps.state.cur_mid = 0;
		$.wsu_maps.state.cur_nav = _load;
		var url="";
		if($.isNumeric(_load)){
			url=$.wsu_maps.state.siteroot+"public/get_place.castle";
		}else{
			url=$.wsu_maps.state.siteroot+"public/get_place_by_category.castle";	
		}
		$.getJSON(url+'?callback=?'+(_load!==false && !$.isNumeric(_load)?'&cat[]='+_load:($.isNumeric(_load)?'&id='+_load:'')), function(data) {
			if(!$.isNumeric(_load)){
				$.wsu_maps.general.autoOpenListPanel();
			}
			var cleanedData = [];
			cleanedData.markers = [];
			if(typeof(data.markers)!=='undefined' &&  !$.isEmptyObject( data.markers )){
				$.each( data.markers, function(i, marker) {
					if($.isNumeric(_load)){
						marker.bounds=true;
					}
					if(typeof(marker.id)==='undefined'){
						delete data.markers[i];
					}else if(typeof(marker.error)!=='undefined'){
						delete data.markers[i]; 
					}else{
						cleanedData.markers.push(data.markers[i]);		
					}
				});
				if(typeof(cleanedData)!=='undefined'){
					$.wsu_maps.general.loadData(jObj,cleanedData,callback);
				}
				$.wsu_maps.general.loadListings(cleanedData,showSum);
			}
			$.wsu_maps.general.prep_html();
		});
	};

})(jQuery);