(function($,window,WSU_MAP) {
	$.extend( WSU_MAP, {
		general : {
			prep_html:function (){
				$(' [placeholder]:not(.not) ').defaultValue();
				$.each($("a"),function() {
					$(this).attr("hideFocus", "true").css("outline", "none");
				});
			},
			
			
			
	
			loadData:function (data,markerCallback){
				window._d("loading data");
				//var jObj = WSU_MAP.state.map_jObj;
				if (window._defined(data.shapes) && !$.isEmptyObject(data.shapes)) {
				    window._d("loading shapes");
					$.each( data.shapes, function(i, shape) {
						if( window._defined(shape) && !$.isEmptyObject(shape)){
							WSU_MAP.shapes.addShapeToMap(i,shape);
						}
					});
					window._d("loaded shapes");
				}
				if (window._defined(data.markers) && !$.isEmptyObject(data.markers)) {
				    window._d(data.markers);
					WSU_MAP.state.displayedMarkers=[];
					//var l = data.markers.length;
					$.each( data.markers, function(idx, marker) {	
						if( window._defined(marker.shapes) && !$.isEmptyObject(marker.shapes)){
							$.each( marker.shapes, function(index, shape) {	
								if( window._defined(shape) && !$.isEmptyObject(shape)){
									WSU_MAP.shapes.addShapeToMap(idx,shape);
								}
							});
						}
						//alert(dump(marker));
						//var _mid= marker.id;
						WSU_MAP.state.mid[idx]=marker.id;
						//var pid = marker.id;
						//WSU_MAP.infobox.make_InfoWindow(idx,marker);
						//WSU_MAP.infobox.make_ToolTip(idx,marker);
						WSU_MAP.markers.make_Marker(idx,marker.id,marker,markerCallback);
						//WSU_MAP.state.map_jObj.trigger('wsu_maps:data_loaded_marker');
						/*if(idx===(data.markers.length-1) && $.isFunction(callback)){
							callback(marker);
						}*/
					});
					WSU_MAP.state.map_jObj.trigger('wsu_maps:data_loaded');
					var jObj = WSU_MAP.state.map_jObj;
					jObj.gmap('fitBoundsToVisibleMarkers',WSU_MAP.state.displayedMarkers, {height:jObj.height(),width:jObj.width()});
					
					
					if($('.mobile').length){
						//WSU_MAP.geoLocate();
					}
				}
				window._d("loaded data");
				//if($.isFunction(callback))callback();return;
			},
			
			setup_embeder:function (){
				$('#embed').off().on("click",function(e){
					WSU_MAP.util.nullout_event(e);
					WSU_MAP.general.makeEmbeder();
				});
			},
			makeEmbeder:function (){
				WSU_MAP.util.popup_message({
					html:'<div id="embedArea"><h2>Page Link</h2>  <h3 id="ebLink"><em id="linkurl">#</em></h3>  <div id="ebLink_con" style="position:relative; float:right;">  <div id="ebLink_but" class="my_clip_button"><b>Copy</b></div>  </div>  <hr style="clear:both;"/>  <h2> Embed code </h2>  <div id="custom">  <label>  <input type="radio" value="s" name="size"/>  Small <em>(214 x 161)</em></label>  <label>  <input type="radio" value="m" name="size"/>  Medium <em>(354 x 266)</em></label>  <label>  <input type="radio" checked="checked" name="size" value="l"/>  Large <em>(495 x 372)</em></label>  <label>  <input type="radio" name="size" value="xl"/>  Largest <em>(731 x 549)</em></label>  <label>  <input type="radio" value="c" name="size"/>  Custom</label>  <div id="cSize" style="display: none; font-size:12px;">Width:  <input id="w" value="" style="width:50px;" />px<br/>  Height  <input id="h" value=""  style="width:50px;" />px  </div>  </div>  <textarea id="embedCode" disabled="disabled"><iframe  width="495" height="372"  frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="#" ></iframe>  </textarea>  <div id="d_clip_container" style="position:relative; float:right;">  <div id="d_clip_button" class="my_clip_button"><b>Copy</b></div>  </div>  <hr style="clear:both;"/>  <a href="#" id="request">WSU units: Request access to create your own map. &raquo;</a></div>',
					show_close:true,
					maxWidth:$(window).width()*0.85,
					minWidth:$(window).width()*0.2,
					width:450,
					onCreate:function(){//jObj){
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
						WSU_MAP.getSmUrl("",function(url){
							$('#linkurl').text(url);
							clipL.setText(url);
						});
						WSU_MAP.getSmUrl("eb=true",function(url){
							$('#embedCode').text('<iframe width="495" height="372" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="'+url+'" ></iframe>');
							clip.setText($('#embedCode').text());
						});
						$('input[name="size"]').off().on('change',function(){
							var val = $(this).val();
							function changeEmText(w,h){
								WSU_MAP.getSmUrl("eb=true",function(url){
										var code = '<iframe width="'+w+'" height="'+h+'" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="'+url+'" ></iframe>';
										$('#embedCode').text(code);
										clip.setText(code);
								});
							}
							function dynoSize(){
								if(!$('#cSize').is(':visible')){
									$('#cSize').slideToggle('fast', function() {
									   //$.colorbox.resize();
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
						WSU_MAP.general.makeRequestCustom();	
					}
				});
			},
			makeRequestCustom:function (){
				$('#request').off().on('click',function(e){
					WSU_MAP.util.nullout_event(e);
					WSU_MAP.util.popup_message({
						html:'<div id="emailRequest"><form action="../public/emailRequest.castle" method="post">'+
										'<h1>Custom Map Request</h1><br/>'+
										'<lable>Name:<br/><input type="text" value="" required placeholder="First and Last" name="name"></lable><br/>'+
										'<lable>Email:<br/><input type="email" value="" required placeholder="Your email address" id="email" name="email"></lable><br/>'+
										'<lable>Deparment:<br/><select name="Deparments"><option value="">Select your department</option></select></lable><br/>'+
										'<lable>Custom map discription: <br/>'+
										'<textarea required placeholder="Some notes" name="notes"></textarea></lable><br/>'+
										'<h4>Please provide as much detail as possible when submitting your request. We will contact you soon with an update or any questions.</h4>'+
										'<br/><input type="Submit" id="requestSubmit" value="Submit"/><br/>'+
										'<a href="#" id="embedback">&laquo; Back to custom embedding</a>'+
									'</from></div>',
						maxWidth:$(window).width()*0.85,
						minWidth:$(window).width()*0.2,
						width:450,
						onCreate:function(){//jObj){
							WSU_MAP.general.prep_html();
							$.getJSON("/public/get_admindepartments_list.castle",function(data){
								$.each(data,function(i,val){
									$('[name="Deparments"]').append("<option value='"+val.name+"("+val.id+")'>"+val.name+"</option>");
								});
							});
							$('#embedback').off().on('click',function(e){
								WSU_MAP.util.nullout_event(e);
								WSU_MAP.general.makeEmbeder();
							});
							$('#emailRequest [type="Submit"]').off().on('click',function(e){
								WSU_MAP.util.nullout_event(e);
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
										}else{
											$('#emailRequest').html('<h2>You will recive an email shortly as a copy.</h2>'+'');
										}
									});
								}else{
									if($('#valid').length===0){
										$('#emailRequest').prepend("<div id='valid'><h3>Please completely fill out the form.</h3></div>");
									}
								}
							});
						}
					});
				});
				
			},

		}
	});
})(jQuery,window,jQuery.wsu_maps||(jQuery.wsu_maps={}));