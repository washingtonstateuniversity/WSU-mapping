// JavaScript Document
(function($,window,WSU_MAP) {
	$.extend( WSU_MAP, {
		places : {
			getSignlePlace:function (id){
				var url = WSU_MAP.state.siteroot+"public/get_place_obj.castle";
				//var jObj = WSU_MAP.state.map_jObj;
				$( "#placeSearch input[type=text]" ).autocomplete("close").val('').blur();
				var found = false;
				
				if( !$.isNumeric(id) && WSU_MAP.search.last_searched !== id ){
					$.get( url + '' + ( id!=="false" ? '?id='+id: '' ), function(data) {
						if( data==="false "){
							WSU_MAP.util.popup_message({
								html:'<div id="noplace">'+
												'<h2>No matches</h2>'+
												'<div><p>Please try a new search as we are not finding anything for your entry.</p></div>'+
											'</div>',
								maxWidth:$(window).width()*0.85,
								minWidth:$(window).width()*0.2,
								width:450
							});
						}else{
							found=true;
						}
						
						if(found===true){
							//$.getJSON(url+'?callback=?'+(id!=false?'&id='+id:''), function(data) {
								/*if(!$('#selectedPlaceList_btn').is(':visible')){
									//$('#selectedPlaceList_btn').css({'display':'block'});
									//$('#selectedPlaceList_btn').trigger('click');
								}
								$.each(WSU_MAP.state.ib, function(i) {
									if( window._defined(WSU_MAP.state.ib[i]) && WSU_MAP.state.ib[i].opened === true){
										WSU_MAP.state.ib[i].close();
									}
								});
								jObj.gmap('clear','markers');
								jObj.gmap('clear','overlays');*/
								WSU_MAP.clean_map();
								if(window._defined(data)){
									WSU_MAP.general.loadData(data,null,function(marker){
										WSU_MAP.state.ib[0].open(WSU_MAP.state.map_inst, marker);
										WSU_MAP.state.cur_mid = WSU_MAP.state.mid[0];
									});
								}
								//loadListings(data,true);
								WSU_MAP.general.prep_html();
								WSU_MAP.search.last_searched = id;
							//});
						}
						
					});
				}else if(WSU_MAP.search.last_searched !== id){
					$.getJSON(url+'?callback=?'+(id!==false?'&id='+id:''), function(data) {
						/*if(!$('#selectedPlaceList_btn').is(':visible')){
							//$('#selectedPlaceList_btn').css({'display':'block'});
							//$('#selectedPlaceList_btn').trigger('click');
						}
						$.each(WSU_MAP.state.ib, function(i) {
							if( window._defined(WSU_MAP.state.ib[i]) && WSU_MAP.state.ib[i].opened === true){
								WSU_MAP.state.ib[i].close();
							}
						});
						jObj.gmap('clear','markers');
						jObj.gmap('clear','overlays');*/
						WSU_MAP.clean_map();
						if(window._defined(data)){
							WSU_MAP.general.loadData(data,null,function(marker){
								WSU_MAP.state.ib[0].open(WSU_MAP.state.map_inst, marker);
								WSU_MAP.state.cur_mid = WSU_MAP.state.mid[0];
							});
						}
						//loadListings(data,true);
						WSU_MAP.general.prep_html();
						WSU_MAP.search.last_searched = id;
					});
				}
			},
			reloadPlaces:function (){
				window._d("start to reload places");
				var url=WSU_MAP.state.siteroot+"public/get_places.castle";
				var ids;
				if( WSU_MAP.state.embeded_place_ids !== false ){
					ids = WSU_MAP.state.embeded_place_ids;
				}else{
					$.each($('[name="placelist[]"]'),function(){
						ids =(!window._defined(ids)?'':ids+',')+$(this).val();
					});
				}
				
				WSU_MAP.state.map_jObj.gmap('clear','markers');
				WSU_MAP.state.ib=[];
				if(window._defined(ids)){
					window._d(ids);
					if($.trim(ids)!==""){
						$.getJSON(url+'?callback=?&ids[]='+ids, function(data) {
							window._d(data);
							window._d("loaded place obj");
							/*$.each(WSU_MAP.state.ib, function(i) {
								if( window._defined(WSU_MAP.state.ib[i]) && WSU_MAP.state.ib[i].opened === true){
									WSU_MAP.state.ib[i].close();
								}
							});*/
							WSU_MAP.general.loadData(data,null,function(){//marker){
								//ib[0].open(WSU_MAP.state.map_inst, marker);
								//cur_mid = mid[0];
								window._d("applied loaded data");
							});
							WSU_MAP.general.prep_html();
						});
					}
				}
				//alert('order::'+ids);
			},
		}
	});
})(jQuery,window,jQuery.wsu_maps||(jQuery.wsu_maps={}));