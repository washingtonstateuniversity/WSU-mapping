
/*-----------------------------------------------------------
  Insert all JS that is related only to the admin area
  
  NOTE:
  var siteroot is set in the default veiw
  var view is set in the default veiw
-------------------------------------------------------------
*/

    var debug=false;

	var image_Credit='';
	var image_Caption='';

(function($){
	$.fn.blink = function(options){
		var defaults = { delay:500 };
		var options = $.extend(defaults, options);
		
		return this.each(function(){
			var obj = $(this);
			setInterval(function(){
				if($(obj).css("visibility") == "visible"){
					$(obj).css('visibility','hidden');
				}else{
					$(obj).css('visibility','visible');
				}
			}, options.delay);
		});
	}
}(jQuery));
  

function typedown(mySelection){  
    window.location = siteroot+view+"list.castle?type="+mySelection;   
}
function dropdown(mySelection){  
    window.location = view+"list.castle?searchId="+mySelection;   
}

function showMessage(transport){
    alert('An error occurred during the AJAX request.' + transport.responseText);
}
    
function updateaddAuthorDIV(transport){
    var temp = document.getElementById("NextAuthorID");
    var newdiv = document.createElement('div');
	var divIdName = 'Author'+temp.value+'Div'; 

	newdiv.setAttribute('id',divIdName);
	newdiv.innerHTML = transport.responseText;
	var ni = document.getElementById('NewAuthorHolderDiv');
	ni.appendChild(newdiv);
}
function AddAuthor(){
    ++author_count;
    $.get(siteroot+view+'GetAddAuthor.castle?count='+author_count, function(data){
      $('#NewAuthorHolderDiv').append(data);
      $('#NewAuthorHolderDiv').find('select').addClass('authorSelect');
    });
}
    
function alertLoadingSaving(mess){
    var mess=typeof(mess) !== 'undefined'?mess:'Saving . . .';
    if($('dialog').length==0){
        $('body').append('<div id="dialog" style="display:none;"><h3>'+mess+'</h3></div>');
    }
    $( "#dialog" ).dialog({position: ['center','top'],minHeight:'55px',hide: 'slide',resizable: false,draggable: false,close: function(event, ui) {}});
}

function removeAlertLoadingSaving(){
    $( "#dialog" ).dialog( "close" );
}

function showMessage(transport) {
    alert('An error occurred during the AJAX request.' + transport.responseText);
}
    
function updateaddTagDIV(transport){
//    var temp = document.getElementById("NextTagID");
//    var newdiv = document.createElement('div');
//	var divIdName = 'Tag'+temp.value+'Div'; 

//	newdiv.setAttribute('id',divIdName);
//	newdiv.innerHTML = transport.responseText;
//	var ni = document.getElementById('NewTagHolderDiv');
//	ni.appendChild(newdiv);
	
	$('#NewTagHolderDiv').append('<div id="Tag'+temp.value+'Div">'+transport.responseText+'</div>');  
	
}
function AddTag(){
    ++tag_count;
    $.get('GetAddTag.castle?count='+tag_count, function(data) {
      $('#NewTagHolderDiv').append(data);  
    });
}


function DeleteImage(image_id,placeId){
    $.get(siteroot+view+'DeleteImage.castle?id='+image_id+'&placeId='+placeId, function(data){});
    $("#ImageDiv div#" + image_id).remove();
	//RemoveNode(ImageId);
	//removeFromImgRoster(image_id);
}

function  RemoveNode(ImageId){
//    var parent = document.getElementById('ImageDiv');
//    var childId = "div" + ImageId;
//    var child  = document.getElementById(childId);
//    parent.removeChild(child);
    $("#ImageDiv div#" + ImageId).remove();
}

function showMessage(transport){
    alert('An error occurred during the AJAX request.' + transport.responseText);
}

function updateaddImageDIV(transport){
    var temp = document.getElementById("NextImageID");
    var newdiv = document.createElement('div');
    var divIdName = 'Image'+temp.value+'Div';

    newdiv.setAttribute('id',divIdName);
    newdiv.innerHTML = transport.responseText;
    var ni = document.getElementById('NewImageHolderDiv');
    ni.appendChild(newdiv);
}

function boxCreation(image_id){
	var HTML ='<input type="hidden" value="'+image_id+'" name="images['+image_id+'].id" style="">';
		HTML+='<span class="imageBox">';
		HTML+='<img src="/image/download.castle?id='+image_id+'&placeid='+place_id+'&m=crop&w=175&h=175&pre=borwser" class="previewImg" />';
		HTML+='<a title="'+image_id+'" rel="'+place_id+'" style="cursor:pointer;display: inline-block;" class="DeleteImage ui-state-error ui-corner-all">';
		HTML+='<span class="ui-icon ui-icon-trash"></span>';
		HTML+='</a>';
		
		HTML+='<span class="imgInfo">';
		HTML+='<span><label>Caption:</label><input type="text" value="'+image_Caption+'" name="Caption['+image_id+']" class=""/></span>';
		HTML+='<span><label>Credit:</label><input type="text" value="'+image_Credit+'" name="Credit['+image_id+']" class="placeCredit"/></span>';
		
		HTML+='<span><label>Order:</label>';
		HTML+='<input type="hidden" class="" name="PlaceImages['+image_id+'].id" value="411">';
		HTML+='<input type="text" class="placeOrder" name="PlaceImages['+image_id+'].placeOrder" value="0">';
		HTML+='<input type="hidden" class="placeOrderId" name="PlaceImages['+image_id+'].Image.id" value="'+image_id+'">';
		HTML+='</span>';
		
		
		HTML+='</span>';
		HTML+='</span>';

		$('#browserBox').find('.clearings').before(HTML);
		
		if($('#browserBox.grid').length>0){
			$('.imageBox:last').find('.imgInfo').slideToggle();
			$('.imageBox:last').find('.DeleteImage').fadeToggle();
			$('.imageBox:last').hover(
				function(){
					$(this).find('.imgInfo').slideToggle();
					$(this).find('.DeleteImage').fadeToggle();
					}
			);			
		}
}



function addToImgRoster(id,name){
	if(typeof(id)==='undefined'||id<=0){return}
	if(typeof(name)==='undefined'){name="";}
	tinyMCEImageList.push({id:""+id,name:name,url:"/image/download.castle?id="+id+"&placeid="+place_id+"&m=crop&w=250&h=250&pre=TMP"});	
}
function removeFromImgRoster(id){
	if(typeof(id)==='undefined'||id<=0){return}
	var i=0;			
	for (var image in tinyMCEImageList) {
		var node=tinyMCEImageList[image];
		if(node.id==id){
			tinyMCEImageList.remove(i);
		}
		i++;
	}
}



