

var DOMAIN='http://localhost:50759';

    // Our global state
	var map;
	var infowindow,
		service;
	var boxHtmls;
	var referenceId;
    var localSearches;
    var selectedResults = [];
    var currentResults = [];
    var searchForm;

	var waypts = [],
		markers = [],
		checkboxArray = [],
		polylineOptions = [],
		depth=0,
		fractal=0,
		iterator = 0,
		points=[],
		lableStyles=[],
		keysOrder=[],
		pullman = new google.maps.LatLng(46.73191920826778,-117.15296745300293);



    // Create our "tiny" marker icon
    var gYellowIcon = new google.maps.MarkerImage(
      "http://labs.google.com/ridefinder/images/mm_20_yellow.png",
      new google.maps.Size(12, 20),
      new google.maps.Point(0, 0),
      new google.maps.Point(6, 20));
    var gRedIcon = new google.maps.MarkerImage(
      "http://labs.google.com/ridefinder/images/mm_20_red.png",
      new google.maps.Size(12, 20),
      new google.maps.Point(0, 0),
      new google.maps.Point(6, 20));
    var gSmallShadow = new google.maps.MarkerImage(
      "http://labs.google.com/ridefinder/images/mm_20_shadow.png",
      new google.maps.Size(22, 20),
      new google.maps.Point(0, 0),
      new google.maps.Point(6, 20)
	  );
var boxText = document.createElement("div");
				//boxText.style.cssText = "border:none; background:transparent url('http://dev-mcweb.it.wsu.edu/jeremys%20sandbox/gMaps/movie_clouds.gif') no-repeat left bottom;";
				
				
				
				
boxText.innerHTML = setBoxHtml();

myOptions = {
	content: boxText,
	disableAutoPan: false,
	maxWidth: 0,
	pixelOffset: new google.maps.Size(-15,-15),
	boxClass:"infoBoxin",
	zIndex:1,
	boxStyle: { 
		background: "#ccc url('http://dev-mcweb.it.wsu.edu/jeremys%20sandbox/gMaps/movie_clouds.gif') no-repeat left bottom",
		opacity: 1.0,
		width: "500px"//,
		//height:"500px"
	},
	closeBoxMargin: "10px 2px 2px 2px",
	closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
	infoBoxClearance: new google.maps.Size(1, 1),
	isHidden: false,
	pane: "floatPane",
	enableEventPropagation: false
};
ib = new InfoBox(myOptions);


function setBoxHtml(content){
	return (typeof(content)!=="undefined"&&content!=""?"<div style='padding:15px;'>"+content+"</div>":"<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>")+"<h1 style='margin-right: 96px;text-align: right;'>Jeremys <br/>super simple <br/>Example</h1><p style='margin-right: 96px;text-align: right;font-size:10px;'><em><strong>Note:</strong>all labels are hidden. MapTypeStyleElementType:geometry</em></p>";	
}



function initialize() {

}



