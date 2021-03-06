﻿function prep(){
	$(' [placeholder] ').defaultValue();
	$("a").each(function() {$(this).attr("hideFocus", "true").css("outline", "none");});
}
$(document).ready(function(){
	$('#show_hide_error').on('click',function(e){
		e.stopPropagation();
		e.preventDefault();
		if($('#report_area_details').is(':visible')){
			$('#report_area_details').hide();
		}else{
			$('#report_area_details').show();
		}
	});
	
	$('.errorReporting').click(function(e){
		e.stopPropagation();
		e.preventDefault();
		var trigger=$(this);
		$.colorbox({
			html:function(){
				return '<div id="errorReporting"><form action="../public/reportError.castle" method="post">'+
							'<h2>Found an error?</h2>'+
							'<h3>Please provide some information to help us correct this issue.</h3>'+
							'<lable>Name:<br/><input type="text" value="" required placeholder="First and Last" name="name"/></lable><br/>'+
							'<lable>Email:<br/><input type="email" value="" required placeholder="Your email address"  name="email"/></lable><br/>'+							
							'<lable>Type:<br/>Technical<input name="issueType" value="tech" type="hidden" /></lable><br/>'+
							'<textarea name="data" style="position:absolute; top:-999em;height:0px; width:0px;">'+$('#report_area_details').html()+'</textarea>'+
							'<input type="hidden" value="'+window.location+'" name="reported_url"/>'+
							'<input type="hidden" value="unknown" name="ua" id="user_agent__reporting"/>'+
							'<lable>Describe the issues: <br/>'+
							'<textarea required placeholder="Description" name="description"></textarea></lable><br/>'+
							'<br/><input type="Submit" id="errorSubmit" value="Submit"/><br/>'+
						'</from></div>';
			},
			scrolling:false,
			opacity:0.7,
			transition:"none",
			width:"80%",
			//height:450,
			open:true,
			onComplete:function(){
				prep();
				var ua = window.navigator.userAgent;
				$('#user_agent__reporting').val(ua);
				if($('#colorbox #cb_nav').length){
					$('#colorbox #cb_nav').html("");
				}
				$('#errorReporting [type="Submit"]').off().on('click',function(e){
					e.stopPropagation();
					e.preventDefault();
					var valid=true;
					$.each($('#errorReporting [required]'),function(){
						if($(this).val()=="")valid=false;
					});
					
					if(valid){
						$.post($('#errorReporting form').attr('action'), $('#errorReporting form').serialize(),function(){
							$.jtrack.trackEvent(pageTracker,"error reporting", "submited", $('[name="issueType"]').val());
							$('#errorReporting').html('<h2>Thank you for reporting the error.</h2>'+'');
							$.colorbox.resize();
						});
					}else{
						if($('#valid').length==0)$('#errorReporting').prepend("<div id='valid'><h3>Please completely fill out the form so we may completely help you.</h3></div>");
					}
				});
			}
		});
	});	
	
});