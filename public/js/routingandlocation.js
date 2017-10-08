var apiKey = "60308764d26b82e014649973d6901157";

var link = "https://maps.googleapis.com/maps/api/geocode/json";
var googleKey = "key=AIzaSyBb4UGmjxCC9vVr54OLyMtlSrLGORNi0sA";

var poiApi = new WrldPoiApi(apiKey);

var locationServices = {};
var userPos = [];
var routeLines = [];
var routeLine = 0;

var lastMarker = 0;

var simPos = [56.4582, -2.9821];

var sN = {
  "basement" : [-2.978629, 56.46024, 0],
  "server room" : [-2.9783117, 56.4600344, 2],
  "car show" : [-2.9785011, 56.4599409, 2],
  "storage cupboard" : [-2.9781151, 56.4599056, 2],
  "casino" : [-2.9782947, 56.4600729, 1],
  "the great dundee building" : [-2.9783764, 56.4601663, 0],
  "balcony" : [-2.9780477, 56.4599637, 2],
  "small meeting room" : [-2.9780219, 56.4600131, 2],
  "server room" : [-2.9781385, 56.460101, 2],
  "history exhibit" : [-2.9782053, 56.4601537, 2],
  "public parking" : [-2.9821262, 56.4618466, 0],
  "cemetary" : [-2.9728872, 56.4614245, 0],
  "the great pirate adventure" : [-2.9688167, 56.4565028, 0],
  "theater" : [-2.98304, 56.4613044, 2],
  "storage cupboard" : [-2.983122836389253, 56.461231653264029, 2]
};

var startInd = 0;
var endInd = 0;
var control = 0;

locationServices.formRequest = function(searchTerm){
  var finalLink = link+"?address="+searchTerm+"&"+googleKey;
  var ret = "";
  $.ajax({
    url: finalLink,
    success: function(data){
      ret = data.results[0].geometry.location;
      console.log(data.results[0])
    },
    async: false
  })
  ret = [ret.lat, ret.lng];
  return ret;
}


var cacheCompleteCallback = function(success) {
        if (success) {
          console.log("Caching complete");
        } else {
          console.log("Caching failed");
        }
      }
      //map.precache([37.7952, -122.4028], 2000, cacheCompleteCallback);
      map.precache(locationServices.formRequest("Berkeley Memorial Stadium"), 1000, cacheCompleteCallback);
      map.precache(simPos, 1000, cacheCompleteCallback);

/*function onIndoorEntityClicked(event) {
      var id = event.ids[0];
      if (control == 0) {
        startInd = [event.lat, event.lng, map.indoors.getFloor()];
        control = 1;
      } else {
        endInd = [event.lat, event.lng, map.indoors.getFloor()];
        control = 0;
        locationServices.route(startInd, endInd);
      }
}*/


     function moveUp() {
        map.indoors.moveUp();
      }

      function moveDown() {
        map.indoors.moveDown();
      }

      function exitIndoors() {
        map.indoors.exit();
      }

      function toggleIndoorButtonVisibility() {
        var element = document.getElementById("floorButtons");
        element.style.visibility = element.style.visibility == "visible" ? "hidden" : "visible";
      }

      function onIndoorMapEntered(event) {
        toggleIndoorButtonVisibility();
      }

      function onIndoorMapExited(event) {
        toggleIndoorButtonVisibility();

        for (var routeIndex = 0; routeIndex < routeLines.length; ++routeIndex)
        {
          map.removeLayer(routeLines[routeIndex]);
        }
      }

      map.indoors.on("indoormapenter", onIndoorMapEntered);
      map.indoors.on("indoormapexit", onIndoorMapExited);


locationServices.reverseForRoutes = function(item){
  var temp = [];
  temp.push(item[1]);
  temp.push(item[0]);
  return temp;
}

