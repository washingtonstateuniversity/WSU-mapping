var sensor=false;
var lang='';
var vbtimer;

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


function empty_input_recursive(obj){
	(typeof obj.val() === 'function')
		?obj.val(''):(typeof obj.find(':input').val() === 'function')
			?obj.find(':input').val(''):null;
}


/* set up parts of the map */


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
// jeremy's map utilities
//-------------------------------------------------------------------------------------------------------------------------------------------------------------

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

function create_default_shape(map,type,option){
	switch(type){
		case "polygon" :
			// default ploygon style
				_option = {paths: get_wsu_logo_shape(),strokeColor: "#5f1212",strokeOpacity: 0.24,strokeWeight: 2,fillColor: "#5f1212",fillOpacity: 0.24};
				DEFAULT_overlay=apply_element(map,type,_option);
						google.maps.event.addListener(DEFAULT_overlay,"mouseover",function(){ 
							this.setOptions({fillColor: "#a90533"}); 
						});  
						google.maps.event.addListener(DEFAULT_overlay,"mouseout",function(){ 
							this.setOptions({fillColor: "#5f1212"}); 
						});
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
							_option = {path: polyline[i],strokeColor: "#5f1212",strokeOpacity: 0.24,strokeWeight: 2};
							DEFAULT_overlay=apply_element(map,type,_option);
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
					_option = {path:[
						new google.maps.LatLng("46.732537","-117.160091"),
						new google.maps.LatLng("46.732596","-117.146745")
						]
					,strokeColor: "#5f1212",strokeOpacity:1,strokeWeight:10};
					apply_element(map,type,_option);
				return polyline;
			break;				
		case "marker" :
				return null;
			break;
	};
}





