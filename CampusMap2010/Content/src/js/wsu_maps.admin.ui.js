// JavaScript Document
(function($) {
	$.wsu_maps.admin.ui={
		addTab:function (i,title,content,useWysiwyg,useControlls) {
			title = title||false;
			content = content||false; 
			useWysiwyg = useWysiwyg||true;
			useControlls = useControlls||true;
			var tabs = $('#dynoTab');
			var tab_title = title || $( "#tab_title").val() || "Tab " + i;
			
			var controll="";
			if(useControlls){
				controll="<span class='ui-icon ui-icon-close'>Remove Tab</span>"+
									 '<span class="edit ui-icon ui-icon-pencil"></span>';
			}
			
			var tabTemplate = "<li><a href='#{href}' hideFocus='true'>#{label}</a>"+
								"<input type='hidden' name='tabs["+i+"].id' value='' id='tab_id_"+i+"'/>"+
								"<input type='hidden' name='tabs["+i+"].title' value=\"#{label}\" id='tab_title_"+i+"'/>"+
								"<input type='hidden' name='tabs["+i+"].template.id' value='' id='tab_template_id_"+i+"'/>"+
								"<input type='hidden' name='tabs["+i+"].sort' value='' id='tab_sort_"+i+"'class='sort' />"+
								controll+"</li>";
		
				var tab_id = "tabs-"+ i;
			  var li = $( tabTemplate.replace( /#\{href\}/g, "#" + tab_id ).replace( /#\{label\}/g, tab_title.replace('{$i}',i) ) );
					
			  tabs.find( ".ui-tabs-nav" ).append( li );
			  
			var tabContentHtml = content || "<textarea id='tab_"+i+"'  name='tabs["+i+"].content' class='tinyEditor full' >Tab " + i + " content.</textarea>";
			tabs.append( "<div id='" + tab_id + "'>" + tabContentHtml + "</div>" );
			tabs.tabs( "refresh" );
		
		
		
			
			$.each($("#dynoTab li.ui-state-default"),function(i){//,v){
				$(this).find('.sort').val(i);
				$.wsu_maps.admin.ui.set_tab_editable(i);
			});
			
		
			
			if(useWysiwyg){
				$.wsu_maps.admin.ui.tinymce.load_tiny("bodytext","tab_"+i);
			}
		
			return i++;
		},
		set_tab_editable:function (i){
			var base= '[href="#dyno_tabs_'+i+'"]';
			if($(base).length===0){
				base= '[href="#tabs-'+i+'"]';
			}
			$(base).closest('li').find('.edit').off('click').on('click',function(){//e){
				if(!$(this).is('ui-icon-cancel')){// changed hasClass for is for speed
					var base_li = $(base).closest('li');
					$(this).addClass('ui-icon-cancel');
					$(base).hide();
					$(base).after('<input type="text" class="titleEdit" value="'+$(base).text()+'" />');
					base_li.find('.titleEdit').focus();
					base_li.find('.edit').off('click').on('click',function(){
						base_li.find('.titleEdit').blur();
					});
					base_li.find('.titleEdit').on('blur',function(){
						base_li.find('.edit').removeClass('ui-icon-cancel');
						base_li.find('.edit').addClass('ui-icon-pencil');
						$(base).text($(this).val());
						base_li.find('#tab_title_'+i).val($(this).val());
						$(this).remove();
						$(base).show();
						$.wsu_maps.admin.ui.set_tab_editable(i);
					});
				}
			});
		},
	};
})(jQuery);