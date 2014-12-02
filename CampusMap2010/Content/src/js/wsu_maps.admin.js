// JavaScript Document
(function($) {
	$.wsu_maps.admin = {
		ini:function(){},
		defaults:{
			place_id:-1,
		},
		removeAlertLoadingSaving:function (){
			$( "#dialog" ).dialog( "close" );
		},
		setup_fixedNav:function (){
			if ($(window).scrollTop()>= 122) {
				$('.admin #adminNav').addClass('fixed');
			}
			$(window).scroll(function (){//event) {
				if ($(this).scrollTop()>= 122) {     
					$('.admin #adminNav').addClass('fixed');
				} else { 
					$('.admin #adminNav').removeClass('fixed');
				}  
			});
			$('.Cancel a').on("click",function(e){
				e.stopPropagation();
				e.preventDefault();
				$("input[value='Cancel']:first").trigger('click');
			});
			$('.Submit a').on("click",function(e){
				e.stopPropagation();
				e.preventDefault();
				$("input[value='Submit']:first").trigger('click');
			});	
			$('.Apply a').on("click",function(e){
				e.stopPropagation();
				e.preventDefault();
				$("input[value='Apply']:first").trigger('click');
			});
		},
		addToggle:function (){
			$('.imageBox').hover(
				function(){
					$(this).find('.imgInfo').fadeIn('slow');
					$(this).find('.DeleteImage').fadeIn('slow');
				},
				function(){
					$(this).find('.imgInfo').fadeOut('fast');
					$(this).find('.DeleteImage').fadeOut('fast');
				}
			);
		},
		alertLoadingSaving:function (mess){
			mess=mess||'Saving . . .';
			if($('dialog').length===0){
				$('body').append('<div id="dialog" style="display:none;"><h3>'+mess+'</h3></div>');
			}
			$( "#dialog" ).dialog({
				position: ['center','top'],
				minHeight:'55px',
				hide: 'slide',
				resizable: false,
				draggable: false,
				close: function(){//event, ui) {
				}
			});
		},
		setup_massTags:function (){
			$('#massTagging').on('click',function(e){
				e.stopPropagation();
				e.preventDefault();
				$('#massTaggingarea').slideToggle();
			});	
		},
	};

})(jQuery);