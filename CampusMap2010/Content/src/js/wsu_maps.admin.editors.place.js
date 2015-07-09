
var i=i||-1;
(function($,window,WSU_MAP) {
	$.extend( WSU_MAP.admin , {
		place : {
			loadPlaceShape:function (_load){//,callback){
				/*if(!window._defined(_load)) var _load = false;
				if(!window._defined(showSum)) var showSum = false;
				//var url='http://images.wsu.edu/javascripts/campus_map_configs/pick.asp';	
				var url=siteroot+"place/loadPlaceShape.castle";
				$.getJSON(url+'?callback=?'+(_load!=false?'&id='+_load:''), function(data) {
			
					if(window._defined(data.shape) && !$.isEmptyObject(data.shape)){
						$.each( data, function(i, shape) {	
			
						//alert(shape.latlng_str);
							 var pointHolder = {};
							 var coord = shape.latlng_str;//(window._defined(shape.encoded)&& shape.encoded!="")?shape.encoded:shape.latlng_str;
							 var type = "polygon";window._defined(shape.type)?shape.type:"polygon";
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
			
							 WSU_MAP.state.map_jObj.gmap('addShape',(type[0].toUpperCase() + type.slice(1)), ele,function(shape){
									 //alert('added shape');
									shapes.push(shape);
									if($.isFunction(callback))callback(shape);
							});
						});
					}
				});*/
				var url=WSU_MAP.state.siteroot+"public/getShapesJson_byIds.castle";
				
				if(window._defined(_load)){
					$.getJSON(url+'?callback=?&ids[]='+_load, function(data) {
						WSU_MAP.state.map_jObj.gmap('clear','overlays');
						$.each( data.shapes, function(i, shape) {
							if( window._defined(shape.style.events.rest.fillOpacity) && shape.style.events.rest.fillOpacity === 0 && (window._defined(shape.style.events.rest.strokeOpacity) && shape.style.events.rest.strokeOpacity === 0 || window._defined(shape.style.events.rest.strokeWeight) && shape.style.events.rest.strokeWeight === 0) ){
								shape.style.events.rest.strokeWeight = 0.2;
								shape.style.events.rest.strokeOpacity = 0.6;
							}
							WSU_MAP.shapes.addShapeToMap(i, shape);
						});
					});
				}		
			
				
				
			},
			load_editor:function () {
				WSU_MAP.admin.action="place_editor";
				WSU_MAP.state.map_jObj=$('#place_drawing_map');
				var lat = $('#Lat').val();
				var lng = $('#Long').val();	
	
				WSU_MAP.state.map_jObj.gmap({
						center: (!window._defined(lat) || lat==='')? WSU_MAP.state.campus_latlng_str : new google.maps.LatLng(lat,lng),
						zoom:WSU_MAP.defaults.map.zoom,
						zoomControl: false,
						styles:WSU_MAP.state.json_style_override!==false?WSU_MAP.state.json_style_override:WSU_MAP.defaults.map.styles,
						mapTypeControl: {	panControl: true,  mapTypeControl: true, overviewMapControl: true},
						panControlOptions: {'position':google.maps.ControlPosition.LEFT_BOTTOM},
						streetViewControl: false 
					}).bind('init', function () {
						WSU_MAP.state.map_inst = WSU_MAP.state.map_jObj.gmap('get','map');
						if(lat!==''){
							WSU_MAP.admin.editors.place.add_place_point(lat,lng);
						}
						$("#editor_form").autoUpdate({
							before:function(){
								tinyMCE.triggerSave();
							},
							changed:function(){
								WSU_MAP.admin.editors.place.infoUpdate();
							}
						});
					});
				
				$('#setLatLong :not(.ui-state-disabled)').on('click',function(){ WSU_MAP.admin.editors.place.add_place_point(lat,lng); });
			
				WSU_MAP.admin.editors.place.int_infotabs();
				
				function revGoeLookup(){
					$("#place_street,#place_address").on('keyup',function () {
						WSU_MAP.util.clearCount('codeAddress');
						WSU_MAP.util.setCount('codeAddress',500,function(){
							if( $('#place_street').val() !=='' &&$('#place_address').val() !=='' ){
								var zip = $('#place_zip_code').length?$('#place_zip_code').val():'';
								var city = $('#place_city').length?$('#place_city').val():'';
								var lookup = $('#place_street').val()+' '+$('#place_address').val()+', '+city+' WA '+zip+' USA'; 
								WSU_MAP.admin.editors.place.get_Address_latlng(WSU_MAP.state.map_inst,lookup);
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
				WSU_MAP.admin.ui.tinymce.tinyResize();
				/*if ($(window).scrollTop()>= 175) {
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
				WSU_MAP.admin.setup_fixedNav();*/
				$('#shortcode').on('click',function(e){
					WSU_MAP.util.nullout_event(e);
					$('#shortcodes').toggle(0,function(){ 
						$("#shortcode").html($("#shortcodes").is(':visible') ? '-' : '+'); 
					});
				}).trigger('click');
				
				
				$.each($('.switch'),function(){//i,v){
					var self = $(this);
					self.find('a').on('click',function(e){
							WSU_MAP.util.nullout_event(e);
							self.find('.active').removeClass('active');
							var tar=$(this).attr('id');
							$(this).addClass('active');
							self.find('.'+tar).addClass('active');
						});
				});
				
				
				/*tags*/
				$(".editzone").on("blur",function() { 
					var txt = $(this); 
					txt.prev('.editable').text(txt.val()); 
					txt.parent(".pod").removeClass("editing"); 
				}); 
				$(".pod .editable").on('click',function(e) { 
					WSU_MAP.util.nullout_event(e);
					$(this).next().val($(this).text()).focus(); 
					$(this).parent().addClass("editing"); 
					var TAR=$(this).attr('rel');
					var cache = {},
						lastXhr;
					$(this).next().autocomplete({
						minLength: 2,
						source: function( request, response ) {
							var term = request.term;
							if ( term in cache ) {
								response( cache[ term ] );
								return;
							}
							lastXhr = $.getJSON( "/place/get__"+TAR+".castle", request, function( data, status, xhr ) {
								cache[ term ] = data;
								if ( xhr === lastXhr ) {
									response( data );
								}
							});
						}
					});
				});
				$('#PlaceTagCreate').on('click',function(e){
					WSU_MAP.util.nullout_event(e);
					i=$('#taged .pod').size();
					if(i===0){
						$('#taged').html('');
					}
					$('#taged').append($('#tag_clonebed').html().replace(/[9]{4}/g, (i>-1?i:i+1) ).replace(/\|\|/g, '' ) );
				});
				WSU_MAP.admin.setup_massTags();
				
				 
				$('#customNames').slideToggle().click();
				$('#customName').on("click",function(){
					$('#customName em').text( $('#customName em').text() === '+' ? '-' : '+' );
					$('#customNames').slideToggle();
				});
			
	
				$('#PlaceNameCreate').on('click',function(e){
					WSU_MAP.util.nullout_event(e);
					i=$('#names .pod').size();
					$('#names').append($('#name_clonebed').html().replace(/[9]{4}/g, (i>-1?i:i+1) ).replace(/\|\|/g, '' ) );
				});
				
				
				var url_parts = WSU_MAP.util.parseUri(window.location);
				
				
				
				//This is so that you can use the nav when leaving the editing area.  IE: the same as clicking cancel
				if(url_parts.path==='/place/Edit_place.castle'){
					$( "#main_nav a,a.PDF.creation " ).on('click',function(){//e) {
						//WSU_MAP.util.nullout_event(e);
						//var obj=$(this);
						WSU_MAP.admin.clearLock($('#place_Id').val(),'',function(){
							//window.location=obj.attr('href');
							});
					});
				}
				if(url_parts.path==='/place/new.castle'){
					$('input#place_title').keyup(function() {
						var val=$('input#place_title').val();
						val=val.split(' ').join('-');
						val=val.split("'").join('');
						val=val.split('"').join('');
						val=val.split(';').join('');
						val=val.split(':').join('');
						$('#place_CustomUrl').val(val);
						WSU_MAP.util.clearCount('titleCheck');
						WSU_MAP.util.setCount('titleCheck',200,function(){
							WSU_MAP.admin.lists.Checktitle($('#place_CustomUrl').val(),false,function(data){
									if(data==='true'){
										if($('#hasTitle').length===0){
											$('#place_CustomUrl').after('<span id="hasTitle">This url is in use.</span>');
										}
									}else{
										if($('#hasTitle').length>0){
											$('#hasTitle').remove();
										}
									}
									WSU_MAP.util.clearCount('titleCheck');
								});
						});
					});
				}
				if(url_parts.path==='/place/new.castle'||url_parts.path==='/place/Edit_place.castle'){
					$('#place_CustomUrl').keyup(function() {
						WSU_MAP.util.clearCount('titleCheck');
						WSU_MAP.util.setCount('titleCheck',200,function(){
							WSU_MAP.admin.lists.Checktitle($('#place_CustomUrl').val(),false,function(data){
									if(data==='true'){
										if($('#hasTitle').length===0){
											$('#place_CustomUrl').after('<span id="hasTitle">This url is in use.</span>');
										}
									}else{
										if($('#hasTitle').length>0){
											$('#hasTitle').remove();
										}
									}
									WSU_MAP.util.clearCount('titleCheck');
								});
						});
					});
				
				
				//var click=0;
				/*
				$('body,html').not('textarea,iframe').bind('keydown', function(e) { 
					if((e.keyCode || e.which)  == 13) {
						WSU_MAP.util.nullout_event(e);
						$('.submit_btn').first().focus();
						Checktitle($('#place_CustomUrl').val(),false,function(data){
							if(data=='true'){
								if($('#hasTitle').length==0){
									$('#place_CustomUrl').after('<span id="hasTitle">This url is in use.</span>');
								}
							}else{
								 $('input[type=submit]').click();
							}
						});
					}
				});
				*/
				//var clear=false;
				/*$('input[type=submit]:not(".cancel_btn")').on('click', function(e) {
					if(clear!=true){
						WSU_MAP.util.nullout_event(e);
					}
					var clicked=$(this);
					Checktitle($('#place_CustomUrl').val(),true,function(data){
						if(data!='0'&&data!=$('#place_Id').val()&&data!="false"){
							if($('#hasTitle').length==0){
								$('#place_CustomUrl').after('<span id="hasTitle">This url is in use.</span>');
							}
							if($('#hasTitleAlert').length==0){
								$('#main').prepend('<div id="hasTitleAlert" style="padding: 0 .7em;" class="ui-state-error ui-corner-all"><p style="line-height: 15px;padding-bottom: 0;"><span style="float: left; margin-right: .3em;" class="ui-icon ui-icon-alert"></span><strong>Alert:</strong>This url is in use.</p></div>');
							}
							click=0;
						}else{
							if(clear!=true){
								clear=true;
								clicked.click();
							}
							if($('#hasTitleAlert').length>0){$('#hasTitleAlert').remove();}
							if(click>0){
								WSU_MAP.util.nullout_event(e);
							}
							click++
						}
					});
				}); */
				}
			},
		}
	});

	$.extend( WSU_MAP.admin.editors , {
		place :{
			ini:function(){
				
			},
			defaults:{
			},
			get_Address_latlng:function (map,address) {
			  WSU_MAP.admin.setGeoCoder().geocode( { 'address': address}, function(results, status) {
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
						
						WSU_MAP.state.map_jObj.gmap('addMarker', $.extend({ 
							'position': new google.maps.LatLng(latitude,longitude)
						},{})).on("click",function() {
							//$.each(ib, function(i) {ib[i].close();});
							//ib[i].open(WSU_MAP.state.map_inst, this);
							//WSU_MAP.state.map_jObj.gmap('openInfoWindow', { 'content': marker..content }, this);
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
					WSU_MAP.admin.ui.addTab(tab_counter,"Views",content,false,false);
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
						WSU_MAP.admin.ui.tinymce.load_tiny("bodytext",$(this).attr('id'));
						$(this).addClass("tinyLoaded")
					}*/
					WSU_MAP.admin.ui.tinymce.tinyResize();
					WSU_MAP.admin.ui.set_tab_editable(i);
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
						WSU_MAP.admin.ui.tinymce.tinyResize();
					},
					show: function(){//event, ui) {
						tinyMCE.triggerSave();
						WSU_MAP.admin.ui.tinymce.tinyResize();
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
							if (window._defined(id) && tinyMCE.getInstanceById(id)){
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
								WSU_MAP.admin.ui.tinymce.load_tiny("bodytext",id);
								$(this).find('textarea:first').addClass("tinyLoaded");
							}
							tinyMCE.triggerSave();
							WSU_MAP.admin.ui.tinymce.tinyResize();
							WSU_MAP.admin.ui.set_tab_editable(i);
						});
					}
				});
				// modal dialog init: custom buttons and a "close" callback reseting the form inside
				var $dialog = $( "#page_dialog" ).dialog({
					autoOpen: false,
					modal: true,
					buttons: {
						Add: function() {
							tab_counter = WSU_MAP.admin.ui.addTab(tab_counter);
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
					WSU_MAP.admin.ui.addTab(tab_counter);
					$dialog.dialog( "close" );
					return false;
				});
				// addTab button: just opens the dialog
				$( "#add_tab" ).button().on('click',function(e) {
						WSU_MAP.util.nullout_event(e);
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
				WSU_MAP.admin.editors.place.watchMediaTab();
			},
	
			
			
			
			infoUpdate:function (){
				var lat = $('#Lat').val();
				var lng = $('#Long').val();	
					WSU_MAP.state.reopen = WSU_MAP.state.ibOpen;
				if(window._defined(WSU_MAP.state.ib[0])){
					if(WSU_MAP.state.ib[0].opened === true){
						WSU_MAP.state.ib[0].close();
					}
				}
				tinyMCE.triggerSave();
				WSU_MAP.state.map_jObj.gmap('clear','markers');
				WSU_MAP.state.map_jObj.gmap('clear','services');
				WSU_MAP.state.map_jObj.gmap('clear','overlays');	
				WSU_MAP.admin.editors.place.add_place_point(lat,lng,true);
				WSU_MAP.admin.editors.place.watchMediaTab();
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
				marker.style = {
						'optimized':false,
						'draggable':true,
						icon:{
							/* note that this is tmp.. defaults. should be used and the rest of this should be over writable */
							width:WSU_MAP.markers.defaults.width,
							height:WSU_MAP.markers.defaults.height,
							url : WSU_MAP.state.siteroot+"public/markerSVG.castle?idx="+1,
							scaledSize: new google.maps.Size(WSU_MAP.markers.defaults.width,WSU_MAP.markers.defaults.height),
							size: new google.maps.Size(WSU_MAP.markers.defaults.width,WSU_MAP.markers.defaults.height),
							origin: new google.maps.Point(0,0), // origin
							anchor: new google.maps.Point((WSU_MAP.markers.defaults.width*0.5), WSU_MAP.markers.defaults.height), // anchor
							original_scaledSize: new google.maps.Size(WSU_MAP.markers.defaults.width,WSU_MAP.markers.defaults.height),
							original_size: new google.maps.Size(WSU_MAP.markers.defaults.width,WSU_MAP.markers.defaults.height),
							original_origin: new google.maps.Point(0,0), // origin
							original_anchor: new google.maps.Point((WSU_MAP.markers.defaults.width*0.5), WSU_MAP.markers.defaults.height) // anchor
						}
					};
				if( window._defined(clear) && clear ){
					marker.info={};
				}
				marker=$.extend(marker,WSU_MAP.infobox.build_infobox(marker,i));
				
				$.extend(marker.style,{ 
					'position': (!window._defined(lat) || lat==='')?WSU_MAP.state.map_jObj.gmap('get_map_center'):new google.maps.LatLng(lat,lng)
				});
				
				
				WSU_MAP.state.map_jObj.gmap('addMarker',marker.style,function(markerOptions, marker){
						if(WSU_MAP.state.reopen!==false){
							WSU_MAP.state.ib[0].open(WSU_MAP.state.map_inst, marker);
							//c = true;
							WSU_MAP.state.reopen = false;
						}
						if($("#placeShape :selected").length && $("#placeShape :selected").val()!==""){
							WSU_MAP.state.shapes=[];
							
							WSU_MAP.admin.place.loadPlaceShape($("#placeShape :selected").val(),function(){//shape){
								WSU_MAP.state.map_jObj.gmap("attach_shape_to_marker",WSU_MAP.state.shapes[0],marker);
							});
						}			
				}).on("click",function() {
					//var ib_total = 0;
					//$.each(ib, function(i) {ib[i].close(); ib_total=i; });
					WSU_MAP.state.ib[0].open(WSU_MAP.state.map_inst, this);
					WSU_MAP.state.ibOpen=true;
					// need to finish this class
					//WSU_MAP.state.map_jObj.gmap('openInfoWindow', { 'content': marker.content }, this);
				}).dragend(function(){//e) {
					//this == marker
					var drug_marker = this;
					var placePos = drug_marker.getPosition();
					var lat = placePos.lat();
					var lng = placePos.lng();
					if(window._defined(WSU_MAP.state.shapes) && WSU_MAP.state.shapes.length>0){
						WSU_MAP.state.map_jObj.gmap("move_shape",WSU_MAP.state.shapes[0],placePos);
					}
					$('#Lat').val(lat);
					$('#Long').val(lng);
					
					WSU_MAP.state.map_jObj.trigger('wsu_maps:marker_dragend',[ drug_marker ]);
					
					
					//setTimeout(function() {},  200);
					if($('#revGoeLookup').is(":checked")){
						var loca = new google.maps.LatLng(lat,lng);
						WSU_MAP.admin.setGeoCoder().geocode({'latLng':loca}, function(results, status) {
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
										$('#place_city').val(itemLocality);
									}
									if (address_component.types[0] === "country"){ //"country:"
										itemCountry = address_component.long_name;
									}
									if (address_component.types[0] === "postal_code_prefix"){ //"pc:"
										itemPc = address_component.long_name;
										$('#place_zip_code').val(itemPc);
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
					$.each(WSU_MAP.defaults.gmap_location_types.length,function(i){//,v){
						var requested = {
						  location: loca,
						  radius:0.1,
						  keyword:WSU_MAP.defaults.gmap_location_types[i]//,
						  //types : [gmap_location_types[i]]
						};
						var gmap = WSU_MAP.state.map_inst;
						var service = new google.maps.places.PlacesService(gmap);
						service.search(requested, function (results, status) {
							var gmap = WSU_MAP.state.map_inst;
							if (status === google.maps.places.PlacesServiceStatus.OK) {
								alert('sereching');
								for (var i = 0; i < 1; i++) {
									var request = {reference:results[i].reference};
									var service = new google.maps.places.PlacesService(gmap);
									service.getDetails(request,WSU_MAP.admin.editors.place.getDetails);
								}
							}
						});
					});
				});
				$(this).addClass('ui-state-disabled');
			},
		}
	});

})(jQuery,window,jQuery.wsu_maps||(jQuery.wsu_maps={}));