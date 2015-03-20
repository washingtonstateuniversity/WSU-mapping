// JavaScript Document
(function($) {
	$.wsu_maps.admin.editors.view = {
		ini:function(){},
		defaults:{
		},
		createDeleteRow:function (){
			$('.tiny.buttons.deleteplace').off().on('click',function(e){
				e.stopPropagation();
				e.preventDefault();
				var container = $(this).closest('ol.sortable');
				var role=container.closest('fieldset').attr('role');
				var val=$(this).closest('li').find('input').val();
				$('select#'+role+'_select [value="'+val+'"]').removeAttr('disabled');
				$(this).closest('li').remove();
				container.nestedSortable("refresh");
				
				
				//$('jspContainer').css('height','auto');
				$.each($.wsu_maps.state.api,function(index,item){
					item.reinitialise();
				});
				
				$.wsu_maps.shapes.reloadShapes();
				$.wsu_maps.places.reloadPlaces();
				if(container.find('.ini').length===0 && container.find('li').size()===0){
					container.append('<li class="ini"><div><h5>Add '+container.closest('fieldset').find('legend span').text()+' from below</h5</div></li>');
				}
				$("select#"+role+"_select").jselect('refresh');
			});
		},
	};
$.wsu_maps.admin.view = {
	status:{
		loaded_options:false
	},
	load_editor:function () {
		//$.wsu_maps.state.api = null;
		$.wsu_maps.state.map_jObj=$('#place_drawing_map');
		$("#side_tabs").tabs({
			active:$("#side_tabs .ui-tabs-nav li").is('.ui-state-active')?$("#side_tabs .ui-tabs-nav li").index($(".ui-state-active")):false,
			collapsible: true,
			heightStyle: "content",
			hide:{ effect: 'slide', direction: 'right', duration: 300 },
			show:{ effect: 'slide', direction: 'right', duration: 300 },
			activate:function(){
				$(window).trigger("resize");
			}
		});
		$(window).resize(function(){
			$.wsu_maps.responsive.resizeBg($.wsu_maps.state.map_jObj,112);
			$.wsu_maps.responsive.resizeMaxBg($('#side_tabs .ui-tabs-panel'),250);
		}).trigger("resize");
		

		
		$('.codeurllink').on('click',function(){
			window.open($(this).prev('.codeurl').text());
		});
		
		$.wsu_maps.admin.setup_massTags();
		$.wsu_maps.admin.view.init_alaisChecker();		
		$.wsu_maps.admin.view.init_editorMap();

		$.wsu_maps.admin.view.init_mapItemLists();
		
		//$('select#placeShape').on('change',function(){
		//	reloadShapes()
		//});	
		$.wsu_maps.admin.editors.place.int_infotabs();
		//$.wsu_maps.admin.ui.tinymce.tinyResize();
	
		//$.wsu_maps.admin.setup_fixedNav();
		
		$('#shortcode').click(function(e){
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
		$('#width').on('keyup',function(){
			$('.widthOutput').text($(this).val());
		});
		$('#height').on('keyup',function(){
			$('.heightOutput').text($(this).val());
		});
		/*
		$('[href$="guidelines/dimensions.aspx"]').on('click',function(e){
			e.stopPropagation();
			e.preventDefault();
			$("<div>").load($(this).attr('href')+' #main',function(data){
				$.colorbox({html:data});
			});
		});
		*/
		
		
		
		
		
		
		
	},
	init_alaisChecker:function(){
		var waiting = false;
		var starting_alias = $('#urlAlias').val();
		$('#urlAlias').on('keyup',function(){
			var val = $(this).val().replace(/[^a-zA-Z0-9-_]/g, '-'); 
			if(!waiting && val!==""){
				waiting = true;
				//$.post('/view/aliasCheck.castle?alias='+val, function(data) {
				$.post('/admin/checkAlias.castle?alias='+val+'&typeName='+$.wsu_maps.state.view.replace("/",""), function(data) {
					if(data==="true" && val!==starting_alias){
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
	},
	create_ui_mapobj:function(){
		var lat = $('#Lat').val();
		var lng = $('#Long').val();	
		//var width = $('#width').val();
		//var height = $('#height').val();
		var options = {
			center: (typeof(lat)==='undefined' || lat==='')? $.wsu_maps.state.campus_latlng_str : new google.maps.LatLng(lat,lng) ,
			zoom:$.wsu_maps.defaults.map.zoom,
			styles:$.wsu_maps.defaults.map.styles
		};
		//var options = {'center': (typeof(lat)==='undefined' || lat=='')? $.wsu_maps.state.campus_latlng_str : new google.maps.LatLng(lat,lng) , 'zoom':15};
		if( $.wsu_maps.admin.view.loaded_options !==false || ( $('#runningOptions').html()==="{}"||$('#runningOptions').html()==="" )){
			$.each($('select,input,textarea','#tabs_Options'),function(){//i,v){
				var tmpVal = $(this).val();
				var tmp = {};
				if(tmpVal!==""){
					if($.wsu_maps.util.isNumber(tmpVal)){
						tmpVal=parseFloat(tmpVal);
						if(tmpVal>0){
							tmp[$(this).attr("id")]=tmpVal;
							options=$.extend(options,tmp);
						}
					}else{
						tmpVal = tmpVal.toLowerCase() === 'true' || (tmpVal.toLowerCase() === 'false' ? false : ($(this).attr("id")==="mapTypeId"?tmpVal.toLowerCase():tmpVal) );
						tmp[$(this).attr("id")]= tmpVal;
						options=$.extend(options,tmp);
					}
				}
			});	
		}else{
			var jsonStr = $('#runningOptions').html();
			var base = base || {};
			//var mapType = jsonStr.replace(/.*?(\"mapTypeId\":"(\w+)".*$)/g,"$2");
			jsonStr = jsonStr.replace(/("\w+":\"\",)/g,'').replace(/(\"mapTypeId\":"\w+",)/g,'');
			if(jsonStr!==""){
				$.extend(options,base,$.parseJSON(jsonStr));
			}
			//alert(dump(options));
			//$(this).val().replace(/[^a-zA-Z0-9-_]/g, '-'); 
		}
		$.wsu_maps.admin.view.status.loaded_options=options;
		console.log(options);
		return options;
	},
	init_editorMap:function(){
		var new_map = $.wsu_maps.admin.view.status.loaded_options === false;
		console.log(new_map);
		var options = $.wsu_maps.admin.view.create_ui_mapobj();
		if(!new_map){
			$.wsu_maps.state.map_jObj.gmap('setOptions',options);
		}else{
			$.wsu_maps.state.map_jObj.gmap(options).bind('init', function () {
				$.wsu_maps.state.map_inst = $.wsu_maps.state.map_jObj.gmap('get','map');
				//alert(dump(options));
				//if(lat!='')add_place_point(lat,lng);
				//autoUpdate($("#editor_form"),{before:function(){tinyMCE.triggerSave();},changed:function(){infoUpdate();}});
				//$("#editor_form").autoUpdate({before:function(){tinyMCE.triggerSave();},changed:function(){infoUpdate();}});
				google.maps.event.addListener($.wsu_maps.state.map_inst, 'drag',function(){
					var center = $.wsu_maps.state.map_jObj.gmap('get_map_center');
					//$.wsu_maps.state.map_jObj.gmap('setOptions',{center},$.wsu_maps.state.map_inst);
					$('#Lat').val( center.lat() );//var lat = 
					$('#Long').val( center.lng() );//var lng = 
				});
				google.maps.event.addListener($.wsu_maps.state.map_inst, 'zoom_changed',function(){
					var zoomLevel = $.wsu_maps.state.map_inst.getZoom();
					$('#zoom').val( zoomLevel );//var zoom = 		
				});
				$.wsu_maps.shapes.reloadShapes();
				$.wsu_maps.places.reloadPlaces();
				$('select,input,textarea','#tabs_Options').on('change',function(){
					var targ = $(this);
					var t = setTimeout(function(){
						window.clearTimeout(t);
						t=null;
						
					
						if(targ.is("[id='maxZoom']")){
							var maxZoom = $.wsu_maps.state.map_jObj.gmap('get_maxZoom');
							$("input[id='maxZoom']").after("<span id='maxZoomNotice'>Note: Max zoom for this map style is "+ maxZoom +" and will only be able to go lower if the user is able to switch map types.</span>");
						}

						$.wsu_maps.admin.view.init_editorMap();
					},500);
				});
				$.wsu_maps.util.debug_positional_log();
				$(window).resize(function(){
					if( $.wsu_maps.state.fit_to_bound !== false ){
						$.wsu_maps.fit_to_location(window.map_view.fit_to_bound);
					}
					$.wsu_maps.keep_center();
				}).trigger("resize");
				$.wsu_maps.on_zoom_corrections();
				$.wsu_maps.on_pan_corrections();
				$.wsu_maps.on_bounds_changed_corrections();
				
				
				
				
			})/*.resizable({
				helper: "ui-resizable-helper",
				stop: function(event, ui) {
					//var width = $('#width').val(ui.size.width);
					//var height = $('#height').val(ui.size.height);
					
					$('.widthOutput').text(ui.size.width);
					$('.heightOutput').text(ui.size.height);
					$.wsu_maps.state.map_jObj.gmap('refresh');
				}
			})*/;
			
		}
		
		
		
		
		
		$('#dragCenter').on('change',function(){
			if($(this).is(":checked")){
				$.wsu_maps.state.map_jObj.gmap('setOptions',{"draggable":true});
			}else{
				$.wsu_maps.state.map_jObj.gmap('setOptions',{"draggable":$('#draggable').is(":checked")});
			}
		});
			
		$('#setZoom').on('change',function(){
			if($(this).is(":checked")){
				$.wsu_maps.state.map_jObj.gmap('setOptions',{"scrollwheel":true});
			}else{
				$.wsu_maps.state.map_jObj.gmap('setOptions',{"scrollwheel":$('#scrollwheel').is(":checked")});
			}
		});
	},
	init_mapItemLists:function(){
		//if($('.onfliterList').length>0){}
		//if($('.onfliterList').length>0){}
		$(".onfliterList").on('change',function () {
			var self=$(this);
			var role = self.closest('fieldset').attr('role');
			if(self.val()===""){
				self.closest('fieldset').find('.subFilter').hide();
				self.closest('fieldset').find('.mainFilter').hide();
				$('body').spine("equalizing");
			}else{
				$.getJSON($.wsu_maps.state.siteroot+"public/get_"+self.val()+"_list.castle?callback=?",function(data){
					if(data==="false"){
						alert("false");
						$.colorbox({
							html:function(){
								return '<div id="errorReporting"><h2>Error</h2><h3>It seems there was nothing returned.</h3></div>';
							},
							scrolling:false,
							opacity:0.7,
							transition:"none",
							open:true,
							onComplete:function(){
								$.wsu_maps.general.prep_html();
								$.colorbox.resize();
							}
						});
						return false;
					}
					self.closest('fieldset').find('.onsubfliterList').html(function(){
						var str="<option value=''>All</option>";
						$.each(data,function(i,v){
							str += "<option value='"+v.id+"'>"+v.name+"</option>";
						});
						return str;
					}).attr('role',self.val());
					if(self.val().indexOf("all_")>-1 || self.val().indexOf("authors_")>-1){
						self.closest('fieldset').find('.subFilter').hide();	
						self.closest('fieldset').find('.finFill').html(function(){
							var str="<option value=''>Select a "+role+"</option>";
							$.each(data,function(i,v){
								var name = typeof(v.prime_name)==="undefined"?v.name:v.prime_name;
								str += "<option value='"+v.id+"' "+($('.list_'+role+'[value="'+v.id+'"]').length>0?" disabled='disabled'":"")+">"+name+"</option>";
							});
							self.closest('fieldset').find('.mainFilter').show();
									
							return str;
						});
						self.closest('fieldset').find('.finFill').jselect({
							multiple: true,
							minWidth: 150,
							//height: '105px',
							noneSelectedText:'Select '+role+'s and then click add',
							selectedText: function(numChecked, numTotal){//, checkedItems){
								return numChecked + ' of ' + numTotal + ' checked';
							},
							selectedList: false,
							//show: ['blind', 200],
							//hide: ['fade', 200],
							position: {
								my: 'left top',
								at: 'left bottom'
							}
						});
					}else{
						self.closest('fieldset').find('.subFilter').show();	
					}
					$('body').spine("equalizing");
				});
			}
		});

		$(".onsubfliterList").on('change',function () {
			var self=$(this);
			var role = self.closest('fieldset').attr('role');
			var list = self.closest('fieldset').find('.finFill');
			$.getJSON($.wsu_maps.state.siteroot+"public/get_"+self.closest('fieldset').attr('role')+"_list_attr.castle?callback=?",{'id':self.val(),'by':self.attr('role')},function(data){
				list.html(function(){
					var str="";//"<option value=''>Select a "+self.closest('fieldset').attr('role')+"</option>";
					$.each(data,function(i,v){
								var name = typeof(v.prime_name)==="undefined"?v.name:v.prime_name;
								var image = typeof(v.staticMap)!=="undefined"?"data-image='/media/getmap.castle?path="+v.staticMap+"'":"";
								str += "<option value='"+v.id+"' "+($('.list_'+role+'[value="'+v.id+'"]').length>0?" disabled='disabled'":"")+" "+image+" >"+name+"</option>";
					});
					self.closest('fieldset').find('.mainFilter').show();
					return str;
				});
				self.closest('fieldset').find('.finFill').jselect({
					multiple: true,
					minWidth: 150,
					menuWidth:"100%",
					menuMaxWidth:500,
					//height: '105px',
					noneSelectedText:'Select '+role+'s and then click add',
					selectedText: function(numChecked, numTotal, availableItems){//, checkedItems){
						return numChecked + ' of ' + availableItems + ' available';
					},
					//selectedList: false,
					//show: ['blind', 200],
					//hide: ['fade', 200],
					position: {
						my: 'left top',
						at: 'left bottom'
					},
					open:function(){
						$('.jselect-menu:visible').find('img').tooltip({
							position: {
								my: "left top",
								at: "right+5 top-5"
							},
							tooltipClass:"jselect-menu-imgtooltip",
							content: function() {
								var element = $( this ).find('img');
								return "<img src='"+element.attr( "src" )+"' style='max-width:200px;'/>";
							}
						});
					},
				}).jselectfilter();
				$('body').spine("equalizing");
			});
		});
		$.each($('.listPicker ol.sortable'),function(){
			$(this).nestedSortable({
				disableNesting: 'no-nest',
				forcePlaceholderSize: true,
				handle: 'div:not(a)',
				helper:	'clone',
				items: "li:not(.ini)",
				maxLevels:1,
				opacity: 0.6,
				placeholder: 'placeholder',
				revert: 250,
				tabSize: 25,
				distance: 15, 
				tolerance: 'pointer',
				toleranceElement: '> div',
				update: function(event, ui) {
					var container = ui.item.closest('ol.sortable');
					//var role=container.closest('fieldset').attr('role');
					
					container.find( ".buttons" ).button({text:false});
					$.wsu_maps.shapes.reloadShapes();
					$.wsu_maps.places.reloadPlaces();
					if(container.find('.ini').length &&container.find('li').size()>1){
						container.find('.ini').remove();
					}else if(container.find('.ini').length===0 && container.find('li').size()===1){
						container.append('<li class="ini"><div><h5>Add '+container.closest('fieldset').find('legend span').text()+' from below</h5</div></li>');
					}
	
					$.wsu_maps.admin.editors.view.createDeleteRow();
				}
			});
		});

		var settings = {
			verticalDragMinHeight: 50
			//showArrows: true
		};
		$.each($('.listPicker ol.sortable'),function(){
			var pane = $(this).closest('.listPicker');
			var pane_id = $(this).attr('id');
			pane.bind( 'jsp-scroll-y',
				function(event, scrollPositionY, isAtTop, isAtBottom){		
					pane.mousewheel(function(event,delta){ 
						if (delta > 0) { 
							if(isAtTop){
								return false;
							}
						} else { 
							if(isAtBottom){
								return false;
							}
						}         
					});
				}
			).jScrollPane(settings);
			$.wsu_maps.state.api[pane_id] = pane.data('jsp');
	
			$.wsu_maps.admin.editors.view.createDeleteRow();
	
			$('.addSelection').on('click',function(e){
				e.stopPropagation();
				e.preventDefault();
				
				var container = $(this).closest('fieldset');
				var role = container.attr('role');
				var orginal_select = $('#'+role+'_select');
				var sortList = container.find('ol.sortable');
				$.each($('[name="jselect_'+role+'_select"][aria-selected="true"]'),function(){
					var option = $(this);
					//var root_container = option.closest('ul');
					var root_item = option.closest('li');
					var selection = option.val();
					orginal_select.find('[value="'+selection+'"]').attr('disabled','disabled');
					root_item.addClass('selected');
					if(selection!=="" && sortList.find('input[value="'+selection+'"]').length<=0 ){
						var name = option.closest('li').text();
						//$('select#'+role+'_select').val('');
						var addEle = '<li id="list_'+(container.find('ol.sortable li').size()+1)+'">'+
										'<div style="padding: 1px;">'+
											'<span style="font-size:0.5em; float:right;">'+
												'<a href="#" title="Reomve" class="tiny buttons deleteplace ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only">'+
													'<span class="ui-icon ui-icon-trash"></span>'+
												'</a>'+
											'</span>'+name+'<input type="hidden" value="'+selection+'" class="list_'+role+'" name="'+role+'list[]"/><em></em>'+
										'</div>'+
									'</li>';
						sortList.append(addEle);
					}
					root_item.hide();
				});
				if(container.find('.ini').length>0){
					container.find('.ini').remove();
				}
				sortList.nestedSortable("refresh");
				//$('.jspContainer').css('height','auto');
				$.wsu_maps.state.api[pane_id].reinitialise();
				$.wsu_maps.shapes.reloadShapes();
				$.wsu_maps.places.reloadPlaces();
				$.wsu_maps.admin.editors.view.createDeleteRow();
				$("select#"+role+"_select").jselect('refresh');
			});
			$(window).on('resize',function(){
				if($('.jspContainer').is(':visible')){
					//$('.jspContainer').css('height','auto');
					$.wsu_maps.state.api[pane_id].reinitialise();
				}
			});
		});
	},
};
	
	
})(jQuery);