$(document).ready(function(){
	
	var styles_0 = [{"featureType":"all","stylers":[{"saturation":"-30"}]},{"featureType":"poi.park","stylers":[{"saturation":"10"},{"hue":"#990000"}]}];
	var styles_0 = new google.maps.StyledMapType(styles_0, {name:"Red Parks"});
	var styles_1 = [{"featureType":"all","stylers":[{"saturation":"-70"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"hue":"#000000"}]}];
	var styles_1 = new google.maps.StyledMapType(styles_1, {name:"Black Roads"});
	var styles_2 = [{"featureType":"poi.business","elementType":"labels","stylers":[{"visibility":"off"}]}];
	var styles_2 = new google.maps.StyledMapType(styles_2, {name:"No Businesses"});	  

	var myOptions = {
		zoom: 15,
		center: pullman,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		mapTypeControlOptions: {mapTypeIds: ["style0", "style1", "style2"]}	
	}
	var noPOIbiz = [
		{
			featureType: 'poi',
			elementType: 'all',
			stylers: [
				{ visibility: 'off' }
			]
	  	}
	];


	

	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

	map.mapTypes.set("style0", styles_0);
	map.mapTypes.set("style1", styles_1);
	map.setMapTypeId("style1");
	map.mapTypes.set("style2", styles_2);
	
	var request = {
		location: pullman,
		radius: 500,
		types: ['store']
	};
	infowindow = new google.maps.InfoWindow();
	var service = new google.maps.places.PlacesService(map);
	service.search(request, serach_callback);

	// Initialize the local searcher
	localSearches = new GlocalSearch();
	localSearches.setSearchCompleteCallback(null, OnLocalSearch);

	var mapType = new google.maps.StyledMapType(noPOIbiz, { name:'No Stations' });
	
	map.mapTypes.set('nostations', mapType);
	map.setMapTypeId('nostations');

	/*


	var marker = new google.maps.Marker({
			map: map,
			draggable: true,
			position: pullman,
			visible: true
		});
 
		var boxText = document.createElement("div");
		//boxText.style.cssText = "border:none; background:transparent url('http://dev-mcweb.it.wsu.edu/jeremys%20sandbox/gMaps/movie_clouds.gif') no-repeat left bottom;";
		boxText.innerHTML = setBoxHtml();

		var myOptions = {
			content: boxText,
			disableAutoPan: false,
			maxWidth: 0,
			pixelOffset: new google.maps.Size(-15,-15),
			boxClass:"infoBoxin",
			zIndex:1,
			boxStyle: { 
			  background: "#ccc url('http://dev-mcweb.it.wsu.edu/jeremys%20sandbox/gMaps/movie_clouds.gif') no-repeat left bottom",
			  opacity: 1.0,
			  width: "500px"//,
			  //height:"500px"
			 },
			closeBoxMargin: "10px 2px 2px 2px",
			closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
			infoBoxClearance: new google.maps.Size(1, 1),
			isHidden: false,
			pane: "floatPane",
			enableEventPropagation: false
		};
 
		google.maps.event.addListener(marker, "click", function (e) {
			ib.open(map, this);
		});
 
		var ib = new InfoBox(myOptions);
		ib.open(map, marker);
		
	var request = {
          reference: 'CmRUAAAA4TzMTgyBldDK1U7XIDfwoedorSbMVUSNMAtzfAJIYX7VwJveNjJjWxVqyQtwxNPhljEtSKhDcQpX9rF2gHW1wmej9KXDqPFEFErbRbQk2fmS0rfTddyyY75H1BpGDGcJEhCocWihmMyiH1iMAqXav9YtGhQ1mY0RZ30DFtA9kIu0b-0l2jrn6A' /// bookie
        };
service.getDetails(request, function(place, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            var marker = new google.maps.Marker({
              map: map,
			  draggable: true,
              position: place.geometry.location
            });
			var ib = new InfoBox(myOptions);
            google.maps.event.addListener(marker, 'click', function() {
				ib.close();
              ib.setContent(setBoxHtml(JSON.stringify(place)));
              ib.open(map, this);
            });
          }
        });
		
		*/


	var defaultBounds = new google.maps.LatLngBounds(
		new google.maps.LatLng(46.751153008636884,-117.19614028930664),
		new google.maps.LatLng(46.70902969569674, -117.1084213256836)
	);
	
	var input = document.getElementById('searchTextField');
	var options = {
		bounds: defaultBounds
	};

autocomplete = new google.maps.places.Autocomplete(input, options);		
autocomplete.bindTo('bounds', map);

google.maps.event.addListener(autocomplete, 'place_changed', function() {
	var place = autocomplete.getPlace();
	referenceId=place.reference;
	if (place.geometry.viewport) {
		map.fitBounds(place.geometry.viewport);
	} else {
		map.setCenter(place.geometry.location);
		map.setZoom(17);
	}
	var image = new google.maps.MarkerImage(
		place.icon, new google.maps.Size(71, 71),
		new google.maps.Point(0, 0), new google.maps.Point(17, 34),
		new google.maps.Size(35, 35));
	//marker.setIcon(image);
	marker.setPosition(place.geometry.location);
	
	if(typeof(place)!=="undefined"){
		ib.setContent(setBoxHtml(JSON.stringify(place).split('":"').join('":<br/>"').split(',').join("<br/>")));
		ib.open(map, marker);
		doAplace();
	}
});		
 
var geocoder = new google.maps.Geocoder();  
     $(function() {
         $("#searchbox").autocomplete({
         
           source: function(request, response) {

          if (geocoder == null){
           geocoder = new google.maps.Geocoder();
          }
             geocoder.geocode( {'address': request.term }, function(results, status) {
               if (status == google.maps.GeocoderStatus.OK) {

					var searchLoc = results[0].geometry.location;
					var lat = results[0].geometry.location.lat();
					var lng = results[0].geometry.location.lng();
					var latlng = new google.maps.LatLng(lat, lng);
					var bounds = results[0].geometry.bounds;

                  geocoder.geocode({'latLng': latlng}, function(results1, status1) {
                      if (status1 == google.maps.GeocoderStatus.OK) {
                        if (results1[1]) {
                         response($.map(results1, function(loc) {
                        return {
                            label  : loc.formatted_address,
                            value  : loc.formatted_address,
                            bounds   : loc.geometry.bounds
                          }
                        }));
                        }
                      }
                    });
            }
              });
           },
           select: function(event,ui){
		  var pos = ui.item.position;
		  var lct = ui.item.locType;
		  var bounds = ui.item.bounds;
	
		  if (bounds){
		   map.fitBounds(bounds);
		  }
           }
         });
     });   
 });

	function drop1() {
	  var sw = map.getBounds().getSouthWest();
	  var ne = map.getBounds().getNorthEast();
	  for (var i = 0; i < 1; i++) {
		setTimeout(function() {
		  //var lat = Math.random() * (ne.lat() - sw.lat()) + sw.lat();
		  //var lng = Math.random() * (ne.lng() - sw.lng()) + sw.lng();
		  markers.push(createLocationMarker(pullman,true));
			/*
			var loca = new google.maps.LatLng(markers[0].position.lat(),markers[0].position.lng());
			var requested = {
			  location: loca,
			  radius:.1
			};
			infowindow = new google.maps.InfoWindow();
			service.search(requested, calling);
			*/
			$('#Lat').val(markers[0].position.lat());
			$('#Long').val(markers[0].position.lng());
	
			google.maps.event.addListener(markers[0], 'dragend', function(event){
				$('#Lat').val(this.getPosition().lat());
				$('#Long').val(this.getPosition().lng());
				//setTimeout(function() {},  200);
				var loca = new google.maps.LatLng(this.getPosition().lat(),this.getPosition().lng());
				
				var types = ['accounting','airport','amusement_park','aquarium','art_gallery','atm','bakery','bank','bar','beauty_salon','bicycle_store','book_store','bowling_alley','bus_station','cafe','campground','car_dealer','car_rental','car_repair','car_wash','casino','cemetery','church','city_hall','clothing_store','convenience_store','courthouse','dentist','department_store','doctor','electrician','electronics_store','embassy','establishment','finance','fire_station','florist','food','funeral_home','furniture_store','gas_station','general_contractor','geocode','grocery_or_supermarket','gym','hair_care','hardware_store','health','hindu_temple','home_goods_store','hospital','insurance_agency','jewelry_store','laundry','lawyer','library','liquor_store','local_government_office','locksmith','lodging','meal_delivery','meal_takeaway','mosque','movie_rental','movie_theater','moving_company','museum','night_club','painter','park','parking','pet_store','pharmacy','physiotherapist','place_of_worship','plumber','police','post_office','real_estate_agency','restaurant','roofing_contractor','rv_park','school','shoe_store','shopping_mall','spa','stadium','storage','store','subway_station','synagogue','taxi_stand','train_station','travel_agency','university','veterinary_care','zoo','administrative_area_level_1','administrative_area_level_2','administrative_area_level_3','colloquial_area','country','floor','intersection','locality','natural_feature','neighborhood','political','point_of_interest','post_box','postal_code','postal_code_prefix','postal_town','premise','room','route','street_address','street_number','sublocality','sublocality_level_4','sublocality_level_5','sublocality_level_3','sublocality_level_2','sublocality_level_1','subpremise','transit_station']
for(i = 0; i < types.length; i++){
				var requested = {
				  location: loca,
				  radius:.1,
				  keyword:types[i]//,
				  //types : [types[i]]

				};
				var service = new google.maps.places.PlacesService(map);
				service.search(requested, updating);
}


			});
		  markers[0].setAnimation(google.maps.Animation.BOUNCE);
		}, i * 200);
	  }
	}

	function createLocationMarker(position,returnIt){
		var marker = new google.maps.Marker({
			map: map,
			draggable: true,
			position: position,
			animation: google.maps.Animation.DROP
		});
		if(typeof(returnIt)!=='undefined'){return marker};
	}

     function updating(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
			
			//alert(JSON.stringify(results));
			
          for (var i = 0; i < 1; i++) {
			  
			var request = {reference:results[i].reference};

			var service = new google.maps.places.PlacesService(map);
			//service.search(request, serach_callback);
			service.getDetails(request, function(place, status) {
			  if (status == google.maps.places.PlacesServiceStatus.OK) {
				  //alert(JSON.stringify(place));
				var marker = markers[0];
				
				if(place.name){$('#name').val(place.name);}
				
				google.maps.event.addListener(marker, 'click', function() {
					ib.close();
				  ib.setContent(setBoxHtml(JSON.stringify(place)));
				  ib.open(map, this);
				});
			  }
			});
            //createMarked(results[i]);
          }
        }
      }

     function calling(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < 1; i++) {
			var request = {
			  reference: ''.results[i].reference//'CmRdAAAAsaGp7A4SEbjlQjxXgMQ79HWqRNgB0y1NdT3-CfboiUxFAHpr4U3jFMKfnlg2Pp_2FTD2Y0Ogai6OmfsoqY338hzJVxBbQRHj-ojU5ww3HGU88wqp4VTAPPURR4HhWkYUEhCwcz3UjMjWs8GPYn7TLLYdGhQYM2WVQdh7QMqLSfgOMzxW1N8pQg' /// bookie
			};

			var service = new google.maps.places.PlacesService(map);
			service.search(request, serach_callback);
			service.getDetails(request, function(place, status) {
			  if (status == google.maps.places.PlacesServiceStatus.OK) {
				var marker = createLocationMarker( place.geometry.location , true );
				
				
			var boxText = document.createElement("div");
			//boxText.style.cssText = "border:none; background:transparent url('http://dev-mcweb.it.wsu.edu/jeremys%20sandbox/gMaps/movie_clouds.gif') no-repeat left bottom;";
			boxText.innerHTML = setBoxHtml();
	
			var myOptions = {
				content: boxText,
				disableAutoPan: false,
				maxWidth: 0,
				pixelOffset: new google.maps.Size(-15,-15),
				boxClass:"infoBoxin",
				zIndex:1,
				boxStyle: { 
				  background: "#ccc url('http://dev-mcweb.it.wsu.edu/jeremys%20sandbox/gMaps/movie_clouds.gif') no-repeat left bottom",
				  opacity: 1.0,
				  width: "500px"//,
				  //height:"500px"
				 },
				closeBoxMargin: "10px 2px 2px 2px",
				closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
				infoBoxClearance: new google.maps.Size(1, 1),
				isHidden: false,
				pane: "floatPane",
				enableEventPropagation: false
			};
				
				var ib = new InfoBox(myOptions);
				google.maps.event.addListener(marker, 'click', function() {
					ib.close();
				  ib.setContent(setBoxHtml(JSON.stringify(place)));
				  ib.open(map, this);
				});
			  }
			});
            //createMarked(results[i]);
          }
        }
      }
 
      function createMarked(place) {
        var placeLoc = place.geometry.location;
        var marked = new google.maps.Marker({
          map: map,
          position: place.geometry.location,
		  draggable: true
        });

			var boxText = document.createElement("div");
			//boxText.style.cssText = "border:none; background:transparent url('http://dev-mcweb.it.wsu.edu/jeremys%20sandbox/gMaps/movie_clouds.gif') no-repeat left bottom;";
			boxText.innerHTML = setBoxHtml();
	
			var myOptions = {
				content: boxText,
				disableAutoPan: false,
				maxWidth: 0,
				pixelOffset: new google.maps.Size(-15,-15),
				boxClass:"infoBoxin",
				zIndex:1,
				boxStyle: { 
				  background: "#ccc url('http://dev-mcweb.it.wsu.edu/jeremys%20sandbox/gMaps/movie_clouds.gif') no-repeat left bottom",
				  opacity: 1.0,
				  width: "500px"//,
				  //height:"500px"
				 },
				closeBoxMargin: "10px 2px 2px 2px",
				closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
				infoBoxClearance: new google.maps.Size(1, 1),
				isHidden: false,
				pane: "floatPane",
				enableEventPropagation: false
			};
	 
			google.maps.event.addListener(marker, "click", function (e) {
				ib.open(map, this);
			});
	 
			var ib = new InfoBox(myOptions);
		
		
		
		
		//marked.setAnimation(google.maps.Animation.BOUNCE);
        google.maps.event.addListener(marked, 'click', function() {
          ib.setContent(JSON.stringify(place).split('":"').join('":<br/>"').split(',').join("<br/>"));
          ib.open(map, this);
        });
      }


