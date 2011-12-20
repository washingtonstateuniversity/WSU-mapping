var sensor=false;
var lang='';

function detectBrowser() {
  var useragent = navigator.userAgent;
  var mapdiv = document.getElementById("map_canvas");
    
  if (useragent.indexOf('iPad') != -1 || useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
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
function loadScript() {
    detectBrowser();
    loadingLang();
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://maps.googleapis.com/maps/api/js?sensor="+sensor+"&callback=initialize"+lang;
    document.body.appendChild(script);
    
    script.type = "text/javascript";
    script.src = "http://nwpassagescenicbyway.org/ScriptDeploy/path/uploads/lib/TEST/infoPanel.js";
    document.body.appendChild(script);
    
    script.type = "text/javascript";
    script.src = "http://nwpassagescenicbyway.org/ScriptDeploy/path/uploads/lib/TEST/vars.js";
    document.body.appendChild(script);
    
    script.type = "text/javascript";
    script.src = "http://nwpassagescenicbyway.org/ScriptDeploy/path/uploads/lib/TEST/overlays.js";
    document.body.appendChild(script);
    
    script.type = "text/javascript";
    script.src = "http://nwpassagescenicbyway.org/ScriptDeploy/path/uploads/lib/TEST/utilities.js";
    document.body.appendChild(script);
    
}

function initialize() {
	directionsDisplay = new google.maps.DirectionsRenderer();
	map = new google.maps.Map(document.getElementById("map_canvas"), mapOps);
	google.maps.event.addListener(map, 'zoom_changed', function() {zoomAlts(programicly);}); 
	
	var MainOverlayDiv = document.createElement('DIV');
	MainOverlayDiv.style.position = 'relative';
	MainOverlayDiv.index = 1;
	var MainOverlay = new makeMainOverlay(MainOverlayDiv, map);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(MainOverlayDiv);

	optionize();
	mapOverlay();
}
$(document).ready(function(){
    loadScript();
});

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
	lableStyles=[];
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
					var pointlable='';
						if(typeof(rpoints.extensions.pointlable) !== 'undefined'){
							pointlable=rpoints.extensions.pointlable.data.toString();
						}
					messArray[rpoints.item.toString()]=pointlable;
					lableStyles[rpoints.item.toString()]=jQuery.parseJSON(rpoints.extensions.lablePosition.data.toString());
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

function mapOverlay(){
	var triangleCoords = [
		new google.maps.LatLng(69.53,-157.5),
		new google.maps.LatLng(13.23,-157.5),
		new google.maps.LatLng(13.23,17.97),
		new google.maps.LatLng(69.53,17.97),
		new google.maps.LatLng(69.53,-157.5)
		];

	// Construct the polygon
	color1 = new google.maps.Polygon({
			paths: triangleCoords,
			strokeColor: "#f4f5c7",
			strokeOpacity: 0.15,
			strokeWeight: 2,
			fillColor: "#f7f3e2",
			fillOpacity: 0.42
		});
	color1.setMap(map);
	// Construct the polygon
	color2 = new google.maps.Polygon({
			paths: triangleCoords,
			strokeColor: "#a0ecff",
			strokeOpacity: 0.15,
			strokeWeight: 2,
			fillColor: "#f3e8b2",
			fillOpacity: 0.23
		});
	color2.setMap(map);
	// Construct the polygon
	color3 = new google.maps.Polygon({
			paths: triangleCoords,
			strokeColor: "#f4f5c7",
			strokeOpacity: 0.15,
			strokeWeight: 2,
			fillColor: "#aff5ea",
			fillOpacity: 0.11
		});
	color3.setMap(map);
	
	
	var myCoordinates = state();
	var polyOptions = {
			path: myCoordinates,
			strokeColor: "#d1cec5",
			strokeOpacity: 1,
			strokeWeight: 10
		}
	var it = new google.maps.Polyline(polyOptions);
	it.setMap(map);
	
	/////nez ind trib land
	var myCoordinates = [
			new google.maps.LatLng(46.535203,-116.899312),
			new google.maps.LatLng(46.565425,-116.259358),
			new google.maps.LatLng(46.133173,-115.905049),
			new google.maps.LatLng(45.997871,-115.959981),
			new google.maps.LatLng(46.220657,-116.841634),
			new google.maps.LatLng(46.442307,-116.877339),
			new google.maps.LatLng(46.435919,-116.908582),
			new google.maps.LatLng(46.534731,-116.910985)
		];
	var polyOptions = {
			path: myCoordinates,
			strokeColor: "#dbc9b1",
			strokeOpacity: 1,
			strokeWeight:0.25,
			fillColor: "#dbc9b1",
			fillOpacity: 0.25
		}
	var it = new google.maps.Polyline(polyOptions);
	it.setMap(map);
	
	/// map part -- windchaster
	var myCoordinates = road_I95();
	var polyOptions = {
			path: myCoordinates,
			strokeColor: "#000000",
			strokeOpacity: 1,
			strokeWeight:1
		}
	var it = new google.maps.Polyline(polyOptions);
	it.setMap(map);
	
	var myCoordinates = river();
	var polyOptions = {
			path: myCoordinates,
			strokeColor: "#1d8bda",
			strokeOpacity: 1,
			strokeWeight: 2
		}
	var it = new google.maps.Polyline(polyOptions);
	it.setMap(map);
	
	var myCoordinates = riverSnake();
	var polyOptions = {
			path: myCoordinates,
			strokeColor: "#0e5eb8",
			strokeOpacity: 1,
			strokeWeight: 2
		}
	var it = new google.maps.Polyline(polyOptions);
	it.setMap(map);
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
		directionsDisplay = new google.maps.DirectionsRenderer({ 
				map: map, 
				suppressPolylines:true,
				suppressMarkers:true
				//markerOptions: markerOptions
			}); 
		//directionsDisplay.setMap(map);
		stepDisplay = new google.maps.InfoWindow();
		google.maps.event.addListener(directionsDisplay, 'directions_changed', function(){});
		jsonloadPage(id,true);
}




/* the frame of the map*/
function makeMainOverlay(OverlayDiv, map) {
	var JmapTop = document.createElement('DIV');
	JmapTop.setAttribute('id','JmapTop');
	JmapTop.style.zIndex  = '1';
	OverlayDiv.appendChild(JmapTop);
  
	var JmapLeft = document.createElement('DIV');
	JmapLeft.setAttribute('id','JmapLeft');
	JmapLeft.style.zIndex  = '1';
	OverlayDiv.appendChild(JmapLeft);
	
	var JmapRight = document.createElement('DIV');
	JmapRight.setAttribute('id','JmapRight');
	JmapRight.style.zIndex  = '1';
	OverlayDiv.appendChild(JmapRight);
	
	var JmapBottom = document.createElement('DIV');
	JmapBottom.setAttribute('id','JmapBottom');
	JmapBottom.style.zIndex  = '1';
	OverlayDiv.appendChild(JmapBottom);
}
/* example button for map*/
function HomeControl(controlDiv, map) {
	// Set CSS styles for the DIV containing the control
	// Setting padding to 5 px will offset the control
	// from the edge of the map
	controlDiv.style.padding = '5px';
  
	// Set CSS for the control border
	var controlUI = document.createElement('DIV');
	controlUI.style.backgroundColor = 'white';
	controlUI.style.borderStyle = 'solid';
	controlUI.style.borderWidth = '2px';
	controlUI.style.cursor = 'pointer';
	controlUI.style.textAlign = 'center';
	controlUI.title = 'Click to set the map to Home';
	controlDiv.appendChild(controlUI);
  
	// Set CSS for the control interior
	var controlText = document.createElement('DIV');
	controlText.style.fontFamily = 'Arial,sans-serif';
	controlText.style.fontSize = '12px';
	controlText.style.paddingLeft = '4px';
	controlText.style.paddingRight = '4px';
	controlText.innerHTML = '<b>Home</b>';
	controlUI.appendChild(controlText);
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







/*------------------------
   Clean up functions
    ---------------------------*/
function clear_highlights(mark) {
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
	var summaryPanel = document.getElementById("directions_panel");
	summaryPanel.innerHTML = "";
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
	var lOps=lableStyles[pID];
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







});

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




