

$.wsu_maps.admin.ui.media = {
	ini:function(){},
	boxCreation:function (image_id){
		var image_Credit='';
		var image_Caption='';
		var HTML ='<span class="imageBox">';
			HTML+='<input type="hidden" value="'+image_id+'" name="images['+image_id+'].id"  class="placeImages">';
			HTML+='<img src="'+$.wsu_maps.state.siteroot+'media/download.castle?id='+image_id+'&placeid='+$.wsu_maps.admin.defaults.place_id+'&m=crop&w=175&h=175&pre=borwser" class="previewImg" />';
			HTML+='<a title="'+image_id+'" rel="'+$.wsu_maps.admin.defaults.place_id+'" style="cursor:pointer;display: inline-block;" class="DeleteImage ui-state-error ui-corner-all">';
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
	},
	addToImgRoster:function (id,name){
		if(typeof(id)==='undefined'||id<=0){return}
		if(typeof(name)==='undefined'){name="";}
		$.wsu_maps.admin.ui.tinymce.tinyMCEImageList.push({id:""+id,name:name,url:$.wsu_maps.state.siteroot+"media/download.castle?id="+id+"&placeid="+$.wsu_maps.admin.defaults.place_id+"&m=crop&w=250&h=250&pre=TMP"});	
	},
	removeFromImgRoster:function (id){
		if(typeof(id)==='undefined'||id<=0){return}
		var i=0;			
		for (var image in $.wsu_maps.admin.ui.tinymce.tinyMCEImageList) {
			var node=$.wsu_maps.admin.ui.tinymce.tinyMCEImageList[image];
			if(node.id==id){
				$.wsu_maps.admin.ui.tinymce.tinyMCEImageList.remove(i);
			}
			i++;
		}
	},
	removeToggle:function (){
		$('.imageBox').unbind('mouseenter mouseleave'); 
	},
	
};


function updateaddImageDIV(transport){
    var temp = document.getElementById("NextImageID");
    var newdiv = document.createElement('div');
    var divIdName = 'Image'+temp.value+'Div';

    newdiv.setAttribute('id',divIdName);
    newdiv.innerHTML = transport.responseText;
    var ni = document.getElementById('NewImageHolderDiv');
    ni.appendChild(newdiv);
}





function DeleteImage(image_id,placeId){
    $.get($.wsu_maps.state.siteroot+$.wsu_maps.state.view+'DeleteImage.castle?id='+image_id+'&placeId='+placeId, function(data){});
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



























$(function() {
    if($('.DeleteImage').length>0){
        $('.imageBox .DeleteImage').on('click',function(){
            var id = $(this).attr('rel');
            var image_id = $(this).attr('title');
            var obj = $(this);
            alertLoadingSaving();
			obj.closest('.imageBox').find('.previewImg').css({opacity:.45});
	        $.get($.wsu_maps.state.siteroot+$.wsu_maps.state.view+'DeleteImage.castle?imageid='+image_id+'&id='+id, function(data){
	            obj.closest('.imageBox').fadeOut('fast',function(){obj.closest('.imageBox').remove();});
				$.wsu_maps.admin.ui.media.removeFromImgRoster(image_id);
	            setTimeout($.wsu_maps.admin.removeAlertLoadingSaving(),1500);
	        });
	    });
	}

	/* -----------
		for images
		---------------- */
	/* for image editing */
    if($('#imageTypeDD').length>0){
        $("#imageTypeDD").on('change',function () {
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
	$('#browserBox').sortable({
		placeholder: "ui-state-highlight",
		update: function(event, ui) {
		$('#browserBox .placeOrder').each(function(){
			$(this).val($('#browserBox .placeOrder').index($(this)));
			});
		}
	});
	
	$('.img_layout_choice').on('click',function(){
		var self = $(this);
		var imageArea= self.siblings('.browserBox');
		
		if(!self.is($('.list'))){
			$.each(imageArea.find('.imageBox'),function(){
				$(this).stop().animate({
					width:"100%",
					height: "175px",
					"min-height": "175px"
				}, 500, function() {
				// Animation complete.
				
					$.wsu_maps.admin.ui.media.removeToggle();
				});
			});
			self.addClass('list');
			imageArea.removeClass('grid');
			imageArea.addClass('list');
		}else{
			$.each(imageArea.find('.imageBox'),function(){
				$(this).stop().animate({
					width:"175px",
					height: "175px"
				}, 500, function() {
				// Animation complete.
				
					addToggle();
				});
			});
			self.removeClass('list');
			imageArea.removeClass('list');
			imageArea.addClass('grid');
		}
	});
	
	
	
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
				$.wsu_maps.admin.ui.media.removeToggle();
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
	
});