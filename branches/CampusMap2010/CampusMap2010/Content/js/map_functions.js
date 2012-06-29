var sensor=false;
var lang='';
var vbtimer;
var ibOpen=false;
var reopen=false;



/* fix by removing the hardcoded id */
function detectBrowser() {
	var useragent = navigator.userAgent;
	var mapdiv = document.getElementById("map_canvas");
	if (isTouch()) {
		addMetaSupport();
		mapdiv.style.width = '100%';
		mapdiv.style.height = '100%';
		sensor=true;
	}
}
function loadingLang(){
    if($("meta[name=locale]").length>0){
        var meta_lang = $("meta[name=locale]").attr("content").split('_');
        var lang=meta_lang[0]!='en'?'&language='+meta_lang[0]:'';
    }
}
function addMetaSupport(){
    var mt = $('meta[name=viewport]');
    mt = mt.length ? mt : $('<meta name="viewport" />').appendTo('head');
    mt.attr('content', 'initial-scale=1.0, user-scalable=no');
}

/*rework*/
function loadScript(){
    detectBrowser();
    loadingLang();  
  	async_load_js("http://maps.googleapis.com/maps/api/js?sensor="+sensor+"&callback=initialize"+lang,function(){
		async_load_js(url,callback);
	});
    
}

function set_up_addThis(){
	$('.addthis').clone().appendTo('#main').removeClass('hideThis');
	var title = $('#main h1.title').text();
	if(typeof(addthis) === 'undefined'||typeof(addthis) == null){
		var script = 'http://s7.addthis.com/js/250/addthis_widget.js#pubid=ra-4d8da66e286a0475#domready=1';
		$.getScript( script );
	}
	addthis.update('share', 'url', url);
	addthis.update('share', 'title', title);
}

/* doesn't work look into*/
function empty_input_recursive(obj){
	(typeof obj.val() === 'function')
		?obj.val(''):(typeof obj.find(':input').val() === 'function')
			?obj.find(':input').val(''):null;
}

/* set up parts of the map NOTE: should be worked into the jquery plugin jMaps*/
function setGeoCoder(){
	if(typeof(geocoder)==='undefined'){geocoder = new google.maps.Geocoder();}
	return geocoder;
}
function setDirectionsRenderer(){
	if(typeof(directionsDisplay)==='undefined'){
		directionsDisplay = new google.maps.DirectionsRenderer({ 
			map: map, 
			suppressPolylines:true,
			suppressMarkers:true
			//markerOptions: markerOptions
		}); 
		google.maps.event.addListener(directionsDisplay, 'directions_changed', function(){});
	}
	return directionsDisplay;
}
/* SET */
function mapzoom(){
    var mapZoom = map.getZoom();
    gob("myzoom").value = mapZoom;
}
function mapcenter(){
    var mapCenter = map.getCenter();
    var latLngStr = mapCenter.lat().toFixed(6) + ', ' + mapCenter.lng().toFixed(6);
    gob("centerofmap").value = latLngStr;
}
/* GET */
function get_mapzoom(){
    var mapZoom = map.getZoom();
    return mapZoom;
}












//-------------------------------------------------------------------------------------------------------------------------------------------------------------
// jeremy's map controls
//-------------------------------------------------------------------------------------------------------------------------------------------------------------

/* rework to move into the default cache folder */
function get_wsu_logo_shape(){
	var Coords = [];
	var shaped = [];
	var shape = "-117.151680,46.737567,\n-117.152281,46.737390,\n-117.152753,46.737067,\n-117.153225,46.736655,\n-117.153397,46.736155,\n-117.153482,46.735449,\n-117.153268,46.734831,\n-117.153053,46.733949,\n-117.152710,46.732919,\n-117.152581,46.732331,\n-117.152538,46.731743,\n-117.152710,46.731066,\n-117.153010,46.730684,\n-117.153568,46.730390,\n-117.154341,46.730272,\n-117.155242,46.730272,\n-117.155199,46.730860,\n-117.155199,46.731301,\n-117.155800,46.730772,\n-117.156572,46.730125,\n-117.157817,46.729537,\n-117.156658,46.729448,\n-117.155199,46.729331,\n-117.153826,46.729213,\n-117.152796,46.729095,\n-117.151937,46.729125,\n-117.151251,46.729389,\n-117.150650,46.729860,\n-117.150350,46.730419,\n-117.150307,46.731184,\n-117.150650,46.732272,\n-117.150865,46.733155,\n-117.151165,46.734243,\n-117.151079,46.734978,\n-117.150693,46.735419,\n-117.150092,46.735861,\n-117.149405,46.736037,\n-117.148547,46.736008,\n-117.148204,46.735861,\n-117.147861,46.735567,\n-117.147560,46.735184,\n-117.147517,46.735684,\n-117.147646,46.736155,\n-117.147517,46.736390,\n-117.147517,46.736655,\n-117.145371,46.736684,\n-117.145371,46.736861,\n-117.147517,46.736890,\n-117.147560,46.737008,\n-117.145500,46.737272,\n-117.145543,46.737449,\n-117.147646,46.737243,\n-117.147646,46.737361,\n-117.145715,46.737831,\n-117.145844,46.738037,\n-117.147903,46.737596,\n-117.148204,46.737831,\n-117.150393,46.737714,\n-117.150092,46.738714,\n-117.150393,46.738714,\n-117.150865,46.737655,\n-117.151294,46.737655,\n-117.150865,46.738772,\n-117.151122,46.738743";
	
	var Rows=shape.split('\n');
	if(Rows.length){
		for(i=0; i<=Rows.length-1; i++){
			var cord=Rows[i].split(',');
			shaped.push(new google.maps.LatLng(parseFloat(cord[1]),parseFloat(cord[0])));
		}
	}
	Coords.push(shaped.reverse());
	var shaped = [];
	var shape = "-117.149577,46.736390,\n-117.150435,46.736537,\n-117.150908,46.736508,\n-117.151508,46.736449,\n-117.151937,46.736243,\n-117.152238,46.735949,\n-117.152367,46.735537,\n-117.152023,46.735743,\n-117.151594,46.736037,\n-117.151122,46.736184,\n-117.150564,46.736302,\n-117.150221,46.736361";
	
	var Rows=shape.split('\n');
	if(Rows.length){
		for(i=0; i<=Rows.length-1; i++){
			var cord=Rows[i].split(',');
			shaped.push(new google.maps.LatLng(parseFloat(cord[1]),parseFloat(cord[0])));
		}
	}
	Coords.push(shaped);
	var shaped = [];
	var shape = "-117.153010,46.737331,\n-117.154212,46.737037,\n-117.155070,46.736625,\n-117.156014,46.736155,\n-117.156487,46.735831,\n-117.155628,46.735214,\n-117.155328,46.735449,\n-117.155285,46.734802,\n-117.155242,46.734008,\n-117.155714,46.734449,\n-117.156143,46.734772,\n-117.155929,46.734978,\n-117.156658,46.735625,\n-117.157130,46.735214,\n-117.157688,46.734537,\n-117.157903,46.734096,\n-117.156873,46.733508,\n-117.156744,46.733772,\n-117.156487,46.733361,\n-117.156487,46.732919,\n-117.156572,46.732507,\n-117.156701,46.732213,\n-117.156959,46.732655,\n-117.157216,46.732890,\n-117.157044,46.733272,\n-117.157946,46.733802,\n-117.158418,46.733066,\n-117.158976,46.732302,\n-117.159662,46.731566,\n-117.160220,46.731154,\n-117.159019,46.731301,\n-117.158074,46.731478,\n-117.158160,46.730860,\n-117.158504,46.730095,\n-117.159019,46.729507,\n-117.158160,46.729684,\n-117.157130,46.730154,\n-117.156229,46.730860,\n-117.155457,46.731625,\n-117.155156,46.732184,\n-117.154899,46.731596,\n-117.154813,46.730566,\n-117.154427,46.730537,\n-117.153912,46.730566,\n-117.153482,46.730743,\n-117.153654,46.730713,\n-117.153225,46.731007,\n-117.153010,46.731507,\n-117.153010,46.732184,\n-117.153139,46.733008,\n-117.153397,46.733713,\n-117.153654,46.734537,\n-117.153869,46.735302,\n-117.153869,46.735919,\n-117.153783,46.736419,\n-117.153482,46.736802,\n-117.153311,46.737067,\n-117.153010,46.737331";	
	var Rows=shape.split('\n');
	if(Rows.length){
		for(i=0; i<=Rows.length-1; i++){
			var cord=Rows[i].split(',');
			shaped.push(new google.maps.LatLng(parseFloat(cord[1]),parseFloat(cord[0])));
		}
	}
	Coords.push(shaped);
	var shaped = [];
	var shape = "-117.150521,46.733684,\n-117.150435,46.733066,\n-117.150307,46.732537,\n-117.150092,46.732096,\n-117.149792,46.731596,\n-117.149448,46.731213,\n-117.148976,46.730919,\n-117.148461,46.730801,\n-117.148075,46.730772,\n-117.147689,46.730801,\n-117.147346,46.730949,\n-117.147045,46.731125,\n-117.146745,46.731449,\n-117.146616,46.731860,\n-117.146616,46.732243,\n-117.146702,46.732743,\n-117.146788,46.733213,\n-117.146916,46.733508,\n-117.147131,46.733919,\n-117.147088,46.733537,\n-117.147088,46.733155,\n-117.147217,46.732802,\n-117.147431,46.732478,\n-117.147818,46.732272,\n-117.148290,46.732184,\n-117.148719,46.732213,\n-117.149277,46.732419,\n-117.149620,46.732625,\n-117.150006,46.732919,\n-117.150221,46.733155,\n-117.150350,46.733390,\n-117.150521,46.733684";	
	var Rows=shape.split('\n');
	if(Rows.length){
		for(i=0; i<=Rows.length-1; i++){
			var cord=Rows[i].split(',');
			shaped.push(new google.maps.LatLng(parseFloat(cord[1]),parseFloat(cord[0])));
		}
	}
	Coords.push(shaped);
	var shaped = [];
	var shape = "-117.150006,46.730154,\n-117.150221,46.729684,\n-117.150693,46.729331,\n-117.151165,46.729125,\n-117.149706,46.729095,\n-117.149749,46.729566,\n-117.149835,46.729890,\n-117.150006,46.730154";	
	var Rows=shape.split('\n');
	if(Rows.length){
		for(i=0; i<=Rows.length-1; i++){
			var cord=Rows[i].split(',');
			shaped.push(new google.maps.LatLng(parseFloat(cord[1]),parseFloat(cord[0])));
		}
	}
	Coords.push(shaped);
	return Coords;
}

