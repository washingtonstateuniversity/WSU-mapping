/* Global vars note: at some point mush abstract */
/* this should be only created as needed */

var siteroot=siteroot||"";
var view=view||"";
var mcv_action=mcv_action||"";
var campus=campus||"";
var campus_latlng_str=campus_latlng_str||"";


$.wsu_maps.state = {
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
	currentLocation:$.wsu_maps.state.siteroot+$.wsu_maps.state.mapview,
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

};



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
					addCentralControlls();
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
			setup_directions($('#centralMap'));
			$.wsu_maps.nav.setup_nav($('#centralMap'));
			$.wsu_maps.general.setup_embeder();
			$.wsu_maps.general.addErrorReporting();
			
			setup_pdfprints();
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
})(jQuery);


$.wsu_maps.search={
	focuseitem:{},
	setup_mapsearch:function (jObj){
		/* Search autocomplete */
		//var cur_search = "";
		//var termTemplate = "<strong>%s</strong>";
		var term = "";
		$( "#placeSearch input[type=text]" ).autocomplete({
			source: function( request, response ) {
				term = request.term;
				$.ajax({
					url: $.wsu_maps.state.siteroot+"public/keywordAutoComplete.castle",
					dataType: "jsonp",
					data: {
						featureClass: "P",
						style: "full",
						maxRows: 12,
						name_startsWith: request.term
					},
					success: function( data){//, status, xhr  ) {
						var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
						response( $.map( data, function( item ) {
							var text = item.label;
							if ( (item.value && ( !request.term || matcher.test(text)) || item.related === "header" || item.related === "true" ) ){
								return {
									label: item.label,
									value: item.value,
									place_id: item.place_id,
									related: item.related,
								};
							}
						}));
					}
				});
			},
			search: function(){//event, ui) {
				$.wsu_maps.search.focuseitem={};
				/**/
			},
			minLength: 2,
			select: function( e, ui ) {
				var id = ui.item.place_id;
				var term = ui.item.label;
	
				var url=$.wsu_maps.state.siteroot+"public/get_place.castle";
				if ( e.which !== 13 ){
					if(typeof($.jtrack)!=="undefined"){
						$.jtrack.trackPageview(pageTracker,url+(id!==""?'?id='+id:'')+(term!==""?'&term='+term:''));
					}
					getSignlePlace(jObj,id);
				}
				
				$( "#placeSearch input[type=text]" ).autocomplete("close");
			},
			focus: function( event, ui ) {
				$( "#placeSearch [type=text]" ).val( ui.item.label );
				$.wsu_maps.search.focuseitem={
					label:ui.item.label,
					id:ui.item.place_id
				};
				return false;
			},
			open: function(){//e,ui) {
				$('.ui-autocomplete.ui-menu').removeClass( "ui-corner-all" );
			 }
		}).data( "autocomplete" )._renderItem = function( ul, item ) {
			var text =item.label;
			if(item.related==="header"){
				text = "<em>Related search items</em>";
			}else{
				text ="<a>" + text.replace( new RegExp( "(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi" ), "<strong>$1</strong>" )+"</a>";
			}
			return $( "<li></li>" )
				.data( "item.autocomplete", item )
				.append( text )
				.appendTo( ul );
		};
		$( "#placeSearch input[type='text']" ).on('keyup',function(e) {
			if ( e.which === 13){
				var id   = (typeof($.wsu_maps.search.focuseitem.id)!=="undefined"&&$.wsu_maps.search.focuseitem.id!=="")?$.wsu_maps.search.focuseitem.id:$( "#placeSearch .ui-autocomplete-input" ).val();
				var url=$.wsu_maps.state.siteroot+"public/get_place.castle";
				if(typeof($.jtrack)!=="undefined"){
					$.jtrack.trackPageview(pageTracker,url+(id!==""?'?id='+id:'')+(term!==""?'&term='+term:''));
				}
				$( "#placeSearch input[type=text]" ).autocomplete("close");
				getSignlePlace(jObj,id);
				
			}
		});	
		$("#placeSearch input[type='submit']").off().on('click',function(e){
			e.stopPropagation();
			e.preventDefault();
			//var btn=$(this);
			var url = url||"";
			var id   = (typeof($.wsu_maps.search.focuseitem.id)!=="undefined"&&$.wsu_maps.search.focuseitem.id!=="")?$.wsu_maps.search.focuseitem.id:$( "#placeSearch .ui-autocomplete-input" ).val();
			getSignlePlace(jObj,id);
			if(typeof($.jtrack)!=="undefined"){
				$.jtrack.trackPageview(pageTracker,url+(id!==""?'?id='+id:'')+(term!==""?'&term='+term:''));
			}
		});
	},
};
















/* non-abstract */
function addCentralControlls(){
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
	hideContextMenu();
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
		hideContextMenu();
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
		hideContextMenu();
		if($.wsu_maps.state.cTo==="" || $.wsu_maps.state.cFrom ===""){
			return false;
		}
		$.wsu_maps.clearHereToThere();
		$.wsu_maps.hereToThere($('#centralMap'));
	});
}
function hideContextMenu() {
	$('.contextmenu').remove();
}








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
		.rightclick(function(event){showContextMenu(event.latLng);})
		.mouseover(function(){//event){
			$.wsu_maps.infobox.open_toolTip(jObj,i,marker);
		})
		.mouseout(function(){//event){
			$.wsu_maps.infobox.close_toolTips();
		});
	}
};


//var needsMoved=0;



