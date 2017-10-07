var apiKey = "60308764d26b82e014649973d6901157";

var link = "https://maps.googleapis.com/maps/api/geocode/json";
var googleKey = "key=AIzaSyBb4UGmjxCC9vVr54OLyMtlSrLGORNi0sA";

var locationServices = {};
var userPos = [];

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
}

locationServices.getBuilding = function(name) {
  var loc = locationServices.formRequest(name);
  map.setView(loc);
  var building = map.buildings.findBuildingAtScreenPoint([0,0]);
  /*function onBuildingInformationReceived(event) {
    console.log("Received building information for BuildingHighlight id: " + event.buildingHighlight.getId());
  }


  map.buildings.on("buildinginformationreceived", onBuildingInformationReceived);*/

  var buildingHighlight = L.Wrld.buildings.buildingHighlight(
      L.Wrld.buildings.buildingHighlightOptions()
          .highlightBuildingAtLocation(loc)
          .color([1.0, 0.0, 0.0, 0.5])
      )
      .addTo(map);

  //loc = building.point;
  console.log(building);
  /*if (building.found) {
    map.setView(loc);
  }*/
  console.log("flag");
}

locationServices.getBuildingAtCoord = function(coord){
  var info = map.buildings.findBuildingAtLatLng(coord);
  console.log(info);
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