/* 
 * DEFAULT_overlay=apply_element(map,type,_option);  << that needs fixed
 * with paths: get_wsu_logo_shape(), as option
 * TODO besides listed above is circle and rec and marker
 */
function set_default_shape(mapSelector,type,op){
	var capedType=type[0].toUpperCase() + type.slice(1)
	if(typeof(op)==='undefined')op={};
	switch(type){
		case "polygon" :
			// default ploygon style
				_option = {
						rest:{
							options:$.extend((typeof(op.rest)!=='undefined'?op.rest:{strokeColor: "#5f1212",strokeOpacity:0.24,strokeWeight: 2,fillColor: "#5f1212",fillOpacity: 0.24}),{paths: get_wsu_logo_shape()})
						},
						mouseover:{
							options:typeof(op.mouseover)!=='undefined'?op.mouseover:{fillColor: "#a90533",fillOpacity: 0.35}
						},
						mouseout:{
							options:typeof(op.mouseout)!=='undefined'?op.mouseout:{fillColor: "#a90533",fillOpacity: 0.35}
						},
						click:{
							options:typeof(op.click)!=='undefined'?op.click:{fillColor: "#a90533",fillOpacity: 0.35}
						}
					}
				DEFAULT_overlay=apply_element(mapSelector,capedType,_option);
				return DEFAULT_overlay;
			break;
		case "rectangle" :
				return null;
			break;
		case "circle" :
				return null;
			break;			
		case "polyline" :
			// default ploygon style
			DEFAULT_polylines = [];
			var polyline =get_wsu_logo_shape();
					if(polyline.length){
						for(i=0; i<=polyline.length-1; i++){
							_option = {
								rest:{
									options:$.extend(typeof(op.rest)!=='undefined'?op.rest:{strokeColor: "#5f1212",strokeOpacity: 0.24,strokeWeight: 2},{path: polyline[i]})
								},	
								mouseover:{
									options:typeof(op.mouseover)!=='undefined'?op.mouseover:{strokeColor: "#a90533",strokeOpacity: 0.35}
								},	
								mouseout:{
									options:typeof(op.mouseout)!=='undefined'?op.mouseout:{strokeColor: "#a90533",strokeOpacity: 0.35}
								},	
								click:{
									options:typeof(op.click)!=='undefined'?op.click:{strokeColor: "#a90533",strokeOpacity: 0.35}
								}
							}
							DEFAULT_overlay=apply_element(mapSelector,capedType,_option);
							DEFAULT_polylines.push(DEFAULT_overlay);
							google.maps.event.addListener(DEFAULT_overlay,"mouseover",function (){
								for(i=0; i<=DEFAULT_polylines.length-1; i++){
									DEFAULT_polylines[i].setOptions({strokeColor: "#a90533"}); 
								}
							});  
							google.maps.event.addListener(DEFAULT_overlay,"mouseout",function (){
								for(i=0; i<=DEFAULT_polylines.length-1; i++){
									DEFAULT_polylines[i].setOptions({strokeColor: "#5f1212"}); 
								}
							});
						}
					}
					/*_option = {path:[
						new google.maps.LatLng("46.732537","-117.160091"),
						new google.maps.LatLng("46.732596","-117.146745")
						]
					,strokeColor: "#5f1212",strokeOpacity:1,strokeWeight:10};
					apply_element(map,capedType,_option);*/
				return polyline;
			break;				
		case "marker" :
				return null;
			break;
	};
}

/*
 * puts element on map via set map 
 * mapOjb thru $(selector) set by $(selector).gmap()
 * type Marker|Polyline|etc
 *
 * style {
 * 		rest:{options:{},callback:function(){}},
 * 		hover:{options:{},callback:function(){}}
 * }
 *
*/
function apply_element(mapOjb,type,style){
	mapOjb.gmap('add'+type, filter_map_element(type,style.rest.options)).click(function(){
					if(style.click){
						if(style.click.options)mapOjb.gmap('setOptions',filter_map_element(type,style.click.options),this);
						if(style.click.callback)style.click.callback();
					}
				 }).mouseover(function(){
					 if(style.mouseover){
						 if(style.mouseover.options)mapOjb.gmap('setOptions',filter_map_element(type,style.mouseover.options),this);
						 if(style.mouseover.callback)style.mouseover.callback();
					 }
				}).mouseout(function(){
					if(style.rest){
						if(style.rest.options)mapOjb.gmap('setOptions',filter_map_element(type,style.rest.options),this);
						if(style.rest.callback)style.rest.callback();
					}
				}).dblclick(function(){
					if(style.dblclick){
						if(style.dblclick.options)mapOjb.gmap('setOptions',filter_map_element(type,style.dblclick.options),this);
						if(style.dblclick.callback)style.dblclick.callback();
					}
				})
				.triggerEvent('mouseover')
				.triggerEvent('mouseout');/*,
				rightclick: function(){
					if(style.dblclick){
						if(style.rightclick.options)mapOjb.gmap('get','map').setCenter(filter_map_element(type,style.rightclick.options),this);
						if(style.rightclick.callback)style.hover.callback();
					}
				}*/
}
function rebuild_example(tabs,mapSelector,type){
	var _op={};
	$.each(tabs, function(){
		var tab = $(this);
		var mode = tab.attr('id').split('__')[1].split('_')[1];
		var objs_to_rebuild = tab.find('.sortStyleOps :input');
		
		_op[ mode ] = {};
		var options={}
		$.each(objs_to_rebuild, function(){
			if(
				$(this).closest('.pod').css('display') != 'none' 
				&& ( $(this).is(':checked') 
					|| $(this).is(':selected') 
					|| ($(this).val()!='' 
						&& ($(this).not('[type=checkbox]')
							&&$(this).not('[type=select]'))
						)
					) 
				&& $(this).not('[type=hidden]') 
				&& typeof( $(this).attr('rel') ) !== 'undefined' 
				){
			   options[$(this).attr('rel')]= ($(this).is('color_picker') ? '#' : '') +''+$(this).val();// changed hasClass for is for speed
			}
		});
		_op[ mode ] = $.extend({},options); 
	});
	mapSelector.gmap('clear_map');	
	set_default_shape(mapSelector,type,_op);
}

