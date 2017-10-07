var apiKey = "60308764d26b82e014649973d6901157";

var link = "https://maps.googleapis.com/maps/api/geocode/json";
var googleKey = "key=AIzaSyBb4UGmjxCC9vVr54OLyMtlSrLGORNi0sA";

var locationServices = {};
var userPos = [];

var lastMarker = 0;

var simPos = [56.4582, -2.9821];

var sN = {};

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
       var routeLine = new L.polyline(step.points, options);
       routeLine.addTo(map);
    }
  }
  locationServices.getBuildingAtCoord(start);
  map.setView(start);
  map.routes.getRoute(route,callback,function(error){console.log('dammit')});
  lastMarker = 0;
}

locationServices.getBuilding = function(name) {
  var loc = locationServices.formRequest(name);
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

locationServices.getBuildingAtCoord = function(coord){
  var info = map.buildings.findBuildingAtLatLng(coord);
  lastMarker = 0;
}

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
       var routeLine = new L.polyline(step.points, options);
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
       var routeLine = new L.polyline(step.points, options);
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
       var routeLine = new L.polyline(step.points, options);
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
              var options = { range: 100000, number: 5 };
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

locationServices.getPOI_sim = function() {

    /* geolocation is available */
    navigator.geolocation.getCurrentPosition(function(position) {
      var userPos = simPos;
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
              var options = { range: 100000, number: 5 };
              pos = {lat: pos[0], lng: pos[1]};
              poiApi.searchTags([], pos, callback, options);
          }

          console.log(userPos);
          searchPoisAroundClick(userPos);

          //map.on("click", searchPoisAroundClick);
    });


}

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

locationServices.getIndoorRoute = function(startName, endName) {
  var startLoc = sN[startName];
  var endLoc = sn[endName];

  var routeLines = [];

     var _onRoutesLoaded = function(routes) {
         // Each step in the route will be on a single floor.
         for (var stepIndex = 0; stepIndex < routes[0].length; ++stepIndex) {
            var step = routes[0][stepIndex];
            routeLine = new L.polyline(step.points,
            {
              indoorMapId: step.indoorMapId,
              indoorMapFloorId: step.indoorMapFloorId
           });
            routeLine.addTo(map);
            routeLines.push(routeLine);
         }
     }

  map.routes.getRoute([startLoc, endLoc], _onRoutesLoaded);

}
