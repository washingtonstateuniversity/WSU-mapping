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
function get_mapcenter(){
    var mapCenter = map.getCenter();
    var latLngStr = mapCenter.lat().toFixed(6) + ', ' + mapCenter.lng().toFixed(6);
    return latLngStr;
}



















/*------------------------
   Clean up functions
    ---------------------------*/
function clear_highlights(mark) {    /// this one needs to be abstracted
	var tmplastMarker=typeof(lastMarker)!="undefined"&&lastMarker!=null?lastMarker:null;
	mark=typeof(mark)!="undefined"&&mark!=null?mark:tmplastMarker;
	if (mark==null||typeof(mark)=="undefined") return false;
	
	mark.setAnimation(null);
	var image = new google.maps.MarkerImage(
		'/uploads/siteTheme/mock-point-sm.png',
		new google.maps.Size(16, 15),
		new google.maps.Point(0,0),
		new google.maps.Point(8,7)
		);      
	var markerOptions = {
		map:map,
		visible:true,
		icon: image,
		position:mark.getPosition()
		};	  
	mark.setOptions(markerOptions);
}
function clearDirections(directionsDisplay) {
	deleteMarkers();
	deletePolys();
	deleteibLabels();
	//directionsDisplay.setMap(null);
	//directionsDisplay=null;
	waypts = [];
	checkboxArray = [];
	polylineOptions = [];  
	
	depth=0;
	fractal=0;
	iterator = 0;
}
function deletePolys() {
	if (polys) {
		for (i in polys) {
			polys[i].setMap(null);
		}
		polys.length = 0;
	}
	polys = [];
}
function deleteibLabels() {
	if (ibLabels) {
		for (i in ibLabels) {
			ibLabels[i].setMap(null);
		}
		ibLabels.length = 0;
	}
	ibLabels = [];
}
// Deletes all markers in the array by removing references to them
function deleteMarkers() {
	if (markers) {
		for (i in markers) {
			markers[i].setMap(null);
		}
		markers.length = 0;
	}
	markers = [];
}


// Clear current Map
function clearMap(){
    if(editing == true) stopediting();
    if(polyShape) polyShape.setMap(null); // polyline or polygon
    if(outerShape) outerShape.setMap(null);
    if(rectangle) rectangle.setMap(null);
    if(circle) circle.setMap(null);
    if(drawnShapes.length > 0) {
        for(var i = 0; i < drawnShapes.length; i++) {
            drawnShapes[i].setMap(null);
        }
    }
    plmcur = 0;
    newstart();
    placemarks = [];
    createplacemarkobject();
}
function newstart() {
    polyPoints = [];
    outerPoints = [];
    pointsArray = [];
	shapeArray = [];
    markersArray = [];
    pointsArrayKml = [];
    markersArrayKml = [];
    addresssArray = [];
    outerArray = [];
    innerArray = [];
    outerArrayKml = [];
    innerArrayKml = [];
    holePolyArray = [];
    innerArrays = [];
    innerArraysKml = [];
    waypts = [];
    destinations = [];
    adder = 0;
    directionsYes = 0;
    dirpointend = 0;
    dirpointstart = null;
    oldpoint = null;
    closethis('polylineoptions');
    closethis('polygonoptions');
    closethis('circleoptions');
    if(toolID != 2) closethis('polygonstuff');
    if(directionsDisplay) directionsDisplay.setMap(null);
    if(startMarker) startMarker.setMap(null);
    if(nemarker) nemarker.setMap(null);
    if(tinyMarker) tinyMarker.setMap(null);
    if(toolID == 1) {
        placemarks[plmcur].style = polylinestyles[polylinestyles.length-1].name;
        placemarks[plmcur].stylecur = polylinestyles.length-1;
        preparePolyline();
        polylineintroduction();
    }
    if(toolID == 2){
        showthis('polygonstuff');
        gob('stepdiv').innerHTML = "Step 0";
        placemarks[plmcur].style = polygonstyles[polygonstyles.length-1].name;
        placemarks[plmcur].stylecur = polygonstyles.length-1;
        preparePolygon();
        polygonintroduction();
    }
    if(toolID == 3) {
        placemarks[plmcur].style = polygonstyles[polygonstyles.length-1].name;
        placemarks[plmcur].stylecur = polygonstyles.length-1;
        preparePolyline(); // use Polyline to collect clicked point
        activateRectangle();
        rectangleintroduction();
    }
    if(toolID == 4) {
        placemarks[plmcur].style = circlestyles[circlestyles.length-1].name;
        placemarks[plmcur].stylecur = circlestyles.length-1;
        preparePolyline(); // use Polyline to collect clicked point
        activateCircle();
        circleintroduction();
        codeID = gob('codechoice').value = 2; // javascript, no KML for circle
    }
    if(toolID == 5) {
        placemarks[plmcur].style = markerstyles[markerstyles.length-1].name;
        placemarks[plmcur].stylecur = markerstyles.length-1;
        preparePolyline();
        markerintroduction();
    }
    if(toolID == 6){
        directionsYes = 1;
        preparePolyline();
        directionsintroduction();
        codeID = gob('codechoice').value = 1;
    }
    kmlcode = "";
    javacode = "";
}

