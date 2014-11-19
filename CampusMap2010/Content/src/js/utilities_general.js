if(typeof(loading)==='undefined'){var loading='';}
utilities={};
/* setup VARS */
var c=0;

/* -----------
    utility functions 
    -----------------------*/
function async_load_css(url,callback){
	var headID = document.getElementsByTagName("head")[0],node = document.createElement('link');
	node.type = 'text/css';
	node.rel = 'stylesheet';
	node.href = url;
	node.media = 'screen';
	headID.appendChild(node);
}
function async_load_js(url,callback){
	var headID = document.getElementsByTagName("head")[0], s = document.createElement('script');
	s.type = 'text/javascript';
	s.async = true;
	s.src = url;
	var x = document.getElementsByTagName('script')[0];
	if(typeof(callback)!=='undefined' && typeof(callback.onreadystatechange)==='undefined'){
		s.onreadystatechange = callback.onreadystatechange;
		s.onload = callback.onload;
	}
	headID.appendChild(s);
}
function defined(obj){ return typeof(obj)!=='undefined'; }
function shuffle(ary){ return ary.sort(function(){ Math.random() - 0.5; }); }
function isNumber(n){ return !isNaN(parseFloat(n)) && isFinite(n); } 
function split(val){ return val.split( /,\s*/ ); }
function extractLast(term){ return split( term ).pop(); }
/*!
 * jQuery Cookie Plugin v1.4.0
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as anonymous module.
		define(['jquery'], factory);
	} else {
		// Browser globals.
		factory(jQuery);
	}
}(function ($) {
	var pluses = /\+/g;
	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}
	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}
	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}
	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}
		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
		} catch(e) {
			return;
		}
		try {
			// If we can't parse the cookie, ignore it, it's unusable.
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}
	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}
	var config = $.cookie = function (key, value, options) {
		// Write
		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);
			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}
			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}
		// Read
		var result = key ? undefined : {};
		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];
		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');
			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}
			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}
		return result;
	};
	config.defaults = {};
	$.removeCookie = function (key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}
		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};
}));//-------------------------------------------------------------------------------------------------------------------------------------------------------------
// jeremy's URL funtions
//-------------------------------------------------------------------------------------------------------------------------------------------------------------	
(function($) {
    $.QueryString = (function(a) {
        if (a === ""){
			return {};
		}
        var b = {};
        for (var i = 0; i < a.length; ++i){
            var p=a[i].split('=');
            if (p.length !== 2){
				continue;
			}
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'));
})($);


function parseUri (str) {
	var	o   = parseUri.options,
		m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
		uri = {},
		i   = 14;

	while (i--){
		uri[o.key[i]] = m[i] || "";
	}

	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
		if ($1) uri[o.q.name][$1] = $2;
	});

	return uri;
}

parseUri.options = {
	strictMode: false,
	key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
	q:   {
		name:   "queryKey",
		parser: /(?:^|&)([^&=]*)=?([^&]*)/g
	},
	parser: {
		strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
		loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	}
};

var url_parts = parseUri(window.location);


// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
function param(name,url){
	url=(typeof(url)==='undefined'?window.location.href:url);
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( url );
	if( results === null ){
		return false;
	}else{
		return results[1];
	}
}
	
///* hash handlings  *///
	$(window).bind('load', function() {
		//If we use it as docs page, go to the selected option
		if(window.location.hash && window.location.href.indexOf('/docs/') != -1) {
			gotoHash();
		}
	});
	function listenToHashChange() {
		var savedHash = window.location.hash;
		window.setInterval(function() {
			if(savedHash !== window.location.hash) {
				savedHash = window.location.hash;
				if(window.location.hash && window.location.href.indexOf('/docs/') !== -1){
					gotoHash();
				}
				//Since we have bind click event on demos link and load hash on document.ready
				//if(window.location.hash && window.location.href.indexOf('/demos/') != -1)
				// loadHash();
			}
		},200);
	}
	function loadHash() {
		$('#demo-config-menu a').each(function() {
			if(this.getAttribute('href').indexOf('/'+window.location.hash.substr(1)+'.html') !== -1) {
				$(this).parents('ul').find('li').removeClass('demo-config-on');
				$(this).parent().addClass('demo-config-on');
				loadDemo(this.getAttribute('href'));
			}
		});
	}
	function gotoHash() {
		var hash = window.location.hash.substr(1).split('-');
		var go = hash[1] ? hash[1] : hash[0];
		var resolve = { overview: 0,option: 1,event: 2,method: 3,theming: 4 };
		$("#widget-docs").tabs('select', resolve[hash[0]]);
		var h3 = $("#widget-docs a:contains("+go+")").parent();
		h3.parent().parent().toggleClass("param-open").end().next().toggle();
		$(document).scrollTop(h3.parent().effect('highlight', null, 2000).offset().top);
	}
//-------------------------------------------------------------------------------------------------------------------------------------------------------------
// jeremy's timer funtions
//-------------------------------------------------------------------------------------------------------------------------------------------------------------
var timers_arr=timers_arr|| new Array();
function clearCount(timer){
	if(typeof(timers_arr)!=='undefined' && typeof(timers_arr[timer])!=='undefined'){
		/// clear the time from timer
		clearTimeout(timers_arr[timer]);
		/// Make sure it's clear  
		timers_arr[''+timer+'']=0;
		delete timers_arr[''+timer+''];
	}
}
function setCount(timer,time,func){
	if(typeof(timers_arr)==='undefined'){
		timers_arr = new Array();
	}
	clearCount(timer);
	if(timers_arr[timer]===0||typeof(timers_arr[timer]) === 'undefined'){
		timers_arr[timer]=setTimeout(function(){
			func();                                                 
		},time);
	}
}
		
