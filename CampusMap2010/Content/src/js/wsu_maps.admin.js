// JavaScript Document
var i=i||-1;
var image_count=image_count||-1;

(function($,window,WSU_MAP) {
	WSU_MAP.is_frontend=false;
	$.extend( WSU_MAP, {
		admin : {
			ini:function(){
				$(document).ready(function(){
					WSU_MAP.admin.tmp_ini();
					WSU_MAP.admin.make_dataTables();
					
					var ed=ed||false;
					if($('.admin.view._editor').length){
						WSU_MAP.admin.view.load_editor();
						ed = true;
					 }		
					if($('#geometrics_drawing_map').length){
						WSU_MAP.admin.geometrics.load_editor();
						ed = true;
					 }	
					if($('.admin.place._editor').length){
						WSU_MAP.admin.place.load_editor();
						WSU_MAP.admin.ui.tinymce.tinyResize();
						ed = true;
					 }	
					if($('#style_map').length){
						WSU_MAP.admin.style.load_editor();
						ed = true;
					}	
					if($('#map_canvas').length){
						WSU_MAP.initialize();
						if($('.home #map_canvas').length){
							$(window).resize(function(){
								WSU_MAP.responsive.resizeBg($('#map_canvas'),170);
							}).trigger("resize");
						}
						ed = true;
					}
		
					var cache = {},lastXhr;
					$( "#tags" ).bind( "keydown", function( event ) {
						if ( event.keyCode === $.ui.keyCode.TAB &&
								$( this ).data( "autocomplete" ).menu.active ) {
							event.preventDefault();
						}
					}).autocomplete({
						minLength: 0,
						source: function( request, response ) {
							// delegate back to autocomplete, but extract the last term
							/*response( $.ui.autocomplete.filter(
								availableTags, WSU_MAP.util.extractLast( request.term ) ) );*/
								var term = request.term;
								if ( term in cache ) {
									response( cache[ term ] );
									return;
								}
					
								lastXhr = $.getJSON( WSU_MAP.defaults.DOMAIN+"/public/get_pace_type.castle", request, function( data, status, xhr ) {
									cache[ term ] = data;
									if ( xhr === lastXhr ) {
										response( $.ui.autocomplete.filter(
										data, WSU_MAP.util.extractLast( request.term ) ) );
									}
								});
						},
						focus: function() {
							// prevent value inserted on focus
							return false;
						},
						select: function( event, ui ) {
							var terms = WSU_MAP.util.split( this.value );
							// remove the current input
							terms.pop();
							// add the selected item
							terms.push( ui.item.value );
							// add placeholder to get the comma-and-space at the end
							terms.push( "" );
							this.value = terms.join( ", " );
							return false;
						}
					});
					
					
					
					
					/*
					$( "#addGeometrics" ).click(function(){
						//if($('#dialog-form').length==0){$('#staging').append('<div id="dialog-form" title="Create new location"></div>');}
						$( "#addGeom" ).dialog({
							minimize:true,
							maximize:false,
							autoOpen: false,
							title:"Add Geometrics",
							//modal: true,
							width:525,
							buttons: {
								"Add": function() {
									
								},
								Cancel: function() {
									$( this ).dialog( "close" );
								}
							},
							close: function() {
								//allFields.val( "" ).removeClass( "ui-state-error" );
							}
						});
						$( "#addGeom" ).dialog("open").dialog('widget');
					});
					*/
					
					$('.ListingChoices').on('click',function(){//e) {
						var obj=$(this);
						if(!$(this).is('active')){// changed hasClass for is for speed
							var href = $(this).attr('href');
							$('.tabactive').animate({
								width:0,
								height:0
							}, 250, function() {
								$('.tabactive').removeClass('tabactive');
								$('.active').removeClass('active ui-state-hover');
								$(href).animate({
									width:'100%',
									height:'100%'
								}, 250, function() {
									$(href).addClass('tabactive');
									obj.addClass('active ui-state-hover');
									$.cookie('tabedArea', href, {expires: 1, path: '/'+WSU_MAP.state.view+WSU_MAP.state.mcv_action+'.castle' });
									window.history.replaceState(null, null,  href);
								});
							});
						}
						return false;
					});
					var returnArea = $.cookie('tabedArea');
					var hash = window.location.hash;
					if(returnArea!=="undefined" || $("[href='#"+hash+"']").length){
						var href=returnArea;
						if($("[href='#"+hash+"']").length){
							href=hash;
							//$.cookie('tabedArea', href, {expires: 1, path: '/'+view+mcv_action+'.castle' });
						}
						$("[href='"+href+"']").trigger('click');
					}
				
				});
			},
			defaults:{
				place_id:-1,
				get_wsu_logo_shape:function (){
					var Coords = [];
					var shaped = [];
					var shape = "-117.151680,46.737567,\n-117.152281,46.737390,\n-117.152753,46.737067,\n-117.153225,46.736655,\n-117.153397,46.736155,\n-117.153482,46.735449,\n-117.153268,46.734831,\n-117.153053,46.733949,\n-117.152710,46.732919,\n-117.152581,46.732331,\n-117.152538,46.731743,\n-117.152710,46.731066,\n-117.153010,46.730684,\n-117.153568,46.730390,\n-117.154341,46.730272,\n-117.155242,46.730272,\n-117.155199,46.730860,\n-117.155199,46.731301,\n-117.155800,46.730772,\n-117.156572,46.730125,\n-117.157817,46.729537,\n-117.156658,46.729448,\n-117.155199,46.729331,\n-117.153826,46.729213,\n-117.152796,46.729095,\n-117.151937,46.729125,\n-117.151251,46.729389,\n-117.150650,46.729860,\n-117.150350,46.730419,\n-117.150307,46.731184,\n-117.150650,46.732272,\n-117.150865,46.733155,\n-117.151165,46.734243,\n-117.151079,46.734978,\n-117.150693,46.735419,\n-117.150092,46.735861,\n-117.149405,46.736037,\n-117.148547,46.736008,\n-117.148204,46.735861,\n-117.147861,46.735567,\n-117.147560,46.735184,\n-117.147517,46.735684,\n-117.147646,46.736155,\n-117.147517,46.736390,\n-117.147517,46.736655,\n-117.145371,46.736684,\n-117.145371,46.736861,\n-117.147517,46.736890,\n-117.147560,46.737008,\n-117.145500,46.737272,\n-117.145543,46.737449,\n-117.147646,46.737243,\n-117.147646,46.737361,\n-117.145715,46.737831,\n-117.145844,46.738037,\n-117.147903,46.737596,\n-117.148204,46.737831,\n-117.150393,46.737714,\n-117.150092,46.738714,\n-117.150393,46.738714,\n-117.150865,46.737655,\n-117.151294,46.737655,\n-117.150865,46.738772,\n-117.151122,46.738743";
					
					var Rows=shape.split('\n');
					if(Rows.length){
						/*for(i=0; i<=Rows.length-1; i++){
							var cord=Rows[i].split(',');
							shaped.push(new google.maps.LatLng(parseFloat(cord[1]),parseFloat(cord[0])));
						}*/
						$.each(Rows.length,function(i){
							var cord=Rows[i].split(',');
							shaped.push(new google.maps.LatLng(parseFloat(cord[1]),parseFloat(cord[0])));
						});
					}
					Coords.push(shaped.reverse());
					
					shaped = [];
					shape = "-117.149577,46.736390,\n-117.150435,46.736537,\n-117.150908,46.736508,\n-117.151508,46.736449,\n-117.151937,46.736243,\n-117.152238,46.735949,\n-117.152367,46.735537,\n-117.152023,46.735743,\n-117.151594,46.736037,\n-117.151122,46.736184,\n-117.150564,46.736302,\n-117.150221,46.736361";
					
					Rows=shape.split('\n');
					if(Rows.length){
						/*for(i=0; i<=Rows.length-1; i++){
							var cord=Rows[i].split(',');
							shaped.push(new google.maps.LatLng(parseFloat(cord[1]),parseFloat(cord[0])));
						}*/
						$.each(Rows.length,function(i){
							var cord=Rows[i].split(',');
							shaped.push(new google.maps.LatLng(parseFloat(cord[1]),parseFloat(cord[0])));
						});
					}
					Coords.push(shaped);
					
					shaped = [];
					shape = "-117.153010,46.737331,\n-117.154212,46.737037,\n-117.155070,46.736625,\n-117.156014,46.736155,\n-117.156487,46.735831,\n-117.155628,46.735214,\n-117.155328,46.735449,\n-117.155285,46.734802,\n-117.155242,46.734008,\n-117.155714,46.734449,\n-117.156143,46.734772,\n-117.155929,46.734978,\n-117.156658,46.735625,\n-117.157130,46.735214,\n-117.157688,46.734537,\n-117.157903,46.734096,\n-117.156873,46.733508,\n-117.156744,46.733772,\n-117.156487,46.733361,\n-117.156487,46.732919,\n-117.156572,46.732507,\n-117.156701,46.732213,\n-117.156959,46.732655,\n-117.157216,46.732890,\n-117.157044,46.733272,\n-117.157946,46.733802,\n-117.158418,46.733066,\n-117.158976,46.732302,\n-117.159662,46.731566,\n-117.160220,46.731154,\n-117.159019,46.731301,\n-117.158074,46.731478,\n-117.158160,46.730860,\n-117.158504,46.730095,\n-117.159019,46.729507,\n-117.158160,46.729684,\n-117.157130,46.730154,\n-117.156229,46.730860,\n-117.155457,46.731625,\n-117.155156,46.732184,\n-117.154899,46.731596,\n-117.154813,46.730566,\n-117.154427,46.730537,\n-117.153912,46.730566,\n-117.153482,46.730743,\n-117.153654,46.730713,\n-117.153225,46.731007,\n-117.153010,46.731507,\n-117.153010,46.732184,\n-117.153139,46.733008,\n-117.153397,46.733713,\n-117.153654,46.734537,\n-117.153869,46.735302,\n-117.153869,46.735919,\n-117.153783,46.736419,\n-117.153482,46.736802,\n-117.153311,46.737067,\n-117.153010,46.737331";	
					Rows=shape.split('\n');
					if(Rows.length){
						/*for(i=0; i<=Rows.length-1; i++){
							var cord=Rows[i].split(',');
							shaped.push(new google.maps.LatLng(parseFloat(cord[1]),parseFloat(cord[0])));
						}*/
						$.each(Rows.length,function(i){
							var cord=Rows[i].split(',');
							shaped.push(new google.maps.LatLng(parseFloat(cord[1]),parseFloat(cord[0])));
						});
					}
					Coords.push(shaped);
					
					shaped = [];
					shape = "-117.150521,46.733684,\n-117.150435,46.733066,\n-117.150307,46.732537,\n-117.150092,46.732096,\n-117.149792,46.731596,\n-117.149448,46.731213,\n-117.148976,46.730919,\n-117.148461,46.730801,\n-117.148075,46.730772,\n-117.147689,46.730801,\n-117.147346,46.730949,\n-117.147045,46.731125,\n-117.146745,46.731449,\n-117.146616,46.731860,\n-117.146616,46.732243,\n-117.146702,46.732743,\n-117.146788,46.733213,\n-117.146916,46.733508,\n-117.147131,46.733919,\n-117.147088,46.733537,\n-117.147088,46.733155,\n-117.147217,46.732802,\n-117.147431,46.732478,\n-117.147818,46.732272,\n-117.148290,46.732184,\n-117.148719,46.732213,\n-117.149277,46.732419,\n-117.149620,46.732625,\n-117.150006,46.732919,\n-117.150221,46.733155,\n-117.150350,46.733390,\n-117.150521,46.733684";	
					Rows=shape.split('\n');
					if(Rows.length){
						/*for(i=0; i<=Rows.length-1; i++){
							var cord=Rows[i].split(',');
							shaped.push(new google.maps.LatLng(parseFloat(cord[1]),parseFloat(cord[0])));
						}*/
						$.each(Rows.length,function(i){
							var cord=Rows[i].split(',');
							shaped.push(new google.maps.LatLng(parseFloat(cord[1]),parseFloat(cord[0])));
						});
					}
					Coords.push(shaped);
					
					shaped = [];
					shape = "-117.150006,46.730154,\n-117.150221,46.729684,\n-117.150693,46.729331,\n-117.151165,46.729125,\n-117.149706,46.729095,\n-117.149749,46.729566,\n-117.149835,46.729890,\n-117.150006,46.730154";	
					Rows=shape.split('\n');
					if(Rows.length){
						/*for(i=0; i<=Rows.length-1; i++){
							var cord=Rows[i].split(',');
							shaped.push(new google.maps.LatLng(parseFloat(cord[1]),parseFloat(cord[0])));
						}*/
						$.each(Rows.length,function(i){
							var cord=Rows[i].split(',');
							shaped.push(new google.maps.LatLng(parseFloat(cord[1]),parseFloat(cord[0])));
						});
					}
					Coords.push(shaped);
					return Coords;
				},
			},
			
			
			
			
			
			
		make_dataTables:function(){
			if($('.datagrid:not(.dataTable)').length){
				var datagrids = $('.datagrid:not(.dataTable)');
				$.each(datagrids,function(){
					var datatable = $(this);
					datatable.dataTable( {
						"bJQueryUI": true,
						"bAutoWidth": false,
						"sPaginationType": "full_numbers",
						"aaSorting": [[1,'asc']],
						"columnDefs": [ {
						  "targets"  : 'no-sort',
						  "orderable": false,
						}]
					});
					$('.fa-search').tooltip({
						position: {
							my: "left top",
							at: "right+5 top-5"
						},
						tooltipClass:"jselect-menu-imgtooltip",
						content: function() {
							var element = $( this ).attr('title');
							return "<img src='"+element+"' style='max-width:200px;'/>";
						}
					});
					WSU_MAP.admin.set_up_list_deletion();
						
					
					datatable.on( 'draw.dt', function () {
						//WSU_MAP.admin.ini_dataTable_removals(datatable.find(".removal"));
						WSU_MAP.admin.set_up_list_deletion();
						
						$('.fa-search').tooltip({
							position: {
								my: "left top",
								at: "right+5 top-5"
							},
							tooltipClass:"jselect-menu-imgtooltip",
							content: function() {
								var element = $( this ).attr('title');
								return "<img src='"+element+"' style='max-width:200px;'/>";
							}
						});
						//WSU_MAP.admin.build_general_removal_button($( "a[title='Delete']" ));
						
					});
				});
				
				var addTos = $(".add_to_list");
				$.each(addTos,function(){
					var targ = $(this);
					targ.on("click",function(e){
						WSU_MAP.util.nullout_event(e);
						var targ = $(this);
						var type = targ.data('type');
						
						var focused_grid = targ.prev('.dataTables_wrapper').find('.datagrid');
						$("[data-active_grid='true']").attr("data-active_grid",false);
						focused_grid.attr("data-active_grid",true);
		
						var list ="";
						if(focused_grid.find(".dataTables_empty").length<=0){
							list = WSU_MAP.admin.get_table_ids( focused_grid );
						}
						WSU_MAP.admin.popup_message('<span style="font-size: 28px;"><i class="icon-spinner icon-spin icon-large"></i> loading ... </span>',true);
						WSU_MAP.admin.add_item_popup(type, list, ["new","list"]);
					});
				});
				WSU_MAP.admin.set_up_list_deletion();
				//WSU_MAP.admin.ini_dataTable_removals();
				
			}

		},
		
		set_up_list_deletion:function(){
			$('.deletion').off().on("click",function(e){
				
				WSU_MAP.util.nullout_event(e);
				var targ = $(this);
				WSU_MAP.util.confirmation_message("Are you sure you want send this item to the trashbin?",{
					"yes":function(){
						console.log('move to');
						window.location=targ.attr("href");
					},
					"no":function(){}
				});
			});
		},
		ini_dataTable_removals:function(removals){
			removals = removals || $(".display.datagrid.dataTable .removal");
			$.each(removals,function(){
				WSU_MAP.admin.build_general_removal_button($(this));
			});
		},
		build_general_removal_button:function(jObj){
			jObj.off().on("click",function(e){
				WSU_MAP.util.nullout_event(e);
				var targ = $(this);
				WSU_MAP.admin.confirmation_message("Are you sure?",{
					"yes":function(){
						WSU_MAP.admin.remove_datatable_current_row(targ);
					},
					"no":function(){}
				});
			});
		},
		remove_datatable_current_row:function(targ){
			var targetrow = targ.closest("tr");
			var datatable = targ.closest('table').dataTable();
			targetrow.fadeOut( "75" ,function(){ 
				var row = targetrow.get(0);
				datatable.fnDeleteRow( datatable.fnGetPosition( row ) );
			});
		},
			
			
			
			
			
			
			
			
			removeAlertLoadingSaving:function (){
				$( "#dialog" ).dialog( "close" );
			},
			setup_fixedNav:function (){
				if ($(window).scrollTop()>= 122) {
					$('.admin #adminNav').addClass('fixed');
				}
				$(window).scroll(function (){//event) {
					if ($(this).scrollTop()>= 122) {     
						$('.admin #adminNav').addClass('fixed');
					} else { 
						$('.admin #adminNav').removeClass('fixed');
					}  
				});
				$('.Cancel a').on("click",function(e){
					WSU_MAP.util.nullout_event(e);
					$("input[value='Cancel']:first").trigger('click');
				});
				$('.Submit a').on("click",function(e){
					WSU_MAP.util.nullout_event(e);
					$("input[value='Submit']:first").trigger('click');
				});	
				$('.Apply a').on("click",function(e){
					WSU_MAP.util.nullout_event(e);
					$("input[value='Apply']:first").trigger('click');
				});
			},
			addToggle:function (){
				$('.imageBox').hover(
					function(){
						$(this).find('.imgInfo').fadeIn('slow');
						$(this).find('.DeleteImage').fadeIn('slow');
					},
					function(){
						$(this).find('.imgInfo').fadeOut('fast');
						$(this).find('.DeleteImage').fadeOut('fast');
					}
				);
			},
			alertLoadingSaving:function (mess){
				mess=mess||'Saving . . .';
				if($('dialog').length===0){
					$('body').append('<div id="dialog" style="display:none;"><h3>'+mess+'</h3></div>');
				}
				$( "#dialog" ).dialog({
					position: ['center','top'],
					minHeight:'55px',
					hide: 'slide',
					resizable: false,
					draggable: false,
					close: function(){//event, ui) {
					}
				});
			},
			setup_massTags:function (){
				$('#massTagging').on('click',function(e){
					WSU_MAP.util.nullout_event(e);
					$('#massTaggingarea').slideToggle();
				});	
			},
			tmp_ini:function(){
				
				
				
				
				
				
				
						
						
						
				//WSU_MAP.admin.setup_fixedNav();
				$('.insotryupload').on('click',function(){
					WSU_MAP.admin.ui.openImgUploader();
				});
				$('.imgInfo').slideToggle();
				$('.DeleteImage').fadeToggle();	
				WSU_MAP.admin.addToggle();
				WSU_MAP.admin.lists.addLiveActionAnimation();
				if($(".lazy img,img.lazy").length){
					$(".lazy img,img.lazy").lazyload();
				}
				
				if($("input.all").length){
					$("input.all").on('click',function(){//e) {
						var ele = $(this);
						if(!ele.attr('checked')){
							ele.closest('div').find('select option').removeAttr('selected');
						}else{
							ele.closest('div').find('select option').attr('selected',true);
						}
					});
					
					$("input.all").closest('div').find('select').on('mouseup',function(){
						if($(this).find('option').size() === $(this).find(':selected').size()){
							$(this).closest('div').find('input.all').attr("checked",true);
						}else{
							$(this).closest('div').find('input.all').removeAttr("checked");
						}
					});
					
					
				}
				
				if(window._defined(tinyMCE) && $('textarea.tinyEditor').length>0){
					$.each($('textarea.tinyEditor'),function(i){
						if(!$(this).is($(".tinyLoaded"))){
							if(!window._defined($(this).attr('id'))){
								$(this).attr('id','temp_'+i);
							}
							if($(this).is($(".full"))){
								WSU_MAP.admin.ui.tinymce.load_tiny("bodytext",$(this).attr('id'));
							}else{
								WSU_MAP.admin.ui.tinymce.load_tiny("simple",$(this).attr('id'));
							}
							$(this).addClass("tinyLoaded");
							WSU_MAP.admin.ui.tinymce.tinyResize();
						}
					});
				}
				if($('.sortable.nav').length){
					$('ol.sortable').nestedSortable({
						disableNesting: 'no-nest',
						forcePlaceholderSize: true,
						handle: 'div',
						helper:	'clone',
						items: 'li',
						maxLevels: 3,
						opacity: 0.6,
						placeholder: 'placeholder',
						revert: 250,
						tabSize: 25,
						tolerance: 'pointer',
						toleranceElement: '> div',
						update: function(){//event, ui) {
							if(!$('.menu.formAction.Submit').is(':visible')){
								$('.menu.formAction.Submit').show();
							}
							var arraied = $('ol.sortable').nestedSortable('toArray', {startDepthCount: 0});
							$.each($('li','ol.sortable'),function(i){//,v){
								$(this).find('.nav_level').val(arraied[i+1].depth);
								$(this).find('.nav_position').val(i+1);
								$(this).find('.nav_level_display .value').text(arraied[i+1].depth);
								$(this).find('.nav_position_display .value').text(i+1);
							});
						}
					});
				}
			/* General Actions */
			
			
			
			
			
			
			
			
			/* setup UI */
				if($( ".buttons" ).length > 0){
					$( ".buttons" ).button({text:false});
				}
				if($( ".admin input[type='submit']" ).length > 0){$("input[type='submit']" ).button();}
				if($('.NOTED').length){
					$('.NOTED strong').on('click',function(){//e){
						var self = $(this);
						var parent = $(this).closest('span');
						parent.find('span').slideToggle('fast',function(){
							self.is('.open') ? self.removeClass('open') :self.addClass('open');
							parent.find('em').text((self.is('.open')?' (-)':' (+)'));
						});
					});
				}
			
				
			
				
			
				if($('.autoselect').length){
					$.each($( ".autoselect" ),function(){
						$(this).combobox();
					});
				}
			
			
				/*function tabsToAccordions(){
					$(".tabs").each(function(){
						var e=$('<div class="accordion">');
						var t=[];
						$.each($(this).find(">ul>li"),function(){
							t.push("<h3>"+$(this).html()+"</h3>");
						});
						var n=[];
						$.each($(this).find(">div"),function(){
							n.push("<div>"+$(this).html()+"</div>");
						});
						for(var r=0;r<t.length;r++){
							e.append(t[r]).append(n[r]);
						}
						$(this).before(e);
						$(this).remove();
					});
					$(".accordion").accordion({
						heightStyle: "content",
						collapsible: true
					});
				}
				 //document.location.hash
				// changes accordions to tabs (jquery ui)
				function accordionsToTabs(){
					if($(".accordion").length){
						$(".accordion").each(function(){
							var e=$('<div class="tabs">');
							var t=0;
							var n=$("<ul>");
							$.each($(this).find(">h3"),function(i){
								n.append('<li><a href="#tabs-'+i+'">'+$(this).text()+"</a></li>");
							});
							t=0;
							var r=$("");
							$(this).find(">div").each(function(){
								t++;
								r=r.add('<div id="tabs-'+t+'">'+$(this).html()+"</div>");
							});
							e.append(n).append(r);
							$(this).before(e);
							$(this).remove();
						});
						initalize_tabs();
					}
				}
				function updateUI(){
					if($(window).width() <= 480){
						tabsToAccordions();
					} else {
						accordionsToTabs();
					}
				}
			
				function applyTabToAccordion(){	
					// event handler for window resize
					$(window).resize(function(){//e){
						updateUI();
					});
					updateUI();
				}*/
			
				
				if($( "#sub_tabs" ).length>0){
					$( "#sub_tabs" ).tabs();
				}
				if($( ".sub_tabs" ).length>0){
					$( ".sub_tabs" ).each(function(){
						$(this).tabs();
					});
				}
				
				function initalize_tabs(){
					var  taboptions={};
					
					$(".tabs").each(function(){
						var target = $(this);
						var areaId = target.closest('.tabedArea').attr('id');
						var activeTab = $.cookie('tabs'+areaId);
						target.tabs($.extend( taboptions, WSU_MAP.admin.defaults.place_id===0?{ disabled: [3] }:{}, {
							active: activeTab||0,
							create: function(){//event, ui) {
								if($('#place_id').length){
									tinyMCE.triggerSave();
									WSU_MAP.admin.ui.tinymce.tinyResize();
								}
								WSU_MAP.admin.lists.pagLoad();
								WSU_MAP.admin.lists.setInfoSlide();
							},
							activate: function( event, ui ) {
								$.cookie('tabs'+areaId, ui.newTab.index(), {expires: 1, path: '/'+WSU_MAP.state.view+WSU_MAP.state.mcv_action+'.castle' });
							}
						 } ));
					});
				}
				if($(".tabs").length>0){
					initalize_tabs();
					//applyTabToAccordion();
				}else{
					WSU_MAP.admin.lists.setInfoSlide();	
				}
				if($("#tabs").length>0){
					$("#tabs").tabs();
					//applyTabToAccordion();
				}
				if( (WSU_MAP.admin.defaults.place_id===0) ){
					if($( "#chooseModel" ).length===0){
						$( "body" ).append('<div id="chooseModel" title="Choose the place model">'+
						'<p><strong>Choose a model </strong>'+
						'that the place will be.  This will set forth all the options it can have.'+
						'<br/><select name="set_model" id="set_model">'+
						$('#LocationModelSelect').clone().html()+
						'</select></div>');
					}
					$("#chooseModel").dialog({
						autoOpen: true,
						height: 275,
						width:350,
						modal: true,
						hide: 'blind',
						resizable: false,
						draggable: false,
						buttons: {
							"Ok": function() {
								if($('#set_model :selected').val() !==''){
									$( this ).dialog( "close" );
									if($( "#loading_tmp" ).length===0){
											$( "body" ).append('<div id="loading_tmp" title="Loading">'+
											'<img src="/Content/images/loading.gif" style="margin: 0 auto; display:block;" />'+
											'</div>');
										}
										$( "#loading_tmp" ).dialog({
											autoOpen: true,
											height: 155,
											width:125,
											modal: true,
											hide: 'blind',
											resizable: false,
											draggable: false
										});
										WSU_MAP.admin.lists.post_tmp($('#editor_form'),$( "#loading_tmp" ),function(){});
								}else{
									$('#set_model').next('.ui-autocomplete-input').css({'box-shadow':'0px 0px 10px 0px #f00'}).addClass('errored');
								}
			
							}
							
						}
					});
					$('#set_model').combobox();
					$('#set_model').next('.ui-autocomplete-input').on('change',function(){
						if($('#set_model :selected').val() !==''){
							if($('#set_model').next('.ui-autocomplete-input').is('errored')){ // changed hasClass for is for speed
								$('#set_model').next('.ui-autocomplete-input').css({'box-shadow':'0px 0px 10px 0px #23b618'}).removeClass('errored');
							}
						}else{
							$('#set_model').next('.ui-autocomplete-input').css({'box-shadow':'0px 0px 10px 0px #f00'}).addClass('errored');
						}
						$("#LocationModelSelect option[value='"+$('#set_model :selected').val()+"']").attr("selected","selected");
						$("#LocationModelSelect").next('input').val($('#set_model :selected').text());
					});
				}  
			
				
			
			
				$('[name="ele.type"]').not('#style_of').change(function(){
					if($('[name="ele.type"] :selected').val()==="dropdown"){
						$('#optionsSelection').slideDown('fast');
						$('#optionsSelectionDefaults').slideUp('fast');
					}else{
						$('#optionsSelection').slideUp('fast');
			
						$('#optionsSelectionDefaults').slideDown('fast');
						$('#ops').html('');
					}
				});
				$("#ele_attr_multiple").on("change",function(){
					if($("#ele_attr_multiple:checked").length){
						$('.pod [type=radio]:checked').attr("checked",false);
						$('.pod [type=checkbox]:checked').attr("checked",false);
						$('.pod [type=radio]').hide();
						$('.pod [type=checkbox]').show();
					}else{
						$('.pod [type=radio]:checked').attr("checked",false);
						$('.pod [type=checkbox]:checked').attr("checked",false);
						$('.pod [type=radio]').show();
						$('.pod [type=checkbox]').hide();
					}
				});
				$('.pod [type=radio]').on("change",function(){
					$('.pod :checked').attr("checked",false);
					$(this).attr("checked",true);
				});
				$('.pod .opVal').on("change",function(){
					$(this).siblings('[type=radio]').val($(this).val());
					$(this).siblings('[type=checkbox]').val($(this).val());
				});
			
				$('#addOption').on('click',function(e){
					WSU_MAP.util.nullout_event(e);
					i=$('#ops .pod').size();
					$('#ops').append($('#option_clonebed').html().replace(/[9]{4}/g, (i>-1?i:i+1) ) );
				});
				$('.deleteOption').on('click',function(e){
					WSU_MAP.util.nullout_event(e);
					var tar = $(this).closest('.pod');
					var tarParent = tar.closest('.podContainer');
					tar.remove();
					tarParent.find('.pod').each(function(i){
						$(this).find('input').each(function(){//j){
							$(this).attr('name',$(this).attr('name').replace(/[\d+]/g, (i>-1?i:i+1)) );
						});
					});
				});
			
			
				if($( ".datepicker.optionsA" ).length>0){
					$( ".datepicker.optionsA" ).each(function(){
						$(this).datetimepicker({
							showOtherMonths: true,
							selectOtherMonths: true,
							changeMonth: true,
							changeYear: true,
							showButtonPanel: true,
							showAnim:"fold",
							dateFormat: 'mm/dd/yy',
							ampm: true,
							hourGrid: 4,
							minuteGrid: 10,
							onClose: function(dateText){//, inst) {
								//auto take off a null time.. ie if left at midnight, it's not wanted.
								if (dateText.indexOf('00:00')!==-1||dateText.indexOf('12:00 AM')!==-1||dateText.indexOf('12:00 am')!==-1){
									var temp = dateText.split(' ');
									$(this).val(temp[0]);
								}
							}
						});
					});
				}
			
			
			
			
				
			
			
			
				
			
			
			  
			
			
			/* -----------
				for stories
				---------------- */
			
				/* for place listings */
				
					if($('.fliterList').length>0){
						$(".fliterList").on('change',function () {
							window.location = WSU_MAP.state.siteroot+WSU_MAP.state.view+"list.castle?searchId="+$(this).find(':selected').val(); 
						});
					}
				
					$( "#dialog" ).dialog({
						autoOpen: false,
						height: 165,
						width: 440,
						modal: true,
						hide: 'blind',
						resizable: false,
						draggable: false,
						buttons: {
							"Draft": function() {
								var diaObj=$(this);
								WSU_MAP.admin.loadState(1,WSU_MAP.admin.defaults.place_id,diaObj);
							},
							"Review": function() {
								var diaObj=$(this);
								WSU_MAP.admin.loadState(2,WSU_MAP.admin.defaults.place_id,diaObj);
			
							},
							"Published": function() {
								var diaObj=$(this);
								WSU_MAP.admin.loadState(3,WSU_MAP.admin.defaults.place_id,diaObj);
							},
							Cancel: function() {
								$( ".buttons.pubState" ).removeClass('ui-state-focus'); 
								$( this ).dialog( "close" );
							}
						}
					});
					$( ".pubState" ).on('click',function(e) {
						WSU_MAP.util.nullout_event(e);
						WSU_MAP.admin.defaults.place_id=$(this).closest('.place_aTar').attr('title');
						$( "#dialog" ).dialog( "open" );
					});
			
			
					if($('#sendBR').length===0){
						$('body').append('<div id="sendBR" title="Send" style="display:none;"><p>Release the Place out in email<br/><strong>Note:</strong>If You don\'t want to over use this.</p></div>');
					}
					$( "#sendBR" ).dialog({
						autoOpen: false,
						height: 165,
						width: 440,
						modal: true,
						hide: 'blind',
						resizable: false,
						draggable: false,
						buttons: {
							"Send": function() {
								var diaObj=$(this);
								WSU_MAP.admin.sendBr(WSU_MAP.admin.defaults.place_id,diaObj);
							},
							Cancel: function() {
								$( ".buttons.sendBR" ).removeClass('ui-state-focus'); 
								$( this ).dialog( "close" );
							}
						}
					});
					$( ".sendBR" ).on('click',function(e) {
						WSU_MAP.util.nullout_event(e);
						WSU_MAP.admin.defaults.place_id=$(this).closest('.place_aTar').attr('title');
						$( "#sendBR" ).dialog( "open" );
					});
			
			
			
			
					
			
					
			
				/* for place editing */
			
				var availableTags = [
						"Food",
						"Fun",
						"Facts",
						"Foo",
						"Far",
						"From"
					];
					$( "#place_Location" ).autocomplete({
						source: availableTags
					});
				
				if($('.imagedropDown').length>0){
					$(".imagedropDown").on('change',function () {
						if( $(this).closest('div').find(".selectedImage").length===0 ){
							$(this).closest('div').append('<img src="" class="selectedImage" width="100" />');
						}
						$(this).closest('div').find(".selectedImage").attr('src', WSU_MAP.state.siteroot+'media/download.castle?id=' + $(this).val());
					});
				}
				
			
			
				if($('.addImage').length>0){
					$(".addImage").on('click',function () {
						$.get(WSU_MAP.state.siteroot+WSU_MAP.state.view+'GetAddImage.castle?count='+image_count, function(data){
							$('#ExistingImagesDiv').append(data);
							++image_count;
						});
					});
				}
				if($('.deleteAuthor').length>0){
					$('.deleteAuthor').on('click',function(){
						var author_id = $(this).attr('title');
						var PlaceId = $(this).attr('rel');
						WSU_MAP.admin.alertLoadingSaving();
						$.get(WSU_MAP.state.siteroot+WSU_MAP.state.view+'DeleteAuthor.castle?id='+author_id+'&placeId='+PlaceId, function(){//data){
							 $("div#AuthorDiv #div" + author_id).remove();
							window.setTimeout(WSU_MAP.admin.removeAlertLoadingSaving(),1500);
						});
					});
				}
				if($('.DeleteTag').length>0){
					$('.DeleteTag').on('click',function(){
						var PlaceId = $(this).attr('title');
						var tag_id = $(this).attr('rel');
						WSU_MAP.admin.alertLoadingSaving();
						$.get(WSU_MAP.state.siteroot+WSU_MAP.state.view+'DeleteTag.castle?id='+tag_id+'&placeId='+PlaceId, function(){//data){
							$("#tag_"+ tag_id).closest('li').remove();
							window.setTimeout(WSU_MAP.admin.removeAlertLoadingSaving(),1500);
						});
					});
				}
			
			
			   // $(".imagedropDown").change(function (){
			   //      $(".selectedImage",$(this).parent()).attr('src','media/download.castle?id=' + $(this).val());});	   
			   //  });
				/* for place listings */
				if($('#clearLock').length===0){
					$('body').append('<div id="clearLock" title="Clear Place Editing Lock" style="display:none;"><p>Release the Place for editing<br/><strong>Note:</strong>If some one is editing it you may wish to ask to make sure they are done.</p></div>');
					}
					$( "#clearLock" ).dialog({
						autoOpen: false,
						height: 165,
						width: 440,
						modal: true,
						hide: 'blind',
						resizable: false,
						draggable: false,
						buttons: {
							"Steal": function() {
								var diaObj=$(this);
								WSU_MAP.admin.clearLock(WSU_MAP.admin.defaults.place_id,diaObj);
							},
							Cancel: function() {
									$( ".buttons.steal" ).removeClass('ui-state-focus'); 
									$( this ).dialog( "close" );
							}
						}
					});
			
					$( ".steal" )
						.on('click',function(e) {
						WSU_MAP.util.nullout_event(e);
						WSU_MAP.admin.defaults.place_id=$(this).attr('rel');
						$( "#clearLock" ).dialog( "open" );
					});
					
			
			
			/* -----------
				for persons(Editors)
				---------------- 
				if(window._defined(availablePositions)){
					$( "#person_position" ).autocomplete({
						source: availablePositions
					});
				}*/
			
			
			
			/* -----------
				for adverts
				---------------- */
				if($('#add_ad_image').length>0){
					$("#add_ad_image").on('click',function () {
						$.get(WSU_MAP.state.siteroot+WSU_MAP.state.view+'GetAddImage.castle?count='+image_count, function(data){
							$('#NewImageHolderDiv').html($('#NewImageHolderDiv').html()+ data);
							++image_count;
						});
					});
				}
	
				
				
				
				
				
			},
			setGeoCoder:function (){
				var geocoder = geocoder||new google.maps.Geocoder();
				return geocoder;
			},
			loadState:function (stat,place_id,diaObj){
				$.ajaxSetup ({cache: false}); 
				var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
			
				$.get(WSU_MAP.state.siteroot+WSU_MAP.state.view+'setStatus.castle?id='+place_id+'&status='+stat , function(response) {//, status, xhr) {
					var statIs = $("<div>").append(response.replace(rscript, "")).find('.place_'+place_id+' .Status div');
					$('body .place_'+place_id+' .Status').empty().append(statIs.html());
					$('body li.place_'+place_id).clone().prependTo('.list_'+stat);
					$('body li.place_'+place_id).not('.list_'+stat+' li.place_'+place_id+':first').remove();
					$( ".buttons.pubState" ).removeClass('ui-state-focus').removeClass('ui-state-hover'); 
					$( "#dialog .buttons" ).removeClass('ui-state-focus').removeClass('ui-state-hover'); 
					diaObj.dialog( "close" );	
				});                       
			},
			/* 
			 * DEFAULT_overlay=apply_element(map,type,_option);  << that needs fixed
			 * with paths: get_wsu_logo_shape(), as option
			 * TODO besides listed above is circle and rec and marker
			 */
			set_default_shape:function (type,op){
				var capedType=type.charAt(0).toUpperCase() + type.slice(1);
				op=op||{};
				var return_item;
				var DEFAULT_overlay;
				var default_paths = WSU_MAP.admin.defaults.get_wsu_logo_shape();
				var _option={};
				switch(type){
					case "polygon" :
						// default ploygon style
							_option = {
									rest:{
										options:$.extend(op.rest||{strokeColor: "#5f1212",strokeOpacity:0.24,strokeWeight: 2,fillColor: "#5f1212",fillOpacity: 0.24},
												{ paths: default_paths })
									},
									mouseover:{
										options:op.mouseover||{fillColor: "#a90533",fillOpacity: 0.35}
									},
									mouseout:{
										options:op.mouseout||{fillColor: "#a90533",fillOpacity: 0.35}
									},
									click:{
										options:op.click||{fillColor: "#a90533",fillOpacity: 0.35}
									}
								};
							DEFAULT_overlay=WSU_MAP.admin.apply_element(capedType,_option);
			
							return_item=DEFAULT_overlay;
						break;
					case "rectangle" :
							return_item=null;
						break;
					case "circle" :
							return_item=null;
						break;			
					case "polyline" :
						// default ploygon style
						var DEFAULT_polylines = [];
						var polyline = WSU_MAP.admin.get_wsu_logo_shape();
						$.each(polyline,function(i){
							_option = {
								rest:{
									options:$.extend(op.rest||{strokeColor: "#5f1212",strokeOpacity: 0.24,strokeWeight: 2},{path: polyline[i]})
								},	
								mouseover:{
									options:op.mouseover||{strokeColor: "#a90533",strokeOpacity: 0.35}
								},	
								mouseout:{
									options:op.mouseout||{strokeColor: "#a90533",strokeOpacity: 0.35}
								},	
								click:{
									options:op.click||{strokeColor: "#a90533",strokeOpacity: 0.35}
								}
							};
							DEFAULT_overlay=WSU_MAP.admin.apply_element(capedType,_option);
							DEFAULT_polylines.push(DEFAULT_overlay);
							google.maps.event.addListener(DEFAULT_overlay,"mouseover",function (){
								$.each(DEFAULT_polylines,function(i){
									DEFAULT_polylines[i].setOptions({strokeColor: "#a90533"}); 
								});
							});  
							google.maps.event.addListener(DEFAULT_overlay,"mouseout",function (){
								$.each(DEFAULT_polylines,function(i){
									DEFAULT_polylines[i].setOptions({strokeColor: "#5f1212"}); 
								});
							});
						});
	
						/*_option = {path:[
							new google.maps.LatLng("46.732537","-117.160091"),
							new google.maps.LatLng("46.732596","-117.146745")
							]
						,strokeColor: "#5f1212",strokeOpacity:1,strokeWeight:10};
						WSU_MAP.admin.apply_element(capedType,_option);*/
	
							return_item=polyline;
						break;				
					case "marker" :
							return_item=null;
						break;
				}
				return return_item;
			},
			
			
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
			filter_map_element:function (type,op){
				if( !window._defined(op) ){
					return;
				}
				var _op={};
				window._defined(op.clickable)		?_op.clickable=op.clickable:null;
				window._defined(op.visible)		?_op.visible=op.visible:null;
				window._defined(op.zIndex)		?_op.zIndex=op.zIndex:null;
				
				switch(type.toLowerCase()){
					case "polygon" :
								window._defined(op.editable) 		?_op.editable=op.editable:null;
								window._defined(op.geodesic)		?_op.geodesic=op.geodesic:null;
								window._defined(op.paths)			?_op.paths=op.paths:null;
								window._defined(op.strokeColor)		?_op.strokeColor=op.strokeColor:null;
								window._defined(op.strokeOpacity)	?_op.strokeOpacity=op.strokeOpacity:null;
								window._defined(op.strokeWeight)	?_op.strokeWeight=op.strokeWeight:null;
								window._defined(op.fillColor)		?_op.fillColor=op.fillColor:null;
								window._defined(op.fillOpacity)		?_op.fillOpacity=op.fillOpacity:null;
						break;
					case "rectangle" :
								window._defined(op.editable)		?_op.editable=op.editable:null;
								window._defined(op.bounds)			?_op.bounds=op.bounds:null;
								window._defined(op.strokeColor)		?_op.strokeColor=op.strokeColor:null;
								window._defined(op.strokeOpacity)	?_op.strokeOpacity=op.strokeOpacity:null;
								window._defined(op.strokeWeight)	?_op.strokeWeight=op.strokeWeight:null;
								window._defined(op.fillColor)		?_op.fillColor=op.fillColor:null;
								window._defined(op.fillOpacity)		?_op.fillOpacity=op.fillOpacity:null;
						break;
					case "circle" :
								window._defined(op.editable)		?_op.editable=op.editable:null;
								window._defined(op.center)			?_op.center=op.center:null;
								window._defined(op.radius)			?_op.radius=op.radius:null;
								window._defined(op.strokeColor)		?_op.strokeColor=op.strokeColor:null;
								window._defined(op.strokeOpacity)	?_op.strokeOpacity=op.strokeOpacity:null;
								window._defined(op.strokeWeight)	?_op.strokeWeight=op.strokeWeight:null;
								window._defined(op.fillColor)		?_op.fillColor=op.fillColor:null;
								window._defined(op.fillOpacity)		?_op.fillOpacity=op.fillOpacity:null;
						break;			
					case "polyline" :
								window._defined(op.editable)		?_op.editable=op.editable:null;
								window._defined(op.geodesic)		?_op.geodesic=op.geodesic:null;
								window._defined(op.path)			?_op.path=op.path:null;
								window._defined(op.strokeColor)		?_op.strokeColor=op.strokeColor:null;
								window._defined(op.strokeOpacity)	?_op.strokeOpacity=op.strokeOpacity:null;
								window._defined(op.strokeWeight)	?_op.strokeWeight=op.strokeWeight:null;
						break;				
					case "marker" :
								window._defined(op.animation)		?_op.animation=op.animation:null;
								window._defined(op.cursor)			?_op.cursor=op.cursor:null;
								window._defined(op.draggable)		?_op.draggable=op.draggable:null;
								window._defined(op.flat)			?_op.flat=op.flat:null;
								window._defined(op.icon)			?_op.icon=op.icon:null;
								window._defined(op.optimized)		?_op.optimized=op.optimized:null;
								window._defined(op.position)		?_op.position=op.position:null;					
								window._defined(op.raiseOnDrag)		?_op.raiseOnDrag=op.raiseOnDrag:null;					
								window._defined(op.shadow)			?_op.shadow=op.shadow:null;	
								window._defined(op.shape)			?_op.shape=op.shape:null;						
								window._defined(op.title)			?_op.title=op.title:null;	
						break;
				}
				return _op;
			},
			clearLock:function (item_id,diaObj,callback){
				$.ajaxSetup ({cache: false,async:false}); 
				//var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
				$.get(WSU_MAP.state.siteroot+WSU_MAP.state.view+'clearLock.castle?id='+item_id, function(response) {//, status, xhr) {
					if(response==='true'){
						if(window._defined(diaObj) && diaObj!==''){
							$('body li.item_'+item_id).find('.inEdit').fadeOut('fast',function(){
								$('body li.item_'+item_id).find('.inEdit').remove();
							});
							$('body li.item_'+item_id).find('.UinEdit').fadeOut('fast',function(){
								$('body li.item_'+item_id).find('.UinEdit').remove();
							});
							$( ".buttons.steal" ).removeClass('ui-state-focus').removeClass('ui-state-hover');
							$( "#clearLock .buttons" ).removeClass('ui-state-focus').removeClass('ui-state-hover');
							$('body li.item_'+item_id).find('.buttons.editIt').attr('href','_edit.castle?id='+item_id);
							diaObj.dialog( "close" );	
						}
						if($.isFunction(callback)){
							callback();
						}
					}
				});                       
			},
			sendBr:function (place_id,diaObj){
				$.ajaxSetup ({cache: false}); 
				//var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
				$.get(WSU_MAP.state.siteroot+WSU_MAP.state.view+'end_breaking_single.castle?id='+place_id , function(response) {//, status, xhr) {
					diaObj.dialog( "close" );
					if(response!=='true'){
						WSU_MAP.admin.alertLoadingSaving(response);
					}else{
						WSU_MAP.admin.alertLoadingSaving('Emails sent');
						window.setTimeout(WSU_MAP.admin.removeAlertLoadingSaving(),1500);
					}
				});                       
			},
			apply_element:function (type,style){
				
				var rest_shape = WSU_MAP.admin.filter_map_element(type,style.rest.options);
				WSU_MAP.state.map_jObj.gmap('addShape', type, rest_shape, function(shape){
					$(shape).click(function(){
						if(style.click){
							if(style.click.options){
								WSU_MAP.state.map_jObj.gmap('setOptions',WSU_MAP.admin.filter_map_element(type,style.click.options),this);
							}
							if(style.click.callback){
								style.click.callback();
							}
						}
					 }).mouseover(function(){
						 if(style.mouseover){
							 if(style.mouseover.options){
								 WSU_MAP.state.map_jObj.gmap('setOptions',WSU_MAP.admin.filter_map_element(type,style.mouseover.options),this);
							 }
							 if(style.mouseover.callback){
								 style.mouseover.callback();
							 }
						 }
					}).mouseout(function(){
						if(style.rest){
							if(style.rest.options){
								WSU_MAP.state.map_jObj.gmap('setOptions',WSU_MAP.admin.filter_map_element(type,style.rest.options),this);
							}
							if(style.rest.callback){
								style.rest.callback();
							}
						}
					}).dblclick(function(){
						if(style.dblclick){
							if(style.dblclick.options){
								WSU_MAP.state.map_jObj.gmap('setOptions',WSU_MAP.admin.filter_map_element(type,style.dblclick.options),this);
							}
							if(style.dblclick.callback){
								style.dblclick.callback();
							}
						}
					})
					.trigger('mouseover')
					.trigger('mouseout');
					
					//var placePos = mapOjb.gmap("get_map_center");
					
					if( window._defined(shape) ){
						//mapOjb.gmap("move_shape",shape,placePos);
					}
					/*,
					.rightclick(function(){ //maybe keep but most likely lose this
						if(style.rightclick){
							if(style.rightclick.options)WSU_MAP.state.map_inst.setCenter(filter_map_element(type,style.rightclick.options),this);
							if(style.rightclick.callback)style.hover.callback();
						}
					})*/
					
				});
	
			},
	//WSU_MAP.admin.ini();
		}
	});
	
	
	$.extend( WSU_MAP.admin, {
		editors : {
			place:{},
			geometrics:{},
			media:{}
		},
	});

})(jQuery,window,jQuery.wsu_maps||(jQuery.wsu_maps={}));