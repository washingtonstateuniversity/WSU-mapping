// JavaScript Document
(function($) {
	$.wsu_maps.places = {
		reloadPlaces:function (){
			var url=$.wsu_maps.state.siteroot+"public/getPlaceJson_byIds.castle";
			var ids;
			
			$.each($('[name="placelist[]"]'),function(){
				ids =(typeof(ids)==="undefined"?'':ids+',')+$(this).val();
			});

			$.wsu_maps.state.map_jObj.gmap('clear','markers');
			if(typeof(ids)!=="undefined"){
				$.getJSON(url+'?callback=?&ids[]='+ids, function(data) {
					$.each($.wsu_maps.state.ib, function(i) {$.wsu_maps.state.ib[i].close();});
					
					
					$.wsu_maps.general.loadData(data,null,function(){//marker){
						//ib[0].open($.wsu_maps.state.map_inst, marker);
						//cur_mid = mid[0];
					});
					$.wsu_maps.general.prep_html();
				});
			}
			//alert('order::'+ids);
		},
	};
})(jQuery);