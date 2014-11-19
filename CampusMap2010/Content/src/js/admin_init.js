
/*-----------------------------------------------------------
  Insert all JS that is related only to the admin area
  
  NOTE:
  var siteroot is set in the default veiw
  var view is set in the default veiw
-------------------------------------------------------------
*/

//var debug=false;


//var FileName='';
//var $tabs;
var siteroot=siteroot||"";
var view=view||"";
var mcv_action=mcv_action||"";
var place_id=place_id||-1;
var i=i||-1;
var image_count=image_count||-1;
var url_parts = $.wsu_maps.util.parseUri(window.location);

(function($) {
	$.fn.blink = function(options){
		options = $.extend({ delay:500 }, options);
		return this.each(function(){
				var obj = $(this);
				window.setInterval(function(){
					if($(obj).css("visibility") === "visible"){
						$(obj).css('visibility','hidden');
					}else{
						$(obj).css('visibility','visible');
					}
				}, options.delay);
			});
	};
})(jQuery);

$.wsu_maps.admin = {
	ini:function(){},
	removeAlertLoadingSaving:function (){
		$( "#dialog" ).dialog( "close" );
	}	
};

	
function setup_fixedNav(){
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
}





/*function typedown(mySelection){  
	window.location = siteroot+view+"list.castle?type="+mySelection;   
}*/
/*function dropdown(mySelection){  
	window.location = view+"list.castle?searchId="+mySelection;   
}
*/

/*function updateaddAuthorDIV(transport){
	var temp = document.getElementById("NextAuthorID");
	var newdiv = document.createElement('div');
	var divIdName = 'Author'+temp.value+'Div'; 

	newdiv.setAttribute('id',divIdName);
	newdiv.innerHTML = transport.responseText;
	var ni = document.getElementById('NewAuthorHolderDiv');
	ni.appendChild(newdiv);
}*/
/*function AddAuthor(){
	++author_count;
	$.get(siteroot+view+'GetAddAuthor.castle?count='+author_count, function(data){
		$('#NewAuthorHolderDiv').append(data);
		$('#NewAuthorHolderDiv').find('select').addClass('authorSelect');
	});
}*/
	
function alertLoadingSaving(mess){
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
}



/*function showMessage(transport) {
	alert('An error occurred during the AJAX request.' + transport.responseText);
}*/
	
/*function updateaddTagDIV(transport){
	$('#NewTagHolderDiv').append('<div id="Tag'+temp.value+'Div">'+transport.responseText+'</div>');
}*/
/*function AddTag(){
	++tag_count;
	$.get('GetAddTag.castle?count='+tag_count, function(data) {
		$('#NewTagHolderDiv').append(data);  
	});
}*/




















function loadStat(stat,place_id,diaObj){
	$.ajaxSetup ({cache: false}); 
	var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
	//alert(place_id);
	$.get(siteroot+view+'setStatus.castle?id='+place_id+'&status='+stat , function(response) {//, status, xhr) {
		var statIs = $("<div>").append(response.replace(rscript, "")).find('.place_'+place_id+' .Status div');
		$('body .place_'+place_id+' .Status').empty().append(statIs.html());
		$('body li.place_'+place_id).clone().prependTo('.list_'+stat);
		$('body li.place_'+place_id).not('.list_'+stat+' li.place_'+place_id+':first').remove();
		$( ".buttons.pubState" ).removeClass('ui-state-focus').removeClass('ui-state-hover'); 
		$( "#dialog .buttons" ).removeClass('ui-state-focus').removeClass('ui-state-hover'); 
		diaObj.dialog( "close" );	
	});                       
}

function sendBr(place_id,diaObj){
	$.ajaxSetup ({cache: false}); 
	//var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
	//alert(place_id);
	$.get(siteroot+view+'end_breaking_single.castle?id='+place_id , function(response) {//, status, xhr) {
		diaObj.dialog( "close" );
		if(response!=='true'){
			alertLoadingSaving(response);
		}else{
			alertLoadingSaving('Emails sent');
			window.setTimeout($.wsu_maps.admin.removeAlertLoadingSaving(),1500);
		}
	});                       
}



