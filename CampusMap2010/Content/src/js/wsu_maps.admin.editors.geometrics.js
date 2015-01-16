// JavaScript Document
(function($) {
	$.wsu_maps.admin.editors.geometrics = {
		ini:function(){},
		defaults:{
		},
		get_style:function (jObj,style_id,type){
			//if((typeof(type)==="undefined" || type==="undefined") || (typeof(style_id)==="undefined" || style_id==="undefined") )alert('error'); return false;

			var url=$.wsu_maps.state.siteroot+"public/get_style.castle";
			$.getJSON(url+'?callback=?&id='+style_id, function(data) {
				var typed = type.charAt(0).toUpperCase() + type.slice(1);
				var overlays = jObj.gmap('get','overlays > '+typed);
				if(overlays!==null && overlays.length>0){
					jObj.gmap('setOptions',data.events.rest,overlays[0]);
				}
			});	
		},

	};
	
		
	$.wsu_maps.admin.geometrics = {
		loaded_shapes:[],
		colorButtons:{},
		selectedShape:null,
		selectedColor:null,
		colors:['#1E90FF', '#FF1493', '#32CD32', '#FF8C00', '#4B0082'],
		drawingManager:null,
		load_editor:function () {
			
			$.wsu_maps.state.mapInst=$('#geometrics_drawing_map');
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
				$.wsu_maps.responsive.resizeBg($.wsu_maps.state.mapInst,112);
				$.wsu_maps.responsive.resizeMaxBg($('#side_tabs .ui-tabs-panel'),250);
			}).trigger("resize");
			
			$.wsu_maps.state.mapInst.gmap({'center': $.wsu_maps.state.campus_latlng_str , 'zoom':15 }).bind('init', function () {
				var controlOn=true;
				//var drawingMode = false;
				
				var type= $('#startingValue').val();
				
				var coords=$('#latLong').val();
				if(coords===''){
					coords=$('#geometric_encoded').val();
				}
				var pointHolder = {};
				if(coords!=='' && type==='polyline'){ 
					pointHolder = {'path' : coords };
				}
				if(coords!=='' && type==='polygon'){ 
					pointHolder = {'paths' : coords };
				}
				var shape = {};
				if(!$.isEmptyObject(pointHolder)){
					shape = $.extend( { 'strokeColor':'#000', 'strokeWeight':3 } , {'editable':true} , pointHolder );
				}
				var jObj = $.wsu_maps.state.mapInst;
				$.wsu_maps.admin.geometrics.drawingManager=jObj.gmap('get_drawingManager');
				jObj.gmap('init_drawing', 
					{ 
						drawingControl:controlOn,
						drawingControlOptions : controlOn?{
							position: google.maps.ControlPosition.TOP_CENTER,
							drawingModes: $('#pickedValue').val()!==""?[$('#pickedValue').val()]:[google.maps.drawing.OverlayType.POLYLINE, google.maps.drawing.OverlayType.POLYGON]
						  }:false,
						polylineOptions:{editable: true} 
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
										$.wsu_maps.admin.geometrics.drawingManager=jObj.gmap('get_drawingManager');
										alert(data);
										$('#latLong').val(jObj.gmap('get_updated_data'));
										//alert(dump($.wsu_maps.state.mapInst.gmap('encode',$.wsu_maps.state.mapInst.gmap('process_coords',data,false,false))));
										//$('#geometric_encoded').val(google.maps.geometry.encoding.decodePath(data));
										//$('#geometric_encoded').val($('#drawing_map').gmap('get_updated_data_encoded'));
										//$('#geometric_encoded').val($('#drawing_map').gmap('get_updated_data_encoded'));
										//$('#geometric_encoded').val($.wsu_maps.state.mapInst.gmap('get_updated_data_encoded'));
										
										$('#geometric_encoded').val(jObj.gmap('encode',jObj.gmap('process_coords',$('#latLong').val(),true,false)));
										///process_coords: function(coordinates,flip,reverse_array)
										$.wsu_maps.admin.geometrics.loaded_shapes.push(data);
										if (data.type !== undefined && data.type !== google.maps.drawing.OverlayType.MARKER) {
											// Switch back to non-drawing mode after drawing a shape.
											$.wsu_maps.admin.geometrics.drawingManager.setDrawingMode(null);
											
											// Add an event listener that selects the newly-drawn shape when the user
											// mouses down on it.
											var newShape = data.overlay;
											newShape.type = data.type;
											google.maps.event.addListener(newShape, 'click', function() {
												$.wsu_maps.admin.geometrics.setSelection(newShape);
											});
											$.wsu_maps.admin.geometrics.setSelection(newShape);
										}
									}
									
								},
							onDrag:function(){//data){
									var points=jObj.gmap('get_updated_data');
									if(points.length){
										//alert(points);
										$('[name*="boundary"]').eq(0).val(points);
										//alert(dump($.wsu_maps.state.mapInst.gmap('encode',$.wsu_maps.state.mapInst.gmap('process_coords',points,false,false))));
										//$('#geometric_encoded').val($('#drawing_map').gmap('get_updated_data_encoded'));
										$('#geometric_encoded').val(jObj.gmap('encode',jObj.gmap('process_coords',$('[name*="boundary"]').eq(0).val(),true,false)));
										//$('#geometric_encoded').val($.wsu_maps.state.mapInst.gmap('get_updated_data_encoded'));
									}
								},
							drawingmode_changed:function(type){
									if(type!==null){
										$('#style_of').val(type);
									}
									$.wsu_maps.admin.geometrics.drawingManager=jObj.gmap('get_drawingManager');
									$.wsu_maps.admin.geometrics.clearSelection();
								},
							onComplete:function(dm,shape){
								if(shape!==null){
									//$('#latLong').val($.wsu_maps.state.mapInst.gmap('get_updated_data',$.wsu_maps.state.mapInst.gmap('overlays')));
									//$('#geometric_encoded').val($.wsu_maps.state.mapInst.gmap('get_updated_data_encoded',shape));
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
				google.maps.event.addListener(jObj.gmap('get','map'), 'click', $.wsu_maps.admin.geometrics.clearSelection);

				$.each($("[data-child_id]"),function(idx){
					$.wsu_maps.admin.geometrics.resolve_loaded_shapes(idx);
				});






				
				$('#delete-button').on('click',function(e){
					e.preventDefault();
					e.stopPropagation();
					$.wsu_maps.admin.geometrics.deleteSelectedShape();
				});
				$('#delete-all-button').on('click',function(e){
					e.preventDefault();
					e.stopPropagation();
					$.wsu_maps.admin.geometrics.deleteAllShape();
				});
				
				
				$.wsu_maps.admin.geometrics.buildColorPalette();
				
				$('#drawingcontrolls.showing').on('click',function(e){
					e.preventDefault();
					e.stopPropagation();
					jObj.gmap('hide_drawingControl');
					$(this).removeClass('showing').addClass('hidden').text('Show controlls');
				});
				$('#drawingcontrolls.hidden').on('click',function(e){
					e.preventDefault();
					e.stopPropagation();
					jObj.gmap('show_drawingControl');
					$(this).removeClass('hidden').addClass('showing').text('Hide controlls');
				});
				$('#restart').on('click',function(e){
					e.preventDefault();
					e.stopPropagation();
					jObj.gmap('refresh_drawing',false);
				});
				$('#update').on('click',function(e){
					e.preventDefault();
					e.stopPropagation();
					if(jObj.gmap('get_updated_data')){
						$('#latLong').val(jObj.gmap('get_updated_data'));
					}
					
					//alert(dump($.wsu_maps.state.mapInst.gmap('encode',$.wsu_maps.state.mapInst.gmap('process_coords',$('#latLong').val(),false,false))));
					
					//$('#geometric_encoded').val($.wsu_maps.state.mapInst.gmap('get_updated_data_encoded'));
					if(jObj.gmap('get_updated_data')){
						$('#geometric_encoded').val(jObj.gmap('encode',jObj.gmap('process_coords',$('#latLong').val(),true,true)));
					}
				});
				$("form#shapeEditor").autoUpdate({
					 before:function(){ 
						$('#update').trigger('click');
					 }
				});
				$('#unselect').on('click',function(e){
					e.preventDefault();
					e.stopPropagation();
					$('#latLong').val(jObj.gmap('unset_drawingSelection'));
				});
				//var selected_type = '';
				$('#style').on('change',function(){
					if($('#style').val()>0){
						if($('#latLong').val()!==""){
							$.wsu_maps.admin.editors.geometrics.get_style(jObj,$('#style').val(),$('#pickedValue').val());
						}
					}
				});
				if($('#latLong').val()!==""){
					$('#style').trigger('change');
				}
			});
			 
		},

		resolve_loaded_shapes:function(idx){
			var type= $('[name="child_geos['+idx+'].geom_type"]').val();
			var coords=$('[name="child_geos['+idx+'].boundary[0]"]').val();
			if(coords===''){
				coords=$('[name="child_geos['+idx+'].encoded"]').val();
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
				shape = $.extend( { 'strokeColor':'#000', 'strokeWeight':3 } , {'editable':true} , pointHolder );
				$.wsu_maps.state.mapInst.gmap('addShape', type, shape, function(map_shape){
					$.wsu_maps.state.mapInst.gmap('zoom_to_bounds',{},map_shape,function(){ });
				});
			}
		},


		
		
		makeColorButton:function (color) {
			var button = document.createElement('span');
			button.className = 'color-button';
			button.style.backgroundColor = color;
			google.maps.event.addDomListener(button, 'click', function() {
				$.wsu_maps.admin.geometrics.selectColor(color);
				$.wsu_maps.admin.geometrics.setSelectedShapeColor(color);
			});
			
			return button;
		},
		
		buildColorPalette:function () {
			var colorPalette = document.getElementById('color-palette');
			for (var i = 0; i < $.wsu_maps.admin.geometrics.colors.length; ++i) {
				var currColor = $.wsu_maps.admin.geometrics.colors[i];
				var colorButton = $.wsu_maps.admin.geometrics.makeColorButton(currColor);
				colorPalette.appendChild(colorButton);
				$.wsu_maps.admin.geometrics.colorButtons[currColor] = colorButton;
			}
			$.wsu_maps.admin.geometrics.selectColor($.wsu_maps.admin.geometrics.colors[0]);
		},
		
		
		
		
		clearSelection:function () {
			/*if ($.wsu_maps.admin.geometrics.selectedShape) {
				$.wsu_maps.admin.geometrics.selectedShape.setEditable(false);
				$.wsu_maps.admin.geometrics.selectedShape = null;
			}*/
			$.wsu_maps.state.mapInst.gmap('unset_drawingSelection');
		},
		setSelection:function (shape) {
			$.wsu_maps.admin.geometrics.clearSelection();
			$.wsu_maps.admin.geometrics.selectedShape = shape;
			shape.setEditable(true);
			$.wsu_maps.admin.geometrics.selectColor(shape.get('fillColor') || shape.get('strokeColor'));
		},
		deleteSelectedShape:function () {
			/*if ($.wsu_maps.admin.geometrics.selectedShape) {
				$.wsu_maps.admin.geometrics.selectedShape.setMap(null);
			}*/
			$.wsu_maps.state.mapInst.gmap('delete_drawingSelection');
		},
		deleteAllShape:function () {
			for (var i = 0; i < $.wsu_maps.admin.geometrics.loaded_shapes.length; i++) {
				$.wsu_maps.admin.geometrics.loaded_shapes[i].overlay.setMap(null);
			}
			$.wsu_maps.admin.geometrics.loaded_shapes = [];
		},
		selectColor:function (color) {
			$.wsu_maps.admin.geometrics.selectedColor = color;
			for (var i = 0; i < $.wsu_maps.admin.geometrics.colors.length; ++i) {
				var currColor = $.wsu_maps.admin.geometrics.colors[i];
				$.wsu_maps.admin.geometrics.colorButtons[currColor].style.border = currColor === color ? '2px solid #789' : '2px solid #fff';
			}
			if($.wsu_maps.admin.geometrics.drawingManager===null || $.wsu_maps.admin.geometrics.drawingManager === undefined){
				$.wsu_maps.admin.geometrics.drawingManager=$.wsu_maps.state.mapInst.gmap('get_drawingManager');
			}
			// Retrieves the current options from the drawing manager and replaces the
			// stroke or fill color as appropriate.
			var polylineOptions = $.wsu_maps.admin.geometrics.drawingManager.get('polylineOptions');
			if(polylineOptions!==undefined){
				polylineOptions.strokeColor = color;
				$.wsu_maps.admin.geometrics.drawingManager.set('polylineOptions', polylineOptions);
			}

			var rectangleOptions = $.wsu_maps.admin.geometrics.drawingManager.get('rectangleOptions');
			if(rectangleOptions!==undefined){
				rectangleOptions.fillColor = color;
				$.wsu_maps.admin.geometrics.drawingManager.set('rectangleOptions', rectangleOptions);
			}
		
			var circleOptions = $.wsu_maps.admin.geometrics.drawingManager.get('circleOptions');
			if(circleOptions!==undefined){
				circleOptions.fillColor = color;
				$.wsu_maps.admin.geometrics.drawingManager.set('circleOptions', circleOptions);
			}

			var polygonOptions = $.wsu_maps.admin.geometrics.drawingManager.get('polygonOptions');
			if(polygonOptions!==undefined){
				polygonOptions.fillColor = color;
				$.wsu_maps.admin.geometrics.drawingManager.set('polygonOptions', polygonOptions);
			}
		},
		
		setSelectedShapeColor:function(color) {
			if ($.wsu_maps.admin.geometrics.selectedShape) {
				if ($.wsu_maps.admin.geometrics.selectedShape.type === google.maps.drawing.OverlayType.POLYLINE) {
				  $.wsu_maps.admin.geometrics.selectedShape.set('strokeColor', color);
				} else {
				  $.wsu_maps.admin.geometrics.selectedShape.set('fillColor', color);
				}
			}
		},

	};
		
	
})(jQuery);