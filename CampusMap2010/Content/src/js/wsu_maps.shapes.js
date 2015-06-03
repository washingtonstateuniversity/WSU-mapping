// JavaScript Document
(function($,window,WSU_MAP) {
	$.extend( WSU_MAP, {
		shapes : {
			reloadShapes:function (){
				var url=WSU_MAP.state.siteroot+"public/getShapesJson_byIds.castle";
				var ids;
				/*$.each($('[name="geolist[]"]'),function(){
						ids =(!window._defined(ids)?'':ids+',')+$(this).val();
				});*/
				if( WSU_MAP.state.embeded_shape_ids !== false ){
					ids = WSU_MAP.state.embeded_shape_ids;
				}else{
					$.each($('[name="placelist[]"]'),function(){
						ids =(!window._defined(ids)?'':ids+',')+$(this).val();
					});
				}
				WSU_MAP.state.map_jObj.gmap('clear','overlays');
				if(window._defined(ids)){
					$.getJSON(url+'?callback=?&ids[]='+ids, function(data) {
						$.each( data.shapes, function(i, shape) {	
							WSU_MAP.shapes.addShapeToMap(i, shape);
						});
					});
				}	
			},
			addShapeToMap:function(i,shape){
				var jObj = WSU_MAP.state.map_jObj;
				var pointHolder = {};
				var style = {};
				if(!window._defined(shape.latlng_str) && shape.latlng_str!=='' && shape.type==='polyline'){ 
					pointHolder = {'path' : shape.latlng_str };
				}
				if(!window._defined(shape.latlng_str) && shape.latlng_str!=='' && shape.type==='polygon'){ 
					pointHolder = {'paths' : shape.latlng_str };
				}
				
				if(window._defined(shape.encoded)){ 
					var path_string = "";
					if($.isArray(shape.encoded)){
						path_string = [];
						$.each(shape.encoded,function(idx,ecoded){
							path_string.push(google.maps.geometry.encoding.decodePath(ecoded));
						});
					}else{
						path_string = shape.encoded;
					}
					pointHolder = {'paths' : path_string };
				}
				if(!window._defined(shape.style)||shape.style===''){
					style = shape.type==='polygon'? {'fillOpacity':0.99,'fillColor':'#981e32','strokeColor':'#262A2D','strokeWeight':1}:{'strokeOpacity':0.99,'strokeColor':'#262A2D','strokeWeight':2};
				}else{
					style =  shape.style.events.rest;
				}
				if(!$.isEmptyObject(pointHolder)){
					style = $.extend( style , pointHolder );
				}
				
				if((!window._defined(shape.style)||shape.style==='') && window._defined(shape.type)){
					jObj.gmap('addShape',(shape.type.charAt(0).toUpperCase() + shape.type.slice(1)), style);
				}else{
					
					// WSU_MAP.state.map_jObj.gmap('addShape',(shape.type[0].toUpperCase() + shape.type.slice(1)), style)
					jObj.gmap('addShape', (shape.type.charAt(0).toUpperCase() + shape.type.slice(1)), style, function(shape_obj){
					$(shape_obj).on('click',function(){
						if(window._defined(shape.style.events.click) && shape.style.events.click !== ""){
	
							jObj.gmap('setOptions',shape.style.events.click,this);
							if(window._defined(shape.style.events.click.onEnd) && shape.style.events.click.onEnd !== ""){
								(function(){
									window.jObj=jObj;
									window.i=i;
									/* jshint ignore:start */ //the safer eval still throws lint error
									try{
										var p= shape.style.events.click.onEnd.replace('\u0027',"'");
										var f=  new Function(p); 
										f();
									}catch(err) {
										window._d(err);
									}
									/* jshint ignore:end */
								})();
							}
						}
					 }).mouseover(function(){
						 if(window._defined(shape.style.events.mouseover) && shape.style.events.mouseover !== ""){
							 jObj.gmap('setOptions',shape.style.events.mouseover,this);
							if(window._defined(shape.style.events.mouseover.onEnd) && shape.style.events.mouseover.onEnd !== ""){
								(function(){
									window.jObj=jObj;
									window.i=i;
									/* jshint ignore:start */ //the safer eval still throws lint error
									try{
										var p= shape.style.events.mouseover.onEnd.replace('\u0027',"'");
										var f=  new Function(p); 
										f();
									}catch(err) {
										window._d(err);
									}
									/* jshint ignore:end */
								})();
							}		
						 }
					}).mouseout(function(){
						if(window._defined(shape.style.events.rest) && shape.style.events.rest !== ""){
							jObj.gmap('setOptions',shape.style.events.rest,this);
							if(window._defined(shape.style.events.rest.onEnd) && shape.style.events.rest.onEnd !== ""){
								(function(){
									window.jObj=jObj;
									window.i=i;
									/* jshint ignore:start */ //the safer eval still throws lint error
									try{
										var p= shape.style.events.rest.onEnd.replace('\u0027',"'");
										var f=  new Function(p); 
										f();
									}catch(err) {
										window._d(err);
									}
									/* jshint ignore:end */
								})();
							}
						}
					}).dblclick(function(){
						if(window._defined(shape.style.events.dblclick) && shape.style.events.dblclick !== ""){
							jObj.gmap('setOptions',shape.style.events.dblclick,this);
								(function(){
									window.jObj=jObj;
									window.i=i;
									/* jshint ignore:start */ //the safer eval still throws lint error
									try{
										var p= shape.style.events.dblclick.onEnd.replace('\u0027',"'");
										var f=  new Function(p); 
										f();
									}catch(err) {
										window._d(err);
									}
									/* jshint ignore:end */
								})();
						}
					})
					.trigger('mouseover')
					.trigger('mouseout');
					});
				}	
			},
		}
	});
})(jQuery,window,jQuery.wsu_maps||(jQuery.wsu_maps={}));