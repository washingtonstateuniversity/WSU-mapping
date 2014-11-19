/*!
* #jprint plugin
* A jQuery plugin that makes it easier to print cross browser
* Tested in FF/IE/Chrome/Safari/Opera
* Copyright (c) 2012-* Jeremy Bass (jeremybass@cableone.net)
*
* Version 0.1
*
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* Adds the following methods to jQuery:
* $.jprint
* $.fn.jprint
*
* USE LIKE 
* $("#pArea").html($('#directions_area').html()+'<img src="'+baseUrl+'" alt="map" width="700" height="504"/>');
*
*/

(function($) {
	$.jprint = $.fn.jprint = function() {
		// Print a given set of elements
		var isNode = function(o) {
			return (typeof Node === "object" ? o instanceof Node : o
					&& typeof o === "object" && typeof o.nodeType === "number"
					&& typeof o.nodeName === "string");
		}

		var options, $this;

		if (isNode(this)) {
			$this = $(this);
		} else {
			if (arguments.length > 0) {
				$this = $(arguments[0]);
				if (isNode($this[0])) {
					if (arguments.length > 1) {
						options = arguments[1];
					}
				} else {
					options = arguments[0];
					$this = $(this);
				}
			} else {
				$this = $(this);
			}
		}

		var defaults = {
			pageStyles : true,
			mediaPrint:false,
			stylesheet : null,
			useWindow : false,
			skip : ".noprint",
			iframe : true,
			append : null,
			prepend : null
		};
		options = $.extend(defaults, options);
		if (options.useWindow && $this[0] === window) {
			$this = $(document);
		}

		var styles = $("");
		if (options.pageStyles) {
			styles = $("style, link");
		} else if (options.mediaPrint) {
			styles = $("link[media=print]");
		}
		if (options.stylesheet) {
			styles = $.merge(styles, $('<link rel="stylesheet" href="'+ options.stylesheet + '">'));
		}

		var copy = $this.clone();
		copy = $("<span/>").append(copy);
		copy.find(options.skip).remove();
		copy.append(styles.clone());
		copy.append($(options.append).clone());
		copy.prepend($(options.prepend).clone());
		var content = copy.html();
		copy.remove();
		
		function newWindow(content){
				w = window.open();
				w.document.write(content);
				w.document.close();
				w.print();
				w.close();	
		}
		
		
		var w, wdoc;
		if (options.iframe) {
			// Use an iframe for printing
			try {

				// Create a new iFrame if none is given
				var strFrameName = ("printer-" + (new Date()).getTime());
				// Create an iFrame with the new name.
				$iframe = $( "<iframe name='" + strFrameName + "' id='" + strFrameName + "' src='/'>" );
				$iframe.css({ width:"0px",height:"0xp",position:"absolute","z-index":999,left:"-9999em",top:"-9999em"}).appendTo( $( "body:first" ) );

				w = window.frames[ strFrameName ];
				wdoc = w.document;
				if(content.indexOf('<body')<0)content = '<!DOCTYPE html><html lang="en" dir="ltr"><head></head><body>'+content+'</body></html>';
				wdoc.write(content);
				wdoc.close();
				$iframe.load(function(){ w.focus(); w.print(); });
				window.setTimeout(function() {w.close();}, 3000);
				if ($iframe.length) {
					setTimeout(function(){$iframe.remove();},(60 * 1000));
				}
			} catch (e) {
				newWindow(content);
			}
		} else {
			newWindow(content);
		}
		return this;
	};

})(jQuery);