function clearLock(item_id,diaObj,callback){
	$.ajaxSetup ({cache: false,async:false}); 
	//var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
	//alert(place_id);
	$.get(siteroot+view+'clearLock.castle?id='+item_id, function(response) {//, status, xhr) {
		if(response==='true'){
			if(typeof(diaObj)!=='undefined' && diaObj!==''){
				$('body li.item_'+item_id).find('.inEdit').fadeOut('fast',function(){
					$('body li.item_'+item_id).find('.inEdit').remove();
				});
				$('body li.item_'+item_id).find('.UinEdit').fadeOut('fast',function(){
					$('body li.item_'+item_id).find('.UinEdit').remove();
				});
				$( ".buttons.steal" ).removeClass('ui-state-focus').removeClass('ui-state-hover');
				$( "#clearLock .buttons" ).removeClass('ui-state-focus').removeClass('ui-state-hover');
				$('body li.item_'+item_id).find('.buttons.editIt').attr('href','_edit.castle?id='+item_id);
				diaObj.dialog( "close" );	
			}
			if($.isFunction(callback)){
				callback();
			}
		}
	});                       
}


function Checktitle(title,getid,callback){
	$.ajaxSetup ({cache: false}); 
	//var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
	//alert(place_id);
	var returnId=getid?'&id=true':'';
	$.get(siteroot+view+'checktitle.castle?title='+title+returnId, function(response) {//, status, xhr) {
		if($.isFunction(callback)){
			callback(response);
		}
	});                       
}

function addToggle(){
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
}

function addLiveActionAnimation(){
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
	
}