//tiny stuff
function openImgUploader(){
	if(typeof(uploadonly)==='undefined'){uploadonly=false;}
	if($('#dialog-pickimage').length==0){$('body').append('<div id="dialog-pickimage">')}
								$('#dialog-pickimage').dialog("resize", "auto"); 
								$( "#dialog-pickimage" ).dialog({
									resizable: false,
									height:'auto', 
									width:'375px',
									modal: true,
									position:['center','center'] ,
									title:'Place Imagery',
									close:function(){
										$( "#dialog-pickimage" ).dialog( "destroy" );
										$( "#dialog-pickimage" ).remove();
										},
									create: function(event, ui) {
											/**/$('#dialog-pickimage').html(function(){
												var optional='<option value="">Choose Image</option>';
															var i=0;			
														for (var image in tinyMCEImageList) {
															var node=tinyMCEImageList[image];
																var name=node.name;
																var image_id=node.id;
																optional+='<option value="'+image_id+'">'+name+'</option>';
														}
												var HTML  ='<div id="imgPre"></div>';//<h3 ><span class="ui-icon ui-icon-image" style="    float: left;margin: 0 4px;"></span>Place images</h3><select id="imagePicker">'+optional+'</select>';
													HTML += '<h3 id="inlinePlaceImageUpload" style=" cursor:pointer;"><span style="margin: 0pt 4px; float: right;" class="ui-icon ui-icon-carat-1-s"></span><em class="ui-icon ui-icon-folder-open" style="float:left;margin: 0pt 4px; "></em>Upload image</h3><div id="ISIUarea" class="ui-corner-all" style="display:none;border:1px solid #ccc; padding:5px;"></div>';
															
												return HTML;
											});
											
											$('#imagePicker').live('change',function(){
												if($('#imgPre img').length==0){$('#imgPre').append('<img width="150" height="150" />');}
												if( $('#ISIUarea').css('display')!='none'){$('#inlinePlaceImageUpload').click();}
													$('#imgPre img').css({'opacity':'.65'}).attr('src','');
													var imgid=$('#imagePicker :selected').val();
													$('#imgPre img').attr('src','/media/download.castle?id='+imgid+'&placeid='+place_id+'&m=crop&w=150&h=150&pre=TMP');
													$('#imgPre img').load(function(){$('#imgPre img').css({'opacity':'1.0'});});
												});

											$('#ISIUarea').load('/media/inlineupload.castle',function(){
												if(typeof(availablecredits) !== 'undefined'){
													if($( "#image_Credit" ).length>0){
														$( "#image_Credit" ).autocomplete({
															source: availablecredits
														});
													}
												}	
												
												$('input#image_Credit').keypress(function(){
													image_Credit = $('input#image_Credit').val();
												});
												$('input#image_Caption').keypress(function(){
													image_Caption = $('input#image_Caption').val();
												});												
												
																											
												var weWantedTo=true;
													$('input[type=file]').ajaxfileupload({ 
															  'action': '/media/update.castle', 
															  'params': { 
															  	'image.id':'',
																'image.FileName':$('input#image_FileName'),
																'image.Caption':$('input#image_Caption'),
																'image.Credit':$('input#image_Credit'),
																'place_id':place_id,
																'image.type.id':1,
																'ajax':true
															  }, 
															  'onComplete': function(response) { 
																 // first test if it was uploaded ok.
																  if(isNumber(response)){
																	  
																	  $('#uploadMess').fadeOut('fast',function(){
																		  $('#uploadMess').remove();
																		  if($('#nextUpload').length==0){
																			  $('#ISIUarea').append('<div id="nextUpload"><h2>Next...</h2><!--<h3><a href="#" id="place">Insert the new image</a></h3>--><h3><a href="#" id="again">Add more</a></h3></div>');
																			  }
																		  });
																	  
																		// would get response here from response
																		image_id=response;
																		image_FileName = $('input#image_FileName').val();
																		image_Credit = $('input#image_Credit').val();
																		image_Caption = $('input#image_Caption').val();

																	  //add to 
																	  if($('#imgPre img').length==0){$('#imgPre').append('<img width="150" height="150" />');}
																	  $('#imagePicker :selected').attr('selected',false);//reset selection
																	  $('#imagePicker option:first').after('<option value="'+image_id+'" selected="selected">'+FileName+'</option>');// add new and select
																		$('#imgPre img').attr('src','/media/download.castle?id='+image_id+'&placeid='+place_id+'&m=crop&w=150&h=150&pre=TMP');
																		$('#imgPre img').load(function(){$('#imgPre img').css({'opacity':'1.0'});});
													
																	   $('#again').live('click',function(e){
																			e.preventDefault();
																			e.stopPropagation();
																		   $('#ISIUarea input[type=text]').each(function(){$(this).val('');});
																		   $('#ISIUarea input[type=file]').each(function(){$(this).val('');});
																		   $('#nextUpload').fadeOut('fast',function(){
																			   $('#ISIUarea form').fadeIn('fast');
																			   $('#nextUpload').remove();
																			});
																		});
																		$('#place').live('click',function(e){
																			e.preventDefault();
																			e.stopPropagation();
																			$('#ISIUarea input[type=text]').each(function(){$(this).val('');});
																		   $('#ISIUarea input[type=file]').each(function(){$(this).val('');});
																			ed.selection.execCommand('mceInsertContent',false,get_TinyMCE_InlinImage(image_id));
																			
																			$( "#dialog-pickimage" ).dialog( "close" );
																			
																		});
																		
																		boxCreation(image_id);
																		addToImgRoster(image_id,image_FileName);
																		
																		//console.log('custom handler for file:'); 
																		//alert(JSON.stringify(response)); 
																  }else{
																	 $('#uploadMess').fadeOut('fast',function(){
																		 $('#uploadMess').remove();
																		 if($('#nextUpload').length==0){$('#ISIUarea').append('<div id="nextUpload"><h2>Error</h2><h3><a href="#" id="again">Try Again</a></h3><p>There was an issue uploading<br/>Mess: '+JSON.stringify(response)+'<p/></div>');}
																	 });
																  }
															  }, 
															  'onStart': function() { 
															  	 FileName=$('input#image_FileName').val();
																 //alert('pause');
																//if(!weWantedTo) return false; // cancels upload 
																$('#ISIUarea form').fadeOut('fast',function(){
																	if($('#uploadMess').length==0){$('#ISIUarea').append('<div id="uploadMess"><h2>Uploading</h2></div>');}
																	});
															  }, 
															  'onCancel': function() { 
																//console.log('no file selected'); 
															  } 
															});
												});

											$('#inlinePlaceImageUpload').bind('click',function(e){
												e.preventDefault();
												e.stopPropagation();
												var imgid=$('#imagePicker :selected').val();
												 $('#ISIUarea').slideToggle('fast',function(){
													 $('#inlinePlaceImageUpload span').toggleClass('ui-icon-carat-1-n');
													 $('#inlinePlaceImageUpload span').toggleClass('ui-icon-carat-1-s');
												 });
												if( $('#ISIUarea').css('display')=='none'){
													$('#imgPre img').css({'opacity':'.0'}).attr('src','#');
													$('#imagePicker :selected').attr('selected',false);
												}
											});
										},
									buttons: {
										"Done": function() {
											$( this ).dialog( "close" );
										}
									}
								});
	
	}

