(function($,window) {
	var pageTracker = pageTracker || null;
	var needsMoved = needsMoved || 0;
	var InfoBox = InfoBox || null;	
	var i = i || 0;

	$.wsu_maps.infobox = {
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
			//var jObj = $.wsu_maps.state.map_jObj;
			//end of the bs that is well.. bs of a implamentation
			/* so need to remove this and create the class for it */
			var boxText = document.createElement("div");
			boxText.style.cssText = "border: 1px solid rgb(102, 102, 102); background: none repeat scroll 0% 0% rgb(226, 226, 226); padding: 2px; display: inline-block; font-size: 10px !important; font-weight: normal !important;";
			
			var acro = window._defined(marker.labels.prime_abbrev) && marker.labels.prime_abbrev !== ""  ? " (" +marker.labels.prime_abbrev + ")" : "";
			
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
			$.wsu_maps.state.ibh[i] = new window.InfoBox(myHoverOptions,function(){});
		},
		
		make_IW_resp:function(i){
			var IWpanels = $.wsu_maps.state.map_jObj.find(".ui-tabs .ui-tabs-panel");
			IWpanels.find(".content").width(( IWpanels.width()<400 ? IWpanels.width()-35:365 )+"px");	
			if(IWpanels.is(":not(.resp)")){
				$(window).resize(function(){
					$.wsu_maps.infobox.make_IW_resp();
				});
				IWpanels.addClass('resp');
			}
			var minHeight=0;
			$.each($('#taby'+i+' .ui-tabs-panel'),function() {
				minHeight = Math.max(minHeight, $(this).find('.content').height())+3; 
			}).css('min-height',minHeight); 
			$.wsu_maps.infobox.apply_scroller(minHeight);
		},
		build_options:function(marker,i,content){
			var options = {
				alignBottom:true,
				content: content,//boxText
				disableAutoPan: false,
				maxWidth: 0,
				height:"340px",
				pixelOffset: new google.maps.Size(-200, -($.wsu_maps.markers.defaults.height + 25)),
				zIndex: 999,
				boxStyle: {
					width: ($.wsu_maps.state.map_jObj.width()<425?$.wsu_maps.state.map_jObj.width()-25:400)+"px"
				},
				closeBoxHTML:content===""?"<i></i>":"<span class='tabedBox infoClose'>X</span>",
				infoBoxClearance: $.wsu_maps.is_frontend?new google.maps.Size(75,60):new google.maps.Size(1,50),
				isHidden: false,
				pane: "floatPane",
				enableEventPropagation: false,
				onClose:function(){
					$.wsu_maps.infobox.close_IW(marker,i);
				},
				onOpen:function(){
					$.wsu_maps.infobox.open_IW(marker,i);
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

			infoTitle =  $.runTemplate( $.wsu_maps.infobox.defaults.templates.info_title, { iw_id:(i+1), title:marker.labels.title + acro } );

			
			
			var prime_image = "";
			if( window._defined(marker.prime_image) ){
			
				var width = $.wsu_maps.infobox.defaults.overview.image.width;
				var height = $.wsu_maps.infobox.defaults.overview.image.height;
				if (marker.prime_image.orientation === "v") {
					width = $.wsu_maps.infobox.defaults.overview.image.height;
					height = $.wsu_maps.infobox.defaults.overview.image.width;
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
				prime_image = $.runTemplate( $.wsu_maps.infobox.defaults.templates.overview_image, params );
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
					var html_block = ( j<1 ? prime_image : "" ) + html.block;
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
			return $.runTemplate( $.wsu_maps.infobox.defaults.templates.window_content,{i:i,nav:nav,content:content});
		},
		make_InfoWindow:function (i,marker){
			//var jObj = $.wsu_maps.state.map_jObj;
			var content= $.wsu_maps.infobox.build_IW_content(marker,i);
			if(content===false){
				content = "";
			}
			/* so need to remove this and create the class for it 
			var boxText = document.createElement("div");
			boxText.style.cssText = "border: 1px solid black; margin-top: 8px; background: yellow; padding: 5px;";
			boxText.innerHTML = marker.content;*/
			var myOptions = $.wsu_maps.infobox.build_options(marker,i,content);
			$.wsu_maps.state.ib[i] = new window.InfoBox(myOptions,function(){
				//$('#taby'+i).tabs();
				//alert('tring to tab it, dabnab it, from the INI');
			});
			
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
			//var jObj = $.wsu_maps.state.map_jObj;
			if(!window._defined(marker.info) || $.isEmptyObject(marker.info) || !window._defined(marker.info.content) || $.isEmptyObject(marker.info.content)){
				marker=$.wsu_maps.infobox.build_infobox_markerobj(marker);
			}
			var mainimage = "";
			if($(".placeImages").length){
				mainimage = "<span class='headImage' rel='gouped'><a href='#' class='imgEnlarge'></a><img src='"+$.wsu_maps.state.siteroot+"media/download.castle?placeid=" + $("#place_id").val() + "&id=" + $(".placeImages").first().val() + "&m=crop&w=148&h=100' title='media/download.castle?placeid=" + $("#place_id").val() + "&id=" + $(".placeImages").first().val() + "' alt='Main Image' class='img-main'/></span>";
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
			var IW_options = $.wsu_maps.infobox.build_options(marker,0,box_content);
			$.wsu_maps.state.ib[0] = new window.InfoBox(IW_options,function(){});
			return marker;
		},
		close_IW:function(marker,i){
			$.wsu_maps.state.ibHover = false;
			$.wsu_maps.state.ibOpen = false;

			if(window._defined($.fn.cycle) && $('.cWrap .items li').length>1){
				$('.cWrap .items').cycle('destroy');
			}
			if(window._defined($.jtrack)){
				//$.jtrack.trackEvent(pageTracker,"infowindow","manually closed",marker.title);
			}
			if($('#taby'+i).length){
				$('#taby'+i).tabs('destroy').tabs();
			}
			$.wsu_maps.markers.unhighlight_marker($.wsu_maps.state.markerLog[i]);
			if($.wsu_maps.state.inview){
				$.wsu_maps.state.map_jObj.gmap('setOptions',$.wsu_maps.views.inital_options);	
			}
			$.wsu_maps.state.active.marker = null;
		},
		
		open_IW:function(marker,i){
			var jObj = $.wsu_maps.state.map_jObj;
			needsMoved=0;
			$.wsu_maps.state.ibHover =  true;
			if( !$('#taby'+i).is(':ui-tabs') ){
				$('#taby'+i).tabs({
					select: function(){//event, ui) {
						if(window._defined($.jtrack)){
							//$.jtrack.trackEvent(pageTracker,"infowindow tab",marker.title,$(ui.tab).text());
						}
					}
				});
			}
			$.wsu_maps.infobox.make_IW_resp(i);
			$.wsu_maps.infobox.init_img_cycler(marker);
			$.wsu_maps.infobox.contain_content_events();
			$.wsu_maps.infobox.init_img_modal(marker);
			$.wsu_maps.errors.addErrorReporting(marker);

			$('.ui-tabs-panel').hover(function(){
				$.wsu_maps.state.ib[i].setOptions({enableEventPropagation: true});
				jObj.gmap('stop_scroll_zoom');
			},function(){
				$.wsu_maps.state.ib[i].setOptions({enableEventPropagation: false});
				if($.wsu_maps.state.inview){
					$.wsu_maps.state.map_jObj.gmap('setOptions',$.wsu_maps.views.inital_options);	
				}else{
					jObj.gmap('set_scroll_zoom');
				}
			});

			$.wsu_maps.state.ib[i].rePosition();
			$.wsu_maps.state.ibHover =  false;
			if($.wsu_maps.state.active.marker !== null){
				$.wsu_maps.markers.unhighlight_marker($.wsu_maps.state.active.marker);
			}
			$.wsu_maps.markers.highlight_marker($.wsu_maps.state.markerLog[i]);
			$.wsu_maps.state.active.marker = $.wsu_maps.state.markerLog[i];

			//$.wsu_maps.general.prep_html();
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
				$.wsu_maps.state.api = pane.data('jsp');
			}
		},
		apply_panoramas:function(marker){
			var jObj = $.wsu_maps.state.map_jObj;
			var pano = jObj.gmap("getPanorama");
			

			google.maps.event.addListener(pano, 'visible_changed', function() {

				if(jObj.gmap("hasPanorama")){
					if($.wsu_maps.infobox.pano_init===false){
						$.wsu_maps.markers.init_street_view_markers();
						$.wsu_maps.infobox.pano_init=true;	
					}
					$.wsu_maps.state.in_pano=true;
				}else{
					$.wsu_maps.state.in_pano=false;
					if($.wsu_maps.infobox.pano_init===true){
						$.wsu_maps.markers.init_map_markers();
						$.wsu_maps.infobox.pano_init=false;	
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
				if($.wsu_maps.state.in_pano){
					$.wsu_maps.markers.init_map_markers();
				}
				$.wsu_maps.state.in_pano = false;
			}
		},
		pano_marker_click:function(marker){
			var jObj = $.wsu_maps.state.map_jObj;
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
					e.stopPropagation();
					e.preventDefault();	
					return false;
				});
			}
		},
		init_img_cycler:function(){//marker){
			if($('.cWrap .items li').length>1 && window._defined($.fn.cycle)){
				var currSlide=0; 
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
						currSlide = i; 
					},
					onPrevNextEvent:function(isNext){//,i,ele){
							if(isNext){
								if(window._defined($.jtrack)){
									//$.jtrack.trackEvent(pageTracker,"infowindow views", "next", marker.title);
								}
							}else{
								if(window._defined($.jtrack)){
									//$.jtrack.trackEvent(pageTracker,"infowindow views", "previous", marker.title);
								}
							}
						},
					
					pagerAnchorBuilder: function(idx){//, slide) {
						return '<li><a href="#" hidefocus="true">'+idx+'</a></li>';
					} 
				});
			}
		},
		init_img_modal:function(){//marker){
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
					onOpen:function(){
						if(window._defined($.jtrack)){
							//$.jtrack.trackEvent(pageTracker,"infowindow gallery", "opened", marker.title);
						}
					},
					onClosed:function(){
						if(window._defined($.jtrack)){
							//$.jtrack.trackEvent(pageTracker,"infowindow gallery", "closed", marker.title);
						}
						$('#colorbox #cb_nav').html("");
						$('#ttl').text(0);
						$('#ttl').text(1);
					},
					onComplete:function(){
						
						if($('#colorbox #cb_nav').length){
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
						}
					}
				});
			});
		},

		open_info:function (i){
			var jObj = $.wsu_maps.state.map_jObj;
			if($.wsu_maps.state.ib.length>0){
				$.each($.wsu_maps.state.ib, function(i) {
					if( window._defined($.wsu_maps.state.ib[i]) && $.wsu_maps.state.ib[i].opened === true){
						$.wsu_maps.state.ib[i].close();
					}
					jObj.gmap('setOptions', {'zIndex':1}, $.wsu_maps.state.markerLog[i]);
				});
				if(window._defined($.wsu_maps.state.ib[i])){
					$.wsu_maps.state.ib[i].open($.wsu_maps.state.map_inst, $.wsu_maps.state.markerLog[i],function(){
						$.wsu_maps.state.cur_mid = $.wsu_maps.state.mid[i];
					});
				}
				jObj.gmap('setOptions', {'zIndex':9}, $.wsu_maps.state.markerLog[i]);
				$('#selectedPlaceList_area .active').removeClass('active');
				$('#selectedPlaceList_area a:eq('+i+')').addClass('active');
				$.wsu_maps.state.cur_mid = $.wsu_maps.state.mid[i];
				if($('.layoutfree').length){
					$('.ui-tabs-panel .content a').on("click",function(e){
						e.stopPropagation();
						e.preventDefault();	
						return false;
					});
				}
			}
			$.wsu_maps.state.ibHover =  false;		
		},
		open_toolTip:function (i){
			//var jObj = $.wsu_maps.state.map_jObj;
			if($.wsu_maps.state.ibh.length>0){
				$.each($.wsu_maps.state.ibh, function(i) {
					if( window._defined($.wsu_maps.state.ibh[i]) && $.wsu_maps.state.ibh[i].opened === true ){
						$.wsu_maps.state.ibh[i].close();
					}
				});
				$('.infoBox').hover( 
					function() { $.wsu_maps.state.ibHover =  true; }, 
					function() { $.wsu_maps.state.ibHover =  false;  } 
				); 
				if($.wsu_maps.state.ibHover!==true && window._defined($.wsu_maps.state.ibh[i])){
					$.wsu_maps.state.ibh[i].open($.wsu_maps.state.map_inst, $.wsu_maps.state.markerLog[i]);
				}
			}
		},
		close_toolTips:function (){
			if($.wsu_maps.state.ibh.length>0){
				$.each($.wsu_maps.state.ibh, function(i) {
					if( window._defined($.wsu_maps.state.ibh[i]) && $.wsu_maps.state.ibh[i].opened === true){
						$.wsu_maps.state.ibh[i].close();
					}
				});
			}
		},
	};

})(jQuery,window);