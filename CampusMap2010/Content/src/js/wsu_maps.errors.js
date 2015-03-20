// JavaScript Document
(function($) {
	$.wsu_maps.errors = {
		addErrorReporting:function (marker){
			$('.errorReporting').off().on("click",function(e){
				e.stopPropagation();
				e.preventDefault();
				//var trigger=$(this);
				var id= typeof(marker)!=="undefined"?marker.id:0;
				
				
				$.wsu_maps.util.popup_message({
					html:'<div id="wsumap_errorReporting"><form action="'+$.wsu_maps.state.siteroot+'/public/reportError.castle" method="post">'+
									'<h4>Found an error?</h4>'+
									'<h5>Please provide some information to help us correct this issue.</h5>'+
									'<input type="hidden" value="'+id+'" name="place_id"/>'+
									'<input type="hidden" value="'+window.location+'" name="reported_url"/>'+
									'<lable>Name:<br/><input type="text" value="" required placeholder="First and Last" name="name"/></lable><br/>'+
									'<lable>Email:<br/><input type="email" value="" required placeholder="Your email address"  name="email"/></lable><br/>'+
									'<lable>Type:<br/><select name="issueType" required><option value="">Choose</option><option value="tech">Technical</option><option value="local">Location</option><option value="content">Content</option></select></lable><br/>'+
									'<lable>Describe the issues: <br/>'+
									'<textarea required placeholder="Description" name="description"></textarea></lable><br/>'+
									'<br/><input type="Submit" id="wsumap_errorSubmit" value="Submit"/><input type="Submit" id="wsumap_errorClose" value="Close"/><br/>'+
								'</from></div>',
					maxWidth:$(window).width()*0.85,
					minWidth:$(window).width()*0.2,
					width:450,
					onOpen:function(jObj){
						$.wsu_maps.general.prep_html();
						$('#wsumap_errorClose').off().on("click",function(e){
							e.stopPropagation();
							e.preventDefault();
							jObj.dialog( "close" );
						});
						$('#wsumap_errorSubmit').off().on('click',function(e){
							e.stopPropagation();
							e.preventDefault();
							var valid=true;
							$.each($('#wsumap_errorReporting [required]'),function(){
								if($(this).val()===""){
									valid=false;
								}
							});
							
							if(valid){
								$.post($('#wsumap_errorReporting form').attr('action'), $('#wsumap_errorReporting form').serialize(),function(){
									//$.jtrack.trackEvent(pageTracker,"error reporting", "submited", $('[name="issueType"]').val());
									/*$('#wsumap_errorReporting').html('<h3>Thank you for reporting the error.</h3><input type="Submit" id="wsumap_errorClose" value="Close"/>');
									$('#wsumap_errorClose').off().on("click",function(e){
										e.stopPropagation();
										e.preventDefault();
										jObj.dialog( "close" );
									});*/
								});
							}else{
								if($('#valid').length===0){
									$('#wsumap_errorReporting').prepend("<div id='valid'><h4 class='error'>Please completely fill out the form so we may completely help you.</h4></div>");
								}
							}
						});
					}
				});
				
				
				
				/*
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
									//$.jtrack.trackEvent(pageTracker,"error reporting", "submited", $('[name="issueType"]').val());
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
				});*/
			});	
			
		},
	};
})(jQuery);