function openImgResource(ed,uploadOnly){
	if(typeof(uploadonly)==='undefined'){uploadonly=false;}
	if($('#dialog-pickimage').length==0){$('body').append('<div id="dialog-pickimage">')}
								$('#dialog-pickimage').dialog("resize", "auto"); 
								$( "#dialog-pickimage" ).dialog({
									resizable: false,
									height:'auto', 
									width:'375px',
									modal: true,
									position:['center','center'] ,
									title:'Place Imagery',
									close:function(){
										$( "#dialog-pickimage" ).dialog( "destroy" );
										$( "#dialog-pickimage" ).remove();
										},
									create: function(event, ui) {
											$('#dialog-pickimage').html(function(){
												var optional='<option value="">Choose Image</option>';
															var i=0;			
														for (var image in tinyMCEImageList) {
															var node=tinyMCEImageList[image];
																var name=node.name;
																var image_id=node.id;
																optional+='<option value="'+image_id+'">'+name+'</option>';
														}
												var HTML  ='<div id="imgPre"></div><h3 ><span class="ui-icon ui-icon-image" style="    float: left;margin: 0 4px;"></span>Place images</h3><select id="imagePicker">'+optional+'</select>';
													HTML += '<h3 id="inlinePlaceImageUpload" style=" cursor:pointer;"><span style="margin: 0pt 4px; float: right;" class="ui-icon ui-icon-carat-1-s"></span><em class="ui-icon ui-icon-folder-open" style="float:left;margin: 0pt 4px; "></em>Upload image</h3><div id="ISIUarea" class="ui-corner-all" style="display:none;border:1px solid #ccc; padding:5px;"></div>';
															
												return HTML;
											});
											
											$('#imagePicker').live('change',function(){
												if($('#imgPre img').length==0){$('#imgPre').append('<img width="150" height="150" />');}
												if( $('#ISIUarea').css('display')!='none'){$('#inlinePlaceImageUpload').click();}
													$('#imgPre img').css({'opacity':'.65'}).attr('src','');
													var imgid=$('#imagePicker :selected').val();
													$('#imgPre img').attr('src','/media/download.castle?id='+imgid+'&placeid='+place_id+'&m=crop&w=150&h=150&pre=TMP');
													$('#imgPre img').load(function(){$('#imgPre img').css({'opacity':'1.0'});});
												});
											$('#ISIUarea').load('/media/inlineupload.castle',function(){
																
												var weWantedTo=true;
													$('input[type=file]').ajaxfileupload({ 
															  'action': '/media/update.castle', 
															  'params': { 
															  	'image.id':'',
																'image.FileName':$('input#image_FileName'),
																'image.Caption':$('input#image_Caption'),
																'image.Credit':$('input#image_Credit'),
																'place_id':place_id,
																'image.type.id':1,
																'ajax':true
															  }, 
															  'onComplete': function(response) { 
																 // first test if it was uploaded ok.
																  if(isNumber(response)){
																	  
																	  $('#uploadMess').fadeOut('fast',function(){
																		  $('#uploadMess').remove();
																		  if($('#nextUpload').length==0){
																			  $('#ISIUarea').append('<div id="nextUpload"><h2>Next...</h2><h3><a href="#" id="place">Insert the new image</a></h3><h3><a href="#" id="again">Add more</a></h3></div>');
																			  }
																		  });
																	  
																	  // would get response here from response
																		image_id=response;image_id,
																		image_FileName = $('input#image_FileName').val();
																		image_Credit = $('input#image_Credit').val();
																		image_Caption = $('input#image_Caption').val();
																	  
																	  //add to 
																	  if($('#imgPre img').length==0){$('#imgPre').append('<img width="150" height="150" />');}
																	  $('#imagePicker :selected').attr('selected',false);//reset selection
																	  $('#imagePicker option:first').after('<option value="'+image_id+'" selected="selected">'+FileName+'</option>');// add new and select
																		$('#imgPre img').attr('src','/media/download.castle?id='+image_id+'&placeid='+place_id+'&m=crop&w=150&h=150&pre=TMP');
																		$('#imgPre img').load(function(){$('#imgPre img').css({'opacity':'1.0'});});
													
																	   $('#again').live('click',function(e){
																			e.preventDefault();
																			e.stopPropagation();
																		   $('#ISIUarea input[type=text]').each(function(){$(this).val('');});
																		   $('#ISIUarea input[type=file]').each(function(){$(this).val('');});
																		   $('#nextUpload').fadeOut('fast',function(){
																			   $('#ISIUarea form').fadeIn('fast');
																			   $('#nextUpload').remove();
																			});
																		});
																		$('#place').live('click',function(e){
																			e.preventDefault();
																			e.stopPropagation();
																			$('#ISIUarea input[type=text]').each(function(){$(this).val('');});
																		    $('#ISIUarea input[type=file]').each(function(){$(this).val('');});
																			//alert(image_id);
																			//var imgmar=;
																			//alert(imgmar);
																				ed.selection.execCommand('mceInsertContent',false,get_TinyMCE_InlinImage(image_id));
																			$( "#dialog-pickimage" ).dialog( "close" );
																			
																		});
																		
																		boxCreation(image_id);
																		addToImgRoster(image_id,image_FileName);
																		//console.log('custom handler for file:'); 
																		//alert(JSON.stringify(response)); 
																  }else{
																	 $('#uploadMess').fadeOut('fast',function(){
																		 $('#uploadMess').remove();
																		 if($('#nextUpload').length==0){$('#ISIUarea').append('<div id="nextUpload"><h2>Error</h2><h3><a href="#" id="again">Try Again</a></h3><p>There was an issue uploading<br/>Mess: '+JSON.stringify(response)+'<p/></div>');}
																	 });
																  }
															  }, 
															  'onStart': function() { 
															  	 FileName=$('input#image_FileName').val();
																 //alert('pause');
																//if(!weWantedTo) return false; // cancels upload 
																$('#ISIUarea form').fadeOut('fast',function(){
																	if($('#uploadMess').length==0){$('#ISIUarea').append('<div id="uploadMess"><h2>Uploading</h2></div>');}
																	});
																
																
															  }, 
															  'onCancel': function() { 
																//console.log('no file selected'); 
															  } 
															});
												});

											$('#inlinePlaceImageUpload').bind('click',function(e){
												e.preventDefault();
												e.stopPropagation();
												var imgid=$('#imagePicker :selected').val();
												 $('#ISIUarea').slideToggle('fast',function(){
													 $('#inlinePlaceImageUpload span').toggleClass('ui-icon-carat-1-n');
													 $('#inlinePlaceImageUpload span').toggleClass('ui-icon-carat-1-s');
												 });
												if( $('#ISIUarea').css('display')=='none'){
													$('#imgPre img').css({'opacity':'.0'}).attr('src','#');
													$('#imagePicker :selected').attr('selected',false);
												}
											});
										},
									buttons: {
										"Insert Image": function() {
											if($('#imagePicker :selected').val()!=''){
												tinyMCE.activeEditor.execCommand('mceInsertContent',false,get_TinyMCE_InlinImage($('#imagePicker :selected').val()));
												$( this ).dialog( "close" );
											}else{
												alert('You must choose an image or cancel.');
											}
										},
										Cancel: function() {
											$( this ).dialog( "close" );
										}
									}
								});
	
	}
function isIMG(){
	var node=tinyMCE.activeEditor.selection.getNode();
	if (node.nodeName != null && node.nodeName != 'IMG'){	
	 return false;
	}
	return true;
}

function contextmenu_fix(ed) {
	if(isIMG()){
		tinyMCE.activeEditor.plugins.contextmenu.onContextMenu.add(function(sender, menu){
			var has=false;
			for (var itemName in menu.items) {
				var item = menu.items[itemName];
				if(item.settings.title=='Edit image'){
					has=true;
					continue;
				}
			}
			if(!has){
				// create a new object
				var sub_menu = menu.addMenu({title : 'Edit image',icon : 'image'});
				var i=0;
				for (var image in tinyMCEImageList) {
					var node=tinyMCEImageList[image];
					var name=node.name;
					var image_id=node.id;
					sub_menu.add({title : name, icon : 'file', cmd :'editor_addimages_'+i, value : image_id});
					tinyMCE.activeEditor.addCommand('editor_addimages_'+i, function(ui, v) {
						var imgNode=$(tinyMCE.activeEditor.selection.getContent());
						var imgid=imgNode.attr('alt').split('|');
						var orgUrl=imgNode.attr('src');
						alert(v);
						alert(orgUrl);
						var url=orgUrl.split('id='+imgid[1]+'&placeid').join('id='+v+'&placeid');
						alert(url);
						imgNode.css({'opacity':'.65'});
						
						var orgtitle = imgNode.attr('title');  
						var newtitle=orgtitle.split('('+imgid[1]+' ').join('('+v+' ');
						alert(newtitle);
						imgNode.attr('alt',imgid[1]+'|'+v);

						imgNode.attr('title',newtitle);

						imgNode.attr('data-mce-src',url);
						
						imgNode.attr('src',url);
						
						var newUrl=imgNode.attr('src');
						alert(newUrl);
						tinyMCE.activeEditor.execCommand('mceRepaint');
						imgNode.load(function(){imgNode.css({'opacity':'1.0'});});
					});
					i++;
				}
			}
		});	
		
		// Add hook for onContextMenu so that Insert Image can be removed
		
	}
	tinyMCE.activeEditor.plugins.contextmenu.onContextMenu.add(editor_remove_insertImage);
}


function editor_oninit(ed) {
    // Add hook for onContextMenu so that Insert Image can be removed
    ed.plugins.contextmenu.onContextMenu.add(editor_remove_insertImage);
	if(typeof(place_id) !== 'undefined'&&place_id>0 && $('#place_Bodytext').val()!=''){
		setTimeout(function () {
			ed.controlManager.setActive('spellchecker', true);
			ed.execCommand('mceSpellCheck', true);
		}, 1);
	}
}

