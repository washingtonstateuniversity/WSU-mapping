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
	load_editor:function () {
		 $('#geometrics_drawing_map').gmap({'center': $.wsu_maps.state.campus_latlng_str , 'zoom':15 }).bind('init', function () {
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
			var jObj = $('#geometrics_drawing_map');
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
									alert(data);
									$('#latLong').val(data);
									//alert(dump($('#geometrics_drawing_map').gmap('encode',$('#geometrics_drawing_map').gmap('process_coords',data,false,false))));
									//$('#geometric_encoded').val(google.maps.geometry.encoding.decodePath(data));
									//$('#geometric_encoded').val($('#drawing_map').gmap('get_updated_data_encoded'));
									//$('#geometric_encoded').val($('#drawing_map').gmap('get_updated_data_encoded'));
									//$('#geometric_encoded').val($('#geometrics_drawing_map').gmap('get_updated_data_encoded'));
									
									$('#geometric_encoded').val(jObj.gmap('encode',jObj.gmap('process_coords',$('#latLong').val(),true,false)));
									///process_coords: function(coordinates,flip,reverse_array)
								}
							},
						onDrag:function(){//data){
								var points=$('#drawing_map').gmap('get_updated_data');
								if(points.length){
									alert(points);
									$('#latLong').val(points);
									//alert(dump($('#geometrics_drawing_map').gmap('encode',$('#geometrics_drawing_map').gmap('process_coords',points,false,false))));
									//$('#geometric_encoded').val($('#drawing_map').gmap('get_updated_data_encoded'));
									$('#geometric_encoded').val(jObj.gmap('encode',jObj.gmap('process_coords',$('#latLong').val(),true,false)));
									//$('#geometric_encoded').val($('#geometrics_drawing_map').gmap('get_updated_data_encoded'));
								}
							},
						drawingmode_changed:function(type){
								if(type!==null){
									$('#style_of').val(type);
								}
							},
						onComplete:function(dm,shape){
							if(shape!==null){
								//$('#latLong').val($('#geometrics_drawing_map').gmap('get_updated_data',$('#geometrics_drawing_map').gmap('overlays')));
								//$('#geometric_encoded').val($('#geometrics_drawing_map').gmap('get_updated_data_encoded',shape));
								$('#drawing_map').gmap('zoom_to_bounds',{},shape,function(){
									alert('zoomed?');
								});
							}else{
							
							}
						}
					},
					/*note we are extending the settings with the shape */
					$('#pickedValue').val()===''?{}:{
						loaded_type: ($('#pickedValue').val().charAt(0).toUpperCase() + $('#pickedValue').val().slice(1)),
						loaded_shape:shape
					}
				)
			);
	
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
				
				//alert(dump($('#geometrics_drawing_map').gmap('encode',$('#geometrics_drawing_map').gmap('process_coords',$('#latLong').val(),false,false))));
				
				//$('#geometric_encoded').val($('#geometrics_drawing_map').gmap('get_updated_data_encoded'));
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
		 
	}
};
	
	
})(jQuery);