locationServices.route = function(startName, endName){
  var start = locationServices.formRequest(startName);
  var end = locationServices.formRequest(endName);

  var route = [locationServices.reverseForRoutes(start), locationServices.reverseForRoutes(end)];

  var callback = function(routes){
    for (var stepIndex = 0; stepIndex < routes[0].length; ++stepIndex) {
       var step = routes[0][stepIndex];
       var options = {};
       if (step.indoorMapId) {
         options.indoorMapId = step.indoorMapId;
         options.indoorMapFloorId = step.indoorMapFloorId;
       }
       options.color = '#ffcc00';
       routeLine = new L.polyline(step.points, options);
       routeLine.addTo(map);
    }
  }
  locationServices.getBuildingAtCoord(start);
  map.setView(start);
  map.routes.getRoute(route,callback,function(error){console.log('q')});
  lastMarker = 0;
}

//Works!
locationServices.getBuilding = function(name) {
  var loc = sN[name];
  if (!loc) {
    map.setView(loc);
  } else {
    loc = locationServices.formRequest(name);
    map.setView(loc);
    var building = map.buildings.findBuildingAtScreenPoint([0,0]);

    var buildingHighlight = L.Wrld.buildings.buildingHighlight(
        L.Wrld.buildings.buildingHighlightOptions()
            .highlightBuildingAtLocation(loc)
            .color([1.0, 0.0, 0.0, 0.5])
          )
          .addTo(map);

          lastMarker = 0;
        }
}

// For debugging.
locationServices.getBuildingAtCoord = function(coord){
  var info = map.buildings.findBuildingAtLatLng(coord);
  lastMarker = 0;
}

// For taking to another location from current location, specified by name.
locationServices.routeFromUser = function(name){
  var place = locationServices.formRequest(name);
  //var route =
  //locationServices.getUserPos();
  //console.log(userPos);
  var callback = function(routes){
    for (var stepIndex = 0; stepIndex < routes[0].length; ++stepIndex) {
       var step = routes[0][stepIndex];
       var options = {};
       if (step.indoorMapId) {
         options.indoorMapId = step.indoorMapId;
         options.indoorMapFloorId = step.indoorMapFloorId;
       }
       options.color = '#ffcc00';

       routeLine = new L.polyline(step.points, options);
       routeLine.addTo(map);
    }
  }

  if ("geolocation" in navigator) {
    /* geolocation is available */

    navigator.geolocation.getCurrentPosition(function(position) {
      userPos = [position.coords.latitude, position.coords.longitude];
      route = [locationServices.reverseForRoutes(userPos), locationServices.reverseForRoutes(place)]
      console.log(userPos);
      console.log(place);
      map.routes.getRoute(route, callback);
    });

    locationServices.getBuildingAtCoord(place);
    map.setView(place);

  } else {
    /* geolocation IS NOT available */
    console.log("Location Services is not enabled.");
  }
}

// For routing from current location to selected POI (take me there).
locationServices.routeToPOI = function() {

  if (lastMarker == 0) {
    console.log("No last marker set.");
  } else {

  place = lastMarker.getLatLng();

  var callback = function(routes){
    for (var stepIndex = 0; stepIndex < routes[0].length; ++stepIndex) {
       var step = routes[0][stepIndex];
       var options = {};
       if (step.indoorMapId) {
         options.indoorMapId = step.indoorMapId;
         options.indoorMapFloorId = step.indoorMapFloorId;
       }
       options.color = '#ffcc00';
       routeLine = new L.polyline(step.points, options);
       routeLine.addTo(map);
    }
  }

  if ("geolocation" in navigator) {
    /* geolocation is available */

    navigator.geolocation.getCurrentPosition(function(position) {
      userPos = [position.coords.latitude, position.coords.longitude];
      place = [place["lat"], place["lng"]];
      route = [locationServices.reverseForRoutes(userPos), locationServices.reverseForRoutes(place)]
      console.log(userPos);


      console.log(place);
      map.routes.getRoute(route, callback);
    });

    locationServices.getBuildingAtCoord(place);
    map.setView(place);

  } else {
    /* geolocation IS NOT available */
    console.log("Location Services is not enabled.");
  }

  }
}