/*
 * returns gmap element options from a possibly dirty source
 * for a type ie:polygon
 *	example:
 *		op={fillColor="#000"}
 *		but type == "polyline"
 *		filter_map_element(type,op) returns op={}
 *		as polyline doesn't support fillColor
 *	
 *	Look to abstarct build from a list may-be since it's just
 *	a filter if in proper json ---euff
*/
function filter_map_element(type,op){
	if(typeof(op)==="undefined"){
		return;
	}
	var _op={};
	typeof(op.clickable)!=="undefined"		?_op.clickable=op.clickable:null;
	typeof(op.visible)!=="undefined"		?_op.visible=op.visible:null;
	typeof(op.zIndex)!=="undefined"		?_op.zIndex=op.zIndex:null;
	
	switch(type.toLowerCase()){
		case "polygon" :
					typeof(op.editable)!=="undefined"		?_op.editable=op.editable:null;
					typeof(op.geodesic)!=="undefined"		?_op.geodesic=op.geodesic:null;
					typeof(op.paths)!=="undefined"			?_op.paths=op.paths:null;
					typeof(op.strokeColor)!=="undefined"		?_op.strokeColor=op.strokeColor:null;
					typeof(op.strokeOpacity)!=="undefined"	?_op.strokeOpacity=op.strokeOpacity:null;
					typeof(op.strokeWeight)!=="undefined"	?_op.strokeWeight=op.strokeWeight:null;
					typeof(op.fillColor)!=="undefined"		?_op.fillColor=op.fillColor:null;
					typeof(op.fillOpacity)!=="undefined"		?_op.fillOpacity=op.fillOpacity:null;
			break;
		case "rectangle" :
					typeof(op.editable)!=="undefined"		?_op.editable=op.editable:null;
					typeof(op.bounds)!=="undefined"			?_op.bounds=op.bounds:null;
					typeof(op.strokeColor)!=="undefined"		?_op.strokeColor=op.strokeColor:null;
					typeof(op.strokeOpacity)!=="undefined"	?_op.strokeOpacity=op.strokeOpacity:null;
					typeof(op.strokeWeight)!=="undefined"	?_op.strokeWeight=op.strokeWeight:null;
					typeof(op.fillColor)!=="undefined"		?_op.fillColor=op.fillColor:null;
					typeof(op.fillOpacity)!=="undefined"		?_op.fillOpacity=op.fillOpacity:null;
			break;
		case "circle" :
					typeof(op.editable)!=="undefined"		?_op.editable=op.editable:null;
					typeof(op.center)!=="undefined"			?_op.center=op.center:null;
					typeof(op.radius)!=="undefined"			?_op.radius=op.radius:null;
					typeof(op.strokeColor)!=="undefined"		?_op.strokeColor=op.strokeColor:null;
					typeof(op.strokeOpacity)!=="undefined"	?_op.strokeOpacity=op.strokeOpacity:null;
					typeof(op.strokeWeight)!=="undefined"	?_op.strokeWeight=op.strokeWeight:null;
					typeof(op.fillColor)!=="undefined"		?_op.fillColor=op.fillColor:null;
					typeof(op.fillOpacity)!=="undefined"		?_op.fillOpacity=op.fillOpacity:null;
			break;			
		case "polyline" :
					typeof(op.editable)!=="undefined"		?_op.editable=op.editable:null;
					typeof(op.geodesic)!=="undefined"		?_op.geodesic=op.geodesic:null;
					typeof(op.path)!=="undefined"		?_op.path=op.path:null;
					typeof(op.strokeColor)!=="undefined"		?_op.strokeColor=op.strokeColor:null;
					typeof(op.strokeOpacity)!=="undefined"	?_op.strokeOpacity=op.strokeOpacity:null;
					typeof(op.strokeWeight)!=="undefined"	?_op.strokeWeight=op.strokeWeight:null;
			break;				
		case "marker" :
					typeof(op.animation)!=="undefined"		?_op.animation=op.animation:null;
					typeof(op.cursor)!=="undefined"			?_op.cursor=op.cursor:null;
					typeof(op.draggable)!=="undefined"		?_op.draggable=op.draggable:null;
					typeof(op.flat)!=="undefined"		?_op.flat=op.flat:null;
					typeof(op.icon)!=="undefined"			?_op.icon=op.icon:null;
					typeof(op.optimized)!=="undefined"		?_op.optimized=op.optimized:null;
					typeof(op.position)!=="undefined"		?_op.position=op.position:null;					
					typeof(op.raiseOnDrag)!=="undefined"		?_op.raiseOnDrag=op.raiseOnDrag:null;					
					typeof(op.shadow)!=="undefined"			?_op.shadow=op.shadow:null;	
					typeof(op.shape)!=="undefined"			?_op.shape=op.shape:null;						
					typeof(op.title)!=="undefined"			?_op.title=op.title:null;	
			break;
	};
	return _op;
}

function build_infobox_content(item){
	if(typeof(item.info)==='undefined'){item.info={};}
	if(typeof(item.info.content)==='undefined'){item.info.content=[];}
	var tabCount=$('#infotabs .ui-tabs-nav li').size();
	if(tabCount>1){
		$.each($('#infotabs .ui-tabs-nav li'),function(i,v){
			var liSelf=$(this);
				item.info.content.push({
					block:function(){
							tinyMCE.triggerSave();
							var index=liSelf.index('#infotabs .ui-tabs-nav li');
							return $('#infotabs .ui-tabs-panel:eq('+index+')').find('textarea').val();
						}(),
					title:liSelf.find('a').text()
				});
			});
	}else{
		item.info.content=$('#infotabs .ui-tabs-panel:eq(0)').find('textarea').val();
	}
	return item;
}
function build_infobox(item){
	if(typeof(item.info)==='undefined' || $.isEmptyObject(item.info) || typeof(item.info.content)==='undefined' || $.isEmptyObject(item.info.content)){
		item=build_infobox_content(item);
	}
	var mainimage = "";
	if($(".placeImages").length){
		mainimage = "<span class='headImage' rel='gouped'><a href='#' class='imgEnlarge'></a><img src='"+siteroot+"media/download.castle?placeid=" + $("#place_id").val() + "&id=" + $(".placeImages").first().val() + "&m=crop&w=148&h=100' title='media/download.castle?placeid=" + $("#place_id").val() + "&id=" + $(".placeImages").first().val() + "' alt='Main Image' class='img-main'/></span>";
	}
	var infoTitle = "";
	if($('#hideTitles:checked').length==0){
		infoTitle = '<h2 class="header">'+ ($("#infoTitle").val()!==''?$("#infoTitle").val():$("#name").val())+'</h2>';
	}
	if($.isArray(item.info.content)){
			var nav='';
			$.each( item.info.content, function(j, html) {	
				nav += '	<li class="ui-state-default ui-corner-top '+( j==0 ?'first ui-tabs-selected ui-state-active':'')+'"><a href="#tabs-'+j+'" hideFocus="true">'+html.title+'</a></li>';
			});
			var content='';
			$.each( item.info.content, function(j, html) {
				content += '<div id="tabs-'+j+'" class="ui-tabs-panel ui-widget-content ui-corner-bottom  '+( j>0 ?' ui-tabs-hide':'')+'"><div class="content">'+infoTitle+(j==0?mainimage:'')+html.block+'</div></div>';
			});
	}else{
		var nav = '	<li class="ui-state-default ui-corner-top  ui-tabs-selected ui-state-active first" ><a href="#tabs-1"  hideFocus="true">Overview</a></li>';
		var content='<div id="tabs-" class="ui-tabs-panel ui-widget-content ui-corner-bottom  "><div class="content">'+infoTitle+mainimage+item.info.content+'</div></div>';
	}

		var box='<div id="taby'+i+'" class="ui-tabs ui-widget ui-widget-content ui-corner-all">'+
					'<ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">'+nav+'</ul>'+
					content+
					'<div class="ui-tabs-panel-cap ui-corner-bottom"><span class="arrow"></span></div>'+
				'</div>';
			
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
		,infoBoxClearance: new google.maps.Size(1,50)
		,isHidden: false
		,pane: "floatPane"
		,enableEventPropagation: false
		,onClose:function(){ibHover =  false;ibOpen=false;}
		,onOpen:function(){
					ibOpen=true;
						ibHover =  true;
						if($(".cWrap").length){
							$('.cWrap a.gouped').on('click',function(e){
								e.preventDefault();
								e.stopImmediatePropagation();
								$('.cWrap a.gouped').colorbox({
									photo:true,
									scrolling:false,
									opacity:0.7,
									transition:"none",
									width:"75%",
									height:"75%",
									slideshow:true,
									slideshowAuto:false,
									open:true
								});
							});
							$('.cWrap .items').cycle({
								fx:     'scrollLeft',
								delay:  -2000,
								pauseOnPagerHover: 1,
								pause:1,
								pager:'.cNav',
								prev:   '.prev',     next:   '.next', 
								pagerAnchorBuilder: function(idx, slide) { return '<li><a href="#" hidefocus="true">'+idx+'</a></li>';} 
							});
							prep();
						}
						$('#taby'+i).tabs();
						var minHeight=0;
						$.each($('#taby'+i+' .ui-tabs-panel'),function() {
							minHeight = Math.max(minHeight, $(this).find('.content').height()); 
						}).css('min-height',minHeight); 
						$('#taby'+i).hover(function(){
							ib[0].setOptions({enableEventPropagation: true});
						},function(){
							ib[0].setOptions({enableEventPropagation: false});
						});
						ib[0].rePosition();
				}
	};
	ib[0] = new InfoBox(myOptions,function(){});
	return item;
}


