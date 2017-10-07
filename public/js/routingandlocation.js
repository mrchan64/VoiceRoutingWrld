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

locationServices.getPOI = function() {



  var poiApi = new WrldPoiApi(apiKey);



      var markers = [];

      function displaySearchResults(success, results) {
          map.closePopup();
          if (success) {
              results.forEach(function(result) {
                  var marker = L.marker([result["lat"], result["lon"]], {
                     title: result["title"],
                     elevation: result["height_offset"]
                  }).addTo(map);

                  markers.push(marker);
              })
          }
          else {
              map.openPopup("POI API query failed!", map.getCenter());
          }
      }

      function searchPoisAroundClick(event) {
          markers.forEach(function(marker) { marker.remove(); });
          map.openPopup("Searching...", event.latlng);

          var callback = displaySearchResults;
          var options = { range: 500, number: 5 };
          poiApi.searchTags([], event.latlng, callback, options);
      }

      map.on("click", searchPoisAroundClick);
}