// Simulate routeToPOI with Dundee stuffies
locationServices.routeSimPOI = function() {
  if (lastMarker == 0) {
    console.log("No last marker set.");
  } else {

  place = lastMarker.getLatLng();

  var callback = function(routes){
    for (var stepIndex = 0; stepIndex < routes[0].length; ++stepIndex) {
       var step = routes[0][stepIndex];
       var options = {};
       if (step.indoorMapId) {
         options.indoorMapId = step.indoorMapId;
         options.indoorMapFloorId = step.indoorMapFloorId;
       }
       options.color = '#ffcc00';
       routeLine = new L.polyline(step.points, options);
       routeLine.addTo(map);
    }
  }

    /* geolocation is available */

    navigator.geolocation.getCurrentPosition(function(position) {
      userPos = simPos;
      place = [place["lat"], place["lng"]];
      route = [locationServices.reverseForRoutes(userPos), locationServices.reverseForRoutes(place)]
      console.log(userPos);


      console.log(place);
      map.routes.getRoute(route, callback);
    });

    locationServices.getBuildingAtCoord(place);
    map.setView(place);

  }
}

// Get all nearby POI to user location
locationServices.getPOI = function() {

  if ("geolocation" in navigator) {
    /* geolocation is available */
    navigator.geolocation.getCurrentPosition(function(position) {
      var userPos = [position.coords.latitude, position.coords.longitude];
      map.setView(userPos);
      var poiApi = new WrldPoiApi(apiKey);
      var markers = [];
      function displaySearchResults(success, results) {
        map.closePopup();
        console.log(results);
        if (success) {
          results.forEach(function(result) {
            var marker = L.marker([result["lat"], result["lon"]], {
              title: result["title"],
              elevation: result["height_offset"],
            }).addTo(map);

            var textF = (result["title"] + ":" + result["subtitle"]);
            console.log(textF);
            marker.bindPopup(textF).openPopup;

            var setLast = function() {
              lastMarker = marker;
              console.log(lastMarker);
            }
            marker.on("click", setLast);

            markers.push(marker);
          })
        }
        else {
          map.openPopup("POI API query failed!", map.getCenter());
        }
      }

          function searchPoisAroundClick(pos) {
              markers.forEach(function(marker) { marker.remove(); });
              map.openPopup("Searching...", pos);

              var callback = displaySearchResults;
              var options = { range: 100000, number: 10 };
              pos = {lat: pos[0], lng: pos[1]};
              poiApi.searchTags([], pos, callback, options);
          }

          console.log(userPos);
          searchPoisAroundClick(userPos);

          //map.on("click", searchPoisAroundClick);
    });
  } else {
    /* geolocation IS NOT available */
    console.log("Location Services is not enabled.");
  }
}

//Simulate getPOI with user location in Dundee
locationServices.getPOI_sim = function() {

    /* geolocation is available */
    navigator.geolocation.getCurrentPosition(function(position) {
      var userPos = simPos;
      map.setView(userPos);

      var markers = [];
      function displaySearchResults(success, results) {
        map.closePopup();
        console.log(results);
        if (success) {
          results.forEach(function(result) {
            var marker = L.marker([result["lat"], result["lon"]], {
              title: result["title"],
              elevation: result["height_offset"],
            }).addTo(map);

            var textF = (result["title"] + " : " + result["subtitle"]);
            console.log(textF);
            marker.bindPopup(textF).openPopup;

            var setLast = function() {
              lastMarker = marker;
              console.log(lastMarker);
            }
            marker.on("click", setLast);

            markers.push(marker);
          })
        }
        else {
          map.openPopup("POI API query failed!", map.getCenter());
        }
      }

          function searchPoisAroundClick(pos) {
              markers.forEach(function(marker) { marker.remove(); });
              map.openPopup("Searching...", pos);

              var callback = displaySearchResults;
              var options = { range: 100000, number: 15 };
              pos = {lat: pos[0], lng: pos[1]};
              poiApi.searchTags([], pos, callback, options);
          }

          console.log(userPos);
          searchPoisAroundClick(userPos);

          //map.on("click", searchPoisAroundClick);
    });

}