var last_searched=0;
function getSignlePlace(jObj,id){
	var url=$.wsu_maps.state.siteroot+"public/get_place.castle";
	$( "#placeSearch input[type=text]" ).autocomplete("close");
	$( "#placeSearch input[type=text]" ).blur();
	var found=false;
	
	if(!$.isNumeric(id) && last_searched !== id){
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
					last_searched = id;
				//});
			}
			
		});
	}else if(last_searched !== id){
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
			last_searched = id;
		});
	}
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










function setup_directions(jObj){
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
}

$.wsu_maps.listings = {
	setup_listingsBar:function (){//jObj){
		/* Other after gmap ini */
		$('#selectedPlaceList_btn').off().on('click', function(e){
			e.stopPropagation();
			e.preventDefault();
			var btn=$(this);
			$('.gmnoprint[controlheight]:first').css({'margin-left':'21px'});
			if(btn.closest('#selectedPlaceList').width()<=1){
				$('#selectedPlaceList').addClass("active");
				btn.closest('#selectedPlaceList').stop().animate({
					width:"190px"
					}, 250, function() {
						btn.addClass("active");
						if($('#directions-panel').length){
							$.wsu_maps.listings.setup_Dirscrollbar($('#directions-panel'));
						}
						//$('#selectedPlaceList_area').css({'overflow-y':'auto'});
						//setup_scrollbar($('#listing'));	
						
						//$(window).trigger("resize");
				});
				$('.central_layout.public.central #centralMap').animate({
					'margin-left':'190px','width':
					$('.central_layout.public.central #centralMap').width()-190
				},
				250,
				function() {
					}).addClass("opended");
				//listOffset=190;
				//$(window).trigger("resize");
			}else{
				$('#selectedPlaceList').removeClass("active");
				btn.closest('#selectedPlaceList').stop().animate({
					width:"0px"
					}, 250, function() {
						btn.removeClass("active");
						$('#selectedPlaceList_area').css({'overflow-y':'hidden'});
						//$(window).trigger("resize");
				});
				$('.central_layout.public.central #centralMap').animate({'margin-left':'0px','width':$('.central_layout.public.central #centralMap').width()+190}, 500, function() {}).removeClass("opended");
				//$(window).trigger("resize");
				//listOffset=0;
			}
		});
	},

	setup_Listscrollbar:function (jObj){
		if(typeof(jObj)!=="undefined"){
			$.wsu_maps.state.apiL=null;
			jObj.removeAttr('height');
			
			jObj.find('.cAssest').removeAttr('style');
			
			jObj.height($('#selectedPlaceList_area').height()-(typeof(jObj.css("margin-top"))!=="undefined"?jObj.css("margin-top").split('px')[0]:0) );
			
			var settings = {
				//showArrows: true
			};
			var pane = jObj;
			pane.jScrollPane(settings);
			$.wsu_maps.state.apiL = pane.data('jsp');
			$.extend($.wsu_maps.state.apiL,{jObj:jObj});
			$.extend($.wsu_maps.state.apiL,{settings:settings});
		}
	},
	setup_Dirscrollbar:function (jObj){
		if(typeof(jObj)!=="undefined"){
			jObj.removeAttr('height');
			jObj.find('.cAssest').removeAttr('style');
			jObj.height($('#selectedPlaceList_area').height()-(typeof(jObj.css("margin-top"))!=="undefined"?jObj.css("margin-top").split('px')[0]:0) );
			
			var settings = {
				//showArrows: true
			};
			var pane = jObj;
			pane.jScrollPane(settings);
			$.wsu_maps.state.apiD = pane.data('jsp');
			$.extend($.wsu_maps.state.apiD,{jObj:jObj});
			$.extend($.wsu_maps.state.apiD,{settings:settings});
		}
	},
	reset_Listscrollbar:function(){
		if($.wsu_maps.state.apiL!==null){
			$.wsu_maps.listings.destroy_Listscrollbar(function(){
				$.wsu_maps.listings.setup_Listscrollbar($('#listing'));
				//apiL.reinitialise();
			});
		}
	},
	reset_Dirscrollbar:function(){
		if($.wsu_maps.state.apiD!==null){
			$.wsu_maps.listings.destroy_Dirscrollbar(function(){
				$.wsu_maps.listings.setup_Dirscrollbar($('#directions-panel'));
				//apiD.reinitialise();
			});
		}
	},
	destroy_Listscrollbar:function (callback){
		if($.wsu_maps.state.apiL!==null && !$.isEmptyObject($.wsu_maps.state.apiL.jObj)){
			$.wsu_maps.state.apiL.destroy();
			$.wsu_maps.state.apiL=null;
		}
		if($.isFunction(callback)){
			callback();
		}
	},
	destroy_Dirscrollbar:function (callback){
		if($.wsu_maps.state.apiD!==null && !$.isEmptyObject($.wsu_maps.state.apiD.jObj)){
			$.wsu_maps.state.apiD.destroy();
			$.wsu_maps.state.apiD=null;
		}
		if($.isFunction(callback)){
			callback();
		}
	},
	reset_listings:function (){
		if(!$('#selectedPlaceList').is($('.ini'))){
			$.wsu_maps.listings.destroy_Dirscrollbar(function(){
				$.wsu_maps.listings.destroy_Listscrollbar(function(){
					$('#selectedPlaceList').width()>0?$('#selectedPlaceList_btn').trigger('click'):null;
					$('#selectedPlaceList').addClass('ini');
					$('#selectedPlaceList_area').html("");
				});
			});
		}
		$('#selectedPlaceList_btn').css('display',"none");
	},
};




/************
nav
******/
















/* these are very central map items */
function setup_pdfprints(){
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
}




/*
*/