function doAplace(){
	var request = {
	  reference:referenceId
	};

	var infowindow = new google.maps.InfoWindow();
	var service = new google.maps.places.PlacesService(map);

	service.getDetails(request, function(place, status) {
	  if (status == google.maps.places.PlacesServiceStatus.OK) {
		var marker = new google.maps.Marker({
		  map: map,
		  position: place.geometry.location
		});
		google.maps.event.addListener(marker, 'click', function() {
		  infowindow.setContent(place.name);
		  infowindow.open(map, this);
		});
	  }
	});		
}
function serach_callback(results, status) {
//        if (status == google.maps.places.PlacesServiceStatus.OK) {
//          for (var i = 0; i < results.length; i++) {
//            createSerachMarker(results[i]);
//          }
//        }else{
//		//alert(status);	
//		}
}
 
function createSerachMarker(place) {
	var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});
	
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(place.name);
		infowindow.open(map, this);
	});
}


function turnOnPOI(){
	var onPOIbiz = [
	  {
		featureType: 'poi',
		elementType: 'geometry',
		stylers: [
		  { visibility: 'on' }
		]
	  }
	];

	var mapType = new google.maps.StyledMapType(onPOIbiz, { name:
'No Stations' });	
	map.mapTypes.set('nostations', mapType);
	map.setMapTypeId('nostations');
	
	
	}