// replace your editor_remove_insertImage function with this:
function editor_remove_insertImage(sender, menu) {

    var otherItems = {};
	if(isIMG()){
		for (var itemName in menu.items) {
			var item = menu.items[itemName];
			if(item.settings.title!='Edit image'){
				continue;
			}
			otherItems[itemName] = item;
		}
	}
    for (var itemName in menu.items) {
        var item = menu.items[itemName];
        if(item.settings.title=='Edit image'){
            continue;
        }
		
        if (/^mce_/.test(itemName)) {
            if (item.settings) {
                if (item.settings.cmd == "mceImage" || item.settings.cmd == "mceAdvImage" || (isIMG() && item.settings.title=='Edit image')) {
                    // skip these items
                    continue;
                }
            }
        }
        // add all other items to this new object, so it is effectively a clone
        // of menu.items but without the offending entries
        otherItems[itemName] = item;
    }
    // replace menu.items with our new object
    menu.items = otherItems;

}






function get_TinyMCE_InlinImage(image_id){
	var baseurl='/';
	var MACRO='#Inline_Iamge('+image_id+' '+place_id+' 250 250 "")';
	return '<img src="'+baseurl+'image/download.castle?id='+image_id+'&placeid='+place_id+'&m=crop&w=250&h=250&pre=TMP" class="tinyImgHolder" alt="imagingIt|'+image_id+'" title="'+MACRO+'" />'; 
}

function get_TinyMCE_InlinYouTube(yCode,title,w,h,yclass){
	var baseurl='/';
	var MACRO="#youtube('"+yCode+"' '"+title+"' "+w+" "+h+" '"+yclass+"')";
	var html ='<img class="tinyImgHolder" src="http://img.youtube.com/vi/'+yCode+'/0.jpg" style="width:250px;" alt="youtubingIt|'+yCode+'|'+title+'" title="'+MACRO+'"/>';
    return html;   
}



function get_TinyMCE_imagegallery(w,h,yclass){
	var i=0
	for (var image in tinyMCEImageList) {
		if(i>0) continue;
		var node=tinyMCEImageList[image];
		var image_id=node.id;
		i++;
	}
	var baseurl='/';
	var MACRO="#imagegallery('"+place_id+"' "+w+" "+h+" '"+yclass+"')";
	var html ='<img src="'+baseurl+'image/download.castle?id='+image_id+'&placeid='+place_id+'&m=crop&w=250&h=250&pre=TMP&mark=SLIDESHOW" class="tinyImgHolder" alt="gallerya|'+image_id+'" title="'+MACRO+'"/>';
    return html;   
}



var FileName='';

function isNumber(n) {   return !isNaN(parseFloat(n)) && isFinite(n); } 
if(typeof(place_id)!=='undefined'){
var placeImgBtn = place_id>0?"|,mainImage,|,imagegallery,":"";
}




