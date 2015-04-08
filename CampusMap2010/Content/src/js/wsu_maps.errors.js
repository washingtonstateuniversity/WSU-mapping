// JavaScript Document
(function($,window,WSU_MAP) {
	$.extend( WSU_MAP, {
		errors : {
			addErrorReporting:function (marker){
				$('.errorReporting').off().on("click",function(e){
					WSU_MAP.util.nullout_event(e);
					var id= window._defined(marker) ?marker.id:0;
					var title= window._defined(marker) && window._defined(marker.title) ? marker.title : "";
					
					WSU_MAP.util.popup_message({
						html:'<div id="wsumap_errorReporting"><form action="'+WSU_MAP.state.siteroot+'/public/reportError.castle" method="post">'+
										'<h4>Found an error?</h4>'+
										'<h5>Please provide some information to help us correct this issue.</h5>'+
										'<input type="hidden" value="'+id+'" name="place_id"/>'+
										'<input type="hidden" value="'+title+'" name="place_name"/>'+
										'<input type="hidden" value="'+window.location+'" name="reported_url"/>'+
										'<lable>Name:<br/><input type="text" value="" required placeholder="First and Last" name="name"/></lable><br/>'+
										'<lable>Email:<br/><input type="email" value="" required placeholder="Your email address"  name="email"/></lable><br/>'+
										'<lable>Type:<br/><select name="issueType" required><option value="">Choose</option><option value="tech">Technical</option><option value="local">Location</option><option value="content">Content</option></select></lable><br/>'+
										'<lable>Describe the issues: <br/>'+
										'<input type="hidden" value="unknown" name="ua" id="user_agent__reporting"/>'+
										'<textarea required placeholder="Description" name="description"></textarea></lable><br/>'+
										'<br/><input type="Submit" id="wsumap_errorSubmit" value="Submit"/><input type="Submit" id="wsumap_errorClose" value="Close"/><br/>'+
									'</from></div>',
						maxWidth:$(window).width()*0.85,
						minWidth:$(window).width()*0.2,
						width:450,
						onOpen:function(jObj){
							WSU_MAP.general.prep_html();
							$('#wsumap_errorClose').off().on("click",function(e){
								WSU_MAP.util.nullout_event(e);
								jObj.dialog( "close" );
							});
							var ua = window.navigator.userAgent;
							$('#user_agent__reporting').val(ua);
							$('#wsumap_errorSubmit').off().on('click',function(e){
								WSU_MAP.util.nullout_event(e);
								var valid=true;
								$.each($('#wsumap_errorReporting [required]'),function(){
									if($(this).val()===""){
										valid=false;
									}
								});
								
								if(valid){
									$.post($('#wsumap_errorReporting form').attr('action'), $('#wsumap_errorReporting form').serialize(),function(){
										//$.jtrack.trackEvent(pageTracker,"error reporting", "submited", $('[name="issueType"]').val());
										$('#wsumap_errorReporting').html('<h3>Thank you for reporting the error. &nbsp;&nbsp;&nbsp;<input type="Submit" id="wsumap_errorClose" value="Close"/></h3>');
										$('#wsumap_errorClose').off().on("click",function(e){
											WSU_MAP.util.nullout_event(e);
											jObj.dialog( "close" );
										});
									});
								}else{
									if($('#valid').length===0){
										$('#wsumap_errorReporting').prepend("<div id='valid'><h4 class='error'>Please completely fill out the form so we may completely help you.</h4></div>");
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