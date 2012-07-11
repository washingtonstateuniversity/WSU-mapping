var ib = [];
var ibh = [];
var markerLog = [];
var shapes = [];

var ibHover = false;



function resizeBg(obj,height,width) {
	obj.height($(window).height()-height);
	if(typeof(width)!=="undefined"&&width>0)obj.width($(window).width()-width);
} 
function geoLocate(){
	if($('.geolocation').length){
		$('#centralMap').gmap("geolocate",true,false,function(mess, pos){
			//$('#centralMap').gmap("make_latlng_str",pos)//alert('hello');
			$('#centralMap').gmap('addMarker', { 
					position: pos,
					icon:"http://localhost:63750/Content/images/map_icons/geolocation_icon.png"
				},function(ops,marker){
				//markerLog[i]=marker;
				//$('#centralMap').gmap('setOptions', {'zIndex':1}, markerLog[i]);
				//if($.isFunction(callback))callback(marker);
			});
		});
	}
}
function iniMap(url,callback){
	var winH = $(window).height()-160;
	var winW = $(window).width();
	var zoom = 15;
	if(winW>=500 && winH>=200){zoom = 13;}
	if(winW>=700 && winH>=400){zoom = 14;}
	if(winW>=900 && winH>=600){zoom = 15;}
	var _load = false;
	var url='http://images.wsu.edu/javascripts/campus_map_configs/pick.asp';			
	$.getJSON(url+'?callback=?'+(_load!=false?'&loading='+_load:''), function(data) {
		if( $.isEmptyObject( data.mapOptions )){
			var map_op = {'center': pullman_str , 'zoom':zoom };
		}else{
			var map_op = data.mapOptions;
			if(winW>=500 && winH>=300){map_op.zoom = map_op.zoom-1;}
			if(winW>=700 && winH>=500){map_op.zoom = map_op.zoom;}
			if(winW>=900 && winH>=700){map_op.zoom = map_op.zoom+1;}
		}
		
		map_op = $.extend(map_op,{"mapTypeControl":false,"panControl":false});
		$('#centralMap').gmap(map_op).bind('init', function() { 
			var map = $('#centralMap').gmap("get","map");
			
			
			
			//google.maps.event.addListener(map, "rightclick",function(event){showContextMenu(event.latLng);});
			google.maps.event.addListener(map, "mouseup",function(event){ 
						hideContextMenu(); 
						setInterval(function(){$('[src="http://maps.gstatic.com/mapfiles/mv/imgs8.png"]').trigger('click'); },50);
 			});
			google.maps.event.addListener(map, "dragstart",function(event){ 
						hideContextMenu(); 
						setInterval(function(){$('[src="http://maps.gstatic.com/mapfiles/mv/imgs8.png"]').trigger('click'); },50);
 			});
			/*google.maps.event.addListener(map, "click",function(event){ 
						hideContextMenu(); 
						$('[src="http://maps.gstatic.com/mapfiles/mv/imgs8.png"]').trigger('click'); 
 			});*/
			google.maps.event.addListener(map, "drag",function(event){ hideContextMenu();$('[src="http://maps.gstatic.com/mapfiles/mv/imgs8.png"]').trigger('click');  });
			addCentralControlls();
			loadData(data);
			geoLocate();
			callback();
			$('.gmnoprint[controlheight]:first').css({'margin-left':'21px'});
		});
	});
}
var currentControl="ROADMAP";
/* non-abstract */
function addCentralControlls(){
	
	// Set CSS for the control border.
	var controlUI = document.createElement('div');

	controlUI.title = 'Click Get Aerial photos';
	controlUI.className = 'mapControl TOP';
	
	// Set CSS for the control interior.
	var controlText = document.createElement('div');
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
					$('#'+currentControl).trigger('click');
				},
				onComplete:function(){
					if($('#colorbox #cb_nav').length)$('#colorbox #cb_nav').html("");	
					if($('#ttl').length){
						var t=parseInt($('#ttl').text());
						var li="";
						if(t>1){
							for(j=0; j<t; j++){
								li+="<li><a href='#'></a></li>";
							}
							if($('#colorbox #cb_nav').length==0){
								$('#cboxCurrent').after('<ul id="cb_nav">'+li+'</ul>');
							}else{
								$('#colorbox #cb_nav').html(li);
							}
						}
						if($('#colorbox #cb_nav').length){
							$('#colorbox #cb_nav .active').removeClass('active');
							$('#colorbox #cb_nav').find('li:eq('+ (parseInt($('#cboxCurrent #cur').text())-1) +')').addClass('active');
						}
					}
				}
			});
	});
	


	// Set CSS for the control border.
	var controlUI = document.createElement('div');

	controlUI.title = 'Switch map to Roadmap';
	controlUI.className = 'mapControl TYPE activeControl';
	controlUI.id="ROADMAP";
	
	// Set CSS for the control interior.
	var controlText = document.createElement('div');
	controlText.className = 'text';
	controlText.innerHTML = 'Map';
	controlUI.appendChild(controlText);
	$('#centralMap').gmap("addControl", controlUI, google.maps.ControlPosition.RIGHT_TOP);
	google.maps.event.addDomListener(controlUI, 'click', function() {
			$('.mapControl').removeClass('activeControl');
			$(this).addClass('activeControl');
		 $('#centralMap').gmap("setOptions",{'mapTypeId':google.maps.MapTypeId.ROADMAP});
		 currentControl="ROADMAP";
	});
	
	
	

	// Set CSS for the control border.
	var controlUI = document.createElement('div');
	controlUI.title = 'Switch map to Satellite';
	controlUI.className = 'mapControl';
	controlUI.id="SATELLITE";
	
	// Set CSS for the control interior.
	var controlText = document.createElement('div');
	controlText.className = 'text';
	controlText.innerHTML = 'Satellite';
	controlUI.appendChild(controlText);
	$('#centralMap').gmap("addControl", controlUI, google.maps.ControlPosition.RIGHT_TOP);
	google.maps.event.addDomListener(controlUI, 'click', function() {
			$('.mapControl').removeClass('activeControl');
			$(this).addClass('activeControl');
		 $('#centralMap').gmap("setOptions",{'mapTypeId':google.maps.MapTypeId.SATELLITE});
		 currentControl="SATELLITE";
	});
	
	
	
		

	// Set CSS for the control border.
	var controlUI = document.createElement('div');
	controlUI.title = 'Switch map to Hybrid (satellite + roadmap)';
	controlUI.className = 'mapControl';
	controlUI.id="HYBRID";
	
	// Set CSS for the control interior.
	var controlText = document.createElement('div');
	controlText.className = 'text';
	
	controlText.innerHTML = 'Hybrid';
	controlUI.appendChild(controlText);
	$('#centralMap').gmap("addControl", controlUI, google.maps.ControlPosition.RIGHT_TOP);
	google.maps.event.addDomListener(controlUI, 'click', function() {
			$('.mapControl').removeClass('activeControl');
			$(this).addClass('activeControl');
		 $('#centralMap').gmap("setOptions",{'mapTypeId':google.maps.MapTypeId.HYBRID});
		 currentControl="HYBRID";
	});
	
	/**/
}