$.wsu_maps.admin.ui = {};
$(function() {
	setup_fixedNav();
	$('.insotryupload').on('click',function(){
		$.wsu_maps.admin.ui.openImgUploader();
	});
	$('.imgInfo').slideToggle();
	$('.DeleteImage').fadeToggle();	
	addToggle();
	addLiveActionAnimation();
	if($(".lazy img,img.lazy").length){
		$(".lazy img,img.lazy").lazyload();
	}
	
	if($("input.all").length){
		$("input.all").on('click',function(){//e) {
			var ele = $(this);
			if(!ele.attr('checked')){
				ele.closest('div').find('select option').removeAttr('selected');
			}else{
				ele.closest('div').find('select option').attr('selected',true);
			}
		});
		
		$("input.all").closest('div').find('select').on('mouseup',function(){
			if($(this).find('option').size() === $(this).find(':selected').size()){
				$(this).closest('div').find('input.all').attr("checked",true);
			}else{
				$(this).closest('div').find('input.all').removeAttr("checked");
			}
		});
		
		
	}
	
	if(typeof(tinyMCE) !== 'undefined' && $('textarea.tinyEditor').length>0){
		$.each($('textarea.tinyEditor'),function(i){
			if(!$(this).is($(".tinyLoaded"))){
				if(typeof($(this).attr('id'))==="undefined"){
					$(this).attr('id','temp_'+i);
				}
				if($(this).is($(".full"))){
					$.wsu_maps.admin.ui.tinymceload_tiny("bodytext",$(this).attr('id'));
				}else{
					$.wsu_maps.admin.ui.tinymceload_tiny("simple",$(this).attr('id'));
				}
				$(this).addClass("tinyLoaded");
				$.wsu_maps.admin.ui.tinymce.tinyResize();
			}
		});
	}
	if($('.sortable.nav').length){
		$('ol.sortable').nestedSortable({
			disableNesting: 'no-nest',
			forcePlaceholderSize: true,
			handle: 'div',
			helper:	'clone',
			items: 'li',
			maxLevels: 3,
			opacity: 0.6,
			placeholder: 'placeholder',
			revert: 250,
			tabSize: 25,
			tolerance: 'pointer',
			toleranceElement: '> div',
			update: function(){//event, ui) {
				if(!$('.menu.formAction.Submit').is(':visible')){
					$('.menu.formAction.Submit').show();
				}
				var arraied = $('ol.sortable').nestedSortable('toArray', {startDepthCount: 0});
				$.each($('li','ol.sortable'),function(i){//,v){
					$(this).find('.nav_level').val(arraied[i+1].depth);
					$(this).find('.nav_position').val(i+1);
					$(this).find('.nav_level_display .value').text(arraied[i+1].depth);
					$(this).find('.nav_position_display .value').text(i+1);
				});
			}
		});
	}
/* General Actions */








/* setup UI */
	if($( ".buttons" ).length > 0){
		$( ".buttons" ).button({text:false});
	}
	if($( ".admin input[type='submit']" ).length > 0){$("input[type='submit']" ).button();}
	if($('.NOTED').length){
		$('.NOTED strong').on('click',function(){//e){
			var self = $(this);
			var parent = $(this).closest('span');
			parent.find('span').slideToggle('fast',function(){
				self.is('.open') ? self.removeClass('open') :self.addClass('open');
				parent.find('em').text((self.is('.open')?' (-)':' (+)'));
			});
		});
	}

	
	if($( "a[title='Delete']" ).length>0){
		var deleteing='';
		var name='';
		if($( "#deleteModule" ).length===0){
			$( "body" ).append('<div id="deleteModule" title="Deleting"><h2 class="ui-state-error ui-corner-all"><span style="float: left; margin-right: .3em;margin-top:15px;margin-bottom:15px;" class="ui-icon ui-icon-alert"></span>Are you sure you<br/>wish to delete <span id="tar_item"></span>?</h2></div>');
		}
		$( "a[title='Delete']" ).on('click',function(e) {
			e.preventDefault();
			e.stopPropagation();
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
	}


/* note this is for the gem area only */
if($('a[href$="/geometrics/new.castle"]').length){
	$('a[href$="/geometrics/new.castle"]').on('click',function(e){
		e.preventDefault();
		e.stopPropagation();
		
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
		e.preventDefault();
		e.stopPropagation();
		
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


	function post_tmp(form_obj){//,diaObj,callback){
		$.ajaxSetup ({cache: false,async:false}); 
		//var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
		//alert(place_id);
		$.post(form_obj.attr('action')+'?apply=Save', form_obj.serialize(), function(res){//, status, request) {
			var Location = '/place/_edit.castle?id='+res; 
			
			window.location= Location; 
			$('body #content_area').fadeTo('fast',25);
		});
	} 
	function pagLoad(){
		if($('.ui-tabs-panel .pagination').length){
			$.each($('.pagination'),function(){
				var panleId = $(this).closest('.ui-tabs-panel').attr('id');
				$(this).find('a').on('click',function(e){
					$('body').append('<h1 style="position:fixed; top:25%; left:45%; z-index:9999;text-align: center;" id="loading"><img src="../Content/images/loading.gif"/></br>Loading</h1>');
					e.stopPropagation();
					e.preventDefault();
					//panleId
					$.ajaxSetup ({cache: false}); 
					$('#'+panleId).load( $(this).attr('href')+'&ajax=1 #'+panleId+'>.tab_tar',function(){ pagLoad(); $('#loading').remove(); });
				});
			});
			addLiveActionAnimation();
		}
	}

	function setInfoSlide(){
		if($('.detailInfoBut')){
			$('.detailInfoBut').on('click', function(e){
				e.stopPropagation();
				e.preventDefault();
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

	

	if($('.autoselect').length){
		$( ".autoselect" ).each(function(){$(this).combobox();});
	}


	function tabsToAccordions(){
		$(".tabs").each(function(){
			var e=$('<div class="accordion">');
			var t=[];
			$.each($(this).find(">ul>li"),function(){
				t.push("<h3>"+$(this).html()+"</h3>");
			});
			var n=[];
			$.each($(this).find(">div"),function(){
				n.push("<div>"+$(this).html()+"</div>");
			});
			for(var r=0;r<t.length;r++){
				e.append(t[r]).append(n[r]);
			}
			$(this).before(e);
			$(this).remove();
		});
		$(".accordion").accordion({
			heightStyle: "content",
			collapsible: true
		});
	}
	 //document.location.hash
	// changes accordions to tabs (jquery ui)
	function accordionsToTabs(){
		if($(".accordion").length){
			$(".accordion").each(function(){
				var e=$('<div class="tabs">');
				var t=0;
				var n=$("<ul>");
				$.each($(this).find(">h3"),function(i){
					n.append('<li><a href="#tabs-'+i+'">'+$(this).text()+"</a></li>");
				});
				t=0;
				var r=$("");
				$(this).find(">div").each(function(){
					t++;
					r=r.add('<div id="tabs-'+t+'">'+$(this).html()+"</div>");
				});
				e.append(n).append(r);
				$(this).before(e);
				$(this).remove();
			});
			initalize_tabs();
		}
	}
	function updateUI(){
		if($(window).width() <= 480){
			tabsToAccordions();
		} else {
			accordionsToTabs();
		}
	}

	function applyTabToAccordion(){	
		// event handler for window resize
		$(window).resize(function(){//e){
			updateUI();
		});
		updateUI();
	}

	
	if($( "#sub_tabs" ).length>0){
		$( "#sub_tabs" ).tabs();
	}
	if($( ".sub_tabs" ).length>0){
		$( ".sub_tabs" ).each(function(){
			$(this).tabs();
		});
	}
	
	function initalize_tabs(){
		var  taboptions={};
		
		$(".tabs").each(function(){
			var target = $(this);
			var areaId = target.closest('.tabedArea').attr('id');
			var activeTab = $.cookie('tabs'+areaId);
			target.tabs($.extend( taboptions, typeof(place_id) !== 'undefined'&&place_id===0?{ disabled: [3] }:{}, {
				active: activeTab||0,
				create: function(){//event, ui) {
					if($('#place_id').length){
						tinyMCE.triggerSave();
						$.wsu_maps.admin.ui.tinymce.tinyResize();
					}
					pagLoad();
					setInfoSlide();
				},
				activate: function( event, ui ) {
					$.cookie('tabs'+areaId, ui.newTab.index(), {expires: 1, path: '/'+view+mcv_action+'.castle' });
				}
			 } ));
		});
	}
	if($(".tabs").length>0){
		initalize_tabs();
		applyTabToAccordion();
	}else{
		setInfoSlide();	
	}
	if($("#tabs").length>0){
		$("#tabs").tabs();
	}
	if( (typeof(place_id) !== 'undefined'&&place_id===0) ){
		if($( "#chooseModel" ).length===0){
			$( "body" ).append('<div id="chooseModel" title="Choose the place model">'+
			'<p><strong>Choose a model </strong>'+
			'that the place will be.  This will set forth all the options it can have.'+
			'<br/><select name="set_model" id="set_model">'+
			$('#LocationModelSelect').clone().html()+
			'</select></div>');
		}
		$("#chooseModel").dialog({
			autoOpen: true,
			height: 275,
			width:350,
			modal: true,
			hide: 'blind',
			resizable: false,
			draggable: false,
			buttons: {
				"Ok": function() {
					if($('#set_model :selected').val() !==''){
						$( this ).dialog( "close" );
						if($( "#loading_tmp" ).length===0){
								$( "body" ).append('<div id="loading_tmp" title="Loading">'+
								'<img src="/Content/images/loading.gif" style="margin: 0 auto; display:block;" />'+
								'</div>');
							}
							$( "#loading_tmp" ).dialog({
								autoOpen: true,
								height: 155,
								width:125,
								modal: true,
								hide: 'blind',
								resizable: false,
								draggable: false
							});
							post_tmp($('#editor_form'),$( "#loading_tmp" ),function(){});
					}else{
						$('#set_model').next('.ui-autocomplete-input').css({'box-shadow':'0px 0px 10px 0px #f00'}).addClass('errored');
					}

				}
				
			}
		});
		$('#set_model').combobox();
		$('#set_model').next('.ui-autocomplete-input').on('change',function(){
			if($('#set_model :selected').val() !==''){
				if($('#set_model').next('.ui-autocomplete-input').is('errored')){ // changed hasClass for is for speed
					$('#set_model').next('.ui-autocomplete-input').css({'box-shadow':'0px 0px 10px 0px #23b618'}).removeClass('errored');
				}
			}else{
				$('#set_model').next('.ui-autocomplete-input').css({'box-shadow':'0px 0px 10px 0px #f00'}).addClass('errored');
			}
			$("#LocationModelSelect option[value='"+$('#set_model :selected').val()+"']").attr("selected","selected");
			$("#LocationModelSelect").next('input').val($('#set_model :selected').text());
		});
	}  

	$(".editzone").on("blur",function() { 
		var txt = $(this); 
		txt.prev('.editable').text(txt.val()); 
		txt.parent(".pod").removeClass("editing"); 
	}); 
	$(".pod .editable").on('click',function(e) { 
		e.preventDefault();
		e.stopPropagation();
		$(this).next().val($(this).text()).focus(); 
		$(this).parent().addClass("editing"); 
		var TAR=$(this).attr('rel');
		var cache = {},
			lastXhr;
		$(this).next().autocomplete({
			minLength: 2,
			source: function( request, response ) {
				var term = request.term;
				if ( term in cache ) {
					response( cache[ term ] );
					return;
				}
				lastXhr = $.getJSON( "/place/get__"+TAR+".castle", request, function( data, status, xhr ) {
					cache[ term ] = data;
					if ( xhr === lastXhr ) {
						response( data );
					}
				});
			}
		});
	}); 
	$('#customNames').slideToggle().click();
	$('#customName').click(function(){
		$('#customName em').text( $('#customName em').text() === '+' ? '-' : '+' );
		$('#customNames').slideToggle();
	});

	$('#PlaceTagCreate').on('click',function(e){
		e.preventDefault();
		e.stopPropagation();
		i=$('#taged .pod').size();
		if(i===0){
			$('#taged').html('');
		}
		$('#taged').append($('#tag_clonebed').html().replace(/[9]{4}/g, (i>-1?i:i+1) ).replace(/\|\|/g, '' ) );
	});
	$('#PlaceNameCreate').on('click',function(e){
		e.preventDefault();
		e.stopPropagation();
		i=$('#names .pod').size();
		$('#names').append($('#name_clonebed').html().replace(/[9]{4}/g, (i>-1?i:i+1) ).replace(/\|\|/g, '' ) );
	});


	$('[name="ele.type"]').not('#style_of').change(function(){
		if($('[name="ele.type"] :selected').val()==="dropdown"){
			$('#optionsSelection').slideDown('fast');
			$('#optionsSelectionDefaults').slideUp('fast');
		}else{
			$('#optionsSelection').slideUp('fast');
			$('#optionsSelectionDefaults').slideDown('fast');
			$('#ops').html('');
		}
	});
	$("#ele_attr_multiple").on("change",function(){
		if($("#ele_attr_multiple:checked").length){
			$('.pod [type=radio]:checked').attr("checked",false);
			$('.pod [type=checkbox]:checked').attr("checked",false);
			$('.pod [type=radio]').hide();
			$('.pod [type=checkbox]').show();
		}else{
			$('.pod [type=radio]:checked').attr("checked",false);
			$('.pod [type=checkbox]:checked').attr("checked",false);
			$('.pod [type=radio]').show();
			$('.pod [type=checkbox]').hide();
		}
	});
	$('.pod [type=radio]').on("change",function(){
		$('.pod :checked').attr("checked",false);
		$(this).attr("checked",true);
	});
	$('.pod .opVal').on("change",function(){
		$(this).siblings('[type=radio]').val($(this).val());
		$(this).siblings('[type=checkbox]').val($(this).val());
	});

	$('#addOption').on('click',function(e){
		e.preventDefault();
		e.stopPropagation();
		i=$('#ops .pod').size();
		$('#ops').append($('#option_clonebed').html().replace(/[9]{4}/g, (i>-1?i:i+1) ) );
	});
	$('.deleteOption').on('click',function(e){
		e.preventDefault();
		e.stopPropagation();
		var tar = $(this).closest('.pod');
		var tarParent = tar.closest('.podContainer');
		tar.remove();
		tarParent.find('.pod').each(function(i){
			$(this).find('input').each(function(){//j){
				$(this).attr('name',$(this).attr('name').replace(/[\d+]/g, (i>-1?i:i+1)) );
			});
		});
	});


	if($( ".datepicker.optionsA" ).length>0){
		$( ".datepicker.optionsA" ).each(function(){
			$(this).datetimepicker({
				showOtherMonths: true,
				selectOtherMonths: true,
				changeMonth: true,
				changeYear: true,
				showButtonPanel: true,
				showAnim:"fold",
				dateFormat: 'mm/dd/yy',
				ampm: true,
				hourGrid: 4,
				minuteGrid: 10,
				onClose: function(dateText){//, inst) {
					//auto take off a null time.. ie if left at midnight, it's not wanted.
					if (dateText.indexOf('00:00')!==-1||dateText.indexOf('12:00 AM')!==-1||dateText.indexOf('12:00 am')!==-1){
						var temp = dateText.split(' ');
						$(this).val(temp[0]);
					}
				}
			});
		});
	}




	



	


  


/* -----------
	for stories
	---------------- */

	/* for place listings */
	
		if($('.fliterList').length>0){
			$(".fliterList").on('change',function () {
				window.location = siteroot+view+"list.castle?searchId="+$(this).find(':selected').val(); 
			});
		}
	
		$( "#dialog" ).dialog({
			autoOpen: false,
			height: 165,
			width: 440,
			modal: true,
			hide: 'blind',
			resizable: false,
			draggable: false,
			buttons: {
				"Draft": function() {
					var diaObj=$(this);
					loadStat(1,place_id,diaObj);
				},
				"Review": function() {
					var diaObj=$(this);
					loadStat(2,place_id,diaObj);

				},
				"Published": function() {
					var diaObj=$(this);
					loadStat(3,place_id,diaObj);
				},
				Cancel: function() {
					$( ".buttons.pubState" ).removeClass('ui-state-focus'); 
					$( this ).dialog( "close" );
				}
			}
		});
		$( ".pubState" )
			.on('click',function(e) {
			e.preventDefault();
			e.stopPropagation();
			place_id=$(this).closest('.place_aTar').attr('title');
			$( "#dialog" ).dialog( "open" );
		});


		if($('#sendBR').length===0){
			$('body').append('<div id="sendBR" title="Send" style="display:none;"><p>Release the Place out in email<br/><strong>Note:</strong>If You don\'t want to over use this.</p></div>');
		}
		$( "#sendBR" ).dialog({
			autoOpen: false,
			height: 165,
			width: 440,
			modal: true,
			hide: 'blind',
			resizable: false,
			draggable: false,
			buttons: {
				"Send": function() {
					var diaObj=$(this);
					sendBr(place_id,diaObj);
				},
				Cancel: function() {
					$( ".buttons.sendBR" ).removeClass('ui-state-focus'); 
					$( this ).dialog( "close" );
				}
			}
		});
		$( ".sendBR" ).on('click',function(e) {
			e.preventDefault();
			e.stopPropagation();
			place_id=$(this).closest('.place_aTar').attr('title');
			$( "#sendBR" ).dialog( "open" );
		});




		

		

	/* for place editing */

	var availableTags = [
			"Food",
			"Fun",
			"Facts",
			"Foo",
			"Far",
			"From"
		];
		$( "#place_Location" ).autocomplete({
			source: availableTags
		});
	
	if($('.imagedropDown').length>0){
		$(".imagedropDown").on('change',function () {
			if( $(this).closest('div').find(".selectedImage").length===0 ){
				$(this).closest('div').append('<img src="" class="selectedImage" width="100" />');
			}
			$(this).closest('div').find(".selectedImage").attr('src', siteroot+'media/download.castle?id=' + $(this).val());
		});
	}
	


	if($('.addImage').length>0){
		$(".addImage").on('click',function () {
			$.get(siteroot+view+'GetAddImage.castle?count='+image_count, function(data){
				$('#ExistingImagesDiv').append(data);
				++image_count;
			});
		});
	}
	if($('.deleteAuthor').length>0){
		$('.deleteAuthor').on('click',function(){
			var author_id = $(this).attr('title');
			var PlaceId = $(this).attr('rel');
			alertLoadingSaving();
			$.get(siteroot+view+'DeleteAuthor.castle?id='+author_id+'&placeId='+PlaceId, function(){//data){
				 $("div#AuthorDiv #div" + author_id).remove();
				window.setTimeout($.wsu_maps.admin.removeAlertLoadingSaving(),1500);
			});
		});
	}
	if($('.DeleteTag').length>0){
		$('.DeleteTag').on('click',function(){
			var PlaceId = $(this).attr('title');
			var tag_id = $(this).attr('rel');
			alertLoadingSaving();
			$.get(siteroot+view+'DeleteTag.castle?id='+tag_id+'&placeId='+PlaceId, function(){//data){
				$("#tag_"+ tag_id).closest('li').remove();
				window.setTimeout($.wsu_maps.admin.removeAlertLoadingSaving(),1500);
			});
		});
	}


   // $(".imagedropDown").change(function (){
   //      $(".selectedImage",$(this).parent()).attr('src','media/download.castle?id=' + $(this).val());});	   
   //  });
	/* for place listings */
	if($('#clearLock').length===0){
		$('body').append('<div id="clearLock" title="Clear Place Editing Lock" style="display:none;"><p>Release the Place for editing<br/><strong>Note:</strong>If some one is editing it you may wish to ask to make sure they are done.</p></div>');
		}
		$( "#clearLock" ).dialog({
			autoOpen: false,
			height: 165,
			width: 440,
			modal: true,
			hide: 'blind',
			resizable: false,
			draggable: false,
			buttons: {
				"Steal": function() {
					var diaObj=$(this);
					clearLock(place_id,diaObj);
				},
				Cancel: function() {
						$( ".buttons.steal" ).removeClass('ui-state-focus'); 
						$( this ).dialog( "close" );
				}
			}
		});

		$( ".steal" )
			.on('click',function(e) {
			e.preventDefault();
			e.stopPropagation();
			place_id=$(this).attr('rel');
			$( "#clearLock" ).dialog( "open" );
		});
		
		//This is so that you can use the nav when leaving the editing area.  IE: the same as clicking cancel
		if(url_parts.path==='/place/Edit_place.castle'){
			$( "#main_nav a,a.PDF.creation " ).on('click',function(){//e) {
				//e.preventDefault();
				//e.stopPropagation();
				//var obj=$(this);
				clearLock($('#place_Id').val(),'',function(){
					//window.location=obj.attr('href');
					});
			});
		}
		if(url_parts.path==='/place/new.castle'){
			$('input#place_title').keyup(function() {
				var val=$('input#place_title').val();
				val=val.split(' ').join('-');
				val=val.split("'").join('');
				val=val.split('"').join('');
				val=val.split(';').join('');
				val=val.split(':').join('');
				$('#place_CustomUrl').val(val);
				$.wsu_maps.util.clearCount('titleCheck');
				$.wsu_maps.util.setCount('titleCheck',200,function(){
					Checktitle($('#place_CustomUrl').val(),false,function(data){
							if(data==='true'){
								if($('#hasTitle').length===0){
									$('#place_CustomUrl').after('<span id="hasTitle">This url is in use.</span>');
								}
							}else{
								if($('#hasTitle').length>0){
									$('#hasTitle').remove();
								}
							}
							$.wsu_maps.util.clearCount('titleCheck');
						});
				});
			});
		}
		if(url_parts.path==='/place/new.castle'||url_parts.path==='/place/Edit_place.castle'){
			$('#place_CustomUrl').keyup(function() {
				$.wsu_maps.util.clearCount('titleCheck');
				$.wsu_maps.util.setCount('titleCheck',200,function(){
					Checktitle($('#place_CustomUrl').val(),false,function(data){
							if(data==='true'){
								if($('#hasTitle').length===0){
									$('#place_CustomUrl').after('<span id="hasTitle">This url is in use.</span>');
								}
							}else{
								if($('#hasTitle').length>0){
									$('#hasTitle').remove();
								}
							}
							$.wsu_maps.util.clearCount('titleCheck');
						});
				});
			});
		
		
		//var click=0;
		/*
		$('body,html').not('textarea,iframe').bind('keydown', function(e) { 
			if((e.keyCode || e.which)  == 13) {
				e.preventDefault();
				e.stopPropagation();
				$('.submit_btn').first().focus();
				Checktitle($('#place_CustomUrl').val(),false,function(data){
					if(data=='true'){
						if($('#hasTitle').length==0){
							$('#place_CustomUrl').after('<span id="hasTitle">This url is in use.</span>');
						}
					}else{
						 $('input[type=submit]').click();
					}
				});
			}
		});
		*/
		//var clear=false;
		/*$('input[type=submit]:not(".cancel_btn")').on('click', function(e) {
			if(clear!=true){
				e.preventDefault();
				e.stopPropagation();
			}
			var clicked=$(this);
			Checktitle($('#place_CustomUrl').val(),true,function(data){
				if(data!='0'&&data!=$('#place_Id').val()&&data!="false"){
					if($('#hasTitle').length==0){
						$('#place_CustomUrl').after('<span id="hasTitle">This url is in use.</span>');
					}
					if($('#hasTitleAlert').length==0){
						$('#main').prepend('<div id="hasTitleAlert" style="padding: 0 .7em;" class="ui-state-error ui-corner-all"><p style="line-height: 15px;padding-bottom: 0;"><span style="float: left; margin-right: .3em;" class="ui-icon ui-icon-alert"></span><strong>Alert:</strong>This url is in use.</p></div>');
					}
					click=0;
				}else{
					if(clear!=true){
						clear=true;
						clicked.click();
					}
					if($('#hasTitleAlert').length>0){$('#hasTitleAlert').remove();}
					if(click>0){
						e.preventDefault();
						e.stopPropagation();
					}
					click++
				}
			});
		}); */
   }



/* -----------
	for persons(Editors)
	---------------- 
	if(typeof(availablePositions) !== 'undefined'){
		$( "#person_position" ).autocomplete({
			source: availablePositions
		});
	}*/



/* -----------
	for adverts
	---------------- */
	if($('#add_ad_image').length>0){
		$("#add_ad_image").on('click',function () {
			$.get(siteroot+view+'GetAddImage.castle?count='+image_count, function(data){
				$('#NewImageHolderDiv').html($('#NewImageHolderDiv').html()+ data);
				++image_count;
			});
		});
	}

});