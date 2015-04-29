// JavaScript Document
(function($,window,WSU_MAP) {
	$.widget( "ui.dialog", $.ui.dialog, {
		options: {
			height: 200, // auto is not allowed when using animation
	
			closeModalOnClick: true,
	
			// viewport settings
			forceFullscreen: false,
			resizeOnWindowResize: false,
			scrollWithViewport: false,
			resizeAccordingToViewport: true,
			resizeToBestPossibleSize: false,
	
			// width and height set the content size, not overall size
			useContentSize: false,
	
			// animated options
			useAnimation: true,
			animateOptions: {
				duration: 500,
				queue: false
			},
	
			// callbacks
			resized: null
		},
	
		// Changes content and resizes dialog
		change: function( content, width, height, animate ) {
			if ( typeof animate !== "boolean" ) {
				animate = this.options.useAnimation;
			}
	
			if ( animate ) {
				this.setAriaLive( true );
				this.element.one( this.widgetEventPrefix + "resized", this, function( event ) {
					event.data.element.html( content );
					event.data.setAriaLive( false );
					event.data.focusTabbable();
				});
			} else {
				this.element.html( content );
			}
	
			this.changeSize( width, height );
		},
	
		// Changes size
		changeSize: function( width, height ) {
			this._setOptions({
				width: width,
				height: height
			});
		},
	
		_setOption: function( key, value ) {
			if ( key === "width" ) {
				this._oldSize.width = value;
			}
			if ( key === "height" ) {
				this._oldSize.height = value;
			}
	
			// we need to adjust the size as we need to set the overall dialog size
			if ( this.options.useAnimation && this.options.useContentSize && this._isVisible ) {
				if ( key === "width" ) {
					value = value + ( this.uiDialog.width() - this.element.width() );
				}
				if ( key === "height" ) {
					value = value + ( this.uiDialog.outerHeight() - this.element.height() );
				}
			}
	
			this._super( key, value );
		},
	
		// calculate actual displayed size, data contains already the overall dimensions
		_getSize: function( data ) {
			var options = this.options,
				feedback = $.position.getWithinInfo( options.position.of ),
				portrait = ( feedback.height >= feedback.width ) ? true : false,
				viewport = {
					width: feedback.width - ( this.uiDialog.outerWidth() - this.uiDialog.width() ),
					height: feedback.height
				};
	
			if ( options.forceFullscreen ) {
				return viewport;
			}
	
			if ( options.resizeToBestPossibleSize ) {
				if ( portrait ) {
					data = this._calcSize( data, viewport.width, "width", "height" );
				} else {
					data = this._calcSize( data, viewport.height, "height", "width" );
				}
			}
	
			if ( options.resizeAccordingToViewport || options.resizeToBestPossibleSize ) {
				if ( viewport.width < data.width ) {
					data = this._calcSize( data, viewport.width, "width", "height" );
				}
				if ( viewport.height < data.height ) {
					data = this._calcSize( data, viewport.height, "height", "width" );
				}
			}
	
			return data;
		},
	
		_calcSize: function( data, value, sortBy, toSort ) {
			var newData = {};
	
			newData[ toSort ] = Math.max( 0, ( data[ toSort ] / data[ sortBy ] ) * value );
			newData[ sortBy ] = value;
	
			return newData;
		},
	
		_size: function() {
			// overwrite options with recalculated dimensions
			$.extend( this.options, this._getSize( this.options ) );
	
			if ( this._isVisible && this.options.useAnimation ) {
				this._animateSize();
				return;
			}
	
			if ( this.options.useContentSize ) {
				this._contentSize();
				return;
			}
	
			this._super();
		},
	
		/*
		 * Sets the size of the dialog
		 *
		 * Options width and height define content size, not overall size
		 */
		_contentSize: function() {
			// If the user has resized the dialog, the .ui-dialog and .ui-dialog-content
			// divs will both have width and height set, so we need to reset them
			var nonContentHeight, nonContentWidth, actualSize,
				options = this.options;
	
			// Reset content sizing
			nonContentWidth = this.element.show().css({
				width: options.width,
				minHeight: 0,
				maxHeight: "none",
				height: 0
			}).outerWidth() - options.width;
			this.element.css( "width", "auto" );
	
			if ( options.minWidth > options.width + nonContentWidth ) {
				options.width = options.minWidth;
			}
	
			// reset wrapper sizing
			// determine the height of all the non-content elements
			nonContentHeight = this.uiDialog.css({
					height: "auto",
					width: options.width + nonContentWidth
				})
				.outerHeight();
	
			actualSize = this._getSize({
				width: options.width + nonContentWidth,
				height: options.height + nonContentHeight
			});
	
			this.uiDialog.css( "width", actualSize.width );
			this.element.height( Math.max( 0, actualSize.height - nonContentHeight ) );
	
			if (this.uiDialog.is(":data(ui-resizable)") ) {
				this.uiDialog.resizable( "option", "minHeight", this._minHeight() );
			}
	
			// save calculated overall size
			$.extend( options, actualSize );
		},
	
		// Processes the animated positioning (position using callback), works with any width and height options
		_animateUsing: function( position, data ) {
			var that = this;
			// calculate new position based on the viewport
			position.left = ( data.target.left + ( data.target.width - this.options.width - ( this.uiDialog.outerWidth() - this.uiDialog.width() ) ) / 2 );
			position.top = ( data.target.top + ( data.target.height - this.options.height ) / 2 );
			if ( position.top < 0 ) {
				position.top = 0;
			}
	
			this.uiDialog.animate( position, $.extend( {}, this.options.animateOptions, {
				complete: function() {
					that._trigger( "resized" );
				}
			}));
		},
	
		// animated the size, uses width and height options like default dialog widget (overall size)
		_animateSize: function() {
			var options = this.options;
	
			this.uiDialog.animate({
				width: options.width
			}, options.animateOptions );
	
			this.element.animate({
				// options.height is overall size, we need content size
				height: options.height - ( this.uiDialog.outerHeight() - this.element.height() )
			}, options.animateOptions );
		},
	
		// position overwrite for animated positioning
		_position: function() {
			var that = this;
			this._positionOptions = this.options.position;
			// change position.using mechanism
			if ( this.options.useAnimation && this._isVisible ) {
				this.options.position.using = function( position, feedback  ) {
					that._animateUsing( position, feedback );
				};
			}
			this._super();
			// reset position.using mechanism
			this.options.position = this._positionOptions;
		},
	
		// ARIA helper
		setAriaLive: function( busy ){
			this.uiDialog.attr({
				"aria-live": "assertive",
				"aria-relevant": "additions removals text",
				"aria-busy": busy
			});
		},
	
		// all following functions add a variable to determine if the dialog is visible
		_create: function() {
			this._super();
			this._isVisible = false;
			this._oldSize = {
				width: this.options.width,
				height: this.options.height
			};
	
			// make dialog responsive to viewport changes
			this._on( window, this._windowResizeEvents );
		},
	
		_windowResizeEvents: {
			resize: function(){
				if ( this.options.resizeOnWindowResize ) {
					this._addTimeout( function() {
						this._setOptions( this._oldSize );
					});
				}
			},
			scroll: function(){
				// second test prevents initial page load scroll event
				if ( this.options.scrollWithViewport && this.timeout ) {
					this._addTimeout( function() {
						this._position();
					});
				} else {
					this.timeout = true;
				}
			}
		},
	
		_addTimeout: function( callback ) {
			window.clearTimeout( this.timeout );
			if ( this._isVisible ) {
				this.timeout = this._delay( callback, 250 );
			}
		},
	
		_makeResizable: function() {
			this._super();
			this.element.on( this.widgetEventPrefix + "resizestop", this, function( event ) {
				event.data.element.css( "width", "auto" );
				event.data.uiDialog.css( "height", "auto" );
			});
		},
	
		_makeDraggable: function() {
			this._super();
			this.element.on( this.widgetEventPrefix + "dragstop", this, function( event ) {
				event.data.options.position = event.data._positionOptions;
			});
		},
	
		open: function() {
			this._super();
			this._isVisible = true;
		},
	
	
		close: function() {
			this._super();
			this._isVisible = false;
		},
	
		focusTabbable: function() {
			this._focusTabbable();
		},
	
		_createOverlay: function(){
			this._super();
			if ( this.options.modal && this.options.closeModalOnClick ) {
				this._on( this.overlay, {
					mousedown: function( event ){
						this.close( event );
					}
				});
			}
		}
	});
	function lightbox(){
		this.defaults = {
			// config for gallery mode
			gallery: {
				enabled: false,	// use all selected elements as a gallery
				loop: false,
				strings: {
					position: "Item {index} of {amount}: ",
					next: "Next",
					prev: "Previous"
				},
				showPositionInfo: {
					title: true,
					desc: false
				}
			},
	
			/**
			 * Enable description pan
			 * @property descEnabled
			 * @default true
			 * @type Boolean
			 */
			descEnabled: true,
	
			/**
			 * jQuery UI Dialog options: see jQuery UI Dialog docs for all options, some options are not available!
			 * @property dialog
			 * @type Object
			 */
			dialog: {
				closeOnEscape: true,
				closeText: "close",
				
				/**
				 * Close lightbox by click on overlay
				 * @property dialog.closeModalOnClick
				 * @default true
				 * @type Boolean
				 */
				closeModalOnClick : true,
				
				/**
				 * Width of the content (not overall size, "auto" not allowed)
				 * @property dialog.width
				 * @default 600
				 * @type Integer
				 */
				width: 600,
				
				/**
				 * Height of the content (not overall size, "auto" not allowed)
				 * @property dialog.height
				 * @default 400
				 * @type Integer
				 */
				height: 400,
	
				// viewport settings (API doc by jquery.ui.dialog.extended)
				forceFullscreen: false,
				resizeOnWindowResize: true,
				scrollWithViewport: true,
				resizeAccordingToViewport: true,
				resizeToBestPossibleSize: false,
	
				/**
				 * Animate the resizing and positioning mechanism
				 * @property dialog.useAnimation
				 * @default true
				 * @type Boolean
				 */
				useAnimation: true,
				
				/**
				 * Animate options as defined for jQuery UI show and hide options (see jQuery UI documentation)
				 * @property dialog.animateOptions
				 * @type Object
				 */
				animateOptions: {
					duration: 500,
					queue: false
				},
	
				show: "fade", // string, use any jQuery UI effect here
				hide: "fade",
				modal: true,
				buttons: null, // options: null (default, adds pre/next buttons in gallery mode), {} (no buttons at all), or use as default dialog option
				
				/**
				 * jQuery UI Dialog resize callback event (please note: native close, open and resize callbacks are not available)
				 * @property dialog.resized
				 * @type Function
				 */
				resized: null,
	
				/**
				 * Do not alter this property!
				 * @property dialog.useContentSize
				 * @type Boolean
				 * @default true
				 * @private
				 */
				useContentSize: true
			},
	
			/**
			 * Disable plugin
			 * @property dialog.disabled
			 * @default false
			 * @type Boolean
			 */
			disabled: false,
			
			/**
			 * GET variable prefix (?ajax=true)
			 * @property dialog.getVarPrefix
			 * @default ""
			 * @type Boolean
			 */
			getVarPrefix: "",
	
			// set testing condition, description, alt and title atttribute for each content type
			types: {
				defaultType: "auto", // image, ajax, inline, 
				// default rendering for all content types, overwritten by each content type config
				defaultConfig: {
					test: null, // test for this content type, returns boolean
					template: "<div class='overflow'>{content}</div>",
					// title, desc & marker will only be rendered if an element is available (given by API or click event)
					title: function( element ) { // dialog title
						return element.attr( "title" ) || element.text();
					},
					desc: null,	// description text
					marker: {},	// marker in templates, like image alt attribute
					addParameters: "" // addtional parameters (added to the given URL)
				},
				// configuration specific for each content type, merged with default config, use callbacks provided by this plugin instead
				config: {
					image: {
						test: function( href ) {
							return href.match( /\.(jpg|jpeg|png|gif)(\?.*)?$/ );
						},
						template: "<a href='#next' class='multibox-api next' rel='next'></a><a href='#prev' class='multibox-api prev' rel='prev'></a><img width='100%' height='100%' alt='{alt}' title='{title}' src='{path}' />",
						title: function( element ) {
							return element.find( "img" ).attr( "alt" ) || element.text();
						},
						desc: function( element ) {
							return element.find( "img" ).attr( "longdesc" ) || element.find( "img" ).attr( "alt" ) || element.attr( "title" );
						},
						marker: {
							title: function( element ) {
								return element.find( "img" ).attr( "alt" ) || element.attr( "title" ) || element.text();
							},
							alt: function( element ) {
								return element.find( "img" ).attr( "alt" ) || element.find( "img" ).attr( "title" ) || element.attr( "title" ) || element.text();
							}
							// add custom attributes, index is marker in template
						}
					},
					ajax: {
						test: function( href ) {
							return href.match( /ajax=true/i );
						},
						// $.ajax settings
						settings: {
							// Please note: be careful with error, success and href
							dataType: "html"
						}
					},
					inline: {
						test: function( href ) {
							return href.match(/\#/);
						}
						// Please note: addParameters is not possible for inline type as the page is already loaded!
					}
					// add own config here!
				}
			},
	
			// custom opener
			// this is a backfall, render your own HTML by type parameter! Set your own type parameter by using types.config option!
			openCustom: function( data ){
				window.open( data.href, "_newtab" );
			},
	
			// loading handler
			loadingHandler: function( data ){
				this.isLoading = true;
				this._defaultHandler( "<div class='ui-state-highlight ui-corner-all'><p><span class='ui-icon ui-icon-info'></span><strong>Loading content, please wait!</strong></p></div>", "Loading...", data );
			},
	
			// error handler
			errorHandler: function( data ){
				this._defaultHandler( "<div class='ui-state-error ui-corner-all'><p><span class='ui-icon ui-icon-alert'></span><strong>Sorry, an error has occured. Please try again!</strong></p></div>", "Error!", data.data );
			},
	
			// callbacks
			on: {
				create: null,
				createDialog: null,
				open: null,
				change: null,
				close: null,
				position: null,
				resize: null,
				move: null,
				// specific
				imageError: null,
				inlineError: null
				// use ajax.settings option for ajax specific callbacks
				// use loadingHandler and errorHandler as callbacks if needed
			}
		};
	}
	
	$.extend( lightbox.prototype, {
		/**
		* Initial and main method
		* Could be used when lightbox instance is created manually
		*
		* @method _create
		* @private
		*
		* @param {Jquery Objec} _elements A set of jQuery selected HTML elments (one or more)
		* @param {Object} [_options] _options Object with all options, see defaults
		*/
		_create: function( _elements, _options ) {
			// set jQuery UI similar defaults
			this.widgetName = "lightbox";
			this.options = $.extend( true, {}, this.defaults, _options );
			this.uid = this.widgetName + "-" + Math.random().toString( 16 ).slice( 2, 10 );
			this.isOpen = false;
			this.isLoading = false;
	
			var that = this,
				options = this.options,
				elements = $( _elements );
	
			// merge type configs with default
			$.each( options.types.config, function( type ) {
				options.types.config[ type ] = $.extend( true, {}, options.types.defaultConfig, options.types.config[ type ] );
			});
	
			// set click event if not disabled and not API
			if ( elements.length && !options.disabled ) {
				elements.on( "click." + this.widgetName, function( event ){
					event.preventDefault();
					event.stopPropagation();
					if ( elements.length > 1 && options.gallery.enabled ) {
						that.openGallery( elements, $( this ) );
					} else {
						that.openLink( $(this) );
					}
					// save clicked element
					that.clickedElement = event.currentTarget;
					// do not follow link
					
				});
			}
	
			/**
			 * Fires Callback, see {{#crossLink "lightbox/_fireCallback:method"}}{{/crossLink}} for return value.
			 * @event on.create
			 */
			that._fireCallback( "create" );
		},
	
		/*
		* Opens a link in a dialog
		* @param data {Object, Jquery Object, String} lightbox data object (with at least one: html, href or element), can also be an jquery object containing a <a> tag or an URL
		*/
		openLink: function( _data ) {
			var options = this.options,
				data = this._openLinkHelper( _data ),
				typeGet, config, widthGet, heightGet, fn;
	
			// get type
			if ( !data.type ) {
				typeGet = this._getUrlVar( data.href, options.getVarPrefix + "type" );
				if ( typeGet ) {
					data.type = ( typeGet === "auto" ) ? this._getType( data.href ) : typeGet;
				} else {
					data.type = ( options.types.defaultType === "auto" ) ? this._getType( data.href ) : options.types.defaultType;
				}
			} else if ( data.type === "auto" ) {
				data.type = this._getType( data.href );
			}
	
			// get title, description and marker if possible
			if ( data.element ) {
				config = ( data.type ) ? options.types.config[ data.type ] : options.types.defaultConfig;
				data.marker = $.extend( {}, config.marker, data.marker );
	
				$.each( config.marker, function( key, callback) {
					if ( $.isFunction( callback ) ) {
						data.marker[ key ] = callback.call( this, data.element );
					}
				});
	
				if ( !data.title && $.isFunction( config.title ) ) {
					data.title = config.title.call( this, data.element );
				}
	
				if ( options.descEnabled && !data.desc && $.isFunction( config.desc ) ) {
					data.desc = config.desc.call( this, data.element );
				}
			}
	
			// check size parameter
			if ( isNaN( data.width ) ) {
				widthGet = this._getUrlVar( data.href, options.getVarPrefix + "width" );
				data.width = ( widthGet ) ? parseInt( widthGet, 10 ) : false;
			}
			if ( isNaN( data.height ) ) {
				heightGet = this._getUrlVar( data.href, options.getVarPrefix + "height" );
				data.height = ( heightGet ) ? parseInt( heightGet, 10 ) : false;
			}
	
			// check if open function exists
			fn = "open" + data.type.charAt( 0 ).toUpperCase() + data.type.slice( 1 );
			if ( fn !== "open" && $.isFunction( this[ fn ] ) ) {
				this[ fn ]( data );
			} else {
				options.openCustom.call( this, data );
			}
		},
	
		// test each configured content type
		_getType: function( href ) {
			var type = "";
			$.each( this.options.types.config, function( _type, config ) {
				if ( config.test.call( this, href ) ) {
					type = _type;
					return false;
				}
			});
			type = "image";
			return type;
		},
	
		/**
		* Opens an image
		* @method openImage
		* @param {Mixed} data Object: data.element = link (a tag) as jQuery Object with href pointing to an image, String: URL to an image, jQuery Object: of a ima tag 
		* @example
		*	api.openImage( "/path/to/my/image.jpeg" );
		* @example
		*	api.openImage( $("<img src='/path/to/my/image.jpeg' />") );
		* @example
		*	api.openImage( $("<a href='/path/to/my/image.jpeg' />My Image</a>") );
		*/
		openImage: function( data ) {
			data = this._openLinkHelper( data );
			var that = this,
				options = this.options,
				image = document.createElement('img');//new Image();
	
			// open loading message
			options.loadingHandler.call( this, data );
	
			// preload image
			image.onload = function(){
				if ( !data.width ) {
					data.width = image.width;
				}
				if ( !data.height ) {
					data.height = image.height;
				}
				that._parseHtml( data, "image", "path" );
				that._changeDialog( data );
				// unload onload, IE specific, prevent animated gif failures
				image.onload = function(){};
			};
			// error handling
			image.onerror = function( error ){
				/**
				 * Fires Callback, see {{#crossLink "lightbox/_fireCallback:method"}}{{/crossLink}} for return value.
				 * @event on.imageError
				 */
				options.errorHandler.call( that, that._fireCallback( "imageError", error, data ) );
			};
			// load image
			image.src = data.href + options.types.config.image.addParameters;
		},
	
	
		/**
		* Opens inline HTML: works with an anchor url
		* @method openImage
		* @param {Mixed} data Object: data.href = link (a tag) as jQuery Object with an anchor pointing to an currently available HTML element with that anchor as id attribute
		* @example
		*	api.open({ href: "/my-site.html#my-anchor" });
		*/
		openInline: function( data ) {
			data = this._openLinkHelper( data );
			var element = $("#" + data.href.split("#")[1]);
			if ( element.length ) {
				this._parseHtml( data, "inline", "content", element.html() );
				this._open( data );
			} else {
				/**
				 * Fires Callback, see {{#crossLink "lightbox/_fireCallback:method"}}{{/crossLink}} for return value.
				 * @event on.inlineError
				 */
				this.options.errorHandler.call( this, this._fireCallback( "inlineError", null, data ) );
			}
		},

		/**
		* Opens any HTML content
		* @method openAjax
		* @param {Mixed} data Object: data.element = any HTML element as jQuery Object, String: plain HTML string, jQuery Object: any HTML element
		* @example
		*	api.openHtml( "<div>Any HTML string</div>" );
		*/
		openHtml: function( data ) {
			var isJquery = data instanceof jQuery;
	
			if ( isJquery || data.element ) {
				if ( isJquery ) {
					data.element = data;
				}
				data.html = data.element.html();
			} else {
				data.html = data;
			}
	
			this._open( data );
		},
	
		// checks: data.href (URL), data.element (<a>), jQuery object (<a>), string (URL)
		
		/**
		* Helper to normalize incoming link parameter
		* @private
		* @method _openLinkHelper
		* @param {Mixed} data Object: data.element = link (a tag) as jQuery Object, String: URL, jQuery Object: either a link (a tag) or any HTML element 
		* @return {Object} Normalized object with data.href or at least data.element
		*/
		_openLinkHelper: function( data ) {
			if ( !data.href ) {
				if ( data.element ) {
					data.href = data.element.attr( "href" );
				} else {
					// save parameter and create data object
					var element = data;
					data = {};
					// if jQuery object containing a link
					if ( element instanceof jQuery ) {
						data.href = element.attr( "href" );
						data.element = element;
					} else {
						// seems to be a link
						data.href = element;
					}
				}
			}
	
			return data;
		},
	
		/**
		* Opens a dialog: very flexible with all auto magic
		* @method open
		* @param {Object, Jquery Object, String} data Pass in one of the following types:
		* @param {Object} data.object Object with at least one: html, href or element.
		* @param {jQuery Object} data.jquery jQuery object containing an "a" tag or any other HTML element (its content will be opened)
		* @param {String} data.html Plain HTML string
		* @example
		*	api.open($(".my-selector"));
		* @example
		*	api.open({ html: "<div>Any HTML string</div>" });
		* @example
		*	api.open("<div>Any HTML string</div>");
		*/
		open: function( data ) {
			if ( data.href || ( data.element && data.element.is( "a" ) ) || ( data instanceof jQuery && data.is( "a" ) ) ) {
				this.openLink( data );
			} else {
				this.openHtml( data );
			}
		},
	
		/**
		* Checks if the dialog needs to be created or opened
		*
		* @method _open
		* @private
		*/
		_open: function( data ) {
			if ( !this.options.disabled ) {
				if ( this.uiDialog ) {
					this._changeDialog( data );
				} else {
					this._createDialog( data );
				}
			}
		},
	
		/**
		* Opens a dialog in gallery mode: very flexible with all auto magic
		* @method openGallery
		* @param {Mixed} group Array: An simple array with lightbox data objects  (see {{#crossLink "lightbox/open:method"}}{{/crossLink}} options), jQuery object: containing a set of elements or a link (a tag) elements
		* @param {Mixed} [index] jQuery Object: a link tag element within the group parameter, Integer: a index starting with 0; default is the firs element in group parameter
		* @example
		*	api.openGallery([ { href: "path/to/my/image.jpg" },	{ href: "http://www.youtube.com/watch?v=VfOcyrOImLg" }]);
		*/
		openGallery: function( group, index ) {
			var that = this,
				groupIsJquery = group instanceof jQuery;
			this.group = $.isArray( group ) ? group : [];
	
			if ( groupIsJquery ) {
				group.each( function( i ){
					that.group[ i ] = {};
					that.group[ i ].element = $( this );
				});
			}
	
			if ( index instanceof jQuery && groupIsJquery ) {
				this.index = group.index( index );
			} else if ( !isNaN( index ) ) {
				this.index = index;
			} else {
				this.index = 0;
			}
	
			if ( this.group.length > 1 ) {
				if ( !this.options.dialog.buttons ) {
					this._addGalleryButtons();
				}
				this.open( this.group[ this.index ] );
				//this._addNonMouseControl();
			}
		},
	
		index: function( index ) {
			this._move( index );
		},
	
		/**
		* Next item in gallery group
		* @method next	
		* @example
		*	api.next();
		*/
		next: function(){
			this._move( "next" );
		},
	
		/**
		* Previous item in gallery group
		* @method prev
		*/
		prev: function(){
			this._move( "prev" );
		},
	
		/**
		* First item in gallery group
		* @method first
		*/
		first: function(){
			this._move( "first" );
		},
	
		/**
		* Last item in gallery group
		* @method last
		*/
		last: function(){
			this._move( "last" );
		},
	
		_move: function( direction ) {
			var newIndex = this.index;
			switch ( direction ) {
				case "first":
					newIndex = 0;
					break;
				case "last":
					newIndex = this.group.length - 1;
					break;
				case "next":
					newIndex = ( this.options.gallery.loop && newIndex === this.group.length - 1 ) ? 0 : newIndex + 1;
					break;
				case "prev":
					newIndex = ( this.options.gallery.loop && newIndex === 0 ) ? this.group.length - 1 : newIndex - 1;
					break;
				default:
					newIndex = direction;
					break;
			}
			if ( !isNaN( newIndex ) && newIndex !== this.index && this.group[ newIndex ] ) {
				this.index = newIndex;
				this.open( this.group[ this.index ] );
				this._changeGalleryButtons();
				/**
				 * Fires Callback, see {{#crossLink "lightbox/_fireCallback:method"}}{{/crossLink}} for return value.
				 * @event on.move
				 */
				this._fireCallback( "move", direction, this.group[ this.index ] );
			} else {
				// autoclose on failure
				this.close();
			}
		},
	
		_createDialog: function( data ) {
			var that = this,
				// get size
				size = this._getSize( data );
	
			// prepare wrapper elements
			this.uiDialog = $( "<div />" );
	
			this.uiDialogContent = $( "<div />", {
				"class": this.widgetName + "-content ui-helper-clearfix " + data.type,
				"aria-describedby": this.uid + "-desc",
				html: data.html
			}).appendTo( this.uiDialog );
	
			this.uiDialogDesc = $( "<div />", {
				"class": this.widgetName + "-desc ui-helper-clearfix",
				"id": this.uid + "-desc",
				html: $( "<div class='inner'>" )
			}).appendTo( this.uiDialog );
	
			// create dialog
			this.uiDialog.dialog(
				$.extend( true, {}, that.options.dialog, {
					dialogClass: this.widgetName + " " + that.options.dialog.dialogClass,
					close: function( event ){
						that._close( event );
					},
					width: size.width,
					height: size.height,
					open: function() {
						that.isOpen = true;
						that._fireCallback( "open", data );
					}
				})
			);
			this.uiDialogWidget = this.uiDialog.dialog( "widget" );
			this._setDesc( data );
			this._setTitle( data );
	
			// search for api links
			this.uiDialogWidget.on( "click." + this.widgetName, ".multibox-api[rel]", function( event ){
				that._move( $( this ).attr( "rel" ) );
				event.preventDefault();
			});
	
			// set ARIA busy when loading
			if ( this.isLoading ) {
				this._setAria();
			}
	
			/**
			 * Fires Callback, see {{#crossLink "lightbox/_fireCallback:method"}}{{/crossLink}} for return value.
			 * @event on.createDialog
			 */
			that._fireCallback( "createDialog", null, data );
		},
	
		_setAria: function() {
			this.uiDialog.dialog( "setAriaLive", this.isLoading );
			this.uiDialogWidget.toggleClass( "loading", this.isLoading );
		},
	
		_setAndShowContent: function( data ) {
			var that = this;
	
			this.uiDialogContent.html( data.html );
			this._setTitle( data );
			this._setDesc( data );
			$.Widget.prototype._show( this.uiDialogContent, this.options.dialog.show, function(){
				that._setAria();
				that.uiDialog.dialog( "focusTabbable" );
				/**
				 * Fires Callback, see {{#crossLink "lightbox/_fireCallback:method"}}{{/crossLink}} for return value.
				 * @event on.change
				 */
				that._fireCallback( "change", null, data );
			});
		},
	
		_changeDialog: function( data ){
			var that = this;
	
			this.isLoading = false;
			$.Widget.prototype._hide( this.uiDialogDesc, this.options.dialog.hide );
			$.Widget.prototype._hide( this.uiDialogContent, this.options.dialog.hide, function(){
				that._setSize( data );
				that.uiDialogWidget.one( "dialogresized", function() {
					that._setAndShowContent( data );
				});
			});
		},
	
		_setDesc: function ( data ) {
			var string = this._getPositionInfo( "desc" ) + ( data.desc || "" );
			if ( string ) {
				this.uiDialogDesc.children( ".inner" ).html( string );
				$.Widget.prototype._show( this.uiDialogDesc, this.options.dialog.show );
			}
		},
	
		_setTitle: function ( data ) {
			var html = this._getPositionInfo( "title" ) + ( data.title || this.options.dialog.title );
			this.uiDialog.dialog( "option", "title", $( "<div>" + html + "</div>" ).text() );
		},
	
		_addGalleryButtons: function(){
			var that = this,
				prevDisabled = !!( this.index === 0 && !this.options.gallery.loop ),
				nextDisabled = !!( this.index === this.group.length - 1 && !this.options.gallery.loop );
			this.options.dialog.buttons = [{
				text: this.options.gallery.strings.prev,
				click: function() {
					that.prev();
				},
				disabled: prevDisabled,
				"class": "prev"
			}, {
				text: this.options.gallery.strings.next,
				click: function(){
					that.next();
				},
				disabled: nextDisabled,
				"class": "next"
			}];
		},
	
		_changeGalleryButtons: function(){
			if ( !this.options.gallery.loop && this.options.dialog.buttons ) {
				var buttonpane = this.uiDialogWidget.children( ".ui-dialog-buttonpane" ),
					prev = buttonpane.find( ".prev" ),
					next = buttonpane.find( ".next" );
	
				if ( this.index === 0 ) {
					this._changeButton( prev, next );
				} else {
					prev.button( "enable" );
				}
	
				if ( this.index === this.group.length - 1 ) {
					this._changeButton( next, prev );
				} else {
					next.button( "enable" );
				}
			}
		},
	
		_changeButton: function( b1, b2 ) {
			b1.removeClass( "ui-state-focus ui-state-hover ui-state-active" ).button( "disable" );
			b2.focus();
		},
	
		_addNonMouseControl: function(){
			var that = this;
	
			// add keyboard control
			this.uiDialogWidget.on( "keydown." + this.widgetName, function( event ){
				switch( event.keyCode ) {
					case $.ui.keyCode.RIGHT:
					case $.ui.keyCode.DOWN:
					case $.ui.keyCode.SPACE:
						that.next();
						event.preventDefault();
						break;
					case $.ui.keyCode.LEFT:
					case $.ui.keyCode.UP:
						that.prev();
						event.preventDefault();
						break;
					case $.ui.keyCode.END:
						that.last();
						event.preventDefault();
						break;
					case $.ui.keyCode.HOME:
						that.first();
						event.preventDefault();
						break;
				}
			});
	
			if ( $.event.special.swipe ) {
				this.uiDialogWidget
					.on( "swipeleft." + this.widgetName, function( event ){
						that.next();
						event.preventDefault();
					})
					.on( "swiperight." + this.widgetName, function( event ){
						that.prev();
						event.preventDefault();
					});
			}
		},
	
		_parseHtml: function( data, type, marker, value ) {
			// use href if no value is given
			if ( !value ) {
				value = data.href + this.options.types.config[ type ].addParameters;
			}
			var template = this.options.types.config[ type ].template.replace( new RegExp( "{" + marker + "}", "g" ), value );
			// process marker
			if ( data.marker ) {
				$.each( data.marker, function( name, _value ) {
					template = template.replace( new RegExp( "{" + name + "}", "g" ), _value );
				});
			}
			data.html = template;
		},
	
		destroy: function(){
			this.element.unbind( this.widgetName );
			this.uiDialog.dialog( "destroy" );
		},
	
		widget: function(){
			return this.uiDialogWidget;
		},
	
		dialog: function(){
			return this.uiDialog;
		},
	
		close: function( event ) {
			this.uiDialog.dialog( "close", event );
		},
	
		// called by dialog close callback
		_close: function( event ){
			if ( this.xhr ) {
				this.xhr.abort();
			}
			// remove dialog
			this.uiDialog.dialog( "destroy" );
			this.uiDialog = null;
			// restore original clicked element
			if ( this.clickedElement ) {
				$( this.clickedElement ).focus();
			}
			this.isOpen = false;
			/**
			 * Fires Callback, see {{#crossLink "lightbox/_fireCallback:method"}}{{/crossLink}} for return value.
			 * @event on.close
			 */
			this._fireCallback( "close", event );
		},
	
		_getSize: function( data ) {
			return {
				width: ( data.width && !isNaN( data.width ) ) ? data.width : this.options.dialog.width,
				height: ( data.height && !isNaN( data.height ) ) ? data.height : this.options.dialog.height
			};
		},
	
		_setSize: function( data ) {
			var size = this._getSize( data );
			this.uiDialog.dialog( "changeSize", size.width, size.height );
		},
	
		_defaultHandler: function( html, title, data ) {
			var that = this,
				_data = $.extend( {}, data, { html: html, title: title, desc: "" } );
			// do not resize when already open
			if ( this.isOpen ) {
				$.Widget.prototype._hide( this.uiDialogDesc, this.options.dialog.hide );
				$.Widget.prototype._hide( this.uiDialogContent, this.options.dialog.hide, function(){
					that._setAndShowContent( _data );
				});
			} else {
				this._open( _data );
			}
		},
	
		_getPositionInfo: function( key ) {
			if ( this.options.gallery.enabled && this.group.length > 0 && this.options.gallery.showPositionInfo[ key ] && !this.isLoading ) {
				return "<span class='position'>" + this.options.gallery.strings.position.replace( "{index}", this.index + 1 ).replace( "{amount}", this.group.length ) + "</span>";
			}
	
			return "";
		},
	
		/**
		* Fire callback event. __Needs testing!__
		*
		* @method _fireCallback
		* @private
		* @beta
		* @example
		* 	return {
		* 		eventName: eventName, // {String} Event / callback name
		* 		eventData: eventData, // {Object} Event data if available
		* 		data: data, // {Object} Current data object
		* 		dialog: this.uiDialog, // {jQuery Object} Dialog instance
		* 		group: this.group, // {Object} Current group
		* 		index: this.index // {Integer}Current item element index of group
		* 	};
		*
		* @return {Object} Object with following data:
		*/
		_fireCallback: function( eventName, eventData, data ) {
			var info = {
				eventName: eventName,
				eventData: eventData,
				data: data,
				dialog: this.uiDialog,
				group: this.group,
				index: this.index
			};
	
			if ( eventName && this.options.on[ eventName ] && $.isFunction( this.options.on[ eventName ] ) ) {
				// this.options.on[ eventName ]( this, info );
				this.options.on[ eventName ].call( this, info );
			}
	
			return info;
		},
	
		_getUrlVar: function( href, name ){
			var hashes = href.slice( href.indexOf( "?" ) + 1 ).split( "&" ),
				vars = [],
				hash, i;
	
			for ( i = 0; i < hashes.length; i++ ) {
				hash = hashes[ i ].split( "=" );
				vars.push( hash[ 0 ] );
				vars[ hash[ 0 ] ] = hash[ 1 ];
			}
	
			return vars[ name ];
		}
	});

	/**
	* This is the jQuery plugin definition (singleton instance)
	* @class lightbox
	* @namespace fn
	* @constructor*
	* @param {Object} options Options object, see {{#crossLink  "lightbox" }}{{/crossLink}} properties
	* @return {Object} The {{#crossLink  "lightbox" }}{{/crossLink}} instance 
	* @example
	*	$.fn.lightbox();
	* @example
	*	$("a").lightbox();
	* @example
	*	$("a").lightbox( options );
	*
	*/
	$.fn.lightbox = function( options ) {
		$.lightbox = new lightbox();
		$.lightbox._create( this, options );
		return $.lightbox;
	};
	$.extend( WSU_MAP, {
		lightbox:{
			
		}
	});
})(jQuery,window,jQuery.wsu_maps||(jQuery.wsu_maps={}));