var cTo="";
var cFrom="";
var hasDirection=false;
function clearHereToThere(){
	if(hasDirection){
		hasDirection=false;
		cFrom="";
		cTo="";
		$('#centralMap').gmap('clear','overlays');
		$('#centralMap').gmap('clear','serivces');
	}
}
function hereToThere(){
	if(cTo==""||cFrom =="")return false
	clearHereToThere();
	$('#centralMap').gmap('displayDirections',
		{origin:cFrom,destination:cTo,travelMode: google.maps.DirectionsTravelMode.WALKING},
		{draggable: true},
		function(){
			cFrom="";
			cTo="";
			hasDirection=true;
			$('#loading').remove();
	});
}
function showContextMenu(caurrentLatLng  ){
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
		
		if((mapWidth - x ) < menuWidth)
			x = x - menuWidth;
		if((mapHeight - y ) < menuHeight)
			y = y - menuHeight;
		
		$('.contextmenu').css('left',x  );
		$('.contextmenu').css('top',y );
	};
	var map = $('#centralMap').gmap("get","map");
	var projection;
	var contextmenuDir;
	projection = map.getProjection();
	hideContextMenu();
	contextmenuDir = document.createElement("div");
	contextmenuDir.className  = 'contextmenu';
	contextmenuDir.innerHTML = '<a id="from">Directions from here...</a><a id="to">Directions to here...</a>';
	$(map.getDiv()).append(contextmenuDir);
	setMenuXY(caurrentLatLng);
	contextmenuDir.style.visibility = "visible";
	if(cTo=="" && cFrom ==""){clearHereToThere();}
	

	if(cTo!=""){$('.contextmenu #to').addClass('active');}
	if(cFrom!=""){$('.contextmenu #from').addClass('active');}
	$('.contextmenu #to').click(function(){
		cTo=caurrentLatLng.lat()+","+caurrentLatLng.lng();
		//alert(cTo);
		$(this).addClass('active');
		 hideContextMenu();
		 if(cTo=="" || cFrom =="")return false
		 clearHereToThere();
		 hereToThere();
	});
	$('.contextmenu #from').click(function(){
		cFrom=caurrentLatLng.lat()+","+caurrentLatLng.lng();
		//alert(cFrom);
		$(this).addClass('active');
		 hideContextMenu();
		 if(cTo=="" || cFrom =="")return false
		 clearHereToThere();
		 hereToThere();
	});
}
function hideContextMenu() {
	$('.contextmenu').remove();
}

