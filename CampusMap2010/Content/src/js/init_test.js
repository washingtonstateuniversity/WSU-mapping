/* Global vars note: at some point mush abstract */
/* this should be only created as needed */




/* non-abstract */

var pos=pos||{};
var base=base||{};
var pageTracker=pageTracker||null;
var styles=styles||{};
var InfoBox=InfoBox||null;
var startingUrl=startingUrl||null;


( function($) {
	$.extend($.wsu_maps.prototype, {
		geoLocate:function (){
			if($('.geolocation').length){
				$.wsu_maps.state.mapInst.gmap("geolocate",true,false,function(mess, pos){
					//$('#centralMap').gmap("make_latlng_str",pos)//alert('hello');
					$.wsu_maps.state.mapInst.gmap('addMarker', { 
							position: pos,
							icon:$.wsu_maps.state.siteroot+"Content/images/map_icons/geolocation_icon.png"
						},function(){//ops,marker){
						//markerLog[i]=marker;
						//$('#centralMap').gmap('setOptions', {'zIndex':1}, markerLog[i]);
						//if($.isFunction(callback))callback(marker);
					});
				});
			}
		},
		ini_map_view:function (map_ele_obj,callback){
			var map_op = {'center': $.wsu_maps.state.campus_latlng_str , 'zoom':15 };
			//map_op = $.extend(map_op,{"mapTypeControl":false,"panControl":false});
			if($('#runningOptions').length){
				if($('#runningOptions').html()==="{}"||$('#runningOptions').html()===""){
			
				}else{
					//map_op= {}
					$('#runningOptions').html($('#runningOptions').html().replace(/(\"mapTypeId\":"\w+",)/g,''));
					var jsonStr = $('#runningOptions').html();
					//var mapType = jsonStr.replace(/.*?(\"mapTypeId\":"(\w+)".*$)/g,"$2");
					jsonStr = jsonStr.replace(/("\w+":\"\",)/g,'').replace(/(\"mapTypeId\":"\w+",)/g,'');
		
					$.extend(map_op,pos,base,$.parseJSON(jsonStr));
				}
			}
			map_ele_obj.gmap(map_op).bind('init', function() { 
				//var map = map_ele_obj.gmap("get","map");
				$.wsu_maps.ini_GAtracking('UA-22127038-5');
				$.wsu_maps.poi_setup($('#centralMap'));
				if($('.mobile').length){
					$.wsu_maps.geoLocate();
				}
				callback();
			});
		},
		
		

		setup:function (){//jObj){
			$('#loading').remove();
			if(typeof(startingUrl)!=="undefined"){
				$.wsu_maps.updateMap($('#centralMap'),encodeURI(startingUrl.indexOf("&")?startingUrl.split('=')[1].split('&')[0]:startingUrl.split('=')[1]),false,function(){
						if(parseInt(startingUrl.split('=')[1], 10)>0){
							var marker = $.wsu_maps.state.markerbyid[parseInt(startingUrl.split('=')[1], 10)];
							
							//google.maps.event.trigger(marker, 'click');
							$(marker).triggerEvent('click');
						}
					});
				var link = startingUrl.split('=')[1].split('&')[0].toString(); 
				//alert(link);
				if(startingUrl.split('=')[1].indexOf(',')>0){
					$.each(startingUrl.split('=')[1].split(','),function(i,v){
						$.wsu_maps.nav.menuDressChild($('#main_nav a[href$="'+v+'"]'));
					});
				}else{
					$.wsu_maps.nav.menuDressChild($('#main_nav a[href$="'+link+'"]'));
				}		
			}
		
		
			$.wsu_maps.listings.setup_listingsBar($('#centralMap'));
			$.wsu_maps.setup_directions($('#centralMap'));
			$.wsu_maps.nav.setup_nav($('#centralMap'));
			$.wsu_maps.general.setup_embeder();
			$.wsu_maps.general.addErrorReporting();
			
			$.wsu_maps.setup_pdfprints();
			if($('.layoutfree').length){
				$('a').not('#nav a').on("click",function(e){
					e.stopPropagation();
					e.preventDefault();	
				});
				$('.ui-tabs-panel .content a').on("click",function(e){
					e.stopPropagation();
					e.preventDefault();	
				});
			}
			if($( "#placeSearch input[type=text]" ).length){
				$.wsu_maps.search.setup_mapsearch($('#centralMap'));
				
			}
			if($('.veiw_base_layout.public').length){
		
				
				$.wsu_maps.mapping.reloadShapes();
				$.wsu_maps.mapping.reloadPlaces();
			}
			
			
		},






		ini_GAtracking:function (gacode){
			var data = [
				{
					"element":"a[href^='http']:not([href*='wsu.edu'])",
					"options":{
						"mode":"event,_link",
						"category":"outbound"
						}
				},{
					"element":"a[href*='wsu.edu']:not([href^='/'],[href*='**SELF_DOMAIN**'])",
					"options":{
						"skip_internal":"true",
						"category":"internal",
						"overwrites":"true"
						}
				},{
					"element":"a[href*='.rss']",
					"options":{
						"category":"Feed",
						"action":"RSS",
						"overwrites":"true"
						}
				},{
					"element":"a[href*='mailto:']",
					"options":{
						"category":"email",
						"overwrites":"true"
						}
				}
			];
			$.jtrack.defaults.debug.run = false;
			$.jtrack.defaults.debug.v_console = false;
			$.jtrack.defaults.debug.console = true;
			$.jtrack({load_analytics:{account:gacode}, trackevents:data });
		},
		ini_addthis:function (username){
			if(typeof(username)==="undefined"){
				username="mcwsu";
			}
			/*var addthis_config = {
				  services_compact: 'email, facebook, twitter, myspace, google, more',
				  services_exclude: 'print',
				  ui_click: true
			};*/
			/*var addthis_share ={
				templates: {twitter: 'check out {{url}} '}
			};*/
			if($('body.addthis').length===0){
				$.wsu_maps.getSmUrl("",function(url){
					$('#addthisScript').attr('src', "http://s7.addthis.com/js/250/addthis_widget.js#async=1&username="+username+"&" + Math.random() );
					$.getScript( "http://s7.addthis.com/js/250/addthis_widget.js#async=1&username="+username+"&" + Math.random());
					addthis.init(); 
					
					addthis.ost = 0;
					addthis.update('share', 'url', url);
					addthis.ready();
					$('body').addClass('addthis');
				});
			}
			addthis.addEventListener('addthis.menu.open', function(){
				$.wsu_maps.getSmUrl("",function(url){
					addthis.ost = 0; 
					addthis.update('share', 'url', url); // new url 
					//addthis.update('share', 'title', window.document.title); // new title. 
					addthis.ready();
				});
			});
		},
		poi_setup:function (){//jObj){
			var proto = google.maps.InfoWindow.prototype,
				open = proto.open;
			proto.open = function(map, anchor, please) {
				if (please) {
					return open.apply(this, arguments);
				}
			};
		},
		clearHereToThere:function (){
			if($.wsu_maps.state.hasDirection){
				$.wsu_maps.state.hasDirection=false;
				$.wsu_maps.state.cFrom="";
				$.wsu_maps.state.cTo="";
				$('#centralMap').gmap('clear','overlays');
				$('#centralMap').gmap('clear','serivces');
			}
		},
		
		display_directions:function (jObj,results){
			
			$.wsu_maps.general.autoOpenListPanel(function(){
				
				
				if($('#directions-panel').length===0){
					$('#selectedPlaceList_area').append('<div id="directions-panel">');
				}
				if($('#directions_area').length===0){
					$('#directions-panel').append('<div id="directions_area">');
				}
				$.wsu_maps.listings.destroy_Dirscrollbar();
				
				var directionsDisplay = jObj.gmap('get','services > DirectionsRenderer');
				directionsDisplay.setPanel(document.getElementById('directions_area'));
				directionsDisplay.setDirections(results);
											
				if($('#directions-panel #output').length===0){
					$('#directions-panel').prepend('<div id="output"><a href="#" id="printDir">Print</a><a href="#" id="emailDir">Email</a></div>');
				}
				google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
					$.wsu_maps.listings.destroy_Dirscrollbar();
					$.wsu_maps.listings.setup_Dirscrollbar($('#directions-panel'));
				}); 
				directionsDisplay.setDirections(results);
				$.wsu_maps.general.listTabs("directions");
				$.wsu_maps.general.addEmailDir();
			});
		},
		
		getSmUrl:function (query,callback){
			
			var url = $.wsu_maps.getUrlPath(query);
			
			$.get('/public/get_sm_url.castle?_url=/'+encodeURIComponent(url),function(data){
				if(data!=="false"){
					//alert(data)
					url = "t/"+data;
				}
				if(typeof(callback)!=="undefined"){
					callback($.wsu_maps.state.siteroot+url);
				}
				return $.wsu_maps.state.siteroot+url;
			});
			
		},
		getUrl:function (query){//maybe deleting
			return $.wsu_maps.state.siteroot+$.wsu_maps.getUrlPath(query);
		},

		getUrlPath:function (query){
			var url = $.wsu_maps.state.mapview;
			
			url+=($.wsu_maps.state.cur_nav!==false?'?cat[]='+$.wsu_maps.state.cur_nav:'');
			url+=($.wsu_maps.state.cur_mid>0?(url.indexOf('?')>-1?'&':'?')+'pid='+$.wsu_maps.state.cur_mid:'');
			url+=(typeof(query)!=="undefined"?(url.indexOf('?')>-1?'&':'?')+query:'');
		
			return url;
		},

		/*updateUrl:function (nav,pid){
			$.wsu_maps.state.cur_nav = nav;
			$.wsu_maps.state.cur_mid = pid;
		}*/
		hereToThere:function (jObj){
			if($.wsu_maps.state.cTo===""||$.wsu_maps.state.cFrom ===""){
				return false;
			}
			$.wsu_maps.clearHereToThere();
			
			$.colorbox.remove();
			$.colorbox({
				rel:'gouped',
				html:function(){
					return '<div id="modeArea"><h2>Choose Mode</h2><select id="trasMode"><option value="Walk">Walk</option><option value="Bike">Bike</option><option value="Car">Car</option><option value="Transit">Transit</option></select><br/><input type="Submit" value="Continue" name="modeSubmit"/></div>';
				},
				scrolling:false,
				opacity:0.7,
				transition:"none",
				width:275,
				open:true,
				onComplete:function(){
					//if($('#colorbox #cb_nav').length)$('#colorbox #cb_nav').html("");
					$('#modeArea [type="Submit"]').off().on('click',function(e){
						$.colorbox.close();
						e.stopPropagation();
						e.preventDefault();
						var mode;
						switch($('#trasMode').val()){
							case "Walk":
								mode = google.maps.DirectionsTravelMode.WALKING;
								break;
							case "Bike":
								mode = google.maps.DirectionsTravelMode.BICYCLING;
								break;
							case "Car":
								mode = google.maps.DirectionsTravelMode.DRIVING;
								break;
							case "Transit":
								mode = google.maps.DirectionsTravelMode.TRANSIT;
								break;
						}
						jObj.gmap('displayDirections',
							{origin:$.wsu_maps.state.cFrom,destination:$.wsu_maps.state.cTo,travelMode: mode},
							{draggable: true},
							function(results){
								$.wsu_maps.state.cFrom="";
								$.wsu_maps.state.cTo="";
								$.wsu_maps.state.hasDirection=true;
								$('#loading').remove();
								$.wsu_maps.display_directions(jObj,results);
						});
					});
				}
			});	
		
		},
		
	});




	$.wsu_maps.mapping={
		/* one of these must leave
		reloadPlaces:function (){
			var show_global_nav=show_global_nav||true;
			var ids=ids||"";
			var url=$.wsu_maps.state.siteroot+"public/getPlaceJson_byIds.castle";
			if(typeof(ids)!==""){
				$.getJSON(url+'?callback=?&ids[]='+ids.replace(", 0",""), function(data) {
					$.each($.wsu_maps.state.ib, function(i) {$.wsu_maps.state.ib[i].close();});
					$('#centralMap').gmap('clear','markers');
					
					$.wsu_maps.general.loadData($('#centralMap'),data,null,function(){//marker){
						//ib[0].open($('#centralMap').gmap('get','map'), marker);
						//$.wsu_maps.state.cur_mid = mid[0];
					});
					if(show_global_nav){
						$.wsu_maps.general.loadListings(data,false);
					}
					$.wsu_maps.general.prep_html();
				});
			}	
		},
		reloadShapes:function (){
			var sids=sids||"";
			var url=$.wsu_maps.state.siteroot+"public/getShapesJson_byIds.castle";
			//var jObj=$('#centralMap');
			
			if(typeof(ids)!=="undefined"){
				$.getJSON(url+'?callback=?&ids[]='+sids.replace(", 0",""), function(data) {
					$('#centralMap').gmap('clear','overlays');
					$.each( data.shapes, function(i, shape) {	
						$.wsu_maps.mapping.addShapeToMap($('#centralMap'),i, shape);
					});
				});
			}
		},*/
		
		
		reloadPlaces:function (){
			var url=$.wsu_maps.state.siteroot+"public/getPlaceJson_byIds.castle";
			var ids;
			
			$.each($('[name="placelist[]"]'),function(){
				ids =(typeof(ids)==="undefined"?'':ids+',')+$(this).val();
			});
			var jObj=$('#place_drawing_map');
			jObj.gmap('clear','markers');
			if(typeof(ids)!=="undefined"){
				$.getJSON(url+'?callback=?&ids[]='+ids, function(data) {
					$.each($.wsu_maps.state.ib, function(i) {$.wsu_maps.state.ib[i].close();});
					
					
					$.wsu_maps.general.loadData(jObj,data,null,function(){//marker){
						//ib[0].open($('#place_drawing_map').gmap('get','map'), marker);
						//cur_mid = mid[0];
					});
					$.wsu_maps.general.prep_html();
				});
			}
			//alert('order::'+ids);
		},
		reloadShapes:function (){
			var url=$.wsu_maps.state.siteroot+"public/getShapesJson_byIds.castle";
			var ids;
			$.each($('[name="geolist[]"]'),function(){
					ids =(typeof(ids)==="undefined"?'':ids+',')+$(this).val();
			});
			var jObj=$('#place_drawing_map');
			jObj.gmap('clear','overlays');
			if(typeof(ids)!=="undefined"){
				$.getJSON(url+'?callback=?&ids[]='+ids, function(data) {
					$.each( data.shapes, function(i, shape) {	
						$.wsu_maps.mapping.addShapeToMap(jObj,i, shape);
					});
				});
			}	
		},
		
		
		
		addShapeToMap:function(jObj,i,shape){
			var pointHolder = {};
			var style = {};
			if(typeof(shape.latlng_str)==="undefined" && shape.latlng_str!=='' && shape.type==='polyline'){ 
				pointHolder = {'path' : shape.latlng_str };
			}
			if(typeof(shape.latlng_str)==="undefined" && shape.latlng_str!=='' && shape.type==='polygon'){ 
				pointHolder = {'paths' : shape.latlng_str };
			}
			if(typeof(shape.encoded)!=="undefined"){ 
				pointHolder = {'paths' : shape.encoded };
			}
			if(typeof(shape.style)==="undefined"||shape.style===''){
				style = shape.type==='polygon'? {'fillOpacity':0.99,'fillColor':'#981e32','strokeColor':'#262A2D','strokeWeight':1}:{'strokeOpacity':0.99,'strokeColor':'#262A2D','strokeWeight':2};
			}else{
				style =  shape.style.events.rest;
			}
			if(!$.isEmptyObject(pointHolder)){
				style = $.extend( style , pointHolder );
			}
			
			if((typeof(shape.style)==="undefined"||shape.style==='') && typeof(shape.type)!=="undefined"){
				jObj.gmap('addShape',(shape.type.charAt(0).toUpperCase() + shape.type.slice(1)), style);
			}else{
				
				// $('#place_drawing_map').gmap('addShape',(shape.type[0].toUpperCase() + shape.type.slice(1)), style)
				jObj.gmap('addShape', (shape.type.charAt(0).toUpperCase() + shape.type.slice(1)), style, function(shape_obj){
				$(shape_obj).on('click',function(){
					if(typeof(shape.style.events.click)!=="undefined" && shape.style.events.click !== ""){
						jObj.gmap('setOptions',shape.style.events.click,this);
						if(typeof(shape.style.events.click.onEnd)!=="undefined" && shape.style.events.click.onEnd !== ""){
							(function(){
								window.jObj=jObj;
								window.i=i;
								/* jshint ignore:start */ //the safer eval still throws lint error
								var p= shape.style.events.click.onEnd.replace('\u0027',"'");
								var f=  new Function(p); 
								f();
								/* jshint ignore:end */
							})();
						}
					}
				 }).mouseover(function(){
					 if(typeof(shape.style.events.mouseover)!=="undefined" && shape.style.events.mouseover !== ""){
						 jObj.gmap('setOptions',shape.style.events.mouseover,this);
						if(typeof(shape.style.events.mouseover.onEnd)!=="undefined" && shape.style.events.mouseover.onEnd !== ""){
							(function(){
								window.jObj=jObj;
								window.i=i;
								/* jshint ignore:start */ //the safer eval still throws lint error
								var p= shape.style.events.mouseover.onEnd.replace('\u0027',"'");
								var f=  new Function(p); 
								f();
								/* jshint ignore:end */
							})();
						}		
					 }
				}).mouseout(function(){
					if(typeof(shape.style.events.rest)!=="undefined" && shape.style.events.rest !== ""){
						jObj.gmap('setOptions',shape.style.events.rest,this);
						if(typeof(shape.style.events.rest.onEnd)!=="undefined" && shape.style.events.rest.onEnd !== ""){
							(function(){
								window.jObj=jObj;
								window.i=i;
								/* jshint ignore:start */ //the safer eval still throws lint error
								var p= shape.style.events.rest.onEnd.replace('\u0027',"'");
								var f=  new Function(p); 
								f();
								/* jshint ignore:end */
							})();
						}
					}
				}).dblclick(function(){
					if(typeof(shape.style.events.dblclick)!=="undefined" && shape.style.events.dblclick !== ""){
						jObj.gmap('setOptions',shape.style.events.dblclick,this);
							(function(){
								window.jObj=jObj;
								window.i=i;
								/* jshint ignore:start */ //the safer eval still throws lint error
								var p= shape.style.events.dblclick.onEnd.replace('\u0027',"'");
								var f=  new Function(p); 
								f();
								/* jshint ignore:end */
							})();
					}
				})
				.trigger('mouseover')
				.trigger('mouseout');
				});
			}	
		},
	};
	$.wsu_maps.markers = {
		make_Marker:function (jObj,i,id,marker,markerCallback){	
			if(marker.style.icon){
				marker.style.icon = marker.style.icon.replace('{$i}',i+1);
			}
			jObj.gmap('addMarker', $.extend({ 
					'position': new google.maps.LatLng(marker.position.latitude, marker.position.longitude),
					'z-index':1,
					'title':marker.title
				},marker.style),function(ops,marker){
					$.wsu_maps.state.markerLog[i]=marker;
					$.wsu_maps.state.markerbyid[id] = $.wsu_maps.state.markerLog[i];
					 // these too are needing to be worked together
					jObj.gmap('setOptions', {'zIndex':1}, $.wsu_maps.state.markerLog[i]);
					if(typeof(markerCallback)!=="undefined" && $.isFunction(markerCallback)){
						markerCallback(marker);
					}
				})
			.click(function() {
					$.wsu_maps.infobox.open_info(jObj,i,marker);
					if(typeof($.jtrack)!=="undefined"){
						$.jtrack.trackEvent(pageTracker,"infowindow via marker", "opened", marker.title);
					}
				})
			.rightclick(function(event){$.wsu_maps.showContextMenu(event.latLng);})
			.mouseover(function(){//event){
				$.wsu_maps.infobox.open_toolTip(jObj,i,marker);
			})
			.mouseout(function(){//event){
				$.wsu_maps.infobox.close_toolTips();
			});
		}
	};

})(jQuery);
//var needsMoved=0;




