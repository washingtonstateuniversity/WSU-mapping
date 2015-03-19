// JavaScript Document
(function($) {
	$.wsu_maps.places = {
		getSignlePlace:function (id){
			var url=$.wsu_maps.state.siteroot+"public/get_place.castle";
			var jObj = $.wsu_maps.state.map_jObj;
			$( "#placeSearch input[type=text]" ).autocomplete("close");
			$( "#placeSearch input[type=text]" ).blur();
			var found=false;
			
			if(!$.isNumeric(id) && $.wsu_maps.search.last_searched !== id){
				$.get(url+''+(id!==false?'?id='+id:''), function(data) {
					if(data==="false"){
						$.colorbox({
							html:function(){
								return '<div id="noplace">'+
											'<h2>No matches</h2>'+
											'<div><p>Please try a new search as we are not finding anything for your entry.</p></div>'+
										'</div>';
							},
							width:450,
							scrolling:false,
							opacity:0.7,
							transition:"none",
							open:true,
							onComplete:function(){
								if($('#colorbox #cb_nav').length){
									$('#colorbox #cb_nav').html("");	
								}
							}
						});
					}else{
						found=true;
					}
					
					if(found===true){
						//$.getJSON(url+'?callback=?'+(id!=false?'&id='+id:''), function(data) {
							if(!$('#selectedPlaceList_btn').is(':visible')){
								//$('#selectedPlaceList_btn').css({'display':'block'});
								//$('#selectedPlaceList_btn').trigger('click');
							}
							$.each($.wsu_maps.state.ib, function(i) {
								if( typeof($.wsu_maps.state.ib[i])!=="undefined" && $.wsu_maps.state.ib[i].opened === true){
									$.wsu_maps.state.ib[i].close();
								}
							});
							jObj.gmap('clear','markers');
							jObj.gmap('clear','overlays');
							if(typeof(data)!=='undefined'){
								$.wsu_maps.general.loadData(data,null,function(marker){
									$.wsu_maps.state.ib[0].open($.wsu_maps.state.map_inst, marker);
									$.wsu_maps.state.cur_mid = $.wsu_maps.state.mid[0];
								});
							}
							//loadListings(data,true);
							$.wsu_maps.general.prep_html();
							$.wsu_maps.search.last_searched = id;
						//});
					}
					
				});
			}else if($.wsu_maps.search.last_searched !== id){
				$.getJSON(url+'?callback=?'+(id!==false?'&id='+id:''), function(data) {
					if(!$('#selectedPlaceList_btn').is(':visible')){
						//$('#selectedPlaceList_btn').css({'display':'block'});
						//$('#selectedPlaceList_btn').trigger('click');
					}
					$.each($.wsu_maps.state.ib, function(i) {
						if( typeof($.wsu_maps.state.ib[i])!=="undefined" && $.wsu_maps.state.ib[i].opened === true){
							$.wsu_maps.state.ib[i].close();
						}
					});
					jObj.gmap('clear','markers');
					jObj.gmap('clear','overlays');
					if(typeof(data)!=='undefined'){
						$.wsu_maps.general.loadData(data,null,function(marker){
							$.wsu_maps.state.ib[0].open($.wsu_maps.state.map_inst, marker);
							$.wsu_maps.state.cur_mid = $.wsu_maps.state.mid[0];
						});
					}
					//loadListings(data,true);
					$.wsu_maps.general.prep_html();
					$.wsu_maps.search.last_searched = id;
				});
			}
		},
		reloadPlaces:function (){
			var url=$.wsu_maps.state.siteroot+"public/getPlaceJson_byIds.castle";
			var ids;
			if(typeof(window.embeded_place_ids)!=="undefined"){
				ids =window.embeded_place_ids;
			}else{
				$.each($('[name="placelist[]"]'),function(){
					ids =(typeof(ids)==="undefined"?'':ids+',')+$(this).val();
				});
			}

			$.wsu_maps.state.map_jObj.gmap('clear','markers');
			if(typeof(ids)!=="undefined"){
				$.getJSON(url+'?callback=?&ids[]='+ids, function(data) {
					$.each($.wsu_maps.state.ib, function(i) {
						if( typeof($.wsu_maps.state.ib[i])!=="undefined" && $.wsu_maps.state.ib[i].opened === true){
							$.wsu_maps.state.ib[i].close();
						}
					});
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