

function loadPlaceShape(_load,callback){
	if(typeof(_load)==='undefined') var _load = false;
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
		if(typeof(ib[0])!=="undefined")ib[0].close();
		tinyMCE.triggerSave();
		$('#place_drawing_map').gmap('clear','markers');
		$('#place_drawing_map').gmap('clear','services');
		$('#place_drawing_map').gmap('clear','overlays');	
		add_place_point(lat,lng,true);
		watchMediaTab();
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

	
	$.each($("#infotabs li.ui-state-default"),function(i,v){
		$(this).find('.sort').val(i);
		set_tab_editable(i);
	});
	
	if(content!=false){
		$("#tabs-" + i).html( content );
	}
	if(useWysiwyg)load_tiny("bodytext","tab_"+i);
	
	
	return i++;
}


function watchMediaTab(){
		tab_counter =  $("#infotabs li.ui-state-default").size();
		if($('.imageBox').length>1 && $('#viewTab').length==0){
			var content = '<img class="infotabTemplate" src="../Content/images/gallery_placeholder.png"  id="viewTab" width="297" height="201" />'+
			"<input type=\"hidden\" id='tab_"+tab_counter+"' name=\"tabs["+tab_counter+"].content\" value=\"<img class='infotabTemplate' src='../Content/images/gallery_placeholder.png'  id='viewTab' width='297' height='201' />\" />";
			addTab(tab_counter,"Views",content,false,false);
		}
		if($('#viewTab').length>1){
			$('#'+$('#viewTab:last').attr('href')).remove();
			$('#viewTab:last').remove();
		}
		if($('.imageBox').length<=1 && $('#viewTab').length>0){
			$('#'+$('#viewTab').attr('href')).remove();
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
				drawingControl:controlOn,
				drawingControlOptions : controlOn?{
					position: google.maps.ControlPosition.TOP_CENTER,
					drawingModes: $('#pickedValue').val()!=""?[$('#pickedValue').val()]:[google.maps.drawing.OverlayType.POLYLINE, google.maps.drawing.OverlayType.POLYGON]
				  }:false,
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
								//$('#geometric_encoded').val(google.maps.geometry.encoding.decodePath(data));
								//$('#geometric_encoded').val($('#drawing_map').gmap('get_updated_data_encoded'));
								$('#geometric_encoded').val(google.maps.geometry.encoding.decodePath($('#drawing_map').gmap('get_updated_data_encoded')));
								//$('#geometric_encoded').val($('#geometrics_drawing_map').gmap('get_updated_data_encoded'));
							}
						},
					onDrag:function(data){
							$('#latLong').val($('#drawing_map').gmap('get_updated_data'));
							$('#geometric_encoded').val(google.maps.geometry.encoding.decodePath($('#drawing_map').gmap('get_updated_data_encoded')));
							
							//$('#geometric_encoded').val($('#geometrics_drawing_map').gmap('get_updated_data_encoded'));
						},
					drawingmode_changed:function(type){
							if(type!=null){
								$('#style_of :selected').val(type);
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
					//DEFAULT_overlay.delete();
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

		if($( ".TABS" ).length>0){
			$( ".TABS:not(.clone_pool .TABS)" ).each(function(i){
				$(this).tabs();
			});
		}	
	
		function set_up_style_list(tabs,mapSelector,type){

			/*
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
			*/

			$.each(tabs,function (){
				var tab=$(this);
				var mode = tab.attr('id');//.split('__')[1].split('_')[1];
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
								  y: 'bottom'
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
			tabs.find('.sortStyleOps').sortable({
				connectWith:  ".connectedSortable",
				placeholder: "ui-state-highlight",
				update: function(event, ui) {
					if(ui.item.parent('.sortStyleOps.pool')){
						ui.item.find(':input').val('');
					}
					rebuild_example(tabs,mapSelector,type);
				}
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
	
	$('.codeurllink').on('click',function(){window.open($(this).prev('.codeurl').text())})
	
	
	
	if($('#runningOptions').html()=="{}"||$('#runningOptions').html()==""){
	$.each($('#tabs_Options input.text'),function(i,v){
		var tmpVal = $(this).val();
		if(tmpVal!=""){
			if(isNumber(tmpVal)){
				if(tmpVal>0){
					var tmp = {} 
					tmp[$(this).attr("id")]=tmpVal;
					options=$.extend(options,tmp);
				}
			}else{
				var tmp = {} 
				tmp[$(this).attr("id")]=tmpVal;
				options=$.extend(options,tmp);
			}
		}
	});	
	}else{
		var jsonStr = $('#runningOptions').html();
		var mapType = jsonStr.replace(/.*?(\"mapTypeId\":"(\w+)".*$)/g,"$2");
		jsonStr = jsonStr.replace(/("\w+":\"\",)/g,'').replace(/(\"mapTypeId\":"\w+",)/g,'');
		$.extend(options,base,$.parseJSON(jsonStr));
		//alert(dump(options));
		//$(this).val().replace(/[^a-zA-Z0-9-_]/g, '-'); 
	}
	//alert(dump(options));
	
	$('#dragCenter').on('change',function(){
			if($(this).is(":checked")){
				$('#place_drawing_map').gmap('setOptions',{"draggable":true})
			}else{
				$('#place_drawing_map').gmap('setOptions',{"draggable":$('#draggable').is(":checked")})
			}
		});
		
	$('#setZoom').on('change',function(){
			if($(this).is(":checked")){
				$('#place_drawing_map').gmap('setOptions',{"scrollwheel":true})
			}else{
				$('#place_drawing_map').gmap('setOptions',{"scrollwheel":$('#scrollwheel').is(":checked")})
			}
		});		

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
		
		reloadShapes();
		reloadPlaces();
		
	}).resizable({
		helper: "ui-resizable-helper",
		stop: function(event, ui) {
				var width = $('#width').val(ui.size.width);
				var height = $('#height').val(ui.size.height);
				$('#place_drawing_map').gmap('refresh');
			}
	});
	
	$('[name="view.places[]"] option').on('click',function(){reloadPlaces()});
	$('[name="view.geometrics[]"] option').on('click',function(){reloadShapes()});	
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
			//$.post('/view/aliasCheck.castle?alias='+val, function(data) {
			$.post('/admin/checkAlias.castle?alias='+val+'&typeName='+view.replace("/",""), function(data) {
				if(data=="true"){
					$('.aliasState').addClass('error');
					$('.aliasState').removeClass('ok');
					$('.aliasState').text('  :  taken');
				}else{
					$('.aliasState').addClass('ok');
					$('.aliasState').removeClass('error');
					$('.aliasState').text('  :  available');
				}
				waiting = false;
			});
		}
		$('.outputurl').text(val);
		$(this).val(val);
	});	
}


function reloadPlaces(){
		var url=siteroot+"public/getPlaceJson_byIds.castle";
		var ids;
		
		$.each($('[name="view.places[]"] option'),function(){
			if($(this).is($(':selected'))){
				ids =(typeof(ids)=="undefined"?'':ids+',')+$(this).val();
			}
		});
		if(typeof(ids)!="undefined"){
			$.getJSON(url+'?callback=?&ids[]='+ids, function(data) {
				$.each(ib, function(i) {ib[i].close();});
				$('#place_drawing_map').gmap('clear','markers');
				
				loadJsonData($('#place_drawing_map'),data,null,function(marker){
					//ib[0].open($('#place_drawing_map').gmap('get','map'), marker);
					//cur_mid = mid[0];
				});
				prep();
			});
		}	
}
function reloadShapes(){
	var url=siteroot+"public/getShapesJson_byIds.castle";
	var ids;
	
	$.each($('[name="view.geometrics[]"] option'),function(){
		if($(this).is($(':selected'))){
			ids =(typeof(ids)=="undefined"?'':ids+',')+$(this).val();
		}
	});
	if(typeof(ids)!="undefined"){
		$.getJSON(url+'?callback=?&ids[]='+ids, function(data) {
			$('#place_drawing_map').gmap('clear','overlays');
			$.each( data.shapes, function(i, shape) {	
				 var pointHolder = {};
				 if(shape.latlng_str!='' && shape.type=='polyline'){ 
					var pointHolder = {'path' : shape.latlng_str };
				 }
				  if(shape.latlng_str!='' && shape.type=='polygon'){ 
					var pointHolder = {'paths' : shape.latlng_str };
				 }
				 if((typeof(shape.latlng_str)=="undefined"||shape.latlng_str=='') && $.isEmptyObject(pointHolder) && typeof(shape.encoded)!="undefined"){ 
					var pointHolder = {'paths' : shape.encoded };
				 }
				 var style = shape.type=='polygon'? {'fillOpacity':.99,'fillColor':'#981e32','strokeColor':'#262A2D','strokeWeight':1}:{'strokeOpacity':.99,'strokeColor':'#262A2D','strokeWeight':2};
				 if(!$.isEmptyObject(pointHolder)){
					var ele = $.extend( style , pointHolder );
				 }else{
					var ele = {};
				 }
				$('#place_drawing_map').gmap('addShape',(shape.type[0].toUpperCase() + shape.type.slice(1)), ele);
			});
		});
	}	
}


/* ok yes repeat.. abstract this and make useable for front and back. */


var needsMoved=0;
function loadJsonData(jObj,data,callback,markerCallback){
	if(typeof(data.shapes)!=='undefined' && !$.isEmptyObject(data.shapes)){
		$.each( data.shapes, function(i, shape) {	
			if( !$.isEmptyObject(shape)){
				 var pointHolder = {};
				 if(shape.latlng_str!='' && shape.type=='polyline'){ 
					var pointHolder = {'path' : shape.latlng_str };
				 }
				  if(shape.latlng_str!='' && shape.type=='polygon'){ 
					var pointHolder = {'paths' : shape.latlng_str };
				 }
				 if((typeof(shape.latlng_str)=="undefined"||shape.latlng_str=='') && !$.isEmptyObject(pointHolder) && typeof(shape.encoded)!="undefined"){ 
					var pointHolder = {'paths' : shape.encoded };
				 }
				 var style = shape.type=='polygon'? {'fillOpacity':.99,'fillColor':'#981e32','strokeColor':'#262A2D','strokeWeight':1}:{'strokeOpacity':.99,'strokeColor':'#262A2D','strokeWeight':2};
				 if(!$.isEmptyObject(pointHolder)){
					var ele = $.extend( style , pointHolder );
				 }else{
					var ele = {};
				 }
				jObj.gmap('addShape',(shape.type[0].toUpperCase() + shape.type.slice(1)), ele);
			}
		});
	}
	if(typeof(data.markers)!=='undefined' &&  !$.isEmptyObject( data.markers )){
		var l = data.markers.length;
		//alert(l);
		$.each( data.markers, function(i, marker) {
			
	/* note this is in 3 places now.. time to abstract */		
	if(typeof(marker.shapes)!=='undefined' && !$.isEmptyObject(marker.shapes)){
		$.each( marker.shapes, function(i, shape) {	
			if( !$.isEmptyObject(shape)){
				 var pointHolder = {};
				 if(shape.latlng_str!='' && shape.type=='polyline'){ 
					var pointHolder = {'path' : shape.latlng_str };
				 }
				  if(shape.latlng_str!='' && shape.type=='polygon'){ 
					var pointHolder = {'paths' : shape.latlng_str };
				 }
				 if((typeof(shape.latlng_str)=="undefined"||shape.latlng_str=='') && !$.isEmptyObject(pointHolder) && typeof(shape.encoded)!="undefined"){ 
					var pointHolder = {'paths' : shape.encoded };
				 }
				 var style = shape.type=='polygon'? {'fillOpacity':.99,'fillColor':'#981e32','strokeColor':'#262A2D','strokeWeight':1}:{'strokeOpacity':.99,'strokeColor':'#262A2D','strokeWeight':2};
				 if(!$.isEmptyObject(pointHolder)){
					var ele = $.extend( style , pointHolder );
				 }else{
					var ele = {};
				 }
				jObj.gmap('addShape',(shape.type[0].toUpperCase() + shape.type.slice(1)), ele);
			}
		});
	}
			
			
			//alert(dump(marker));
			var _mid= marker.id;
			
			mid[i]=marker.id;
				if($.isArray(marker.info.content)){
					var nav='';
					$.each( marker.info.content, function(j, html) {	
						nav += '	<li class="ui-state-default ui-corner-top '+( j==0 ?'first ui-tabs-selected ui-state-active':'')+'"><a href="#tabs-'+j+'" hideFocus="true">'+html.title+'</a></li>';
					});
					var content='';
					$.each( marker.info.content, function(j, html) {
						content += '<div id="tabs-'+j+'" class="ui-tabs-panel ui-widget-content ui-corner-bottom  '+( j>0 ?' ui-tabs-hide':'')+'"><div class="content '+html.title.replace(' ','_').replace('/','_')+'">'+html.block+'</div></div>';
					});				
				
				}else{
					var nav = '	<li class="ui-state-default ui-corner-top  ui-tabs-selected ui-state-active first"><a href="#tabs-1" hideFocus="true">Overview</a></li>';
					var content='<div id="tabs-" class="ui-tabs-panel ui-widget-content ui-corner-bottom  "><div class="content overview">'+marker.info.content+'</div></div>';
				}
		
				var box='<div id="taby'+i+'" class="ui-tabs ui-widget ui-widget-content ui-corner-all">'+
							'<ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">'+nav+'</ul>'+
							content+
							'<div class="ui-tabs-panel-cap ui-corner-bottom"><span class="arrow L5"></span><span class="arrow L4"></span><span class="arrow L3"></span><span class="arrow L2"></span></div>'+
						'</div>';
		
				/* so need to remove this and create the class for it */
				var boxText = document.createElement("div");
				boxText.style.cssText = "border: 1px solid black; margin-top: 8px; background: yellow; padding: 5px;";
				boxText.innerHTML = marker.info.content;
		
		
				
		
				var myOptions = {
					alignBottom:true,
					 content: box//boxText
					,disableAutoPan: false
					,maxWidth: 0
					,height:"340px"
					,pixelOffset: new google.maps.Size(-200, -103)
					,zIndex: 999
					,boxStyle: {
					  width: "400px"
					 }
					,closeBoxHTML:"<span class='tabedBox infoClose'></span>"
					,infoBoxClearance: new google.maps.Size(50,50)
					,isHidden: false
					,pane: "floatPane"
					,enableEventPropagation: false
					,onClose:function(){
						ibHover =  false;
						if($('.cWrap .items li').length>1 && typeof(cycle)!=="undefined"){$('.cWrap .items').cycle('destroy');}
						$('#taby'+i).tabs('destroy').tabs();
					}
					,onOpen:function(){
							needsMoved=0;
							ibHover =  true;
							$('#taby'+i).tabs('destroy').tabs();
							if($('.cWrap .items li').length>1 && typeof(cycle)!=="undefined"  &&  $.isFunction(cycle)){
								$('.cWrap .items').cycle('destroy');
								$('.cWrap .items').cycle({
									fx:     'scrollHorz',
									delay:  -2000,
									pauseOnPagerHover: 1,
									pause:1,
									timeout:0, 
									pager:'.cNav',
									prev:   '.prev',
									next:   '.next', 
									pagerAnchorBuilder: function(idx, slide) { return '<li><a href="#" hidefocus="true">'+idx+'</a></li>';} 
								});/*	*/
							}
							$('.infoBox a').attr('target','_blank');
							$('a.gouped').off().on('click',function(e){
								e.preventDefault();
								e.stopPropagation();
								$('a.gouped').colorbox({
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
									onComplete:function(){
										if($('#colorbox #cb_nav').length)$('#colorbox #cb_nav').html("");	
										if($('#ttl').length){
											var t=parseInt($('#ttl').text());
											var li="";
											if(t>1){
												for(j=0; j<t; j++){
													li+="<li><a href='#'></a></li>";
												}
												if($('#colorbox #cb_nav').length==0){
													$('#cboxCurrent').after('<ul id="cb_nav">'+li+'</ul>');
												}else{
													$('#colorbox #cb_nav').html(li);
												}
											}
											if($('#colorbox #cb_nav').length){
												$('#colorbox #cb_nav .active').removeClass('active');
												$('#colorbox #cb_nav').find('li:eq('+ (parseInt($('#cboxCurrent #cur').text())-1) +')').addClass('active');
													if(needsMoved<0||needsMoved>0){
														//alert(needsMoved);
														if(needsMoved<0){
															$.colorbox.next();
															needsMoved++;
														}else{
															$.colorbox.prev();
															needsMoved--;
														}
													}
												$('#colorbox #cb_nav li').off().on('click',function(){
													var cur=(parseInt($('#cboxCurrent #cur').text())-1);
													var selected=$(this).index('#cb_nav li');
													var dif=cur-selected;
													needsMoved=dif;
													if(dif<0||dif>0){
														if(dif<0){
															$.colorbox.next();
															needsMoved++;
														}else{
															$.colorbox.prev();
															needsMoved--;
														}
													}
												});
											}
										}
									}
								});
							});
							addErrorReporting(marker);
							var minHeight=0;
							$.each($('#taby'+i+' .ui-tabs-panel'),function() {
								minHeight = Math.max(minHeight, $(this).find('.content').height()); 
							}).css('min-height',minHeight); 
							$('.ui-tabs-panel').hover(function(){
								ib[i].setOptions({enableEventPropagation: true});
								jObj.gmap('stop_scroll_zoom');
							},function(){
								ib[i].setOptions({enableEventPropagation: false});
								jObj.gmap('set_scroll_zoom');
							});
							ib[i].rePosition();
							ibHover =  false;
							prep();
						}
				};
				ib[i] = new InfoBox(myOptions,function(){
					//$('#taby'+i).tabs();
					//alert('tring to tab it, dabnab it, from the INI');
				});
				//end of the bs that is well.. bs of a implamentation
				/* so need to remove this and create the class for it */
				var boxText = document.createElement("div");
				boxText.style.cssText = "border: 1px solid rgb(102, 102, 102); background: none repeat scroll 0% 0% rgb(226, 226, 226); padding: 2px; display: inline-block; font-size: 10px !important; font-weight: normal !important;";
				boxText.innerHTML = "<h3 style='font-weight: normal !important; padding: 0px; margin: 0px;'>"+marker.title+"</h3>";
				var myHoverOptions = {
					alignBottom:true,
					 content: boxText//boxText
					,disableAutoPan: false
					,pixelOffset: new google.maps.Size(15,-15)
					,zIndex: 999
					,boxStyle: {
						minWidth: "250px"
					 }
					,infoBoxClearance: new google.maps.Size(1, 1)
					,isHidden: false
					,pane: "floatPane"
					,boxClass:"hoverbox"
					,enableEventPropagation: false
					,disableAutoPan:true
					,onOpen:function(){}
					
				};
				ibh[i] = new InfoBox(myHoverOptions,function(){});
				if(marker.style.icon){marker.style.icon = marker.style.icon.replace('{$i}',i+1);}
				jObj.gmap('addMarker', $.extend({ 
						'position': new google.maps.LatLng(marker.position.latitude, marker.position.longitude),
						'z-index':1
					},marker.style),function(ops,marker){
						markerLog[i]=marker;
						markerbyid[_mid] = markerLog[i];
						
						 // these too are needing to be worked together
						jObj.gmap('setOptions', {'zIndex':1}, markerLog[i]);
						if($.isFunction(markerCallback))markerCallback(marker);
					})
				.click(function() {
						$.each(ib, function(i) {
							ib[i].close();
							jObj.gmap('setOptions', {'zIndex':1}, markerLog[i]);
						});
						ib[i].open(jObj.gmap('get','map'), this,function(){
								cur_mid = mid[i];
								//updateUrl(cur_nav,mid[i]);
							});
						jObj.gmap('setOptions', {'zIndex':9}, this);
						$('#selectedPlaceList_area .active').removeClass('active');
						$('#selectedPlaceList_area a:eq('+i+')').addClass('active');
						//cur_mid = _mid;
						//updateUrl(cur_nav,_mid);
						cur_mid = mid[i];
						ibHover =  false;
						//$('#centralMap').gmap('openInfoWindow', { 'content': marker.info.content }, this); // todo
					})
				.rightclick(function(event){showContextMenu(event.latLng);})
				.mouseover(function(event){
					$.each(ibh, function(i) {ibh[i].close();});
					$('.infoBox').hover( 
						function() { ibHover =  true; }, 
						function() { ibHover =  false;  } 
					); 
					if(ibHover!=true)ibh[i].open(jObj.gmap('get','map'), markerLog[i]);
				})
				.mouseout(function(event){$.each(ibh, function(i) {ibh[i].close();});});
				
				
				if(i==(l-1) && $.isFunction(callback)){
					//alert(l);
					//alert(i);
					callback();
				}
		});
		geoLocate();
		
	}
	//if($.isFunction(callback))callback();return;
	
}