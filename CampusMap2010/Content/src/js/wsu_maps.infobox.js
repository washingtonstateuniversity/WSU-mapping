(function($) {
	var pageTracker = pageTracker || null;
	var needsMoved = needsMoved || 0;
	var InfoBox = InfoBox || null;	
	var i = i || 0;

	$.wsu_maps.infobox = {
		pano_init : false,
		make_ToolTip:function (jObj,i,marker){
			//end of the bs that is well.. bs of a implamentation
			/* so need to remove this and create the class for it */
			var boxText = document.createElement("div");
			boxText.style.cssText = "border: 1px solid rgb(102, 102, 102); background: none repeat scroll 0% 0% rgb(226, 226, 226); padding: 2px; display: inline-block; font-size: 10px !important; font-weight: normal !important;";
			boxText.innerHTML = "<h3 style='font-weight: normal !important; padding: 0px; margin: 0px;'>"+marker.title+"</h3>";
			var myHoverOptions = {
				alignBottom:true,
				content: boxText,
				pixelOffset: new google.maps.Size(35,-15),
				zIndex: 99999,
				boxStyle: {
					minWidth: "250px"
				},
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
			var IWpanels = $.wsu_maps.state.mapInst.find(".ui-tabs .ui-tabs-panel");
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
		build_options:function(jObj,marker,i,content){
			var options = {
				alignBottom:true,
				content: content,//boxText
				disableAutoPan: false,
				maxWidth: 0,
				height:"340px",
				pixelOffset: new google.maps.Size(-200, -75),
				zIndex: 999,
				boxStyle: {
					width: ($.wsu_maps.state.mapInst.width()<425?$.wsu_maps.state.mapInst.width()-25:400)+"px"
				},
				closeBoxHTML:"<span class='tabedBox infoClose'></span>",
				infoBoxClearance: $.wsu_maps.is_frontend?new google.maps.Size(75,60):new google.maps.Size(1,50),
				isHidden: false,
				pane: "floatPane",
				enableEventPropagation: false,
				onClose:function(){
					$.wsu_maps.infobox.close_IW(marker,i);
				},
				onOpen:function(){
					$.wsu_maps.infobox.open_IW(jObj,marker,i);
					/*note from backend, so may need to port something, remove when done */
					/*$.wsu_maps.state.ibOpen = true;
					$.wsu_maps.state.ibHover = true;
					if($(".cWrap").length){
						$('.cWrap a.gouped').on('click',function(e){
							e.preventDefault();
							e.stopImmediatePropagation();
							$('.cWrap a.gouped').colorbox({
								photo:true,
								scrolling:false,
								opacity:0.7,
								transition:"none",
								width:"75%",
								height:"75%",
								slideshow:true,
								slideshowAuto:false,
								open:true
							});
						});
						$('.cWrap .items').cycle({
							fx: 'scrollLeft',
							delay: -2000,
							pauseOnPagerHover: 1,
							pause:1,
							pager:'.cNav',
							prev: '.prev',
							next: '.next', 
							pagerAnchorBuilder: function(idx){//, slide) {
								 return '<li><a href="#" hidefocus="true">'+idx+'</a></li>';
							} 
						});
						$.wsu_maps.general.prep_html();
					}
					$('#taby'+i).tabs();
					var minHeight=0;
					$.each($('#taby'+i+' .ui-tabs-panel'),function() {
						minHeight = Math.max(minHeight, $(this).find('.content').height()); 
					}).css('min-height',minHeight); 
					$('#taby'+i).hover(function(){
						$.wsu_maps.state.ib[0].setOptions({enableEventPropagation: true});
					},function(){
						$.wsu_maps.state.ib[0].setOptions({enableEventPropagation: false});
					});
					$.wsu_maps.state.ib[0].rePosition();*/
				}
			};
			return options;
		},

		
		build_IW_content:function(marker,i){
			var nav='';
			var content='';
			
			var infoTitle = "";
			infoTitle = '<h2 class="header"><span class="iw_id">'+(i+1)+'</span>'+ marker.title +'</h2>';
			
			
			if($.isArray(marker.info.content)){
				$.each( marker.info.content, function(j, html) {	
					nav += '	<li class="ui-state-default ui-corner-top '+( j===0 ?'first ui-tabs-selected ui-state-active':'')+'"><a href="#tabs-'+j+'" hideFocus="true">'+html.title+'</a></li>';
				});
				
				$.each( marker.info.content, function(j, html) {
					var title = html.title.replace(' ','_').replace("'",'_').replace('/','_');
					var hideTab = ( j>0 ?' display:none;':'');
					var re = /<h2 class='header'>.*<\/h2>/gmi; 
					var html_block = html.block.replace(re,'');
					content += '<div id="tabs-'+j+'" class="ui-tabs-panel ui-widget-content ui-corner-bottom " style="'+hideTab+'"><div class="content '+title+'">'+infoTitle+html_block+'</div><a class="errorReporting" href="?reportError=&place=' + marker.id + '" >Report&nbsp;&nbsp;error</a></div>';
				});				
			
			}else{
				nav = '	<li class="ui-state-default ui-corner-top  ui-tabs-selected ui-state-active first"><a href="#tabs-1" hideFocus="true">Overview</a></li>';
				content='<div id="tabs-" class="ui-tabs-panel ui-widget-content ui-corner-bottom  "><div class="content overview">'+marker.info.content+'</div><a class="errorReporting" href="?reportError=&place=' + marker.id + '" >Report&nbsp;&nbsp;error</a></div>';
			}
			var tmpl='<div id="taby<%this.i%>" class="ui-tabs ui-widget ui-widget-content ui-corner-all"><ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all"> <%this.nav%> </ul> <%this.content%>'+
			'</div>';
			return $.runTemplate(tmpl,{i:i,nav:nav,content:content});
		},
		make_InfoWindow:function (jObj,i,marker){
			var content= $.wsu_maps.infobox.build_IW_content(marker,i);
		
			/* so need to remove this and create the class for it */
			var boxText = document.createElement("div");
			boxText.style.cssText = "border: 1px solid black; margin-top: 8px; background: yellow; padding: 5px;";
			boxText.innerHTML = marker.info.content;
			var myOptions = $.wsu_maps.infobox.build_options(jObj,marker,i,content);
			$.wsu_maps.state.ib[i] = new window.InfoBox(myOptions,function(){
				//$('#taby'+i).tabs();
				//alert('tring to tab it, dabnab it, from the INI');
			});
		},
		build_infobox_markerobj:function(item){
			if(typeof(item.info)==='undefined'){
				item.info={};
			}
			if(typeof(item.info.content)==='undefined'){
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
		build_infobox:function (jObj,marker,i){
			if(typeof(marker.info)==='undefined' || $.isEmptyObject(marker.info) || typeof(marker.info.content)==='undefined' || $.isEmptyObject(marker.info.content)){
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
			if($.isArray(marker.info.content)){
				
				$.each( marker.info.content, function(j, html) {	
					nav += '	<li class="ui-state-default ui-corner-top '+( j===0 ?'first ui-tabs-selected ui-state-active':'')+'"><a href="#tabs-'+j+'" hideFocus="true">'+html.title+'</a></li>';
				});
				
				$.each( marker.info.content, function(j, html) {
					content += '<div id="tabs-'+j+'" class="ui-tabs-panel ui-widget-content ui-corner-bottom  '+( j>0 ?' ui-tabs-hide':'')+'"><div class="content">'+infoTitle+(j===0?mainimage:'')+html.block+'</div></div>';
				});
			}else{
				nav = '	<li class="ui-state-default ui-corner-top  ui-tabs-selected ui-state-active first" ><a href="#tabs-1"  hideFocus="true">Overview</a></li>';
				content='<div id="tabs-" class="ui-tabs-panel ui-widget-content ui-corner-bottom  "><div class="content">'+infoTitle+mainimage+marker.info.content+'</div></div>';
			}
			var box_content='<div id="taby'+i+'" class="ui-tabs ui-widget ui-widget-content ui-corner-all">'+
					'<ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">'+nav+'</ul>'+
					content+
				'</div>';		
			var IW_options = $.wsu_maps.infobox.build_options(jObj,marker,0,box_content);
			$.wsu_maps.state.ib[0] = new window.InfoBox(IW_options,function(){});
			return marker;
		},
		close_IW:function(marker,i){
			$.wsu_maps.state.ibHover = false;
			$.wsu_maps.state.ibOpen = false;

			if(typeof($.fn.cycle)!=="undefined" && $('.cWrap .items li').length>1){
				$('.cWrap .items').cycle('destroy');
			}
			if(typeof($.jtrack)!=="undefined"){
				//$.jtrack.trackEvent(pageTracker,"infowindow","manually closed",marker.title);
			}
			if($('#taby'+i).length){
				$('#taby'+i).tabs('destroy').tabs();
			}
		},
		
		open_IW:function(jObj,marker,i){			
			$.wsu_maps.infobox.apply_panoramas(jObj,marker);

			needsMoved=0;
			$.wsu_maps.state.ibHover =  true;
			if( !$('#taby'+i).is(':ui-tabs') ){
				$('#taby'+i).tabs({
					select: function(){//event, ui) {
						if(typeof($.jtrack)!=="undefined"){
							//$.jtrack.trackEvent(pageTracker,"infowindow tab",marker.title,$(ui.tab).text());
						}
					}
				});
			}
			$.wsu_maps.infobox.make_IW_resp(i);
			$.wsu_maps.infobox.init_img_cycler(marker);
			$.wsu_maps.infobox.contain_content_events();
			$.wsu_maps.infobox.init_img_modal(marker);
			$.wsu_maps.general.addErrorReporting(marker);

			$('.ui-tabs-panel').hover(function(){
				$.wsu_maps.state.ib[i].setOptions({enableEventPropagation: true});
				jObj.gmap('stop_scroll_zoom');
			},function(){
				$.wsu_maps.state.ib[i].setOptions({enableEventPropagation: false});
				jObj.gmap('set_scroll_zoom');
			});
			$.wsu_maps.state.ib[i].rePosition();
			$.wsu_maps.state.ibHover =  false;


			
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
		apply_panoramas:function(jObj,marker){
			
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
				
				pano.setPosition(new google.maps.LatLng(marker.position.latitude, marker.position.longitude));
				google.maps.event.addListener(pano, 'position_changed', function() {
					if(jObj.gmap("hasPanorama")){
						var pov = pano.getPov();
						var heading = google.maps.geometry.spherical.computeHeading(pano.getPosition(),new google.maps.LatLng(marker.position.latitude, marker.position.longitude));
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
		contain_content_events:function(){
			$('.infoBox .ui-tabs-panel a').attr('target','_blank');
			$('.infoBox .ui-tabs-panel a[target="_blank"]:not(.ui-tabs-nav a,a[href="#"])').on('click',function(){
				if(typeof($.jtrack)!=="undefined"){
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
			if($('.cWrap .items li').length>1 && typeof($.fn.cycle)!=="undefined"){
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
							if(typeof($.jtrack)!=="undefined"){
								//$.jtrack.trackEvent(pageTracker,"infowindow views", "next", marker.title);
							}
						}else{ 
							if(typeof($.jtrack)!=="undefined"){
								//$.jtrack.trackEvent(pageTracker,"infowindow views", "previous", marker.title);
							}
						} 
						currSlide = i; 
					},
					onPrevNextEvent:function(isNext){//,i,ele){
							if(isNext){
								if(typeof($.jtrack)!=="undefined"){
									//$.jtrack.trackEvent(pageTracker,"infowindow views", "next", marker.title);
								}
							}else{
								if(typeof($.jtrack)!=="undefined"){
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
						if(typeof($.jtrack)!=="undefined"){
							//$.jtrack.trackEvent(pageTracker,"infowindow gallery", "opened", marker.title);
						}
					},
					onClosed:function(){
						if(typeof($.jtrack)!=="undefined"){
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
										if(needsMoved===-1 && typeof($.jtrack)!=="undefined"){
											//$.jtrack.trackEvent(pageTracker,"infowindow gallery", "next", marker.title+' - media id:'+$('.cboxPhoto').attr('src').split('&id=')[1]);
										}
										needsMoved++;
									}else{
										$.colorbox.prev();
										if(needsMoved===1 && typeof($.jtrack)!=="undefined"){
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
									if(typeof($.jtrack)!=="undefined"){
										//$.jtrack.trackEvent(pageTracker,"infowindow gallery", "next", marker.title+' - media id:'+$('.cboxPhoto').attr('src').split('&id=')[1]);
									}
								});
								$('#cboxPrevious').off('click.track').on('click.track',function(){
									if(typeof($.jtrack)!=="undefined"){
										//$.jtrack.trackEvent(pageTracker,"infowindow gallery", "previous", marker.title+' - media id:'+$('.cboxPhoto').attr('src').split('&id=')[1]);
									}
								});
							}
						}
					}
				});
			});
		},
		
		
		
		
		
		open_info:function (jObj,i){//,marker){
			if($.wsu_maps.state.ib.length>0){
				$.each($.wsu_maps.state.ib, function(i) {
					$.wsu_maps.state.ib[i].close();
					jObj.gmap('setOptions', {'zIndex':1}, $.wsu_maps.state.markerLog[i]);
				});
				if(typeof($.wsu_maps.state.ib[i])!=="undefined"){
					$.wsu_maps.state.ib[i].open(jObj.gmap('get','map'), $.wsu_maps.state.markerLog[i],function(){
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
		open_toolTip:function (jObj,i){
			if($.wsu_maps.state.ibh.length>0){
				$.each($.wsu_maps.state.ibh, function(i) {$.wsu_maps.state.ibh[i].close();});
				$('.infoBox').hover( 
					function() { $.wsu_maps.state.ibHover =  true; }, 
					function() { $.wsu_maps.state.ibHover =  false;  } 
				); 
				if($.wsu_maps.state.ibHover!==true && typeof($.wsu_maps.state.ibh[i])!=="undefined"){
					$.wsu_maps.state.ibh[i].open(jObj.gmap('get','map'), $.wsu_maps.state.markerLog[i]);
				}
			}
		},
		close_toolTips:function (){
			if($.wsu_maps.state.ibh.length>0){
				$.each($.wsu_maps.state.ibh, function(i) {$.wsu_maps.state.ibh[i].close();});
			}
		},
	};

})(jQuery);