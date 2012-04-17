 /*!
 * jQuery UI Google Map 3.0-rc
 * http://code.google.com/p/jquery-ui-map/
 * Copyright (c) 2010 - 2012 Johan Säll Larsson
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 *
 * Depends:
 *      jquery.ui.map.js
 */
( function($) {

	$.extend($.ui.gmap.prototype, {
		
		/**
		 * Adds a shape to the map
		 * @param shapeType:string Polygon, Polyline, Rectangle, Circle
		 * @param shapeOptions:object
		 * @return object
		 */
		addShape: function(shapeType, shapeOptions) {
			var flip = typeof(shapeOptions.coordsFlip)!=='undefined' ? shapeOptions.coordsFlip : false;
			if(typeof(shapeOptions.paths)=='string'){shapeOptions.paths = this.process_coords(shapeOptions.paths,flip);}
			if(typeof(shapeOptions.path)=='string'){shapeOptions.path = this.process_coords(shapeOptions.path,flip);}
			var shape = new google.maps[shapeType](jQuery.extend({'map': this.get('map')}, shapeOptions));
			this.get('overlays > ' + shapeType, []).push(shape);
			return $(shape);
		},
		
		
		
		
		
		
		
		process_coords: function(coordinates,flip) {
			var Coords=[];
			if( typeof(google.maps.geometry)!=='undefined' && coordinates.match(/[\||\@|\_|\`]+/i) ){ // only encoded has @ | _ `
				Coords = google.maps.geometry.encoding.decodePath(coordinates);
			}else{
				/*
				* We are forcing common formats in to a one spatial formaat ie:
				* -122.358 47.653, -122.348 47.649 for 
				* POLYGON((-122.358 47.653, -122.348 47.649, -122.348 47.658, -122.358 47.658, -122.358 47.653))
				*/
				var coordArray = coordinates.match(/\((-?\d+\.\d+\s?,\s?-?\d+\.\d+)\)/gim);
				//(-122.8 ,47.653) (-122.358 , 47.47) (-32.348,47.649)
				if ( coordArray != null) {
					
					/* returns value
					*	myArray[0] = "(-122.8 ,47.653)"
					*	myArray[1] = "(122.358 , 47.47)"
					*	myArray[2] = "(-32.348,47.649)"
					*/
					for ( i = 0; i < coordArray.length; i++ ) { 
						var cord=coordArray[i].replace('(','').replace('(','').replace(' ','').split(',');
						/* cord normalized from
						*	(-122.8 ,47.653) too
						*	myArray[0] = "-122.8"
						*	myArray[1] = "47.653"
						*/ //make google lat and long object\
						if(flip){
							var lat = parseFloat(cord[1]);
							var long = parseFloat(cord[0]);
						}else{
							var lat = parseFloat(cord[0]);
							var long = parseFloat(cord[1]);
						}
						Coords.push(new google.maps.LatLng(lat,long));
					}
				}else{
					var coordArray = coordinates.match(/(-?\d+\.\d+\s?-?\d+\.\d+)\s?,?/gim);
					// from many online coord output generators
					//-12.38 47.6, -122.358 47.658 ,-133.358 3.653
					if ( coordArray != null) {
						/* returns value
						*	myArray[0] = "-12.38 47.6,"
						*	myArray[1] = "-122.358 47.658,"
						*	myArray[2] = "-133.358 3.653"
						*/
						for ( i = 0; i < coordArray.length; i++ ) { 
							var cord=coordArray[i].replace('  ',' ').replace(',','').split(' ');
							/* cord normalized from
							*	-122.8 47.65 too
							*	myArray[0] = "-122.8"
							*	myArray[1] = "47.653"
							*/ //make google lat and long object
							if(flip){
								var lat = parseFloat(cord[1]);
								var long = parseFloat(cord[0]);
							}else{
								var lat = parseFloat(cord[0]);
								var long = parseFloat(cord[1]);
							}
								Coords.push(new google.maps.LatLng(lat,long));
						}
					}else{
						var coordArray = coordinates.match(/(-?\d+\.\d+\s?,\s?-?\d+\.\d+)\s?,?\n?/gim);
						// matches what would come from MS SQL geography
						//-117.153010,46.737331,\n-117.154212,46.737037,\n-117.155070,46.736625   NOTE:(\n in string and \n as new line)
						if ( coordArray != null) {
							/* returns value
							*	myArray[0] = "-117.153010,46.737331,"
							*	myArray[1] = "-117.154212,46.737037,"
							*	myArray[2] = "-117.155070,46.736625"
							*/
							for ( i = 0; i < coordArray.length; i++ ) { 
							var cord='';
								var l_str=coordArray[i].substring(coordArray[i].length - 1); 
									l_str==',' ? coordArray[i] = coordArray[i].substring(0,coordArray[i].length - 1) : '' ;
								var cord=coordArray[i].replace(' ','').split(',');
								/* cord normalized from
								*	-122.8,47.65, too
								*	myArray[0] = "-122.8"
								*	myArray[1] = "47.653"
								*/ //make google lat and long object
								if(flip){
									var lat = parseFloat(cord[0]);
									var long = parseFloat(cord[1]);
								}else{
									var lat = parseFloat(cord[1]);
									var long = parseFloat(cord[0]);
								}
								Coords.push(new google.maps.LatLng(lat,long));
							}
						}
					}	
				}			
			}
			return Coords.length ? Coords : false;
		},
		get_shapeCount: function(shapeType){
			return this.get('overlays > ' + shapeType, []).length;
		},
				
		
		
		

		
		
		
		/**
		 * Adds fusion data to the map.
		 * @param fusionTableOptions:google.maps.FusionTablesLayerOptions, http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#FusionTablesLayerOptions
		 * @param fusionTableId:int
		 */
		loadFusion: function(fusionTableOptions, fusionTableId) {
			( (!fusionTableId) ? this.get('overlays > FusionTablesLayer', new google.maps.FusionTablesLayer()) : this.get('overlays > FusionTablesLayer', new google.maps.FusionTablesLayer(fusionTableId, fusionTableOptions)) ).setOptions(jQuery.extend({'map': this.get('map') }, fusionTableOptions));
		},
		
		/**
		 * Adds markers from KML file or GeoRSS feed
		 * @param uid:String - an identifier for the RSS e.g. 'rss_dogs'
		 * @param url:String - URL to feed
		 * @param kmlLayerOptions:google.maps.KmlLayerOptions, http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#KmlLayerOptions
		 */
		loadKML: function(uid, url, kmlLayerOptions) {
			this.get('overlays > ' + uid, new google.maps.KmlLayer(url, jQuery.extend({'map': this.get('map')}, kmlLayerOptions)));
		}	
	});
	
} (jQuery) );