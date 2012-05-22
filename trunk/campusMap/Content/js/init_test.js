var ib = [];
var markerLog = [];
var shapes = [];
function resizeBg(obj,height,width) {
	obj.height($(window).height()-height);
	if(typeof(width)!=="undefined"&&width>0)obj.width($(window).width()-width);
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
		
		map_op = $.extend(map_op,{"mapTypeControl":false});
		$('#centralMap').gmap(map_op).bind('init', function() { 
			var map = $('#centralMap').gmap("get","map");
			google.maps.event.addListener(map, "rightclick",function(event){showContextMenu(event.latLng);});
			google.maps.event.addListener(map, "click",function(event){ hideContextMenu() });
			google.maps.event.addListener(map, "drag",function(event){ hideContextMenu() });
			addCentralControlls();
			loadData(data);
			callback();
			$('[controlheight]:first').css({'margin-left':'15px'});
		});
	});
}
function addCentralControlls(){
	


	// Set CSS for the control border.
	var controlUI = document.createElement('div');

	controlUI.title = 'Click to set the map to Home';
	controlUI.className = 'mapControl TOP';
	
	// Set CSS for the control interior.
	var controlText = document.createElement('div');
	controlText.className = 'text';
	controlText.innerHTML = 'Aerial Photo';
	controlUI.appendChild(controlText);
	google.maps.event.addDomListener(controlUI, 'click', function() {
			$('.mapControl').removeClass('activeControl');
			$(this).addClass('activeControl');
		 $('#centralMap').gmap("setOptions",{'mapTypeId':google.maps.MapTypeId.ROADMAP});
	});
	$('#centralMap').gmap("addControl",controlUI, google.maps.ControlPosition.RIGHT_TOP);


	// Set CSS for the control border.
	var controlUI = document.createElement('div');

	controlUI.title = 'Click to set the map to Home';
	controlUI.className = 'mapControl TYPE activeControl';

	
	// Set CSS for the control interior.
	var controlText = document.createElement('div');
	controlText.className = 'text';
	controlText.innerHTML = 'Map';
	controlUI.appendChild(controlText);
	google.maps.event.addDomListener(controlUI, 'click', function() {
			$('.mapControl').removeClass('activeControl');
			$(this).addClass('activeControl');
		 $('#centralMap').gmap("setOptions",{'mapTypeId':google.maps.MapTypeId.ROADMAP});
	});
	$('#centralMap').gmap("addControl",controlUI, google.maps.ControlPosition.RIGHT_TOP);
	
	

	// Set CSS for the control border.
	var controlUI = document.createElement('div');
	controlUI.title = 'Click to set the map to Home';
	controlUI.className = 'mapControl';

	
	// Set CSS for the control interior.
	var controlText = document.createElement('div');
	controlText.className = 'text';
	controlText.innerHTML = 'Satellite';
	controlUI.appendChild(controlText);
	google.maps.event.addDomListener(controlUI, 'click', function() {
			$('.mapControl').removeClass('activeControl');
			$(this).addClass('activeControl');
		 $('#centralMap').gmap("setOptions",{'mapTypeId':google.maps.MapTypeId.SATELLITE});
	});
	$('#centralMap').gmap("addControl",controlUI, google.maps.ControlPosition.RIGHT_TOP);
	
	
		

	// Set CSS for the control border.
	var controlUI = document.createElement('div');
	controlUI.title = 'Click to set the map to Home';
	controlUI.className = 'mapControl';

	
	// Set CSS for the control interior.
	var controlText = document.createElement('div');
	controlText.className = 'text';
	controlText.innerHTML = 'Hybrid';
	controlUI.appendChild(controlText);
	google.maps.event.addDomListener(controlUI, 'click', function() {
			$('.mapControl').removeClass('activeControl');
			$(this).addClass('activeControl');
		 $('#centralMap').gmap("setOptions",{'mapTypeId':google.maps.MapTypeId.HYBRID});
	});
	$('#centralMap').gmap("addControl",controlUI, google.maps.ControlPosition.RIGHT_TOP);
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}


var cTo;
var cFrom;

function hereToThere(){
	if(cTo || cFrom)return false

	$('#centralMap').gmap('displayDirections',
		{origin:cFrom,destination:cTo,travelMode: google.maps.DirectionsTravelMode.WALKING},
		{draggable: true},
		function(){
			$('.contextmenu .active').removeClass('active');
			cFrom=null;
			cTo=null;
			$('#loading').remove();
	});
}