function turnOffPOI(){
	var offPOIbiz = [
	  {
		featureType: 'poi',
		elementType: 'all',
		stylers: [
		  { visibility: 'off' }
		]
	  }
	];

	var mapType = new google.maps.StyledMapType(offPOIbiz, { name:
'No Stations' });	
	map.mapTypes.set('nostations', mapType);
	map.setMapTypeId('nostations');
	
	
	}

function applyType(type){
	var applyTypeOf = [
	  {
		featureType: 'poi',
		elementType: 'all',
		stylers: [
		  { visibility: 'off' }
		]
	  },
	  {
		featureType: type,
		elementType: 'all',
		stylers: [
		  { visibility: 'on' }
		]
	  }
	];
	var mapType = new google.maps.StyledMapType(applyTypeOf, { name:'No Stations' });	
	map.mapTypes.set('nostations', mapType);
	map.setMapTypeId('nostations');
}
	
	
	





//     // Set up the map and the local searcher.
//    function OnLoad() {
//
//      // Initialize the map with default UI.
//      gMap = new google.maps.Map(document.getElementById("map"), {
//        center: new google.maps.LatLng(37.4419, -122.1419),
//        zoom: 13,
//        mapTypeId: 'roadmap'
//      });
//      // Create one InfoWindow to open when a marker is clicked.
//      infowindow = new google.maps.InfoWindow;
//      google.maps.event.addListener(infowindow, 'closeclick', function() {
//        unselectMarkers();
//      });
//
//      // Initialize the local searcher
//      localSearches = new localSearches();
//      localSearches.setSearchCompleteCallback(null, OnLocalSearch);
//    }

    function unselectMarkers() {
      for (var i = 0; i < currentResults.length; i++) {
        currentResults[i].unselect();
      }
    }

    function doSearch() {
      var query = document.getElementById("queryInput").value;
      localSearches.setCenterPoint(map.getCenter());
      localSearches.execute(query);
    }

    // Called when Local Search results are returned, we clear the old
    // results and load the new ones.
    function OnLocalSearch() {
      if (!localSearches.results) return;
      var searchWell = document.getElementById("searchwell");

      // Clear the map and the old search well
      searchWell.innerHTML = "";
      for (var i = 0; i < currentResults.length; i++) {
        currentResults[i].marker().setMap(null);
      }
      // Close the infowindow
      infowindow.close();

      currentResults = [];
      for (var i = 0; i < localSearches.results.length; i++) {
        currentResults.push(new LocalResult(localSearches.results[i]));
      }

      var attribution = localSearches.getAttribution();
      if (attribution) {
        document.getElementById("searchwell").appendChild(attribution);
      }

      // Move the map to the first result
      var first = localSearches.results[0];
      map.setCenter(new google.maps.LatLng(parseFloat(first.lat),
                                            parseFloat(first.lng)));

    }

    // Cancel the form submission, executing an AJAX Search API search.
    function CaptureForm(searchForm) {
      localSearches.execute(searchForm.input.value);
      return false;
    }



	// A class representing a single Local Search result returned by the
	// Google AJAX Search API.
	function LocalResult(result) {
		var me = this;
		me.result_ = result;
		me.results = JSON.stringify(result); 
		alert(me.results);
		alert(result.titleNoFormatting);
		me.resultNode_ = me.node();
		me.marker_ = me.marker();
		google.maps.event.addDomListener(me.resultNode_, 'mouseover', function() {
			// Highlight the marker and result icon when the result is
			// mouseovered.  Do not remove any other highlighting at this time.
			me.highlight(true);
		});
		google.maps.event.addDomListener(me.resultNode_, 'mouseout', function() {
			// Remove highlighting unless this marker is selected (the info
			// window is open).
			if (!me.selected_) me.highlight(false);
		});
		google.maps.event.addDomListener(me.resultNode_, 'click', function() {
			me.select();
		});
		  $('#searchwell').append(me.result_.titleNoFormatting);
		}
	
		LocalResult.prototype.node = function() {
		if (this.resultNode_) return this.resultNode_;
			return this.html();
	};
		
	// Returns the GMap marker for this result, creating it with the given
	// icon if it has not already been created.
	LocalResult.prototype.marker = function() {
		var me = this;
		if (me.marker_) return me.marker_;
		var marker = me.marker_ = new google.maps.Marker({
		position: new google.maps.LatLng(parseFloat(me.result_.lat),
										 parseFloat(me.result_.lng)),
		icon: gYellowIcon, shadow: gSmallShadow, map: map});
		google.maps.event.addListener(marker, "click", function() {
			me.select();
		});
		return marker;
	};

    // Unselect any selected markers and then highlight this result and
    // display the info window on it.
    LocalResult.prototype.select = function() {
      unselectMarkers();
      this.selected_ = true;
      this.highlight(true);
      infowindow.setContent(this.html(true));
      infowindow.open(map, this.marker());
    };

    LocalResult.prototype.isSelected = function() {
      return this.selected_;
    };

    // Remove any highlighting on this result.
    LocalResult.prototype.unselect = function() {
      this.selected_ = false;
      this.highlight(false);
    };

    // Returns the HTML we display for a result before it has been "saved"
    LocalResult.prototype.html = function() {
      var me = this;
      var container = document.createElement("div");
      container.className = "unselected";
      $(container).append(me.result_.titleNoFormatting);
      return container;
    }

    LocalResult.prototype.highlight = function(highlight) {
      this.marker().setOptions({icon: highlight ? gRedIcon : gYellowIcon});
      this.node().className = "unselected" + (highlight ? " red" : "");
    }

    //GSearch.setOnLoadCallback(OnLoad);
	function split( val ) {
		return val.split( /,\s*/ );
	}
	function extractLast( term ) {
		return split( term ).pop();
	}