function deleteLastPoint(){
    if(directionsYes == 1) {
        if(destinations.length == 1) return;
        undo();
        return;
    }
    if(toolID == 1) {
        if(polyShape) {
            polyPoints = polyShape.getPath();
            if(polyPoints.length > 0) {
                polyPoints.removeAt(polyPoints.length-1);
                pointsArrayKml.pop();
				dump_latLongs();
                if(codeID == 1) logCode1();
                if(codeID == 2) logCode4();
            }
        }
    }
    if(toolID == 2) {
        if(innerArrayKml.length>0) {
            innerArrayKml.pop();
            polyPoints.removeAt(polyPoints.length-1);
        }
        if(outerArrayKml.length>0 && innerArrayKml.length==0) {
            outerArrayKml.pop();
            //polyPoints.removeAt(polyPoints.length-1);
        }
        if(outerPoints.length===0) {
            if(polyShape) {
                polyPoints = polyShape.getPath();
                if(polyPoints.length > 0) {
                    polyPoints.removeAt(polyPoints.length-1);
                    pointsArrayKml.pop();
                    if(adder == 0) {
						dump_latLongs();
                        if(codeID == 1) logCode2();
                        if(codeID == 2) logCode4();
                    }
                }
            }
        }
    }
    if(polyPoints.length === 0) nextshape();
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

/*

$(function () {
	$(window).scroll(function(){
	  x= 0;
	  y= -($(window).scrollTop()*.04);//alert("background-position" +  x + " " + y);
	  $('body,#bk_tmp').css("background-position", x + "px " + y + "px");
	}); 
	link_corrections();

  	if( $('.jqueryFileTree').length > 0){
		$('.jqueryFileTree').fileTree({ 
			root: '/uploads/member_dir',
			script: "http://"+maindomain+"/nwpsb-area/about-us.html?showtemplate=false",
			folderEvent: 'click',
			expandSpeed: 1000,
			collapseSpeed: 750
		},function(){
			$('.jqueryFileTree li.file').find('a').live('click',function(){
						window.open($(this).find('a').attr('href'),'_blank');
				});
		return false;});  
	}
	if($('a.gallery').length>0){
		$('a.gallery').colorbox({photo:true,rel:'gallery',maxHeight:'95%',maxWidth:'95%'});
		$('#viewGal').live('click',function(){
			$('a.gallery:first').click();
		
		});
	}

	if( $('#side_trips ul li a:last').html()==$('#side_trips ul li a:first').html()){
		$('#side_trips ul li a:last').remove();	
	}  
 // fix this.. what a cheat 
 
 	$("#route_menu_link a").live('click',function(e){
		e.stopPropagation();
		e.preventDefault();
		$('#menu_mid h2').text('Points Of Interest');
		$("#route_menu_link").fadeOut();
		$('#sub_menu_link').fadeIn();
		$('#side_trips ul li ul').hide();
		$('#side_trips ul li').fadeOut();
		$('#main_route ul li').fadeIn();	  
		$('#main_route ul li a:first').click();
	}); 
	$("#sub_menu_link a").live('click',function(e){
		e.stopPropagation();
		e.preventDefault();
		$('#sub_menu_link').fadeOut();
		$('#route_menu_link').fadeIn();
		$('#menu_mid h2').text('Super Side Trip Points Of Interest');
		$("#main").html(show_subroute_text());
		$('#main_route ul li').fadeOut();
		$('#side_trips ul li').fadeIn();	
	});  

//		$('#drop').live('click',function(e){
//				e.preventDefault();
//				drop();
//			});
//
//		$('#highlight').live('click',function(e){e.preventDefault();
//				makeBounce();
//			});

set_up_gal();







});*/

function set_up_audio(){
		$("#accordion").tabs("#accordion div.pane", {tabs: 'h3', effect: 'slide', initialIndex: null});
		// default options
		//$(".mp3").jmp3();
		// custom options
		$(".mp3").jmp3({
		  showfilename: "false",
		  backcolor: "293415",
		  forecolor: "82a444",
		  width: 150,
		  showdownload: "false"
		});
}


/*
$(document).ready(function(){
			  
	$('#audio').colorbox({
			resize:true,
			href:function(){
				return $(this).attr('href')+' #accordion';
				},
			onComplete:function(){
					set_up_audio();
				}
	});	
						   
						   
   if($("#accordion").length>0){
	   set_up_audio();
   }
});

*/



function show_subroute_text(){
 var txt = '<h1 class="title">Northwest Passage Scenic Byway - All American Road</h1><h2>Super Side Trips</h2><img src="/uploads/siteTheme/super-side-trip.png" alt="" style="float:right;"/><span class="main_image"><a class="group" href="uploads/images/Gallery/15/Iron%20horses.jpg" title="Iron Horses at the Entrance to Lewiston" rel="gallery-68"><img src="http://173.203.188.221/uploads/SuperSizerTmp/Iron horses.-w302-h0-p0-q75-F-----S1-c.jpg?1304343620" alt="Iron Horses at the Entrance to Lewiston" /><span class="credit">Photo: Digital Barn</span></a><span class="titlename">Iron Horses at the Entrance to Lewiston</span></span><p>The Northwest Passage Scenic Byway has an additional six "Super Side Trips".  These additional drives will take you from the main route of the Northwest Passage Scenic Byway on linear and loop routes.  These "Super Side Trips" will give you the opportunity to discover new sights, topography, communities, and culture that make north central Idaho unique.  You will travel through rich farm lands, forests, prairies, river canyons, and mountains on these drives:</p><ul><li>Elk River Backcountry Byway</li><li>Gold Rush Scenic Byway</li><li>The Palouse Loop</li><li>Clearwater River & Camas Prairie Loop</li><li>Hells Canyon & Seven Devils - Segment 1 & 2</li></ul><p>Click on the "Super Side Trips - Points of Interest" menu to the right to access particular information, points of interest, miles, and map for each Super Side Trip.</p><p>Enjoy your travels!</p>';	
 return txt;
}



function set_up_gal(){
	if($('#gal_cats').length>0){
		//alert('loading gal');
		var flashvars = {
		  xmlFile: 'http://'+maindomain+'/feeds/area-photos.xml?cats='+$('#gal_cats').text()
		};
		var params = {
		  allownetworking: "all",
		  allowscriptaccess:'always',
		  allowfullscreen:'true',
		  swliveconnect:'true',
		  seamlesstabbing:'false',
		  wmode:'transparent',
		  salign:'tl',
		  scale:'noscale',
		  bgcolor:'#d9dcd8'
		};
		var attributes = {};
		swfobject.embedSWF("uploads/gal/main.swf", "myContent", "100%", "100%", "9.0.0","expressInstall.swf", flashvars, params, attributes);
	}
	if($('a.gallery').length>0){
		$('a.gallery').colorbox({photo:true,rel:'gallery',maxHeight:'95%',maxWidth:'95%'});
		$('#viewGal').live('click',function(e){
		    e.stopPropagation();
		    e.preventDefault();
			$('a.gallery:first').click();
		});
	}
}

/*

(function($){
			var $body = $(document.body),
				$menu = $('#menu_mid'),
				$content = $('#main'),
				$current = $('#current');
				$selector= '#ajaxTar';
			$.Ajaxy.configure({
				'Controllers': {
					'_generic': {
						debug: false,
						classname: 'ajaxy-page',
						matches: /^\/pages\/?/,
						request: function(){
							$('#MapArea').scrollView();
							var Ajaxy = $.Ajaxy;
							//if ( debug_action &&  Ajaxy.options.debug ) window.console.debug('$.Ajaxy.Controllers.page.request', [this,arguments]);
							$menu.find('.active').removeClass('active');
							$content.stop(true,true).fadeOut(400);
							// Return true
							return true;
						},
						response: function(){
							// Prepare
							var Ajaxy = $.Ajaxy; var data = this.State.Response.data; var state = this.state; var State = this.State;
							//if ( debug_action && Ajaxy.options.debug ) window.console.debug('$.Ajaxy.Controllers.page.response', [this,arguments], data, state);
							var url=State.raw.state;
							var i=$menu.find('a[href$="'+url+'"]').attr('id');
							// Show Content
							var Action = this;
							var $responseText=data.content.toString();
								$responseText=$responseText.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
							$("body").append('<div id="temtar" style="position: absolute; overflow: hidden; width: 0%; height:0%;">'+$responseText+'</div>');
							var $wanted=$('#temtar').find($selector).html();
							$('#temtar').remove();
							$content.html($wanted).fadeIn(400,function(){
									Action.documentReady($content);
									//pID=parseInt(i.replace('p_',''));
									pID=i.replace('p_','');
									var parent_id=$menu.find('a[href$="'+url+'"]').closest('ul').prev('a:first').attr('id');
									//if(debug_action)console.log('id===>'+parent_id);
									parent_id=typeof(parent_id)!="undefined"&&parent_id!=null?parseInt(parent_id.replace('p_','')):'';
									//if(debug_action)console.log('corrected='+corrected);
									//if(debug_action)console.log('midsite='+midsite);
									//if(debug_action)console.log('hash===>'+hash);
									//if(debug_action)console.log('i===>'+i);
									//if(debug_action)console.log('pID===>'+pID);
									//if(debug_action)console.log('parent_id===>'+parent_id);
									
									
									//if(midsite&&!corrected){
//										if(i=='p_37'||i=='p_44'||i=='p_61'||i=='p_67'||i=='p_84'||i=='p_99'){
//											$("#sub_menu_link a").click();
//											//jsonloadPage(pID,true);
//											//jsonloadPage(pID,true,keepMarkers,keepPolys,keepibLabels)
//											jsonloadPage(pID,true,false,true,false);
//											$('#side_trips ul li ul').hide();
//											$menu.find('a[href$="'+url+'"]').closest('li').find('ul:first').show("slow");
//											$menu.find('a#'+pID).addClass('active');
//											$menu.find('a[href$="'+url+'"]').addClass('active');
//										}
//										if(i!='p_15'&&i!='p_37'&&i!='p_44'&&i!='p_61'&&i!='p_67'&&i!='p_84'&&i!='p_99'){
//											if(midsite&&!corrected){
//												$("#sub_menu_link a").click();
//												$('#menu_mid').find('a[href$="'+url+'"]').closest('li').find('ul:first').show("slow");
//												jsonloadPage(parent_id,true);
//												corrected=true;
//											}
//											//console.log('pID==>'+pID);
//											//console.log('markers==>'+dump(markers));
//											var mark = markers[pID];
//											clear_highlights();
//											
//											
//											//console.log('mark==>'+dump(mark));
//											set_up_gal();
//											var center = mark.getPosition();
//											//recenter(center);
//											zoom_to(center);
//											highlight(i+'_navd',mark,'bounce',5000);
//											lastMarker=mark;
//											get_background(pID);
//											
//											$menu.find('a#'+pID).closest('li').find('ul:first').show("slow");	
//											$menu.find('a').removeClass('active');
//											$menu.find('a#'+pID).addClass('active');
//										}
//									}else{
										$menu.find('a').removeClass('active');
										
										$menu.find('a[href$="'+url+'"]').addClass('active');
										//if(debug_action)console.log('Ajaxy-Controllers-_generic-response==>'+url);//if(debug_action)
										//if(i!='p_15'&&i!='p_37'&&i!='p_44'&&i!='p_61'&&i!='p_67'&&i!='p_84'&&i!='p_99'){
										var test=parseInt(pID);
										if($.inArray(test,parental)==-1){
											//console.log('Ajaxy-Controllers-_generic-response==>'+parental[test]);
											var mark = markers[pID];
											clear_highlights();
											var center = mark.getPosition();
											//recenter(center);
											zoom_to(center);
											highlight(i+'_navd',mark,'bounce',5000);
											lastMarker=mark;
											get_background(pID);
										}else{
											if(i=='p_15'){
												jsonloadPage(pID,true);
											}else{
												//if(i=='p_37'||i=='p_44'||i=='p_61'||i=='p_67'||i=='p_84'||i=='p_99'){
												if($.inArray(test,parental)>-1){
													//jsonloadPage(pID,true);
													//jsonloadPage(pID,true,keepMarkers,keepPolys,keepibLabels)
													jsonloadPage(pID,true,false,true,false);
													$('#side_trips ul li ul').hide();
													$menu.find('a[href$="'+url+'"]').closest('li').find('ul:first').show("slow");
												}
											}
										}
									//}
									

									if($("#sub_menu_link a.active").length>0){
										if($('#menu_mid').find('a[href$="'+url+'"]').closest('li').find('ul:first').has(':visable')){
											$("#sub_menu_link a").click();
											$('#menu_mid').find('a[href$="'+url+'"]').closest('li').find('ul:first').show("slow");
										}
									}
									set_up_addThis();
									set_up_gal();

									link_corrections();
							});
							return true;
						}
					}
				}
			});
})(jQuery);

*/


/*////////////////////////////////////////////////


from the editing



*/



function polystyle() {
    this.name = "Lump";
    this.color = "#FF0000";
    this.fill = "#0000FF";
    this.width = 2;
    this.lineopac = 0.8;
    this.fillopac = 0.6;
}
function linestyle() {
    this.name = "Path";
    this.color = "#FF0000";
    this.width = 3;
    this.lineopac = 1;
}
function circstyle() {
    this.name = "Circ";
    this.color = "#FF0000";
    this.fill = "#0000FF";
    this.width = 2;
    this.lineopac = 0.8;
    this.fillopac = 0.6;
}













function markerstyleobject() {
    this.name = "markerstyle";
    this.icon = "http://maps.google.com/intl/en_us/mapfiles/ms/micons/red-dot.png";
}
function placemarkobject() {
    this.name = "NAME";
    this.desc = "YES";
    this.style = "Path";
    this.stylecur = 0;
    this.tess = 1;
    this.alt = "clampToGround";
    this.plmtext = "";
    this.jstext = "";
    this.jscode = [];
	this.latLongArray = [];
    this.kmlcode = [];
    this.poly = "pl";
    this.shape = null;
    this.point = null;
    this.toolID = 1;
    this.hole = 0;
    this.ID = 0;
}



function createplacemarkobject() {
    var thisplacemark = new placemarkobject();
    placemarks.push(thisplacemark);
}
function createpolygonstyleobject() {
    var polygonstyle = new polystyle();
    polygonstyles.push(polygonstyle);
}
function createlinestyleobject() {
    var polylinestyle = new linestyle();
    polylinestyles.push(polylinestyle);
}
function createcirclestyleobject() {
    var cirstyle = new circstyle();
    circlestyles.push(cirstyle);
}
function createmarkerstyleobject() {
    var thisstyle = new markerstyleobject();
    markerstyles.push(thisstyle);
}


function preparePolyline(){
    var polyOptions = {
        path: polyPoints,
        strokeColor: polylinestyles[lcur].color,
        strokeOpacity: polylinestyles[lcur].lineopac,
        strokeWeight: polylinestyles[lcur].width};
    polyShape = new google.maps.Polyline(polyOptions);
    polyShape.setMap(map);
    /*var tmpPolyOptions = {
    	strokeColor: polylinestyles[lcur].color,
    	strokeOpacity: polylinestyles[lcur].lineopac,
    	strokeWeight: polylinestyles[lcur].width
    };
    tmpPolyLine = new google.maps.Polyline(tmpPolyOptions);
    tmpPolyLine.setMap(map);*/
}

function preparePolygon(){
    var polyOptions = {
        path: polyPoints,
        strokeColor: polygonstyles[pcur].color,
        strokeOpacity: polygonstyles[pcur].lineopac,
        strokeWeight: polygonstyles[pcur].width,
        fillColor: polygonstyles[pcur].fill,
        fillOpacity: polygonstyles[pcur].fillopac};
    polyShape = new google.maps.Polygon(polyOptions);
    polyShape.setMap(map);
}
function activateRectangle() {
    rectangle = new google.maps.Rectangle({
        map: map,
        strokeColor: polygonstyles[pcur].color,
        strokeOpacity: polygonstyles[pcur].lineopac,
        strokeWeight: polygonstyles[pcur].width,
        fillColor: polygonstyles[pcur].fill,
        fillOpacity: polygonstyles[pcur].fillopac
    });
}
function activateCircle() {
    circle = new google.maps.Circle({
        map: map,
        fillColor: circlestyles[ccur].fill,
        fillOpacity: circlestyles[ccur].fillopac,
        strokeColor: circlestyles[ccur].color,
        strokeOpacity: circlestyles[ccur].lineopac,
        strokeWeight: circlestyles[ccur].width
    });
}
function activateMarker() {
    markerShape = new google.maps.Marker({
        map: map,
        icon: markerstyles[mcur].icon
    });
}
function addLatLng(point){
    if(directionsYes == 1) {
        drawDirections(point.latLng);
        return;
    }
    if(plmcur != placemarks.length-1) {
        nextshape();
    }

    // Rectangle and circle can't collect points with getPath. solved by letting Polyline collect the points and then erase Polyline
    polyPoints = polyShape.getPath();
    polyPoints.insertAt(polyPoints.length, point.latLng); // or: polyPoints.push(point.latLng)
    if(polyPoints.length == 1) {
        startpoint = point.latLng;
        placemarks[plmcur].point = startpoint; // stored because it's to be used when the shape is clicked on as a stored shape
        setstartMarker(startpoint);
        if(toolID == 5) {
            drawMarkers(startpoint);
        }
    }
    if(polyPoints.length == 2 && toolID == 3) createrectangle(point);
    if(polyPoints.length == 2 && toolID == 4) createcircle(point);
    if(toolID == 1 || toolID == 2) { // if polyline or polygon
	
	 var shapeObesaved =point.latLng.lng().toFixed(6) + ',' +  point.latLng.lat().toFixed(6);
        var stringtobesaved = point.latLng.lat().toFixed(6) + ',' + point.latLng.lng().toFixed(6);
        var kmlstringtobesaved = point.latLng.lng().toFixed(6) + ',' + point.latLng.lat().toFixed(6);
        if(adder == 0) {
			shapeArray.push(shapeObesaved);
            pointsArray.push(stringtobesaved);
            pointsArrayKml.push(kmlstringtobesaved);
            if(polyPoints.length == 1 && toolID == 2) closethis('polygonstuff');
            if(codeID == 1 && toolID == 1) logCode1(); // write kml for polyline
            if(codeID == 1 && toolID == 2) logCode2(); // write kml for polygon
            if(codeID == 2) logCode4(); // write Google javascript
			dump_latLongs();
        }
        if(adder == 1) {
            outerArray.push(stringtobesaved);
            outerArrayKml.push(kmlstringtobesaved);
        }
        if(adder == 2) {
            innerArray.push(stringtobesaved);
            innerArrayKml.push(kmlstringtobesaved);
        }
    }
}
function drawMarkers(point) {
    if(startMarker) startMarker.setMap(null);
    if(polyShape) polyShape.setMap(null);
    var id = plmcur;
	
	placemarks[plmcur].latLongArray =  point.lng().toFixed(6) + ',' + point.lat().toFixed(6);
	
	
    placemarks[plmcur].jscode = point.lat().toFixed(6) + ',' + point.lng().toFixed(6);
    placemarks[plmcur].kmlcode = point.lng().toFixed(6) + ',' + point.lat().toFixed(6);
    activateMarker();
    markerShape.setPosition(point);
    var marker = markerShape;
    tinyMarker = new google.maps.Marker({
        position: placemarks[plmcur].point,
        map: map,
        icon: tinyIcon
    });
    google.maps.event.addListener(marker, 'click', function(event){
        plmcur = id;
        markerShape = marker;
        var html = "<b>" + placemarks[plmcur].name + "</b> <br/>" + placemarks[plmcur].desc;
        var infowindow = new google.maps.InfoWindow({
            content: html
        });
        if(tinyMarker) tinyMarker.setMap(null);
        tinyMarker = new google.maps.Marker({
            position: placemarks[plmcur].point,
            map: map,
            icon: tinyIcon
        });
        if(toolID != 5) toolID = gob('toolchoice').value = 5;
        if(codeID == 1)logCode9();
        if(codeID == 2)logCode8();
        infowindow.open(map,marker);
    });
    drawnShapes.push(markerShape);
    if(codeID == 2) logCode8();
    if(codeID == 1) logCode9();
}
function drawDirections(point) {
    if(dirpointstart == null) {
        //setDirectionsMarker(point);
        dirpointstart = point;
        setstartMarker(dirpointstart);
        increaseplmcur();
        dirline = plmcur;
        placemarks[dirline].shape = polyShape;
        placemarks[dirline].point = dirpointstart;
        directionsDisplay = new google.maps.DirectionsRenderer({
            suppressMarkers: true,
            preserveViewport: true
        });
    }else{
        if(startMarker) startMarker.setMap(null);
        directionsDisplay.setOptions({polylineOptions: {
            strokeColor: polylinestyles[lcur].color,
            strokeOpacity: polylinestyles[lcur].lineopac,
            strokeWeight: polylinestyles[lcur].width}});
        if(dirpointend == 0) {
            var request = {
                origin: dirpointstart,
                destination: point,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };
            oldpoint = point;
            destinations.push(request.destination);
            calcRoute(request);

            dirpointend = 1;
            dircountstart = plmcur+1;
        }else{
            if(oldpoint) waypts.push({location:oldpoint, stopover:true});
            request = {
                origin: dirpointstart,
                destination: point,
                waypoints: waypts,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };
            oldpoint = point;
            destinations.push(request.destination);
            calcRoute(request);
        }
    }
}
function calcRoute(request) {
    if(waypts.length == 0) directionsDisplay.setMap(map);
    directionsService.route(request, RenderCustomDirections);
}
function RenderCustomDirections(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        polyPoints = [];
        pointsArray = [];
		shapeArray = [];
        pointsArrayKml = [];
        markersArray = [];
        markersArrayKml = [];
        addresssArray = [];
        var result = directionsDisplay.getDirections().routes[0];
        for(var i = 0; i < result.overview_path.length; i++) {
            polyPoints.push(result.overview_path[i]);
			shapeArray.push(result.overview_path[i].lng().toFixed(6) + ',' + result.overview_path[i].lat().toFixed(6));
            pointsArray.push(result.overview_path[i].lat().toFixed(6) + ',' + result.overview_path[i].lng().toFixed(6));
            pointsArrayKml.push(result.overview_path[i].lng().toFixed(6) + ',' + result.overview_path[i].lat().toFixed(6));
        }
        polyShape.setPath(polyPoints);
        endLocation = new Object();
        var legs = response.routes[0].legs;
        for (var i=0;i<legs.length;i++) {
            if (i == 0) {
                createdirMarker(legs[i].start_location,"start",legs[i].start_address,"green");
            } else {
                createdirMarker(legs[i].start_location,"waypoint"+i,legs[i].start_address,"yellow");
            }
            endLocation.latlng = legs[i].end_location;
            endLocation.address = legs[i].end_address;
            markersArray.push(legs[i].start_location.lat().toFixed(6) + ',' + legs[i].start_location.lng().toFixed(6));
            markersArrayKml.push(legs[i].start_location.lng().toFixed(6) + ',' + legs[i].start_location.lat().toFixed(6));
            addresssArray.push(legs[i].start_address);

        }
        createdirMarker(endLocation.latlng,"end",endLocation.address,"red");
        markersArray.push(endLocation.latlng.lat().toFixed(6) + ',' + endLocation.latlng.lng().toFixed(6));
        markersArrayKml.push(endLocation.latlng.lng().toFixed(6) + ',' + endLocation.latlng.lat().toFixed(6));
        addresssArray.push(endLocation.address);
        logCode1a();
    }
    else alert(status);
}
function createdirMarker(latlng, label, html, color) {
    if(tinyMarker) tinyMarker.setMap(null);
    createplacemarkobject();
    plmcur++;
    if(color == "green") {
        if(plmcur != dircountstart) {
            for(var i=dircountstart;i<plmcur;i++) {
                placemarks.pop();
                drawnShapes[drawnShapes.length-1].setMap(null);
                drawnShapes.pop();
            }
            plmcur = dircountstart;
        }
    }
    activateMarker();
    markerShape.setPosition(latlng);
	placemarks[plmcur].latLongArray =  latlng.lng().toFixed(6) + ' ' + latlng.lat().toFixed(6);
    placemarks[plmcur].jscode = latlng.lat().toFixed(6) + ',' + latlng.lng().toFixed(6);
    placemarks[plmcur].kmlcode = latlng.lng().toFixed(6) + ',' + latlng.lat().toFixed(6);
    placemarks[plmcur].desc = html;
    placemarks[plmcur].point = latlng;
    placemarks[plmcur].style = markerstyles[mcur].name;
    placemarks[plmcur].stylecur = mcur;
    var marker = markerShape;
    var thisshape = plmcur;
    google.maps.event.addListener(marker, 'click', function(event){
        markerShape = marker;
        plmcur = thisshape;
        var html = "<b>" + placemarks[thisshape].name + "</b> <br/>" + placemarks[thisshape].desc;
        var infowindow = new google.maps.InfoWindow({
            content: html
        });
        if(tinyMarker) tinyMarker.setMap(null);
        tinyMarker = new google.maps.Marker({
            position: placemarks[plmcur].point,
            map: map,
            icon: tinyIcon
        });
        if(toolID != 5 && directionsYes == 0) toolID = gob('toolchoice').value = 5;
        if(codeID == 1) logCode9();
        if(codeID == 2) logCode8();
        infowindow.open(map,marker);
    });
    drawnShapes.push(markerShape);
}
// Called from button
function undo() {
    drawnShapes[drawnShapes.length-1].setMap(null);
    destinations.pop();
    var point = destinations[destinations.length-1];
    oldpoint = point;
    waypts.pop();
    var request = {
        origin: dirpointstart,
        destination: point,
        waypoints: waypts,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    calcRoute(request);
}
function setstartMarker(point){
    startMarker = new google.maps.Marker({
        position: point,
        map: map});
    startMarker.setTitle("#" + polyPoints.length);
}
function setDirectionsMarker(point) {
    var image = new google.maps.MarkerImage('http://www.birdtheme.org/useful/images/square.png');
    var marker = new google.maps.Marker({
        position: point,
        map: map,
        icon: image
    });
    /*var shadow = new google.maps.MarkerImage('http://maps.google.com/intl/en_us/mapfiles/ms/micons/msmarker.shadow.png',
        new google.maps.Size(37,32),
        new google.maps.Point(16,0),
        new google.maps.Point(0,32));
    var title = "#" + markers.length;
    var id = plmcur;
    placemarks[plmcur].point = point;
    placemarks[plmcur].coord = point.lng().toFixed(6) + ', ' + point.lat().toFixed(6);*/
    /*var marker = new google.maps.Marker({
        position: point,
        map: map,
        draggable: true,
        icon: image,
        shadow: shadow});*/
    //marker.setTitle(title);
    //markers.push(marker);
}
function createrectangle(point) {
    // startMarker is southwest point. now set northeast
    nemarker = new google.maps.Marker({
        position: point.latLng,
        draggable: true,
        raiseOnDrag: false,
        title: "Draggable",
        map: map});
    google.maps.event.addListener(startMarker, 'drag', drawRectangle);
    google.maps.event.addListener(nemarker, 'drag', drawRectangle);
    startMarker.setDraggable(true);
    startMarker.setAnimation(null);
    startMarker.setTitle("Draggable");
    polyShape.setMap(null); // remove the Polyline that has collected the points
    polyPoints = [];
    drawRectangle();
}
function drawRectangle() {
    southWest = startMarker.getPosition(); // used in logCode6()
    northEast = nemarker.getPosition(); // used in logCode6()
    var latLngBounds = new google.maps.LatLngBounds(
        southWest,
        northEast
    );
    rectangle.setBounds(latLngBounds);
    // the Rectangle was created in activateRectangle(), called from newstart(), which may have been called from setTool()
    var northWest = new google.maps.LatLng(southWest.lat(), northEast.lng());
    var southEast = new google.maps.LatLng(northEast.lat(), southWest.lng());
    polyPoints = [];
    pointsArray = [];
	shapeArray = [];
    pointsArrayKml = [];
    polyPoints.push(southWest);
    polyPoints.push(northWest);
    polyPoints.push(northEast);
    polyPoints.push(southEast);
	
	/*    ------ FIND ME ---- FIX ME  ----*/
	
	
    var stringtobesaved = southWest.lng().toFixed(6)+','+southWest.lat().toFixed(6);
    pointsArrayKml.push(stringtobesaved);
    stringtobesaved = southWest.lng().toFixed(6)+','+northEast.lat().toFixed(6);
    pointsArrayKml.push(stringtobesaved);
    stringtobesaved = northEast.lng().toFixed(6)+','+northEast.lat().toFixed(6);
    pointsArrayKml.push(stringtobesaved);
    stringtobesaved = northEast.lng().toFixed(6)+','+southWest.lat().toFixed(6);
    pointsArrayKml.push(stringtobesaved);
    stringtobesaved = southWest.lat().toFixed(6)+','+southWest.lng().toFixed(6);
    pointsArray.push(stringtobesaved);
    stringtobesaved = northEast.lat().toFixed(6)+','+southWest.lng().toFixed(6);
    pointsArray.push(stringtobesaved);
    stringtobesaved = northEast.lat().toFixed(6)+','+northEast.lng().toFixed(6);
    pointsArray.push(stringtobesaved);
    stringtobesaved = southWest.lat().toFixed(6)+','+northEast.lng().toFixed(6);
    pointsArray.push(stringtobesaved);
    if(codeID == 2) logCode6();
    if(codeID == 1) logCode2();
}
function createcircle(point) {
    // startMarker is center point. now set radius
    nemarker = new google.maps.Marker({
        position: point.latLng,
        draggable: true,
        raiseOnDrag: false,
        title: "Draggable",
        map: map});
    google.maps.event.addListener(startMarker, 'drag', drawCircle);
    google.maps.event.addListener(nemarker, 'drag', drawCircle);
    startMarker.setDraggable(true);
    startMarker.setAnimation(null);
    startMarker.setTitle("Draggable");
    drawCircle();
    polyShape.setMap(null); // remove the Polyline that has collected the points
    polyPoints = [];
}
function drawCircle() {
    centerPoint = startMarker.getPosition();
    radiusPoint = nemarker.getPosition();
    circle.bindTo('center', startMarker, 'position');
    calc = distance(centerPoint.lat(),centerPoint.lng(),radiusPoint.lat(),radiusPoint.lng());
    circle.setRadius(calc);
    codeID = gob('codechoice').value = 2;
    logCode7();
}
// calculate distance between two coordinates
function distance(lat1,lon1,lat2,lon2) {
    var R = 6371000; // earth's radius in meters
    var dLat = (lat2-lat1) * Math.PI / 180;
    var dLon = (lon2-lon1) * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d;
}
function kmlheading() {
    var heading = "";
    var styleforpolygon = "";
    var styleforrectangle = "";
    var styleforpolyline = "";
    var styleformarker = "";
    var i;
    heading = '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<kml xmlns="http://www.opengis.net/kml/2.2">\n' +
        '<Document><name>'+docuname+'</name>\n' +
        '<description>'+docudesc+'</description>\n';
    for(i=0;i<polygonstyles.length;i++) {
        styleforpolygon += '<Style id="'+polygonstyles[i].name+'">\n' +
        '<LineStyle><color>'+polygonstyles[i].kmlcolor+'</color><width>'+polygonstyles[i].width+'</width></LineStyle>\n' +
        '<PolyStyle><color>'+polygonstyles[i].kmlfill+'</color></PolyStyle>\n' +
        '</Style>\n';
    }
    for(i=0;i<polylinestyles.length;i++) {
        styleforpolyline += '<Style id="'+polylinestyles[i].name+'">\n' +
        '<LineStyle><color>'+polylinestyles[i].kmlcolor+'</color><width>'+polylinestyles[i].width+'</width></LineStyle>\n' +
        '</Style>\n';
    }
    for(i=0;i<markerstyles.length;i++) {
        styleformarker += '<Style id="'+markerstyles[i].name+'">\n' +
        '<IconStyle><Icon><href>\n'+markerstyles[i].icon+'\n</href></Icon></IconStyle>\n' +
        '</Style>\n';
    }
    return heading+styleforpolygon+styleforpolyline+styleformarker;
}
function kmlend() {
    var ending;
    return ending = '</Document>\n</kml>';
}
// write kml for polyline in text area
function logCode1(){
    if (notext === true) return;
    var code = ""; // placemarks[plmcur].style = polylinestyles[lcur].name
    var kmltext1 = '<Placemark><name>'+placemarks[plmcur].name+'</name>\n' +
                    '<description>'+placemarks[plmcur].desc+'</description>\n' +
                    '<styleUrl>#'+placemarks[plmcur].style+'</styleUrl>\n' +
                    '<LineString>\n<tessellate>'+placemarks[plmcur].tess+'</tessellate>\n' +
                    '<altitudeMode>'+placemarks[plmcur].alt+'</altitudeMode>\n<coordinates>\n';
    for(var i = 0; i < pointsArrayKml.length; i++) {
        code += pointsArrayKml[i] + ',0\n';
    }
    kmltext2 = '</coordinates>\n</LineString>\n</Placemark>\n';
    placemarks[plmcur].plmtext = kmlcode = kmltext1+code+kmltext2;
    placemarks[plmcur].poly = "pl";
	placemarks[plmcur].latLongArray = shapeArray;
    placemarks[plmcur].jscode = pointsArray;
    placemarks[plmcur].kmlcode = pointsArrayKml;
    gob('coords1').value = kmlheading()+kmltext1+code+kmltext2+kmlend();
}
// write kml for Directions in text area
function logCode1a(){
    if (notext === true) return;
    gob('coords1').value = "";
    var code = "";
    //var kmlMarker = "";
    //var kmlMarkers = "";
    var kmltext1 = '<Placemark><name>'+placemarks[dirline].name+'</name>\n' +
                    '<description>'+placemarks[dirline].desc+'</description>\n' +
                    '<styleUrl>#'+placemarks[dirline].style+'</styleUrl>\n' +
                    '<LineString>\n<tessellate>'+placemarks[dirline].tess+'</tessellate>\n' +
                    '<altitudeMode>'+placemarks[dirline].alt+'</altitudeMode>\n<coordinates>\n';
    if(pointsArrayKml.length != 0) {
        for(var i = 0; i < pointsArrayKml.length; i++) {
            code += pointsArrayKml[i] + ',0\n';
        }
        placemarks[dirline].jscode = pointsArray;
        placemarks[dirline].kmlcode = pointsArrayKml;
    }
    kmltext2 = '</coordinates>\n</LineString>\n</Placemark>\n';
    placemarks[dirline].plmtext = kmltext1+code+kmltext2;
    placemarks[dirline].poly = "pl";
    gob('coords1').value = kmlheading()+kmltext1+code+kmltext2;
    if(markersArrayKml.length != 0) {
        for(i = 0; i < markersArrayKml.length; i++) {
            var kmlMarker = "";
            var m = dirline + 1;
            kmlMarker += '<Placemark><name>'+placemarks[m+i].name+'</name>\n' +
                            '<description>'+addresssArray[i]+'</description>\n' +
                            '<styleUrl>#'+markerstyles[mcur].name+'</styleUrl>\n' +
                            '<Point>\n<coordinates>';
            kmlMarker += markersArrayKml[i] + ',0\n';
            kmlMarker += '</coordinates>\n</Point>\n</Placemark>\n';
            placemarks[m+i].jscode = markersArray[i];
            placemarks[m+i].kmlcode = markersArrayKml[i];
            placemarks[m+i].plmtext = kmlMarker;
            gob('coords1').value += kmlMarker;
        }
    }
    //placemarks[dirline].plmtext = kmlcode = kmltext1+code+kmltext2+kmlMarkers;
    gob('coords1').value += kmlend();
}
// write kml for polygon in text area
function logCode2(){
    if (notext === true) return;
    var code = "";
    var kmltext1 = '<Placemark><name>'+placemarks[plmcur].name+'</name>\n' +
                    '<description>'+placemarks[plmcur].desc+'</description>\n' +
                    '<styleUrl>#'+placemarks[plmcur].style+'</styleUrl>\n' +
                    '<Polygon>\n<tessellate>'+placemarks[plmcur].tess+'</tessellate>\n' +
                    '<altitudeMode>'+placemarks[plmcur].alt+'</altitudeMode>\n' +
                    '<outerBoundaryIs><LinearRing><coordinates>\n';
    if(pointsArrayKml.length != 0) {
        for(var i = 0; i < pointsArrayKml.length; i++) {
            code += pointsArrayKml[i] + ',0\n';
        }
        code += pointsArrayKml[0] + ',0\n';
		placemarks[plmcur].latLongArray = shapeArray;
        placemarks[plmcur].jscode = pointsArray;
        placemarks[plmcur].kmlcode = pointsArrayKml;
    }
    kmltext2 = '</coordinates></LinearRing></outerBoundaryIs>\n</Polygon>\n</Placemark>\n';
    placemarks[plmcur].plmtext = kmlcode = kmltext1+code+kmltext2;
    placemarks[plmcur].poly = "pg";
    gob('coords1').value = kmlheading()+kmltext1+code+kmltext2+kmlend();
}
// write kml for polygon with hole
function logCode3(){
    if (notext === true) return;
    var code = "";
    var kmltext = '<Placemark><name>'+placemarks[plmcur].name+'</name>\n' +
                    '<description>'+placemarks[plmcur].desc+'</description>\n' +
                    '<styleUrl>#'+placemarks[plmcur].style+'</styleUrl>\n' +
                    '<Polygon>\n<tessellate>'+placemarks[plmcur].tess+'</tessellate>\n' +
                    '<altitudeMode>'+placemarks[plmcur].alt+'</altitudeMode>\n' +
                    '<outerBoundaryIs><LinearRing><coordinates>\n';
    for(var i = 0; i < outerArrayKml.length; i++) {
        kmltext += outerArrayKml[i]+',0\n';
        code += outerArrayKml[i]+',0\n';
    }
    kmltext += outerArrayKml[0]+',0\n';
    code += outerArrayKml[0]+',0\n';
	placemarks[plmcur].latLongArray = shapeArray;
    placemarks[plmcur].jscode = pointsArray;
    placemarks[plmcur].kmlcode = outerArrayKml;
    kmltext += '</coordinates></LinearRing></outerBoundaryIs>\n';
    for(var m = 0; m < innerArraysKml.length; m++) {
        kmltext += '<innerBoundaryIs><LinearRing><coordinates>\n';
        for(var i = 0; i < innerArraysKml[m].length; i++) {
            kmltext += innerArraysKml[m][i]+',0\n';
        }
        kmltext += innerArraysKml[m][0]+',0\n';
        kmltext += '</coordinates></LinearRing></innerBoundaryIs>\n';
    }
    kmltext += '</Polygon>\n</Placemark>\n';
    placemarks[plmcur].plmtext = kmlcode = kmltext;
    gob('coords1').value = kmlheading()+kmltext+kmlend();
}
// write javascript
function dump_latLongs(){
    if (notext === true) return;
    gob('latLong').value = '';
    for(var i=0; i<shapeArray.length; i++){
        if(i == shapeArray.length-1){
            gob('latLong').value += shapeArray[i]+ ',\n';
			gob('latLong').value += shapeArray[0]+ '\n';
        }else{
            gob('latLong').value +=  shapeArray[i]+ ',\n';
        }
    }
    javacode = gob('latLong').value;
}

function logCode4(){
    if (notext === true) return;
    gob('coords1').value = 'var myCoordinates = [\n';
    for(var i=0; i<pointsArray.length; i++){
        if(i == pointsArray.length-1){
            gob('coords1').value += 'new google.maps.LatLng('+pointsArray[i] + ')\n';
        }else{
            gob('coords1').value += 'new google.maps.LatLng('+pointsArray[i] + '),\n';
        }
    }
    if(toolID == 1){
        gob('coords1').value += '];\n';
        var options = 'var polyOptions = {\n'
        +'path: myCoordinates,\n'
        +'strokeColor: "'+polylinestyles[lcur].color+'",\n'
        +'strokeOpacity: '+polylinestyles[lcur].lineopac+',\n'
        +'strokeWeight: '+polylinestyles[lcur].width+'\n'
        +'}\n';
        gob('coords1').value += options;
        gob('coords1').value +='var it = new google.maps.Polyline(polyOptions);\n'
        +'it.setMap(map);\n';
    }
    if(toolID == 2){
        gob('coords1').value += '];\n';
        var options = 'var polyOptions = {\n'
        +'path: myCoordinates,\n'
        +'strokeColor: "'+polygonstyles[pcur].color+'",\n'
        +'strokeOpacity: '+polygonstyles[pcur].lineopac+',\n'
        +'strokeWeight: '+polygonstyles[pcur].width+',\n'
        +'fillColor: "'+polygonstyles[pcur].fill+'",\n'
        +'fillOpacity: '+polygonstyles[pcur].fillopac+'\n'
        +'}\n';
        gob('coords1').value += options;
        gob('coords1').value +='var it = new google.maps.Polygon(polyOptions);\n'
        +'it.setMap(map);\n';
    }
    javacode = gob('coords1').value;
}
// write javascript for polygon with hole
function logCode5() {
    if (notext === true) return;
    var hstring = "";
    gob('coords1').value = 'var outerPoints = [\n';
    for(var i=0; i<outerArray.length; i++){
        if(i == outerArray.length-1){
            gob('coords1').value += 'new google.maps.LatLng('+outerArray[i] + ')\n'; // without trailing comma
        }else{
            gob('coords1').value += 'new google.maps.LatLng('+outerArray[i] + '),\n';
        }
    }
    gob('coords1').value += '];\n';
    for(var m=0; m<innerArrays.length; m++){
        gob('coords1').value += 'var innerPoints'+m+' = [\n';
        var holestring = 'innerPoints'+m;
        if(m<innerArrays.length-1) holestring += ',';
        hstring += holestring;
        for(i=0; i<innerArrays[m].length; i++){
            if(i == innerArrays[m].length-1){
                gob('coords1').value += 'new google.maps.LatLng('+innerArrays[m][i] + ')\n';
            }else{
                gob('coords1').value += 'new google.maps.LatLng('+innerArrays[m][i] + '),\n';
            }
        }
        gob('coords1').value += '];\n';
    }
    gob('coords1').value += 'var myCoordinates = [outerPoints,'+hstring+'];\n';
    gob('coords1').value += 'var polyOptions = {\n'
    +'paths: myCoordinates,\n'
    +'strokeColor: "'+polygonstyles[pcur].color+'",\n'
    +'strokeOpacity: '+polygonstyles[pcur].lineopac+',\n'
    +'strokeWeight: '+polygonstyles[pcur].width+',\n'
    +'fillColor: "'+polygonstyles[pcur].fill+'",\n'
    +'fillOpacity: '+polygonstyles[pcur].fillopac+'\n'
    +'};\n'
    +'var it = new google.maps.Polygon(polyOptions);\n'
    +'it.setMap(map);\n';
    javacode = gob('coords1').value;
}
// write javascript or kml for rectangle
function logCode6() {
    if (notext === true) return;
    //placemarks[plmcur].style = polygonstyles[pcur].name;
    if(codeID == 2) { // javascript
        gob('coords1').value = 'var rectangle = new google.maps.Rectangle({\n'
            +'map: map,\n'
            +'fillColor: '+polygonstyles[pcur].fill+',\n'
            +'fillOpacity: '+polygonstyles[pcur].fillopac+',\n'
            +'strokeColor: '+polygonstyles[pcur].color+',\n'
            +'strokeOpacity: '+polygonstyles[pcur].lineopac+',\n'
            +'strokeWeight: '+polygonstyles[pcur].width+'\n'
            +'});\n';
        gob('coords1').value += 'var sWest = new google.maps.LatLng('+southWest.lat().toFixed(6)+','+southWest.lng().toFixed(6)+');\n'
        +'var nEast = new google.maps.LatLng('+northEast.lat().toFixed(6)+','+northEast.lng().toFixed(6)+');\n'
        +'var bounds = new google.maps.LatLngBounds(sWest,nEast);\n'
        +'rectangle.setBounds(bounds);\n';
        gob('coords1').value += '\n\\\\ Code for polyline rectangle\n';
        gob('coords1').value += 'var myCoordinates = [\n';
        gob('coords1').value += southWest.lat().toFixed(6) + ',' + southWest.lng().toFixed(6) + ',\n' +
                    southWest.lat().toFixed(6) + ',' + northEast.lng().toFixed(6) + ',\n' +
                    northEast.lat().toFixed(6) + ',' + northEast.lng().toFixed(6) + ',\n' +
                    northEast.lat().toFixed(6) + ',' + southWest.lng().toFixed(6) + ',\n' +
                    southWest.lat().toFixed(6) + ',' + southWest.lng().toFixed(6) + '\n';
        gob('coords1').value += '];\n';
        var options = 'var polyOptions = {\n'
        +'path: myCoordinates,\n'
        +'strokeColor: "'+polygonstyles[pcur].color+'",\n'
        +'strokeOpacity: '+polygonstyles[pcur].lineopac+',\n'
        +'strokeWeight: '+polygonstyles[pcur].width+'\n'
        +'}\n';
        gob('coords1').value += options;
        gob('coords1').value +='var it = new google.maps.Polyline(polyOptions);\n'
        +'it.setMap(map);\n';
        javacode = gob('coords1').value;
    }
    if(codeID == 1) { // kml
        var kmltext = '<Placemark><name>'+placemarks[plmcur].name+'</name>\n' +
                        '<description>'+placemarks[plmcur].desc+'</description>\n' +
                        '<styleUrl>#'+placemarks[plmcur].style+'</styleUrl>\n' +
                        '<Polygon>\n<tessellate>'+placemarks[plmcur].tess+'</tessellate>\n' +
                        '<altitudeMode>'+placemarks[plmcur].alt+'</altitudeMode>\n' +
                        '<outerBoundaryIs><LinearRing><coordinates>\n';
        kmltext += southWest.lng().toFixed(6) + ',' + southWest.lat().toFixed(6) + ',0\n' +
                    southWest.lng().toFixed(6) + ',' + northEast.lat().toFixed(6) + ',0\n' +
                    northEast.lng().toFixed(6) + ',' + northEast.lat().toFixed(6) + ',0\n' +
                    northEast.lng().toFixed(6) + ',' + southWest.lat().toFixed(6) + ',0\n' +
                    southWest.lng().toFixed(6) + ',' + southWest.lat().toFixed(6) + ',0\n';
        kmltext += '</coordinates></LinearRing></outerBoundaryIs>\n</Polygon>\n</Placemark>\n';
        placemarks[plmcur].plmtext = kmlcode = kmltext;
        gob('coords1').value = kmlheading()+kmltext+kmlend();
    }
}
function logCode7() { // javascript for circle
    if (notext === true) return;
    //placemarks[plmcur].style = circlestyles[ccur].name;
    gob('coords1').value = 'var circle = new google.maps.Circle({\n'
        +'map: map,\n'
        +'center: new google.maps.LatLng('+centerPoint.lat().toFixed(6)+','+centerPoint.lng().toFixed(6)+'),\n'
        +'fillColor: '+circlestyles[ccur].fill+',\n'
        +'fillOpacity: '+circlestyles[ccur].fillopac+',\n'
        +'strokeColor: '+circlestyles[ccur].color+',\n'
        +'strokeOpacity: '+circlestyles[ccur].lineopac+',\n'
        +'strokeWeight: '+circlestyles[ccur].width+'\n'
        +'});\n';
    gob('coords1').value += 'circle.setRadius('+calc+');\n';
    javacode = gob('coords1').value;
}
function logCode8(){ //javascript for Marker
    if(notext === true) return;
    var text = 'var image = \''+markerstyles[mcur].icon+'\';\n'
        +'var marker = new google.maps.Marker({\n'
        +'position: '+placemarks[plmcur].point+',\n'
        +'map: map, //global variable \'map\' from opening function\n'
        +'icon: image\n'
        +'});\n'
        +'//Your content for the infowindow\n'
        +'var html = \'<b>'+ placemarks[plmcur].name +'</b> <br/>'+ placemarks[plmcur].desc +'\';';
    gob('coords1').value = text;
    javacode = gob('coords1').value;
}
function logCode9() { //KML for marker
    if(notext === true) return;
    gob('coords1').value = "";
    var kmlMarkers = "";
    kmlMarkers += '<Placemark><name>'+placemarks[plmcur].name+'</name>\n' +
                    '<description>'+placemarks[plmcur].desc+'</description>\n' +
                    '<styleUrl>#'+placemarks[plmcur].style+'</styleUrl>\n' +
                    '<Point>\n<coordinates>';
    kmlMarkers += placemarks[plmcur].kmlcode + ',0';
    kmlMarkers += '</coordinates>\n</Point>\n</Placemark>\n';
    //placemarks[plmcur].poly = "pl";
    placemarks[plmcur].plmtext = kmlcode = kmlMarkers;
    gob('coords1').value = kmlheading()+kmlMarkers+kmlend();
}

function setTool(){
    if(polyPoints.length == 0 && kmlcode == "" && javacode == "") {
        newstart();
    }else{
        if(toolID == 1){ // polyline
            // change to polyline draw mode not allowed
            if(outerArray.length > 0) { //indicates polygon with hole
                polyShape.setMap(null);
                newstart();
                return;
            }
            if(rectangle) {
                toolID = 3;
                nextshape();
                toolID = 1;
                newstart();
                return;
            }
            if(circle) {
                toolID = 4;
                nextshape();
                toolID = 1;
                newstart();
                return;
            }
            if(markerShape) {
                toolID = 5;
                nextshape();
                toolID = 1;
                newstart();
                return;
            }
            if(directionsYes == 1) {
                toolID = 6;
                nextshape();
                directionsYes = 0;
                toolID = 1;
                newstart();
                return;
            }
            placemarks[plmcur].style = polylinestyles[polylinestyles.length-1].name;
            placemarks[plmcur].stylecur = polylinestyles.length-1;
            if(polyShape) polyShape.setMap(null);
            preparePolyline(); //if a polygon exists, it will be redrawn as polylines
			dump_latLongs();
            if(codeID == 1) logCode1(); // KML
            if(codeID == 2) logCode4(); // Javascipt
        }
        if(toolID == 2){ // polygon
            if(rectangle) {
                toolID = 3;
                nextshape();
                toolID = 2;
                newstart();
                return;
            }
            if(circle) {
                toolID = 4;
                nextshape();
                toolID = 2;
                newstart();
                return;
            }
            if(markerShape) {
                toolID = 5;
                nextshape();
                toolID = 2;
                newstart();
                return;
            }
            if(directionsYes == 1) {
                toolID = 6;
                nextshape();
                directionsYes = 0;
                toolID = 2;
                newstart();
                return;
            }
            placemarks[plmcur].style = polygonstyles[polygonstyles.length-1].name;
            placemarks[plmcur].stylecur = polygonstyles.length-1;
            if(polyShape) polyShape.setMap(null);
            preparePolygon(); //if a polyline exists, it will be redrawn as a polygon
			dump_latLongs();
            if(codeID == 1) logCode2(); // KML
            if(codeID == 2) logCode4(); // Javascript
        }
        if(toolID == 3 || toolID == 4 || toolID == 5 || toolID == 6){
            if(polyShape) polyShape.setMap(null);
            if(directionsDisplay) directionsDisplay.setMap(null);
            if(circle) circle.setMap(null);
            if(rectangle) rectangle.setMap(null);
            directionsYes = 0;
            newstart();
        }
    }
}
function setCode(){
    if(toolID == 4) { // circle
        codeID = gob('codechoice').value = 2; // javascript
        return;
    }
    if(toolID == 6) { // directions
        codeID = gob('codechoice').value = 1; // KML
        return;
    }
    if(polyPoints.length !== 0 || kmlcode !== "" || javacode !== ""){
        if(codeID == 1 && toolID == 1) logCode1();
        if(codeID == 1 && toolID == 2 && outerArray.length == 0) logCode2();
        if(codeID == 1 && toolID == 2 && outerArray.length > 0) logCode3();
		dump_latLongs();
        if(codeID == 2 && toolID == 1) logCode4(); // write Google javascript
        if(codeID == 2 && toolID == 2 && outerArray.length == 0) logCode4();
        if(codeID == 2 && toolID == 2 && outerArray.length > 0) logCode5();
        if(toolID == 3) { // rectangle
            if(codeID == 1) logCode2();
            if(codeID == 2) logCode6();
        }
        if(toolID == 5) { // marker
            if(codeID == 1) logCode9();
            if(codeID == 2) logCode8();
        }
    }
}
function increaseplmcur() {
    if(placemarks[plmcur].plmtext != "") {
        if(polyShape && directionsYes == 0) {
            placemarks[plmcur].shape = polyShape;
            if(toolID==1 || toolID==2 || toolID==3) addpolyShapelistener();
            createplacemarkobject();
            plmcur = placemarks.length -1;
        }
        if(markerShape) {
            placemarks[plmcur].shape = markerShape;
            createplacemarkobject();
            plmcur = placemarks.length -1;
        }
    }
}
function nextshape() {
    if(editing == true) stopediting();
    placemarks[plmcur].shape = polyShape;
    if(southWest) {
        rectangle.setMap(null);
        southWest = northEast = null;
        preparePolygon();
    }
    if(plmcur < placemarks.length -1) addpolyShapelistener();
    plmcur = placemarks.length -1;
    increaseplmcur();
    if(directionsYes == 1) {
        plmcur = dirline;
        addpolyShapelistener();
        plmcur = placemarks.length -1;
        toolID = 6;
    }
    if(polyShape) drawnShapes.push(polyShape); // used in clearMap, to have it removed from the map, drawnShapes[i].setMap(null)
    if(outerShape) drawnShapes.push(outerShape);
    if(circle) drawnShapes.push(circle);
    if(directionsDisplay) directionsDisplay.setMap(null);
    if(tinyMarker) drawnShapes.push(tinyMarker);
    polyShape = null;
    outerShape = null;
    rectangle = null;
    circle = null;
    markerShape = null;
    directionsDisplay = null;
    newstart();
}
function addpolyShapelistener() {
    //if(outerPoints.length>>0) return;
    var thisshape = plmcur;
    // In v2 I can give a shape an ID and have that ID revealed, with the map listener, when the shape is clicked on
    // I can't do that in v3. Instead I put a listener on the shape
    google.maps.event.addListener(polyShape,'click',function(point){
        if(tinyMarker) tinyMarker.setMap(null);
        directionsYes = 0;
        polyShape = placemarks[thisshape].shape;
        polyPoints = polyShape.getPath();
        //polyShape.setMap(null);
        if(startMarker) startMarker.setMap(null);
        setstartMarker(placemarks[thisshape].point);
        plmcur = thisshape;
		shapeArray = placemarks[plmcur].latLongArray;
        pointsArray = placemarks[plmcur].jscode;
        pointsArrayKml = placemarks[plmcur].kmlcode;
        closethis('polygonstuff');
        if(placemarks[plmcur].poly == "pl") {
            toolID = gob('toolchoice').value = 1;
            lcur = placemarks[plmcur].stylecur;
			dump_latLongs();
            if(codeID == 1) logCode1();
            if(codeID == 2) logCode4(); // write Google javascript
        }else{
            toolID = gob('toolchoice').value = 2;
            pcur = placemarks[plmcur].stylecur;
			dump_latLongs();
            if(codeID == 1) logCode2();
            if(codeID == 2) logCode4(); // write Google javascript
        }
    });
}

function counter(num){
    return adder = adder + num;
}
function holecreator(){
    var step = counter(1);
    if(step == 1){
        if(gob('stepdiv').innerHTML == "Finished"){
            adder = 0;
            return;
        }else{
            if(startMarker) startMarker.setMap(null);
            if(polyShape) polyShape.setMap(null);
            polyPoints = [];
            preparePolyline();
            gob('stepdiv').innerHTML = "Step 1";
            gob('coords1').value = 'You may now draw the outer boundary. When finished, click Hole to move on to the next step.'
            +' Remember, you do not have to let start and end meet.'
            +' The API will close the shape in the finished polygon.';
        }
    }
    if(step == 2){
        if(anotherhole == false) {
            // outer line is finished, in Polyline draw mode
            polyPoints.insertAt(polyPoints.length, startpoint); // let start and end meet
            outerPoints = polyPoints;
            holePolyArray.push(outerPoints);
            outerShape = polyShape;
        }
        gob('stepdiv').innerHTML = "Step 2";
        gob('coords1').value = 'You may now draw an inner boundary. Click Hole again to see the finished polygon.';
        if(anotherhole == true) {
            // a hole has been drawn, another is about to be drawn
            if(polyShape && polyPoints.length == 0) {
                polyShape.setMap(null);
                gob('coords1').value = 'Oops! Not programmed yet, but you may continue drawing holes. '+
                'Everything you have created will show up when you click Hole again.';
            }else{
                polyPoints.insertAt(polyPoints.length, startpoint);
                holePolyArray.push(polyPoints);
                if(innerArray.length>0) innerArrays.push(innerArray);
                if(innerArrayKml.length>0) innerArraysKml.push(innerArrayKml);
                holeShapes.push(polyShape);
                innerArray = [];
            }
        }
        polyPoints = [];
        preparePolyline();
        if(startMarker) startMarker.setMap(null);
    }
    if(step == 3){
        if(startMarker) startMarker.setMap(null);
        if(outerShape) outerShape.setMap(null);
        if(polyShape) polyShape.setMap(null);
        if(polyPoints.length>0) holePolyArray.push(polyPoints);
        if(innerArray.length>0) innerArrays.push(innerArray);
        if(innerArrayKml.length>0) innerArraysKml.push(innerArrayKml);
        drawpolywithhole();
        gob('stepdiv').innerHTML = "Finished";
        adder = 0;
        if(codeID == 1) logCode3();
        if(codeID == 2) logCode5();
    }
}
function drawpolywithhole() {
    if(holeShapes.length > 0) {
        for(var i = 0; i < holeShapes.length; i++) {
            holeShapes[i].setMap(null);
        }
    }
    var Points = new google.maps.MVCArray(holePolyArray);
    var polyOptions = {
        paths: Points,
        strokeColor: polygonstyles[pcur].color,
        strokeOpacity: polygonstyles[pcur].lineopac,
        strokeWeight: polygonstyles[pcur].width,
        fillColor: polygonstyles[pcur].fill,
        fillOpacity: polygonstyles[pcur].fillopac
    };
    polyShape = new google.maps.Polygon(polyOptions);
    polyShape.setMap(map);
    anotherhole = false;
    startMarker = new google.maps.Marker({
        position: outerPoints.getAt(0),
        map: map});
    startMarker.setTitle("Polygon with hole");
}
function nexthole() {
    if(gob('stepdiv').innerHTML != "Finished") {
        if(outerPoints.length > 0) {
            adder = 1;
            anotherhole = true;
            drawnShapes.push(polyShape);
            holecreator();
        }
    }
}
function stopediting(){
    editing = false;
    gob('EditButton').value = 'Edit lines';
    for(var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    for(var i = 0; i < midmarkers.length; i++) {
        midmarkers[i].setMap(null);
    }
    polyPoints = polyShape.getPath();
    markers = [];
    midmarkers = [];
    if(plmcur != placemarks.length-1) {
        placemarks[plmcur].shape = polyShape;
        drawnShapes.push(polyShape);
        addpolyShapelistener();
    }
    setstartMarker(polyPoints.getAt(0));
}
// the "Edit lines" button has been pressed
function editlines(){
    if(editing == true){
        stopediting();
    }else{
        if(outerArray.length > 0) {
            return;
        }
        polyPoints = polyShape.getPath();
        if(polyPoints.length > 0){
            toolID = gob('toolchoice').value = 1; // editing is set to be possible only in polyline draw mode
            setTool();
            if(startMarker) startMarker.setMap(null);
            /*polyShape.setOptions({
                editable: true
            });*/
            for(var i = 0; i < polyPoints.length; i++) {
                var marker = setmarkers(polyPoints.getAt(i));
                markers.push(marker);
                if(i > 0) {
                    var midmarker = setmidmarkers(polyPoints.getAt(i));
                    midmarkers.push(midmarker);
                }
            }
            editing = true;
            gob('EditButton').value = 'Stop edit';
        }
    }
}
function setmarkers(point) {
    var marker = new google.maps.Marker({
    	position: point,
    	map: map,
    	icon: imageNormal,
        raiseOnDrag: false,
    	draggable: true
    });
    google.maps.event.addListener(marker, "mouseover", function() {
    	marker.setIcon(imageHover);
    });
    google.maps.event.addListener(marker, "mouseout", function() {
    	marker.setIcon(imageNormal);
    });
    google.maps.event.addListener(marker, "drag", function() {
        for (var i = 0; i < markers.length; i++) {
            if (markers[i] == marker) {
                polyShape.getPath().setAt(i, marker.getPosition());
                movemidmarker(i);
                break;
            }
        }
        polyPoints = polyShape.getPath();
		 var shapeObesaved = marker.getPosition().lat().toFixed(6) + ',' + marker.getPosition().lat().toFixed(6);
        var stringtobesaved = marker.getPosition().lat().toFixed(6) + ',' + marker.getPosition().lng().toFixed(6);
        var kmlstringtobesaved = marker.getPosition().lng().toFixed(6) + ',' + marker.getPosition().lat().toFixed(6);
        pointsArray.splice(i,1,stringtobesaved);
		shapeArray.splice(i,1,shapeObesaved);
        pointsArrayKml.splice(i,1,kmlstringtobesaved);
        logCode1();
    });
    google.maps.event.addListener(marker, "click", function() {
        for (var i = 0; i < markers.length; i++) {
            if (markers[i] == marker && markers.length != 1) {
                marker.setMap(null);
                markers.splice(i, 1);
                polyShape.getPath().removeAt(i);
                removemidmarker(i);
                break;
            }
        }
        polyPoints = polyShape.getPath();
        if(markers.length > 0) {
			shapeArray.splice(i,1);
            pointsArray.splice(i,1);
            pointsArrayKml.splice(i,1);
            logCode1();
        }
    });
    return marker;
}
function setmidmarkers(point) {
    var prevpoint = markers[markers.length-2].getPosition();
    var marker = new google.maps.Marker({
    	position: new google.maps.LatLng(
    		point.lat() - (0.5 * (point.lat() - prevpoint.lat())),
    		point.lng() - (0.5 * (point.lng() - prevpoint.lng()))
    	),
    	map: map,
    	icon: imageNormalMidpoint,
        raiseOnDrag: false,
    	draggable: true
    });
    google.maps.event.addListener(marker, "mouseover", function() {
    	marker.setIcon(imageNormal);
    });
    google.maps.event.addListener(marker, "mouseout", function() {
    	marker.setIcon(imageNormalMidpoint);
    });
    /*google.maps.event.addListener(marker, "dragstart", function() {
    	for (var i = 0; i < midmarkers.length; i++) {
    		if (midmarkers[i] == marker) {
    			var tmpPath = tmpPolyLine.getPath();
    			tmpPath.push(markers[i].getPosition());
    			tmpPath.push(midmarkers[i].getPosition());
    			tmpPath.push(markers[i+1].getPosition());
    			break;
    		}
    	}
    });
    google.maps.event.addListener(marker, "drag", function() {
    	for (var i = 0; i < midmarkers.length; i++) {
    		if (midmarkers[i] == marker) {
    			tmpPolyLine.getPath().setAt(1, marker.getPosition());
    			break;
    		}
    	}
    });*/
    google.maps.event.addListener(marker, "dragend", function() {
    	for (var i = 0; i < midmarkers.length; i++) {
    		if (midmarkers[i] == marker) {
    			var newpos = marker.getPosition();
    			var startMarkerPos = markers[i].getPosition();
    			var firstVPos = new google.maps.LatLng(
    				newpos.lat() - (0.5 * (newpos.lat() - startMarkerPos.lat())),
    				newpos.lng() - (0.5 * (newpos.lng() - startMarkerPos.lng()))
    			);
    			var endMarkerPos = markers[i+1].getPosition();
    			var secondVPos = new google.maps.LatLng(
    				newpos.lat() - (0.5 * (newpos.lat() - endMarkerPos.lat())),
    				newpos.lng() - (0.5 * (newpos.lng() - endMarkerPos.lng()))
    			);
    			var newVMarker = setmidmarkers(secondVPos);
    			newVMarker.setPosition(secondVPos);//apply the correct position to the midmarker
    			var newMarker = setmarkers(newpos);
    			markers.splice(i+1, 0, newMarker);
    			polyShape.getPath().insertAt(i+1, newpos);
    			marker.setPosition(firstVPos);
    			midmarkers.splice(i+1, 0, newVMarker);
    			/*tmpPolyLine.getPath().removeAt(2);
    			tmpPolyLine.getPath().removeAt(1);
    			tmpPolyLine.getPath().removeAt(0);
    			newpos = null;
    			startMarkerPos = null;
    			firstVPos = null;
    			endMarkerPos = null;
    			secondVPos = null;
    			newVMarker = null;
    			newMarker = null;*/
    			break;
    		}
    	}
        polyPoints = polyShape.getPath();
		
		var shapeObesaved = newpos.lng().toFixed(6) + ',' + newpos.lat().toFixed(6);
        var stringtobesaved = newpos.lat().toFixed(6) + ',' + newpos.lng().toFixed(6);
        var kmlstringtobesaved = newpos.lng().toFixed(6) + ',' + newpos.lat().toFixed(6);
        pointsArray.splice(i+1,0,stringtobesaved);
		shapeArray.splice(i+1,0,shapeObesaved);
        pointsArrayKml.splice(i+1,0,kmlstringtobesaved);
        logCode1();
    });
    return marker;
}
function movemidmarker(index) {
    var newpos = markers[index].getPosition();
    if (index != 0) {
    	var prevpos = markers[index-1].getPosition();
    	midmarkers[index-1].setPosition(new google.maps.LatLng(
    		newpos.lat() - (0.5 * (newpos.lat() - prevpos.lat())),
    		newpos.lng() - (0.5 * (newpos.lng() - prevpos.lng()))
    	));
    	//prevpos = null;
    }
    if (index != markers.length - 1) {
    	var nextpos = markers[index+1].getPosition();
    	midmarkers[index].setPosition(new google.maps.LatLng(
    		newpos.lat() - (0.5 * (newpos.lat() - nextpos.lat())),
    		newpos.lng() - (0.5 * (newpos.lng() - nextpos.lng()))
    	));
    	//nextpos = null;
    }
    //newpos = null;
    //index = null;
}
function removemidmarker(index) {
    if (markers.length > 0) {//clicked marker has already been deleted
    	if (index != markers.length) {
    		midmarkers[index].setMap(null);
    		midmarkers.splice(index, 1);
    	} else {
    		midmarkers[index-1].setMap(null);
    		midmarkers.splice(index-1, 1);
    	}
    }
    if (index != 0 && index != markers.length) {
    	var prevpos = markers[index-1].getPosition();
    	var newpos = markers[index].getPosition();
    	midmarkers[index-1].setPosition(new google.maps.LatLng(
    		newpos.lat() - (0.5 * (newpos.lat() - prevpos.lat())),
    		newpos.lng() - (0.5 * (newpos.lng() - prevpos.lng()))
    	));
    	//prevpos = null;
    	//newpos = null;
    }
    //index = null;
}
function showKML() {
    if(codeID != 1) {
        codeID = gob('codechoice').value = 1; // set KML
        setCode();
    }
    gob('coords1').value = kmlheading();
    for (var i = 0; i < placemarks.length; i++) {
        gob('coords1').value += placemarks[i].plmtext;
    }
    gob('coords1').value += kmlend();
}
function showAddress(address) {
    setGeoCoder().geocode({'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var pos = results[0].geometry.location;
            map.setCenter(pos);
            if(directionsYes == 1) drawDirections(pos);
            if(toolID == 5) drawMarkers(pos);
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}
function activateDirections() {
    directionsYes = 1;
    directionsintroduction();
}
function closethis(name){
    gob(name).style.visibility = 'hidden';
}
function showthis(name){
    gob(name).style.visibility = 'visible';
}
function iconoptions(chosenicon) {
    gob("st2").value = chosenicon;
    gob("currenticon").innerHTML = '<img src="'+chosenicon+'" alt="" />';
}
function styleoptions(){ //present current style
    closethis('polylineoptions');
    closethis('polygonoptions');
    //closethis('rectang');
    closethis('circleoptions');
    closethis('markeroptions');
    if(directionsYes == 1) {
        if(dirtool == 0) {
            showthis('directionstyles');
            dirtool = 1;
        }else{
            closethis('directionstyles');
            dirtool = 0;
        }
    }
    if(toolID == 1){
        showthis('polylineoptions');
        //if(plmcur<placemarks.length-1) lcur = placemarks[plmcur].stylecur;
        gob('polylineinput1').value = polylinestyles[lcur].color;
        gob('polylineinput2').value = polylinestyles[lcur].lineopac;
        gob('polylineinput3').value = polylinestyles[lcur].width;
        gob('polylineinput4').value = polylinestyles[lcur].name;
        gob("stylenumberl").innerHTML = (lcur+1)+' ';
    }
    if(toolID == 2 || toolID == 3){
        showthis('polygonoptions');
        //if(plmcur<placemarks.length-1) pcur = placemarks[plmcur].stylecur;
        gob('polygoninput1').value = polygonstyles[pcur].color;
        gob('polygoninput2').value = polygonstyles[pcur].lineopac;
        gob('polygoninput3').value = polygonstyles[pcur].width;
        gob('polygoninput4').value = polygonstyles[pcur].fill;
        gob('polygoninput5').value = polygonstyles[pcur].fillopac;
        gob('polygoninput6').value = polygonstyles[pcur].name;
        gob("stylenumberp").innerHTML = (pcur+1)+' ';
    }
    if(toolID == 4) {
        showthis('circleoptions');
        gob('circinput1').value = circlestyles[ccur].color;
        gob('circinput2').value = circlestyles[ccur].lineopac;
        gob('circinput3').value = circlestyles[ccur].width;
        gob('circinput4').value = circlestyles[ccur].fill;
        gob('circinput5').value = circlestyles[ccur].fillopac;
        gob('circinput6').value = circlestyles[ccur].name;
        gob("stylenumberc").innerHTML = (ccur+1)+' ';
    }
    if(toolID == 5){
        showthis('markeroptions');
        gob('st1').value = markerstyles[mcur].name;
        iconoptions(markerstyles[mcur].icon);
        gob("stylenumberm").innerHTML = (mcur+1)+' ';
    }
}
function polylinestyle(e){ //save style
    if(e == 1) {
        createlinestyleobject();
        lcur++;
    }
    polylinestyles[lcur].color = gob('polylineinput1').value;
    polylineDecColorCur = color_hex2dec(polylinestyles[lcur].color);
    polylinestyles[lcur].lineopac = gob('polylineinput2').value;
    if(polylinestyles[lcur].lineopac<0 || polylinestyles[lcur].lineopac>1) return alert('Opacity must be between 0 and 1');
    polylinestyles[lcur].width = gob('polylineinput3').value;
    if(polylinestyles[lcur].width<0 || polylinestyles[lcur].width>20) return alert('Numbers below zero and above 20 are not accepted');
    polylinestyles[lcur].kmlcolor = getopacityhex(polylinestyles[lcur].lineopac) + color_html2kml(""+polylinestyles[lcur].color);
    polylinestyles[lcur].name = gob('polylineinput4').value;
    placemarks[plmcur].style = polylinestyles[lcur].name;
    placemarks[plmcur].stylecur = lcur;
    gob("stylenumberl").innerHTML = (lcur+1)+' ';
    if(polyShape) polyShape.setMap(null);
    preparePolyline();
    if(polyPoints.length > 0) {
		dump_latLongs();
        if(codeID == 1) logCode1();
        if(codeID == 2) logCode4();
    }else{
        alert("SAVED!");
    }
}
function polygonstyle(e) {
    if(e == 1) {
        createpolygonstyleobject();
        pcur++;
    }
    polygonstyles[pcur].color = gob('polygoninput1').value;
    polygonDecColorCur = color_hex2dec(polygonstyles[pcur].color);
    polygonstyles[pcur].lineopac = gob('polygoninput2').value;
    if(polygonstyles[pcur].lineopac<0 || polygonstyles[pcur].lineopac>1) return alert('Opacity must be between 0 and 1');
    polygonstyles[pcur].width = gob('polygoninput3').value;
    if(polygonstyles[pcur].width<0 || polygonstyles[pcur].width>20) return alert('Numbers below zero and above 20 are not accepted');
    polygonstyles[pcur].fill = gob('polygoninput4').value;
    polygonFillDecColorCur = color_hex2dec(polygonstyles[pcur].fill);
    polygonstyles[pcur].fillopac = gob('polygoninput5').value;
    if(polygonstyles[pcur].fillopac<0 || polygonstyles[pcur].fillopac>1) return alert('Opacity must be between 0 and 1');
    polygonstyles[pcur].kmlcolor = getopacityhex(polygonstyles[pcur].lineopac) + color_html2kml(""+polygonstyles[pcur].color);
    polygonstyles[pcur].kmlfill = getopacityhex(polygonstyles[pcur].fillopac) + color_html2kml(""+polygonstyles[pcur].fill);
    polygonstyles[pcur].name = gob('polygoninput6').value;
    placemarks[plmcur].style = polygonstyles[pcur].name;
    placemarks[plmcur].stylecur = pcur;
    gob("stylenumberp").innerHTML = (pcur+1)+' ';
    if(polyShape) polyShape.setMap(null);
    if(outerShape) outerShape.setMap(null);
    if(holePolyArray.length > 0) {
        drawpolywithhole();
        if(codeID == 1) logCode3();
        if(codeID == 2) logCode5();
    }
    if(holePolyArray.length == 0) {
        preparePolygon();
        if(polyPoints.length > 0) {
			dump_latLongs();
            if(codeID == 1) logCode2();
            if(codeID == 2) logCode4();
        }else{
            alert("SAVED!");
        }
    }
}

function circlestyle(e) {
    if(e == 1) {
        createcirclestyleobject();
        ccur++;
    }
    circlestyles[ccur].color = gob('circinput1').value;
    circlestyles[ccur].lineopac = gob('circinput2').value;
    if(circlestyles[ccur].lineopac<0 || circlestyles[ccur].lineopac>1) return alert('Opacity must be between 0 and 1');
    circlestyles[ccur].width = gob('circinput3').value;
    circlestyles[ccur].fill = gob('circinput4').value;
    circlestyles[ccur].fillopac = gob('circinput5').value;
    if(circlestyles[ccur].fillopac<0 || circlestyles[ccur].fillopac>1) return alert('Opacity must be between 0 and 1');
    circlestyles[ccur].name = gob('circinput6').value;
    placemarks[plmcur].style = circlestyles[ccur].name;
    placemarks[plmcur].stylecur = ccur;
    gob("stylenumberc").innerHTML = (ccur+1)+' ';
    if(circle) circle.setMap(null);
    activateCircle();
    if(radiusPoint) {
        drawCircle();
        logCode7();
    }else{
        alert("SAVED!");
    }
}
function markerstyle(e) {
    if(e == 1) {
        createmarkerstyleobject();
        mcur++;
    }
    markerstyles[mcur].name = gob('st1').value;
    markerstyles[mcur].icon = gob('st2').value;
    placemarks[plmcur].style = markerstyles[mcur].name;
    placemarks[plmcur].stylecur = mcur;
    gob("stylenumberm").innerHTML = (mcur+1)+' ';
    if(markerShape) {
        markerShape.setIcon(markerstyles[mcur].icon);
    }else{
        alert("SAVED!");
    }
}
function stepstyles(a) {
    if(toolID == 1) {
        if(a == -1) {
            if (lcur > 0) {
                lcur--;
                gob("stylenumberl").innerHTML = (lcur+1)+' ';
                styleoptions();
            }
        }
        if(a == 1){
            if (lcur < polylinestyles.length - 1) {
                lcur++;
                gob("stylenumberl").innerHTML = (lcur+1)+' ';
                styleoptions();
            }
        }
        placemarks[plmcur].style = polylinestyles[lcur].name;
        placemarks[plmcur].stylecur = lcur;
        if(polyShape) polyShape.setMap(null);
        preparePolyline();
        if(polyPoints.length) {
			dump_latLongs();
            if(codeID == 1) logCode1();
            if(codeID == 2) logCode4();
        }
    }
    if(toolID == 2 || toolID == 3) {
        if(a == -1) {
            if (pcur > 0) {
                pcur--;
                gob("stylenumberp").innerHTML = (pcur+1)+' ';
                styleoptions();
            }
        }
        if(a == 1){
            if (pcur < polygonstyles.length - 1) {
                pcur++;
                gob("stylenumberp").innerHTML = (pcur+1)+' ';
                styleoptions();
            }
        }
        placemarks[plmcur].style = polygonstyles[pcur].name;
        placemarks[plmcur].stylecur = pcur;
        if(polyShape) {
            polyShape.setMap(null);
            preparePolygon();
            if(polyPoints.length) {
				dump_latLongs();
                if(codeID == 1) logCode2();
                if(codeID == 2) logCode4();
            }
        }
        if(rectangle) {
            rectangle.setMap(null);
            activateRectangle();
            if(polyPoints.length) {
				dump_latLongs();
                if(codeID == 1) logCode2();
                if(codeID == 2) logCode4();
            }
        }
    }
    if(toolID == 4) {
        if(a == -1) {
            if (ccur > 0) {
                ccur--;
                gob("stylenumberc").innerHTML = (ccur+1)+' ';
                styleoptions();
            }
        }
        if(a == 1){
            if (ccur < circlestyles.length - 1) {
                ccur++;
                gob("stylenumberc").innerHTML = (ccur+1)+' ';
                styleoptions();
            }
        }
        placemarks[plmcur].style = circlestyles[ccur].name;
        placemarks[plmcur].stylecur = ccur;
        if(circle) circle.setMap(null);
        activateCircle();
        if(radiusPoint) {
            logCode7();
        }
    }
    if(toolID == 5) {
        if(a == -1) {
            if (mcur > 0) {
                mcur--;
                gob("stylenumberm").innerHTML = (mcur+1)+' ';
                styleoptions();
            }
        }
        if(a == 1){
            if (mcur < markerstyles.length - 1) {
                mcur++;
                gob("stylenumberm").innerHTML = (mcur+1)+' ';
                styleoptions();
            }
        }
        placemarks[plmcur].style = markerstyles[mcur].name;
        placemarks[plmcur].stylecur = mcur;
        if(markerShape) {
            markerShape.setIcon(markerstyles[mcur].icon);
            logCode9();
        }
    }
}
function docudetails(){
    gob("plm1").value = placemarks[plmcur].name;
    gob("plm2").value = placemarks[plmcur].desc;
    gob("plm3").value = placemarks[plmcur].tess;
    gob("plm4").value = placemarks[plmcur].alt;
    gob("doc1").value = docuname;
    gob("doc2").value = docudesc;
}
function savedocudetails(){
    docuname = gob("doc1").value;
    docudesc = gob("doc2").value;
    placemarks[plmcur].name = gob("plm1").value;
    placemarks[plmcur].desc = gob("plm2").value;
    placemarks[plmcur].tess = gob("plm3").value;
    placemarks[plmcur].alt = gob("plm4").value;
    if(placemarks[plmcur].poly == "pl") logCode1();
    if(placemarks[plmcur].poly == "pg") logCode2();
}

function showCodeintextarea(){
    if (notext === false){
        gob("presentcode").checked = false;
        notext = true;
    }else{
        gob("presentcode").checked = true;
        notext = false;
        if(polyPoints.length > 0){
            if(toolID==1) { // Polyline
			dump_latLongs();
                if(codeID==1) logCode1();
                if(codeID==2) logCode4();
            }
            if(toolID==2) { // Polygon
                if(adder!==0) { // with hole
                    adder = 0;
                    if(codeID == 1) logCode3();
                    if(codeID == 2) logCode5();
                }else{
					dump_latLongs();
                    if(codeID==1) logCode2();
                    if(codeID==2) logCode4();
                }
            }
            if(toolID==3) { // Rectangle
                if(codeID == 2) logCode6();
                if(codeID == 1) logCode2();
            }
            if(toolID==5) {  // Marker
                if(codeID == 1) logCode9();
            }
            if(toolID==6) { // Directions
                if(codeID == 1) logCode1a();
            }
        }
        if(toolID==4) { // Circle
            if(codeID == 2) logCode7();
        }
    }
}
// the copy part may not work with all web browsers
function copyTextarea(){
    gob('coords1').focus();
    gob('coords1').select();
    copiedTxt = document.selection.createRange();
    copiedTxt.execCommand("Copy");
}

function directionsintroduction() {
    gob('coords1').value = 'Ready for Directions. Create a route along roads with markers at chosen locations.\n'
            +'Click on the map, or enter an address and click "Search", to place a marker.\n'
            +'Lines will be drawn along roads from marker to marker.\n'
            +'Use "Delete Last Point" if you want to undo.\n'
            +'KML input may be done at any time for markers by clicking on them.\n'
            +'KML input for the line may be done by clicking on it after you have finished '
            +'drawing and clicked "Next shape".';
}
function markerintroduction() {
    gob('coords1').value = 'Ready for Marker. Click on the map, or enter an address and click "Search", to place a marker.\n'
            +'You may enter your content for the infowindow with "KML input" even if your code choice is Javascript.\n'
            +'Click "Next shape" before each additional marker.';
}
function polylineintroduction() {
    gob('coords1').value = 'Ready for Polyline. Click on the map. The code for the shape you create will be presented here.\n\n'
                        +'When finished with a shape, click Next shape and draw another shape, if you wish.\n'
                        +'\nIf you want to edit a saved polyline or polygon, click on it. Then click Edit lines. '
                        +'When editing, you may remove a point with a click on it.\n'
                        +'\nThe complete KML code for what you have created, is always available with Show KML.';
}
function polygonintroduction() {
    gob('coords1').value = 'Ready for Polygon. Click on the map. The code for the shape you create will be presented here. '
            +'The Maps API will automatically "close" any polygons by drawing a stroke connecting the last coordinate back to the '
            +'first coordinate for any given paths.\n'
            +'\nTo create a polygon with hole(-s), click "Hole" before you start the drawing.\n'
            +'\nWhen finished with a shape, click Next shape and draw another shape, if you wish.\n'
            +'\nIf you want to edit a saved polyline or polygon, click on it. Then click Edit lines. '
            +'When editing, you may remove a point with a click on it.\n'
            +'\nThe complete KML code for what you have created, is always available with Show KML.';
}
function rectangleintroduction() {
    gob('coords1').value = 'Ready for Rectangle. Click two times on the map - first for the southwest and '+
            'then for the northeast corner. You may resize and move '+
            'the rectangle with the two draggable markers you then have.\n\n'+
            'The v3 Rectangle is a polygon. But in Javascript code mode an extra code for '+
            'polyline is presented here in the text area.';
}
function circleintroduction() {
    gob('coords1').value = 'Ready for Circle. Click for center. Then click for radius distance. '+
    'You may resize and move the circle with the two draggable markers you then have.\n\n'+
    'KML code is not available for Circle.';
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











































function load_editor() {
     $('#drawing_map').gmap({'center': pullman_str , 'zoom':15 }).bind('init', function () {
		 var controlOn=true;
		 var drawingMode = false;
		 
		 var type= $('#style_of').val();
		 var coords=$('#latLong').val();
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

		$('#drawing_map').gmap('init_drawing', 
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
								$('#geometric_encoded').val($('#drawing_map').gmap('get_updated_data_encoded'));
							}
						},
					onDrag:function(data){
							$('#latLong').val($('#drawing_map').gmap('get_updated_data'));
							$('#geometric_encoded').val($('#drawing_map').gmap('get_updated_data_encoded'));
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
			$('#drawing_map').gmap('hide_drawingControl');
			$(this).removeClass('showing').addClass('hidden').text('Show controlls');
		});
		$('#drawingcontrolls.hidden').live('click',function(e){
			e.preventDefault();
			e.stopPropagation();
			$('#drawing_map').gmap('show_drawingControl');
			$(this).removeClass('hidden').addClass('showing').text('Hide controlls');
		});
		$('#restart').live('click',function(e){
			e.preventDefault();
			e.stopPropagation();
			$('#drawing_map').gmap('refresh_drawing',false);
		});
		$('#update').live('click',function(e){
			e.preventDefault();
			e.stopPropagation();
			$('#latLong').val($('#drawing_map').gmap('get_updated_data'));
			$('#geometric_encoded').val($('#drawing_map').gmap('get_updated_data_encoded'));
		});
		
		$('#unselect').live('click',function(e){
			e.preventDefault();
			e.stopPropagation();
			$('#latLong').val($('#drawing_map').gmap('unset_drawingSelection'));
		});
		
		
		
		
		var selected_type = '';
		$('#style_of').live('change',function(){
			var totals = $('#drawing_map').gmap('get_drawnElementCount',$(this).val());
			if(totals>=1){
				var r=confirm('You are about to clear the element from the map.\r\n id this ok?');
				if (r==true){
					$('#drawing_map').gmap('clear_drawings');
					selected_type = $(this).val();
				}else{
					$(this).val('selected_type');
					return false;
				}
			}
			$('#drawing_map').gmap('set_drawingMode', $(this).val());
			$('#drawing_map').gmap('show_drawingControl');
		});

	});
	
}




function initialize() {
	if($('#map_canvas').length){
		boxText.innerHTML = setBoxHtml();
		

		ib = generic_infoBox();
	
	
	
	
	
		var styles_0 = [{"featureType":"all","stylers":[{"saturation":"-30"}]},{"featureType":"poi.park","stylers":[{"saturation":"10"},{"hue":"#990000"}]}];
		var styles_0 = new google.maps.StyledMapType(styles_0, {name:"Red Parks"});
		
		
		
		var styles_1 = [{"featureType":"all","stylers":[{"saturation":"-70"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"hue":"#000000"}]}];
		var styles_1 = new google.maps.StyledMapType(styles_1, {name:"Black Roads"});
		var styles_2 = [{"featureType":"poi.business","elementType":"labels","stylers":[{"visibility":"off"}]}];
		var styles_2 = new google.maps.StyledMapType(styles_2, {name:"No Businesses"});	  
	
	
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

	var controlState = controlsIn;//($('.sortStyleOps.orgin').length)?controlsOut:controlsIn;
//setGeoCoder();
   //geocoder = new google.maps.Geocoder();
    //var latlng = new google.maps.LatLng(59.914063, 10.737874);//(45.0,7.0);//45.074723, 7.656433

    map = new google.maps.Map(gob('map_canvas'), jQuery.extend(jQuery.extend(baseOptions,myOptions),controlState));

	var mapTypeControls= {		mapTypeControlOptions:{style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		mapTypeControlOptions: {mapTypeIds: ["style0", "style1", "style2"]}	
	};
	map.setOptions(mapTypeControls); 
	
	/*
	if (typeof(google.maps.Polygon.prototype.runEdit) === "undefined") {
		async_load_js('/Content/js/polygonEdit/src/polygonEdit.js');
	}
	if (typeof(google.maps.Polyline.prototype.runEdit) === "undefined") {
		async_load_js('/Content/js/polylineEdit/src/polylineEdit.js');
	}	
	*/
    polyPoints = new google.maps.MVCArray(); // collects coordinates
    createplacemarkobject();
    createlinestyleobject();
    createpolygonstyleobject();
    createcirclestyleobject();
    createmarkerstyleobject();
    preparePolyline(); // create a Polyline object

    google.maps.event.addListener(map, 'click', addLatLng);
    google.maps.event.addListener(map,'zoom_changed',mapzoom);
    google.maps.event.addListener(map,'mousemove',function(point){
        var LnglatStr6 = point.latLng.lng().toFixed(6) + ', ' + point.latLng.lat().toFixed(6);
        var latLngStr6 = point.latLng.lat().toFixed(6) + ', ' + point.latLng.lng().toFixed(6);
        gob('over').options[0].text = LnglatStr6;
        gob('over').options[1].text = latLngStr6;
    });
		









		map.mapTypes.set("style0", styles_0);
		map.mapTypes.set("style1", styles_1);
		map.setMapTypeId("style1");
		map.mapTypes.set("style2", styles_2);
		
		var request = {
			location: pullman,
			radius: 500,
			types: ['store']
		};
		infowindow = new google.maps.InfoWindow();
		var service = new google.maps.places.PlacesService(map);
		service.search(request, serach_callback);
	
		// Initialize the local searcher
		localSearches = new GlocalSearch();
		localSearches.setSearchCompleteCallback(null, OnLocalSearch);
	
		var mapType = new google.maps.StyledMapType(noPOIbiz, { name:'No Stations' });
		
		map.mapTypes.set('nostations', mapType);
		map.setMapTypeId('nostations');
	
		/*
	
	
		var marker = new google.maps.Marker({
				map: map,
				draggable: true,
				position: pullman,
				visible: true
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
			ib.open(map, marker);
			
		var request = {
			  reference: 'CmRUAAAA4TzMTgyBldDK1U7XIDfwoedorSbMVUSNMAtzfAJIYX7VwJveNjJjWxVqyQtwxNPhljEtSKhDcQpX9rF2gHW1wmej9KXDqPFEFErbRbQk2fmS0rfTddyyY75H1BpGDGcJEhCocWihmMyiH1iMAqXav9YtGhQ1mY0RZ30DFtA9kIu0b-0l2jrn6A' /// bookie
			};
	service.getDetails(request, function(place, status) {
			  if (status == google.maps.places.PlacesServiceStatus.OK) {
				var marker = new google.maps.Marker({
				  map: map,
				  draggable: true,
				  position: place.geometry.location
				});
				var ib = new InfoBox(myOptions);
				google.maps.event.addListener(marker, 'click', function() {
					ib.close();
				  ib.setContent(setBoxHtml(JSON.stringify(place)));
				  ib.open(map, this);
				});
			  }
			});
			
			*/
	
	
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
				
				$('#setLatLong :not(.ui-state-disabled)').live('click',function(){
					drop1();
					$(this).addClass('ui-state-disabled');
				});
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
		
		
   //add listeners to show or hide the controls
   /*     google.maps.event.addDomListener(map.getDiv(),
                                 'mouseover', 
                                 function(e) {
                                    e.cancelBubble=true;
                                    if(!map.hover){
                                      map.hover=true;
                                      map.setOptions(jQuery.extend(myOptions,controlsIn));
                                    }
                                  });

        google.maps.event.addDomListener($('body'), 
                                 'mouseover', 
                                 function(e){
									 if(map.hover){
										 map.setOptions(jQuery.extend(myOptions,controlsOut));
										 map.hover=false;
										}
								  });
        google.maps.event.addDomListener(map.getDiv(), 
                                 'mouseout', 
                                 function(e){
									 if(map.hover){
										 map.setOptions(jQuery.extend(myOptions,controlsOut));
										 map.hover=false;
									  }
								  });
*/
		
		google.maps.event.addListener(map, 'mouseover', function() { 
												 //map.setOptions(); 
												// map.setOptions(jQuery.extend(myOptions,controlsIn));
										  });
		google.maps.event.addListener(map, 'mouseout', function() { 
												 //map.setOptions({disableDefaultUI:false}); 
												 //map.setOptions(jQuery.extend(myOptions,controlsOut));
												 setZoomTooltip;
										  });	  
		google.maps.event.addListener(map, 'zoom_changed', setZoomTooltip);
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

     function updating(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
			//alert(JSON.stringify(results));
          for (var i = 0; i < 1; i++) {
			var request = {reference:results[i].reference};
			var service = new google.maps.places.PlacesService(map);
			//service.search(request, serach_callback);
			service.getDetails(request, function(place, status) {
			  if (status == google.maps.places.PlacesServiceStatus.OK) {
				  //alert(JSON.stringify(place));
				var marker = markers[0];
				
				if(place.name){
					if($('.blink1').length)$('#local_place_names').html('');
					var txt = $.trim($('#local_place_names').html());
					$('#local_place_names').html(txt+ (txt.indexOf(place.name)>-1 ? '' : (txt==""?'':',') +  place.name ));
				}
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