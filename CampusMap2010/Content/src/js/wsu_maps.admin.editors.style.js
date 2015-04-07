// JavaScript Document
(function($,window,WSU_MAP) {
	$.extend( WSU_MAP.admin.editors , {
		style : {
			ini:function(){
				
			},
			defaults:{
			},
			
			int_form:function(){
				$("[name='update_style.castle']").autoUpdate({
					before:function(){},
					changed:function(){
						WSU_MAP.admin.style.rebuild_example($( ".accordion" ),$('#style_of').val());
					}
				});
				
				$.each($( ".accordion" ),function(i){
					var self = $(this);
					var state = false;
					var input = self.find('input:not(:hidden)').not('h3 input');
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
						var id = (box.attr('title').split('.')[1])+'_color_picker_'+i;
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
								WSU_MAP.admin.style.rebuild_example($('.accordion'),$('#style_of').val());
								var hex = '#'+color.val('hex');
								box.siblings('.colorsaver').val(hex!=="#null"?hex:""); 
							},function(color){//, ob){
								WSU_MAP.admin.style.rebuild_example($('.accordion'),$('#style_of').val());
								var hex = '#'+color.val('hex');
								box.siblings('.colorsaver').val(hex!=="#null"?hex:""); 
							},function(color){//, ob){
								WSU_MAP.admin.style.rebuild_example($('.accordion'),$('#style_of').val());
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
								WSU_MAP.admin.style.rebuild_example($('.accordion'),$('#style_of').val());
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
								WSU_MAP.admin.style.rebuild_example($('.accordion'),$('#style_of').val());
							}
						});
						subobj.prev('input').val(subobj.slider( "value" ));
					});
				});	
			},
		}
	});
	$.extend( WSU_MAP.admin , {
		style : {
			rebuild_example:function (tabs,type){
				var _op={};
				$.each(tabs, function(){
					var tab = $(this);
					var mode = tab.closest('.tabed').attr('id');//.split('__')[1].split('_')[1];
					var ele = tab.find(':input:not(:hidden)').not('h3 :input');
					
					
					var options={};
					var drity_check =  ( ele.is(':checked') || (ele.val()!=='' && ele.not(':checkbox') ) ) ;
					if( drity_check && ele.not('[type=hidden]') && window._defined( ele.attr('rel') ) ){
					   options[ele.attr('rel')]= (ele.is($('.color_picker')) ? '#' : '') +''+ele.val();// changed hasClass for is for speed
					}
					
					_op[ mode ] = $.extend({},_op[ mode ],options); 
				});
				WSU_MAP.state.map_jObj.gmap('clear_map');	
				WSU_MAP.admin.set_default_shape(type,_op);
			},
			load_editor:function (){
				WSU_MAP.state.map_jObj = $('#style_map');
				WSU_MAP.state.map_jObj.gmap({
					'center': WSU_MAP.state.campus_latlng_str,
					'zoom':WSU_MAP.defaults.map.zoom,
					'disableDoubleClickZoom':true,
					//'draggable':false,
					//'zoomControl': false,
					'mapTypeControl': false,
					'panControl':false,
					'streetViewControl': false,
					styles:WSU_MAP.defaults.map.styles
				}).bind('init', function () {
					WSU_MAP.state.map_inst = WSU_MAP.state.map_jObj.gmap('get','map');
					WSU_MAP.state.map_jObj.gmap('stop_scroll_zoom');
				
					WSU_MAP.admin.set_default_shape($('#style_of').val());
		
					if($('.sortStyleOps.orgin').length){
						if($('#style_of').val()!==''){
							//WSU_MAP.general.set_default_shape($('#style_of :selected').text());
							WSU_MAP.admin.set_default_shape($('#style_of').val());
							$('#style_of').trigger('change');
						}
					}
			
					if($( ".TABS" ).length>0){
						$( ".TABS:not(.clone_pool .TABS)" ).each(function(){//i){
							$(this).tabs();
						});
					}
	
					WSU_MAP.admin.editors.style.int_form();
					WSU_MAP.admin.style.rebuild_example($('.accordion'),$('#style_of').val());
				});
			},
		}
	});
})(jQuery,window,jQuery.wsu_maps||(jQuery.wsu_maps={}));