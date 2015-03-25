/*jshint -W059 */
/*jshint -W054 */
(function($,window) {
	$.wsu_maps.util = {
		debug_positional_log:function(){
			var caller=arguments.callee.caller.caller;
			if(caller!==null){
				console.log(caller.name);
			}
			/*$.wsu_maps.call();
			var native = window.alert;
			window.alert = function(){
				console.log('alerting...');
				native.apply(window, arguments);
				console.log('alerted!');
			};
			
			alert('test');*/
		},
		ini:function(){},
		/*async_load_css:function(url,callback){
			var headID = document.getElementsByTagName("head")[0],node = document.createElement('link');
			node.type = 'text/css';
			node.rel = 'stylesheet';
			node.href = url;
			node.media = 'screen';
			headID.appendChild(node);
		},
		async_load_js:function(url,callback){
			var headID = document.getElementsByTagName("head")[0], s = document.createElement('script');
			s.type = 'text/javascript';
			s.async = true;
			s.src = url;
			var x = document.getElementsByTagName('script')[0];
			if(!window._defined(callback)!=='undefined' && typeof(callback.onreadystatechange)){
				s.onreadystatechange = callback.onreadystatechange;
				s.onload = callback.onload;
			}
			headID.appendChild(s);
		}*/
		
		//function defined(obj){ return window._defined(obj); }
		//function shuffle(ary){ return ary.sort(function(){ Math.random() - 0.5; }); }
		isNumber:function (n){ 
			return (!isNaN(parseFloat(n))&& isFinite(n)) || n.match(/^\d+$/) ;
		},
		split:function (val){ return val.split( /,\s*/ ); },
		extractLast:function (term){ return $.wsu_maps.util.split( term ).pop(); },
		
		
		
		parseUri_obj:{
			options : {
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
			}
		},
		parseUri:function  (str) {
			var	o   = $.wsu_maps.util.parseUri_obj.options,
				m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
				uri = {},
				i   = 14;
		
			while (i--){
				uri[o.key[i]] = m[i] || "";
			}
		
			uri[o.q.name] = {};
			uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
				if ($1){
					uri[o.q.name][$1] = $2;
				}
			});
		
			return uri;
		},
	
		joiner:function(){
			//to be the option joiner for just the maps
		},
	
		timers_arr:[],
		clearCount:function (timer){
			var t = $.wsu_maps.util.timers_arr;
			if(window._defined(t[timer])){
				/// clear the time from timer
				window.clearTimeout(t[timer]);
				/// Make sure it's clear  
				t[''+timer+'']=0;
				delete t[''+timer+''];
			}
		},
		setCount:function (timer,time,func){
			var t = $.wsu_maps.util.timers_arr;
			$.wsu_maps.util.clearCount(timer);
			if(t[timer]===0||!window._defined(t[timer])){
				t[timer]=window.setTimeout(function(){
					func();                                                 
				},time);
			}
		},

		getCanvasXY:function (caurrentLatLng){
			var map = $.wsu_maps.state.map_inst;
			var scale = Math.pow(2, map.getZoom());
			var nw = new google.maps.LatLng(
				map.getBounds().getNorthEast().lat(),
				map.getBounds().getSouthWest().lng()
			);
			var worldCoordinateNW = map.getProjection().fromLatLngToPoint(nw);
			var worldCoordinate = map.getProjection().fromLatLngToPoint(caurrentLatLng);
			var caurrentLatLngOffset = new google.maps.Point(
				Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
				Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
			);
			return caurrentLatLngOffset;
		},

		popup_message:function (options){
			if($("#wsumap_mess").length<=0){
				$('body').append('<div id="wsumap_mess">');
			}
			var jObj = $( "#wsumap_mess" );
			if(!window._defined(options.clean)){
				options.clean=true;
			}
			var defaults = {
				autoOpen: true,
				resizable: false,
				width: 350,
				minHeight: 25,
				modal: true,
				draggable : false,
				buttons_parts:{},
				create:function(){
					if(options.clean){
						$('.ui-dialog-titlebar').remove();
						$(".ui-dialog-buttonpane").remove();
					}
					$('body').css({overflow:"hidden"});
					if($.isFunction(options.onCreate)){
						options.onCreate(jObj);
					}
				},
				open:function(){
					if($.isFunction(options.onOpen)){
						options.onOpen(jObj);
					}
				},
				buttons:{},
				close: function() {
					if($.isFunction(options.onClose)){
						options.onClose(jObj);
					}
					$.wsu_maps.util.close_dialog_modle(jObj);
				}
			};
			options = $.extend(defaults,options);


			jObj.html( (typeof options.html === 'string' || options.html instanceof String) ? options.html : options.html.html() );
			var buttons_parts = {};
			$.each(options.buttons_parts,function(i,v){
				buttons_parts[v.name]=function(){
					$( this ).dialog( "close" );
					if($.isFunction(v.callback)){
						v.callback(jObj);
					}
				};
			});
			options.buttons = buttons_parts;
			jObj.dialog(options);
		},
		confirmation_message:function (html_message,callback){
			if($("#wsumap_mess").length<=0){
				$('body').append('<div id="mess">');
			}
			$("#wsumap_mess").html( (typeof html_message === 'string' || html_message instanceof String) ? html_message : html_message.html() );
			$( "#wsumap_mess" ).dialog({
				autoOpen: true,
				resizable: false,
				width: 350,
				minHeight: 25,
				modal: true,
				draggable : false,
				create:function(){
					$('.ui-dialog-titlebar').remove();
					$('body').css({overflow:"hidden"});
				},
				buttons:{
					Yes:function(){
						if($.isFunction(callback.yes)){
							callback.yes();
						}
						$( this ).dialog( "close" );
					},
					No: function() {
						if($.isFunction(callback.no)){
							callback.no();
						}
						$( this ).dialog( "close" );
					}
				},
				close: function() {
					$.wsu_maps.util.close_dialog_modle($( "#wsumap_mess" ));
				}
			});
		},	
		set_diamodle_resizing:function(jObj){
			$(window).resize(function(){
				jObj.dialog('option', {
					width: $(window).width()-50,
					height: $(window).height()-50
				});
			});
		},
		close_dialog_modle: function(jObj){
			jObj.dialog( "destroy" );
			jObj.remove();
			if($(".ui-dialog.ui-widget.ui-widget-content").length<=0){
				$('body').css({overflow:"auto"});
			}
		},	
		//-------------------------------------------------------------------------------------------------------------------------------------------------------------
		// jeremy's debuging funtions
		//-------------------------------------------------------------------------------------------------------------------------------------------------------------	
		
		dump:function(arr,limit,level) {
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
							dumped_text += $.wsu_maps.util.dump(value,limit,level+1);
						} else {
							dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
						}
					}
				}
			} else { //Stings/Chars/Numbers etc.
				dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
			}
			return dumped_text;
		},
	};
	$.runTemplate = $.runTemplate||function(html, options) {
			var re,add,match,cursor,code,reExp,result;
			re = /<%(.+?)%>/g, reExp = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g, code = "var r=[];\n", cursor = 0;
			add = function(line, js) {
						if(js){
							code += line.match(reExp) ? line + "\n" : "r.push(" + line + ");\n";
						}else{
							code += line !== "" ? "r.push('" + line.replace(/'/g, "\"") + "');\n" : "";
						}
						return add;
					};
			while(match = re.exec(html)) {
				add(html.slice(cursor, match.index))(match[1], true);
				cursor = match.index + match[0].length;
			}
			add(html.substr(cursor, html.length - cursor));
			code = (code + "return r.join('');").replace(/[\r\t\n]/g, "");
			result = new Function(code).apply(options);
			//try { result = new Function(code).apply(options); }
			//catch(err) { console.error("'" + err.message + "'", " in \n\nCode:\n", code, "\n"); }
			return result;
		};
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
})(jQuery,window);