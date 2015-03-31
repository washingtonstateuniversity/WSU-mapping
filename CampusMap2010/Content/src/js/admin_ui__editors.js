var campus_latlng_str=campus_latlng_str||"";
$.wsu_maps.admin.editors = {
	place:{},
	geometrics:{},
	media:{}
};
/*
 * EDITOR CONTORL SCRIPTS
 */
/*function addShapeToMap(i, shape){
	var pointHolder = {};
	if(shape.latlng_str!='' && shape.type==='polyline'){ 
		var pointHolder = {'path' : shape.latlng_str };
	}
	if(shape.latlng_str!='' && shape.type==='polygon'){ 
		var pointHolder = {'paths' : shape.latlng_str };
	}
	if(typeof(shape.encoded)!="undefined"){ 
		var pointHolder = {'paths' : shape.encoded };
	}
	if(typeof(shape.style)=="undefined"||shape.style==''){
		var style = shape.type=='polygon'? {'fillOpacity':.99,'fillColor':'#981e32','strokeColor':'#262A2D','strokeWeight':1}:{'strokeOpacity':.99,'strokeColor':'#262A2D','strokeWeight':2};
	}else{
		var style =  shape.style.events.rest;
	}
	if(!$.isEmptyObject(pointHolder)){
		var style = $.extend( style , pointHolder );
	}else{
		var style = {};
	}
	if(typeof(shape.style)=="undefined"||shape.style==''){
		$.wsu_maps.state.map_jObj.gmap('addShape',(shape.type[0].toUpperCase() + shape.type.slice(1)), style);
	}else{
		// $.wsu_maps.state.map_jObj.gmap('addShape',(shape.type[0].toUpperCase() + shape.type.slice(1)), style)
		var mapOjb = $.wsu_maps.state.map_jObj;
		mapOjb.gmap('addShape', (shape.type[0].toUpperCase() + shape.type.slice(1)), style, function(shape_obj){
		$(shape_obj).click(function(){
			if(typeof(shape.style.events.click)!="undefined" && shape.style.events.click != ""){
				mapOjb.gmap('setOptions',shape.style.events.click,this);
				if(typeof(shape.style.events.click.onEnd)!="undefined" && shape.style.events.click.onEnd != ""){
					jObj = mapOjb;
					eval(shape.style.events.click.onEnd.replace('\u0027',"'"));
				}
			}
		 }).mouseover(function(){
			 if(typeof(shape.style.events.mouseover)!="undefined" && shape.style.events.mouseover != ""){
				 mapOjb.gmap('setOptions',shape.style.events.mouseover,this);
				// if(style.mouseover.callback)style.mouseover.callback();
				if(typeof(shape.style.events.mouseover.onEnd)!="undefined" && shape.style.events.mouseover.onEnd != ""){
					jObj = mapOjb;
					eval(shape.style.events.mouseover.onEnd.replace('\u0027',"'"));
				}		
			 }
		}).mouseout(function(){
			if(typeof(shape.style.events.rest)!="undefined" && shape.style.events.rest != ""){
				mapOjb.gmap('setOptions',shape.style.events.rest,this);
				if(typeof(shape.style.events.rest.onEnd)!="undefined" && shape.style.events.rest.onEnd != ""){
					jObj = mapOjb;
					eval(shape.style.events.rest.onEnd.replace('\u0027',"'"));
				}
			}
		}).dblclick(function(){
			if(typeof(shape.style.events.dblclick)!="undefined" && shape.style.events.dblclick != ""){
				mapOjb.gmap('setOptions',shape.style.events.dblclick,this);
				//if(style.dblclick.callback)style.dblclick.callback();
			}
		})
		.trigger('mouseover')
		.trigger('mouseout');
		});
	}	
}
*/
/* ok yes repeat.. abstract this and make useable for front and back. */
/*
function open_info(jObj,i){
		$.each(ib, function(i) {
			ib[i].close();
			jObj.gmap('setOptions', {'zIndex':1}, markerLog[i]);
		});
		ib[i].open($.wsu_maps.state.map_inst, markerLog[i],function(){
				cur_mid = mid[i];
				//updateUrl(cur_nav,mid[i]);
			});
		jObj.gmap('setOptions', {'zIndex':9}, markerLog[i]);
		$('#selectedPlaceList_area .active').removeClass('active');
		$('#selectedPlaceList_area a:eq('+i+')').addClass('active');
		//cur_mid = _mid;
		//updateUrl(cur_nav,_mid);
		cur_mid = mid[i];
		ibHover =  false;	
}
function open_toolTip(jObj,i){
	$.each(ibh, function(i) {ibh[i].close();});
	$('.infoBox').hover( 
		function() { ibHover =  true; }, 
		function() { ibHover =  false;  } 
	); 
	if(ibHover!=true)ibh[i].open($.wsu_maps.state.map_inst, markerLog[i]);
}
function close_toolTips(){
	$.each(ibh, function(i) {ibh[i].close();});
}*/
//var needsMoved=0;
/*
function loadJsonData(jObj,data,callback,markerCallback){
	if(typeof(data.shapes)!=='undefined' && !$.isEmptyObject(data.shapes)){
		$.each( data.shapes, function(i, shape) {	
			if( !$.isEmptyObject(shape)){
				 addShapeToMap(i, shape)
			}
		});
	}
	if(typeof(data.markers)!=='undefined' &&  !$.isEmptyObject( data.markers )){
		var l = data.markers.length;
		//alert(l);
		$.each( data.markers, function(i, marker) {	
			if(typeof(marker.shapes)!=='undefined' && !$.isEmptyObject(marker.shapes)){
				$.each( marker.shapes, function(i, shape) {	
					if( !$.isEmptyObject(shape)){
						addShapeToMap(i, shape)
					}
				});
			}
			
			
			//alert(dump(marker));
			var _mid= marker.id;
			
			mid[i]=marker.id;
				if($.isArray(marker.info.content)){
					var nav='';
					$.each( marker.content, function(j, html) {	
						nav += '	<li class="ui-state-default ui-corner-top '+( j==0 ?'first ui-tabs-selected ui-state-active':'')+'"><a href="#tabs-'+j+'" hideFocus="true">'+html.title+'</a></li>';
					});
					var content='';
					$.each( marker.content, function(j, html) {
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
		
				
				var boxText = document.createElement("div");
				boxText.style.cssText = "border: 1px solid black; margin-top: 8px; background: yellow; padding: 5px;";
				boxText.innerHTML = marker.content;
		
		
				
		
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
								});/
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
							$.wsu_maps.general.prep_html();
						}
				};
				ib[i] = InfoBox(myOptions,function(){
					//$('#taby'+i).tabs();
					//alert('tring to tab it, dabnab it, from the INI');
				});
				//end of the bs that is well.. bs of a implamentation
				
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
				ibh[i] = InfoBox(myHoverOptions,function(){});
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
						$.wsu_maps.infobox.open_info(jObj,i);
					})
				.rightclick(function(event){$.wsu_maps.controlls.showContextMenu(event.latLng);})
				.mouseover(function(event){
					
					$.wsu_maps.infobox.open_toolTip(i);
					
				})
				.mouseout(function(event){
					$.wsu_maps.infobox.close_toolTips();
				});
				
				
				if(i==(l-1) && $.isFunction(callback)){
					//alert(l);
					//alert(i);
					callback();
				}
		});
		$.wsu_maps.geoLocate();
		
	}
	//if($.isFunction(callback))callback();return;
	
}*/