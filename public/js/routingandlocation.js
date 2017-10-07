var apiKey = "60308764d26b82e014649973d6901157";

var link = "https://maps.googleapis.com/maps/api/geocode/json";
var googleKey = "key=AIzaSyBb4UGmjxCC9vVr54OLyMtlSrLGORNi0sA";

var locationServices = {};
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
locationServices.getBuildingAtCoord = function(coord){
  var info = map.buildings.findBuildingAtLatLng(coord);
  console.log(info);
}