function loadPlaceShape(_load,callback){
	if(typeof(_load)==='undefined') var _load = false;
	if(typeof(showSum)==='undefined') var showSum = false;
	//var url='http://images.wsu.edu/javascripts/campus_map_configs/pick.asp';	
	var url=siteroot+"place/loadPlaceShape.castle";
	$.getJSON(url+'?callback=?'+(_load!=false?'&id='+_load:''), function(data) {

		if(typeof(data.shape)!=='undfined' && !$.isEmptyObject(data.shape)){
			$.each( data, function(i, shape) {	

			//alert(shape.latlng_str);
				 var pointHolder = {};
				 var coord = shape.latlng_str;//(typeof(shape.encoded)!=="undefined"&& shape.encoded!="")?shape.encoded:shape.latlng_str;
				 var type = "polygon";typeof(shape.type)!=="undefined"?shape.type:"polygon";
				 //alert(coord);
				 
				 
				 if(coord!='' && shape.type=='polyline'){ 
					var pointHolder = {'path' : coord };
				 }
				  if(coord!='' && shape.type=='polygon'){ 
					var pointHolder = {'paths' : coord};
				 }
				 //alert(shape.type);
				 if(!$.isEmptyObject(pointHolder)){
					var ele = $.extend( { 'fillOpacity':.25,'fillColor':'#981e32', 'strokeWeight':0 } , pointHolder );
				 }else{
					var ele = {};
				 }

				 $('#place_drawing_map').gmap('addShape',(type[0].toUpperCase() + type.slice(1)), ele,function(shape){
						 //alert('added shape');
						shapes.push(shape);
						if($.isFunction(callback))callback(shape);
				});
			});
		}
	});
	
}

function add_place_point(lat,lng,clear){
	i=0;
	var marker = {};
	marker.style={"icon":siteroot+"Content/images/map_icons/default_icon_{$i}.png"};
	if(typeof(clear)!=='undefined'&&clear) marker.info={};
	marker=$.extend(marker,build_infobox(marker));
	
	if(marker.style.icon){marker.style.icon = marker.style.icon.replace('{$i}',i+1);}
	
	$('#place_drawing_map').gmap('addMarker', $.extend({ 
		'position': (typeof(lat)==='undefined' || lat=='')?$('#place_drawing_map').gmap('get_map_center'):new google.maps.LatLng(lat,lng)
	},{'draggable':true},marker.style),function(markerOptions, marker){
			if(reopen!=false){
				ib[0].open($('#place_drawing_map').gmap('get','map'), marker);
				reopen = false;
			}
			if($("#placeShape :selected").length && $("#placeShape :selected").val()!=""){
				shapes=[];
				loadPlaceShape($("#placeShape :selected").val(),function(shape){
					$('#place_drawing_map').gmap("attach_shape_to_marker",shapes[0],marker);
				});
			}			
	}).click(function() {
		var ib_total = 0;
		//$.each(ib, function(i) {ib[i].close(); ib_total=i; });
		ib[0].open($('#place_drawing_map').gmap('get','map'), this);
		ibOpen=true;
		// need to finish this class
		//$('#centralMap').gmap('openInfoWindow', { 'content': marker.info.content }, this);
	}).dragend(function(e) {
		var placePos = this.getPosition();
		var lat = placePos.lat();
		var lng = placePos.lng();
		if(shapes.length>0){
			$('#place_drawing_map').gmap("move_shape",shapes[0],placePos);
		}
		$('#Lat').val(lat);
		$('#Long').val(lng);
		//setTimeout(function() {},  200);
		if($('#revGoeLookup').is(":checked")){
			var loca = new google.maps.LatLng(lat,lng);
			setGeoCoder().geocode({'latLng':loca}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) { 
					var arrAddress = results[0].address_components;
					
					var itemRoute='';
					var itemLocality='';
					var itemCountry='';
					var itemPc='';
					var itemSnumber='';
					$('#place_address').val('');
					$('#place_street').val('');			
					// iterate through address_component array
					$.each(arrAddress, function (i, address_component) {
						if (address_component.types[0] == "route"){//": route:"
							itemRoute = address_component.long_name;
							$('#place_street').val(itemRoute);
						}
						if (address_component.types[0] == "locality"){//"town:"
							itemLocality = address_component.long_name;
						}
						if (address_component.types[0] == "country"){ //"country:"
							itemCountry = address_component.long_name;
						}
						if (address_component.types[0] == "postal_code_prefix"){ //"pc:"
							itemPc = address_component.long_name;
						}
						if (address_component.types[0] == "street_number"){ //"street_number:"
							itemSnumber = address_component.long_name;
							$('#place_address').val(itemSnumber);
						}
					});
					if (results[1]) {
						//alert( results[1].formatted_address);
						//obj.val(itemSnumber);
					}
				} else {
					alert("Geocoder failed due to: " + status);
				}
			});
		}
		
		$('#estimated_places').show('fast');
		$('#local_place_names').html('loading<span class="blink1">.</span><span class="blink2">.</span><span class="blink3">.</span>');

		$('.blink1').blink(100);
		$('.blink2').blink(150);
		$('.blink3').blink(200);
		$.each(gmap_location_types.length,function(i,v){
			var requested = {
			  location: loca,
			  radius:.1,
			  keyword:gmap_location_types[i]//,
			  //types : [gmap_location_types[i]]
			};
			var gmap = $('#place_drawing_map').gmap('get','map');
			var service = new google.maps.places.PlacesService(gmap);
			service.search(requested, function (results, status) {
				var gmap = $('#place_drawing_map').gmap('get','map');
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					alert('sereching');
					for (var i = 0; i < 1; i++) {
						var request = {reference:results[i].reference};
						var service = new google.maps.places.PlacesService(gmap);
						service.getDetails(request, function(place, status) {
							if (status == google.maps.places.PlacesServiceStatus.OK) {
								if(place.name){
									if($('.blink1').length)$('#local_place_names').html('');
									var txt = $.trim($('#local_place_names').html());
									$('#local_place_names').html(txt+ (txt.indexOf(place.name)>-1 ? '' : (txt==""?'':',') +  place.name ));
								}
							}
						});
					}
				}
			});
		});
	});
	$(this).addClass('ui-state-disabled');
}