function rebuild_example(obj,map,user_event){
	var rest_Options=[];
	empty_input_recursive( obj );
	
	obj.each(function(){
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
			//alert($(this).attr('rel'));
		   rest_Options[ $(this).attr('rel') ] = ($(this).hasClass('color_picker') ? '#' : '') +''+$(this).val();
		}
	});
	if(user_event == "rest"){user_event="mouseout";}
	google.maps.event.clearListeners(DEFAULT_overlay, user_event); 
	google.maps.event.addListener(DEFAULT_overlay,user_event,function(){ 
		this.setOptions(rest_Options); 
	});
	google.maps.event.trigger(DEFAULT_overlay, 'mouseover'); 
	google.maps.event.trigger(DEFAULT_overlay, 'mouseout'); 
}
function apply_element(map,type,style){
	element = create_map_element(type,style,map);
	//apply_events(map,element,style.events);
	element_pool.push(element);
	//alert(dump(element));
	element.setMap(map);
	return element;
}
function create_map_element(type,op,map){
	var _op={};
	defined(map)				?_op.map=map:null;
	defined(op.clickable)		?_op.clickable=op.clickable:null;
	defined(op.visible)			?_op.visible=op.visible:null;
	defined(op.zIndex)			?_op.zIndex=op.zIndex:null;
	
	switch(type){
		case "polygon" :
					defined(op.editable)		?_op.editable=op.editable:null;
					defined(op.geodesic)		?_op.geodesic=op.geodesic:null;
					defined(op.paths)			?_op.paths=op.paths:null;
					defined(op.strokeColor)		?_op.strokeColor=op.strokeColor:null;
					defined(op.strokeOpacity)	?_op.strokeOpacity=op.strokeOpacity:null;
					defined(op.strokeWeight)	?_op.strokeWeight=op.strokeWeight:null;
					defined(op.fillColor)		?_op.fillColor=op.fillColor:null;
					defined(op.fillOpacity)		?_op.fillOpacity=op.fillOpacity:null;
				return new google.maps.Polygon(_op);
			break;
		case "rectangle" :
					defined(op.editable)		?_op.editable=op.editable:null;
					defined(op.bounds)			?_op.bounds=op.bounds:null;
					defined(op.strokeColor)		?_op.strokeColor=op.strokeColor:null;
					defined(op.strokeOpacity)	?_op.strokeOpacity=op.strokeOpacity:null;
					defined(op.strokeWeight)	?_op.strokeWeight=op.strokeWeight:null;
					defined(op.fillColor)		?_op.fillColor=op.fillColor:null;
					defined(op.fillOpacity)		?_op.fillOpacity=op.fillOpacity:null;
				return new google.maps.Rectangle(_op);
			break;
		case "circle" :
					defined(op.editable)		?_op.editable=op.editable:null;
					defined(op.center)			?_op.center=op.center:null;
					defined(op.radius)			?_op.radius=op.radius:null;
					defined(op.strokeColor)		?_op.strokeColor=op.strokeColor:null;
					defined(op.strokeOpacity)	?_op.strokeOpacity=op.strokeOpacity:null;
					defined(op.strokeWeight)	?_op.strokeWeight=op.strokeWeight:null;
					defined(op.fillColor)		?_op.fillColor=op.fillColor:null;
					defined(op.fillOpacity)		?_op.fillOpacity=op.fillOpacity:null;
				return new google.maps.Circle(_op);
			break;			
		case "polyline" :
					defined(op.editable)		?_op.editable=op.editable:null;
					defined(op.geodesic)		?_op.geodesic=op.geodesic:null;
					defined(op.path)			?_op.path=op.path:null;
					defined(op.strokeColor)		?_op.strokeColor=op.strokeColor:null;
					defined(op.strokeOpacity)	?_op.strokeOpacity=op.strokeOpacity:null;
					defined(op.strokeWeight)	?_op.strokeWeight=op.strokeWeight:null;
				return new google.maps.Polyline(_op);
			break;				
		case "marker" :
					defined(op.animation)		?_op.animation=op.animation:null;
					defined(op.cursor)			?_op.cursor=op.cursor:null;
					defined(op.draggable)		?_op.draggable=op.draggable:null;
					defined(op.flat)			?_op.flat=op.flat:null;
					defined(op.icon)			?_op.icon=op.icon:null;
					defined(op.optimized)		?_op.optimized=op.optimized:null;
					defined(op.position)		?_op.position=op.position:null;					
					defined(op.raiseOnDrag)		?_op.raiseOnDrag=op.raiseOnDrag:null;					
					defined(op.shadow)			?_op.shadow=op.shadow:null;	
					defined(op.shape)			?_op.shape=op.shape:null;						
					defined(op.title)			?_op.title=op.title:null;	
				return new google.maps.Marker(_op);
			break;
	};
}

/* this should replace the above script.. just had to stop working on this to push the project forward  */
	function create_map_element__________(type,op,map){
		var _op={};
		defined(map)?_op.map=map:null;
		defined(op.clickable)		?_op.clickable=op.clickable:null;
		defined(op.visible)			?_op.visible=op.visible:null;
		defined(op.zIndex)			?_op.zIndex=op.zIndex:null;
	
		if( ["polygon","polyline","rectangle","circle"].indexOf(type)!== -1  ){
						defined(op.strokeColor)		?_op.strokeColor=op.strokeColor:null;
						defined(op.strokeOpacity)	?_op.strokeOpacity=op.strokeOpacity:null;
						defined(op.strokeWeight)	?_op.strokeWeight=op.strokeWeight:null;
		}
		if( ["polygon","rectangle","circle"].indexOf(type)!== -1  ){
						defined(op.fillColor)		?_op.fillColor=op.fillColor:null;
						defined(op.fillOpacity)		?_op.fillOpacity=op.fillOpacity:null;
		}
		if( ["polygon","polyline"].indexOf(type)!== -1  ){
						defined(op.geodesic)		?_op.geodesic=op.geodesic:null;			
		}
		if(type == "marker"){
						defined(op.animation)		?_op.animation=op.animation:null;
						defined(op.cursor)			?_op.cursor=op.cursor:null;
						defined(op.draggable)		?_op.draggable=op.draggable:null;
						defined(op.flat)			?_op.flat=op.flat:null;
						defined(op.icon)			?_op.icon=op.icon:null;
						defined(op.optimized)		?_op.optimized=op.optimized:null;
						defined(op.position)		?_op.position=op.position:null;					
						defined(op.raiseOnDrag)		?_op.raiseOnDrag=op.raiseOnDrag:null;					
						defined(op.shadow)			?_op.shadow=op.shadow:null;	
						defined(op.shape)			?_op.shape=op.shape:null;						
						defined(op.title)			?_op.title=op.title:null;	
		}
		switch(type){
			case "polygon" :
					return new google.maps.Polygon(_op);
				break;
			case "rectangle" :
					return new google.maps.Rectangle(_op);
				break;
			case "circle" :
					return new google.maps.Circle(_op);
				break;			
			case "polyline" :
					return new google.maps.Polyline(_op);
				break;				
			case "marker" :
					return new google.maps.Marker(_op);
				break;	
		};
	}



