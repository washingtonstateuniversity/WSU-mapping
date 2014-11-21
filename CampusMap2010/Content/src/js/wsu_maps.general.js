(function($) {
	var pageTracker =pageTracker || null;
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
		
		apply_element:function (mapOjb,type,style){
			mapOjb.gmap('addShape', type, $.wsu_maps.general.filter_map_element(type,style.rest.options), function(shape){
				$(shape).click(function(){
					if(style.click){
						if(style.click.options){
							mapOjb.gmap('setOptions',$.wsu_maps.general.filter_map_element(type,style.click.options),this);
						}
						if(style.click.callback){
							style.click.callback();
						}
					}
				 }).mouseover(function(){
					 if(style.mouseover){
						 if(style.mouseover.options){
							 mapOjb.gmap('setOptions',$.wsu_maps.general.filter_map_element(type,style.mouseover.options),this);
						 }
						 if(style.mouseover.callback){
							 style.mouseover.callback();
						 }
					 }
				}).mouseout(function(){
					if(style.rest){
						if(style.rest.options){
							mapOjb.gmap('setOptions',$.wsu_maps.general.filter_map_element(type,style.rest.options),this);
						}
						if(style.rest.callback){
							style.rest.callback();
						}
					}
				}).dblclick(function(){
					if(style.dblclick){
						if(style.dblclick.options){
							mapOjb.gmap('setOptions',$.wsu_maps.general.filter_map_element(type,style.dblclick.options),this);
						}
						if(style.dblclick.callback){
							style.dblclick.callback();
						}
					}
				})
				.trigger('mouseover')
				.trigger('mouseout');
				
				//var placePos = mapOjb.gmap("get_map_center");
				
				if(typeof(shape)!=="undefined"){
					//mapOjb.gmap("move_shape",shape,placePos);
				}
				
				
			});
			/*,
			rightclick: function(){
				if(style.dblclick){
					if(style.rightclick.options)mapOjb.gmap('get','map').setCenter(filter_map_element(type,style.rightclick.options),this);
					if(style.rightclick.callback)style.hover.callback();
				}
			}*/
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
			var _option={};
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
						DEFAULT_overlay=$.wsu_maps.general.apply_element(mapSelector,capedType,_option);
		
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
						DEFAULT_overlay=$.wsu_maps.general.apply_element(mapSelector,capedType,_option);
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
					$.wsu_maps.general.apply_element(map,capedType,_option);*/

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
				$.wsu_maps.general.makeEmbeder();
			});
		},
		makeEmbeder:function (){
			$.colorbox({
				rel:'gouped',
				html:function(){
					
					return '<div id="embedArea">  <h2>Page Link</h2>  <h3 id="ebLink"><em id="linkurl">#</em></h3>  <div id="ebLink_con" style="position:relative; float:right;">  <div id="ebLink_but" class="my_clip_button"><b>Copy</b></div>  </div>  <hr style="clear:both;"/>  <h2> Embed code </h2>  <div id="custom">  <label>  <input type="radio" value="s" name="size"/>  Small <em>(214 x 161)</em></label>  <label>  <input type="radio" value="m" name="size"/>  Medium <em>(354 x 266)</em></label>  <label>  <input type="radio" checked="checked" name="size" value="l"/>  Large <em>(495 x 372)</em></label>  <label>  <input type="radio" name="size" value="xl"/>  Largest <em>(731 x 549)</em></label>  <label>  <input type="radio" value="c" name="size"/>  Custom</label>  <div id="cSize" style="display: none; font-size:12px;">Width:  <input id="w" value="" style="width:50px;" />px<br/>  Height  <input id="h" value=""  style="width:50px;" />px  </div>  </div>  <textarea id="embedCode" disabled="disabled"><iframe  width="495" height="372"  frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="#" ></iframe>  </textarea>  <div id="d_clip_container" style="position:relative; float:right;">  <div id="d_clip_button" class="my_clip_button"><b>Copy</b></div>  </div>  <hr style="clear:both;"/>  <a href="#" id="request">WSU units: Request access to create your own map. &raquo;</a></div>';	
				},
				scrolling:false,
				opacity:0.7,
				transition:"none",
				innerWidth:450,
				open:true,
				onClosed:function(){
					$('#colorbox').removeClass('norm');
				},
				onOpen:function(){$('#colorbox').addClass('norm');},
				onComplete:function(){
	
					var clip = new ZeroClipboard.Client();
					clip.setHandCursor( true );
					clip.setText($('#embedCode').text());
					clip.addEventListener('complete', function (){//client, text) {
						alert("Copied code to your clipboard: ");
					});
					clip.glue( 'd_clip_button', 'd_clip_container' );
			
					var clipL = new ZeroClipboard.Client();
					clipL.setHandCursor( true );
					clipL.setText($('#ebLink').text());
					clipL.addEventListener('complete', function (){//client, text) {
						alert("Copied link to your clipboard: ");
					});
					clipL.glue( 'ebLink_but', 'ebLink_con' );
					$.wsu_maps.getSmUrl("",function(url){
						$('#linkurl').text(url);
						clipL.setText(url);
					});
					$.wsu_maps.getSmUrl("eb=true",function(url){
						$('#embedCode').text('<iframe width="495" height="372" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="'+url+'" ></iframe>');
						clip.setText($('#embedCode').text());
					});
			
					$.colorbox.resize();
					$('input[name="size"]').off().on('change',function(){
						var val = $(this).val();
						function changeEmText(w,h){
							$.wsu_maps.getSmUrl("eb=true",function(url){
									var code = '<iframe width="'+w+'" height="'+h+'" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="'+url+'" ></iframe>';
									$('#embedCode').text(code);
									clip.setText(code);
							});
						}
						function dynoSize(){
							if(!$('#cSize').is(':visible')){
								$('#cSize').slideToggle('fast', function() {
								   $.colorbox.resize();
								});
							}
							$('#cSize input').off().on('keyup',function(){
								changeEmText($('#w').val(),$('#h').val());
							});
						}
						switch(val){
							case "s":
								if($('#cSize').is(':visible')){
									$('#cSize').slideToggle();
								}
								changeEmText(214,161);
								break;
							case "m":
								if($('#cSize').is(':visible')){
									$('#cSize').slideToggle();
								}
								changeEmText(354,266);
								break;
							case "l":
								if($('#cSize').is(':visible')){
									$('#cSize').slideToggle();
								}
								changeEmText(495,372);
								break;
							case "xl":
								if($('#cSize').is(':visible')){
									$('#cSize').slideToggle();
								}
								changeEmText(731,549);
								break;
							case "c":
								dynoSize();
								break;
						}
					});
					
					
					$.wsu_maps.general.makeRequestCustom();
				}
			});	
		},
		makeRequestCustom:function (){
			$('#request').off().on('click',function(){
				//$.colorbox.close();
				$.colorbox({
					html:function(){
						return '<div id="emailRequest"><form action="../public/emailRequest.castle" method="post">'+
									'<h2>Want to make your own map?</h2>'+
									'<h4>Please provide you email and as much information about your needs.</h4>'+
									'<lable>Your Name:<br/><input type="text" value="" required placeholder="First and Last" name="name"></lable><br/>'+
									'<lable>Your Email:<br/><input type="email" value="" required placeholder="Your email address" id="email" name="email"></lable><br/>'+
									'<lable>Deparment:<br/><select name="Deparments"><option value="">Select your department</option></select></lable><br/>'+
									'<lable>Notes on your needs: <br/>'+
									'<textarea required placeholder="Some notes" name="notes"></textarea></lable><br/>'+
									'<br/><input type="Submit" id="requestSubmit" value="Submit"/><br/>'+
									'<a href="#" id="embedback">&laquo; Back to custom embedding</a>'+
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
					onOpen:function(){
						$('#colorbox').addClass('norm');
					},
					onComplete:function(){
						$.wsu_maps.general.prep_html();
						if($('#colorbox #cb_nav').length){
							$('#colorbox #cb_nav').html("");
						}
						$.colorbox.resize();
						
						$.getJSON("/public/get_admindepartments_list.castle",function(data){
							$.each(data,function(i,val){
								$('[name="Deparments"]').append("<option value='"+val.name+"("+val.id+")'>"+val.name+"</option>");
							});
						});
						
						
						
						
						$('#embedback').off().on('click',function(){//e){
							$.wsu_maps.general.makeEmbeder();
						});
							
						$('#emailRequest [type="Submit"]').off().on('click',function(e){
							e.stopPropagation();
							e.preventDefault();
							$('#valid').remove();
							var valid=true;
							$.each($('#emailRequest [required]'),function(){
								if($(this).val()===""){
									valid=false;
								}
							});
							
							if(valid){
								$.post($('#emailRequest form').attr('action'), $('#emailRequest form').serialize(),function(data){
									if(data==="email:false"){
										$('#emailRequest').prepend("<div id='valid'><h3>Your email is not a valid email.  Please enter it again</h3></div>");
										$('#email').focus();
										$.colorbox.resize();
									}else{
										$('#emailRequest').html('<h2>You will recive an email shortly as a copy.</h2>'+'');
										$.colorbox.resize();
									}
								});
							}else{
								if($('#valid').length===0){
									$('#emailRequest').prepend("<div id='valid'><h3>Please completely fill out the form.</h3></div>");
								}
								$.colorbox.resize();
							}
						});
					}
				});
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
		
		addEmailDir:function (){
			$('#emailDir').off().on('click',function(e){
				e.stopPropagation();
				e.preventDefault();
				//var trigger=$(this);
				$.colorbox({
					html:function(){
						return '<div id="emailDirs"><form action="../public/emailDir.castle" method="post">'+
									'<h2>Want to email the directions?</h2>'+
									'<h4>Please provide you email and the email of the person you wish to send the directions to.</h4>'+
									'<textarea name="directions" style="position:absolute;top:-9999em;left:-9999em;">'+$('#directions-panel').html()+'</textarea>'+
									'<lable>Your Name:<br/><input type="text" value="" required placeholder="First and Last" name="name"></lable><br/>'+
									'<lable>Your Email:<br/><input type="email" value="" required placeholder="Your email address" id="email" name="email"></lable><br/>'+
									'<lable>Recipient Name:<br/><input type="text" value="" required placeholder="First and Last" name="recipientname"></lable><br/>'+
									'<lable>Recipient Email:<br/><input type="email" value="" required placeholder="Destination email address" id="recipientemail" name="recipientemail"></lable><br/>'+
									'<lable>Notes to recipient: <br/>'+
									'<textarea required placeholder="Some notes on the directions" name="notes"></textarea></lable><br/>'+
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
						$.colorbox.resize();	
						$('#emailDirs [type="Submit"]').off().on('click',function(e){
							e.stopPropagation();
							e.preventDefault();
							$('#valid').remove();
							var valid=true;
							$.each($('#emailDirs [required]'),function(){
								if($(this).val()===""){
									valid=false;
								}
							});
							
							if(valid){
								$.post($('#emailDirs form').attr('action'), $('#emailDirs form').serialize(),function(data){
									if(data==="email:false"){
										$('#emailDirs').prepend("<div id='valid'><h3>Your email is not a valid email.  Please enter it again</h3></div>");
										$('#email').focus();
										$.colorbox.resize();
									}else if(data==="recipientemail:false"){
										$('#emailDirs').prepend("<div id='valid'><h3>The recipient's email is not a valid email.  Please enter it again</h3></div>");
										$('#recipientemail').focus();
										$.colorbox.resize();
									}else{
										$('#emailDirs').html('<h2>You will recive an email shortly as a copy.</h2>'+'');
										$.colorbox.resize();
									}
								});
							}else{
								if($('#valid').length===0){
									$('#emailDirs').prepend("<div id='valid'><h3>Please completely fill out the form.</h3></div>");
								}
							}
						});
					}
				});
			});		
		},
		
		autoOpenListPanel:function (callback){
			$('#selectedPlaceList').removeClass('ini');
			if(!$('#selectedPlaceList_btn').is(':visible')){
				$('#selectedPlaceList_btn').css({'display':'block'});
				if($('.embeded').length===0){
					$('#selectedPlaceList_btn').trigger('click');
				}
			}
			if(typeof(callback)!=="undefined"){
				callback();
			}
		},
		
		loadListings:function (data,showSum){
			$('#selectedPlaceList').removeClass('ini');
			var listing="";
			if(data.markers.length>17){
				showSum=false;
			}
			$.each( data.markers, function(i, marker) {	
				if(typeof(marker.info)!=='undefined'){
					var sum="";
					
					if(typeof(marker.summary)!=='undefined' && !$.isEmptyObject(marker.summary)){
						sum='<div '+(showSum?'':'style="display:none;"')+'>'+marker.summary+'</div>';
					}
					var p_id = marker.id;
					listing+='<li class="">'+
								'<a href="#" class="" role="'+p_id+'"><img src="'+$.wsu_maps.state.siteroot+'Content/images/list_numbers/li_'+(i+1)+'.png"/>'+marker.title+'</a>'+
								sum+
							'</div>';
					$.wsu_maps.state.hasListing = false;
				}
			});
			if($('#selectedPlaceList_area #listing').length===0){
				$('#selectedPlaceList_area').append('<div id="listing" class="cAssest">');
			}
			$.wsu_maps.listings.destroy_Listscrollbar();
			$.wsu_maps.general.listTabs("locations");
			
			$('#selectedPlaceList_area #listing').html('<ul class="cAssest">'+listing+'</ul>');
			$.wsu_maps.listings.setup_Listscrollbar($('#listing'));
		
			
			
			
			
			
			$.each($('#selectedPlaceList_area #listing a'),function(i){//,v){
				var btn=$(this);
				btn.off().on('click',function(e){
					e.stopPropagation();
					e.preventDefault();
					if(!btn.is('active') && !btn.next('div').is(':visible')){// changed hasClass for is for speed
						//$('#selectedPlaceList_area .active').next('div').toggle('showOrHide');
						$('#selectedPlaceList_area .active').removeClass('active');
						//btn.next('div').toggle('showOrHide');
						btn.addClass('active');
					}
					$.each($.wsu_maps.state.ib, function(i){//,v) {
						$.wsu_maps.state.ib[i].close();
					});
					//var pid = btn.attr("role");
					$.wsu_maps.state.ib[i].open($('#centralMap').gmap('get','map'), $.wsu_maps.state.markerLog[i]);
					if(typeof($.jtrack)!=="undefined"){
						$.jtrack.trackEvent(pageTracker,"infowindow via place list", "opened",btn.text());
					}
					$.wsu_maps.state.cur_mid = $.wsu_maps.state.mid[i];
				});
			});
			google.maps.event.addListener($('#centralMap').gmap('get','map'), 'zoom_changed',function(){
					$('#selectedPlaceList_area .active').trigger('click');
				});
			
			
		},
		listTabs:function (prime){
			
			if($('#selectedPlaceList_area #listing').length>0 && $('#selectedPlaceList_area #directions-panel').length>0){
				if($('#selectedPlaceList_area #option').length===0){
					$('#selectedPlaceList_area').prepend('<ul id="option">');
				}
		
				if($('#selectedPlaceList_area #listing').length>0 && $('#selectedPlaceList_area #option #locations').length===0){
					$('#selectedPlaceList_area #option').append('<li id="locations">Locations</li>');
				}
				if($('#selectedPlaceList_area #directions-panel').length>0 && $('#selectedPlaceList_area #option #directions').length===0){
					$('#selectedPlaceList_area #option').append('<li id="directions">Directions</li>');
				}
				
				if($('#selectedPlaceList_area #option li').length>1){
					$('#selectedPlaceList_area #option li:first').addClass('DIVIT');	
				}else{
					$('#option .DIVIT').removeClass('DIVIT');	
				}
				if($('#option .active').length){
					$('#option .active').removeClass('active');
				}
				
				$('#locations').off().on('click',function(){
					$('#option .active').removeClass('active');
					$('#listing').show();
					$('#directions-panel').hide();
					$('#locations').addClass('active');
				});
				$('#directions').off().on('click',function(){
					$('#option .active').removeClass('active');
					$('#listing').hide();
					$('#directions-panel').show();
					$('#directions').addClass('active');
		
				});
				if(typeof(prime)!=="undefined" && prime!=null){
					if(prime==="locations"){
						$('#locations').trigger('click');
					}
					if(prime==="directions"){
						$('#directions').trigger('click');
					}
				}
			}else{
				if($('#selectedPlaceList_area #option').length>0){
					$('#selectedPlaceList_area #option').remove();
				}
			}
		
		},
		reset_listingarea:function (){
			$.wsu_maps.listings.destroy_Listscrollbar(function(){
				/* this may need to be restored
				$('#selectedPlaceList').width()>0?$('#selectedPlaceList_btn').trigger('click'):null;
				$('#selectedPlaceList').addClass('ini');
				$('#selectedPlaceList_area').html("");*/
				
				$('#listing').remove();
				$('#option').remove();
				
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