//-------------------------------------------------------------------------------------------------------------------------------------------------------------
// jeremy's Browser funtions
//-------------------------------------------------------------------------------------------------------------------------------------------------------------
var inTouch=false;
function isTouch() 	{
	if ( isIpad() || isMobile()) {
		return true;
	}return false;
}
function isIpad() 	{
	if ( navigator.userAgent.indexOf('iPad') !== -1 ) {
		return true;
	}
	return false;
}
function isMobile() {
	if ( navigator.userAgent.indexOf('iPhone') !== -1 || navigator.userAgent.indexOf('Android') !== -1 ) {
		return true;
	}
	return false;
}





//-------------------------------------------------------------------------------------------------------------------------------------------------------------
// jeremy's Cache and load Control funtions
//-------------------------------------------------------------------------------------------------------------------------------------------------------------
$.fn.preload = function() {
	if($('#preloader').length===0){
		$('body').append('<div id="preloader" style="position:absolute;top:-9999px;left:-9999px;"></div>');
	}
	this.each(function(){
		$('#preloader').append('<img src="'+this+'" style="position:absolute;top:-9999px;left:-9999px;"/>');
	});
}



//-------------------------------------------------------------------------------------------------------------------------------------------------------------
// jeremy's color space funtions
//-------------------------------------------------------------------------------------------------------------------------------------------------------------	
function color_html2kml(color){
    var newcolor ="FFFFFF";
    if(color.length === 7){
		newcolor = color.substring(5,7)+color.substring(3,5)+color.substring(1,3);
	}
    return newcolor;
}
function color_hex2dec(color) {
    var deccolor = "255,0,0";
    var dec1 = parseInt(color.substring(1,3),16);
    var dec2 = parseInt(color.substring(3,5),16);
    var dec3 = parseInt(color.substring(5,7),16);
    if(color.length === 7){
		deccolor = dec1+','+dec2+','+dec3;
	}
    return deccolor;
}
function getopacityhex(opa){
    var hexopa = "66";
    if(opa === 0){ hexopa = "00";}
    if(opa === 0.0){ hexopa = "00";}
    if(opa >= 0.1){ hexopa = "1A";}
    if(opa >= 0.2){ hexopa = "33";}
    if(opa >= 0.3){ hexopa = "4D";}
    if(opa >= 0.4){ hexopa = "66";}
    if(opa >= 0.5){ hexopa = "80";}
    if(opa >= 0.6){ hexopa = "9A";}
    if(opa >= 0.7){ hexopa = "B3";}
    if(opa >= 0.8){ hexopa = "CD";}
    if(opa >= 0.9){ hexopa = "E6";}
    if(opa === 1.0){ hexopa = "FF";}
    if(opa === 1){ hexopa = "FF";}
    return hexopa;
}






//-------------------------------------------------------------------------------------------------------------------------------------------------------------
// jeremy's debuging funtions
//-------------------------------------------------------------------------------------------------------------------------------------------------------------	

function dump(arr,limit,level) {
	var dumped_text, level_padding, j, item, value;
	dumped_text = "";
	if(!limit){
		limit=3;
	}
	if(!level){
		level = 0;
	}

	//The padding given at the beginning of the line.
	level_padding = "";
	for(j=0;j<level+1;j++){
		level_padding += "	";
	}

	if(typeof(arr) === "object") { //Array/Hashes/Objects
		if(level<=limit){
			for(item in arr) {
				value = arr[item];

				if(typeof(value) === "object") { //If it is an array,
					dumped_text += level_padding + "'" + item + "' ...\n";
					dumped_text += dump(value,limit,level+1);
				} else {
					dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
				}
			}
		}
	} else { //Stings/Chars/Numbers etc.
		dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
	}
	return dumped_text;
}


	
//-------------------------------------------------------------------------------------------------------------------------------------------------------------
// jeremy's TRACKING UTILIIES
// example
//	_parts['editor']='';
//	_parts['currentProcess']='';
//	id='CSS1';
//	track_[id]=_parts;
//-------------------------------------------------------------------------------------------------------------------------------------------------------------
//var track_ = new Array();
	function add_to_tracker(id,part_name,part_value){
		if(typeof(track_)==='undefined'){window['track_']=new Array();}
		if(typeof(track_._parts)==='undefined'){
			var _parts = new Array();
		}
		_parts[part_name]=part_value;
		track_[id]=_parts;
	}
	function remove_from_tracker(id,part_name){
		//try{
			if((typeof(id)!=='undefined'&&id!=='')&&(typeof(part_name)==='undefined'||part_name==='')){
				track_[''+id+'']=0;
				delete track_[''+id+''];
			}else if((typeof(id)!=='undefined'&&id!='')&&(typeof(part_name)!=='undefined'&&part_name!=='')){
				track_[''+id+'']._parts[''+part_name+'']=0;
				delete track_[''+id+'']._parts[''+part_name+''];
			}
		//}catch(err){
		//}
	}
	
	function get_from_tracker(id,part_name){
		var value = false;
			if((typeof(id)!=='undefined'&&id!='')&&(typeof(part_name)==='undefined'||part_name=='')){
				value = track_[''+id+''];
			}else if((typeof(id)!=='undefined'&&id!=='')&&(typeof(part_name)!=='undefined'&&part_name!=='')){
				//value = track_[''+id+'']._parts[''+part_name+''];
				value = track_[''+id+''][''+part_name+''];
			}
		return value
	}