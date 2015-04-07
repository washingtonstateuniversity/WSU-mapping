/*
* globals from the page, inline
*/


/* think these should be removed at some point when cleared */
var pos=pos||{};
var base=base||{};
var pageTracker=pageTracker||null;
var styles=styles||{};

var startingUrl=startingUrl||null;



function _defined(n){ return typeof n !== "undefined"; }
function _d(n){
	return _defined(jQuery.wsu_maps) && (jQuery.wsu_maps.defaults.debug===true) && _defined(window.console) && _defined(window.console.debug) && window.console.debug(n);
}
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(obj, start) {
		 for (var i = (start || 0), j = this.length; i < j; i++) {
			 if (this[i] === obj) { return i; }
		 }
		 return -1;
	};
}
/* seed it */
(function( $, window, WSU_MAP ) {
	WSU_MAP.state.currentLocation = WSU_MAP.state.siteroot+WSU_MAP.state.mapview;
	$.extend( WSU_MAP||(WSU_MAP={}), {
		is_frontend:true,
		ini:function (options){
			$.extend(WSU_MAP.state,options);
			WSU_MAP.ready();
		},
		ready:function (options){
			
			$(document).ready(function() {
				var page,location;
				
				WSU_MAP[WSU_MAP.is_frontend?"frontend":"admin"].ini();
				
				location=window.location.pathname;
				page=location.substring(location.lastIndexOf("/") + 1);
				page=page.substring(0,page.lastIndexOf("."));
				if(window._defined(WSU_MAP[page])){
					WSU_MAP[page].ini();
				}
				
				return options;
			});
		},
		
		iniMap:function (url,callback){
			/*var padder = 130;
			if($('.layoutfree').lenght){
				padder = 0;
			}
			var winH = $(window).height()-padder;
			var winW = $(window).width();*/
			var zoom = WSU_MAP.defaults.map.zoom;
			/*if(winW>=500 && winH>=200){zoom = 14;}
			if(winW>=700 && winH>=400){zoom = 15;}
			if(winW>=900 && winH>=600){zoom = 16;}*/
			//var _load = false;
			//url='http://images.wsu.edu/javascripts/campus_map_configs/pick.asp';			
			//$.getJSON(url+'?callback=?'+(_load!=false?'&loading='+_load:''), function(data) {
				var data = {};
				var map_op = {};
				if( $.isEmptyObject( data.mapOptions )){
					map_op = {'center': WSU_MAP.state.campus_latlng_str , 'zoom':zoom };
				}else{
					map_op = data.mapOptions;
					/*if(winW>=500 && winH>=300){map_op.zoom = map_op.zoom;}
					if(winW>=700 && winH>=500){map_op.zoom = map_op.zoom+1;}
					if(winW>=900 && winH>=700){map_op.zoom = map_op.zoom;}*/
				}
				//styles={};
				var override = window._defined(WSU_MAP.state.json_style_override) && WSU_MAP.state.json_style_override!==false && WSU_MAP.state.json_style_override!=="";
				map_op = $.extend(map_op,{
					"mapTypeControl":false,
					"panControl":false,
					styles: override ? WSU_MAP.state.json_style_override:WSU_MAP.defaults.map.styles
				});
				if($('.layoutfree').length){
					styles={
						zoom:17
					};
				}
				
				map_op=$.extend(map_op,styles);
				
				
				var ops = "";
				
				if($('#runningOptions').length && !($('#runningOptions').html()==="{}"||$('#runningOptions').html()==="") ){
					$('#runningOptions').html($('#runningOptions').html().replace(/(\"mapTypeId\":"\w+",)/g,''));
					ops = $('#runningOptions').html();
				}
				if( WSU_MAP.state.running_options !== false ){
					ops=WSU_MAP.state.running_options;
				}
				
				
				if(ops!==""){
					//var mapType = jsonStr.replace(/.*?(\"mapTypeId\":"(\w+)".*$)/g,"$2");
					ops = ops.replace(/("\w+":\"\",)/g,'').replace(/(\"mapTypeId\":"\w+",)/g,'');
					$.extend(map_op,pos,base,$.parseJSON(ops));
				}
				
				
				/*if($('#runningOptions').length){
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
				}*/
				WSU_MAP.state.map_jObj.gmap(map_op).bind('init', function() { 
					WSU_MAP.state.map_inst = WSU_MAP.state.map_jObj.gmap('get','map');
					WSU_MAP.state.center = WSU_MAP.state.map_jObj.gmap("get_map_center");
					//WSU_MAP.ini_GAtracking('UA-22127038-5');
					WSU_MAP.poi_setup();
					WSU_MAP.controlls.setup_map_type_controlls();
					if(window._defined(data)){
						WSU_MAP.general.loadData(data);
					}
					if($('.mobile').length){
						WSU_MAP.geoLocate();
					}
					callback();
					

					$(window).resize(function(){
						if( WSU_MAP.state.fit_to_bound !== false ){
							WSU_MAP.fit_to_location( WSU_MAP.state.fit_to_bound );
						}
						WSU_MAP.keep_center();
					}).trigger("resize");
					
					WSU_MAP.on_zoom_corrections();
					WSU_MAP.on_pan_corrections();
					WSU_MAP.on_bounds_changed_corrections();
					
					$('.gmnoprint[controlheight]:first').css({'margin-left':'21px'});
					/* addthis setup */
					//WSU_MAP.ini_addthis("mcwsu");
				});
			//});
		},

		setup:function (){//jObj){
			$('#loading').remove();
			if(window._defined(startingUrl) && startingUrl!==null){
				WSU_MAP.updateMap(encodeURI(startingUrl.indexOf("&")?startingUrl.split('=')[1].split('&')[0]:startingUrl.split('=')[1]),false,function(){
						if(parseInt(startingUrl.split('=')[1], 10)>0){
							var marker = WSU_MAP.state.markerbyid[parseInt(startingUrl.split('=')[1], 10)];
							
							//google.maps.event.trigger(marker, 'click');
							$(marker).triggerEvent('click');
						}
					});
				var link = startingUrl.split('=')[1].split('&')[0].toString(); 
				//alert(link);
				if(startingUrl.split('=')[1].indexOf(',')>0){
					$.each(startingUrl.split('=')[1].split(','),function(i,v){
						WSU_MAP.nav.menuDressChild($('#main_nav a[href$="'+v+'"]'));
					});
				}else{
					WSU_MAP.nav.menuDressChild($('#main_nav a[href$="'+link+'"]'));
				}		
			}
		
		
			WSU_MAP.listings.setup_listingsBar(WSU_MAP.state.map_jObj);
			WSU_MAP.directions.setup_directions();
			WSU_MAP.nav.setup_nav();
			WSU_MAP.general.setup_embeder();
			WSU_MAP.errors.addErrorReporting();
			WSU_MAP.setup_pdfprints();
			if($('.layoutfree').length){
				$('a').not('#nav a').on("click",function(e){
					WSU_MAP.util.nullout_event(e);
				});
				$('.ui-tabs-panel .content a').on("click",function(e){
					WSU_MAP.util.nullout_event(e);
				});
			}
			if($( "#placeSearch input[type=text]" ).length){
				WSU_MAP.search.setup_mapsearch();
			}
			if( $('.veiw_base_layout.public').length || WSU_MAP.state.inview ){	
				WSU_MAP.shapes.reloadShapes();
				WSU_MAP.places.reloadPlaces();
			}
		},
		get_option:function(){//prop){
			//the goal is that we will pull any option not directly 
			
		},
		apply_loader:function(){
			WSU_MAP.state.map_jObj.append( $( WSU_MAP.defaults.map.loading_html ).attr('id',"loading") );
		},
		remove_loader:function(){
			$("#loading");
		},
		clean_map:function(){
			var jObj = WSU_MAP.state.map_jObj;
			jObj.gmap('clear','markers');
			jObj.gmap('clear','overlays');
			$.each(WSU_MAP.state.ib,function(i){
				if( window._defined( WSU_MAP.state.ib[i] ) && WSU_MAP.state.ib[i].opened === true ){
					WSU_MAP.state.ib[i].close();
				}
				WSU_MAP.state.ib[i].onRemove();
			});
			WSU_MAP.state.ib=[];
			WSU_MAP.state.ibh=[];
			WSU_MAP.listings.reset();
			WSU_MAP.nav.reset_Navscrollbar();
			

			$('#main_nav').find('.active').removeClass('active');
			WSU_MAP.state.map_jObj.find('input[type="text"]').val('');
			if($('#directionsTo').is(':visible')){
				$('#directionsTo').hide();
			}
			
			//WSU_MAP.listings.reset_listings();
		},
		updateMap:function (_load,showSum,callback){
			//var jObj = WSU_MAP.state.map_jObj;
			if(!window._defined(_load)){
				_load = false;
			}
			if(!window._defined(showSum)){
				showSum = false;
			}
			if(!window._defined(callback)){
				callback = false;
			}
			WSU_MAP.state.cur_mid = 0;
			WSU_MAP.state.cur_nav = _load;
			var url="";
			if($.isNumeric(_load)){
				url=WSU_MAP.state.siteroot+"public/get_place_obj.castle";
			}else{
				url=WSU_MAP.state.siteroot+"public/get_place_obj_by_category.castle";	
			}
			$.getJSON(url+'?callback=?'+(_load!==false && !$.isNumeric(_load)?'&cat[]='+_load:($.isNumeric(_load)?'&id='+_load:'')), function(data) {
				if(!$.isNumeric(_load)){
					WSU_MAP.listings.autoOpenListPanel();
				}
				var cleanedData = [];
				cleanedData.markers = [];
				if(window._defined(data.markers) &&  !$.isEmptyObject( data.markers )){
					$.each( data.markers, function(i, marker) {
						if($.isNumeric(_load)){
							marker.bounds=true;
						}
						if(!window._defined(marker.id)){
							delete data.markers[i];
						}else if(window._defined(marker.error)){
							delete data.markers[i]; 
						}else{
							cleanedData.markers.push(data.markers[i]);		
						}
					});
					if(window._defined(cleanedData)){
						WSU_MAP.general.loadData(cleanedData,callback);
					}
					WSU_MAP.listings.loadListings(cleanedData,showSum);
				}
				WSU_MAP.general.prep_html();
			});
		},

		setup_pdfprints:function (){
			$('#printPdfs').off().on("click",function(e){
				WSU_MAP.util.nullout_event(e);
				//var trigger=$(this);
				$.colorbox.remove();
				$.colorbox({
					html:function(){
						return '<div id="printPdfs">'+
									'<h2>Printable Maps</h2>'+
									'<div><h3><a href="http://www.parking.wsu.edu/docs/map.pdf" target="_blank">Parking<br/><span id="parking" style="background-image:url('+WSU_MAP.state.siteroot+'Content/images/print/parking_icon.jpg);"></span></a></h3></div>'+
									'<div><h3><a href="https://map.wsu.edu/pdfs/areamap-10-18-12.pdf" target="_blank">Area<br/><span id="area" style="background-image:url('+WSU_MAP.state.siteroot+'Content/images/print/area_icon-10-18-12.jpg);"></span></a></h3></div>'+
									'<div class="last"><h3><a href="https://map.wsu.edu/pdfs/washingtonmap.pdf" target="_blank">Washington State<br/><span id="state" style="background-image:url('+WSU_MAP.state.siteroot+'Content/images/print/state_icon.jpg);"></span></a></h3></div>'+
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
								//$.jtrack.trackEvent(pageTracker,"pdf", "clicked", self.text());
							});
						});
					}
				});
			});	
		},

		ini_GAtracking:function (){//gacode){
			/*var data = [
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
			];*/
			//$.jtrack.defaults.debug.run = false;
			//$.jtrack.defaults.debug.v_console = false;
			//$.jtrack.defaults.debug.console = true;
			//$.jtrack({load_analytics:{account:gacode}, trackevents:data });
		},
		ini_addthis:function (){//username){
			/*if(!window._defined(username)){
				username="mcwsu";
			}*/
			/*var addthis_config = {
				  services_compact: 'email, facebook, twitter, myspace, google, more',
				  services_exclude: 'print',
				  ui_click: true
			};*/
			/*var addthis_share ={
				templates: {twitter: 'check out {{url}} '}
			};*/
			/*if($('body.addthis').length===0){
				WSU_MAP.getSmUrl("",function(url){
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
				WSU_MAP.getSmUrl("",function(url){
					addthis.ost = 0; 
					addthis.update('share', 'url', url); // new url 
					//addthis.update('share', 'title', window.document.title); // new title. 
					addthis.ready();
				});
			});*/
		},
		
		geoLocate:function (){
			if($('.geolocation').length){
				WSU_MAP.state.map_jObj.gmap("geolocate",true,false,function(mess, pos){
					//WSU_MAP.state.map_jObj.gmap("make_latlng_str",pos)//alert('hello');
					WSU_MAP.state.map_jObj.gmap('addMarker', { 
							position: pos,
							icon:WSU_MAP.state.siteroot+"Content/images/map_icons/geolocation_icon.png"
						},function(){//ops,marker){
						//markerLog[i]=marker;
						//WSU_MAP.state.map_jObj.gmap('setOptions', {'zIndex':1}, markerLog[i]);
						//if($.isFunction(callback))callback(marker);
					});
				});
			}
		},
		fit_to_location:function(localation){
			if(WSU_MAP.state.hold_bounds===false || WSU_MAP.state.in_pano){
				return;
			}
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode( { 'address': localation}, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					if (status !== google.maps.GeocoderStatus.ZERO_RESULTS) {
						if (results && results[0]&& results[0].geometry && results[0].geometry.viewport){
							WSU_MAP.state.map_inst.fitBounds(results[0].geometry.viewport);
							window.tmp_fuc = function(){
								google.maps.event.addListenerOnce(WSU_MAP.state.map_inst, 'idle', function() {
									WSU_MAP.state.hold_bounds=true;
									window.tmp_fuc = null;
								});
							};
							window.tmp_fuc();
						}
					}
				}
			});
		},
		
		keep_center:function(){
			if( ( WSU_MAP.state.hold_center !== false && WSU_MAP.state.center !== null ) || WSU_MAP.state.in_pano ){
				WSU_MAP.state.map_inst.panTo(WSU_MAP.state.center);
			}
		},
		
		
		poi_setup:function (){//jObj){
			var proto = google.maps.InfoWindow.prototype, open = proto.open;
			proto.open = function(map, anchor, please) {
				if (please) {
					return open.apply(this, arguments);
				}
			};
		},
		set_center:function(){
			WSU_MAP.state.map_jObj.dequeue("set_center");
			WSU_MAP.state.map_jObj.queue("set_center", function() {
				setTimeout(function() {
					WSU_MAP.state.center = WSU_MAP.state.map_jObj.gmap("get_map_center");
					WSU_MAP.state.map_jObj.dequeue("set_center");
				}, 750);
			});
		},
		
		poi_rest:function(){
			WSU_MAP.state.map_jObj.dequeue("poi_rest");
			WSU_MAP.state.map_jObj.queue("poi_rest", function() {
				setTimeout(function() {
					WSU_MAP.poi_setup();	
					WSU_MAP.state.map_jObj.dequeue("poi_rest");
				}, 750);
			});
		},
		on_zoom_corrections:function(){
			google.maps.event.addListener(WSU_MAP.state.map_inst, 'zoom_changed',function(){
				WSU_MAP.poi_rest();
				WSU_MAP.set_center();
			});
		},
		on_pan_corrections:function(){
			google.maps.event.addListener(WSU_MAP.state.map_inst, 'drag', function() {
				WSU_MAP.state.hold_bounds=false;
				WSU_MAP.set_center();
				WSU_MAP.poi_rest();
				
			});
			google.maps.event.addListener(WSU_MAP.state.map_inst, 'center_changed', function() {
				WSU_MAP.poi_rest();
			});
		},
		on_bounds_changed_corrections:function(){
			google.maps.event.addListener(WSU_MAP.state.map_inst, 'bounds_changed',function(){
				WSU_MAP.poi_rest();
				WSU_MAP.set_center();
			});
		},

		getSmUrl:function (query,callback){
			
			var url = WSU_MAP.getUrlPath(query);
			
			$.get('/public/get_sm_url.castle?_url=/'+encodeURIComponent(url),function(data){
				if(data!=="false"){
					//alert(data)
					url = "t/"+data;
				}
				if(window._defined(callback)){
					callback(WSU_MAP.state.siteroot+url);
				}
				return WSU_MAP.state.siteroot+url;
			});
			
		},
		getUrl:function (query){//maybe deleting
			return WSU_MAP.state.siteroot+WSU_MAP.getUrlPath(query);
		},
		getUrlPath:function (query){
			var url = WSU_MAP.state.mapview;
			
			url+=(WSU_MAP.state.cur_nav!==false?'?cat[]='+WSU_MAP.state.cur_nav:'');
			url+=(WSU_MAP.state.cur_mid>0?(url.indexOf('?')>-1?'&':'?')+'pid='+WSU_MAP.state.cur_mid:'');
			url+=(window._defined(query)?(url.indexOf('?')>-1?'&':'?')+query:'');
		
			return url;
		},
		/*updateUrl:function (nav,pid){
			WSU_MAP.state.cur_nav = nav;
			WSU_MAP.state.cur_mid = pid;
		}*/
		time_it:function(name,time,func){
			WSU_MAP.state.map_jObj.dequeue(name);
			WSU_MAP.state.map_jObj.queue(name, function() {
				setTimeout(function() {
					func();
					WSU_MAP.state.map_jObj.dequeue(name);
				}, time);
			});
		},
		kill_time:function(name){
			WSU_MAP.state.map_jObj.dequeue(name);
		},
	});
	
	
	
	
})( jQuery, window, jQuery.wsu_maps||(jQuery.wsu_maps={}), _d );