//Deprecated, do not use.
locationServices.getIndoorRouteOnClick = function() {
  var startInd = 0;
  var endInd = 0;
  var control = 0;
  function onIndoorEntityClicked(event) {
        var id = event.ids[0];
        if (control == 0) {
          startInd = [event.lat, event.lng, map.indoors.getFloor()];
          control = 1;
        } else {
          endInd = [event.lat, event.lng, map.indoors.getFloor()];
          control = 0;
          locationServices.route(startInd, endInd);
        }
  }
}

//Get indoor routes from startName to endName
locationServices.getIndoorRoute = function(startName, endName) {

  //console.log("user", userPos);

  //var startMarker = 0;

  /*var markers = [];

  function searchPoisAroundClick(pos, str) {
      markers.forEach(function(marker) { marker.remove(); });
      //map.openPopup("Searching...", pos);

      var callback = function(success, results) {
          if (success) {
            //mark = results[0];
            results.forEach(function(result) {
              if (result["title"] == str) {
                startMarker = L.marker([result["lat"], result["lon"], result["alt"]], {
                  title: result["title"],
                  elevation: result["height_offset"],
                }).addTo(map);
              }
            })
          } else {
            console.log(results);
          }
      }
      var options = { range: 1000, number: 100};
      pos = {lat: pos[0], lng: pos[1]};
      //poiApi.searchTags([], pos, callback, options);
      console.log(str);
      console.log(pos);

      poiApi.searchTags([], pos, callback, options);
  }

  searchPoisAroundClick(userPos, startName);
*/
  var startLoc = sN[startName];
  if (!startLoc) {
    locationServices.route(startName, endName);
  }
  var endLoc = sN[endName];
  if (!endLoc) {
    endLoc = locationServices.formRequest(endName);
  }
  console.log(startLoc, endLoc);
  routeLines = [];


     var _onRoutesLoaded = function(routes) {
         /*routeLines.forEach(function(result) {
           result.remove();
         });*/
         console.log("Inside _onRoutesLoaded");
         // Each step in the route will be on a single floor.
         for (var stepIndex = 0; stepIndex < routes[0].length; ++stepIndex) {
           console.log("Step", stepIndex);
            var step = routes[0][stepIndex];
            var options = {};
            if (step.indoorMapId) {
               options.indoorMapId = step.indoorMapId;
               options.indoorMapFloorId = step.indoorMapFloorId;
             }
            var routeLine = new L.polyline(step.points, options);
            routeLine.addTo(map);
            routeLines.push(routeLine);
            console.log(routeLine);
         }
     }

     //console.log(startMarker);

     /*var startLoc = startMarker.getLatLng();

     searchPoisAroundClick(userPos, endName);

     var endLoc = startMarker.getLatLng();*/

     var getRoute = function() {
       map.routes.getRoute([startLoc, endLoc], _onRoutesLoaded);
       console.log("Completed.");
     }

     console.log("Near completion.");
     getRoute();

}


var finalParse = function(call) {
  var control = call[0];
  var l = locationServices;
  switch(control) {
    case 0:
      // Lookup destination
      l.getBuilding(call[1]);
      break;
    case 1:
      // Lookup start, route to dest
      if (map.indoors.isIndoors()) {
        l.getIndoorRoute(call[1], call[2]);
      } else {
        l.getRoute(call[1], call[2]);
      }
      break;
    case 2:
      // Current location to destination
      l.routeFromUser(call[1]);
      break;
    case 3:
      // Nearby POIs
      //call simulated or real
      l.getPOI_sim();
      //l.getPOI();
      break;
    case 4:
      // Straight to selected POI
      // call simulated or real
      l.routeSimPOI();
      l.routeToPOI();


  }
}
