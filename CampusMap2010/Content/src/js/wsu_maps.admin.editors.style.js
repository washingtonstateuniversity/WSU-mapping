// JavaScript Document
(function($) {
	$.wsu_maps.admin.editors.style = {
		ini:function(){},
		defaults:{
		},
	};
	$.wsu_maps.admin.style = {
		load_editor:function (){
			//var gmap;
			$.wsu_maps.state.campus_latlng_str = '46.73276783809271,-117.15300628829834';
		
			 $('#style_map').gmap({'center': $.wsu_maps.state.campus_latlng_str , 'zoom':15,'disableDoubleClickZoom':true,'draggable':false,'zoomControl': false,'mapTypeControl': false,'panControl':false,'streetViewControl': false  }).bind('init', function () {
				$('#style_map').gmap('stop_scroll_zoom');
				
				$.wsu_maps.general.set_default_shape($('#style_map'),$('#style_of').val());
		
				if($('.sortStyleOps.orgin').length){
					if($('#style_of').val()!==''){
						//$.wsu_maps.general.set_default_shape($('#style_map'),$('#style_of :selected').text());
						$.wsu_maps.general.set_default_shape($('#style_map'),$('#style_of').val());
						$('#style_of').trigger('change');
					}
				}
		
				if($( ".TABS" ).length>0){
					$( ".TABS:not(.clone_pool .TABS)" ).each(function(){//i){
						$(this).tabs();
					});
				}
		
				$("[name='update_style.castle']").autoUpdate({
					before:function(){},
					changed:function(){
						$.wsu_maps.general.rebuild_example($( ".accordion" ),$('#style_map'),$('#style_of').val());
					}
				});
		
				$.each($( ".accordion" ),function(i){
					var self = $(this);
					var state = false;
					var input = self.find('input').not('h3 input,input:hidden,');
					if(	self.find('input').not('h3 input').val()!==""  && input.not(':checkbox').val()!==self.find('input.default').val() || ( input.is($(':checkbox')) && input.prop('checked')===true ) ){
						state = 0;
						self.find('h3 input').prop('checked',true);
					}
					self.accordion({
						collapsible: true,
						autoHeight: false,
						active: state ,
						//create: function(event, ui) {},
						change: function(event, ui) {
							if(ui.newHeader.is($('.ui-state-active'))){
								ui.newHeader.closest('h3').find('input').prop('checked',true);
							}else{
								ui.oldHeader.closest('h3').find('input').prop('checked',false);
							}
						}
					});
					$.each(self.find('.color_picker'),function(){
						var box = $(this);
						var id = (input.attr('title').split('.')[1])+'_color_picker_'+i;
						//alert(id);
						if($('#'+id).length<=0){
							box.attr("id",id);
							$('#'+id).jPicker({
								  window:{
									title: null,
									effects: {
									  type: 'show',
									  speed:{
										show: 'fast',
										hide: 'fast'
									  }
									},
									position:{
									  x: 'screenCenter',
									  y: 'bottom'
									},
									expandable: false,
									liveUpdate: true,
									alphaSupport: false,
									alphaPrecision: 0,
									updateInputColor: true
								  },
								images:{ clientPath:'/Content/js/colorpicker/images/'}
							},function(color){//, ob){
								$.wsu_maps.general.rebuild_example($('.accordion'),$('#style_map'),$('#style_of').val());
								var hex = '#'+color.val('hex');
								box.siblings('.colorsaver').val(hex!=="#null"?hex:""); 
							},function(color){//, ob){
								$.wsu_maps.general.rebuild_example($('.accordion'),$('#style_map'),$('#style_of').val());
								var hex = '#'+color.val('hex');
								box.siblings('.colorsaver').val(hex!=="#null"?hex:""); 
							},function(color){//, ob){
								$.wsu_maps.general.rebuild_example($('.accordion'),$('#style_map'),$('#style_of').val());
								var hex = '#'+color.val('hex');
								box.siblings('.colorsaver').val(hex!=="#null"?hex:"");  
							});
						}
					});
					$( ".strokeOpacity,.fillOpacity" ).each(function(){//i){
						var subobj = $(this);
						subobj.slider({
							range: "min",
							value: subobj.prev('input').val()!==""?subobj.prev('input').val():"",
							min: 0.0,
							max: 1.0,
							step: 0.01,
							slide: function( event, ui ) {
								subobj.prev('input').val( ui.value ).trigger('change');
								$.wsu_maps.general.rebuild_example($('.accordion'),$('#style_map'),$('#style_of').val());
							}
						});
						subobj.prev('input').val(subobj.slider( "value" ));
					});
					$( ".strokeWeight" ).each(function(){//i){
						var subobj = $(this);
						subobj.slider({
							range: "min",
							value: subobj.prev('input').val()!==""?subobj.prev('input').val():"",
							min: 0,
							max: 20,
							step: 0.1,
							slide: function( event, ui ) {
								subobj.prev('input').val( ui.value ).trigger('change');
								$.wsu_maps.general.rebuild_example($('.accordion'),$('#style_map'),$('#style_of').val());
							}
						});
						subobj.prev('input').val(subobj.slider( "value" ));
					});
				});
				$.wsu_maps.general.rebuild_example($('.accordion'),$('#style_map'),$('#style_of').val());
			});
		}
	};
})(jQuery);