function tinyoptions(which){
    switch(which){
       case "bodytext":
            return {
                mode : "exact", 
                body_id : "left_col",
                elements : "place_Bodytext",
                theme : "advanced",
				width:"685",
                plugins : "autolink,lists,spellchecker,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,autoresize,advimagescale", 
                theme_advanced_buttons1 : "bold,italic,underline,|,justifyleft,justifycenter,justifyright,justifyfull,|,bullist,numlist,|,link,unlink,"+placeImgBtn+"|,youTube,|,cleanup,|,outdent,indent,|,removeformat|,anchor,|,cite,abbr,acronym,del,ins,attribs",
                theme_advanced_buttons2 : "visualchars,nonbreaking,pagebreak,|,undo,redo,|,cut,copy,paste,pastetext,pasteword,|,forecolor,backcolor,|,help,|,fullscreen,|,code,|,spellchecker", 
                theme_advanced_buttons3 : "styleselect,formatselect,fontselect,fontsizeselect",
                spellchecker_rpc_url: "/TinyMCEHandler.aspx?module=SpellChecker",
				theme_advanced_toolbar_location : "top", 
				theme_advanced_toolbar_align : "left", 
				theme_advanced_statusbar_location : "bottom", 
				// Example content CSS (should be your site CSS) 
				content_css : "/Content/css/main_tinymce.css", 
				//execcommand_callback : "CustomExecCommandHandler",
				setupcontent_callback:function(){
					
					//myCustomSetupContent();
				},				
				// Style formats
                style_formats : [
                        {title : 'Bold text', inline : 'b'},
                        {title : 'FLoat it left', selector : 'img', classes : 'fLeft'},
                        {title : 'FLoat it right', selector : 'img', classes : 'fRight'}
                ],
				formats : {
                        alignleft : {selector : 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes : 'left'},
                        aligncenter : {selector : 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes : 'center'},
                        alignright : {selector : 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes : 'right'},
                        alignfull : {selector : 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes : 'full'},
                        bold : {inline : 'span', 'classes' : 'bold'},
                        italic : {inline : 'span', 'classes' : 'italic'},
                        underline : {inline : 'span', 'classes' : 'underline', exact : true},
                        strikethrough : {inline : 'del'},
                        forecolor : {inline : 'span', classes : 'forecolor', styles : {color : '%value'}},
                        hilitecolor : {inline : 'span', classes : 'hilitecolor', styles : {backgroundColor : '%value'}},
                        custom_format : {block : 'h1', attributes : {title : "Header"}, styles : {color : 'red'}}
                },
				handle_node_change_callback :function(ed, node, undo_index, undo_levels, visual_aid, any_selection){
					
						
							//console.debug('Editor was clicked: ' + e.target.nodeName);
							if (node.nodeName == null || node.nodeName != 'IMG')
								return
								//alert(node.nodeName);
							var imgNode=$(node);
							if(typeof(imgNode.attr('src'))!=='undefined'){
								//alert(imgNode.attr('src'));
								var image=imgNode.attr('alt').split('|');
								//alert(image[0]);
								var theclass=imgNode.attr('class');
									theclass=theclass.split('tinyImgHolder');
									//alert(theclass[1]);
								if(image[0]=="imagingIt"){
									var image_id = image[1];
									imgNode.attr('title','#Inline_Iamge('+image_id+' '+place_id+' ' + imgNode.width() + ' ' + imgNode.height()+' \''+ theclass[1] +'\')');
									contextmenu_fix(ed);
								}
								if(image[0]=="youtubingIt"){
									var yCode=image[1];
									var title=image[2];
									imgNode.attr('title','#youtube(\''+yCode+'\' \''+title+'\' '+ imgNode.width() +' '+ imgNode.height() +' \''+ theclass[1] +'\')');
								}
								if(image[0]=="gallerya"){
									var image_id = image[1];
									imgNode.attr('title','#imagegallery(\''+place_id+'\' '+ imgNode.width() +' '+ imgNode.height() +' \''+ theclass[1] +'\')');
								}
								
								
								
							}
						
					
						
					},
				setup : function(ed) {

					//add edit images menu
						//push edit images to top and remove unwanted
						ed.onInit.add(editor_oninit);	
					 // Add a custom button
						ed.addButton('mainImage', {
							title : 'Main Image',
							image : '/Content/images/insert_image.png',
							onclick : function() {
								// Add you own code to execute something on click
								ed.focus();
								openImgResource(ed);
							}
						});
						ed.addButton('youTube', {
							title : 'Add YouTube',
							image : '/Content/images/insert_youtube.png',
							onclick : function() {
								// Add you own code to execute something on click
								ed.focus();
								var myBookmark = tinyMCE.activeEditor.selection.getBookmark();
								if($('#dialog-youtube').length==0){$('body').append('<div id="dialog-youtube">')}
								$( "#dialog-youtube" ).dialog({
									resizable: false,
									height:240,
									modal: true,
									create: function(event, ui) {
											$('#dialog-youtube').html(function(){
												var HTML='YouTube code<br/><input value="" id="yCode" /><br/>';
													HTML+='Title<br/><input value="" id="yTitle" /><br/>';
												return HTML;
											});
										},
									buttons: {
										"Set Image": function() {
											$( this ).dialog( "close" );
											var yCode = $('#yCode').val();
											var yTitle = $('#yTitle').val();
											var w=250;
											var h=250;
											var yclass='';
											tinyMCE.activeEditor.selection.moveToBookmark(myBookmark);
											tinyMCE.activeEditor.execCommand('mceInsertContent',true,get_TinyMCE_InlinYouTube(yCode,yTitle,w,h,yclass));
										},
										Cancel: function() {
											$( this ).dialog( "close" );
										}
									}
								});
							}
						})
						
						ed.addButton('imagegallery', {
							title : 'Add Gallery',
							image : '/Content/images/insert_gallery.png',
							onclick : function() {
								// Add you own code to execute something on click
								ed.focus();
								var w=250;
								var h=250;
								var yclass='';
								tinyMCE.activeEditor.execCommand('mceInsertContent',false,get_TinyMCE_imagegallery(w,h,yclass));
								
							}
						})
						
						
					},
				    advimagescale_maintain_aspect_ratio: false, /* this is the default behavior */
					advimagescale_fix_border_glitch: true, /* also the default behavior */
					advimagescale_noresize_all: false, /* set to true to prevent all resizing on images */
					advimagescale_append_to_url: true, /* apply dimensions to image URL on resize */
					advimagescale_url_width_key: 'w',  /* apply width to URL as w= param */
					advimagescale_url_height_key: 'h', /* apply height to URL as h= param */
					advimagescale_max_height: 650, /* limit maximum image height to 200px */
					advimagescale_max_width:  650, /* limit maximum image width to 200px */
					advimagescale_min_height: 150, /* minimum image height is 20px */
					advimagescale_min_width:  150, /* minimum image width is 20px */
					/* call this function when an image is loading */
					advimagescale_loading_callback: function(imgNode) {
						$(imgNode).css({'opacity':'.65'});
					},
					/* call this function when an image is finished loading */
					advimagescale_loaded_callback: function(imgNode) {
						$(imgNode).css({'opacity':'1.0'});
						
						var image=$(imgNode).attr('alt').split('|');
						var yclass=$(imgNode).attr('class');
						var theclass=$(imgNode).attr('class');
								theclass=theclass.split('tinyImgHolder');
						if(image[0]=="imagingIt"){
							var image_id = image[1];
								$(imgNode).attr('title','#Inline_Iamge('+image_id+' '+place_id+' ' + imgNode.width + ' ' + imgNode.height+' \''+ theclass[1] +'\')');
						}
						if(image[0]=="youtubingIt"){
							var yCode=image[1];
							var title=image[2];
								$(imgNode).attr('title','#youtube(\''+yCode+'\' \''+title+'\' '+ imgNode.width +' '+ imgNode.height +' \''+ theclass[1] +'\')');
						}
					},
					/* call this function when an image has been resized */
					advimagescale_resize_callback: function(editorInstance, imgNode) {
						editorInstance.execCommand("mceRepaint");
						
						var image=$(imgNode).attr('alt').split('|');
						var yclass=$(imgNode).attr('class');
						var theclass=$(imgNode).attr('class');
								theclass=theclass.split('tinyImgHolder');
						if(image[0]=="imagingIt"){
							var image_id = image[1];
								$(imgNode).attr('title','#Inline_Iamge('+image_id+' '+place_id+' ' + imgNode.width + ' ' + imgNode.height+' \''+ theclass[1] +'\')');
						}
						if(image[0]=="youtubingIt"){
							var yCode=image[1];
							var title=image[2];
								$(imgNode).attr('title','#youtube(\''+yCode+'\' \''+title+'\' '+ imgNode.width +' '+ imgNode.height +' \''+ theclass[1] +'\')');
						}
						//editorInstance.activeEditor.selection.collapse();
						//alert('resized to ' + imgNode.width + 'x' + imgNode.height);
					}
            }
        break;
       case "simple":
            return {
                mode : "exact", 
                elements : "place_Teaser",
                theme : "advanced",
                width : "685", 
				height:  "350",
				theme_advanced_resizing_min_height :150,
				setup : function(ed) {
					ed.onInit.add(function() {
						var e = tinymce.DOM.get(ed.id + '_tbl'), ifr = tinymce.DOM.get(ed.id + '_ifr'), w = ed.getWin(), dh;
						var h = 200; //new height of edit area
						dh = e.clientHeight - ifr.clientHeight; //get the height of the toolbars
						ed.theme.resizeTo(685, h + dh);
					});
				},
                plugins : "paste, spellchecker, autoresize",
                theme_advanced_buttons1 : "bold,italic,underline,|,undo,redo,|,cut,copy,paste,pastetext,pasteword,|,spellchecker",
                theme_advanced_buttons2 : "", 
                theme_advanced_buttons3 : "",
                spellchecker_rpc_url: "/TinyMCEHandler.aspx?module=SpellChecker"
            }
        break;
        default:
        case "default":
            return {
                mode : "exact", 
                elements : "tinyedit",
                theme : "advanced",
				width : "685", 
				height:  "350",
				theme_advanced_resizing_min_height :150,
				setup : function(ed) {
					ed.onInit.add(function() {
						var e = tinymce.DOM.get(ed.id + '_tbl'), ifr = tinymce.DOM.get(ed.id + '_ifr'), w = ed.getWin(), dh;
						var h = 200; //new height of edit area
						dh = e.clientHeight - ifr.clientHeight; //get the height of the toolbars
						ed.theme.resizeTo(685, h + dh);
					});
				},
                plugins : "paste, spellchecker, autoresize,advlink",
                theme_advanced_buttons1 : "bold,italic,underline,|,undo,redo,|,link,unlink,|,cut,copy,paste,pastetext,pasteword,|,spellchecker",
                theme_advanced_buttons2 : "", 
                theme_advanced_buttons3 : "",
                spellchecker_rpc_url: "/TinyMCEHandler.aspx?module=SpellChecker"
            }
        break;
    }
}


function load_tiny(which){
        if(typeof(which)==='undefined'){which="default";}
        tinyMCE.init(tinyoptions(which));
}