function showContextMenu(caurrentLatLng  ) {
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
	contextmenuDir.innerHTML = '<a id="to">Directions TO</a><a id="menu2">Directions FROM</a>';
	$(map.getDiv()).append(contextmenuDir);
	setMenuXY(caurrentLatLng);
	contextmenuDir.style.visibility = "visible";
	
	

	if(cTo!==null){$('.contextmenu #to').addClass('active');}
	if(cFrom!==null){$('.contextmenu #from').addClass('active');}
	$('.contextmenu #to').live('click',function(){
		cTo=caurrentLatLng.lat()+","+caurrentLatLng.lng();
		alert(cTo);
		$(this).addClass('active');
		 hereToThere();
		 hideContextMenu();
	});
	$('.contextmenu #from').live('click',function(){
		cFrom=caurrentLatLng.lat()+","+caurrentLatLng.lng();
		alert(cFrom);
		$(this).addClass('active');
		 hereToThere();
		 hideContextMenu();
	});
	
}
function hideContextMenu() {
	$('.contextmenu').remove();
}

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
		loadData(data);
		loadListings(data,showSum);
		prep();
	});
	
}
function loadData(data){
	if(typeof(data.shapes)!=='undfined' && !$.isEmptyObject(data.shapes)){
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
	$.each( data.markers, function(i, marker) {	
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
			,pixelOffset: new google.maps.Size(-200, -36)
			,zIndex: 99
			,boxStyle: {
			  //background: "url('http://dev-mcweb.it.wsu.edu/campusmap.com/Content/images/sudo_infobottom.png') no-repeat center bottom",
			  width: "400px"
			 }
			,closeBoxMargin: "10px 2px 2px 2px"
			,closeBoxURL: siteroot + "Content/images/close.png"
			,infoBoxClearance: new google.maps.Size(1, 1)
			,isHidden: false
			,pane: "floatPane"
			,enableEventPropagation: false
			,onOpen:function(){
						$('#taby'+i).tabs();
						$('#taby'+i).hover(function(){
							ib[i].setOptions({enableEventPropagation: true});
							$('#centralMap').gmap('stop_scroll_zoom');
						},function(){
							ib[i].setOptions({enableEventPropagation: false});
							$('#centralMap').gmap('set_scroll_zoom');
						});
						$('.headImage').on('click',function(e){
							e.preventDefault();
							var trigger=$(this);
							$.colorbox({
								rel:'gouped',
								html:function(){
									return '<img src="'+trigger.find('img').attr('title')+'" style="height:100%;margin:0 auto;display:block;" />';
								},
								photo:true,
								scrolling:false,
								opacity:0.7,
								transition:"none",
								width:"75%",
								height:"75%",
								slideshow:true
							});
						});
						if($(".cWrap").length){
							$(".cWrap").jCell({
								btnNext: ".next",
								btnPrev: ".prev",
								speed: 1000,
								visible: 1,
								navTemplate:'<li><a href="#">{$i}</a></li>',
								nav:$('.cNav')
							});
						}
						//alert('tring to tab it, dabnab it');
					}
		};
		ib[i] = new InfoBox(myOptions,function(){
			//$('#taby'+i).tabs();
			//alert('tring to tab it, dabnab it, from the INI');
		});
		//end of the bs that is well.. bs of a implamentation
		
		if(marker.style.icon){marker.style.icon = marker.style.icon.replace('{$i}',i+1);}
		$('#centralMap').gmap('addMarker', $.extend({ 
			'position': new google.maps.LatLng(marker.position.latitude, marker.position.longitude)
		},marker.style),function(ops,marker){
			markerLog[i]=marker;
			}).click(function() {
			$.each(ib, function(i) {ib[i].close();});
			ib[i].open($('#centralMap').gmap('get','map'), this);
			
	
			//$('#centralMap').gmap('openInfoWindow', { 'content': marker.info.content }, this);
		}).rightclick(function(event){showContextMenu(event.latLng);});
	});
}
function loadListings(data,showSum){
	var listing="";
	$.each( data.markers, function(i, marker) {	
		var sum="";
		if(typeof(marker.summary)!=='undfined' && !$.isEmptyObject(marker.summary)){
			sum='<div class="" '+(showSum?'':'style="display:none;')+'">'+marker.summary+'</div>';
		}

		listing+='<li class="">'+
					'<a href="#" class=""><img src="'+siteroot+'Content/images/list_numbers/li_'+(i+1)+'.png"/>'+marker.title+'</a>'+
					sum+
				'</div>';
	});
	$('#selectedPlaceList_area').html('<ul>'+listing+'</ul>');
	$.each($('#selectedPlaceList_area a'),function(i,v){
		var btn=$(this);
		btn.live('click',function(e){
			e.stopPropagation();
			e.preventDefault();
			if(!btn.hasClass('active') && !btn.next('div').is(':visible')){
				$('#selectedPlaceList_area .active').next('div').toggle('showOrHide');
				$('#selectedPlaceList_area .active').removeClass('active');
				btn.next('div').toggle('showOrHide');
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
function prep(){
	$("a").each(function() {$(this).attr("hideFocus", "true").css("outline", "none");});
}
$(document).ready(function(){
	$(' [placeholder] ').defaultValue();
	if($('#centralMap').length){
		$('#centralMap').append('<img src="/Content/images/loading.gif" style="position:absolute; top:50%; left:50%;" id="loading"/>');
		iniMap("",function(){
			$('#loading').remove();
		});
		if($('#centralMap').length){
			$(window).resize(function(){resizeBg($('.central_layout.public.central #centralMap'),160,185)}).trigger("resize");
			$(window).resize(function(){
				resizeBg($('.cAssest'),160)
				}
			).trigger("resize");
		}
		$('#selectedPlaceList_btn').live('click', function(e){
			e.stopPropagation();
			e.preventDefault();
			var btn=$(this);
			if(btn.closest('#selectedPlaceList').width()<=1){
				btn.closest('#selectedPlaceList').stop().animate({
					width:"190px"
					}, 500, function() {
						btn.addClass("active");
						$('#selectedPlaceList_area').css({'overflow-y':'scroll'});
				});
				$('[controlheight]:first').stop().animate({'margin-left':'200px'}, 500, function() {});
			}else{
				btn.closest('#selectedPlaceList').stop().animate({
					width:"0px"
					}, 500, function() {
						btn.removeClass("active");
						$('#selectedPlaceList_area').css({'overflow-y':'hidden'});
						//$('[controlheight]:first').css({'margin-left':'5px'});
				});
				$('[controlheight]:first').stop().animate({'margin-left':'15px'}, 500, function() {});
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
				},1000);
		});
		function fireDirections(){
			$('#centralMap').gmap('clear','markers');
			$('#centralMap').gmap('clear','overlays');
			$('#centralMap').gmap('clear','serivces');
			$('#centralMap').append('<img src="/Content/images/loading.gif" style="position:absolute; top:50%; left:50%;" id="loading"/>');
			var from=$('#directionsFrom input').val();
			var to=$('#directionsTo input').val();
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

		$('#main_nav li.parent').live('click',function(e){
			e.stopPropagation();
			e.preventDefault();
			$('.active').removeClass('active');
			$('.checked').removeClass('checked');
			$(this).addClass('active');
			$.each(ib, function(i) {ib[i].close();});
			$('#centralMap').gmap('clear','markers');
			$('#centralMap').gmap('clear','overlays');
			updateMap(encodeURI($(this).find('a:first').attr('href').replace('?cat[]=','')));
		});
		$('#main_nav .parent li a').live('click',function(e){
			e.stopPropagation();
			e.preventDefault();
			$(this).closest('li').toggleClass('checked');
			$.each(ib, function(i) {ib[i].close();});
			$('#centralMap').gmap('clear','markers');
			$('#centralMap').gmap('clear','overlays');
			var params='';
			$.each($('li.checked a'),function(){
				params=params+$(this).attr('href').replace('?cat[]=','')+',';
			});
			updateMap(encodeURI(params.substring(0, params.length - 1)),true);
		});
		
		
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
									value: item.value
								}
							}
						
						}));
					}
				});
			},
			minLength: 2,
			select: function( event, ui ) {
				
			},
			open: function(e,ui) {
				$('.ui-autocomplete.ui-menu').removeClass( "ui-corner-all" );
				var
					acData = $(this).data('autocomplete'),
					styledTerm = termTemplate.replace('%s', acData.term);
	
				acData
					.menu
					.element
					.find('li')
					.each(function() {
						var me = $(this);
						me.html( me.text().replace(acData.term, styledTerm) );
					});
       		 }
		});
	
	}	
	if($('#geometrics_drawing_map').length){
		load_geometrics_editor();
	 }	
	if($('#place_drawing_map').length){
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
		if(!$(this).hasClass('active')){
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