//* from here is the start of the form *//




var availableTags = [
			"Food",
			"Fun",
			"Facts",
			"Foo",
			"Far",
			"From"
		];





$(function() {
$('.quickActions').click(function() {
  $(this).find('.action_nav').slideToggle('fast', function() {
    // Animation complete.
  });
});




$( "#findPlace" ).click(function(){
	//if($('#dialog-form').length==0){$('#staging').append('<div id="dialog-form" title="Create new location"></div>');}
	$( "#mapSearch" ).dialog({
		minimize:true,
		maximize:false,
		autoOpen: false,
		title:"Map Search",
		//modal: true,
		width:475,
		buttons: {
			"Add": function() {
				
			},
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		},
		close: function() {
			//allFields.val( "" ).removeClass( "ui-state-error" );
		}
	});
	var geocoder = new google.maps.Geocoder();  
	$("#searchbox").autocomplete({
		source: function(request, response) {
			if (geocoder == null){
				geocoder = new google.maps.Geocoder();
			}
			geocoder.geocode( {'address': request.term }, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					var searchLoc = results[0].geometry.location;
					var lat = results[0].geometry.location.lat();
					var lng = results[0].geometry.location.lng();
					var latlng = new google.maps.LatLng(lat, lng);
					var bounds = results[0].geometry.bounds;
					
					geocoder.geocode({'latLng': latlng}, function(results1, status1) {
						if (status1 == google.maps.GeocoderStatus.OK) {
							if (results1[1]) {
								response($.map(results1, function(loc) {
									return {
										label  : loc.formatted_address,
										value  : loc.formatted_address,
										bounds   : loc.geometry.bounds
									}
								}));
							}
						}
					});
				}
			});
		},
		select: function(event,ui){
			var pos = ui.item.position;
			var lct = ui.item.locType;
			var bounds = ui.item.bounds;
			if (bounds){
				map.fitBounds(bounds);
			}
		}
	});
  $( "#mapSearch" ).dialog("open").dialog('widget');
});
	
		var cache = {},
			lastXhr;	
		$( "#addPlace" ).click(function(){
			if($('#dialog-form').length==0){$('#staging').append('<div id="dialog-form" title="Create new location"></div>');}
			$( "#dialog-form" ).dialog({
				minimize:true,
				maximize:true,
				autoOpen: false,
				//modal: true,
				width:560,
				buttons: {
					"Add": function() {
						
					},
					Cancel: function() {
						$( this ).dialog( "close" );
					}
				},
				close: function() {
					//allFields.val( "" ).removeClass( "ui-state-error" );
				}
			});
			
			$('#dialog-form').load('../place/editor.castle',function(){
					/*if($('#tabs.place_new').length>0){
						taboptions={cookie:{expires: 1,path:'/place/'}};
					} */taboptions={};
					$( "#tabs" ).tabs(typeof(place_id) !== 'undefined'&&place_id==0?{ disabled: [3] }:taboptions);
				});
			$( "#dialog-form" ).dialog("open").dialog('widget');//.position({my: 'left',at: 'left',of: $('#map_canvas')}); 
			drop1(); 
			$( "#tags" )
				// don't navigate away from the field on tab when selecting an item
				.bind( "keydown", function( event ) {
					if ( event.keyCode === $.ui.keyCode.TAB &&
							$( this ).data( "autocomplete" ).menu.active ) {
						event.preventDefault();
					}
				})
				.autocomplete({
					minLength: 0,
					source: function( request, response ) {
						// delegate back to autocomplete, but extract the last term
						/*response( $.ui.autocomplete.filter(
							availableTags, extractLast( request.term ) ) );*/
				            var term = request.term;
				            if ( term in cache ) {
					            response( cache[ term ] );
					            return;
				            }

				            lastXhr = $.getJSON( DOMAIN+"/public/get_pace_type.castle", request, function( data, status, xhr ) {
					            cache[ term ] = data;
					            if ( xhr === lastXhr ) {
						            response( $.ui.autocomplete.filter(
									data, extractLast( request.term ) ) );
					            }
				            });
					},
					focus: function() {
						// prevent value inserted on focus
						return false;
					},
					select: function( event, ui ) {
						var terms = split( this.value );
						// remove the current input
						terms.pop();
						// add the selected item
						terms.push( ui.item.value );
						// add placeholder to get the comma-and-space at the end
						terms.push( "" );
						this.value = terms.join( ", " );
						return false;
					}
				});
			});
			
			
			$('.actions button:first').button({
				icons: {
					primary: "ui-icon-gear",
					secondary: "ui-icon-triangle-1-s"
				}
			})
			;
		$('.optionsLink a').button({
				icons: {
					primary: "ui-icon-gear",
					secondary: "ui-icon-triangle-1-s"
				}
			}).click(function(){
			
			});
		
		
		
			$( ".options button:first" ).button({
				icons: {
					primary: "ui-icon-gear",
					secondary: "ui-icon-triangle-1-s"
				}
			}).click(function(){
			
			}).next('button').button({
				icons: {
					primary: "ui-icon-gear",
					secondary: "ui-icon-triangle-1-s"
				}
			}).click(function(){
			
			}).next('button').button({
				icons: {
					primary: "ui-icon-gear",
					secondary: "ui-icon-triangle-1-s"
				}
			});	
		
		
		
		
		
		
		
});













	(function( $ ) {
		$.widget( "ui.combobox", {
			_create: function() {
				var self = this,
					select = this.element.hide(),
					selected = select.children( ":selected" ),
					value = selected.val() ? selected.text() : "";
				var input = this.input = $( "<input>" )
					.insertAfter( select )
					.val( value )
					.autocomplete({
						delay: 0,
						minLength: 0,
						source: function( request, response ) {
							var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
							response( select.children( "option" ).map(function() {
								var text = $( this ).text();
								if ( this.value && ( !request.term || matcher.test(text) ) )
									return {
										label: text.replace(
											new RegExp(
												"(?![^&;]+;)(?!<[^<>]*)(" +
												$.ui.autocomplete.escapeRegex(request.term) +
												")(?![^<>]*>)(?![^&;]+;)", "gi"
											), "<strong>$1</strong>" ),
										value: text,
										option: this
									};
							}) );
						},
						select: function( event, ui ) {
							ui.item.option.selected = true;
							self._trigger( "selected", event, {
								item: ui.item.option
							});
						},
						change: function( event, ui ) {
							if ( !ui.item ) {
								var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( $(this).val() ) + "$", "i" ),
									valid = false;
								select.children( "option" ).each(function() {
									if ( $( this ).text().match( matcher ) ) {
										this.selected = valid = true;
										return false;
									}
								});
								if ( !valid ) {
									// remove invalid value, as it didn't match anything
									$( this ).val( "" );
									select.val( "" );
									input.data( "autocomplete" ).term = "";
									return false;
								}
							}
						}
					})
					.addClass( "ui-widget ui-widget-content ui-corner-left" );

				input.data( "autocomplete" )._renderItem = function( ul, item ) {
					return $( "<li></li>" )
						.data( "item.autocomplete", item )
						.append( "<a>" + item.label + "</a>" )
						.appendTo( ul );
				};

				this.button = $( "<button type='button'>&nbsp;</button>" )
					.attr( "tabIndex", -1 )
					.attr( "title", "Show All Items" )
					.insertAfter( input )
					.button({
						icons: {
							primary: "ui-icon-triangle-1-s"
						},
						text: false
					})
					.removeClass( "ui-corner-all" )
					.addClass( "ui-corner-right ui-button-icon" )
					.click(function() {
						// close if already visible
						if ( input.autocomplete( "widget" ).is( ":visible" ) ) {
							input.autocomplete( "close" );
							return;
						}

						// work around a bug (likely same cause as #5265)
						$( this ).blur();

						// pass empty string as value to search for, displaying all results
						input.autocomplete( "search", "" );
						input.focus();
					});
			},

			destroy: function() {
				this.input.remove();
				this.button.remove();
				this.element.show();
				$.Widget.prototype.destroy.call( this );
			}
		});
	})( jQuery );

	$(function() {
		$( "#LocationTypeSelect" ).combobox();
	});
