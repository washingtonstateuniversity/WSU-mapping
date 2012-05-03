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
// jeremy's map control
//-------------------------------------------------------------------------------------------------------------------------------------------------------------
/* example till done then remove */
function jsonloadPage(id,clear,keepMarkers,keepPolys,keepibLabels) {
	clear=typeof(clear)!="undefined"||clear!=null?clear:false;
	keepMarkers=typeof(keepMarkers)!="undefined"||keepMarkers!=null?keepMarkers:false;
	keepPolys=typeof(keepPolys)!="undefined"||keepPolys!=null?keepPolys:false;
	keepibLabels=typeof(keepibLabels)!="undefined"||keepibLabels!=null?keepibLabels:false;

	if(clear){
		if(!keepMarkers){deleteMarkers();}
		if(!keepPolys){deletePolys();}
		if(!keepibLabels){deleteibLabels()};
	}
	
	points=null;
	
	var summaryPanel = document.getElementById("directions_panel");
	summaryPanel.innerHTML = "";
	waypts = [];
	checkboxArray = [];
	polylineOptions = [];
	depth=0;
	fractal=0;
	iterator = 0;
	points=[];
	labelStyles=[];
	keysOrder=[];
	var bkImage='/uploads/siteTheme/backgrounds/lakeside.jpg';
	var signImage='/uploads/siteTheme/signs/bywaysign.png';
	
	bounds = new google.maps.LatLngBounds();
	var jqxhr = $.getJSON("/feeds/route.php",  {
			  pageData: id,
			  route:"true",
			  displaytype: 'all_full'
			  }, function(rdata) {
					if(debug_action=='alert_return'){//alert("success");
									//alert(dump(rdata));
									}
					
					
					var address='';
					var parent_id='15';
					$.each(rdata, function(key, rpoints) {
					if(debug_action=='alert_return'){//alert(dump(rpoints));
									//alert(dump(rpoints.content));
									//alert(dump(rpoints.extensions));
									}
				//$("<div>").html(rdata.extensions.PageSummary.data).appendTo("#images");
					if(rpoints.extensions){
						if(typeof(rpoints.extensions.pageImage) !== 'undefined'&&rpoints.item==id){
							bkImage=rpoints.extensions.pageImage.data.toString();
						}
					}
					if(bkImage!=$('body').css('background-image'))switchBk(bkImage);			
					if(key==0){set_up_gal();}
					address=rpoints.extensions.address.data.toString().split(',');
					//if(debug_action)console.log('calcRoute---- points length is '+points.length);
					if(rpoints.item.toString()!=''){
						if(count(address)>1){
							if(rpoints.item.toString()!=''&&address[0].toString()!=''){
								points[rpoints.item.toString()]=new google.maps.LatLng(parseFloat(address[0].toString()),parseFloat(address[1].toString()));
								//console.log('calcRoute---- parseFloat(address[0].toString())-->'+parseFloat(address[0].toString()));
								//console.log('calcRoute---- parseFloat(address[1].toString())-->'+parseFloat(address[1].toString()));
							}
						}else{
							if(rpoints.item.toString()!=''&&rpoints.extensions.address.data.toString()!=''){
								points[rpoints.item.toString()]=rpoints.extensions.address.data.toString();
								//console.log('calcRoute---- rpoints.extensions.address.data.toString()-->'+rpoints.extensions.address.data.toString());
							}
						}
					}
			//points=clear_empty(points);
			//if(debug_action)console.log('calcRoute---- points-->'+points);
			//if(debug_action)console.log('calcRoute---- points.length-->'+count(points));
					var pointlabel='';
						if(typeof(rpoints.extensions.pointlabel) !== 'undefined'){
							pointlabel=rpoints.extensions.pointlabel.data.toString();
						}
					messArray[rpoints.item.toString()]=pointlabel;
					labelStyles[rpoints.item.toString()]=jQuery.parseJSON(rpoints.extensions.labelPosition.data.toString());
					keysOrder.push(rpoints.item.toString());
					parent_id=rpoints.parents.id.toString();
				});
				

/*example of array
					var polyOps = [{
							map: map, 
							strokeColor: "#a41a19", 
							strokeOpacity: 0.77,
							strokeWeight:3,
							zIndex:99,
							path:null
							}];
*/

					var polyOps=[];
					var polyOpsTmp=[];
					
					$.getJSON("/feeds/route.php",  {
						  pageData: parent_id,
						  displaytype: 'full'
						  }, function(rdata) {
							if(typeof(rdata.extensions.center) !== 'undefined'){
								center=rdata.extensions.center.data.toString().split(',');
								mapCenter=new google.maps.LatLng(parseFloat(center[0]),parseFloat(center[1]));
							}
							var polyOpsCustom=jQuery.parseJSON(rdata.extensions.RouteOptions.data.toString());
							var polyOpsCustom=jQuery.parseJSON(rdata.extensions.RouteOptions.data.toString());

							polyOpsTmp['strokeColor']=polyOpsCustom['strokeColor'].toString();
							polyOpsTmp['strokeOpacity']=parseFloat(polyOpsCustom['strokeOpacity']);
							polyOpsTmp['strokeWeight']=parseInt(polyOpsCustom['strokeWeight']);
							polyOpsTmp['zIndex']='99';
							//console.log('+++++++++++++++++++++++++++\r\n\tdump(polyOpsTmp)==>>'+dump(polyOpsTmp));
							polyOpsTmp['map'] = map;
							polyOps.push(polyOpsTmp);
							
							//console.log('+++++++++++++++++++++++++++\r\n\tdump(points)==>>'+dump(points));
							if(rdata.extensions){
								if(typeof(rdata.extensions.routeSign) !== 'undefined'){
									signImage=rdata.extensions.routeSign.data.toString();
								}
							}
							//console.log('+++++++++++++++++++++++++++\r\n\tjsonloadPage--BEFORE-RECIVED-----Gzoom==>>'+Gzoom);
							if(rdata.extensions){
								if(typeof(rdata.extensions.zoom) !== 'undefined'){
									Gzoom=rdata.extensions.zoom.data.toString();
									//console.log('+++++++++++++++++++++++++++\r\n\tjsonloadPage--RECIVED-----Gzoom==>>'+Gzoom);
								}
							}
							if(signImage!=$('#roadsign img').attr('src'))switchSign(signImage);
							set_up_gal();
							//console.log('+++++++++++++++++++++++++++\r\n\tjsonloadPage--AFTER-RECIVED-----Gzoom==>>'+Gzoom);
							calcRoute(id,start,end,points,polyOps,messArray,keysOrder,bounds,depth,function(){});
					});
				})
				.success(function() {  })
				.error(function() {
					if(debug_action)alert("error");
				})
				.complete(function() { });
				
				// perform other work here ...
				// Set another completion function for the request above
				jqxhr.complete(function(){

				});
				
				//console.log('+++++++++++++++++++++++++++\r\n\tjsonloadPage--END-----zoom==>>'+parseInt(map.getZoom()));
}

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
			   options[$(this).attr('rel')]= ($(this).hasClass('color_picker') ? '#' : '') +''+$(this).val();
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
		mainimage = "<span class='headImage' rel='gouped'><a href='#' class='imgEnlarge'></a><img src='/media/download.castle?placeid=" + $("#place_id").val() + "&id=" + $(".placeImages").first().val() + "&m=crop&w=148&h=100' title='/media/download.castle?placeid=" + $("#place_id").val() + "&id=" + $(".placeImages").first().val() + "' alt='Evergreen' class='img-main'/></span>";
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

		var box='<div id="taby'+i+'" class="ui-tabs ui-widget ui-widget-content ui-corner-all" style="margin-bottom:67px;">'+
					'<ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">'+nav+'</ul>'+
					content+
					'<div class="ui-tabs-panel-cap ui-corner-bottom"><span class="arrow"></span></div>'+
				'</div>';
			
	var myOptions = {
		alignBottom:true,
		 content: box//boxText
		,disableAutoPan: false
		,maxWidth: 0
		,pixelOffset: new google.maps.Size(-200, -36)
		,zIndex: 99
		,boxStyle: {
		 // background: "url('/Content/images/sudo_infobottom.png') no-repeat center bottom",
		  width: "400px"
		 }
		,closeBoxMargin: "10px 2px 2px 2px"
		,closeBoxURL: "/Content/images/close.png"
		,infoBoxClearance: new google.maps.Size(1, 1)
		,isHidden: false
		,pane: "floatPane"
		,enableEventPropagation: false
		,onClose:function(){
					ibOpen=false;
				}
		,onOpen:function(){
					$('#taby'+i).tabs();
					$('#taby'+i).hover(function(){
							ib[0].setOptions({enableEventPropagation: true});
						},function(){
							ib[0].setOptions({enableEventPropagation: false});
						});
					ibOpen=true;
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
	ib[0] = new InfoBox(myOptions,function(){});
	return item;
}

function add_place_point(lat,lng,clear){
	i=0;
	var marker = {};
	marker.style={"icon":"http://dev-mcweb.it.wsu.edu/campusmap.com/Content/images/default_icon_{$i}.png"};
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
		}).click(function() {
		var ib_total = 0;
		//$.each(ib, function(i) {ib[i].close(); ib_total=i; });
		ib[0].open($('#place_drawing_map').gmap('get','map'), this);
		ibOpen=true;
		// need to finish this class
		//$('#centralMap').gmap('openInfoWindow', { 'content': marker.info.content }, this);
	}).dragend(function(e) {
		var lat = this.getPosition().lat();
		var lng = this.getPosition().lng();
		$('#Lat').val(lat);
		$('#Long').val(lng);
		//setTimeout(function() {},  200);
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
}
function tinyResize(id){
		$(window,'#tabs_Text').resize(function(){
			if(typeof(id)==='undefinded'){
				$.each($('textarea.tinyEditor'), function(i, v) {
					var id=$(this).attr('id');
					$('#'+id+"_tbl").width($('#infotabs').width()-40);
				});
			}else{
				$('#'+id+"_tbl").width($('#infotabs').width()-40);	
			}
		}).trigger("resize");
	}
/*
 * EDITOR CONTORL SCRIPTS
 */	
function load_place_editor() {
	var lat = $('#Lat').val();
	var lng = $('#Long').val();	
	$('#place_drawing_map').gmap({'center': (typeof(lat)==='undefined' || lat=='')? pullman_str : new google.maps.LatLng(lat,lng) , 'zoom':15,'zoomControl': false,'mapTypeControl': {  panControl: true,  mapTypeControl: true, overviewMapControl: true},'panControlOptions': {'position':google.maps.ControlPosition.LEFT_BOTTOM},'streetViewControl': false }).bind('init', function () {
		if(lat!='')add_place_point(lat,lng);
		//autoUpdate($("#editor_form"),{before:function(){tinyMCE.triggerSave();},changed:function(){infoUpdate();}});
		$("#editor_form").autoUpdate({before:function(){tinyMCE.triggerSave();},changed:function(){infoUpdate();}});
	});
	
	$('#setLatLong :not(.ui-state-disabled)').live('click',function(){
		add_place_point(lat,lng);
	});

	$.each('.dyno_tabs',function(i,v){
		load_tiny("bodytext","tab_"+i);
		tinyResize();
	});
	var $tab_title_input = $( "#tab_title"),
		$tab_content_input = $( "#tab_content" );
	var tab_counter =  $("#infotabs li.ui-state-default").size();

	// tabs init with a custom tab template and an "add" callback filling in the content
	var $tabs = $( "#infotabs").tabs({
		tabTemplate:"<li>"+
						"<a href='#{href}' hideFocus='true'>#{label}</a>"+
						"<input type='hidden' name='tabs["+tab_counter+"].id' value='' />"+
						"<input type='hidden' name='tabs["+tab_counter+"].title' value='#{label}' />"+
						"<input type='hidden' class='sort' name='tabs["+tab_counter+"].sort' value='' />"+
						"<span class='ui-icon ui-icon-close'>Remove Tab</span>"+
					"</li>",
		add: function( event, ui ) {
			var tab_content = $tab_content_input.val() || "Tab " + tab_counter + " content.";
			$( ui.panel ).append( "<textarea id='tab_"+tab_counter+"'  name='tabs["+tab_counter+"].content' class='tinyEditor' >" + tab_content + "</textarea>" );
			$( ui.panel ).attr('role',tab_counter);
		},
		select: function(event, ui) {tinyMCE.triggerSave();tinyResize();}
	});
	// actual addTab function: adds new tab using the title input from the form above
	function addTab() {
	
		var tab_title = $tab_title_input.val() || "Tab " + tab_counter;
		$tabs.tabs( "option" , "tabTemplate" , "<li>"+
													"<a href='#{href}' hideFocus='true'>#{label}</a>"+
													"<input type='hidden' name='tabs["+tab_counter+"].id' value='' />"+
													"<input type='hidden' name='tabs["+tab_counter+"].title' value='#{label}' />"+
													"<input type='hidden' class='sort' name='tabs["+tab_counter+"].sort' value='' />"+
													"<span class='ui-icon ui-icon-close'>Remove Tab</span>"+
												"</li>" );
		
		$tabs.tabs( "add", "#tabs-" + tab_counter, tab_title.replace('{$i}',tab_counter));
		load_tiny("bodytext","tab_"+tab_counter);
		$.each($("#infotabs li.ui-state-default"),function(i,v){
			$(this).find('.sort').val(i);
		});
		tab_counter++;
	}
	$( "#infotabs").find( ".ui-tabs-nav" ).sortable({items: "li:not(.nonsort)",stop: function(event, ui) {
		$.each($("#infotabs .ui-tabs-nav li"),function(i,v){
			$(this).find('.sort').val(i);
			var href = $(this).find('a').attr('href');
			$(''+href).attr('role',i);
			var id=$(''+href).find('textarea:first').attr('id');
			tinyMCE.triggerSave();	
			if (tinyMCE.getInstanceById(id)){tinymce.execCommand('mceRemoveControl',true,id); }
		});
		var tabs = $('#infotabs');
		var panels = tabs.children('.ui-tabs-panel');
		panels.sort(function (a,b){return $(a).attr('role') >$(b).attr('role') ? 1 : -1;}).appendTo('#infotabs');
  		$.each(panels, function(i, v) {
			var id=$(this).find('textarea:first').attr('id');
			load_tiny("bodytext",id);
			tinyResize();
		});
	}});

	// modal dialog init: custom buttons and a "close" callback reseting the form inside
	var $dialog = $( "#page_dialog" ).dialog({
		autoOpen: false,
		modal: true,
		buttons: {
			Add: function() {
				addTab();
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
		addTab();
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
	// note: closable tabs gonna be an option in the future - see http://dev.jqueryui.com/ticket/3924
	$( "#infotabs span.ui-icon-close" ).live( "click", function() {
		var index = $( "li", $tabs ).index( $( this ).parent() );
		$tabs.tabs( "remove", index );
	});

	if($('#place_street').length>0){
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
	tinyResize();
	if ($(window).scrollTop()>= 61) { $('#campusmap').addClass('fixed'); }
	$(window).scroll(function (event) {
		if ($(this).scrollTop()>= 61) {      
			$('#campusmap').addClass('fixed');    
		} else {       
			$('#campusmap').removeClass('fixed');   
		}  
	});
	
	
	
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
	
	$('#massTagging').live('click',function(e){
				e.stopPropagation();
				e.preventDefault();
				$('#massTaggingarea').slideToggle();
			});
	
	
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
	
function unselectMarkers() {
  for (var i = 0; i < currentResults.length; i++) {
	currentResults[i].unselect();
  }
}
function doSearch() {
  var query = document.getElementById("queryInput").value;
  localSearches.setCenterPoint(map.getCenter());
  localSearches.execute(query);
}
// Called when Local Search results are returned, we clear the old
// results and load the new ones.
function OnLocalSearch() {
  if (!localSearches.results) return;
  var searchWell = document.getElementById("searchwell");

  // Clear the map and the old search well
  searchWell.innerHTML = "";
  for (var i = 0; i < currentResults.length; i++) {
	currentResults[i].marker().setMap(null);
  }
  // Close the infowindow
  infowindow.close();

  currentResults = [];
  for (var i = 0; i < localSearches.results.length; i++) {
	currentResults.push(new LocalResult(localSearches.results[i]));
  }

  var attribution = localSearches.getAttribution();
  if (attribution) {
	document.getElementById("searchwell").appendChild(attribution);
  }

  // Move the map to the first result
  var first = localSearches.results[0];
  map.setCenter(new google.maps.LatLng(parseFloat(first.lat),
										parseFloat(first.lng)));

}
// Cancel the form submission, executing an AJAX Search API search.
function CaptureForm(searchForm) {
  localSearches.execute(searchForm.input.value);
  return false;
}
// A class representing a single Local Search result returned by the
// Google AJAX Search API.
function LocalResult(result) {
	var me = this;
	me.result_ = result;
	me.results = JSON.stringify(result); 
	alert(me.results);
	alert(result.titleNoFormatting);
	me.resultNode_ = me.node();
	me.marker_ = me.marker();
	google.maps.event.addDomListener(me.resultNode_, 'mouseover', function() {
		// Highlight the marker and result icon when the result is
		// mouseovered.  Do not remove any other highlighting at this time.
		me.highlight(true);
	});
	google.maps.event.addDomListener(me.resultNode_, 'mouseout', function() {
		// Remove highlighting unless this marker is selected (the info
		// window is open).
		if (!me.selected_) me.highlight(false);
	});
	google.maps.event.addDomListener(me.resultNode_, 'click', function() {
		me.select();
	});
	  $('#searchwell').append(me.result_.titleNoFormatting);
	}

	LocalResult.prototype.node = function() {
	if (this.resultNode_) return this.resultNode_;
		return this.html();
};
	
// Returns the GMap marker for this result, creating it with the given
// icon if it has not already been created.
LocalResult.prototype.marker = function() {
	var me = this;
	if (me.marker_) return me.marker_;
	var marker = me.marker_ = new google.maps.Marker({
	position: new google.maps.LatLng(parseFloat(me.result_.lat),
									 parseFloat(me.result_.lng)),
	icon: gYellowIcon, shadow: gSmallShadow, map: map});
	google.maps.event.addListener(marker, "click", function() {
		me.select();
	});
	return marker;
};

// Unselect any selected markers and then highlight this result and
// display the info window on it.
LocalResult.prototype.select = function() {
  unselectMarkers();
  this.selected_ = true;
  this.highlight(true);
  infowindow.setContent(this.html(true));
  infowindow.open(map, this.marker());
};

LocalResult.prototype.isSelected = function() {
  return this.selected_;
};

// Remove any highlighting on this result.
LocalResult.prototype.unselect = function() {
  this.selected_ = false;
  this.highlight(false);
};

// Returns the HTML we display for a result before it has been "saved"
LocalResult.prototype.html = function() {
  var me = this;
  var container = document.createElement("div");
  container.className = "unselected";
  $(container).append(me.result_.titleNoFormatting);
  return container;
}

LocalResult.prototype.highlight = function(highlight) {
  this.marker().setOptions({icon: highlight ? gRedIcon : gYellowIcon});
  this.node().className = "unselected" + (highlight ? " red" : "");
}
function codeAddress(address) {
	  setGeoCoder().geocode( { 'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				map.setCenter(results[0].geometry.location);
				/*var marker = new google.maps.Marker({
								map: map,
								position: results[0].geometry.location
							});*/
				drop1(results[0].geometry.location)	
				var latitude = results[0].geometry.location.lat(); 
				var longitude = results[0].geometry.location.lng(); 
				$('#Lat').val(latitude);		
				$('#Long').val(longitude);			
			} else {
				alert("Geocode was not successful for the following reason: " + status);
			}
	  });
}
	
	
	
	

/* marked for removal */
function initialize() {
	if($('#map_canvas').length){
		boxText.innerHTML = setBoxHtml();
		

		ib = generic_infoBox();

		var baseOptions = {
			zoom: 15,
			center: pullman
		}
	
	
	
		var myOptions = {
			draggableCursor: 'default',
			draggingCursor: 'pointer',
		}
		var noPOIbiz = [
			{
				featureType: 'poi',
				elementType: 'all',
				stylers: [
					{ visibility: 'off' }
				]
			}
		];

		var controlState = controlsIn;
		map = new google.maps.Map(gob('map_canvas'), jQuery.extend(jQuery.extend(baseOptions,myOptions),controlState));
	
		var mapTypeControls= {		
			mapTypeControlOptions:false,//{style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		map.setOptions(mapTypeControls); 
		polyPoints = new google.maps.MVCArray(); // collects coordinates

		var defaultBounds = new google.maps.LatLngBounds(
			new google.maps.LatLng(46.751153008636884,-117.19614028930664),
			new google.maps.LatLng(46.70902969569674, -117.1084213256836)
		);
		
		var input = document.getElementById('searchTextField');
		var options = {
			bounds: defaultBounds
		};
	
		autocomplete = new google.maps.places.Autocomplete(input, options);		
		autocomplete.bindTo('bounds', map);
		
		google.maps.event.addListener(autocomplete, 'place_changed', function() {
			var place = autocomplete.getPlace();
			referenceId=place.reference;
			if (place.geometry.viewport) {
				map.fitBounds(place.geometry.viewport);
			} else {
				map.setCenter(place.geometry.location);
				map.setZoom(17);
			}
			var image = new google.maps.MarkerImage(
				place.icon, new google.maps.Size(71, 71),
				new google.maps.Point(0, 0), new google.maps.Point(17, 34),
				new google.maps.Size(35, 35));
			//marker.setIcon(image);
			marker.setPosition(place.geometry.location);
			
			if(typeof(place)!=="undefined"){
				ib.setContent(setBoxHtml(JSON.stringify(place).split('":"').join('":<br/>"').split(',').join("<br/>")));
				ib.open(map, marker);
				doAplace();
			}
		
		});		
	 
		//var geocoder = new google.maps.Geocoder();  
		 $(function() {

			 $("#searchbox").autocomplete({
			 
			   source: function(request, response) {
	
			 // if (geocoder == null){
			 //  geocoder = new google.maps.Geocoder();
			 // }
				 setGeoCoder().geocode( {'address': request.term }, function(results, status) {
				   if (status == google.maps.GeocoderStatus.OK) {
	
						var searchLoc = results[0].geometry.location;
						var lat = results[0].geometry.location.lat();
						var lng = results[0].geometry.location.lng();
						var latlng = new google.maps.LatLng(lat, lng);
						var bounds = results[0].geometry.bounds;
	
					  setGeoCoder().geocode({'latLng': latlng}, function(results1, status1) {
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
			if($('.place.editor_place').length){
				//if($('#Lat').val()!='' && $('#Long').val()!='')drop1(); 
				
				/*$('#setLatLong :not(.ui-state-disabled)').live('click',function(){
					drop1();
					$(this).addClass('ui-state-disabled');
				});*/
			}
		});
	}
	addpoly_poly(map);
	if($('.sortStyleOps.orgin').length){
		//make_wsu_logo_map(map,"polygon");
		if($('#style_of').val()!=''){
			set_default_shape(map,$('#style_of :selected').text());
			$('#style_of').trigger('change');
		}
	}
}
/* marked for removal */
function createLocationMarker(position,returnIt){
		var marker = new google.maps.Marker({
			map: map,
			draggable: true,
			position: position,
			animation: google.maps.Animation.DROP
		});
		if(typeof(returnIt)!=='undefined'){return marker};
	}
/* marked for removal */
function updating(results, status, callback) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
			//alert(JSON.stringify(results));
          for (var i = 0; i < 1; i++) {
			var request = {reference:results[i].reference};
			var service = new google.maps.places.PlacesService(map);
			//service.search(request, serach_callback);
			service.getDetails(request, function(place, status) {
			  if (status == google.maps.places.PlacesServiceStatus.OK) {
				if(typeof(callback)!=='undefined')callback(place);
			  }
			});
            //createMarked(results[i]);
          }
        }
      }
function calling(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < 1; i++) {
			var request = {
			  reference: ''.results[i].reference//'CmRdAAAAsaGp7A4SEbjlQjxXgMQ79HWqRNgB0y1NdT3-CfboiUxFAHpr4U3jFMKfnlg2Pp_2FTD2Y0Ogai6OmfsoqY338hzJVxBbQRHj-ojU5ww3HGU88wqp4VTAPPURR4HhWkYUEhCwcz3UjMjWs8GPYn7TLLYdGhQYM2WVQdh7QMqLSfgOMzxW1N8pQg' /// bookie
			};

			var service = new google.maps.places.PlacesService(map);
			service.search(request, serach_callback);
			service.getDetails(request, function(place, status) {
			  if (status == google.maps.places.PlacesServiceStatus.OK) {
				var marker = createLocationMarker( place.geometry.location , true );
				
				
			var boxText = document.createElement("div");
			//boxText.style.cssText = "border:none; background:transparent url('http://dev-mcweb.it.wsu.edu/jeremys%20sandbox/gMaps/movie_clouds.gif') no-repeat left bottom;";
			boxText.innerHTML = setBoxHtml();
	
			var myOptions = {
				content: boxText,
				disableAutoPan: false,
				maxWidth: 0,
				pixelOffset: new google.maps.Size(-15,-15),
				boxClass:"infoBoxin",
				zIndex:1,
				boxStyle: { 
				  background: "#ccc url('http://dev-mcweb.it.wsu.edu/jeremys%20sandbox/gMaps/movie_clouds.gif') no-repeat left bottom",
				  opacity: 1.0,
				  width: "500px"//,
				  //height:"500px"
				 },
				closeBoxMargin: "10px 2px 2px 2px",
				closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
				infoBoxClearance: new google.maps.Size(1, 1),
				isHidden: false,
				pane: "floatPane",
				enableEventPropagation: false
			};
				
				var ib = new InfoBox(myOptions);
				google.maps.event.addListener(marker, 'click', function() {
					ib.close();
				  ib.setContent(setBoxHtml(JSON.stringify(place)));
				  ib.open(map, this);
				});
			  }
			});
            //createMarked(results[i]);
          }
        }
      }
/* marked for removal */
function createMarked(place) {
        var placeLoc = place.geometry.location;
        var marked = new google.maps.Marker({
          map: map,
          position: place.geometry.location,
		  draggable: true
        });

			var boxText = document.createElement("div");
			//boxText.style.cssText = "border:none; background:transparent url('http://dev-mcweb.it.wsu.edu/jeremys%20sandbox/gMaps/movie_clouds.gif') no-repeat left bottom;";
			boxText.innerHTML = setBoxHtml();
	
			var myOptions = {
				content: boxText,
				disableAutoPan: false,
				maxWidth: 0,
				pixelOffset: new google.maps.Size(-15,-15),
				boxClass:"infoBoxin",
				zIndex:1,
				boxStyle: { 
				  background: "#ccc url('http://dev-mcweb.it.wsu.edu/jeremys%20sandbox/gMaps/movie_clouds.gif') no-repeat left bottom",
				  opacity: 1.0,
				  width: "500px"//,
				  //height:"500px"
				 },
				closeBoxMargin: "10px 2px 2px 2px",
				closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
				infoBoxClearance: new google.maps.Size(1, 1),
				isHidden: false,
				pane: "floatPane",
				enableEventPropagation: false
			};
	 
			google.maps.event.addListener(marker, "click", function (e) {
				ib.open(map, this);
			});
	 
			var ib = new InfoBox(myOptions);
		

		
		
		
		//marked.setAnimation(google.maps.Animation.BOUNCE);
        google.maps.event.addListener(marked, 'click', function() {
          ib.setContent(JSON.stringify(place).split('":"').join('":<br/>"').split(',').join("<br/>"));
          ib.open(map, this);
        });
      }
/* marked for removal */
function doAplace(){
	var request = {
	  reference:referenceId
	};

	var infowindow = new google.maps.InfoWindow();
	var service = new google.maps.places.PlacesService(map);

	service.getDetails(request, function(place, status) {
	  if (status == google.maps.places.PlacesServiceStatus.OK) {
		var marker = new google.maps.Marker({
		  map: map,
		  position: place.geometry.location
		});
		google.maps.event.addListener(marker, 'click', function() {
		  infowindow.setContent(place.name);
		  infowindow.open(map, this);
		});
	  }
	});		
}
/* marked for removal */
function serach_callback(results, status) {
//        if (status == google.maps.places.PlacesServiceStatus.OK) {
//          for (var i = 0; i < results.length; i++) {
//            createSerachMarker(results[i]);
//          }
//        }else{
//		//alert(status);	
//		}
}
 /* marked for removal */
function createSerachMarker(place) {
	var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});
	
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(place.name);
		infowindow.open(map, this);
	});
}	
/*delete */
function setTmp(_var) {	
temp_var = _var;
}
function getTmp() {	
alert(temp_var);
return temp_var;
}	
function codeLatLng(lat,lng) {
	var latlng = new google.maps.LatLng(lat, lng);
	setGeoCoder().geocode({'latLng': new google.maps.LatLng(lat, lng)}, function(results, status) {
	  if (status == google.maps.GeocoderStatus.OK) {
		if (results[1]) {
			//alert( results[1].formatted_address);
			setTmp( results[1].formatted_address );
		}
	  } else {
		alert("Geocoder failed due to: " + status);
	  }
	});
	return getTmp();
}

function showSteps(id,response,polyOps,messArray,keysOrder,bounds,depth,doing) {
	var doing=typeof(doing) !== 'undefined'&&doing!=''?doing:0;	
	////console.log('showSteps START--'+dump(messArray));
	var image = new google.maps.MarkerImage(
			'/uploads/siteTheme/mock-point-sm.png',
			new google.maps.Size(30, 29),
			new google.maps.Point(0,0),
			new google.maps.Point(15,14)
		);      
	var markerOptions = {
			map:map,
			visible:true,
			icon: image,
			animation: google.maps.Animation.DROP,
			position:null
		};	  


	var legs = response.routes[0].legs; 
	for (var OP = 0; OP < count(polyOps); OP++) { 
		for (var leg = 0; leg < count(legs); leg++) {
			for (var step = 0; step < count(legs[leg].steps); step++) {
				if (legs[leg].steps[step].lat_lngs) {
					polyOps[OP].path=legs[leg].steps[step].lat_lngs;
					var polylineOptions = polyOps[OP];
					polys.push(new google.maps.Polyline(polylineOptions)); 
				}
			}
		}
	}

	var isEven = function(num){
		return (num%2 == 0)?'1':'2';
	};

	var route = response.routes[0];
	var summaryPanel = document.getElementById("directions_panel");
	//summaryPanel.innerHTML = "";
	// For each route, display summary information.
	for (var i = 0; i < count(route.legs); i++) {
		var inforLocationId=isEven(i);
		var routeSegment = i + 1;
		summaryPanel.innerHTML += "<b>Route Segment: " + routeSegment + "</b><br />";
		summaryPanel.innerHTML += route.legs[i].start_address + " to ";
		summaryPanel.innerHTML += route.legs[i].end_address + "<br />";
		summaryPanel.innerHTML += route.legs[i].distance.text + "<br /><br />";

		markerOptions.position=route.legs[i].start_location;
		var marker = new google.maps.Marker(markerOptions);
		//if(debug_action)console.log('bounds---extended---@'+marker.getPosition());
		//bounds.extend (marker.getPosition());
		////console.log('markers--'+dump(markers,1));
		////console.log('marker--'+marker.getPosition());
		////console.log('marker-getTitle-'+marker.getTitle());
		
		var mess=''
		var markersID='gen_'+i;
		if(i in keysOrder && keysOrder[i]!=''){
			if(depth>0){
				var offSet=(i+(depth*rount_limit)-(1*depth));
			}else{
				var offSet=i;
			}
			var mess=messArray[keysOrder[offSet]];
			var markersID=keysOrder[offSet];
			//if(debug_action)console.log(offSet+'---'+keysOrder[offSet]+'---'+messArray[keysOrder[offSet]]);
			//console.log('showing markersID--'+markersID);//if(debug_action)
			markers[markersID]=marker;
			attachInstructionText(inforLocationId,marker,mess,markersID);
		}else{
			markers[markersID]=marker;
			attachInstructionText(inforLocationId,marker, route.legs[i].instructions,markersID);
		}

	}
	if(fractal==depth){
		markerOptions.position=points[keysOrder[count(keysOrder)-1]];
		var mess=messArray[keysOrder[count(keysOrder)-1]];
		var markersID=keysOrder[count(keysOrder)-1];
		var marker = new google.maps.Marker(markerOptions);

		markers[markersID]=marker;
		//if(debug_action)console.log('showing markersID when fractal==depth so IT"S LAST--'+markersID);
		//markers.push(marker);
		////console.log('markers--'+dump(markers));
		attachInstructionText(inforLocationId,marker,mess,markersID);
	}
	
	
	
	if(depth>0){
		var offSet=(i+(depth*rount_limit)-(1*depth));
	}else{
		var offSet=i;
	}	
	//console.log('+++++++++++++++++++++++++++\r\n\tshowSteps keysOrder.length==>>'+keysOrder.length);
	//console.log('+++++++++++++++++++++++++++\r\n\tshowSteps doing==>>'+doing);
	//console.log('+++++++++++++++++++++++++++\r\n\tshowSteps offSet==>>'+offSet);
	//console.log('+++++++++++++++++++++++++++\r\n\tshowSteps depth==>>'+depth);
	//console.log('+++++++++++++++++++++++++++\r\n\tshowSteps fractal==>>'+fractal);
	if(depth==fractal&&doing==offSet){
		programicly=true;
			fitMakerBounds();
			//console.log('+++++++++++++++++++++++++++\r\n\tshowSteps Gzoom==>>'+Gzoom);
			//console.log('+++++++++++++++++++++++++++\r\n\tshowSteps mapCenter==>>'+mapCenter);
			//console.log('+++++++++++++++++++++++++++\r\n\tshowSteps getZoom--BEFORE==>>'+parseInt(map.getZoom()));
			//console.log('+++++++++++++++++++++++++++\r\n\tshowSteps Gzoom--BEFORE==>>'+Gzoom);
			
			map.setZoom(parseInt(Gzoom.toString()));
			
			//console.log('+++++++++++++++++++++++++++\r\n\tshowSteps zoom--AFTER==>>'+parseInt(map.getZoom()));
			
			recenter();
			programicly=false;
			//console.log('+++++++++++++++++++++++++++\r\n\tshowSteps---REAL_END---zoom==>>'+parseInt(map.getZoom()));
	}else{
		//console.log('+++++++++++++++++++++++++++\r\n\tshowSteps-psudo-END---zoom==>>'+parseInt(map.getZoom()));
	}
	
}
function fitMakerBounds(){
		var bounds= new google.maps.LatLngBounds();
		//console.log('LAST <<fittin>>>>>>>> +++++++++++++++++++++++++++\r\n\t__bounds---- bounds-dump->'+dump(keysOrder));
		for (var i = 0; i <  count(keysOrder); i++) {
			//console.log('SETTING <<fittin>>>>>>>> +++++++++++++++++++++++++++\r\n\tfitMakerBounds---- points[keysOrder[i]]->'+points[keysOrder[i]]+' @ --->'+keysOrder[i]);
			//console.log('SETTING <<fittin>>>>>>>> +++++++++++++++++++++++++++\r\n\tfitMakerBounds---- markers[i].getPosition()->'+markers[keysOrder[i]].getPosition()+' @ --->'+keysOrder[i]);
			if(typeof(points[keysOrder[i]])!="undefined"||points[keysOrder[i]]!=null){
				//console.log('EXTENDING <<fittin>>>>>>>> fitMakerBounds----points[keysOrder[i]].lat(),points[keysOrder[i]].lng()->'+points[keysOrder[i]].lat()+','+points[keysOrder[i]].lng()+' @ --->'+keysOrder[i]);
				
				var LatLng=markers[keysOrder[i]].getPosition();
				//console.log('EXTENDING <<fittin>>>>>>>> +++++++++++++++++++++++++++\r\n\tfitMakerBounds----LatLng->'+LatLng+' @ --->'+keysOrder[i]);
				var boolean=bounds.extend(LatLng);
				//console.log('EXTENDED <<fittin>>>>>>>> +++++++++++++++++++++++++++\r\n\tfitMakerBounds----boolean->'+boolean+' @ --->'+keysOrder[i]);
				//console.log('EXTENDED <<fittin>>>>>>>> +++++++++++++++++++++++++++\r\n\tfitMakerBounds---- points[keysOrder[i]].lat(),points[keysOrder[i]].lng()->'+points[keysOrder[i]].lat()+','+points[keysOrder[i]].lng()+' @ --->'+keysOrder[i]);
			}
		}
		//console.log('BEFORE <<fittin>>>>>>>> +++++++++++++++++++++++++++\r\n\tfitMakerBounds---- panToBounds->'+boolean);
		center=bounds.getCenter();
		//console.log('BEFORE <<fittin>>>>>>>> +++++++++++++++++++++++++++\r\n\tfitMakerBounds---- center->'+center);
		//map.panToBounds(boolean);
		map.setCenter(center);
		//console.log('AFTER <<fittin>>>>>>>> +++++++++++++++++++++++++++\r\n\tfitMakerBounds---- setCenter->');
		map.panTo(center);
		//console.log('+++++++++++++++++++++++++++\r\n\t---Gzoom---zoom==>>'+Gzoom);
		map.setZoom(parseInt(Gzoom.toString()));
		//console.log('+++++++++++++++++++++++++++\r\n\tshowSteps---REAL_END---zoom==>>'+parseInt(map.getZoom()));
		//console.log('AFTER <<fittin>>>>>>>> +++++++++++++++++++++++++++\r\n\tfitMakerBounds---- panToBounds->');
}
function zoomAlts(programicly){
	//console.log('+++++++++++++++++++++++++++\r\n\tzoomAlts----zoom==>>'+parseInt(map.getZoom()));
	var z=parseInt(map.getZoom());
	var size_items=$('.infoBox h1,.infoBox h2,.infoBox h3,.infoBox h4,.infoBox ul,.infoBox ul li,.infoBox ul li a,.infoBox a,.infoBox a:hover,.infoBox p');
	if(z<9){
		$('.infoBox ul').css({'display':'none'});
		$('.infoBox h1').css({'font-weight':'normal'});
	}
	if(z>=9){
		$('.infoBox ul').css({'display':'block'});
		$('.infoBox h1').css({'font-weight':'bold'});
	}
	if(z>=11){
		size_items.each(function(){
				var font_size=$(this).css('font-size')+(z-9);
				$(this).css({'font-size':font_size});
			});
	}
}
function recenter(center){
	//if(debug_action)console.log('recenter(center)--'+center);
	center=typeof(center)!="undefined"||center!=null?center:mapCenter;
	//console.log('recenter(center)--'+center);//if(debug_action)
	map.panTo(center);
	setCount("setCenter",1000,function(){
		map.setCenter(center);
		clearCount("setCenter");
	});
	//console.log('+++++++++++++++++++++++++++\r\n\trecenter----zoom==>>'+parseInt(map.getZoom()));
}
function open_info_box(map, marker,text,labelText){
	stepDisplay.setContent(text+labelText);
	stepDisplay.open(map, marker);
}
function attachInstructionText(id,marker,text,pID) {  
	var labelText ="Click on this point to get more information on<br/>";
	if(text!=''){var labelText =text;}
	var text ="<h1>Click on this point to get more information on</h1><br/>";
	////console.log('pID -- '+pID);
	var lOps=labelStyles[pID];
	var tops=lOps.top;
	var lefts=lOps.left;

	var myOptions = {
		content: labelText,
		boxStyle: lOps,
		disableAutoPan: true,
		pixelOffset: new google.maps.Size(parseInt(lefts),parseInt(tops)),
		position: marker.getPosition(),
		closeBoxURL: "",
		isHidden: false,
		zIndex:250,
		pane: "overlayLayer",
		enableEventPropagation: true
	};
	//if(debug_action=='routes')console.log('calcRoute---- myOptions-dump->'+dump(myOptions));
	var ibLabel = new InfoBox(myOptions);
	ibLabels[pID]=ibLabel; 
	ibLabel.open(map);
	
    google.maps.event.addListener(marker, 'mouseover', function() {
																
			clearCount("fakey_hoverIntent");
			setCount("fakey_hoverIntent",500,function(){															
																		
			  // Open an info window when the marker is clicked on,
			  // containing the text of the step.
		//	  if($('#tmp').length<=0){$('body').append('<div id="tmp" style="display:none;"></div>');}
		//	  $('#tmp').load($(this).attr('href')+' .title',function(){
		//															 
		//	  var title=$('#tmp').html();
		//      stepDisplay.setContent(text+title);
		//      stepDisplay.open(map, marker);
		
		
			var jqxhr = $.getJSON("/feeds/route.php",  {
					  pageData: pID,
					  displaytype: 'info'
					  }, function(rdata) {
								if(debug_action){//alert("success");
												//alert(dump(rdata));
												//alert(dump(rdata.content));
												//alert(dump(rdata.extensions));
								}
								if(rdata.extensions){
									tmplabelText=rdata.extensions.InfoPopupHtml.data;
									labelText=tmplabelText!=null&&tmplabelText!=''?tmplabelText:labelText;
								}
								open_info_box(map, marker,text,labelText);
							})
						.success(function() {  })
						.error(function() {
							//if(debug_action)alert("error");
							open_info_box(map, marker,text,labelText);
						})
						.complete(function(data) {});
						jqxhr.complete(function(){
							//if(debug_action)alert("second complete"); 
						});
				});
	
	});


	google.maps.event.addListener(stepDisplay, 'mouseover', function() {
				clearCount("fakey_hoverIntent");
    });
	google.maps.event.addListener(stepDisplay, 'mouseout', function() {
			clearCount("fakey_hoverIntent");
			setCount("fakey_hoverIntent",2000,function(){
				stepDisplay.close(map, marker);
				clearCount("fakey_hoverIntent");
			});
    });
    google.maps.event.addListener(marker, 'mouseout', function() {
			clearCount("fakey_hoverIntent");
			setCount("fakey_hoverIntent",2000,function(){
				stepDisplay.close(map, marker);
				clearCount("fakey_hoverIntent");
			});
    });

    google.maps.event.addListener(marker, 'click', function() {
		$("#menu_mid li a#p_"+pID).click();
		var center =marker.getPosition();
		zoom_to(center);
		//recenter(center);
    });

}

function zoom_to(center){
	
	var z=parseInt(map.getZoom());
	//if(debug_action)console.log('---zoom level is---'+z);
	//map.setZoom(9);
	recenter(center);	
//	if(z>11){
//		map.setZoom(11);
//		setCount("zoom_animation",150,function(){
//				var z=parseInt(map.getZoom());
//	//console.log('---zoom level is---'+z);
//				map.setZoom(10);
//				setCount("zoom_animation",150,function(){
//													   var z=parseInt(map.getZoom());
//	//console.log('---zoom level is---'+z);
//						map.setZoom(9);
//						setCount("zoom_animation",150,function(){
//															   var z=parseInt(map.getZoom());
//	//console.log('---zoom level is---'+z);
//								recenter(center);
//								setCount("zoom_animation",75,function(){
//										zoomDown();
//										var z=parseInt(map.getZoom());
//	//console.log('---zoom level is---'+z);
//										
//								});
//						});
//				});
//		});
//	}else{
//		recenter(center);
//		setCount("zoom_animation",75,function(){
//						zoomDown();
//		});
//	}
}
function zoomDown(){
//	setCount("zoom_animation",150,function(){
//										   var z=parseInt(map.getZoom());
//	//console.log('---zoom level is---'+z);
//			map.setZoom(10);
//			setCount("zoom_animation",150,function(){
//												   var z=parseInt(map.getZoom());
//	//console.log('---zoom level is---'+z);
//					map.setZoom(11);
//					setCount("zoom_animation",150,function(){
//														   var z=parseInt(map.getZoom());
//	//console.log('---zoom level is---'+z);
//										map.setZoom(12);
//										clearCount("zoom_animation");
//							});
//					});
//	});	
}
/* example till done then remove */
function calcRoute(id,start,end,points,polyOps,messArray,keysOrder,bounds,depth,func,doing) {
	var doing=typeof(doing) !== 'undefined'&&doing!=''?doing:0;	
	if(depth==0){	
		if(debug_action=='routes'){
			//console.log('calcRoute---- keysOrder length is '+keysOrder.length);
			//console.log('calcRoute---- keys-->'+keysOrder);
			//console.log('calcRoute---- keys-dump->'+dump(keysOrder));
			//console.log('calcRoute---- points length is '+points.length);
			//console.log('calcRoute---- points-->'+points);
			//console.log('calcRoute---- points.length-->'+points.length);
			//console.log('calcRoute---- points-dump->'+dump(points));
		}
	}
//console.log('+++++++++++++++++++++++++++\r\n\tcalcRoute-START---zoom==>>'+parseInt(map.getZoom()));
//ok pulling in the piont check list now to slipt it keep inline with keysOrder

	fractal=Math.floor(count(keysOrder)/rount_limit);
	remander=count(keysOrder)-(fractal*rount_limit);
	var waypts=[];
	
	if(fractal==depth){
    	var cycle=remander+(1*depth);
	}else{
		var cycle=rount_limit;
	}

	if(debug_action=='routes'){
		//console.log('calcRoute---- fractal is '+fractal);
		//console.log('calcRoute---- remander is '+remander);
		//console.log('calcRoute---- depth-->'+depth+' @ cycle-->'+cycle);
		}


	for (var i = 0; i < cycle; i++) {
		if(depth>0){
			var offSet=(i+(depth*rount_limit)-(1*depth));
		}else{
			var offSet=i;
		}
		if(debug_action=='routes'){
			//console.log('calcRoute cycle @ offSet-->'+offSet+' cycling@'+i);
			//console.log('keysOrder[offSet]@----->'+keysOrder[offSet]);
			//console.log('parseInt(keysOrder[offSet])@----->'+parseInt(keysOrder[offSet]));
		}
	
		//recenter();		
		var point=points[parseInt(keysOrder[offSet])];
if(typeof(point) === 'undefined')continue;
		//if(debug_action=='routes')console.log('calcRoute point-->'+point+' keysOrder@'+keysOrder[offSet]);//
		if(i==0){var start=point;}
		if(i>0&&i<cycle-1){
			waypts.push({location:point,stopover:true});
		}
		if(i==cycle-1){
			var end=''+point+'';
			var end=end.replace(/^\(/,'').replace(/\)$/,'');
		}
		doing=offSet;
	}	
	var request = {
		origin: start, 
		destination: end,
		waypoints: waypts,
		optimizeWaypoints: false,
		travelMode: google.maps.DirectionsTravelMode.DRIVING
		};		
		
	if(debug_action=='routes'){
		//console.log('calcRoute start @ depth-->'+depth+' IS '+start);
		//console.log('calcRoute END @ depth-->'+depth+' IS '+end);	
		//console.log('calcRoute waypts @ depth-->'+depth+' '+dump(waypts));
	}
	
	directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				var warnings = document.getElementById("warnings_panel");
				warnings.innerHTML = "<b>" + response.routes[0].warnings + "</b>";
				directionsDisplay.setDirections(response);
				showSteps(id,response,polyOps,messArray,keysOrder,bounds,depth,doing);
			}else{
				//if(debug_action)console.log('Google: Sorry but this is what happened\r\n'+status);
			}
		});
	if(count(keysOrder)>rount_limit&&(depth<fractal)){
		calcRoute(id,'','',points,polyOps,messArray,keysOrder,bounds,depth+1,func,doing);
	}

}


/// CURENT TRY
/* marked for removal */
function setBoxHtml(content){
	return (typeof(content)!=="undefined"&&content!=""?"<div style='padding:15px;'>"+content+"</div>":"<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>")+"<h1 style='margin-right: 96px;text-align: right;'>Jeremys <br/>super simple <br/>Example</h1><p style='margin-right: 96px;text-align: right;font-size:10px;'><em><strong>Note:</strong>all labels are hidden. MapTypeStyleElementType:geometry</em></p>";	
}
/* marked for removal */
function generic_infoBox() {
	option = {
		content: boxText,
		disableAutoPan: false,
		maxWidth: 0,
		pixelOffset: new google.maps.Size(-15,-15),
		boxClass:"infoBoxin",
		zIndex:1,
		boxStyle: { 
			background: "#ccc url('http://dev-mcweb.it.wsu.edu/jeremys%20sandbox/gMaps/movie_clouds.gif') no-repeat left bottom",
			opacity: 1.0,
			"font-size": ".5em",
			width: "23em"
		},
		closeBoxMargin: "1em .2em .2em .2em",
		closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
		infoBoxClearance: new google.maps.Size(1, 1),
		isHidden: false,
		pane: "floatPane",
		enableEventPropagation: false
	};
	return new InfoBox(option);
}
/* marked for removal */
function create_overlay(map,style){
	overlay = new google.maps.Polygon(style);
	overlay_pool.push(overlay);
	overlay.setMap(map);
	return overlay;
}
/* marked for removal */
function create_line(map,style){
	overlay = new google.maps.Polyline(style);
	if (typeof(google.maps.Polyline.prototype.runEdit) === "undefined") {
		async_load_js('/Content/js/polylineEdit/src/polylineEdit.js',function(){overlay.runEdit(true);});
	}else{
		overlay.runEdit(true);
	}
	
	overlay_pool.push(overlay);
	overlay.setMap(map);
}

/* marked for removal */
function addpoly_poly(map){
	if($('#Basic textarea').length){
		var Coords = [];
		if($('#Basic textarea').val()!=''){
			var Rows=$('#Basic textarea').val().split('\n');
			if(Rows.length){
				for(i=0; i<=Rows.length-1; i++){
					var cord=Rows[i].split(',');
					Coords.push(new google.maps.LatLng(parseFloat(cord[1]),parseFloat(cord[0])));
				}
			}
		}
		style = {
			paths: Coords,
			strokeColor: "#5f1212",
			strokeOpacity: 0.15,
			strokeWeight: 2,
			fillColor: "#5f1212",
			fillOpacity: 0.42
		};
		/*$('#style_of').change(function(){
			var sel = $(this).val();
			 $('.pod').fadeOut('fast');
			 $('.pod.op_'+sel).fadeIn('fast');
			if(defined(DEFAULT_overlay)){
				DEFAULT_overlay.setMap(null);
				DEFAULT_overlay.delete;
			}
			create_map_element($('#style_of :selected').text(),style,map);
		});*/
		create_map_element($('#style_of :selected').text(),style,map);
	}
}
	
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