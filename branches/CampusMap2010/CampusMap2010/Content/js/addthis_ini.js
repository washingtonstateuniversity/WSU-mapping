$(function() {
	var time;
	function timeout(){
		time=setTimeout(function(){shrink()},2000);
	}
	function clearTimer(){
		clearTimeout(time);
	}
	function shrink() {
		$('.clickshare').removeClass('open');
		$('#social-list').animate({height:'toggle'},140, function () {});	
		clearTimer();
	}
	function expand(){
		$('.clickshare').addClass('open');
		$('#social-list').animate({height:'toggle'},140);			
		clearTimer();
	}
	$('.open').on('blur',function(event){
		$(this).is('.open') ? shrink() : null;
	});
	$('.clickshare').on('click', function(e){
		e.stopPropagation();
		e.preventDefault();
		$(this).is('.open') ? shrink() : expand();
	});
	$('.sharearea').on("mouseleave", function(e){
		$('.clickshare').is('.open') ? timeout() : null;
	});
	$('.sharearea').on("mouseenter", function(e){ clearTimer(); });
});
var addthis_config = {
	 ui_cobrand: "WSU",
	 ui_header_color: "#000",
	 ui_header_background: "#FFF", 
	 data_track_clickback: true,
	 data_ga_property: 'UA-22127038-5'<!-- IMPORTANT change for each site -->
};