function optionize() {

//	// Create the DIV to hold the control and
//	// call the HomeControl() constructor passing
//	// in this DIV.
//	var homeControlDiv = document.createElement('DIV');
//	var homeControl = new HomeControl(homeControlDiv, map);
//
//	homeControlDiv.index = 1;
//	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);
//
//
//	// Create the DIV to hold the control and
//	// call the HomeControl() constructor passing
//	// in this DIV.

//
//	// streetview tiles
//	var street = new google.maps.ImageMapType({
//		getTileUrl: function(coord, zoom) {
//			var X = coord.x % (1 << zoom);
//			return "http://cbk0.google.com/cbk?output=overlay&zoom=" + zoom + "&x=" + X + "&y=" + coord.y + "&cb_client=api";
//		},
//		tileSize: new google.maps.Size(256, 256),
//		isPng: true
//		});
//	map.overlayMapTypes.push(null);
//
//	// traffic tiles
//	var traffic = new google.maps.ImageMapType({
//		getTileUrl: function(coord, zoom) {
//			var X = coord.x % (1 << zoom);
//			return "http://mt3.google.com/mapstt?zoom=" + zoom + "&x=" + X + "&y=" + coord.y + "&client=api";
//		},
//		tileSize: new google.maps.Size(256, 256),
//		isPng: true
//		});
//	map.overlayMapTypes.push(null);
//
//	// streetview button
//	var sButton = document.createElement("button");
//	sButton.innerHTML = "StreetView";
//	sButton.style.position = "absolute";
//	sButton.style.bottom = "95px";
//	sButton.style.right = "90px";
//	sButton.style.zIndex = 10;
//	map.getDiv().appendChild(sButton);
//	sButton.className = "lolight";
//	sButton.onclick = function() {
//			if (sButton.className == "hilight") {
//				map.overlayMapTypes.setAt(0, null);
//				sButton.className = "lolight";
//			} else {
//				map.overlayMapTypes.setAt(0, street);
//				sButton.className = "hilight";
//			}
//		}
//
//	// traffic button
//	var tbutton = document.createElement("button");
//	tbutton.innerHTML = "Traffic";
//	tbutton.style.position = "absolute";
//	tbutton.style.bottom = "95px";
//	tbutton.style.right = "173px";
//	tbutton.style.zIndex = 10;
//	map.getDiv().appendChild(tbutton);
//	tbutton.className = "lolight";
//	tbutton.onclick = function() {
//			if (tbutton.className == "hilight") {
//				map.overlayMapTypes.setAt(1, null);
//				tbutton.className = "lolight";
//			} else {
//				map.overlayMapTypes.setAt(1, traffic);
//				tbutton.className = "hilight";
//			}
//		}
	// Setup the click event listeners: simply set the map to
	// Chicago
	// google.maps.event.addDomListener(controlUI, 'click', function() {
	// map.setCenter(chicago)
	//});
		setDirectionsRenderer();
		//directionsDisplay.setMap(map);
		stepDisplay = new google.maps.InfoWindow();
		
		jsonloadPage(id,true);
}




