(function($) {
	
	$.wsu_maps.general = {
		prep_html:function (){
			$(' [placeholder]:not(.not) ').defaultValue();
			$.each($("a"),function() {
				$(this).attr("hideFocus", "true").css("outline", "none");
			});
		},
		setGeoCoder:function (){
			var geocoder = geocoder||new google.maps.Geocoder();
			return geocoder;
		},
		rebuild_example:function (tabs,mapSelector,type){
			var _op={};
			$.each(tabs, function(){
				var tab = $(this);
				var mode = tab.closest('.tabed').attr('id');//.split('__')[1].split('_')[1];
				var ele = tab.find(':input').not('h3 :input,input:hidden');
				
				
				var options={};
				var drity_check =  ( ele.is(':checked') || (ele.val()!=='' && ele.not(':checkbox') ) ) ;
				if( drity_check && ele.not('[type=hidden]') && typeof( ele.attr('rel') ) !== 'undefined' ){
				   options[ele.attr('rel')]= (ele.is($('.color_picker')) ? '#' : '') +''+ele.val();// changed hasClass for is for speed
				}
				
				_op[ mode ] = $.extend({},_op[ mode ],options); 
			});
			mapSelector.gmap('clear_map');	
			$.wsu_maps.general.set_default_shape(mapSelector,type,_op);
		},
		/* 
		 * DEFAULT_overlay=apply_element(map,type,_option);  << that needs fixed
		 * with paths: get_wsu_logo_shape(), as option
		 * TODO besides listed above is circle and rec and marker
		 */
		set_default_shape:function (mapSelector,type,op){
			var capedType=type.charAt(0).toUpperCase() + type.slice(1);
			op=op||{};
			var return_item;
			var DEFAULT_overlay;
			switch(type){
				case "polygon" :
					// default ploygon style
						_option = {
								rest:{
									options:$.extend((typeof(op.rest)!=='undefined'?op.rest:{strokeColor: "#5f1212",strokeOpacity:0.24,strokeWeight: 2,fillColor: "#5f1212",fillOpacity: 0.24}),{paths: $.wsu_maps.defaults.get_wsu_logo_shape()})
								},
								mouseover:{
									options:typeof(op.mouseover)!=='undefined'?op.mouseover:{fillColor: "#a90533",fillOpacity: 0.35}
								},
								mouseout:{
									options:typeof(op.mouseout)!=='undefined'?op.mouseout:{fillColor: "#a90533",fillOpacity: 0.35}
								},
								click:{
									options:typeof(op.click)!=='undefined'?op.click:{fillColor: "#a90533",fillOpacity: 0.35}
								}
							};
						DEFAULT_overlay=apply_element(mapSelector,capedType,_option);
		
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
					var polyline = $.wsu_maps.defaults.get_wsu_logo_shape();
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
						DEFAULT_overlay=apply_element(mapSelector,capedType,_option);
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
					apply_element(map,capedType,_option);*/

						return_item=polyline;
					break;				
				case "marker" :
						return_item=null;
					break;
			}
			return return_item;
		},
		loadData:function (jObj,data,callback,markerCallback){
			if(typeof(data.shapes)!=='undefined' && !$.isEmptyObject(data.shapes)){
				$.each( data.shapes, function(i, shape) {
					if(typeof(shape)!=='undefined' && !$.isEmptyObject(shape)){
						$.wsu_maps.mapping.addShapeToMap(jObj,i,shape);
					}
				});
			}
			if(typeof(data.markers)!=='undefined' &&  !$.isEmptyObject( data.markers )){
				//var l = data.markers.length;
				$.each( data.markers, function(i, marker) {	
					if(typeof(marker.shapes)!=='undefined' && !$.isEmptyObject(marker.shapes)){
						$.each( marker.shapes, function(index, shape) {	
							if(typeof(shape)!=='undefined' && !$.isEmptyObject(shape)){
								$.wsu_maps.mapping.addShapeToMap(jObj,i,shape);
							}
						});
					}
					//alert(dump(marker));
					//var _mid= marker.id;
					$.wsu_maps.state.mid[i]=marker.id;
					//var pid = marker.id;
					$.wsu_maps.infobox.make_InfoWindow(jObj,i,marker);
					$.wsu_maps.infobox.make_ToolTip(jObj,i,marker);
					$.wsu_maps.markers.make_Marker(jObj,i,marker.id,marker,markerCallback);
					
					if(i===(data.markers.length-1) && $.isFunction(callback)){
						callback();
					}
				});
				if($('.mobile').length){
					$.wsu_maps.geoLocate();
				}
			}
			//if($.isFunction(callback))callback();return;
		},
		setup_embeder:function (){
			$('#embed').off().on("click",function(e){
				e.stopPropagation();
				e.preventDefault();
				//var trigger=$(this);
				$.colorbox.remove();
				makeEmbeder();
			});
		},
		addErrorReporting:function (marker){
			$('.errorReporting').off().on("click",function(e){
				e.stopPropagation();
				e.preventDefault();
				//var trigger=$(this);
				var id= typeof(marker)!=="undefined"?marker.id:0;
				$.colorbox({
					html:function(){
						return '<div id="errorReporting"><form action="../public/reportError.castle" method="post">'+
									'<h2>Found an error?</h2>'+
									'<h3>Please provide some information to help us correct this issue.</h3>'+
									'<input type="hidden" value="'+id+'" name="place_id"/>'+
									'<lable>Name:<br/><input type="text" value="" required placeholder="First and Last" name="name"/></lable><br/>'+
									'<lable>Email:<br/><input type="email" value="" required placeholder="Your email address"  name="email"/></lable><br/>'+
									'<lable>Type:<br/><select name="issueType" required><option value="">Choose</option><option value="tech">Technical</option><option value="local">Location</option><option value="content">Content</option></select></lable><br/>'+
									'<lable>Describe the issues: <br/>'+
									'<textarea required placeholder="Description" name="description"></textarea></lable><br/>'+
									'<br/><input type="Submit" id="errorSubmit" value="Submit"/><br/>'+
								'</from></div>';
					},
					scrolling:false,
					opacity:0.7,
					transition:"none",
					innerWidth:450,
					//height:450,
					open:true,
					onClosed:function(){
						$('#colorbox').removeClass('norm');
					},
					onOpen:function(){$('#colorbox').addClass('norm');},
					onComplete:function(){
						$.wsu_maps.general.prep_html();
						if($('#colorbox #cb_nav').length){
							$('#colorbox #cb_nav').html("");
						}
						$('#errorReporting [type="Submit"]').off().on('click',function(e){
							e.stopPropagation();
							e.preventDefault();
							var valid=true;
							$.each($('#errorReporting [required]'),function(){
								if($(this).val()===""){
									valid=false;
								}
							});
							
							if(valid){
								$.post($('#errorReporting form').attr('action'), $('#errorReporting form').serialize(),function(){
									$.jtrack.trackEvent(pageTracker,"error reporting", "submited", $('[name="issueType"]').val());
									$('#errorReporting').html('<h2>Thank you for reporting the error.</h2>'+'');
									$.colorbox.resize();
								});
							}else{
								if($('#valid').length===0){
									$('#errorReporting').prepend("<div id='valid'><h3>Please completely fill out the form so we may completely help you.</h3></div>");
								}
							}
						});
					}
				});
			});	
			
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
			if(typeof(op)==="undefined"){
				return;
			}
			var _op={};
			typeof(op.clickable)!=="undefined"		?_op.clickable=op.clickable:null;
			typeof(op.visible)!=="undefined"		?_op.visible=op.visible:null;
			typeof(op.zIndex)!=="undefined"		?_op.zIndex=op.zIndex:null;
			
			switch(type.toLowerCase()){
				case "polygon" :
							typeof(op.editable)!=="undefined"		?_op.editable=op.editable:null;
							typeof(op.geodesic)!=="undefined"		?_op.geodesic=op.geodesic:null;
							typeof(op.paths)!=="undefined"			?_op.paths=op.paths:null;
							typeof(op.strokeColor)!=="undefined"		?_op.strokeColor=op.strokeColor:null;
							typeof(op.strokeOpacity)!=="undefined"	?_op.strokeOpacity=op.strokeOpacity:null;
							typeof(op.strokeWeight)!=="undefined"	?_op.strokeWeight=op.strokeWeight:null;
							typeof(op.fillColor)!=="undefined"		?_op.fillColor=op.fillColor:null;
							typeof(op.fillOpacity)!=="undefined"		?_op.fillOpacity=op.fillOpacity:null;
					break;
				case "rectangle" :
							typeof(op.editable)!=="undefined"		?_op.editable=op.editable:null;
							typeof(op.bounds)!=="undefined"			?_op.bounds=op.bounds:null;
							typeof(op.strokeColor)!=="undefined"		?_op.strokeColor=op.strokeColor:null;
							typeof(op.strokeOpacity)!=="undefined"	?_op.strokeOpacity=op.strokeOpacity:null;
							typeof(op.strokeWeight)!=="undefined"	?_op.strokeWeight=op.strokeWeight:null;
							typeof(op.fillColor)!=="undefined"		?_op.fillColor=op.fillColor:null;
							typeof(op.fillOpacity)!=="undefined"		?_op.fillOpacity=op.fillOpacity:null;
					break;
				case "circle" :
							typeof(op.editable)!=="undefined"		?_op.editable=op.editable:null;
							typeof(op.center)!=="undefined"			?_op.center=op.center:null;
							typeof(op.radius)!=="undefined"			?_op.radius=op.radius:null;
							typeof(op.strokeColor)!=="undefined"		?_op.strokeColor=op.strokeColor:null;
							typeof(op.strokeOpacity)!=="undefined"	?_op.strokeOpacity=op.strokeOpacity:null;
							typeof(op.strokeWeight)!=="undefined"	?_op.strokeWeight=op.strokeWeight:null;
							typeof(op.fillColor)!=="undefined"		?_op.fillColor=op.fillColor:null;
							typeof(op.fillOpacity)!=="undefined"		?_op.fillOpacity=op.fillOpacity:null;
					break;			
				case "polyline" :
							typeof(op.editable)!=="undefined"		?_op.editable=op.editable:null;
							typeof(op.geodesic)!=="undefined"		?_op.geodesic=op.geodesic:null;
							typeof(op.path)!=="undefined"		?_op.path=op.path:null;
							typeof(op.strokeColor)!=="undefined"		?_op.strokeColor=op.strokeColor:null;
							typeof(op.strokeOpacity)!=="undefined"	?_op.strokeOpacity=op.strokeOpacity:null;
							typeof(op.strokeWeight)!=="undefined"	?_op.strokeWeight=op.strokeWeight:null;
					break;				
				case "marker" :
							typeof(op.animation)!=="undefined"		?_op.animation=op.animation:null;
							typeof(op.cursor)!=="undefined"			?_op.cursor=op.cursor:null;
							typeof(op.draggable)!=="undefined"		?_op.draggable=op.draggable:null;
							typeof(op.flat)!=="undefined"		?_op.flat=op.flat:null;
							typeof(op.icon)!=="undefined"			?_op.icon=op.icon:null;
							typeof(op.optimized)!=="undefined"		?_op.optimized=op.optimized:null;
							typeof(op.position)!=="undefined"		?_op.position=op.position:null;					
							typeof(op.raiseOnDrag)!=="undefined"		?_op.raiseOnDrag=op.raiseOnDrag:null;					
							typeof(op.shadow)!=="undefined"			?_op.shadow=op.shadow:null;	
							typeof(op.shape)!=="undefined"			?_op.shape=op.shape:null;						
							typeof(op.title)!=="undefined"			?_op.title=op.title:null;	
					break;
			}
			return _op;
		},
	};


})(jQuery);