/* non-abstract */
function updateMap(_load,showSum){
	if(typeof(_load)==='undefined') var _load = false;
	if(typeof(showSum)==='undefined') var showSum = false;
	//var url='http://images.wsu.edu/javascripts/campus_map_configs/pick.asp';	
	var url=siteroot+"public/get_place_by_category.castle";
	$.getJSON(url+'?callback=?'+(_load!=false?'&cat[]='+_load:''), function(data) {
		if(!$('#selectedPlaceList_btn').is(':visible')){
			$('#selectedPlaceList_btn').css({'display':'block'});
			$('#selectedPlaceList_btn').trigger('click');
		}
		var cleanedData = [];
		cleanedData.markers = [];
		if(typeof(data.markers)!=='undefined' &&  !$.isEmptyObject( data.markers )){
			$.each( data.markers, function(i, marker) {
				if(typeof(marker.id)==='undefined'){
					delete data.markers[i];
				}else if(typeof(marker.error)!=='undefined'){
					delete data.markers[i]; 
				}else{
					cleanedData.markers.push(data.markers[i]);		
				}
			});
			loadData(cleanedData);
			loadListings(cleanedData,showSum);
		}
		prep();
	});
	
}
function loadData(data,callback){
	if(typeof(data.shapes)!=='undefined' && !$.isEmptyObject(data.shapes)){
		$.each( data.shapes, function(i, shape) {	
			 var pointHolder = {};
			 if(shape.coords!='' && shape.type=='polyline'){ 
				var pointHolder = {'path' : shape.coords };
			 }
			  if(shape.coords!='' && shape.type=='polygon'){ 
				var pointHolder = {'paths' : shape.coords };
			 }
			 if(!$.isEmptyObject(pointHolder)){
				var ele = $.extend( { 'fillOpacity':.25,'fillColor':'#981e32', 'strokeWeight':0 } , pointHolder );
			 }else{
				var ele = {};
			 }
			$('#centralMap').gmap('addShape',(shape.type[0].toUpperCase() + shape.type.slice(1)), ele);
		});
	}
	if(typeof(data.markers)!=='undefined' &&  !$.isEmptyObject( data.markers )){
		$.each( data.markers, function(i, marker) {
			//alert(dump(marker));
				if($.isArray(marker.info.content)){
					var nav='';
					$.each( marker.info.content, function(j, html) {	
						nav += '	<li class="ui-state-default ui-corner-top '+( j==0 ?'first ui-tabs-selected ui-state-active':'')+'"><a href="#tabs-'+j+'" hideFocus="true">'+html.title+'</a></li>';
					});
					var content='';
					$.each( marker.info.content, function(j, html) {
						content += '<div id="tabs-'+j+'" class="ui-tabs-panel ui-widget-content ui-corner-bottom  '+( j>0 ?' ui-tabs-hide':'')+'"><div class="content '+html.title.replace(' ','_').replace('/','_')+'">'+html.block+'</div></div>';
					});				
				
				}else{
					var nav = '	<li class="ui-state-default ui-corner-top  ui-tabs-selected ui-state-active first"><a href="#tabs-1" hideFocus="true">Overview</a></li>';
					var content='<div id="tabs-" class="ui-tabs-panel ui-widget-content ui-corner-bottom  "><div class="content overview">'+marker.info.content+'</div></div>';
				}
		
				var box='<div id="taby'+i+'" class="ui-tabs ui-widget ui-widget-content ui-corner-all">'+
							'<ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">'+nav+'</ul>'+
							content+
							'<div class="ui-tabs-panel-cap ui-corner-bottom"><span class="arrow"></span></div>'+
						'</div>';
		
				/* so need to remove this and create the class for it */
				var boxText = document.createElement("div");
				boxText.style.cssText = "border: 1px solid black; margin-top: 8px; background: yellow; padding: 5px;";
				boxText.innerHTML = marker.info.content;
		
				var myOptions = {
					alignBottom:true,
					 content: box//boxText
					,disableAutoPan: false
					,maxWidth: 0
					,height:"340px"
					,pixelOffset: new google.maps.Size(-200, -103)
					,zIndex: 99
					,boxStyle: {
					  width: "400px"
					 }
					,closeBoxHTML:"<span class='tabedBox infoClose'></span>"
					,infoBoxClearance: new google.maps.Size(50,50)
					,isHidden: false
					,pane: "floatPane"
					,enableEventPropagation: false
					,onClose:function(){
						ibHover =  false;
						if($('.cWrap .items li').length>1){$('.cWrap .items').cycle('destroy');}
						$('#taby'+i).tabs('destroy').tabs();
					}
					,onOpen:function(){
							ibHover =  true;
							$('#taby'+i).tabs('destroy').tabs();
							if($('.cWrap .items li').length>1){
							$('.cWrap .items').cycle('destroy');
								$('.cWrap .items').cycle({
									fx:     'scrollHorz',
									delay:  -2000,
									pauseOnPagerHover: 1,
									pause:1,
									timeout:0, 
									pager:'.cNav',
									prev:   '.prev',
									next:   '.next', 
									pagerAnchorBuilder: function(idx, slide) { return '<li><a href="#" hidefocus="true">'+idx+'</a></li>';} 
								});/*	*/
							}
							$('a.gouped').off().on('click',function(e){
								e.preventDefault();
								e.stopPropagation();
								$('a.gouped').colorbox({
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
									onComplete:function(){
										if($('#colorbox #cb_nav').length)$('#colorbox #cb_nav').html("");	
										if($('#ttl').length){
											var t=parseInt($('#ttl').text());
											var li="";
											if(t>1){
												for(j=0; j<t; j++){
													li+="<li><a href='#'></a></li>";
												}
												if($('#colorbox #cb_nav').length==0){
													$('#cboxCurrent').after('<ul id="cb_nav">'+li+'</ul>');
												}else{
													$('#colorbox #cb_nav').html(li);
												}
											}
											if($('#colorbox #cb_nav').length){
												$('#colorbox #cb_nav .active').removeClass('active');
												$('#colorbox #cb_nav').find('li:eq('+ (parseInt($('#cboxCurrent #cur').text())-1) +')').addClass('active');
											}
										}
									}
								});
							});
							$('.errorReporting').click(function(e){
										e.stopPropagation();
										e.preventDefault();
										var trigger=$(this);
										$.colorbox({
											html:function(){
												return '<div id="errorReporting"><form action="../public/reportError.castle" method="post">'+
															'<h2>Found an error?</h2>'+
															'<h3>Please provide some information to help us correct this issue.</h3>'+
															'<input type="hidden" value="'+marker.id+'" name="place_id">'+
															'<lable>Name:<br/><input type="text" value="" placeholder="First and Last" name="name"></lable><br/>'+
															'<lable>Email:<br/><input type="text" value="" placeholder="Your email address"  name="email"></lable><br/>'+
															'<lable>Type:<br/><select name="issueType"><option value="">Choose</option><option value="tech">Technical</option><option value="local">Location</option><option value="content">Content</option></select></lable><br/>'+
															'<lable>Describe the issues: <br/>'+
															'<textarea placeholder="Description" name="description"></textarea></lable><br/>'+
															'<br/><input type="Submit" id="errorSubmit" value="Submit"/><br/>'+
														'</from></div>';
											},
											scrolling:false,
											opacity:0.7,
											transition:"none",
											width:450,
											//height:450,
											open:true,
											onComplete:function(){prep();
												if($('#colorbox #cb_nav').length)$('#colorbox #cb_nav').html("");	
												$('#errorReporting [type="Submit"]').off().on('click',function(e){
													e.stopPropagation();
													e.preventDefault();
													$.post($('#errorReporting form').attr('action'), $('#errorReporting form').serialize(),function(){
														$('#errorReporting').html('<h2>Thank you for reporting the error.</h2>'+'');
														$.colorbox.resize();
													});
												});
											}
										});
									});
							var minHeight=0;
							$.each($('#taby'+i+' .ui-tabs-panel'),function() {
								minHeight = Math.max(minHeight, $(this).find('.content').height()); 
							}).css('min-height',minHeight); 
							$('.ui-tabs-panel').hover(function(){
								ib[i].setOptions({enableEventPropagation: true});
								$('#centralMap').gmap('stop_scroll_zoom');
							},function(){
								ib[i].setOptions({enableEventPropagation: false});
								$('#centralMap').gmap('set_scroll_zoom');
							});
							/*var pos = markerLog[i].getPosition();
							var z = $('#centralMap').gmap('get','map').getZoom(); 
							var mH = $('#centralMap').height();
							var latOffset = 0;*/
							ib[i].rePosition();
							prep();
						}
				};
				ib[i] = new InfoBox(myOptions,function(){
					//$('#taby'+i).tabs();
					//alert('tring to tab it, dabnab it, from the INI');
				});
				//end of the bs that is well.. bs of a implamentation
				/* so need to remove this and create the class for it */
				var boxText = document.createElement("div");
				boxText.style.cssText = "border: 1px solid rgb(102, 102, 102); background: none repeat scroll 0% 0% rgb(226, 226, 226); padding: 2px; display: inline-block; font-size: 10px !important; font-weight: normal !important;";
				boxText.innerHTML = "<h3 style='font-weight: normal !important; padding: 0px; margin: 0px;'>"+marker.title+"</h3>";
				var myHoverOptions = {
					alignBottom:true,
					 content: boxText//boxText
					,disableAutoPan: false
					,pixelOffset: new google.maps.Size(15,-15)
					,zIndex: 99
					,boxStyle: {
						minWidth: "250px"
					 }
					,infoBoxClearance: new google.maps.Size(1, 1)
					,isHidden: false
					,pane: "floatPane"
					,boxClass:"hoverbox"
					,enableEventPropagation: false
					,disableAutoPan:true
					,onOpen:function(){}
					
				};
				ibh[i] = new InfoBox(myHoverOptions,function(){});
				if(marker.style.icon){marker.style.icon = marker.style.icon.replace('{$i}',i+1);}
				$('#centralMap').gmap('addMarker', $.extend({ 
						'position': new google.maps.LatLng(marker.position.latitude, marker.position.longitude),
						'z-index':1
					},marker.style),function(ops,marker){
						markerLog[i]=marker;
						$('#centralMap').gmap('setOptions', {'zIndex':1}, markerLog[i]);
						if($.isFunction(callback))callback(marker);
					})
				.click(function() {
						$.each(ib, function(i) {
							ib[i].close();
							$('#centralMap').gmap('setOptions', {'zIndex':1}, markerLog[i]);
						});
						ib[i].open($('#centralMap').gmap('get','map'), this);
						$('#centralMap').gmap('setOptions', {'zIndex':9}, this);
						$('#selectedPlaceList_area .active').removeClass('active');
						$('#selectedPlaceList_area a:eq('+i+')').addClass('active');
						//$('#centralMap').gmap('openInfoWindow', { 'content': marker.info.content }, this); // todo
					})
				.rightclick(function(event){showContextMenu(event.latLng);})
				.mouseover(function(event){
					$.each(ibh, function(i) {ibh[i].close();});
					$('.infoBox').hover( 
						function() { ibHover =  true; }, 
						function() { ibHover =  false;  } 
					); 
					if(ibHover!=true)ibh[i].open($('#centralMap').gmap('get','map'), markerLog[i]);
				})
				.mouseout(function(event){$.each(ibh, function(i) {ibh[i].close();});});
			
		});
		geoLocate();
	}
}
function loadListings(data,showSum){
	var listing="";
	if(data.markers.length>17)showSum=false;
	$.each( data.markers, function(i, marker) {	
		if(typeof(marker.info)!=='undefined'){
			var sum="";
			
			if(typeof(marker.summary)!=='undefined' && !$.isEmptyObject(marker.summary)){
				sum='<div '+(showSum?'':'style="display:none;"')+'>'+marker.summary+'</div>';
			}
	
			listing+='<li class="">'+
						'<a href="#" class=""><img src="'+siteroot+'Content/images/list_numbers/li_'+(i+1)+'.png"/>'+marker.title+'</a>'+
						sum+
					'</div>';
		}
	});
	$('#selectedPlaceList_area').html('<ul>'+listing+'</ul>');
	$.each($('#selectedPlaceList_area a'),function(i,v){
		var btn=$(this);
		btn.live('click',function(e){
			e.stopPropagation();
			e.preventDefault();
			if(!btn.is('active') && !btn.next('div').is(':visible')){// changed hasClass for is for speed
				//$('#selectedPlaceList_area .active').next('div').toggle('showOrHide');
				$('#selectedPlaceList_area .active').removeClass('active');
				//btn.next('div').toggle('showOrHide');
				btn.addClass('active');
			}
			$.each(ib, function(i) {ib[i].close();});
			ib[i].open($('#centralMap').gmap('get','map'), markerLog[i]);
		});
	});
}
/*
*
*
*
**
**
**
**
*
*
*/
function getSignlePlace(id){
	var url=siteroot+"public/get_place.castle";
	$( "#placeSearch [type=text]" ).autocomplete("close");
	var found=false;
	if(!$.isNumeric(id)){
		$.get(url+''+(id!=false?'?id='+id:''), function(data) {
			if(data=="false"){
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
						if($('#colorbox #cb_nav').length)$('#colorbox #cb_nav').html("");	
					}
				});
			}else{
				found=true;
			}
			
			if(found==true){
				$.getJSON(url+'?callback=?'+(id!=false?'&id='+id:''), function(data) {
					if(!$('#selectedPlaceList_btn').is(':visible')){
						$('#selectedPlaceList_btn').css({'display':'block'});
						//$('#selectedPlaceList_btn').trigger('click');
					}
					$.each(ib, function(i) {ib[i].close();});
					$('#centralMap').gmap('clear','markers');
					$('#centralMap').gmap('clear','overlays');
					loadData(data,function(marker){
						ib[0].open($('#centralMap').gmap('get','map'), marker);
					});
					loadListings(data,true);
					prep();
				});
			}
			
		});
	}else{
		$.getJSON(url+'?callback=?'+(id!=false?'&id='+id:''), function(data) {
			if(!$('#selectedPlaceList_btn').is(':visible')){
				$('#selectedPlaceList_btn').css({'display':'block'});
				//$('#selectedPlaceList_btn').trigger('click');
			}
			$.each(ib, function(i) {ib[i].close();});
			$('#centralMap').gmap('clear','markers');
			$('#centralMap').gmap('clear','overlays');
			loadData(data,function(marker){
				ib[0].open($('#centralMap').gmap('get','map'), marker);
			});
			loadListings(data,true);
			prep();
		});
	}

	
}


