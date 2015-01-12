// JavaScript Document
(function($) {
	$.wsu_maps.admin.place = {
		loadPlaceShape:function (_load){//,callback){
			/*if(typeof(_load)==='undefined') var _load = false;
			if(typeof(showSum)==='undefined') var showSum = false;
			//var url='http://images.wsu.edu/javascripts/campus_map_configs/pick.asp';	
			var url=siteroot+"place/loadPlaceShape.castle";
			$.getJSON(url+'?callback=?'+(_load!=false?'&id='+_load:''), function(data) {
		
				if(typeof(data.shape)!=='undefined' && !$.isEmptyObject(data.shape)){
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
							var ele = $.extend( {'fillOpacity':.25,'fillColor':'#981e32', 'strokeWeight':0 } , pointHolder );
						 }else{
							var ele = {};
						 }
		
						 $.wsu_maps.state.mapInst.gmap('addShape',(type[0].toUpperCase() + type.slice(1)), ele,function(shape){
								 //alert('added shape');
								shapes.push(shape);
								if($.isFunction(callback))callback(shape);
						});
					});
				}
			});*/
			var url=$.wsu_maps.state.siteroot+"public/getShapesJson_byIds.castle";
			
			if(typeof(_load)!=="undefined"){
				$.getJSON(url+'?callback=?&ids[]='+_load, function(data) {
					$.wsu_maps.state.mapInst.gmap('clear','overlays');
					$.each( data.shapes, function(i, shape) {
						if( typeof(shape.style.events.rest.fillOpacity)!=="undefined" && shape.style.events.rest.fillOpacity === 0 && (typeof(shape.style.events.rest.strokeOpacity)!=="undefined" && shape.style.events.rest.strokeOpacity === 0 || typeof(shape.style.events.rest.strokeWeight)!=="undefined" && shape.style.events.rest.strokeWeight === 0) ){
							shape.style.events.rest.strokeWeight = 0.2;
							shape.style.events.rest.strokeOpacity = 0.6;
						}
						$.wsu_maps.mapping.addShapeToMap($.wsu_maps.state.mapInst,i, shape);
					});
				});
			}		
		
			
			
		},
	
		load_editor:function () {
			$.wsu_maps.state.mapInst=$('#place_drawing_map');
			var lat = $('#Lat').val();
			var lng = $('#Long').val();	
			$.wsu_maps.state.mapInst.gmap({
					'center': (typeof(lat)==='undefined' || lat==='')? $.wsu_maps.state.campus_latlng_str : new google.maps.LatLng(lat,lng),
					'zoom':15,
					'zoomControl': false,
					'mapTypeControl': {  panControl: true,  mapTypeControl: true, overviewMapControl: true},
					'panControlOptions': {'position':google.maps.ControlPosition.LEFT_BOTTOM},
					'streetViewControl': false 
				}).bind('init', function () {
					if(lat!==''){
						$.wsu_maps.admin.editors.place.add_place_point(lat,lng);
					}
					$("#editor_form").autoUpdate({
						before:function(){
							tinyMCE.triggerSave();
						},
						changed:function(){
							$.wsu_maps.admin.editors.place.infoUpdate();
						}
					});
				});
			
			$('#setLatLong :not(.ui-state-disabled)').on('click',function(){ $.wsu_maps.admin.editors.place.add_place_point(lat,lng); });
		
			$.wsu_maps.admin.editors.place.int_infotabs();
			
			function revGoeLookup(){
				$("#place_street,#place_address").on('keyup',function () {
					$.wsu_maps.util.clearCount('codeAddress');
					$.wsu_maps.util.setCount('codeAddress',500,function(){
						var zip = $('#zcode').length?$('#zcode').text():'';
						var campus = $('#campus').length?$('#place_campus').val():'';
						var lookup = $('#place_street').val()+' '+$('#place_address').val()+', '+campus+' WA '+zip+' USA'; 
						if( $('#place_street').val() !=='' &&$('#place_address').val() !=='' ){
							$.wsu_maps.admin.editors.place.get_Address_latlng($.wsu_maps.state.mapInst.gmap('get','map'),lookup);
						}
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
			$.wsu_maps.admin.ui.tinymce.tinyResize();
			if ($(window).scrollTop()>= 175) {
				if($(window).width()<=1065){
					$('#campusmap').addClass('fixed_min');}else{$('#campusmap').addClass('fixed');
				}
			}
			$(window).scroll(function (){//event) {
				if ($(this).scrollTop()>= 175) {     
					if($(window).width()<=1065){
						$('#campusmap').addClass('fixed_min');}else{$('#campusmap').addClass('fixed');
					}
				} else { 
					$('#campusmap').removeClass('fixed_min');       
					$('#campusmap').removeClass('fixed');   
				}  
			});
			$.wsu_maps.admin.setup_fixedNav();
			$('#shortcode').on('click',function(e){
				e.stopPropagation();
				e.preventDefault();
				$('#shortcodes').toggle(0,function(){ 
					$("#shortcode").html($("#shortcodes").is(':visible') ? '-' : '+'); 
				});
			}).trigger('click');
			
			
			$.each($('.switch'),function(){//i,v){
				var self = $(this);
				self.find('a').on('click',function(e){
						e.stopPropagation();
						e.preventDefault();
						self.find('.active').removeClass('active');
						var tar=$(this).attr('id');
						$(this).addClass('active');
						self.find('.'+tar).addClass('active');
					});
			});
			$.wsu_maps.admin.setup_massTags();
		},
	};
	
	
	
	
	
	
	
	$.wsu_maps.admin.editors.place = {
		ini:function(){},
		defaults:{
		},
		get_Address_latlng:function (map,address) {
		  $.wsu_maps.general.setGeoCoder().geocode( { 'address': address}, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
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
					
					$.wsu_maps.state.mapInst.gmap('addMarker', $.extend({ 
						'position': new google.maps.LatLng(latitude,longitude)
					},{})).click(function() {
						//$.each(ib, function(i) {ib[i].close();});
						//ib[i].open($.wsu_maps.state.mapInst.gmap('get','map'), this);
						//$('#centralMap').gmap('openInfoWindow', { 'content': marker.info.content }, this);
					});
				} else {
					alert("Geocode was not successful for the following reason: " + status);
				}
		  });
		},
		watchMediaTab:function (){
			var tab_counter = tab_counter||$("#dynoTab li.ui-state-default").size();
			if($('.imageBox').length>1 && $('#viewTab').length===0){
				var content = '<img class="infotabTemplate" src="../Content/images/gallery_placeholder.png"  id="viewTab" width="297" height="201" />'+
				"<input type=\"hidden\" id='tab_"+tab_counter+"' name=\"tabs["+tab_counter+"].content\" value=\"<img class='infotabTemplate' src='../Content/images/gallery_placeholder.png'  id='viewTab' width='297' height='201' />\" />";
				$.wsu_maps.admin.ui.addTab(tab_counter,"Views",content,false,false);
			}
			if($('#viewTab').length>1){
				$('#'+$('#viewTab:last').attr('href')).remove();
				$('#viewTab:last').remove();
			}
			if($('.imageBox').length<=1 && $('#viewTab').length>0){
				$('#'+$('#viewTab').attr('href')).remove();
				$('#viewTab').remove();
			}
		},
		
		

		
		int_infotabs:function (){
			var $dynotabs = null;
			$.each($('.dyno_tabs'),function(i){//,v){
				//replaced "tab_"+i for $(this).attr('id')
				/*if(!$(this).is($(".tinyLoaded"))){
					$.wsu_maps.admin.ui.tinymce.load_tiny("bodytext",$(this).attr('id'));
					$(this).addClass("tinyLoaded")
				}*/
				$.wsu_maps.admin.ui.tinymce.tinyResize();
				$.wsu_maps.admin.ui.set_tab_editable(i);
			});
			var $tab_title_input = $( "#tab_title");
			var $tab_content_input = $( "#tab_content" );
			var tab_counter =  $("#dynoTab li.ui-state-default").size();
		
			// tabs init with a custom tab template and an "add" callback filling in the content
			$dynotabs = $( "#dynoTab").tabs({
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
				select: function(){//event, ui) {
					tinyMCE.triggerSave();
					$.wsu_maps.admin.ui.tinymce.tinyResize();
				},
				show: function(){//event, ui) {
					tinyMCE.triggerSave();
					$.wsu_maps.admin.ui.tinymce.tinyResize();
				}
			});
		
			$( "#dynoTab").find( ".ui-tabs-nav" ).sortable({
				items: "li:not(.nonsort)",
				stop: function(){//event, ui) {
					$.each($("#dynoTab .ui-tabs-nav li"),function(i){//,v){
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
					var tabs = $('#dynoTab');
					var panels = tabs.children('.ui-tabs-panel');
					panels.sort(function (a,b){return $(a).attr('role') >$(b).attr('role') ? 1 : -1;}).appendTo('#dynoTab');
					$.each(panels, function(i){//, v) {
						var id=$(this).find('textarea:first').attr('id');
						if( !$(this).find('textarea:first').is($(".tinyLoaded")) ){ 
							$.wsu_maps.admin.ui.tinymce.load_tiny("bodytext",id);
							$(this).find('textarea:first').addClass("tinyLoaded");
						}
						tinyMCE.triggerSave();
						$.wsu_maps.admin.ui.tinymce.tinyResize();
						$.wsu_maps.admin.ui.set_tab_editable(i);
					});
				}
			});
			// modal dialog init: custom buttons and a "close" callback reseting the form inside
			var $dialog = $( "#page_dialog" ).dialog({
				autoOpen: false,
				modal: true,
				buttons: {
					Add: function() {
						tab_counter = $.wsu_maps.admin.ui.addTab(tab_counter);
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
			//var $form = $( "form#taber", $dialog ).submit(function() {
			$( "form#taber", $dialog ).submit(function() {
				tab_counter++;
				$.wsu_maps.admin.ui.addTab(tab_counter);
				$dialog.dialog( "close" );
				return false;
			});
			// addTab button: just opens the dialog
			$( "#add_tab" ).button().on('click',function(e) {
					e.stopPropagation();
					e.preventDefault();
					$dialog.dialog( "open" );
				});
			// close icon: removing the tab on click
			$( "#dynoTab span.ui-icon-close" ).on( "click", function() {
				if($( "#deleteconfirm" ).length===0){
					$('body').append('<div id="deleteconfirm">If you delete this you will have to refresh the page to get it back.<br/><h2>Are you sure?</h2></div>');
				}
				$( "#deleteconfirm" ).dialog({
					autoOpen: false,
					modal: true,
					buttons: {
						Delete: function() {
							var index = $( "li",'.ui-tabs-nav').index( $( this ).parent() );
							//$dynotabs.tabs( "remove", index );
							$dynotabs.find(".ui-tabs-nav li:eq(" + index + ")").remove();
							$dynotabs.find(".ui-tabs-panel:eq(" + index + ")").remove();
							$dynotabs.tabs("refresh");
							$( this ).dialog( "close" );
						},
						Cancel: function() {
							$( this ).dialog( "close" );
						}
					}
				}).dialog( "open" );
			});
			$.wsu_maps.admin.editors.place.watchMediaTab();
		},

		
		
		
		infoUpdate:function (){
			var lat = $('#Lat').val();
			var lng = $('#Long').val();	
				$.wsu_maps.state.reopen = $.wsu_maps.state.ibOpen;
			if(typeof($.wsu_maps.state.ib[0])!=="undefined"){
				$.wsu_maps.state.ib[0].close();
			}
			tinyMCE.triggerSave();
			$.wsu_maps.state.mapInst.gmap('clear','markers');
			$.wsu_maps.state.mapInst.gmap('clear','services');
			$.wsu_maps.state.mapInst.gmap('clear','overlays');	
			$.wsu_maps.admin.editors.place.add_place_point(lat,lng,true);
			$.wsu_maps.admin.editors.place.watchMediaTab();
		},
		getDetails:function(place, status) {
			if (status === google.maps.places.PlacesServiceStatus.OK) {
				if(place.name){
					if($('.blink1').length){
						$('#local_place_names').html('');
					}
					var txt = $.trim($('#local_place_names').html());
					$('#local_place_names').html(txt+ (txt.indexOf(place.name)>-1 ? '' : (txt===""?'':',') +  place.name ));
				}
			}
		},
		add_place_point:function (lat,lng,clear){
			var i=0;
			var marker = {};
			marker.style = {"icon":$.wsu_maps.state.siteroot+"Content/images/map_icons/default_icon_{$i}.png"};
			if( typeof(clear)!=='undefined' && clear ){
				marker.info={};
			}
			marker=$.extend(marker,$.wsu_maps.infobox.build_infobox($.wsu_maps.state.mapInst,marker,i));
			
			if(marker.style.icon){
				marker.style.icon = marker.style.icon.replace('{$i}',i+1);
			}
			
			$.wsu_maps.state.mapInst.gmap('addMarker', $.extend({ 
				'position': (typeof(lat)==='undefined' || lat==='')?$.wsu_maps.state.mapInst.gmap('get_map_center'):new google.maps.LatLng(lat,lng)
			},{'draggable':true},marker.style),function(markerOptions, marker){
					if($.wsu_maps.state.reopen!==false){
						$.wsu_maps.state.ib[0].open($.wsu_maps.state.mapInst.gmap('get','map'), marker);
						$.wsu_maps.state.reopen = false;
					}
					if($("#placeShape :selected").length && $("#placeShape :selected").val()!==""){
						$.wsu_maps.state.shapes=[];
						
						$.wsu_maps.admin.place.loadPlaceShape($("#placeShape :selected").val(),function(){//shape){
							$.wsu_maps.state.mapInst.gmap("attach_shape_to_marker",$.wsu_maps.state.shapes[0],marker);
						});
					}			
			}).click(function() {
				//var ib_total = 0;
				//$.each(ib, function(i) {ib[i].close(); ib_total=i; });
				$.wsu_maps.state.ib[0].open($.wsu_maps.state.mapInst.gmap('get','map'), this);
				$.wsu_maps.state.ibOpen=true;
				// need to finish this class
				//$('#centralMap').gmap('openInfoWindow', { 'content': marker.info.content }, this);
			}).dragend(function(){//e) {
				var placePos = this.getPosition();
				var lat = placePos.lat();
				var lng = placePos.lng();
				if(typeof($.wsu_maps.state.shapes)!=="undefined" && $.wsu_maps.state.shapes.length>0){
					$.wsu_maps.state.mapInst.gmap("move_shape",$.wsu_maps.state.shapes[0],placePos);
				}
				$('#Lat').val(lat);
				$('#Long').val(lng);
				//setTimeout(function() {},  200);
				if($('#revGoeLookup').is(":checked")){
					var loca = new google.maps.LatLng(lat,lng);
					$.wsu_maps.general.setGeoCoder().geocode({'latLng':loca}, function(results, status) {
						if (status === google.maps.GeocoderStatus.OK) { 
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
								if (address_component.types[0] === "route"){//": route:"
									itemRoute = address_component.long_name;
									$('#place_street').val(itemRoute);
								}
								if (address_component.types[0] === "locality"){//"town:"
									itemLocality = address_component.long_name;
								}
								if (address_component.types[0] === "country"){ //"country:"
									itemCountry = address_component.long_name;
								}
								if (address_component.types[0] === "postal_code_prefix"){ //"pc:"
									itemPc = address_component.long_name;
								}
								if (address_component.types[0] === "street_number"){ //"street_number:"
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
				$.each($.wsu_maps.defaults.gmap_location_types.length,function(i){//,v){
					var requested = {
					  location: loca,
					  radius:0.1,
					  keyword:$.wsu_maps.defaults.gmap_location_types[i]//,
					  //types : [gmap_location_types[i]]
					};
					var gmap = $.wsu_maps.state.mapInst.gmap('get','map');
					var service = new google.maps.places.PlacesService(gmap);
					service.search(requested, function (results, status) {
						var gmap = $.wsu_maps.state.mapInst.gmap('get','map');
						if (status === google.maps.places.PlacesServiceStatus.OK) {
							alert('sereching');
							for (var i = 0; i < 1; i++) {
								var request = {reference:results[i].reference};
								var service = new google.maps.places.PlacesService(gmap);
								service.getDetails(request,$.wsu_maps.admin.editors.place.getDetails);
							}
						}
					});
				});
			});
			$(this).addClass('ui-state-disabled');
		},
	};

})(jQuery);