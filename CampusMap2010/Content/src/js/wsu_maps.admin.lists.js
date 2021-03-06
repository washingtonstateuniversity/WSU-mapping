(function($,window,WSU_MAP) {
	$.extend( WSU_MAP.admin , {
		lists : {
			ini:function(){
				
				//WSU_MAP.admin.build_general_removal_button($( "a[title='Delete']" ));
				/*if($( "a[title='Delete']" ).length>0){
					var deleteing='';
					var name='';
					if($( "#deleteModule" ).length===0){
						$( "body" ).append('<div id="deleteModule" title="Deleting"><h2 class="ui-state-error ui-corner-all"><span style="float: left; margin-right: .3em;margin-top:15px;margin-bottom:15px;" class="ui-icon ui-icon-alert"></span>Are you sure you<br/>wish to delete <span id="tar_item"></span>?</h2></div>');
					}
					$( "a[title='Delete']" ).on('click',function(e) {
						WSU_MAP.util.nullout_event(e);
						deleteing=$(this).attr('href');
						name=$(this).closest('tr').find('.name').html();
						$('#tar_item').html(name!==''&&name!=='undfinded'?name:'this');
						$( "#deleteModule" ).dialog( "open" );
					});
					$( "#deleteModule" ).dialog({
						autoOpen: false,
						height:225,
						width:400,
						modal: true,
						hide: 'blind',
						resizable: false,
						draggable: false,
						buttons: {
							"Delete": function() {
								$( "a[title='Delete'].ui-state-focus" ).removeClass('ui-state-focus'); 
								window.location = deleteing;
							},
							Cancel: function() {
								$( "a[title='Delete'].ui-state-focus" ).removeClass('ui-state-focus'); 
								$( this ).dialog( "close" );
							}
						}
					});
				}*/
				
				
				/* note this is for the gem area only */
				if($('a[href$="/geometrics/new.castle"]').length){
					$('a[href$="/geometrics/new.castle"]').on('click',function(e){
						WSU_MAP.util.nullout_event(e);
						
						if($( "#choosegType" ).length===0){
							$( "body" ).append('<div id="choosegType" title="Choose the place model">'+
							'<p><strong>Choose a type</strong>'+
							'that the style will be for.</p>'+
							'</div>');
						}
						$("#choosegType").dialog({
							autoOpen: true,
							height: 275,
							width:350,
							modal: true,
							hide: 'blind',
							resizable: false,
							draggable: false,
							buttons: {
								/*"Marker": function() {
									window.location = "/geometrics/new.castle?type=1"
								},*/
								"Polyline": function() {
									window.location = "/geometrics/new.castle?type=2";
								},
								"Polygon": function() {
									window.location = "/geometrics/new.castle?type=3";
								}/*,
								"Rectangle": function() {
									window.location = "/geometrics/new.castle?type=4"
								},
								"Circle": function() {
									window.location = "/geometrics/new.castle?type=5"
								}*/
							}
						});
					});
				}
				if($('a[href$="/geometrics/new_style.castle"]').length){
					$('a[href$="/geometrics/new_style.castle"]').on('click',function(e){
						WSU_MAP.util.nullout_event(e);
						
						if($( "#chooseSType" ).length===0){
							$( "body" ).append('<div id="chooseSType" title="Choose the place model">'+
							'<p><strong>Choose a type</strong>'+
							'that the style will be for.</p>'+
							'</div>');
						}
						$("#chooseSType").dialog({
							autoOpen: true,
							height: 275,
							width:350,
							modal: true,
							hide: 'blind',
							resizable: false,
							draggable: false,
							buttons: {
								/*"Marker": function() {
									window.location = "/geometrics/new_style.castle?type=1"
								},*/
								"Polyline": function() {
									window.location = "/geometrics/new_style.castle?type=2";
								},
								"Polygon": function() {
									window.location = "/geometrics/new_style.castle?type=3";
								}/*,
								"Rectangle": function() {
									window.location = "/geometrics/new_style.castle?type=4"
								},
								"Circle": function() {
									window.location = "/geometrics/new_style.castle?type=5"
								}*/
							}
						});
					});
				}
			},
			post_tmp:function(form_obj){//,diaObj,callback){
				$.ajaxSetup ({cache: false,async:false}); 
				//var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
		
				$.post(form_obj.attr('action')+'?apply=Save', form_obj.serialize(), function(res){//, status, request) {
					var Location = '/place/_edit.castle?id='+res; 
					
					window.location= Location; 
					$('body #content_area').fadeTo('fast',25);
				});
			},
			addLiveActionAnimation:function(){
				if($( ".buttons" ).length > 0){
					$( ".buttons" ).button({text:false});
				}
				$('div.actionCol a').hover(
					function(){
						$(this).find('.actionText').stop().animate({width: '100%'}, 500, function() {});
						$(this).stop().animate({width:85}, 500, function() {});
						$(this).find('.actionpropt').stop().animate({width: 0}, 250, function() {});
					},
					function(){
						$(this).find('.actionText').stop().animate({width: 0}, 250, function() {});
						$(this).stop().animate({width:37}, 250, function() {});
						$(this).find('.actionpropt').stop().animate({width: 10}, 250, function() {});
					}
				);	
				
			},
			pagLoad:function(){
				if($('.ui-tabs-panel .pagination').length){
					$.each($('.pagination'),function(){
						var self = $(this);
						var panleId = self.closest('.ui-tabs-panel').attr('id');
						self.find('a').on('click',function(e){
							WSU_MAP.util.nullout_event(e);
							$('body').append('<h1 style="position:fixed; top:25%; left:45%; z-index:9999;text-align: center;" id="loading"><img src="../Content/images/loading.gif"/></br>Loading</h1>');
							$.ajaxSetup ({cache: false}); 
							$('#'+panleId).load( $(this).attr('href')+'&ajax=1 #'+panleId+'>.tab_tar',function(){ 
								WSU_MAP.admin.lists.pagLoad(); $('#loading').remove();
							});
						});
					});
					WSU_MAP.admin.lists.addLiveActionAnimation();
				}
			},
			Checktitle:function(title,getid,callback){
				$.ajaxSetup ({cache: false}); 
				//var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
				var returnId=getid?'&id=true':'';
				$.get(WSU_MAP.state.siteroot+WSU_MAP.state.view+'checktitle.castle?title='+title+returnId, function(response) {//, status, xhr) {
					if($.isFunction(callback)){
						callback(response);
					}
				});                       
			},
			setInfoSlide:function(){
				if($('.detailInfoBut')){
					$('.detailInfoBut').on('click', function(e){
						WSU_MAP.util.nullout_event(e);
						if($(this).closest('.detailCol').width()<=1){
							$(this).closest('.detailCol').stop().animate({
								width:"125px"
								}, 500, function() {
							});
						}else{
							$(this).closest('.detailCol').stop().animate({
								width:"0px"
								}, 500, function() {
							});
						}
					});
				}
			}
		}
	});
})(jQuery,window,jQuery.wsu_maps||(jQuery.wsu_maps={}));