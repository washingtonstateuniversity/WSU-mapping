// JavaScript Document
/*jshint multistr: true */
(function($,window,WSU_MAP) {
	$.extend( WSU_MAP.admin.editors , {
		geometrics : {
			ini:function(){},
			defaults:{
			},
			get_style:function (jObj,style_id,type){
				//if((!window._defined(type) || type==="undefined") || (!window._defined(style_id) || style_id==="undefined") )alert('error'); return false;
	
				var url=WSU_MAP.state.siteroot+"public/get_style.castle";
				$.getJSON(url+'?callback=?&id='+style_id, function(data) {
					var typed = type.charAt(0).toUpperCase() + type.slice(1);
					var overlays = jObj.gmap('get','overlays > '+typed);
					if(overlays!==null && overlays.length>0){
						jObj.gmap('setOptions',data.events.rest,overlays[0]);
					}
				});	
			},
	
		}
	});
	$.extend( WSU_MAP.admin , {	
		geometrics : {
			loaded_shapes:[],
			colorButtons:{},
			selectedShape:null,
			selectedColor:null,
			bounds:null,
			tabIdx:0,
			colors:['#1E90FF', '#FF1493', '#32CD32', '#FF8C00', '#4B0082'],
			drawingManager:null,
			shape_count:0,
			form_tmp:"\
	<input type='hidden' name='child_geos[<%this.tab_count%>].id' value='<%this.id%>' data-child_id='<%this.id%>'>\
	<!-- <input type='hidden' name='geom_type' value='<%this.type%>'> -->\
	<input type='hidden' name='child_geos[<%this.tab_count%>].name' value='<%this.name%>'>\
	<input type='hidden' name='child_geos[<%this.tab_count%>].style[]' value='<%this.style%>'>\
	<h5>Latitudes and Longitudes:</h5>\
	<textarea name='boundary_parts[<%this.tab_count%>]' style='width:100%;height:250px;' id='latLong' cols='80' rows='25'><%this.boundary%></textarea>\
	<h5>Encoded:</h5>\
	<textarea name='child_geos[<%this.tab_count%>].encoded' class='ui-widget ui-widget-content ui-corner-all' style='width:100%;height:50px;' cols='80' rows='5'><%this.encoded%></textarea>",
			load_editor:function () {
				
				WSU_MAP.state.map_jObj=$('#geometrics_drawing_map');
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
				
				
				$('.min_tab').tabs({				
					activate: function( event, ui ) {
						WSU_MAP.admin.geometrics.tabIdx = ui.newTab.index();
						WSU_MAP.admin.geometrics.clearSelection();
						WSU_MAP.admin.geometrics.setSelection(WSU_MAP.admin.geometrics.loaded_shapes[WSU_MAP.admin.geometrics.tabIdx]);
					}
				});
				
				$(window).resize(function(){
					WSU_MAP.responsive.resizeBg(WSU_MAP.state.map_jObj,112);
					WSU_MAP.responsive.resizeMaxBg($('#side_tabs .ui-tabs-panel'),250);
				}).trigger("resize");
				
				WSU_MAP.state.map_jObj.gmap({
						'center': WSU_MAP.state.campus_latlng_str ,
						'zoom': WSU_MAP.defaults.map.zoom,
						'disableDoubleClickZoom':true,
						//'draggable':false,
						//'zoomControl': false,
						'panControl':false,
						'streetViewControl': false,
						styles:WSU_MAP.defaults.map.styles
				}).bind('init', function () {
					var jObj = WSU_MAP.state.map_jObj;
					WSU_MAP.state.map_inst = jObj.gmap('get','map');
					var controlOn=true;
					//var drawingMode = false;
					
					var type= $('#startingValue').val();
					
					var coords=$('#latLong').val();
					if( !window._defined(coords) || coords==='' ){
						coords=$('[name*=".encoded"]').val();
					}
					var pointHolder = {};
					if( (window._defined(coords) && coords!=='') && type==='polyline'){ 
						pointHolder = {'path' : coords };
					}
					if( (window._defined(coords) && coords!=='') && type==='polygon'){ 
						pointHolder = {'paths' : coords };
					}
					var shape = {draggable: true, geodesic: true, 'editable':true};
					if(!$.isEmptyObject(pointHolder)){
						shape = $.extend( shape, { 'strokeColor':'#000', 'strokeWeight':3 } , pointHolder );
					}
					WSU_MAP.admin.geometrics.drawingManager=jObj.gmap('get_drawingManager');
					jObj.gmap('init_drawing', 
						{ 
							drawingControl:controlOn,
							drawingControlOptions : controlOn?{
								position: google.maps.ControlPosition.TOP_CENTER,
								drawingModes: $('#pickedValue').val()!==""?[$('#pickedValue').val()]:[google.maps.drawing.OverlayType.POLYLINE, google.maps.drawing.OverlayType.POLYGON]
							  }:false,
							polylineOptions:{editable: true, geodesic: true, draggable: true} 
						}, $.extend( {
								limit:1,
								limit_reached:function(){//gmap){
								},
								encodePaths:false, // always a string
								data_return:'str', // "str" , "obj" (gmap obj) and others to come
								data_pattern:'{lng} {lat}{delimiter}\n',   //
								delimiter:',',
								overlaycomplete:function(data){
									if(data!==null){
										//var currect_count = WSU_MAP.admin.geometrics.shape_count;
										WSU_MAP.admin.geometrics.drawingManager=jObj.gmap('get_drawingManager');
										WSU_MAP.admin.geometrics.loaded_shapes.push( $.extend({geodesic: true, draggable: true},data));
										
										if (data.type !== undefined && data.type !== google.maps.drawing.OverlayType.MARKER) {
											WSU_MAP.admin.geometrics.drawingManager.setDrawingMode(null);
											
											var newShape = data.overlay;
											data.overlay.shape_id = WSU_MAP.admin.geometrics.loaded_shapes.length-1;
											newShape.type = data.type;
											
											google.maps.event.addListener(newShape, 'click', function() {
												WSU_MAP.admin.geometrics.setSelection(newShape);
											});
											WSU_MAP.admin.geometrics.setSelection(newShape);
											var points = jObj.gmap('get_updated_data',data);
											WSU_MAP.admin.geometrics.add_shape_tab({
												id:0,
												name:"",
												boundary:points,
												type:$('[name="geom_type"]').val(),
												style:$('[name="geometric.style[]"]').val(),
												encoded:jObj.gmap('encode',jObj.gmap('process_coords',points,true,true))
											});
										}
										WSU_MAP.admin.geometrics.shape_count++;
									}
								},
								onDrag:function(data){
									var points=jObj.gmap('get_updated_data');
									if( window._defined(data) && points.length){
										//alert(points);
										var tab = $('#child_'+WSU_MAP.admin.geometrics.tabIdx);
										var boundInput = tab.find('[name*="boundary_parts"]');
										var encodeInput = tab.find('[name*="encoded"]');
										boundInput.val(points);
										//alert(dump(WSU_MAP.state.map_jObj.gmap('encode',WSU_MAP.state.map_jObj.gmap('process_coords',points,false,false))));
										//$('#geometric_encoded').val($('#drawing_map').gmap('get_updated_data_encoded'));
										boundInput.val(jObj.gmap('encode',jObj.gmap('process_coords',boundInput.val(),true,false)));
										encodeInput.val(jObj.gmap('encode',jObj.gmap('process_coords',boundInput.val(),true,false)));
										//$('#geometric_encoded').val(WSU_MAP.state.map_jObj.gmap('get_updated_data_encoded'));
									}
								},
								drawingmode_changed:function(type){
									if(type!==null){
										$('#style_of').val(type);
									}
									WSU_MAP.admin.geometrics.drawingManager=jObj.gmap('get_drawingManager');
									WSU_MAP.admin.geometrics.clearSelection();
								},
								onComplete:function(dm,shape){
									if(shape!==null){
										//$('#latLong').val(WSU_MAP.state.map_jObj.gmap('get_updated_data',WSU_MAP.state.map_jObj.gmap('overlays')));
										//$('#geometric_encoded').val(WSU_MAP.state.map_jObj.gmap('get_updated_data_encoded',shape));
										jObj.gmap('zoom_to_bounds',{},shape,function(){
											//alert('zoomed?');
										});
									}else{
									
									
									}
								}
							},
							/*note we are extending the settings with the shape */
							$('#pickedValue').val()===''?{}:{
								//loaded_type: ($('#pickedValue').val().charAt(0).toUpperCase() + $('#pickedValue').val().slice(1)),
								//loaded_shape:shape
							} )
					);
					google.maps.event.addListener(WSU_MAP.state.map_inst, 'click', WSU_MAP.admin.geometrics.clearSelection);
	
					$.each($("[data-child_id]"),function(idx){
						WSU_MAP.admin.geometrics.resolve_loaded_shapes(idx);
					});
					WSU_MAP.state.map_inst.fitBounds(WSU_MAP.admin.geometrics.bounds); 
	
	
	
	
	
					
					$('#delete-button').on('click',function(e){
						WSU_MAP.util.nullout_event(e);
						WSU_MAP.admin.geometrics.deleteSelectedShape();
					});
					$('#delete-all-button').on('click',function(e){
						WSU_MAP.util.nullout_event(e);
						WSU_MAP.admin.geometrics.deleteAllShape();
					});
					
					
					WSU_MAP.admin.geometrics.buildColorPalette();
					
					$('#drawingcontrolls.showing_controll').on('click',function(e){
						WSU_MAP.util.nullout_event(e);
						jObj.gmap('hide_drawingControl');
						$(this).removeClass('showing_controll').addClass('hidden_controll').text('Show controlls');
					});
					$('#drawingcontrolls.hidden_controll').on('click',function(e){
						WSU_MAP.util.nullout_event(e);
						jObj.gmap('show_drawingControl');
						$(this).removeClass('hidden_controll').addClass('showing_controll').text('Hide controlls');
					});
					$('#restart').on('click',function(e){
						WSU_MAP.util.nullout_event(e);
						jObj.gmap('refresh_drawing',false);
					});
					$('#update').on('click',function(e){
						WSU_MAP.util.nullout_event(e);
						if(jObj.gmap('get_updated_data')){
							$('#latLong').val(jObj.gmap('get_updated_data'));
						}
						
						//alert(dump(WSU_MAP.state.map_jObj.gmap('encode',WSU_MAP.state.map_jObj.gmap('process_coords',$('#latLong').val(),false,false))));
						
						//$('#geometric_encoded').val(WSU_MAP.state.map_jObj.gmap('get_updated_data_encoded'));
						if(jObj.gmap('get_updated_data')){
							$('#geometric_encoded').val(jObj.gmap('encode',jObj.gmap('process_coords',$('#latLong').val(),true,true)));
						}
					});
					$("form#shapeEditor").autoUpdate({
						 before:function(){ 
							//$('#update').trigger('click');
						 }
					});
					$('#unselect').on('click',function(e){
						WSU_MAP.util.nullout_event(e);
						$('#latLong').val(jObj.gmap('unset_drawingSelection'));
					});
					//var selected_type = '';
					$('#style').on('change',function(){
						if($('#style').val()>0){
							if($('#latLong').val()!==""){
								WSU_MAP.admin.editors.geometrics.get_style(jObj,$('#style').val(),$('#pickedValue').val());
							}
						}
					});
					if($('#latLong').val()!==""){
						$('#style').trigger('change');
					}
				});
				 
			},
	
			resolve_loaded_shapes:function(idx){//){//
				var type= $('[name="geom_type"]').val();
				var coords=$('[name="boundary_parts['+idx+']"]').val();
				if(coords===''){
					coords=$('[name*=".encoded['+idx+']"]').val();
				}
				var pointHolder = {};
				if(coords!=='' && type==='polyline'){ 
					pointHolder = {'path' : coords };
				}
				if(coords!=='' && type==='polygon'){ 
					pointHolder = {'paths' : coords };
				}
				var shape = {};
				if( !$.isEmptyObject(pointHolder) ){
					shape = $.extend( {
						onDrag:function(data){
							var jObj = WSU_MAP.state.map_jObj;
							var points=jObj.gmap('get_updated_data');
							if( window._defined(points) && window._defined(data) && points.length){
								//alert(points);
								var tab = $('#child_'+WSU_MAP.admin.geometrics.tabIdx);
								var boundInput = tab.find('[name*="boundary_parts"]');
								var encodeInput = tab.find('[name*="encoded"]');
								boundInput.val(points);
								//alert(dump(WSU_MAP.state.map_jObj.gmap('encode',WSU_MAP.state.map_jObj.gmap('process_coords',points,false,false))));
								//$('#geometric_encoded').val($('#drawing_map').gmap('get_updated_data_encoded'));
								boundInput.val(jObj.gmap('encode',jObj.gmap('process_coords',boundInput.val(),true,false)));
								encodeInput.val(jObj.gmap('encode',jObj.gmap('process_coords',boundInput.val(),true,false)));
								//$('#geometric_encoded').val(WSU_MAP.state.map_jObj.gmap('get_updated_data_encoded'));
							}
						},
						'strokeColor':'#000',
						'strokeWeight':3
					} , { 'editable':true, geodesic: true, draggable: true } , pointHolder );
					WSU_MAP.state.map_jObj.gmap('add_drawing_shape', type, shape, function(map_shape){
						map_shape.type = type;
						WSU_MAP.admin.geometrics.loaded_shapes[idx]=map_shape;
						map_shape=$.extend(map_shape,{group_index:idx});//WSU_MAP.admin.geometrics.shape_count
						WSU_MAP.state.map_jObj.gmap('zoom_to_bounds',{},map_shape,function(){ });
						WSU_MAP.admin.geometrics.shape_count++;
						if(WSU_MAP.admin.geometrics.bounds === null){
          					WSU_MAP.admin.geometrics.bounds=new google.maps.LatLngBounds();
						}
						
						var map_shape_path = map_shape.getPath();
						
						
						google.maps.event.addListener(map_shape, 'click', function(){
							$('.min_tab').tabs("option", "active", idx);
						});
						google.maps.event.addListener(map_shape_path, 'set_at', function(){
							WSU_MAP.admin.geometrics.on_shape_change(idx,map_shape);
						});
						google.maps.event.addListener(map_shape_path, 'insert_at', function(){
							WSU_MAP.admin.geometrics.on_shape_change(idx,map_shape);
						});
						
						
						/*
						google.maps.event.addListener(map_shape, 'click', function (){//event) {
							$('.min_tab').tabs("option", "active", idx);
							var jObj = WSU_MAP.state.map_jObj;
							var points=jObj.gmap('get_updated_data',map_shape);
							var tab = $('#child_'+idx);
							var boundInput = tab.find('[name*="boundary_parts"]');
							var encodeInput = tab.find('[name*="encoded"]');
							console.log(points);
							if( window._defined(points) && points.length){
								//alert(points);

								boundInput.val(points);
								//alert(dump(WSU_MAP.state.map_jObj.gmap('encode',WSU_MAP.state.map_jObj.gmap('process_coords',points,false,false))));
								//$('#geometric_encoded').val($('#drawing_map').gmap('get_updated_data_encoded'));
								boundInput.val(jObj.gmap('encode',jObj.gmap('process_coords',boundInput.val(),true,false)));
								encodeInput.val(jObj.gmap('encode',jObj.gmap('process_coords',boundInput.val(),true,false)));
								//$('#geometric_encoded').val(WSU_MAP.state.map_jObj.gmap('get_updated_data_encoded'));
							}
						});*/  
						map_shape.latLngs.getArray().forEach(function(path){
							path.getArray().forEach(function(latLng){
								WSU_MAP.admin.geometrics.bounds.extend(latLng);
							});
						});
					});
				}
			},
			on_shape_change:function(idx,map_shape){
				var jObj = WSU_MAP.state.map_jObj;
				WSU_MAP.admin.geometrics.setSelection(map_shape);
				var points=jObj.gmap('get_updated_data');
				var tab = $('#child_'+idx);
				var boundInput = tab.find('[name*="boundary_parts"]');
				var encodeInput = tab.find('[name*="encoded"]');
				console.log(points);
				if( window._defined(points) && points.length){
					//alert(points);

					boundInput.val(points);
					//alert(dump(WSU_MAP.state.map_jObj.gmap('encode',WSU_MAP.state.map_jObj.gmap('process_coords',points,false,false))));
					//$('#geometric_encoded').val($('#drawing_map').gmap('get_updated_data_encoded'));
					//boundInput.val(jObj.gmap('encode',jObj.gmap('process_coords',boundInput.val(),true,false)));
					encodeInput.val(jObj.gmap('encode',jObj.gmap('process_coords',boundInput.val(),true,false)));
					//$('#geometric_encoded').val(WSU_MAP.state.map_jObj.gmap('get_updated_data_encoded'));
				}
			},
			add_shape_tab:function(options){
				var tabs = $('.min_tab');
				var ul = tabs.find( "ul" );
				var tab_count = tabs.find( "ul li" ).length;
				options.tab_count = tab_count;
				var html = $.runTemplate(WSU_MAP.admin.geometrics.form_tmp,options);
				var name = typeof options.name !== "undefined" && options.name !== "" ? "("+options.name+")" : "";
				$( "<li><a href='#child_"+(tab_count+1)+"'>" + (tab_count+1) + name +"</a></li>" ).appendTo( ul );
				$( "<div id='child_"+(tab_count+1)+"'>" + html + "</div>" ).appendTo( tabs );
				tabs.tabs( "refresh" );
				tabs.tabs("option", 'activate', tab_count+1);
			},
	
			
			
			makeColorButton:function (color) {
				var button = document.createElement('span');
				button.className = 'color-button';
				button.style.backgroundColor = color;
				google.maps.event.addDomListener(button, 'click', function() {
					WSU_MAP.admin.geometrics.selectColor(color);
					WSU_MAP.admin.geometrics.setSelectedShapeColor(color);
				});
				
				return button;
			},
			
			buildColorPalette:function () {
				var colorPalette = document.getElementById('color-palette');
				for (var i = 0; i < WSU_MAP.admin.geometrics.colors.length; ++i) {
					var currColor = WSU_MAP.admin.geometrics.colors[i];
					var colorButton = WSU_MAP.admin.geometrics.makeColorButton(currColor);
					colorPalette.appendChild(colorButton);
					WSU_MAP.admin.geometrics.colorButtons[currColor] = colorButton;
				}
				WSU_MAP.admin.geometrics.selectColor(WSU_MAP.admin.geometrics.colors[0]);
			},
			
			
			
			
			clearSelection:function () {
				/*if (WSU_MAP.admin.geometrics.selectedShape) {
					WSU_MAP.admin.geometrics.selectedShape.setEditable(false);
					WSU_MAP.admin.geometrics.selectedShape = null;
				}*/
				WSU_MAP.state.map_jObj.gmap('unset_drawingSelection');
			},
			setSelection:function (shape) {
				WSU_MAP.admin.geometrics.clearSelection();
				WSU_MAP.admin.geometrics.selectedShape = shape;
				shape.setEditable(true);
				WSU_MAP.admin.geometrics.selectColor(shape.get('fillColor') || shape.get('strokeColor'));
				WSU_MAP.state.map_jObj.gmap('set_drawingSelection',shape);
			},
			deleteSelectedShape:function () {
				/*if (WSU_MAP.admin.geometrics.selectedShape) {
					WSU_MAP.admin.geometrics.selectedShape.setMap(null);
				}*/
				WSU_MAP.state.map_jObj.gmap('delete_drawingSelection');
			},
			deleteAllShape:function () {
				for (var i = 0; i < WSU_MAP.admin.geometrics.loaded_shapes.length; i++) {
					WSU_MAP.admin.geometrics.loaded_shapes[i].overlay.setMap(null);
				}
				WSU_MAP.admin.geometrics.loaded_shapes = [];
			},
			selectColor:function (color) {
				WSU_MAP.admin.geometrics.selectedColor = color;
				for (var i = 0; i < WSU_MAP.admin.geometrics.colors.length; ++i) {
					var currColor = WSU_MAP.admin.geometrics.colors[i];
					WSU_MAP.admin.geometrics.colorButtons[currColor].style.border = currColor === color ? '2px solid #789' : '2px solid #fff';
				}
				if(WSU_MAP.admin.geometrics.drawingManager===null || WSU_MAP.admin.geometrics.drawingManager === undefined){
					WSU_MAP.admin.geometrics.drawingManager=WSU_MAP.state.map_jObj.gmap('get_drawingManager');
				}
				// Retrieves the current options from the drawing manager and replaces the
				// stroke or fill color as appropriate.
				var polylineOptions = WSU_MAP.admin.geometrics.drawingManager.get('polylineOptions');
				if(polylineOptions!==undefined){
					polylineOptions.strokeColor = color;
					WSU_MAP.admin.geometrics.drawingManager.set('polylineOptions', polylineOptions);
				}
	
				var rectangleOptions = WSU_MAP.admin.geometrics.drawingManager.get('rectangleOptions');
				if(rectangleOptions!==undefined){
					rectangleOptions.fillColor = color;
					WSU_MAP.admin.geometrics.drawingManager.set('rectangleOptions', rectangleOptions);
				}
			
				var circleOptions = WSU_MAP.admin.geometrics.drawingManager.get('circleOptions');
				if(circleOptions!==undefined){
					circleOptions.fillColor = color;
					WSU_MAP.admin.geometrics.drawingManager.set('circleOptions', circleOptions);
				}
	
				var polygonOptions = WSU_MAP.admin.geometrics.drawingManager.get('polygonOptions');
				if(polygonOptions!==undefined){
					polygonOptions.fillColor = color;
					WSU_MAP.admin.geometrics.drawingManager.set('polygonOptions', $.extend({geodesic: true, draggable: true},polygonOptions));
				}
			},
			
			setSelectedShapeColor:function(color) {
				if (WSU_MAP.admin.geometrics.selectedShape) {
					if (WSU_MAP.admin.geometrics.selectedShape.type === google.maps.drawing.OverlayType.POLYLINE) {
					  WSU_MAP.admin.geometrics.selectedShape.set('strokeColor', color);
					} else {
					  WSU_MAP.admin.geometrics.selectedShape.set('fillColor', color);
					}
				}
			},
		}
	});
})(jQuery,window,jQuery.wsu_maps||(jQuery.wsu_maps={}));