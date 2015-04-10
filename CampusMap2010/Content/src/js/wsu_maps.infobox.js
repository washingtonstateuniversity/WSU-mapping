(function($,window,WSU_MAP) {
	var pageTracker = pageTracker || null;
	var needsMoved = needsMoved || 0;
	var InfoBox = InfoBox || null;	
	var i = i || 0;
	$.extend( WSU_MAP, {
		infobox : {
			defaults:{
				templates:{
					window_content:'<div id="taby<%this.i%>" class="ui-tabs ui-widget ui-widget-content ui-corner-all"><ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all"> <%this.nav%> </ul> <%this.content%>',
					info_title:'<h2 class="header"><span class="iw_id"><%this.iw_id%></span><%this.title%></h2>',
					overview_image:"<a href='<%this.base_url%>' alt='<%this.alt%>' hidefocus='true' <%this.attr%>  class='<%this.linkclasses%>'> <span class='imgEnlarge'></span> <img src='<%this.base_url%><%this.img_url_options%>' rel='gouped' title='<%this.base_url%>' alt='<%this.alt%>' class='<%this.img_classes%>' width='<%this.img_width%>' height='<%this.img_height%>'/> </a>",
				},
				overview:{
					image:{
						height:75,
						width:135
					}
				}
			},
			pano_init : false,
			make_ToolTip:function (i,marker){
				var acro = window._defined(marker.labels.prime_abbrev) && marker.labels.prime_abbrev !== ""  ? " (" +marker.labels.prime_abbrev + ")" : "";
				var text = marker.labels.title + acro;
				if(text!==""){
					window._d("make tooltip");
					var boxText = document.createElement("div");
					boxText.style.cssText = "border: 1px solid rgb(102, 102, 102); background: none repeat scroll 0% 0% rgb(226, 226, 226); padding: 2px; display: inline-block; font-size: 10px !important; font-weight: normal !important;";
				
					boxText.innerHTML = "<h3 class='tooltip_title'>"+marker.labels.title + acro +"</h3>";
					var myHoverOptions = {
						alignBottom:true,
						content: boxText,
						pixelOffset: new google.maps.Size(35,-15),
						zIndex: 99999,
						boxStyle: {
							minWidth: "250px"
						},
						closeBoxURL:'',
						infoBoxClearance: new google.maps.Size(1, 1),
						isHidden: false,
						pane: "floatPane",
						boxClass:"hoverbox",
						enableEventPropagation: false,
						disableAutoPan:true,
						onOpen:function(){}
					};
					WSU_MAP.state.ibh[i] = new window.InfoBox(myHoverOptions,function(){});
				}
			},
			
			make_IW_resp:function(i){
				var IWpanels = WSU_MAP.state.map_jObj.find(".ui-tabs .ui-tabs-panel");
				IWpanels.find(".content").width(( IWpanels.width()<400 ? IWpanels.width()-35:365 )+"px");	
				if(IWpanels.is(":not(.resp)")){
					$(window).resize(function(){
						WSU_MAP.infobox.make_IW_resp();
					});
					IWpanels.addClass('resp');
				}
				var minHeight=0;
				$.each($('#taby'+i+' .ui-tabs-panel'),function() {
					minHeight = Math.max(minHeight, $(this).find('.content').height())+3; 
				}).css('min-height',minHeight); 
				WSU_MAP.infobox.apply_scroller(minHeight);
			},
			build_options:function(marker,i,content){
				var options = {
					alignBottom:true,
					content: content,//boxText
					disableAutoPan: false,
					maxWidth: 0,
					height:"340px",
					pixelOffset: new google.maps.Size(-200, -(WSU_MAP.markers.defaults.height + 15)),
					zIndex: 999,
					boxStyle: {
						width: (WSU_MAP.state.map_jObj.width()<425?WSU_MAP.state.map_jObj.width()-25:400)+"px"
					},
					closeBoxHTML:content===""?"<i></i>":"<span class='tabedBox infoClose'>X</span>",
					infoBoxClearance: WSU_MAP.is_frontend?new google.maps.Size(75,60):new google.maps.Size(1,50),
					isHidden: false,
					pane: "floatPane",
					enableEventPropagation: false,
					onClose:function(){
						WSU_MAP.infobox.close_IW(marker,i);
					},
					onOpen:function(){
						WSU_MAP.infobox.open_IW(marker,i);
					}
				};
				return options;
			},
			build_IW_content:function(marker,i){
				var nav='';
				var content='';
				//var empty = false;
				var infoTitle = "";
				var acro = window._defined(marker.labels.prime_abbrev) && marker.labels.prime_abbrev !== ""  ? " (" +marker.labels.prime_abbrev + ")" : "";
	
				infoTitle =  $.runTemplate( WSU_MAP.infobox.defaults.templates.info_title, { iw_id:(i+1), title:marker.labels.title + acro } );
	
				
				
				var prime_image = "";
				if( window._defined(marker.prime_image) ){
				
					var width = WSU_MAP.infobox.defaults.overview.image.width;
					var height = WSU_MAP.infobox.defaults.overview.image.height;
					if (marker.prime_image.orientation === "v") {
						width = WSU_MAP.infobox.defaults.overview.image.height;
						height = WSU_MAP.infobox.defaults.overview.image.width;
					}
		
					var params = {
						//i:i,nav:nav,content:content
						base_url:marker.prime_image.src,
						alt:( window._defined(marker.prime_image.caption) ? marker.prime_image.caption : "" ),
						attr:"rel='gouped'",
						linkclasses:"gouped headImage orientation_" + marker.prime_image.orientation + "",
						img_url_options:"&m=crop&w=" + width + "&h=" + height + "",
						img_classes:"gouped headImage orientation_" + marker.prime_image.orientation + "",
						img_width:width,
						img_height:height
					};
					prime_image = $.runTemplate( WSU_MAP.infobox.defaults.templates.overview_image, params );
				}
				
				if($.isArray(marker.content)){
					$.each( marker.content, function(j, html) {	
						nav += '	<li class="ui-state-default ui-corner-top '+( j===0 ?'first ui-tabs-selected ui-state-active':'')+'"><a href="#tabs-'+j+'" hideFocus="true">'+html.title+'</a></li>';
					});
					
					$.each( marker.content, function(j, html) {
						var title = html.title
										.split(' ').join('_')
										.split(' ').join('_')
										.split('\'').join('_')
										.split('/').join('_')
										.split('__').join('_');
						var hideTab = ( j>0 ?' display:none;' : '' );
						var html_block = ( j === 0 ? prime_image : "" ) + html.block;
						content += '<div id="tabs-'+j+'" class="ui-tabs-panel ui-widget-content ui-corner-bottom " style="'+hideTab+'"><div class="content '+title+'">'+(title !== 'Views'?infoTitle:'')+html_block+'</div><a class="errorReporting" href="?reportError=&place=' + marker.id + '" >Report&nbsp;&nbsp;error</a></div>';
					});				
				
				}else{
					var html_block = marker.content;
					if(html_block===""){
						return false;
					}
					nav = '	<li class="ui-state-default ui-corner-top  ui-tabs-selected ui-state-active first"><a href="#tabs-1" hideFocus="true">Overview</a></li>';
					content='<div id="tabs-" class="ui-tabs-panel ui-widget-content ui-corner-bottom  "><div class="content overview">'+infoTitle+prime_image+html_block+'</div><a class="errorReporting" href="?reportError=&place=' + marker.id + '" >Report&nbsp;&nbsp;error</a></div>';
				}
				return $.runTemplate( WSU_MAP.infobox.defaults.templates.window_content,{i:i,nav:nav,content:content});
			},
			make_InfoWindow:function (i,marker){
				//var jObj = WSU_MAP.state.map_jObj;
				var content= WSU_MAP.infobox.build_IW_content(marker,i);
				if(content===false){
					content = "";
				}
				/* so need to remove this and create the class for it 
				var boxText = document.createElement("div");
				boxText.style.cssText = "border: 1px solid black; margin-top: 8px; background: yellow; padding: 5px;";
				boxText.innerHTML = marker.content;*/
				var myOptions = WSU_MAP.infobox.build_options(marker,i,content);
				WSU_MAP.state.ib[i] = new window.InfoBox(myOptions,function(){
					//$('#taby'+i).tabs();
					//alert('tring to tab it, dabnab it, from the INI');
				});
				window._d("made infowindow");
			},
			build_infobox_markerobj:function(item){
				if(!window._defined(item.info)){
					item.info={};
				}
				if(!window._defined(item.info.content)){
					item.info.content=[];
				}
				var tabCount=$('#infotabs .ui-tabs-nav li').size();
				if(tabCount>1){
					$.each($('#infotabs .ui-tabs-nav li'),function(){//i,v){
						var liSelf=$(this);
							item.info.content.push({
								block:(function(){
										tinyMCE.triggerSave();
										var index=liSelf.index('#infotabs .ui-tabs-nav li');
										return $('#infotabs .ui-tabs-panel:eq('+index+')').find('textarea').val();
									})(),
								title:liSelf.find('a').text()
							});
						});
				}else{
					item.info.content=$('#infotabs .ui-tabs-panel:eq(0)').find('textarea').val();
				}
				return item;
			},
			build_infobox:function (marker,i){
				//var jObj = WSU_MAP.state.map_jObj;
				if(!window._defined(marker.info) || $.isEmptyObject(marker.info) || !window._defined(marker.info.content) || $.isEmptyObject(marker.info.content)){
					marker=WSU_MAP.infobox.build_infobox_markerobj(marker);
				}
				var mainimage = "";
				if($(".placeImages").length){
					mainimage = "<span class='headImage' rel='gouped'><a href='#' class='imgEnlarge'></a><img src='"+WSU_MAP.state.siteroot+"media/download.castle?placeid=" + $("#place_id").val() + "&id=" + $(".placeImages").first().val() + "&m=crop&w=148&h=100' title='media/download.castle?placeid=" + $("#place_id").val() + "&id=" + $(".placeImages").first().val() + "' alt='Main Image' class='img-main'/></span>";
				}
				var infoTitle = "";
				infoTitle = '<h2 class="header"><span class="iw_id">'+i+'</span>'+ $("#name").val() +'</h2>';
	
				var nav='';
				var content='';
				if($.isArray(marker.content)){
					
					$.each( marker.content, function(j, html) {	
						nav += '	<li class="ui-state-default ui-corner-top '+( j===0 ?'first ui-tabs-selected ui-state-active':'')+'"><a href="#tabs-'+j+'" hideFocus="true">'+html.title+'</a></li>';
					});
					
					$.each( marker.content, function(j, html) {
						content += '<div id="tabs-'+j+'" class="ui-tabs-panel ui-widget-content ui-corner-bottom  '+( j>0 ?' ui-tabs-hide':'')+'"><div class="content">'+infoTitle+(j===0?mainimage:'')+html.block+'</div></div>';
					});
				}else{
					nav = '	<li class="ui-state-default ui-corner-top  ui-tabs-selected ui-state-active first" ><a href="#tabs-1"  hideFocus="true">Overview</a></li>';
					content='<div id="tabs-" class="ui-tabs-panel ui-widget-content ui-corner-bottom  "><div class="content">'+infoTitle+mainimage+marker.content+'</div></div>';
				}
				var box_content='<div id="taby'+i+'" class="ui-tabs ui-widget ui-widget-content ui-corner-all">'+
						'<ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">'+nav+'</ul>'+
						content+
					'</div>';		
				var IW_options = WSU_MAP.infobox.build_options(marker,0,box_content);
				WSU_MAP.state.ib[0] = new window.InfoBox(IW_options,function(){});
				return marker;
			},
			close_IW:function(marker,i){
				WSU_MAP.state.ibHover = false;
				WSU_MAP.state.ibOpen = false;
	
				if(window._defined($.fn.cycle) && $('.cWrap .items li').length>1){
					$('.cWrap .items').cycle('destroy');
				}
				if(window._defined($.jtrack)){
					//$.jtrack.trackEvent(pageTracker,"infowindow","manually closed",marker.title);
				}
				if($('#taby'+i).length){
					$('#taby'+i).tabs('destroy').tabs();
				}
				WSU_MAP.markers.unhighlight_marker(WSU_MAP.state.markerLog[i]);
				if(WSU_MAP.state.inview){
					WSU_MAP.state.map_jObj.gmap('setOptions',WSU_MAP.views.inital_options);	
				}
				WSU_MAP.state.active.marker = null;
			},
			
			open_IW:function(marker,i){
				var jObj = WSU_MAP.state.map_jObj;
				needsMoved=0;
				WSU_MAP.state.ibHover =  true;
				if( !$('#taby'+i).is(':ui-tabs') ){
					$('#taby'+i).tabs({
						select: function(){//event, ui) {
							if(window._defined($.jtrack)){
								//$.jtrack.trackEvent(pageTracker,"infowindow tab",marker.title,$(ui.tab).text());
							}
						}
					});
				}
				WSU_MAP.infobox.make_IW_resp(i);
				WSU_MAP.infobox.init_img_cycler();
				WSU_MAP.infobox.contain_content_events();
				WSU_MAP.infobox.init_img_modal();
				WSU_MAP.errors.addErrorReporting(marker);
	
	
	
				$('.ui-tabs-panel').hover(function(){
					WSU_MAP.state.ib[i].setOptions({enableEventPropagation: true});
					jObj.gmap('stop_scroll_zoom');
				},function(){
					WSU_MAP.state.ib[i].setOptions({enableEventPropagation: false});
					if(WSU_MAP.state.inview){
						WSU_MAP.state.map_jObj.gmap('setOptions',WSU_MAP.views.inital_options);	
					}else{
						jObj.gmap('set_scroll_zoom');
					}
				});
	
				WSU_MAP.state.ib[i].rePosition();
				WSU_MAP.state.ibHover =  false;
				if(WSU_MAP.state.active.marker !== null){
					WSU_MAP.markers.unhighlight_marker(WSU_MAP.state.active.marker);
				}
				WSU_MAP.markers.highlight_marker(WSU_MAP.state.markerLog[i]);
				WSU_MAP.state.active.marker = WSU_MAP.state.markerLog[i];
					$(".open_marker").removeClass('open_marker');
					$("[src*='"+WSU_MAP.state.active.marker.marker_style.icon.url+"']").addClass('open_marker');
	
				//WSU_MAP.general.prep_html();
			},
			apply_scroller:function(minHeight){
				var settings = {
					verticalDragMinHeight: 50
					//showArrows: true
				};
				var pane = $('#campusmap .ui-tabs .ui-tabs-panel .content:not(".Views")');
				if(minHeight>235){
					pane.bind(
						'jsp-scroll-y',
						function(event, scrollPositionY, isAtTop, isAtBottom){
							//var isAtBottom= isAtBottom;	
							//var isAtTop= isAtTop;			
							pane.mousewheel(function(event,delta){ 
								//var media = $(this).find('.mediaPanel'); 
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
					WSU_MAP.state.api = pane.data('jsp');
				}
			},
			apply_panoramas:function(marker){
				var jObj = WSU_MAP.state.map_jObj;
				var pano = jObj.gmap("getPanorama");
				
	
				google.maps.event.addListener(pano, 'visible_changed', function() {
	
					if(jObj.gmap("hasPanorama")){
						if(WSU_MAP.infobox.pano_init===false){
							WSU_MAP.markers.init_street_view_markers();
							WSU_MAP.infobox.pano_init=true;	
						}
						WSU_MAP.state.in_pano=true;
					}else{
						WSU_MAP.state.in_pano=false;
						if(WSU_MAP.infobox.pano_init===true){
							WSU_MAP.markers.init_map_markers();
							WSU_MAP.infobox.pano_init=false;	
						}
					}
				});			
				
				if(jObj.gmap("hasPanorama")){
					
					pano.setPosition(new google.maps.LatLng(marker.marker_position.latitude, marker.marker_position.longitude));
					google.maps.event.addListener(pano, 'position_changed', function() {
						if(jObj.gmap("hasPanorama")){
							var pov = pano.getPov();
							var heading = google.maps.geometry.spherical.computeHeading(pano.getPosition(),new google.maps.LatLng(marker.marker_position.latitude, marker.marker_position.longitude));
							pov.heading = heading>360?(heading)-360:heading<0?(heading)+360:heading;
							pano.setPov(pov);
						}
					});
				}else{
					if(WSU_MAP.state.in_pano){
						WSU_MAP.markers.init_map_markers();
					}
					WSU_MAP.state.in_pano = false;
				}
			},
			pano_marker_click:function(marker){
				var jObj = WSU_MAP.state.map_jObj;
				var pano = jObj.gmap("getPanorama");
				window._d("position changing");
				pano.setPosition(new google.maps.LatLng(marker.marker_position.latitude, marker.marker_position.longitude));
				window._d(marker);
				google.maps.event.addListener(pano, 'position_changed', function() {
					window._d("position changed");
					var pov = pano.getPov();
					var heading = google.maps.geometry.spherical.computeHeading(pano.getPosition(),new google.maps.LatLng(marker.marker_position.latitude, marker.marker_position.longitude));
					pov.heading = heading>360?(heading)-360:heading<0?(heading)+360:heading;
					pano.setPov(pov);
					if(jObj.gmap("hasPanorama")){}
				});
			},
			contain_content_events:function(){
				$('.infoBox .ui-tabs-panel a').attr('target','_blank');
				$('.infoBox .ui-tabs-panel a[target="_blank"]:not(.ui-tabs-nav a,a[href="#"])').on('click',function(){
					if(window._defined($.jtrack)){
						//$.jtrack.trackEvent(pageTracker,"infowindow link", "clicked", $(this).attr('href'));
					}
				});
				if($('.layoutfree').length){
					$('.infoBox .ui-tabs-panel .content a').on("click",function(e){
						WSU_MAP.util.nullout_event(e);
						return false;
					});
				}
			},
			init_img_cycler:function(jObj,callbacks){//marker){
				jObj = jObj || $('body');
				var items = jObj.find('.cWrap .items');
				if(items.find('li').length>1 && window._defined($.fn.cycle)){
					var currSlide=0; 
					items.cycle('destroy');
					items.cycle({
						fx:     'scrollHorz',
						delay:  -2000,
						pauseOnPagerHover: 1,
						pause:1,
						timeout:0, 
						pager:'.cNav',
						prev: '.prev',
						next: '.next', 
						onPagerEvent:function(i){//,ele){
							if(currSlide-i<0){ 
								if(window._defined($.jtrack)){
									//$.jtrack.trackEvent(pageTracker,"infowindow views", "next", marker.title);
								}
							}else{ 
								if(window._defined($.jtrack)){
									//$.jtrack.trackEvent(pageTracker,"infowindow views", "previous", marker.title);
								}
							} 
							if(window._defined(callbacks) && window._defined(callbacks.onPagerEvent)){
								callbacks.onPagerEvent(i);
							}
							currSlide = i; 
						},
						onPrevNextEvent:function(isNext,i){//,ele){
								if(isNext){
									if(window._defined($.jtrack)){
										//$.jtrack.trackEvent(pageTracker,"infowindow views", "next", marker.title);
									}
								}else{
									if(window._defined($.jtrack)){
										//$.jtrack.trackEvent(pageTracker,"infowindow views", "previous", marker.title);
									}
								}
							if(window._defined(callbacks) && window._defined(callbacks.onPagerEvent)){
								callbacks.onPrevNextEvent(i,isNext);
							}
						},
						
						pagerAnchorBuilder: function(idx){//, slide) {
							return '<li><a href="#" hidefocus="true">'+idx+'</a></li>';
						} 
					});
				}
			},
			init_img_modal:function(){//marker){
				var img_area = $('.ui-tabs .ui-tabs-panel .content.Views');
				var imgs = img_area.html();
				if(window._defined(imgs)){
					imgs = imgs.split('<span class="imgEnlarge"></span>').join('');
					var html = $(imgs);
					$.each(html.find('.items a'),function(){
						$(this).find( 'img' ).attr( 'src', $(this).attr('href') ).attr( 'style', '' );
						$(this).replaceWith( $(this).html() );
					});
					$.each(html.find('li'),function(){
						$(this).attr('style','');
					});
	
					WSU_MAP.util.popup_message({
						html:html,
						show_close:true,
						width:$(window).width()*0.85,
						minWidth:$(window).width()*0.2,
						height:$(window).height()*0.85,
						minHeight:$(window).height()*0.2,
						autoOpen: false,
						onCreate:function(jObj){
							img_area.find('a').on('click',function(e){
								WSU_MAP.util.nullout_event(e);
								jObj.dialog("open");
							});
						},
						onOpen:function(jObj){
							WSU_MAP.infobox.init_img_cycler(jObj,{
								onPagerEvent:function(i){
									jObj.dialog( "option", "width", jObj.find('img').eq(i).width() );
									jObj.dialog( "option", "height", jObj.find('img').eq(i).height() );
								},
								onPrevNextEvent:function(i,isNext){
									var imgs = jObj.find('img');
									var idx = isNext ? i+1 : i-1;
									idx = idx<0 ? imgs.length-1 : (idx>imgs.length-1?0:idx);
									jObj.dialog( "option", "width", jObj.find('img').eq( idx ).width() );
									jObj.dialog( "option", "height", jObj.find('img').eq( idx ).height() );
								},
							});
							/*if($('#colorbox #cb_nav').length){
									$('#colorbox #cb_nav').html("");
								}
								if($('#ttl').length){
									var t=parseInt($('#ttl').text(), 10);
									var li="";
									if(t>1){
										for(var j=0; j<t; j++){
											li+="<li><a href='#'></a></li>";
										}
										if($('#colorbox #cb_nav').length===0){
											$('#cboxCurrent').after('<ul id="cb_nav">'+li+'</ul>');
										}else{
											$('#colorbox #cb_nav').html(li);
										}
									}
									if($('#colorbox #cb_nav').length){
										$('#colorbox #cb_nav .active').removeClass('active');
										$('#colorbox #cb_nav').find('li:eq('+ (parseInt($('#cboxCurrent #cur').text(), 10)-1) +')').addClass('active');
										if(needsMoved<0||needsMoved>0){
											//alert(needsMoved);
											if(needsMoved<0){
												$.colorbox.next();
												if(needsMoved===-1 && window._defined($.jtrack)){
													//$.jtrack.trackEvent(pageTracker,"infowindow gallery", "next", marker.title+' - media id:'+$('.cboxPhoto').attr('src').split('&id=')[1]);
												}
												needsMoved++;
											}else{
												$.colorbox.prev();
												if(needsMoved===1 && window._defined($.jtrack)){
													//$.jtrack.trackEvent(pageTracker,"infowindow gallery", "previous", marker.title+' - media id:'+$('.cboxPhoto').attr('src').split('&id=')[1]);
												}
												needsMoved--;
											}
										}
										$('#colorbox #cb_nav li').off().on('click',function(){
											var cur=(parseInt($('#cboxCurrent #cur').text(), 10)-1);
											var selected=$(this).index('#cb_nav li');
											var dif=cur-selected;
											needsMoved=dif;
											if(dif<0||dif>0){
												if(dif<0){
													$.colorbox.next();
													//if(dif>-2)//$.jtrack.trackEvent(pageTracker,"infowindow gallery", "next", marker.title);
													needsMoved++;
												}else{
													$.colorbox.prev();
													//if(dif<2)//$.jtrack.trackEvent(pageTracker,"infowindow gallery", "previous", marker.title);
													needsMoved--;
												}
											}
										});
										$('#cboxNext,#cboxLoadedContent').off('click.track').on('click.track',function(){
											if(window._defined($.jtrack)){
												//$.jtrack.trackEvent(pageTracker,"infowindow gallery", "next", marker.title+' - media id:'+$('.cboxPhoto').attr('src').split('&id=')[1]);
											}
										});
										$('#cboxPrevious').off('click.track').on('click.track',function(){
											if(window._defined($.jtrack)){
												//$.jtrack.trackEvent(pageTracker,"infowindow gallery", "previous", marker.title+' - media id:'+$('.cboxPhoto').attr('src').split('&id=')[1]);
											}
										});
									}
								}*/
						}
					});
				}
			},
	
			open_info:function (i){
				var jObj = WSU_MAP.state.map_jObj;
				if(WSU_MAP.state.ib.length>0){
					$.each(WSU_MAP.state.ib, function(i) {
						if( window._defined(WSU_MAP.state.ib[i]) && WSU_MAP.state.ib[i].opened === true){
							WSU_MAP.state.ib[i].close();
						}
						jObj.gmap('setOptions', {'zIndex':1}, WSU_MAP.state.markerLog[i]);
					});
					if(window._defined(WSU_MAP.state.ib[i])){
						WSU_MAP.state.ib[i].open(WSU_MAP.state.map_inst, WSU_MAP.state.markerLog[i],function(){
							WSU_MAP.state.cur_mid = WSU_MAP.state.mid[i];
						});
					}
					jObj.gmap('setOptions', {'zIndex':9}, WSU_MAP.state.markerLog[i]);
					$('#selectedPlaceList_area .active').removeClass('active');
					$('#selectedPlaceList_area a:eq('+(i+2)+')').addClass('active');
					WSU_MAP.state.cur_mid = WSU_MAP.state.mid[i];
					if($('.layoutfree').length){
						$('.ui-tabs-panel .content a').on("click",function(e){
							WSU_MAP.util.nullout_event(e);	
							return false;
						});
					}
				}
				WSU_MAP.state.ibHover =  false;		
			},
			open_toolTip:function (i){
				//var jObj = WSU_MAP.state.map_jObj;
				if(WSU_MAP.state.ibh.length>0){
					$.each(WSU_MAP.state.ibh, function(i) {
						if( window._defined(WSU_MAP.state.ibh[i]) && WSU_MAP.state.ibh[i].opened === true ){
							WSU_MAP.state.ibh[i].close();
						}
					});
					$('.infoBox').hover( 
						function() { WSU_MAP.state.ibHover =  true; }, 
						function() { WSU_MAP.state.ibHover =  false;  } 
					); 
					if(WSU_MAP.state.ibHover!==true && window._defined(WSU_MAP.state.ibh[i])){
						WSU_MAP.state.ibh[i].open(WSU_MAP.state.map_inst, WSU_MAP.state.markerLog[i]);
					}
				}
			},
			close_toolTips:function (){
				if(WSU_MAP.state.ibh.length>0){
					$.each(WSU_MAP.state.ibh, function(i) {
						if( window._defined(WSU_MAP.state.ibh[i]) && WSU_MAP.state.ibh[i].opened === true){
							WSU_MAP.state.ibh[i].close();
						}
					});
				}
			},
		}
	});
})(jQuery,window,jQuery.wsu_maps||(jQuery.wsu_maps={}));