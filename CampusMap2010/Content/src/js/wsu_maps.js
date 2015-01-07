// JavaScript Document
/*
* globals from the page, inline
*/
var siteroot=siteroot||"";
var view=view||"";
var mcv_action=mcv_action||"";
var campus=campus||"";
var campus_latlng_str=campus_latlng_str||"";

/* think these should be removed at some point when cleared */
var styles=styles||{};


/* seed it */
(function($) {
	$.wsu_maps={
		is_frontend:true,
		state:{
			mapInst:null,
			
			ib:[],
			ibh:[],
			ibHover:false,
			ibOpen:false,
			reopen:false,
				
			markerLog:[],
			markerbyid:[],
			mid:[],
			shapes:[],
			listOffset:0,
			
			currentControl:"ROADMAP",
		
			siteroot:siteroot||"",
			view:view||"",
			mcv_action:mcv_action||"",
			campus:campus||"",
			campus_latlng_str:campus_latlng_str||"",
				
			cTo:"",
			cFrom:"",
			hasDirection:false,
			mapview:"central",
			
			cur_nav:"",
			cur_mid:0,
			hasListing:false,
			hasDirections:false,
		
			
			api:null,
			apiL:null,
			apiD:null,
			api_nav:null,
		
			//sensor:false,
			//lang:'',
			//vbtimer:null,
		
		},	
		ini:function (options){
			$.wsu_maps.ready(options||{});
		},
		ready:function (options){
			$.wsu_maps.state.currentLocation=$.wsu_maps.state.siteroot+$.wsu_maps.state.mapview;
			$(document).ready(function() {
				var page,location;
				
				$.wsu_maps[$.wsu_maps.is_frontend?"frontend":"admin"].ini();
				
				location=window.location.pathname;
				page=location.substring(location.lastIndexOf("/") + 1);
				page=page.substring(0,page.lastIndexOf("."));
				if(typeof($.wsu_maps[page])!=="undefined"){
					$.wsu_maps[page].ini();
				}
				
				return options;
			});
		},
		resizeBg:function(obj,height,width) {
			obj.height($(window).height()-height);
			if(typeof(width)!=="undefined"&&width>0){
				obj.width($(window).width()-width);
			}
		},
		iniMap:function (url,callback){
			var padder = 130;
			if($('.layoutfree').lenght){
				padder = 0;
			}
			var winH = $(window).height()-padder;
			var winW = $(window).width();
			var zoom = 15;
			if(winW>=500 && winH>=200){zoom = 14;}
			if(winW>=700 && winH>=400){zoom = 15;}
			if(winW>=900 && winH>=600){zoom = 16;}
			//var _load = false;
			url='http://images.wsu.edu/javascripts/campus_map_configs/pick.asp';			
			//$.getJSON(url+'?callback=?'+(_load!=false?'&loading='+_load:''), function(data) {
				var data = {};
				var map_op = {};
				if( $.isEmptyObject( data.mapOptions )){
					map_op = {'center': $.wsu_maps.state.campus_latlng_str , 'zoom':zoom };
				}else{
					map_op = data.mapOptions;
					if(winW>=500 && winH>=300){map_op.zoom = map_op.zoom;}
					if(winW>=700 && winH>=500){map_op.zoom = map_op.zoom+1;}
					if(winW>=900 && winH>=700){map_op.zoom = map_op.zoom;}
				}
				styles={};
				map_op = $.extend(map_op,{"mapTypeControl":false,"panControl":false});
				if($('.layoutfree').length){
					styles={
						zoom:17
					};
				}
				/*,
				styles:[{
				featureType:"poi",
				elementType:"labels",
				stylers:[{
					visibility:"off"
				}]
				}]*/
						
				map_op=$.extend(map_op,styles);
				if($('#runningOptions').length){
					if($('#runningOptions').html()==="{}"||$('#runningOptions').html()===""){
				
					}else{
						//map_op= {}
						$('#runningOptions').html($('#runningOptions').html().replace(/(\"mapTypeId\":"\w+",)/g,''));
						var jsonStr = $('#runningOptions').html();
						//var mapType = jsonStr.replace(/.*?(\"mapTypeId\":"(\w+)".*$)/g,"$2");
						jsonStr = jsonStr.replace(/("\w+":\"\",)/g,'').replace(/(\"mapTypeId\":"\w+",)/g,'');
						//$.extend(map_op,base,$.parseJSON(jsonStr));
						//map_op = $.parseJSON(jsonStr);
						//$(this).val().replace(/[^a-zA-Z0-9-_]/g, '-'); 
						//alert(dump(map_op));
					}
				}
				$('#centralMap').gmap(map_op).bind('init', function() { 
					$.wsu_maps.ini_GAtracking('UA-22127038-5');
					$.wsu_maps.poi_setup($('#centralMap'));
					$.wsu_maps.addCentralControlls();
					if(typeof(data)!=='undefined'){
						$.wsu_maps.general.loadData($('#centralMap'),data);
					}
					if($('.mobile').length){
						$.wsu_maps.geoLocate();
					}
					callback();
					$(window).trigger('resize');
					$('.gmnoprint[controlheight]:first').css({'margin-left':'21px'});
					/* addthis setup */
					$.wsu_maps.ini_addthis("mcwsu");
				});
			//});
		},
		updateMap:function (jObj,_load,showSum,callback){
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
	},

		addCentralControlls:function (){
			if($('.mapControl').length===0){
				// Set CSS for the control border.
				var controlText,controlUI;
				controlUI = document.createElement('div');
				
				controlUI.title = 'Click Get Aerial photos';
				controlUI.className = 'mapControl TOP';
				
				
				if(!$('.embeded').length && $.wsu_maps.state.campus==="Pullman"){
					// Set CSS for the control interior.
					controlText = document.createElement('div');
					controlText.className = 'text';
					controlText.innerHTML = 'Aerial Views';
					controlUI.appendChild(controlText);
					$('#centralMap').gmap("addControl", controlUI, google.maps.ControlPosition.RIGHT_TOP);
					google.maps.event.addDomListener(controlUI, 'click', function() {
						$('.mapControl').removeClass('activeControl');
						$(this).addClass('activeControl');
					 //$('#centralMap').gmap("setOptions",{'mapTypeId':google.maps.MapTypeId.ROADMAP});
						$('[rel="aerial_gouped"]').colorbox({
							photo:true,
							scrolling:false,
							scalePhotos:true,
							opacity:0.7,
							maxWidth:"75%",
							maxHeight:"75%",
							transition:"none",
							slideshow:true,
							slideshowAuto:false,
							open:true,
							current:"<span id='cur'>{current}</span><span id='ttl'>{total}</span>",
							onClosed:function(){
								$('.activeControl').removeClass('activeControl');
								$('#'+$.wsu_maps.state.currentControl).addClass('activeControl');
								//$('#'+currentControl).trigger('click');
								//$('#centralMap').gmap("setOptions",{'mapTypeId':currentControl.toLowerCase()});
							},
							onComplete:function(){
								if($('#colorbox #cb_nav').length){
									$('#colorbox #cb_nav').html("");
								}
								if($('#ttl').length){
									var t=parseInt($('#ttl').text(), 10);
									var li="";
									if(t>1){
										for(var j=0; j<t; j++){
											li+="<li><a href='#'></a></li>";
										}
										if($('#colorbox #cb_nav').length===0){
											$('#cboxCurrent').after('<ul id="cb_nav">'+li+'</ul>');
										}else{
											$('#colorbox #cb_nav').html(li);
										}
									}
									if($('#colorbox #cb_nav').length){
										$('#colorbox #cb_nav .active').removeClass('active');
										$('#colorbox #cb_nav').find('li:eq('+ ( parseInt($('#cboxCurrent #cur').text(), 10) -1) +')').addClass('active');
									}
								}
							}
						});
					});
				}
			
			
				// Set CSS for the control border.
				controlUI = document.createElement('div');
			
				controlUI.title = 'Switch map to Roadmap';
				controlUI.className = 'mapControl TYPE activeControl';
				controlUI.id="ROADMAP";
				
				// Set CSS for the control interior.
				controlText = document.createElement('div');
				controlText.className = 'text';
				controlText.innerHTML = 'Map';
				controlUI.appendChild(controlText);
				$('#centralMap').gmap("addControl", controlUI, google.maps.ControlPosition.RIGHT_TOP);
				google.maps.event.addDomListener(controlUI, 'click', function() {
					$('.mapControl').removeClass('activeControl');
					$(this).addClass('activeControl');
					$('#centralMap').gmap("setOptions",{'mapTypeId':google.maps.MapTypeId.ROADMAP});
					$.wsu_maps.state.currentControl="ROADMAP";
				});
				
				
				
			
				// Set CSS for the control border.
				controlUI = document.createElement('div');
				controlUI.title = 'Switch map to Satellite';
				controlUI.className = 'mapControl';
				controlUI.id="SATELLITE";
				
				// Set CSS for the control interior.
				controlText = document.createElement('div');
				controlText.className = 'text';
				controlText.innerHTML = 'Satellite';
				controlUI.appendChild(controlText);
				$('#centralMap').gmap("addControl", controlUI, google.maps.ControlPosition.RIGHT_TOP);
				google.maps.event.addDomListener(controlUI, 'click', function() {
					$('.mapControl').removeClass('activeControl');
					$(this).addClass('activeControl');
					$('#centralMap').gmap("setOptions",{'mapTypeId':google.maps.MapTypeId.SATELLITE});
					$.wsu_maps.state.currentControl="SATELLITE";
				});
				
				
				
					
			
				// Set CSS for the control border.
				controlUI = document.createElement('div');
				controlUI.title = 'Switch map to Hybrid (satellite + roadmap)';
				controlUI.className = 'mapControl';
				controlUI.id="HYBRID";
				
				// Set CSS for the control interior.
				controlText = document.createElement('div');
				controlText.className = 'text';
				
				controlText.innerHTML = 'Hybrid';
				controlUI.appendChild(controlText);
				$('#centralMap').gmap("addControl", controlUI, google.maps.ControlPosition.RIGHT_TOP);
				google.maps.event.addDomListener(controlUI, 'click', function() {
					$('.mapControl').removeClass('activeControl');
					$(this).addClass('activeControl');
					$('#centralMap').gmap("setOptions",{'mapTypeId':google.maps.MapTypeId.HYBRID});
					$.wsu_maps.state.currentControl="HYBRID";
				});
			}
			/**/
		},
	
	
		getSignlePlace:function (jObj,id){
			var url=$.wsu_maps.state.siteroot+"public/get_place.castle";
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
								$.wsu_maps.state.ib[i].close();
								});
							jObj.gmap('clear','markers');
							jObj.gmap('clear','overlays');
							if(typeof(data)!=='undefined'){
								$.wsu_maps.general.loadData(jObj,data,null,function(marker){
									$.wsu_maps.state.ib[0].open(jObj.gmap('get','map'), marker);
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
						$.wsu_maps.state.ib[i].close();
						});
					jObj.gmap('clear','markers');
					jObj.gmap('clear','overlays');
					if(typeof(data)!=='undefined'){
						$.wsu_maps.general.loadData(jObj,data,null,function(marker){
							$.wsu_maps.state.ib[0].open(jObj.gmap('get','map'), marker);
							$.wsu_maps.state.cur_mid = $.wsu_maps.state.mid[0];
						});
					}
					//loadListings(data,true);
					$.wsu_maps.general.prep_html();
					$.wsu_maps.search.last_searched = id;
				});
			}
		},
		/* non-abstract */
		showContextMenu:function(caurrentLatLng  ){
			/* this need to be abstracked out into the jMap plugin */
			function setMenuXY(caurrentLatLng){
				function getCanvasXY(caurrentLatLng){
					var map = $('#centralMap').gmap("get","map");
					var scale = Math.pow(2, map.getZoom());
					var nw = new google.maps.LatLng(
						map.getBounds().getNorthEast().lat(),
						map.getBounds().getSouthWest().lng()
					);
					var worldCoordinateNW = map.getProjection().fromLatLngToPoint(nw);
					var worldCoordinate = map.getProjection().fromLatLngToPoint(caurrentLatLng);
					var caurrentLatLngOffset = new google.maps.Point(
						Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
						Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
					);
					return caurrentLatLngOffset;
				}
				var mapWidth = $('#centralMap').width();
				var mapHeight = $('#centralMap').height();
				var menuWidth = $('.contextmenu').width();
				var menuHeight = $('.contextmenu').height();
				var clickedPosition = getCanvasXY(caurrentLatLng);
				var x = clickedPosition.x ;
				var y = clickedPosition.y ;
				
				if((mapWidth - x ) < menuWidth){
					x = x - menuWidth;
				}
				if((mapHeight - y ) < menuHeight){
					y = y - menuHeight;
				}
				
				$('.contextmenu').css('left',x  );
				$('.contextmenu').css('top',y );
			}
			var map = $('#centralMap').gmap("get","map");
			var projection;
			var contextmenuDir;
			projection = map.getProjection();
			$.wsu_maps.hideContextMenu();
			contextmenuDir = document.createElement("div");
			contextmenuDir.className  = 'contextmenu';
			contextmenuDir.innerHTML = '<a id="from">Directions from here...</a><a id="to">Directions to here...</a>';
			$(map.getDiv()).append(contextmenuDir);
			setMenuXY(caurrentLatLng);
			contextmenuDir.style.visibility = "visible";
			if($.wsu_maps.state.cTo==="" && $.wsu_maps.state.cFrom ===""){
				$.wsu_maps.clearHereToThere();
			}
			
		
			if($.wsu_maps.state.cTo!==""){
				$('.contextmenu #to').addClass('active');
			}
			if($.wsu_maps.state.cFrom!==""){
				$('.contextmenu #from').addClass('active');
			}
			$('.contextmenu #to').on('click',function(){
				$.wsu_maps.state.cTo=caurrentLatLng.lat()+","+caurrentLatLng.lng();
				//alert($.wsu_maps.state.cTo);
				$(this).addClass('active');
				$.wsu_maps.hideContextMenu();
				if($.wsu_maps.state.cTo==="" || $.wsu_maps.state.cFrom ===""){
					return false;
				}
				$.wsu_maps.clearHereToThere();
				$.wsu_maps.hereToThere($('#centralMap'));
			});
			$('.contextmenu #from').click(function(){
				$.wsu_maps.state.cFrom=caurrentLatLng.lat()+","+caurrentLatLng.lng();
				//alert($.wsu_maps.state.cFrom);
				$(this).addClass('active');
				$.wsu_maps.hideContextMenu();
				if($.wsu_maps.state.cTo==="" || $.wsu_maps.state.cFrom ===""){
					return false;
				}
				$.wsu_maps.clearHereToThere();
				$.wsu_maps.hereToThere($('#centralMap'));
			});
		},
		hideContextMenu:function() {
			$('.contextmenu').remove();
		}	,
		setup_directions:function(jObj){
			var kStroke;
			if($('#directionsTo').is(':visible')){
				$('#directionsTo').show();
			}
			$('#directionsFrom input,#directionsTo input').off().on('keyup',function(e){
				e.preventDefault();
				e.stopPropagation();
				if($('#directionsFrom input').val() !==''){
					if($('#directionsTo').css('display')==='none'){
						$('#directionsTo').show();
						$.wsu_maps.nav.reset_Navscrollbar();
					}
					window.clearTimeout(kStroke);
					kStroke=window.setTimeout(function(){
								fireDirections();
							},2000);
							
					if ( e.which === 13 ){
						window.clearTimeout(kStroke);
						fireDirections();
					}
				}			
			});
			function fireDirections(){
				//$('#centralMap').gmap('clear','markers');
				//$('#centralMap').gmap('clear','overlays');
				jObj.gmap('clear','serivces');
				jObj.append('<img src="/Content/images/loading.gif" style="position:absolute; top:50%; left:50%;" id="loading"/>');
				var from=$('#directionsFrom input').val();
				var to=$('#directionsTo input').val();
				if(from!==''){
					if(to==="" || to==="WSU "+$.wsu_maps.state.campus){
						to= $.wsu_maps.state.campus_latlng_str;
					}else{
						jObj.gmap('search',{address:to+' USA'},function(results, status){
							if (status === google.maps.GeocoderStatus.OK) {
								to = results[0].geometry.location;
							} else {
								to = $.wsu_maps.state.campus_latlng_str;
							}
						});
					}
					jObj.gmap('search',{address:from+' USA'},function(results, status){
						if (status === google.maps.GeocoderStatus.OK) {
							from = results[0].geometry.location;
							jObj.gmap('displayDirections',
								{origin:from,destination:to,travelMode: google.maps.DirectionsTravelMode.DRIVING},
								{draggable: true},
								function(results){//, status){
									$.wsu_maps.display_directions(jObj,results);
									if($('#directions_area').length){
										$('#printDir').off().on('click',function(e){
											e.preventDefault();
											e.stopPropagation();
											var map = jObj.gmap('get','map');
											var baseUrl = "http://maps.googleapis.com/maps/api/staticmap?";
											 
											var params = [];
											params.push("sensor=false");
											params.push("size=700x504");
											params.push("center=" + map.getCenter().lat().toFixed(6) + "," + map.getCenter().lng().toFixed(6));
											//params.push("zoom=" + map.getZoom());
		
											var markersArray = [];
											markersArray.push("markers=color:green%7Clabel:A%7C"+results.routes[0].legs[0].start_location.toString().replace(')','').replace('(',''));
											markersArray.push("markers=color:green%7Clabel:B%7C"+results.routes[0].legs[0].end_location.toString().replace(')','').replace('(',''));
											params.push(markersArray.join("&"));
											var path = google.maps.geometry.encoding.decodePath(results.routes[0].overview_polyline.points);   
		
											params.push("path=weight:3%7Ccolor:blue%7Cenc:" + google.maps.geometry.encoding.encodePath(path) );
											baseUrl += params.join("&");
		
											   
											if($("#hide").length===0){
												$('body').append('<div id="hide" ><div id="pArea"></div></div>');
											}
											
											$("#pArea").html($('#directions_area').html()+'<img src="'+baseUrl+'" alt="map" width="700" height="504"/>');
											/*if($.browser.msie){
												$("#pArea").prepend("<style>@media print {#header_bar,#centralMap_wrap,#mainNavArea {display:none;}}</style>");
												window.print();
											}else{
												$("#pArea").jprint();
											}*/
											
											$("#pArea").jprint();
											
										});
										
									}
								});
						} else {
							$.colorbox({
								html:function(){
									return '<div id="errorReporting"><h2>Error</h2><h3>Google couldn\'t pull up the directions, Please try again</h3><h4>Google was having a hard time finding your location for this reason:'+ status +' </h4></div>';
								},
								scrolling:false,
								opacity:0.7,
								transition:"none",
								width:450,
								open:true,
								onComplete:function(){
									$.wsu_maps.general.prep_html();
									$.colorbox.resize();
								}
							});
						}
						$('#loading').remove();
					});
				}
			}
		},
		setup_pdfprints:function (){
			$('#printPdfs').off().on("click",function(e){
				e.stopPropagation();
				e.preventDefault();
				//var trigger=$(this);
				$.colorbox.remove();
				$.colorbox({
					html:function(){
						return '<div id="printPdfs">'+
									'<h2>Printable Maps</h2>'+
									'<div><h3><a href="http://www.parking.wsu.edu/docs/map.pdf" target="_blank">Parking<br/><span id="parking" style="background-image:url('+$.wsu_maps.state.siteroot+'Content/images/print/parking_icon.jpg);"></span></a></h3></div>'+
									'<div><h3><a href="http://map.wsu.edu/pdfs/areamap-10-18-12.pdf" target="_blank">Area<br/><span id="area" style="background-image:url('+$.wsu_maps.state.siteroot+'Content/images/print/area_icon-10-18-12.jpg);"></span></a></h3></div>'+
									'<div class="last"><h3><a href="http://map.wsu.edu/pdfs/washingtonmap.pdf" target="_blank">Washington State<br/><span id="state" style="background-image:url('+$.wsu_maps.state.siteroot+'Content/images/print/state_icon.jpg);"></span></a></h3></div>'+
								'</div>';
					},
					scrolling:false,
					opacity:0.7,
					transition:"none",
					width:710,
					height:350,
					open:true,
					onComplete:function(){
						if($('#colorbox #cb_nav').length){
							$('#colorbox #cb_nav').html("");
						}
						$.each($('#printPdfs a'),function(){
							var self = $(this); 
							self.off().on('click',function(){//e){
								$.jtrack.trackEvent(pageTracker,"pdf", "clicked", self.text());
							});
						});
					}
				});
			});	
		},
	};
	$.wsu_maps.ini();
})(jQuery);