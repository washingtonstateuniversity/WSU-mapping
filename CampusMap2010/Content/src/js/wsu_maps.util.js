/*jshint -W059 */
/*jshint -W054 */
(function($) {
	$.wsu_maps.util = {
		debug_positional_log:function(){
			var caller=arguments.callee.caller.name;
			console.log(caller);
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
			if(typeof(callback)!=='undefined' && typeof(callback.onreadystatechange)==='undefined'){
				s.onreadystatechange = callback.onreadystatechange;
				s.onload = callback.onload;
			}
			headID.appendChild(s);
		}*/
		
		//function defined(obj){ return typeof(obj)!=='undefined'; }
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
	
	
	
		timers_arr:[],
		clearCount:function (timer){
			var t = $.wsu_maps.util.timers_arr;
			if(typeof(t[timer])!=='undefined'){
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
			if(t[timer]===0||typeof(t[timer]) === 'undefined'){
				t[timer]=window.setTimeout(function(){
					func();                                                 
				},time);
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
})(jQuery);