function drop() {
	for (var i = 0; i < neighborhoods.length; i++) {
		setTimeout(function() {
				addMarker();
			}, i * 200);
	}
}

function addMarker() {
	markers.push( new google.maps.Marker({
		position: neighborhoods[iterator],
		map: map,
		animation: google.maps.Animation.DROP
		}));
	iterator++;
}


function highlight(i,mark,type,time) {
	type=typeof(type)!="undefined"?type:'bounce';
	time=typeof(time)!="undefined"?time:5000;
	switch(type){
		case 2:
		break;
		default:
		case 'bounce':
			setCount('high_Bounce'+i,time,function(){
					clearCount('high_Bounce'+i);
					mark.setAnimation(null);
				});
				mark.setAnimation(google.maps.Animation.BOUNCE);
		   break;
	}
	var image = new google.maps.MarkerImage(
			'/uploads/siteTheme/mock-point.png',
			new google.maps.Size(30, 29),
			new google.maps.Point(0,0),
			new google.maps.Point(15,14)
		);      
	var markerOptions = {
			map:map,
			visible:true,
			icon: image,
			position:mark.getPosition()
		};	  
	mark.setOptions(markerOptions);
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
function setBoxHtml(content){
	return (typeof(content)!=="undefined"&&content!=""?"<div style='padding:15px;'>"+content+"</div>":"<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>")+"<h1 style='margin-right: 96px;text-align: right;'>Jeremys <br/>super simple <br/>Example</h1><p style='margin-right: 96px;text-align: right;font-size:10px;'><em><strong>Note:</strong>all labels are hidden. MapTypeStyleElementType:geometry</em></p>";	
}

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

function create_overlay(map,style){
	overlay = new google.maps.Polygon(style);
	overlay_pool.push(overlay);
	overlay.setMap(map);
	return overlay;
}

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
		item.info.content="";
	}
	return item;
}
function build_infobox(item){
	if(typeof(item.info)==='undefined' || $.isEmptyObject(item.info) || typeof(item.info.content)==='undefined' || $.isEmptyObject(item.info.content)){
		item=build_infobox_content(item);
	}

	if($.isArray(item.info.content)){
			var nav='';
			$.each( item.info.content, function(j, html) {	
				nav += '	<li class="ui-state-default ui-corner-top '+( j==0 ?' ui-tabs-selected ui-state-active':'')+'"><a href="#tabs-'+j+'">'+html.title+'</a></li>';
			});
			var content='';
			$.each( item.info.content, function(j, html) {
				content += '<div id="tabs-'+j+'" class="ui-tabs-panel ui-widget-content ui-corner-bottom  '+( j>0 ?' ui-tabs-hide':'')+'"><div class="content">'+html.block+'</div></div>';
			});				
		
	}else{
		var nav = '	<li class="ui-state-default ui-corner-top  ui-tabs-selected ui-state-active"><a href="#tabs-1">Overview</a></li>';
		var content='<div id="tabs-" class="ui-tabs-panel ui-widget-content ui-corner-bottom  "><div class="content">'+item.info.content+'</div></div>';
	}

		var box='<div id="taby'+i+'" class="ui-tabs ui-widget ui-widget-content ui-corner-all" style="margin-bottom:73px;">'+
					'<ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">'+nav+'</ul>'+
					content+
				'</div>';
			
	var myOptions = {
		alignBottom:true,
		 content: box//boxText
		,disableAutoPan: false
		,maxWidth: 0
		,pixelOffset: new google.maps.Size(-200, -36)
		,zIndex: 99
		,boxStyle: {
		  background: "url('/Content/images/sudo_infobottom.png') no-repeat center bottom"
		  ,width: "400px"
		 }
		,closeBoxMargin: "10px 2px 2px 2px"
		,closeBoxURL: "/Content/images/close.png"
		,infoBoxClearance: new google.maps.Size(1, 1)
		,isHidden: false
		,pane: "floatPane"
		,enableEventPropagation: false
		,onOpen:function(){
					$('#taby'+i).tabs();
					$('#taby'+i).hover(function(){
							ib[0].setOptions({enableEventPropagation: true});
						},function(){
							ib[0].setOptions({enableEventPropagation: false});
						});
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
	},{'draggable':true},marker.style)).click(function() {
		var ib_total = 0;
		//$.each(ib, function(i) {ib[i].close(); ib_total=i; });
		ib[0].open($('#place_drawing_map').gmap('get','map'), this);
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
		ib[0].close();
		tinyMCE.triggerSave();
		$('#place_drawing_map').gmap('clear','markers');
		$('#place_drawing_map').gmap('clear','services');
		$('#place_drawing_map').gmap('clear','overlays');	
		add_place_point(lat,lng,true);
}



function load_place_editor() {
	var lat = $('#Lat').val();
	var lng = $('#Long').val();	
	$('#place_drawing_map').gmap({'center': (typeof(lat)==='undefined' || lat=='')? pullman_str : new google.maps.LatLng(lat,lng) , 'zoom':15,'zoomControl': false,'mapTypeControl': false,'streetViewControl': false }).bind('init', function () {
		if(lat!='')add_place_point(lat,lng);
		autoUpdate();
	});
	
	$('#setLatLong :not(.ui-state-disabled)').live('click',function(){
		add_place_point(lat,lng);
	});

	$.each('.dyno_tabs',function(i,v){
		load_tiny("bodytext","tab_"+i);
	});
	var $tab_title_input = $( "#tab_title"),
		$tab_content_input = $( "#tab_content" );
	var tab_counter =  $("#infotabs li.ui-state-default").size();

	// tabs init with a custom tab template and an "add" callback filling in the content
	var $tabs = $( "#infotabs").tabs({
		tabTemplate: "<li><a href='#{href}'>#{label}</a><input type='hidden' name='tabs["+tab_counter+"].id' value='' /><input type='hidden' name='tabs["+tab_counter+"].title' value='#{label}' /><input type='hidden' class='sort' name='tabs["+tab_counter+"].sort' value='' />  <span class='ui-icon ui-icon-close'>Remove Tab</span></li>",
		add: function( event, ui ) {
			var tab_content = $tab_content_input.val() || "Tab " + tab_counter + " content.";
			$( ui.panel ).append( "<textarea id='tab_"+tab_counter+"'  name='tabs["+tab_counter+"].content' class='tinyEditor' >" + tab_content + "</textarea>" );
			$( ui.panel ).attr('role',tab_counter);
		},
		select: function(event, ui) {tinyMCE.triggerSave();}
	});
	// actual addTab function: adds new tab using the title input from the form above
	function addTab() {
	
		var tab_title = $tab_title_input.val() || "Tab " + tab_counter;
		$tabs.tabs( "option" , "tabTemplate" , "<li>"+
													"<a href='#{href}'>#{label}</a>"+
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
}
var formdata = "";
function autoUpdate(){
	if (timeouts) {clearTimeout(timeouts);} 
	timeouts = setTimeout(function(){ 
		timeout=null;
		tinyMCE.triggerSave();
		var newData = $("#editor_form").serialize();
		if(formdata!=newData){
			infoUpdate();
			formdata=newData;
		}
		//alert('hello');
		autoUpdate();
	}, 500); 
}

function load_geometrics_editor() {
     $('#geometrics_drawing_map').gmap({'center': pullman_str , 'zoom':15 }).bind('init', function () {
		 var controlOn=true;
		 var drawingMode = false;
		 
		 var type= $('#style_of').val();
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


function load_style_editor() {
     $('#style_map').gmap({'center': pullman_str , 'zoom':15 }).bind('init', function () {
		addpoly_poly($('#style_map').gmap('get','map'));
		if($('.sortStyleOps.orgin').length){
			//make_wsu_logo_map(map,"polygon");
			if($('#style_of').val()!=''){
				create_default_shape($('#style_map').gmap('get','map'),$('#style_of :selected').text());
				$('#style_of').trigger('change');
			}
		}
	});
}


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
			create_default_shape(map,$('#style_of :selected').text());
			$('#style_of').trigger('change');
		}
	}
}






	function drop1(location) {
	  var sw = map.getBounds().getSouthWest();
	  var ne = map.getBounds().getNorthEast();
	  for (var i = 0; i < 1; i++) {
		setTimeout(function() {
		  //var lat = Math.random() * (ne.lat() - sw.lat()) + sw.lat();
		  //var lng = Math.random() * (ne.lng() - sw.lng()) + sw.lng();
		  markers.push(createLocationMarker(typeof(location)==='undefined'?pullman:location,true));
			/*
			var loca = new google.maps.LatLng(markers[0].position.lat(),markers[0].position.lng());
			var requested = {
			  location: loca,
			  radius:.1
			};
			infowindow = new google.maps.InfoWindow();
			service.search(requested, calling);
			*/
			$('#Lat').val(markers[0].position.lat());
			$('#Long').val(markers[0].position.lng());
	
			google.maps.event.addListener(markers[0], 'dragend', function(event){
				var lat = this.getPosition().lat();
				var lng = this.getPosition().lng();
				
				
				$('#Lat').val(lat);
				$('#Long').val(lng);
				//setTimeout(function() {},  200);
				var loca = new google.maps.LatLng(lat,lng);
				

							setGeoCoder().geocode({'latLng': new google.maps.LatLng(lat, lng)}, function(results, status) {
							  if (status == google.maps.GeocoderStatus.OK) {
								  
								  				
								  
								var arrAddress = results[0].address_components;
			
			
								var itemRoute='';
								var itemLocality='';
								var itemCountry='';
								var itemPc='';
								var itemSnumber='';
			
								// iterate through address_component array
								$.each(arrAddress, function (i, address_component) {
			
									console.log('address_component:'+i);
			
									if (address_component.types[0] == "route"){
										console.log(i+": route:"+address_component.long_name);
										itemRoute = address_component.long_name;
										$('#place_street').val(itemRoute);
									}
			
									if (address_component.types[0] == "locality"){
										console.log("town:"+address_component.long_name);
										itemLocality = address_component.long_name;
									}
			
									if (address_component.types[0] == "country"){ 
										console.log("country:"+address_component.long_name); 
										itemCountry = address_component.long_name;
									}
			
									if (address_component.types[0] == "postal_code_prefix"){ 
										console.log("pc:"+address_component.long_name);  
										itemPc = address_component.long_name;
									}
			
									if (address_component.types[0] == "street_number"){ 
										console.log("street_number:"+address_component.long_name);  
										itemSnumber = address_component.long_name;
										$('#place_address').val(itemSnumber);
									}
									//return false; // break the loop
			
								});

						 		
								  
								  
								  
								  
								  
								  
								  
								  
								  
								if (results[1]) {
									//alert( results[1].formatted_address);
									//obj.val(itemSnumber);
								}
							  } else {
								alert("Geocoder failed due to: " + status);
							  }
							
	   				});
				
				var types = ['building','accounting','airport','amusement_park','aquarium','art_gallery','atm','bakery','bank','bar','beauty_salon','bicycle_store','book_store','bowling_alley','bus_station','cafe','campground','car_dealer','car_rental','car_repair','car_wash','casino','cemetery','church','city_hall','clothing_store','convenience_store','courthouse','dentist','department_store','doctor','electrician','electronics_store','embassy','establishment','finance','fire_station','florist','food','funeral_home','furniture_store','gas_station','general_contractor','geocode','grocery_or_supermarket','gym','hair_care','hardware_store','health','hindu_temple','home_goods_store','hospital','insurance_agency','jewelry_store','laundry','lawyer','library','liquor_store','local_government_office','locksmith','lodging','meal_delivery','meal_takeaway','mosque','movie_rental','movie_theater','moving_company','museum','night_club','painter','park','parking','pet_store','pharmacy','physiotherapist','place_of_worship','plumber','police','post_office','real_estate_agency','restaurant','roofing_contractor','rv_park','school','shoe_store','shopping_mall','spa','stadium','storage','store','subway_station','synagogue','taxi_stand','train_station','travel_agency','university','veterinary_care','zoo','administrative_area_level_1','administrative_area_level_2','administrative_area_level_3','colloquial_area','country','floor','intersection','locality','natural_feature','neighborhood','political','point_of_interest','post_box','postal_code','postal_code_prefix','postal_town','premise','room','route','street_address','street_number','sublocality','sublocality_level_4','sublocality_level_5','sublocality_level_3','sublocality_level_2','sublocality_level_1','subpremise','transit_station'];
				$('#estimated_places').show('fast');
				$('#local_place_names').html('loading<span class="blink1">.</span><span class="blink2">.</span><span class="blink3">.</span>');
				$('.blink1').blink(100);
				$('.blink2').blink(150);
				$('.blink3').blink(200);
				
				for(i = 0; i < types.length; i++){
					var requested = {
					  location: loca,
					  radius:.1,
					  keyword:types[i]//,
					  //types : [types[i]]
					
					};
					var service = new google.maps.places.PlacesService(map);
					service.search(requested, updating);
				}


			});
		  markers[0].setAnimation(google.maps.Animation.BOUNCE);
		}, i * 200);
	  }
	}

	function createLocationMarker(position,returnIt){
		var marker = new google.maps.Marker({
			map: map,
			draggable: true,
			position: position,
			animation: google.maps.Animation.DROP
		});
		if(typeof(returnIt)!=='undefined'){return marker};
	}

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
function serach_callback(results, status) {
//        if (status == google.maps.places.PlacesServiceStatus.OK) {
//          for (var i = 0; i < results.length; i++) {
//            createSerachMarker(results[i]);
//          }
//        }else{
//		//alert(status);	
//		}
}
 
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
	
	
	





//     // Set up the map and the local searcher.
//    function OnLoad() {
//
//      // Initialize the map with default UI.
//      gMap = new google.maps.Map(document.getElementById("map"), {
//        center: new google.maps.LatLng(37.4419, -122.1419),
//        zoom: 13,
//        mapTypeId: 'roadmap'
//      });
//      // Create one InfoWindow to open when a marker is clicked.
//      infowindow = new google.maps.InfoWindow;
//      google.maps.event.addListener(infowindow, 'closeclick', function() {
//        unselectMarkers();
//      });
//
//      // Initialize the local searcher
//      localSearches = new localSearches();
//      localSearches.setSearchCompleteCallback(null, OnLocalSearch);
//    }

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

    //GSearch.setOnLoadCallback(OnLoad);

	
	
	
	
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
	
	
	
	

	
	
	
	
	
	
	
	
function getResolution(lat, zoom, tile_side){
  var grid = tile_side || 256;
  var ret = {};
  ret.meterPerPixel = 2 * Math.PI * 6378100 * Math.cos(lat * Math.PI/180) / Math.pow(2, zoom) / grid;
  ret.cmPerPixel = ret.meterPerPixel * 100;
  ret.mmPerPixel = ret.meterPerPixel * 1000;
  ret.pretty = ( Math.round(ret.meterPerPixel) ) + ' meters/px';
  if (ret.meterPerPixel < 10)	{ ret.pretty = ( Math.round( ret.meterPerPixel * 10 ) / 10 ) +' meters/px';}
  if (ret.meterPerPixel < 2)	{ ret.pretty = ( Math.round( ret.cmPerPixel ) ) + ' cm/px';}
  if (ret.cmPerPixel < 10)		{ ret.pretty = ( Math.round( ret.cmPerPixel * 10 ) / 10 ) + ' cm/px';}
  if (ret.cmPerPixel < 2) 		{ ret.pretty = ( Math.round( ret.mmPerPixel ) ) + ' mm/px';}
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