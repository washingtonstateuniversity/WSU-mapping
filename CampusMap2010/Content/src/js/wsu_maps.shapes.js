// JavaScript Document
(function($,window) {
	$.wsu_maps.shapes = {
		reloadShapes:function (){
			var url=$.wsu_maps.state.siteroot+"public/getShapesJson_byIds.castle";
			var ids;
			$.each($('[name="geolist[]"]'),function(){
					ids =(typeof(ids)==="undefined"?'':ids+',')+$(this).val();
			});

			$.wsu_maps.state.map_jObj.gmap('clear','overlays');
			if(typeof(ids)!=="undefined"){
				$.getJSON(url+'?callback=?&ids[]='+ids, function(data) {
					$.each( data.shapes, function(i, shape) {	
						$.wsu_maps.shapes.addShapeToMap(i, shape);
					});
				});
			}	
		},
		addShapeToMap:function(i,shape){
			var jObj = $.wsu_maps.state.map_jObj;
			var pointHolder = {};
			var style = {};
			if(typeof(shape.latlng_str)==="undefined" && shape.latlng_str!=='' && shape.type==='polyline'){ 
				pointHolder = {'path' : shape.latlng_str };
			}
			if(typeof(shape.latlng_str)==="undefined" && shape.latlng_str!=='' && shape.type==='polygon'){ 
				pointHolder = {'paths' : shape.latlng_str };
			}
			if(typeof(shape.encoded)!=="undefined"){ 
				pointHolder = {'paths' : shape.encoded };
			}
			if(typeof(shape.style)==="undefined"||shape.style===''){
				style = shape.type==='polygon'? {'fillOpacity':0.99,'fillColor':'#981e32','strokeColor':'#262A2D','strokeWeight':1}:{'strokeOpacity':0.99,'strokeColor':'#262A2D','strokeWeight':2};
			}else{
				style =  shape.style.events.rest;
			}
			if(!$.isEmptyObject(pointHolder)){
				style = $.extend( style , pointHolder );
			}
			
			if((typeof(shape.style)==="undefined"||shape.style==='') && typeof(shape.type)!=="undefined"){
				jObj.gmap('addShape',(shape.type.charAt(0).toUpperCase() + shape.type.slice(1)), style);
			}else{
				
				// $.wsu_maps.state.map_jObj.gmap('addShape',(shape.type[0].toUpperCase() + shape.type.slice(1)), style)
				jObj.gmap('addShape', (shape.type.charAt(0).toUpperCase() + shape.type.slice(1)), style, function(shape_obj){
				$(shape_obj).on('click',function(){
					if(typeof(shape.style.events.click)!=="undefined" && shape.style.events.click !== ""){

						jObj.gmap('setOptions',shape.style.events.click,this);
						if(typeof(shape.style.events.click.onEnd)!=="undefined" && shape.style.events.click.onEnd !== ""){
							(function(){
								window.jObj=jObj;
								window.i=i;
								/* jshint ignore:start */ //the safer eval still throws lint error
								try{
									var p= shape.style.events.click.onEnd.replace('\u0027',"'");
									var f=  new Function(p); 
									f();
								}catch(err) {
									console.log(err);
								}
								/* jshint ignore:end */
							})();
						}
					}
				 }).mouseover(function(){
					 if(typeof(shape.style.events.mouseover)!=="undefined" && shape.style.events.mouseover !== ""){
						 jObj.gmap('setOptions',shape.style.events.mouseover,this);
						if(typeof(shape.style.events.mouseover.onEnd)!=="undefined" && shape.style.events.mouseover.onEnd !== ""){
							(function(){
								window.jObj=jObj;
								window.i=i;
								/* jshint ignore:start */ //the safer eval still throws lint error
								try{
									var p= shape.style.events.mouseover.onEnd.replace('\u0027',"'");
									var f=  new Function(p); 
									f();
								}catch(err) {
									console.log(err);
								}
								/* jshint ignore:end */
							})();
						}		
					 }
				}).mouseout(function(){
					if(typeof(shape.style.events.rest)!=="undefined" && shape.style.events.rest !== ""){
						jObj.gmap('setOptions',shape.style.events.rest,this);
						if(typeof(shape.style.events.rest.onEnd)!=="undefined" && shape.style.events.rest.onEnd !== ""){
							(function(){
								window.jObj=jObj;
								window.i=i;
								/* jshint ignore:start */ //the safer eval still throws lint error
								try{
									var p= shape.style.events.rest.onEnd.replace('\u0027',"'");
									var f=  new Function(p); 
									f();
								}catch(err) {
									console.log(err);
								}
								/* jshint ignore:end */
							})();
						}
					}
				}).dblclick(function(){
					if(typeof(shape.style.events.dblclick)!=="undefined" && shape.style.events.dblclick !== ""){
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
									console.log(err);
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
	};
})(jQuery,window);