function get_Address_latlng(map,address) {
	  setGeoCoder().geocode( { 'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				map.setCenter(results[0].geometry.location);
				/*var marker = new google.maps.Marker({
								map: map,
								position: results[0].geometry.location
							});*/
				//drop1(results[0].geometry.location)	
				var latitude = results[0].geometry.location.lat(); 
				var longitude = results[0].geometry.location.lng(); 
				$('#Lat').val(latitude);		
				$('#Long').val(longitude);		
				
				$('#place_drawing_map').gmap('addMarker', $.extend({ 
					'position': new google.maps.LatLng(latitude,longitude)
				},{})).click(function() {
					//$.each(ib, function(i) {ib[i].close();});
					//ib[i].open($('#place_drawing_map').gmap('get','map'), this);
					//$('#centralMap').gmap('openInfoWindow', { 'content': marker.info.content }, this);
				});
			} else {
				alert("Geocode was not successful for the following reason: " + status);
			}
	  });
}
function infoUpdate(){
	var lat = $('#Lat').val();
	var lng = $('#Long').val();	
		reopen = ibOpen;
		ib[0].close();
		tinyMCE.triggerSave();
		$('#place_drawing_map').gmap('clear','markers');
		$('#place_drawing_map').gmap('clear','services');
		$('#place_drawing_map').gmap('clear','overlays');	
		add_place_point(lat,lng,true);
		watchMediaTab();
}

	
function setup_fixedNav(){
	if ($(window).scrollTop()>= 122) { $('.admin #adminNav').addClass('fixed');  }
	$(window).scroll(function (event) {
		if ($(this).scrollTop()>= 122) {     
			$('.admin #adminNav').addClass('fixed');
		} else { 
			$('.admin #adminNav').removeClass('fixed');
		}  
	});
	$('.Cancel a').click(function(e){
			e.stopPropagation();
			e.preventDefault();
			$("input[value='Cancel']:first").trigger('click');
		});
	$('.Submit a').click(function(e){
			e.stopPropagation();
			e.preventDefault();
			$("input[value='Submit']:first").trigger('click');
		});	
	$('.Apply a').click(function(e){
			e.stopPropagation();
			e.preventDefault();
			$("input[value='Apply']:first").trigger('click');
		});
}




var $tabs = null;
var tab_counter =  0;
var $tab_title_input = $( "#tab_title"),
	$tab_content_input = $( "#tab_content" );