function prep(){
	$(' [placeholder] ').defaultValue();
	$("a").each(function() {$(this).attr("hideFocus", "true").css("outline", "none");});
}
$(document).ready(function(){
	var listOffset=0;
	$(' [placeholder] ').defaultValue();
	if($('#centralMap').length){
		$('#centralMap').append('<img src="/Content/images/loading.gif" style="position:absolute; top:50%; left:50%;" id="loading"/>');
		iniMap("",function(){
			$('#loading').remove();
			
		});
		if($('#centralMap').length){
			$(window).resize(function(){resizeBg($('.central_layout.public.central #centralMap'),160,($(window).width()<=450?155:201)+listOffset)}).trigger("resize");
			$(window).resize(function(){
				resizeBg($('.cAssest'),160)
				}
			).trigger("resize");
		}
		
		$('#selectedPlaceList_btn').live('click', function(e){
			e.stopPropagation();
			e.preventDefault();
			var btn=$(this);
			$('.gmnoprint[controlheight]:first').css({'margin-left':'21px'});
			if(btn.closest('#selectedPlaceList').width()<=1){
				btn.closest('#selectedPlaceList').stop().animate({
					width:"190px"
					}, 500, function() {
						btn.addClass("active");
						$('#selectedPlaceList_area').css({'overflow-y':'auto'});
						$(window).trigger("resize");
				});
				$('.central_layout.public.central #centralMap').animate({'margin-left':'190px','width':$('.central_layout.public.central #centralMap').width()-190}, 500, function() {}).addClass("opended");
				listOffset=190;
				$(window).trigger("resize");
			}else{
				btn.closest('#selectedPlaceList').stop().animate({
					width:"0px"
					}, 500, function() {
						btn.removeClass("active");
						$('#selectedPlaceList_area').css({'overflow-y':'hidden'});
						$(window).trigger("resize");
				});
				$('.central_layout.public.central #centralMap').animate({'margin-left':'0px','width':$('.central_layout.public.central #centralMap').width()+190}, 500, function() {}).removeClass("opended");
				listOffset=0;
			}
		});
		var kStroke;
		$('#directionsTo').slideToggle();
		$('#directionsFrom input,#directionsTo input').live('keyup',function(){
			if($('#directionsFrom input').val() !=''){
				if($('#directionsTo').css('display')=='none')$('#directionsTo').slideToggle();
			}
			clearTimeout(kStroke);
			kStroke=setTimeout(function(){
				fireDirections();
				},2000);
		});
		function fireDirections(){
			$('#centralMap').gmap('clear','markers');
			$('#centralMap').gmap('clear','overlays');
			$('#centralMap').gmap('clear','serivces');
			$('#centralMap').append('<img src="/Content/images/loading.gif" style="position:absolute; top:50%; left:50%;" id="loading"/>');
			var from=$('#directionsFrom input').val();
			var to=$('#directionsTo input').val();
			if(from!=''){
				if(to=="WSU"){
					to= pullman_str;
				}else{
					$('#centralMap').gmap('search',{address:to+' USA'},function(results, status){
						if (status == google.maps.GeocoderStatus.OK) {
							to = results[0].geometry.location
						} else {
							to = pullman_str;
						}
					});
				}
				$('#centralMap').gmap('search',{address:from+' USA'},function(results, status){
					if (status == google.maps.GeocoderStatus.OK) {
						from = results[0].geometry.location
						$('#centralMap').gmap('displayDirections',
								{origin:from,destination:to,travelMode: google.maps.DirectionsTravelMode.DRIVING},
								{draggable: true},
								function(){
									$('#loading').remove();
								});
					} else {
						alert("Google was having a hard time finding your location, Please try again. \r\n reason: " + status);
					}
				});
			}
		}

		$('#main_nav li.parent:not(".altAction")').live('click',function(e){
			e.stopPropagation();
			e.preventDefault();
			$('#main_nav .active').removeClass('active');
			$('.checked').removeClass('checked');
			$('.childSelected').removeClass('childSelected');
			$(this).addClass('active');
			$.each(ib, function(i) {ib[i].close();});
			$('#centralMap').gmap('clear','markers');
			$('#centralMap').gmap('clear','overlays');
			updateMap(encodeURI($(this).find('a:first').attr('href').split('=')[1]));
		});
		$('#main_nav .parent li a').live('click',function(e){
			e.stopPropagation();
			e.preventDefault();
			$(this).closest('li').toggleClass('checked');
			$(this).closest('.parent').find('.parentalLink').addClass('childSelected');
			$(this).closest('.depth_3').closest('.depth_2.checked').removeClass('checked');
			$.each(ib, function(i) {ib[i].close();});
			$('#centralMap').gmap('clear','markers');
			$('#centralMap').gmap('clear','overlays');
			var params='';
			if($('li.checked a').length){
				$.each($('li.checked a'),function(){
					params=params+$(this).attr('href').split('=')[1]+',';
				});
				updateMap(encodeURI(params.substring(0, params.length - 1)),true);
			}else{
				$(this).closest('.parent').find('.parentalLink').trigger('click');
			}
		});
		
		$('#printPdfs').click(function(e){
			e.stopPropagation();
			e.preventDefault();
			var trigger=$(this);
			$.colorbox({
				html:function(){
					return '<div id="printPdfs">'+
								'<h2>Printable Maps</h2>'+
								'<div><h3><a href="http://www.parking.wsu.edu/utils/File.aspx?fileid=2965" target="_blank">Parking<br/><span id="parking" style="background-image:url('+siteroot+'Content/images/print/parking_icon.jpg);"></span></a></h3></div>'+
								'<div><h3><a href="http://campusmap.wsu.edu/pdfs/areamap0406.pdf" target="_blank">Area<br/><span id="area" style="background-image:url('+siteroot+'Content/images/print/area_icon.jpg);"></span></a></h3></div>'+
								'<div class="last"><h3><a href="http://campusmap.wsu.edu/pdfs/washingtonmap.pdf" target="_blank">Washington State<br/><span id="state" style="background-image:url('+siteroot+'Content/images/print/state_icon.jpg);"></span></a></h3></div>'+
							'</div>';
				},
				scrolling:false,
				opacity:0.7,
				transition:"none",
				width:710,
				height:350,
				open:true,
				onComplete:function(){
					if($('#colorbox #cb_nav').length)$('#colorbox #cb_nav').html("");	
				}
			});
		});
		var cur_search = "";
		var termTemplate = "<strong>%s</strong>";
		$( "#placeSearch [type=text]" ).autocomplete({
			source: function( request, response ) {
				var term = request.term;
				$.ajax({
					url: siteroot+"public/keywordAutoComplete.castle",
					dataType: "jsonp",
					data: {
						featureClass: "P",
						style: "full",
						maxRows: 12,
						name_startsWith: request.term
					},
					success: function( data, status, xhr  ) {
						var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
						response( $.map( data, function( item ) {
							var text = item.label;
							if ( item.value && ( !request.term || matcher.test(text) ) ){
								return {
									label: item.label,
									value: item.value,
									place_id: item.place_id
								}
							}
						}));
					}
				});
			},
			search: function(event, ui) {
				/**/
			},
			minLength: 2,
			select: function( event, ui ) {
				getSignlePlace(ui.item.place_id);
				$( "#placeSearch [type=text]" ).autocomplete("close");
			},
			focus: function( event, ui ) {
				$( "#placeSearch [type=text]" ).val( ui.item.label );
				return false;
			},
			open: function(e,ui) {
				$('.ui-autocomplete.ui-menu').removeClass( "ui-corner-all" );
       		 }
		}).data( "autocomplete" )._renderItem = function( ul, item ) {
			var text =item.label;
			return $( "<li></li>" )
				.data( "item.autocomplete", item )
				.append( "<a>" + text.replace( new RegExp( "(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi" ), "<strong>$1</strong>" )+"</a>" )
				.appendTo( ul );
				
		}
		$( "#placeSearch .ui-autocomplete-input" ).on('keypress',function(event) {
			if ( event.which == 13 ) {
				//$( "#placeSearch [type=text]" ).autocomplete("close");
				getSignlePlace($( "#placeSearch .ui-autocomplete-input" ).val());
			}
		});
		$('#embed').click(function(e){
			e.stopPropagation();
			e.preventDefault();

				e.preventDefault();
				var trigger=$(this);
				$.colorbox({
					rel:'gouped',
					html:function(){
						return '<div id="embedArea"><h2>Page Link</h2><h3>http://dev.campusmap.wsu.edu/central/</h3><h2>Embed code</h2><textarea><iframe src="http://dev.campusmap.wsu.edu/central/"/></textarea></div>';
					},
					scrolling:false,
					opacity:0.7,
					transition:"none",
					width:450,
					height:350
				});

		});
	
		$('#share').click(function(e){
			e.stopPropagation();
			e.preventDefault();
		
		});	
	}	
	
/* to move */	
	if($('.admin.view._editor').length){
		load_view_editor();
	 }		
	
	
	if($('#geometrics_drawing_map').length){
		load_geometrics_editor();
	 }	
	if($('.admin.place._editor').length){
		load_place_editor();
		tinyResize();
	 }	
	if($('#style_map').length){
		load_style_editor();
	}	
	if($('#map_canvas').length){
		initialize();
		if($('.home #map_canvas').length){$(window).resize(function(){resizeBg($('#map_canvas'),170)}).trigger("resize");}
	}
	$('.quickActions').click(function() {
		$(this).find('.action_nav').slideToggle('fast', function() {
		// Animation complete.
	});

//* from here is the start of the form *//
	$( "#findPlace" ).click(function(){
		//if($('#dialog-form').length==0){$('#staging').append('<div id="dialog-form" title="Create new location"></div>');}
		$( "#mapSearch" ).dialog({
			minimize:true,
			maximize:false,
			autoOpen: false,
			title:"Map Search",
			//modal: true,
			width:475,
			buttons: {
				"Add": function() {
					
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			},
			close: function() {
				//allFields.val( "" ).removeClass( "ui-state-error" );
			}
		});
		var geocoder = new google.maps.Geocoder();  
		$("#searchbox").autocomplete({
			source: function(request, response) {
				if (geocoder == null){
					geocoder = new google.maps.Geocoder();
				}
				geocoder.geocode( {'address': request.term }, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						var searchLoc = results[0].geometry.location;
						var lat = results[0].geometry.location.lat();
						var lng = results[0].geometry.location.lng();
						var latlng = new google.maps.LatLng(lat, lng);
						var bounds = results[0].geometry.bounds;
						
						geocoder.geocode({'latLng': latlng}, function(results1, status1) {
							if (status1 == google.maps.GeocoderStatus.OK) {
								if (results1[1]) {
									response($.map(results1, function(loc) {
										return {
											label  : loc.formatted_address,
											value  : loc.formatted_address,
											bounds   : loc.geometry.bounds
										}
									}));
								}
							}
						});
					}
				});
			},
			select: function(event,ui){
				var pos = ui.item.position;
				var lct = ui.item.locType;
				var bounds = ui.item.bounds;
				if (bounds){
					map.fitBounds(bounds);
				}
			}
		});
	  $( "#mapSearch" ).dialog("open").dialog('widget');
	});



$( "#addGeometrics" ).click(function(){
		//if($('#dialog-form').length==0){$('#staging').append('<div id="dialog-form" title="Create new location"></div>');}
		$( "#addGeom" ).dialog({
			minimize:true,
			maximize:false,
			autoOpen: false,
			title:"Add Geometrics",
			//modal: true,
			width:525,
			buttons: {
				"Add": function() {
					
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			},
			close: function() {
				//allFields.val( "" ).removeClass( "ui-state-error" );
			}
		});
	  $( "#addGeom" ).dialog("open").dialog('widget');
	});

		var cache = {},
			lastXhr;	
		$( ".addPlace" ).click(function(){
			if($('#dialog-form').length==0){$('#staging').append('<div id="dialog-form" title="Create new location"></div>');}
			$( "#dialog-form" ).dialog({
				minimize:true,
				maximize:true,
				autoOpen: false,
				//modal: true,
				width:560,
				buttons: {
					"Add": function() {
						
					},
					Cancel: function() {
						$( this ).dialog( "close" );
					}
				},
				close: function() {
					//allFields.val( "" ).removeClass( "ui-state-error" );
				}
			});
			
			$('#dialog-form').load('../place/editor.castle?ajax=true',function(){
					/*if($('#tabs.place_new').length>0){
						taboptions={cookie:{expires: 1,path:'/place/'}};
					} */taboptions={};
					$( "#tabs" ).tabs(typeof(place_id) !== 'undefined'&&place_id==0?{ disabled: [3] }:taboptions);
					if(typeof(tinyMCE) !== 'undefined' && $('.tinyEditor').length>0){
						if($("#tabs-2 #place_Bodytext").length>0){
							load_tiny("bodytext");
							load_tiny("simple");
						}else{
							load_tiny();
						}
					}
					$( "#LocationTypeSelect" ).combobox();
					$( "#LocationModelSelect" ).combobox();
				});
			$( "#dialog-form" ).dialog("open").dialog('widget');//.position({my: 'left',at: 'left',of: $('#map_canvas')}); 
			//drop1(); 

			$( "#tags" )
				// don't navigate away from the field on tab when selecting an item
				.bind( "keydown", function( event ) {
					if ( event.keyCode === $.ui.keyCode.TAB &&
							$( this ).data( "autocomplete" ).menu.active ) {
						event.preventDefault();
					}
				})
				.autocomplete({
					minLength: 0,
					source: function( request, response ) {
						// delegate back to autocomplete, but extract the last term
						/*response( $.ui.autocomplete.filter(
							availableTags, extractLast( request.term ) ) );*/
				            var term = request.term;
				            if ( term in cache ) {
					            response( cache[ term ] );
					            return;
				            }

				            lastXhr = $.getJSON( DOMAIN+"/public/get_pace_type.castle", request, function( data, status, xhr ) {
					            cache[ term ] = data;
					            if ( xhr === lastXhr ) {
						            response( $.ui.autocomplete.filter(
									data, extractLast( request.term ) ) );
					            }
				            });
					},
					focus: function() {
						// prevent value inserted on focus
						return false;
					},
					select: function( event, ui ) {
						var terms = split( this.value );
						// remove the current input
						terms.pop();
						// add the selected item
						terms.push( ui.item.value );
						// add placeholder to get the comma-and-space at the end
						terms.push( "" );
						this.value = terms.join( ", " );
						return false;
					}
				});
			});
		});
			

	$('.ListingChoices').click(function(e) {
		var obj=$(this);
		if(!$(this).is('active')){// changed hasClass for is for speed
			var href = $(this).attr('href');
			$('.tabactive').animate({
				width:0,
				height:0
			}, 250, function() {
				$('.tabactive').removeClass('tabactive');
				$('.active').removeClass('active ui-state-hover');
				$(href).animate({
					width:'100%',
					height:'100%'
				}, 250, function() {
					$(href).addClass('tabactive');
					obj.addClass('active ui-state-hover');
				// Animation complete.
				});
			});
		}
		return false;
	});
			
});