function loadStat(stat,place_id,diaObj){
    $.ajaxSetup ({cache: false}); 
    var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    //alert(place_id);
    $.get(siteroot+view+'setStatus.castle?id='+place_id+'&status='+stat , function(response, status, xhr) {
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
    var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    //alert(place_id);
    $.get(siteroot+view+'end_breaking_single.castle?id='+place_id , function(response, status, xhr) {
        diaObj.dialog( "close" );
        if(response!='true'){
            alertLoadingSaving(response);
        }else{
            alertLoadingSaving('Emails sent');
            setTimeout("removeAlertLoadingSaving()",1500);
        }
    });                       
}



function clearLock(place_id,diaObj,callback){
    $.ajaxSetup ({cache: false,async:false}); 
    var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    //alert(place_id);
    $.get(siteroot+view+'clearLock.castle?id='+place_id, function(response, status, xhr) {
        if(response=='true'){
            if(typeof(diaObj) !== 'undefined'&&diaObj!=''){
                $('body li.place_'+place_id).find('.inEdit').fadeOut('fast',function(){$('body li.place_'+place_id).find('.inEdit').remove();});
                $('body li.place_'+place_id).find('.UinEdit').fadeOut('fast',function(){$('body li.place_'+place_id).find('.UinEdit').remove();});
                $( ".buttons.steal" ).removeClass('ui-state-focus').removeClass('ui-state-hover');
                $( "#clearLock .buttons" ).removeClass('ui-state-focus').removeClass('ui-state-hover');
                $('body li.place_'+place_id).find('.buttons.editIt').attr('href','Edit_place.castle?id='+place_id);
                diaObj.dialog( "close" );	
            }
            if($.isFunction(callback)) callback();
        }
    });                       
}


function Checktitle(title,getid,callback){
    $.ajaxSetup ({cache: false}); 
    var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    //alert(place_id);
    var returnId=getid?'&id=true':''
    $.get(siteroot+view+'checktitle.castle?title='+title+returnId, function(response, status, xhr) {
            if($.isFunction(callback)) callback(response);
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
function removeToggle(){
	$('.imageBox').unbind('mouseenter mouseleave'); 
}
$(function() {
	
	$('.endcap').dblclick(function(){
		$('.mItem').each(function(index, element) {
			$(this).slideToggle('fast');
		});
	});
	
	
	$('.insotryupload').live('click',function(){
		openImgUploader();
	});
		$('.imgInfo').slideToggle();
	$('.DeleteImage').fadeToggle();	
	addToggle();
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
	if($(".lazy img,img.lazy").length){
		$(".lazy img,img.lazy").lazyload();
	}
    if(typeof(tinyMCE) !== 'undefined' && $('.tinyEditor').length>0){
        if($("#tabs-2 #place_Bodytext").length>0){
            load_tiny("bodytext");
            load_tiny("simple");
        }else{
            load_tiny();
        }
    }


/* General Actions */
    if($('.DeleteImage').length>0){
        $('.imageBox .DeleteImage').live('click',function(){
            var id = $(this).attr('rel');
            var image_id = $(this).attr('title');
            var obj = $(this);
            alertLoadingSaving();
			 obj.closest('.imageBox').find('.previewImg').css({opacity:.45});
	        $.get(siteroot+view+'DeleteImage.castle?imageid='+image_id+'&id='+id, function(data){
	            obj.closest('.imageBox').fadeOut('fast',function(){obj.closest('.imageBox').remove();});
				removeFromImgRoster(image_id);
	            setTimeout("removeAlertLoadingSaving()",1500);
	        });
	    });
	}








/* setup UI */
    if($( ".buttons" ).length > 0){
        $( ".buttons" ).button({text:false});
    }
    if($( "input[type='submit']" ).length > 0){
        $( "input[type='submit']" ).button();
    }


    
    if($( "a[title='Delete']" ).length>0){
        var deleteing='';
		var name='';
	    if($( "#deleteModule" ).length==0){
	        $( "body" ).append('<div id="deleteModule" title="Deleting"><h2 class="ui-state-error ui-corner-all"><span style="float: left; margin-right: .3em;margin-top:15px;margin-bottom:15px;" class="ui-icon ui-icon-alert"></span>Are you sure you<br/>wish to delete <span id="tar_item"></span>?</h2></div>');
	    }
	    $( "a[title='Delete']" )
		    .live('click',function(e) {
		    e.preventDefault();
		    e.stopPropagation();
		    deleteing=$(this).attr('href');
			name=$(this).closest('tr').find('.name').html();
			$('#tar_item').html(name!=''&&name!='undfinded'?name:'this');
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
		
	if($( ".EMAILUSER" ).length>0){
	    if($( "#emailModule" ).length==0){
	        $( "body" ).append('<div id="emailModule" title="Email user"><h4 style="line-height:20px;">Select a user to email.</h4><select id="emailing"></select></div>');
	        $( "#emailing" ).append('<option value="">-All-</option>');
	        $('.emailCol').each(function(i){
	            var userlistedID=$(this).attr('rel');
	            var userlisted=$(this).html();
	            if($( "#email_"+userlistedID ).length==0){
	                $( "#emailing" ).append('<option value="'+userlistedID+'" id="email_'+userlistedID+'">'+userlisted+'</option>');
	            }
	        });
	    }
	    $( ".EMAILUSER" )
		    .live('click',function(e) {
		    e.preventDefault();
		    e.stopPropagation();
		    $( "#emailModule" ).dialog( "open" );
	    });
	    $( "#emailModule" ).dialog({
		    autoOpen: false,
		    height: 200,
		    width:225,
		    modal: true,
		    hide: 'blind',
		    resizable: false,
		    draggable: false,
		    buttons: {
			    "Send": function() {
			        $( ".EMAILUSER" ).removeClass('ui-state-focus'); 
                    window.location=$( ".EMAILUSER" ).attr('href')+$(this).find('option:selected').val();
			    },
			    Cancel: function() {
				        $( ".EMAILUSER" ).removeClass('ui-state-focus'); 
				        $( this ).dialog( "close" );
			    }
		    }
	    });
	}










    if($( "#sub_tabs" ).length>0){
        $( "#sub_tabs" ).tabs();
	}
    if($( ".sub_tabs" ).length>0){
        $( ".sub_tabs" ).each(function(){
			$(this).tabs();
			
			});
	}
	
	
	
	

    
	
	
	function post_tmp(form_obj,diaObj,callback){
		$.ajaxSetup ({cache: false,async:false}); 
		var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
		//alert(place_id);
		$.post(form_obj.attr('action')+'?apply=Save', form_obj.serialize(), function(res, status, request) {
				  var Location = '/place/_edit.castle?id='+res; 

								window.location= Location; 
				$('body #content_area').fadeTo('fast',25);

		}); 
		
		

		
		
		                    
	}
	if($('.autoselect').length){
		$( ".autoselect" ).each(function(){$(this).combobox();});
	}
    if($( "#tabs" ).length>0){
        var  taboptions;	
        if($('#content_tar #tabs').length>0){
            //taboptions={cookie:{expires: 1,path:'/place/'}};
        } 
        $( "#tabs" ).tabs(typeof(place_id) !== 'undefined'&&place_id==0?{ disabled: [3] }:taboptions);
		
		if($('#content_tar #tabs').length>0 || (typeof(place_id) !== 'undefined'&&place_id==0)){
			if($( "#LocationTypeSelect" ).length){
				//$( "#LocationTypeSelect" ).combobox();
				//$( "#LocationModelSelect" ).combobox();
			}

			
		}
		
		if( (typeof(place_id) !== 'undefined'&&place_id==0) ){
			if($( "#chooseModel" ).length==0){
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
						if($('#set_model :selected').val() !=''){
							$( this ).dialog( "close" );
							if($( "#loading_tmp" ).length==0){
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
			$('#set_model').next('.ui-autocomplete-input').live('change',function(){
						if($('#set_model :selected').val() !=''){
							if($('#set_model').next('.ui-autocomplete-input').hasClass('errored')){
								$('#set_model').next('.ui-autocomplete-input').css({'box-shadow':'0px 0px 10px 0px #23b618'}).removeClass('errored');
							}
						}else{
							$('#set_model').next('.ui-autocomplete-input').css({'box-shadow':'0px 0px 10px 0px #f00'}).addClass('errored');
						}
						$("#LocationModelSelect option[value='"+$('#set_model :selected').val()+"']").attr("selected","selected");
						$("#LocationModelSelect").next('input').val($('#set_model :selected').text());
			});
		}
        //var stat=$.QueryString["status"];
		var stat=param( "status" );
        var moveToTab=0;
        if(stat=="review"){
            moveToTab=1;
        }else if(stat=="draft"){
            moveToTab=2;
        } 
        if(moveToTab>0){
            $( "#tabs" ).tabs( "select" , moveToTab );
        } 
    }

//
// COME BACK TO
//
//var orgin_w=$( "#smaple_area" ).width();
//
//
//$( "#smaple_area" ).resizable({
//	handles: 'w',
//	resize: function(event, ui) {
//		$('#map_canvas').css("width",$( "#smaple_area" ).width());
//		$('.mainAreaTabs').css("width",$('.mainAreaTabs').width()+-($( "#smaple_area" ).width()-orgin_w));
//	}
//});
//
//











	$(".editzone").live("blur",function() { 
		var txt = $(this); 
		txt.prev('.editable').text(txt.val()); 
		txt.parent(".pod").removeClass("editing"); 
	}); 
	$(".pod .editable").live('click',function(e) { 
		e.preventDefault();
		e.stopPropagation();
		$(this).next().val($(this).text()).focus(); 
		$(this).parent().addClass("editing"); 
		var TAR=$(this).attr('rel')
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
		$('#customName em').text( $('#customName em').text() == '+' ? '-' : '+' );
		$('#customNames').slideToggle();
	});

	$('#PlaceTagCreate').live('click',function(e){
		e.preventDefault();
		e.stopPropagation();
		i=$('#taged .pod').size();
		if(i==0)$('#taged').html('');
		$('#taged').append($('#tag_clonebed').html().replace(/[9]{4}/g, (i>-1?i:i+1) ).replace(/\|\|/g, '' ) );
	});
	$('#PlaceNameCreate').live('click',function(e){
		e.preventDefault();
		e.stopPropagation();
		i=$('#names .pod').size();
		$('#names').append($('#name_clonebed').html().replace(/[9]{4}/g, (i>-1?i:i+1) ).replace(/\|\|/g, '' ) );
	});


	$('[name="ele.type"]').not('#style_of').change(function(){
		if($('[name="ele.type"] :selected').val()=="dropdown"){
			$('#optionsSelection').slideDown('fast');
			$('#optionsSelectionDefaults').slideUp('fast');
		}else{
			$('#optionsSelection').slideUp('fast');
			$('#optionsSelectionDefaults').slideDown('fast');
			$('#ops').html('');
		}
	});
	$("#ele_attr_multiple").live("change",function(){
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
	$('.pod [type=radio]').live("change",function(){
		$('.pod :checked').attr("checked",false);
		$(this).attr("checked",true);
	});
	$('.pod .opVal').live("change",function(){
		$(this).siblings('[type=radio]').val($(this).val());
		$(this).siblings('[type=checkbox]').val($(this).val());
	});

	$('#addOption').live('click',function(e){
		e.preventDefault();
		e.stopPropagation();
		i=$('#ops .pod').size();
		$('#ops').append($('#option_clonebed').html().replace(/[9]{4}/g, (i>-1?i:i+1) ) );
	});
	$('.deleteOption').live('click',function(e){
		e.preventDefault();
		e.stopPropagation();
		$(this).closest('.pod').remove();
	
		$('#ops .pod').each(function(i){
			$(this).find('input').each(function(j){
				$(this).attr('name',$(this).attr('name').replace(/[\d+]/g, (i>-1?i:i+1)) );
			});
		});
	});


    if($( "#place_publishtime,#advertisement_expiration,#comment_createtime,#classified_CreateDate,#pdf_Date,#advertisement_startdate" ).length>0){
	    $( "#place_publishtime,#advertisement_expiration,#comment_createtime,#comment_updatetime,#classified_CreateDate,#classified_ExpirationDate,#pdf_Date,#advertisement_startdate" ).datetimepicker({
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
		    onClose: function(dateText, inst) {
		        //auto take off a null time.. ie if left at midnight, it's not wanted.
		        if (dateText.indexOf('00:00')!=-1||dateText.indexOf('12:00 AM')!=-1||dateText.indexOf('12:00 am')!=-1){
	                temp = dateText.split(' ');
	                $(this).val(temp[0]);
                }
		    }
	    });
	}


/* -----------
    for images
    ---------------- */
/* for image editing */
    if($('#imageTypeDD').length>0){
        $("#imageTypeDD").live('change',function () {
            if($(this).find(':selected').val()=='1'){
                $('#imageTypes').show();
            }else{
                $('#imageTypes').hide();
            }
        });
    }
    if(typeof(availablecredits) !== 'undefined'){
        if($( "#image_Credit" ).length>0){
			$( "#image_Credit" ).autocomplete({
				source: availablecredits
			});
		}
		if($( ".placeCredit" ).length>0){
			$( ".placeCredit" ).autocomplete({
				source: availablecredits
			});	
		}
		
		
    }

	
	
	$(function() {
		$('#browserBox').sortable({
			placeholder: "ui-state-highlight",
			update: function(event, ui) {
			$('#browserBox .placeOrder').each(function(){
				$(this).val($('#browserBox .placeOrder').index($(this)));
				});
			}
		});
	});

$('.detailInfoBut').toggle(
  function(){

    $(this).closest('.detailCol').stop().animate({
        width:"125px"
      }, 500, function() {
      });
	  
  },
  function(){

    $(this).closest('.detailCol').stop().animate({
        width:"0px"
      }, 500, function() {
      });
	  
  }
);


	
	
$('#img_layout_choice').toggle(
  function(){

    $('.imageBox').stop().animate({
        width:"100%",
        height: "175px",
        "min-height": "175px"
      }, 500, function() {
        // Animation complete.
        $('#img_layout_choice').addClass('list');
		 $('#browserBox').removeClass('grid');
		$('#browserBox').addClass('list');
		removeToggle();
      });
	  
  },
  function(){

    $('.imageBox').stop().animate({
        width:"175px",
        height: "175px"
      }, 500, function() {
        // Animation complete.
        $('#img_layout_choice').removeClass('list');
        $('#browserBox').removeClass('list');
		$('#browserBox').addClass('grid');
		addToggle();
      });
	  
  }
);

  


/* -----------
    for stories
    ---------------- */

    /* for place listings */
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
					loadStat(2,place_id,diaObj)

				},
				"Published": function() {
				    var diaObj=$(this);
					loadStat(3,place_id,diaObj)
				},
				Cancel: function() {
					    $( ".buttons.pubState" ).removeClass('ui-state-focus'); 
					    $( this ).dialog( "close" );
				}
			}
		});
		$( ".pubState" )
			.live('click',function(e) {
			e.preventDefault();
			e.stopPropagation();
			place_id=$(this).closest('.place_aTar').attr('title');
			$( "#dialog" ).dialog( "open" );
		});


    if($('#sendBR').length==0){$('body').append('<div id="sendBR" title="Send" style="display:none;"><p>Release the Place out in email<br/><strong>Note:</strong>If You don\'t want to over use this.</p></div>')}
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
		$( ".sendBR" )
			.live('click',function(e) {
			e.preventDefault();
			e.stopPropagation();
			place_id=$(this).closest('.place_aTar').attr('title');
			$( "#sendBR" ).dialog( "open" );
		});




		
        if($('#listPlaceType').length>0){
            $("#listPlaceType").live('change',function () {
                window.location = siteroot+view+"list.castle?searchId="+$(this).find(':selected').val(); 
            });
        }
		

    /* for place editing */
    if(typeof(availableTags) !== 'undefined'){
        $( "#place_Location" ).autocomplete({
		    source: availableTags
	    });
    }
    if($('.imagedropDown').length>0){
        $(".imagedropDown").live('change',function () {
            if($(this).closest('div').find(".selectedImage").length==0){$(this).closest('div').append('<img src="" class="selectedImage" width="100" />') }
            $(this).closest('div').find(".selectedImage").attr('src', siteroot+'image/download.castle?id=' + $(this).val());
        });
    }
    


    if($('.addImage').length>0){
        $(".addImage").live('click',function () {
            $.get(siteroot+view+'GetAddImage.castle?count='+image_count, function(data){
                $('#ExistingImagesDiv').append(data);
                ++image_count;
            });
        });
    }
    if($('.deleteAuthor').length>0){
        $('.deleteAuthor').live('click',function(){
            var author_id = $(this).attr('title');
            var PlaceId = $(this).attr('rel');
            alertLoadingSaving();
	        $.get(siteroot+view+'DeleteAuthor.castle?id='+author_id+'&placeId='+PlaceId, function(data){
	             $("div#AuthorDiv #div" + author_id).remove();
	            setTimeout("removeAlertLoadingSaving()",1500);
	        });
	    });
	}
    if($('.DeleteTag').length>0){
        $('.DeleteTag').live('click',function(){
            var PlaceId = $(this).attr('title');
            var tag_id = $(this).attr('rel');
            alertLoadingSaving();
	        $.get(siteroot+view+'DeleteTag.castle?id='+tag_id+'&placeId='+PlaceId, function(data){
	            $("#tag_"+ tag_id).closest('li').remove();
	            setTimeout("removeAlertLoadingSaving()",1500);
	        });
	    });
	}


   // $(".imagedropDown").change(function (){
   //      $(".selectedImage",$(this).parent()).attr('src','/image/download.castle?id=' + $(this).val());});	   
   //  });
    /* for place listings */
    if($('#clearLock').length==0){$('body').append('<div id="clearLock" title="Clear Place Editing Lock" style="display:none;"><p>Release the Place for editing<br/><strong>Note:</strong>If some one is editing it you may wish to ask to make sure they are done.</p></div>')}
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
			.live('click',function(e) {
			e.preventDefault();
			e.stopPropagation();
			place_id=$(this).attr('rel');
			$( "#clearLock" ).dialog( "open" );
		});
		
		//This is so that you can use the nav when leaving the editing area.  IE: the same as clicking cancel
        if(url_parts['path']=='/place/Edit_place.castle'){
		    $( "#main_nav a,a.PDF.creation " ).live('click',function(e) {
			    //e.preventDefault();
			    //e.stopPropagation();
			    //var obj=$(this);
			    clearLock($('#place_Id').val(),'',function(){
					//window.location=obj.attr('href');
					});
		    });
        }
        if(url_parts['path']=='/place/new.castle'){
            $('input#place_title').keyup(function() {
                var val=$('input#place_title').val();
                var val=val.split(' ').join('-');
                var val=val.split("'").join('');
                var val=val.split('"').join('');
                var val=val.split(';').join('');
                var val=val.split(':').join('');
                $('#place_CustomUrl').val(val);
                clearCount('titleCheck');
                setCount('titleCheck',200,function(){
                    Checktitle($('#place_CustomUrl').val(),false,function(data){
                            if(data=='true'){
                                if($('#hasTitle').length==0){$('#place_CustomUrl').after('<span id="hasTitle">This url is in use.</span>');}
                            }else{
                                if($('#hasTitle').length>0){$('#hasTitle').remove();}
                            }
                            clearCount('titleCheck');
                        });
                });
            });
        }
        if(url_parts['path']=='/place/new.castle'||url_parts['path']=='/place/Edit_place.castle'){
            $('#place_CustomUrl').keyup(function() {
                clearCount('titleCheck');
                setCount('titleCheck',200,function(){
                    Checktitle($('#place_CustomUrl').val(),false,function(data){
                            if(data=='true'){
                                if($('#hasTitle').length==0){$('#place_CustomUrl').after('<span id="hasTitle">This url is in use.</span>');}
                            }else{
                                if($('#hasTitle').length>0){$('#hasTitle').remove();}
                            }
                            clearCount('titleCheck');
                        });
                });
            });
        
        
        var click=0;
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
        var clear=false;
        /*$('input[type=submit]:not(".cancel_btn")').live('click', function(e) {
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
    ---------------- */
    if(typeof(availablePositions) !== 'undefined'){
        $( "#person_position" ).autocomplete({
		    source: availablePositions
	    });
    }



/* -----------
    for adverts
    ---------------- */
    if($('#add_ad_image').length>0){
        $("#add_ad_image").live('click',function () {
            $.get(siteroot+view+'GetAddImage.castle?count='+image_count, function(data){
                $('#NewImageHolderDiv').html($('#NewImageHolderDiv').html()+ data);
                ++image_count;
            });
        });
    }







































































































































		// actual addTab function: adds new tab using the title input from the form above
		function  addTab(tab_title,tab_counter,callback){
			$tabs.tabs( "add", "#tabs-" + tab_counter, tab_title );
			typeof(callback)!=="undefined"?(callback)($("#tabs-" + tab_counter)):null;
		}



	if($( ".TABS" ).length>0){
		var $tab_title_input = $( "#tab_title"),
			$tab_content_input = $( "#tab_content" );
		var tab_counter = 0;
		var $tabs = $('.LEVEL_TABS').tabs({
			tabTemplate: "<li><span class='ui-icon ui-icon-close'>Remove Tab</span><a href='#{href}'>#{label}</a> </li>",
			add: function( event, ui ) {
				tab_counter++;
				$( ui.panel ).append($('.clone_pool').html().replace(/[9]{4}/g, (tab_counter>0?tab_counter:tab_counter+1) ).replace(/\|\|/g, '' ) );
				$( ui.panel ).find('.TABS:last').tabs();
				set_slider( $( ui.panel ).find('.TABS:last').find('.slider-range') );
			}
		});
		$( ".LEVEL_TABS span.ui-icon-close" ).live( "click", function() {
			var index = $( "li", $tabs ).index( $( this ).parent() );
			$tabs.tabs( "remove", index );
		});

		// addTab button: just opens the dialog
		$( "#add_tab" )
			.button()
			.on('click',function(e) {
				e.preventDefault();
				e.stopPropagation();
				var tab_title = 'Zoom level:<span class="name__start">0</span><span class="name__endarea"> to <span class="name__end">14</span></span>';
				addTab(tab_title,tab_counter,function(tab){
					set_slider( tab.find('.slider-range') );
				});
			});
        $( ".TABS:not(.clone_pool .TABS)" ).each(function(i){
			$(this).tabs();
		});
	}	
	
	

$( ".slider-range" ).each(function(){ set_slider( $(this) ); });		
function set_slider(obj){
	obj.slider({
		range: true,
		min: 0,
		max: 14,
		values: [ 0, 14 ],
		slide: function( event, ui ) {
			var start 	= ui.values[ 0 ];
			var end 	= ui.values[ 1 ];
			
			obj.next( ".__start" ).val(start);
			obj.next( "._end" ).val(end);
			
			var i = obj.closest('.ui-tabs-panel').index(obj.closest('.LEVEL_TABS').find('.ui-tabs-panel'));
			//alert(i);
			obj.closest('.LEVEL_TABS').find('.name__start:eq('+i+')').text(start);
			obj.closest('.LEVEL_TABS').find('.name__end:eq('+i+')').text(end);
			if(start==end){
				obj.closest('.LEVEL_TABS').find('.name__endarea:eq('+i+')').hide();
			}else{
				obj.closest('.LEVEL_TABS').find('.name__endarea:eq('+i+')').show();
			}
				
			obj.closest('.ZoomChoice').find('.name__start').text(start);
			obj.closest('.ZoomChoice').find('.name__end').text(end);
			
		}
	});
}
	
function set_up_style_list(obj){
		var mode = obj.attr('id').split('__')[1].split('_')[1];
		var objs_to_rebuild = obj.find('.sortStyleOps :input');	
			
		obj.find('.sortStyleOps').sortable({
			connectWith:  ".connectedSortable",
			placeholder: "ui-state-highlight",
			stop: function(event, ui) {
				if(ui.item.parent('.sortStyleOps.pool')){
					ui.item.find(':input').val('');
				}
				rebuild_example(objs_to_rebuild,map,mode);
			}
		});

		objs_to_rebuild.live('change', function(){
			rebuild_example(objs_to_rebuild,map,mode);
		});
		$("#" + obj.attr('id') + " .color_picker").each(function(i){
			var id = mode+'_'+obj.attr('id')+'_color_picker_'+i;
			//alert(id);
			if($('#'+id).length<=0){
				$(this).attr("id",id);
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
						  y: 'bottom',
						},
						expandable: false,
						liveUpdate: true,
						alphaSupport: false,
						alphaPrecision: 0,
						updateInputColor: true
					  },
					images:{ clientPath:'/Content/js/colorpicker/images/'}
				},function(color, ob){
					rebuild_example(objs_to_rebuild,map,mode);
				},function(color, ob){
					rebuild_example(objs_to_rebuild,map,mode);
				},function(color, ob){
					rebuild_example(objs_to_rebuild,map,mode);
				});
			}
		});
		$( ".opacity" ).each(function(i){
			var subobj = $(this);
			subobj.slider({
				range: 	"min",
				value:	1.0,
				min: 	0.0,
				max:	1.0,
				step: 	.01,
				slide: function( event, ui ) {
					subobj.prev('input').val( ui.value ).trigger('change');
				}
			});
			subobj.prev('input').val(subobj.slider( "value" ));
		});
		$( ".weight" ).each(function(i){
			var subobj = $(this);
			subobj.slider({
				range: 	"min",
				value:	0,
				min: 	0,
				max:	20,
				step: 	.1,
				slide: function( event, ui ) {
					subobj.prev('input').val( ui.value ).trigger('change');
				}
			});
			subobj.prev('input').val(subobj.slider( "value" ));
		});

}

$('#style_of').change(function(){
	var sel = $(this).find(':selected').text();
	$('.tabed').each(function(){
		var obj=$(this);
		obj.find('.pod').fadeOut('fast');
		obj.find('.pod.op_'+sel).fadeIn('fast');
		if(defined(DEFAULT_overlay)){
			DEFAULT_overlay.setMap(null);
			DEFAULT_overlay.delete;
		}
		create_default_shape(map,sel);
		set_up_style_list(obj);
	});
});




});