function int_infotabs(){
	$.each('.dyno_tabs',function(i,v){
		//replaced "tab_"+i for $(this).attr('id')
		/*if(!$(this).is($(".tinyLoaded"))){
			load_tiny("bodytext",$(this).attr('id'));
			$(this).addClass("tinyLoaded")
		}*/
		tinyResize();
		set_tab_editable(i);
	});
	$tab_title_input = $( "#tab_title");
	$tab_content_input = $( "#tab_content" );
	tab_counter =  $("#infotabs li.ui-state-default").size();

	// tabs init with a custom tab template and an "add" callback filling in the content
	$tabs = $( "#infotabs").tabs({
		tabTemplate:"<li>"+
						"<a href='#{href}' hideFocus='true'>#{label}</a>"+
							"<input type='hidden' name='tabs["+tab_counter+"].id' value='' id='tab_id_"+tab_counter+"'/>"+
							"<input type='hidden' name='tabs["+tab_counter+"].title' value=\"#{label}\" id='tab_title_"+tab_counter+"'/>"+
							"<input type='hidden' name='tabs["+tab_counter+"].template.id' value='' id='tab_template_id_"+tab_counter+"'/>"+
							"<input type='hidden' name='tabs["+tab_counter+"].sort' value='' id='tab_sort_"+tab_counter+"'class='sort' />"+
							
						"<span class='ui-icon ui-icon-close'>Remove Tab</span>"+
						'<span class="edit ui-icon ui-icon-pencil"></span>'+
					"</li>",
		add: function( event, ui ) {
			var tab_content = $tab_content_input.val() || "Tab " + tab_counter + " content.";
			$( ui.panel ).append( "<textarea id='tab_"+tab_counter+"'  name='tabs["+tab_counter+"].content' class='tinyEditor full' >" + tab_content + "</textarea>" );
			$( ui.panel ).attr('role',tab_counter);
		},
		select: function(event, ui) {tinyMCE.triggerSave();tinyResize();},
		show: function(event, ui) {tinyMCE.triggerSave();tinyResize();}
	});

	$( "#infotabs").find( ".ui-tabs-nav" ).sortable({items: "li:not(.nonsort)",stop: function(event, ui) {
		$.each($("#infotabs .ui-tabs-nav li"),function(i,v){
			$(this).find('.sort').val(i);
			var href = $(this).find('a').attr('href');
			$(''+href).attr('role',i);
			var id=$(href).find('textarea.tinyEditor:first').attr('id');
			tinyMCE.triggerSave();
			if (typeof(id)!=="undefined" && tinyMCE.getInstanceById(id)){
				tinyMCE.execCommand('mceRemoveControl',true,id);
				$("#"+id).removeClass("tinyLoaded");
			}
		});
		var tabs = $('#infotabs');
		var panels = tabs.children('.ui-tabs-panel');
		panels.sort(function (a,b){return $(a).attr('role') >$(b).attr('role') ? 1 : -1;}).appendTo('#infotabs');
  		$.each(panels, function(i, v) {
			var id=$(this).find('textarea:first').attr('id');
			if(!$(this).find('textarea:first').is($(".tinyLoaded"))){ load_tiny("bodytext",id);$(this).find('textarea:first').addClass("tinyLoaded")}
			tinyMCE.triggerSave();
			tinyResize();
			set_tab_editable(i);
		});
	}});
	// modal dialog init: custom buttons and a "close" callback reseting the form inside
	var $dialog = $( "#page_dialog" ).dialog({
		autoOpen: false,
		modal: true,
		buttons: {
			Add: function() {
				tab_counter = addTab(tab_counter);
				$( this ).dialog( "close" );
			},
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		},
		open: function() {
			//$("#taber").get(0).reset();
			$tab_title_input.focus();
		},
		close: function() {
			$("#taber")[0].reset();
		}
	});
	// addTab form: calls addTab function on submit and closes the dialog
	var $form = $( "form#taber", $dialog ).submit(function() {
		tab_counter++;
		addTab(tab_counter);
		$dialog.dialog( "close" );
		return false;
	});
	// addTab button: just opens the dialog
	$( "#add_tab" )
		.button()
		.click(function(e) {
			e.stopPropagation();
			e.preventDefault();
			$dialog.dialog( "open" );
		});
	// close icon: removing the tab on click
	$( "#infotabs span.ui-icon-close" ).live( "click", function() {
		if($( "#deleteconfirm" ).length==0){$('body').append('<div id="deleteconfirm">If you delete this you will have to refresh the page to get it back.<br/><h2>Are you sure?</h2></div>')};
	 	$( "#deleteconfirm" ).dialog({
			autoOpen: false,
			modal: true,
			buttons: {
				Delete: function() {
					var index = $( "li", $tabs ).index( $( this ).parent() );
					$tabs.tabs( "remove", index );
					$( this ).dialog( "close" );
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			}
		}).dialog( "open" );
	});
	watchMediaTab();
}
function set_tab_editable(i){
	var base= '[href="#dyno_tabs_'+i+'"]';
	if($(base).length==0)base= '[href="#tabs-'+i+'"]';
	$(base).closest('li').find('.edit').off('click').on('click',function(e){
		if(!$(this).is('ui-icon-cancel')){// changed hasClass for is for speed
			$(this).addClass('ui-icon-cancel');
			$(base).hide();
			$(base).after('<input type="text" class="titleEdit" value="'+$(base).text()+'" />');
			$(base).closest('li').find('.titleEdit').focus();
			$(base).closest('li').find('.edit').off('click').on('click',function(){
				$(base).closest('li').find('.titleEdit').blur();
			});
			$(base).closest('li').find('.titleEdit').on('blur',function(){
				$(base).closest('li').find('.edit').removeClass('ui-icon-cancel');
				$(base).closest('li').find('.edit').addClass('ui-icon-pencil');
				$(base).text($(this).val());
				$(base).closest('li').find('#tab_title_'+i).val($(this).val());
				$(this).remove();
				$(base).show();
				set_tab_editable(i);
			});
		}
	});
}
function addTab(i,title,content,useWysiwyg,useControlls) {
	
	var title = typeof(title)!=="undefined"?title:false;
	var content = typeof(content)!=="undefined"?content:false; 
	var useWysiwyg = typeof(useWysiwyg)!=="undefined"?useWysiwyg:true;
	var useControlls = typeof(useControlls)!=="undefined"?useControlls:true;
	
	var tab_title = title || $tab_title_input.val() || "Tab " + i;
	
	var controll="";
	if(useControlls)controll="<span class='ui-icon ui-icon-close'>Remove Tab</span>"+
							 '<span class="edit ui-icon ui-icon-pencil"></span>';
	
	
	$tabs.tabs( "option" , "tabTemplate" , "<li>"+
												"<a href='#{href}' hideFocus='true'>#{label}</a>"+
													"<input type='hidden' name='tabs["+i+"].id' value='' id='tab_id_"+i+"'/>"+
													"<input type='hidden' name='tabs["+i+"].title' value=\"#{label}\" id='tab_title_"+i+"'/>"+
													"<input type='hidden' name='tabs["+i+"].template.id' value='' id='tab_template_id_"+i+"'/>"+
													"<input type='hidden' name='tabs["+i+"].sort' value='' id='tab_sort_"+i+"'class='sort' />"+
												controll+
											"</li>" );
	$tabs.tabs( "add", "#tabs-" + i, tab_title.replace('{$i}',i));
	if(content!=false){
		$(content).insertBefore( $("#tab_"+i) );
		$("#tab_"+i).remove();
	}
	if(useWysiwyg)load_tiny("bodytext","tab_"+i);
	
	$.each($("#infotabs li.ui-state-default"),function(i,v){
		$(this).find('.sort').val(i);
		set_tab_editable(i);
	});
	return i++;
}
function watchMediaTab(){
		tab_counter =  $("#infotabs li.ui-state-default").size();
		if($('.imageBox').length>1 && $('#viewTab').length==0){
			var content = '<img class="infotabTemplate" src="../Content/images/gallery_placeholder.png"  id="viewTab" width="297" height="201" />'+
			"<input type=\"hidden\" id='tab_"+tab_counter+"' name=\"tabs["+tab_counter+"].content\" value=\"<img class='infotabTemplate' src='../Content/images/gallery_placeholder.png'  id='viewTab' width='297' height='201' />\" />";
			addTab(tab_counter,"Views",content,false,false);
		}
		if($('.imageBox').length<=1 && $('#viewTab').length>0){
			$('#viewTab').remove();
		}
	}
function setup_massTags(){
	$('#massTagging').live('click',function(e){
				e.stopPropagation();
				e.preventDefault();
				$('#massTaggingarea').slideToggle();
			});	
}

/*
 * EDITOR CONTORL SCRIPTS
 */
function load_place_editor() {
	var lat = $('#Lat').val();
	var lng = $('#Long').val();	
	$('#place_drawing_map').gmap({
			'center': (typeof(lat)==='undefined' || lat=='')? pullman_str : new google.maps.LatLng(lat,lng),
			'zoom':15,
			'zoomControl': false,
			'mapTypeControl': {  panControl: true,  mapTypeControl: true, overviewMapControl: true},
			'panControlOptions': {'position':google.maps.ControlPosition.LEFT_BOTTOM},
			'streetViewControl': false 
		}).bind('init', function () {
			if(lat!='')add_place_point(lat,lng);
			$("#editor_form").autoUpdate({before:function(){tinyMCE.triggerSave();},changed:function(){infoUpdate();}});
		});
	
	$('#setLatLong :not(.ui-state-disabled)').live('click',function(){ add_place_point(lat,lng); });

	int_infotabs();
	
	function revGoeLookup(){
		$("#place_street,#place_address").live('keyup',function () {
			clearCount('codeAddress');
			setCount('codeAddress',500,function(){
				var zip = $('#zcode').length?$('#zcode').text():'';
				var campus = $('#campus').length?$('#place_campus').val():'';
				var lookup = $('#place_street').val()+' '+$('#place_address').val()+', '+campus+' WA '+zip+' USA'; 
				if( $('#place_street').val() !='' &&$('#place_address').val() !='' ) get_Address_latlng($('#place_drawing_map').gmap('get','map'),lookup);
				$('#setLatLong').addClass('ui-state-disabled');
			});
		});
	}
	function killRevGoeLookup(){ $("#place_street,#place_address").die(); }

	if($('#place_street').length>0){
		$('#revGoeLookup').on('change',function(){
			if($(this).is(":checked")){
				revGoeLookup();
			}else{
				killRevGoeLookup();
			}
		});
	}
	tinyResize();
	if ($(window).scrollTop()>= 175) {if($(window).width()<=1065){$('#campusmap').addClass('fixed_min');}else{$('#campusmap').addClass('fixed');} }
	$(window).scroll(function (event) {
		if ($(this).scrollTop()>= 175) {     
			if($(window).width()<=1065){$('#campusmap').addClass('fixed_min');}else{$('#campusmap').addClass('fixed');}
			
		} else { 
			$('#campusmap').removeClass('fixed_min');       
			$('#campusmap').removeClass('fixed');   
			
		}  
	});
	setup_fixedNav();
	$('#shortcode').click(function(e){
			e.stopPropagation();
			e.preventDefault();
			$('#shortcodes').toggle(0,function(){ 
				$("#shortcode").html($("#shortcodes").is(':visible') ? '-' : '+'); 
			});
		}).trigger('click');
	
	
	$.each($('.switch'),function(i,v){
		var self = $(this);
		self.find('a').live('click',function(e){
				e.stopPropagation();
				e.preventDefault();
				self.find('.active').removeClass('active');
				var tar=$(this).attr('id');
				$(this).addClass('active');
				self.find('.'+tar).addClass('active');
			});
	});
	setup_massTags();
}
function load_geometrics_editor() {
     $('#geometrics_drawing_map').gmap({'center': pullman_str , 'zoom':15 }).bind('init', function () {
		 var controlOn=true;
		 var drawingMode = false;
		 
		 var type= $('#startingValue').val();
		 var coords=$('#latLong').val();
		 if(coords=='')coords=$('#geometric_encoded').val();
		 var pointHolder = {};
		 if(coords!='' && type=='polyline'){ 
		 	var pointHolder = {'path' : coords };
		 }
		  if(coords!='' && type=='polygon'){ 
		 	var pointHolder = {'paths' : coords };
		 }
		 if(!$.isEmptyObject(pointHolder)){
			var shape = $.extend( { 'strokeColor':'#000', 'strokeWeight':3 } , {'editable':true} , pointHolder );
		 }else{
			var shape = {};
		 }
			
		$('#geometrics_drawing_map').gmap('init_drawing', 
			{ 
				drawingControl: controlOn,
				polylineOptions:{editable: true} 
			}, $.extend( {
					limit:1,
					limit_reached:function(gmap){},
					encodePaths:false, // always a string
					data_return:'str', // "str" , "obj" (gmap obj) and others to come
					data_pattern:'{lat} {lng}{delimiter}\n',   //
					delimiter:',',
					overlaycomplete:function(data){
							if(data!=null){
								$('#latLong').val(data);
								$('#geometric_encoded').val($('#geometrics_drawing_map').gmap('get_updated_data_encoded'));
							}
						},
					onDrag:function(data){
							$('#latLong').val($('#drawing_map').gmap('get_updated_data'));
							$('#geometric_encoded').val($('#geometrics_drawing_map').gmap('get_updated_data_encoded'));
						},
					drawingmode_changed:function(type){
							if(type!=null){
								$('#style_of').val(type);
							}
						}
				},
				$('#style_of').val()==''?{}:{
					loaded_type: ($('#style_of').val()[0].toUpperCase() + $('#style_of').val().slice(1)),
					loaded_shape:shape
				}
			)
		);

		$('#drawingcontrolls.showing').live('click',function(e){
			e.preventDefault();
			e.stopPropagation();
			$('#geometrics_drawing_map').gmap('hide_drawingControl');
			$(this).removeClass('showing').addClass('hidden').text('Show controlls');
		});
		$('#drawingcontrolls.hidden').live('click',function(e){
			e.preventDefault();
			e.stopPropagation();
			$('#geometrics_drawing_map').gmap('show_drawingControl');
			$(this).removeClass('hidden').addClass('showing').text('Hide controlls');
		});
		$('#restart').live('click',function(e){
			e.preventDefault();
			e.stopPropagation();
			$('#geometrics_drawing_map').gmap('refresh_drawing',false);
		});
		$('#update').live('click',function(e){
			e.preventDefault();
			e.stopPropagation();
			$('#latLong').val($('#geometrics_drawing_map').gmap('get_updated_data'));
			$('#geometric_encoded').val($('#geometrics_drawing_map').gmap('get_updated_data_encoded'));
		});
		$("form#shapeEditor").autoUpdate({
			 before:function(){ 
				$('#update').trigger('click');
			 }
		});
		$('#unselect').live('click',function(e){
			e.preventDefault();
			e.stopPropagation();
			$('#latLong').val($('#geometrics_drawing_map').gmap('unset_drawingSelection'));
		});
		var selected_type = '';
		$('#style_of').live('change',function(){
			var totals = $('#geometrics_drawing_map').gmap('get_drawnElementCount',$(this).val());
			if(totals>=1){
				var r=confirm('You are about to clear the element from the map.\r\n id this ok?');
				if (r==true){
					$('#geometrics_drawing_map').gmap('clear_drawings');
					selected_type = $(this).val();
				}else{
					$(this).val('selected_type');
					return false;
				}
			}
			$('#geometrics_drawing_map').gmap('set_drawingMode', $(this).val());
			$('#geometrics_drawing_map').gmap('show_drawingControl');
		});

	});
	 
}
function load_style_editor(){
	var gmap;
     $('#style_map').gmap({'center': pullman_str , 'zoom':15,'zoomControl': false,'mapTypeControl': false,'panControl':false,'streetViewControl': false  }).bind('init', function () {
		$('#style_map').gmap('stop_scroll_zoom');
		
		$('#style_of').change(function(){
			var sel = $(this).find(':selected').text();
			//create_map_element(sel,style,gmap);
			set_default_shape($('#style_map'),sel);
			$('.tabed').not('[id*=9999]').each(function(){
				var obj=$(this);
				obj.find('.pod').fadeOut('fast');
				obj.find('.pod.op_'+sel).fadeIn('fast');
				if(defined(DEFAULT_overlay)){
					DEFAULT_overlay.setMap(null);
					DEFAULT_overlay.delete;
				}
			});
			set_up_style_list($('.tabed').not('[id*=9999]'),$('#style_map'),sel);	
		});
		if($('.sortStyleOps.orgin').length){
			if($('#style_of').val()!=''){
				set_default_shape($('#style_map'),$('#style_of :selected').text());
				$('#style_of').trigger('change');
			}
		}

		function  addZoomLevel(tab_title,tab_counter,callback){		
			$tabs.tabs( "add", "#tabs-" + tab_counter, tab_title );
			typeof(callback)!=="undefined"?(callback)($("#tabs-" + tab_counter)):null;
		}
	
		if($( ".TABS" ).length>0){
			var $tab_title_input = $( "#tab_title"),
				$tab_content_input = $( "#tab_content" );
			var tab_counter = 0;
			var $tabs = $('.LEVEL_TABS').tabs({
				tabTemplate: "<li><span class='ui-icon ui-icon-close'>Remove Tab</span><a href='#{href}'>#{label}</a> </li>",
				add: function( event, ui ) {
					tab_counter++;
					$( ui.panel ).append($('.clone_pool').html().replace(/[9]{4}/g, (tab_counter>0?tab_counter:tab_counter+1) ).replace(/\|\|/g, '' ) );
					$( ui.panel ).find('.TABS:last').tabs();
					set_slider($('#style_map').gmap('get','map'), $( ui.panel ).find('.TABS:last').find(".slider-range") );
				}
			});
			$( ".LEVEL_TABS span.ui-icon-close" ).live( "click", function() {
				var index = $( "li", $tabs ).index( $( this ).parent() );
				$tabs.tabs( "remove", index );
			});
	
			// addTab button: just opens the dialog
			$( "#add_zoom" )
				.button()
				.on('click',function(e) {
					e.preventDefault();
					e.stopPropagation();
					var tab_title = 'Zoom level:<span class="name__start">0</span><span class="name__endarea"> to <span class="name__end">23</span></span>';
					addZoomLevel(tab_title,tab_counter,function(tab){
						set_slider($('#style_map').gmap('get','map'), tab.find('.slider-range') );
					});
				});
			$( ".TABS:not(.clone_pool .TABS)" ).each(function(i){
				$(this).tabs();
			});
		}	
	
		$( ".slider-range" ).each(function(){ set_slider($('#style_map').gmap('get','map'),$(this) ); });		
		function set_slider(gmap,obj){
			obj.slider({
				range: true,
				min: 0,
				max: 23,
				values: [ 0, 23 ],
				slide: function( event, ui ) {
					var start 	= ui.values[ 0 ];
					var end 	= ui.values[ 1 ];
					
					obj.next( ".__start" ).val(start);
					obj.next( "._end" ).val(end);
					
					var i = obj.closest('.ui-tabs-panel').index(obj.closest('.LEVEL_TABS').find('.ui-tabs-panel'));
					//alert(i);
					obj.closest('.LEVEL_TABS').find('.name__start:eq('+i+')').text(start);
					obj.closest('.LEVEL_TABS').find('.name__end:eq('+i+')').text(end);
					if(start==end){
						obj.closest('.LEVEL_TABS').find('.name__endarea:eq('+i+')').hide();
					}else{
						obj.closest('.LEVEL_TABS').find('.name__endarea:eq('+i+')').show();
					}
						
					obj.closest('.ZoomChoice').find('.name__start').text(start);
					obj.closest('.ZoomChoice').find('.name__end').text(end);
					
					id=parseInt(obj.closest('.ZoomChoice').find('.zoom_select').find('[value="'+start+','+end+'"]').text());
					obj.closest('.ZoomChoice').find('.zoom_select').find('[value="'+start+','+end+'"]').attr('selected',true);
					
					obj.closest('.ZoomChoice').find('.__id').val(id);
					obj.closest('.ZoomChoice').find('.__start').val(start);
					obj.closest('.ZoomChoice').find('.__end').val(end);
				}
			});
		}
			
		function set_up_style_list(tabs,mapSelector,type){

			tabs.find('.sortStyleOps').sortable({
				connectWith:  ".connectedSortable",
				placeholder: "ui-state-highlight",
				stop: function(event, ui) {
					if(ui.item.parent('.sortStyleOps.pool')){
						ui.item.find(':input').val('');
					}
					rebuild_example(tabs,mapSelector,type);
				}
			});
			

			$.each(tabs,function (){
				var tab=$(this);
				var mode = tab.attr('id').split('__')[1].split('_')[1];
				var objs_to_rebuild = tab.find('.sortStyleOps :input');
					objs_to_rebuild.live('change', function(){
						rebuild_example(tabs,mapSelector,type);
					});
					
				$.each(tab.find(".color_picker"),function(i){
					var id = mode+'_'+tab.attr('id')+'_color_picker_'+i;
					//alert(id);
					if($('#'+id).length<=0){
						$(this).attr("id",id);
						$('#'+id).jPicker({
							  window:{
								title: null,
								effects: {
								  type: 'show',
								  speed:{
									show: 'fast',
									hide: 'fast'
								  }
								},
								position:{
								  x: 'screenCenter',
								  y: 'bottom',
								},
								expandable: false,
								liveUpdate: true,
								alphaSupport: false,
								alphaPrecision: 0,
								updateInputColor: true
							  },
							images:{ clientPath:'/Content/js/colorpicker/images/'}
						},function(color, ob){
							rebuild_example(tabs,mapSelector,type);
						},function(color, ob){
							rebuild_example(tabs,mapSelector,type);
						},function(color, ob){
							rebuild_example(tabs,mapSelector,type);
						});
					}
				});
				$( ".opacity" ).each(function(i){
					var subobj = $(this);
					subobj.slider({
						range: 	"min",
						value:	1.0,
						min: 	0.0,
						max:	1.0,
						step: 	.01,
						slide: function( event, ui ) {
							subobj.prev('input').val( ui.value ).trigger('change');
						}
					});
					subobj.prev('input').val(subobj.slider( "value" ));
				});
				$( ".weight" ).each(function(i){
					var subobj = $(this);
					subobj.slider({
						range: 	"min",
						value:	0,
						min: 	0,
						max:	20,
						step: 	.1,
						slide: function( event, ui ) {
							subobj.prev('input').val( ui.value ).trigger('change');
						}
					});
					subobj.prev('input').val(subobj.slider( "value" ));
				});
			});
		}
		if($('#style_of :selected').val()==''){
			$("#add_zoom").trigger('click');	
		}
	});
}


function load_view_editor() {
	var lat = $('#Lat').val();
	var lng = $('#Long').val();	
	var width = $('#width').val();
	var height = $('#height').val();
	var options = {'center': (typeof(lat)==='undefined' || lat=='')? pullman_str : new google.maps.LatLng(lat,lng) , 'zoom':15}
	//var options = {'center': (typeof(lat)==='undefined' || lat=='')? pullman_str : new google.maps.LatLng(lat,lng) , 'zoom':15};
	$.each($('#tabs_Options input.text'),function(i,v){
		var tmpVal = $(this).val();
		if(tmpVal!=""){
			if(isNumber(tmpVal)){
				if(tmpVal>0){
					var tmp = {} 
					tmp[$(this).attr("id")]=tmpVal;
					$.extend(options,tmp);
				}
			}else{
				var tmp = {} 
				tmp[$(this).attr("id")]=tmpVal;
				$.extend(options,tmp);
			}
		}
	});	
	//alert(dump(options));
	
	
	$('#place_drawing_map').gmap(options).bind('init', function () {
		//alert(dump(options));
		//if(lat!='')add_place_point(lat,lng);
		//autoUpdate($("#editor_form"),{before:function(){tinyMCE.triggerSave();},changed:function(){infoUpdate();}});
		//$("#editor_form").autoUpdate({before:function(){tinyMCE.triggerSave();},changed:function(){infoUpdate();}});
		google.maps.event.addListener($('#place_drawing_map').gmap('get','map'), 'drag',function(){
			var center = $('#place_drawing_map').gmap('get_map_center');
			//$('#place_drawing_map').gmap('setOptions',{center},$('#place_drawing_map').gmap('get','map'));
			var lat = $('#Lat').val( center.lat() );
			var lng = $('#Long').val( center.lng() );	
		});
	}).resizable({
			helper: "ui-resizable-helper",
			stop: function(event, ui) {
					var width = $('#width').val(ui.size.width);
					var height = $('#height').val(ui.size.height);
					$('#place_drawing_map').gmap('refresh');
				}
		});


	
	int_infotabs();
	tinyResize();
	
/*	if ($(window).scrollTop()>= 175) {if($(window).width()<=1065){$('#campusmap').addClass('fixed_min');}else{$('#campusmap').addClass('fixed');} }
	$(window).scroll(function (event) {
		if ($(this).scrollTop()>= 175) {     
			if($(window).width()<=1065){$('#campusmap').addClass('fixed_min');}else{$('#campusmap').addClass('fixed');}
			
		} else { 
			$('#campusmap').removeClass('fixed_min');       
			$('#campusmap').removeClass('fixed');   
			
		}  
	});*/
	setup_fixedNav();
	
	$('#shortcode').click(function(e){
			e.stopPropagation();
			e.preventDefault();
			$('#shortcodes').toggle(0,function(){ 
				$("#shortcode").html($("#shortcodes").is(':visible') ? '-' : '+'); 
			});
		}).trigger('click');

	$.each($('.switch'),function(i,v){
		var self = $(this);
		self.find('a').live('click',function(e){
				e.stopPropagation();
				e.preventDefault();
				self.find('.active').removeClass('active');
				var tar=$(this).attr('id');
				$(this).addClass('active');
				self.find('.'+tar).addClass('active');
			});
	});
	
	setup_massTags();
	
	var waiting = false;	
	$('#urlAlias').live('keyup',function(){
		var val = $(this).val().replace(/[^a-zA-Z0-9-_]/g, '-'); 
		if(!waiting){
			waiting = true;
			$.post('/view/aliasCheck.castle?alias='+val, function(data) {
				if(data=="true"){
					$('.aliasState').addClass('ok');
					$('.aliasState').removeClass('error');
					$('.aliasState').text('  :  available');
				}else{
					$('.aliasState').addClass('error');
					$('.aliasState').removeClass('ok');
					$('.aliasState').text('  :  taken');
				}
				waiting = false;
			});
		}
		$('.outputurl').text(val);
		$(this).val(val);
	});	
}



/* -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */
/* this is where the fuss start and needs to be 
cleaned out or refactored back up the chain here */
function turnOnPOI(){
	var onPOIbiz = [
	  {
		featureType: 'poi',
		elementType: 'geometry',
		stylers: [
		  { visibility: 'on' }
		]
	  }
	];

	var mapType = new google.maps.StyledMapType(onPOIbiz, { name:
'No Stations' });	
	map.mapTypes.set('nostations', mapType);
	map.setMapTypeId('nostations');
}
function turnOffPOI(){
	var offPOIbiz = [
	  {
		featureType: 'poi',
		elementType: 'all',
		stylers: [
		  { visibility: 'off' }
		]
	  }
	];

	var mapType = new google.maps.StyledMapType(offPOIbiz, { name:
'No Stations' });	
	map.mapTypes.set('nostations', mapType);
	map.setMapTypeId('nostations');
	
	
	}

function applyType(type){
	var applyTypeOf = [
	  {
		featureType: 'poi',
		elementType: 'all',
		stylers: [
		  { visibility: 'off' }
		]
	  },
	  {
		featureType: type,
		elementType: 'all',
		stylers: [
		  { visibility: 'on' }
		]
	  }
	];
	var mapType = new google.maps.StyledMapType(applyTypeOf, { name:'No Stations' });	
	map.mapTypes.set('nostations', mapType);
	map.setMapTypeId('nostations');
}

/* check for deletion */	
function getResolution(lat, zoom, tile_side){
  var grid = tile_side || 256;
  var ret = {};
  ret.meterperpixel = 2 * Math.PI * 6378100 * Math.cos(lat * Math.PI/180) / Math.pow(2, zoom) / grid;
  ret.cmperpixel = ret.meterperpixel * 100;
  ret.mmperpixel = ret.meterperpixel * 1000;
  ret.pretty = ( Math.round(ret.meterprepixel) ) + ' meters/px';
  if (ret.meterperpixel < 10)	{ ret.pretty = ( Math.round( ret.meterperpixel * 10 ) / 10 ) +' meters/px';}
  if (ret.meterperpixel < 2)	{ ret.pretty = ( Math.round( ret.cmperpixel ) ) + ' cm/px';}
  if (ret.cmperpixel < 10)		{ ret.pretty = ( Math.round( ret.cmperpixel * 10 ) / 10 ) + ' cm/px';}
  if (ret.cmperpixel < 2) 		{ ret.pretty = ( Math.round( ret.mmperpixel ) ) + ' mm/px';}
  return ret;
}
function setZoomTooltip(){
	var res = getResolution(map.getCenter().lat(), map.getZoom()).pretty;
	var text = 'Zoom = ' + map.getZoom() + '  (' + res + ')';
	var divs = map.getDiv().getElementsByTagName('div');
	for (var i=0, len=divs.length; i<len; i++){
		if (divs[i].title.toLowerCase().indexOf("zoom") > -1) {
			divs[i].title = text;
		}
	}
}