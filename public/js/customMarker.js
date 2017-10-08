var twitmarkers = {};

var seed = 1;

twitmarkers.generate = function(location, text){
  var icon = null;
  if(random()<.8){
    icon = L.icon({
      iconUrl: 'images/twitter.png',
      shadowUrl: 'images/twitter-shadow.png',

      iconSize:     [50, 60], // size of the icon
      shadowSize:   [50, 50], // size of the shadow
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [-5, 84],  // the same for the shadow
      popupAnchor:  [-3, -100] // point from which the popup should open relative to the iconAnchor
    });
  }else{
    icon = L.icon({
      iconUrl: 'images/spark.png',
      shadowUrl: 'images/spark-shadow.png',

      iconSize:     [50, 60], // size of the icon
      shadowSize:   [50, 50], // size of the shadow
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [-5, 84],  // the same for the shadow
      popupAnchor:  [-3, -100] // point from which the popup should open relative to the iconAnchor
    });
  }

  var marker = L.marker(location, {icon: icon, riseOnHover: true});
  marker.addTo(map);
  var popup = L.popup({closeButton: false, autoClose: false, closeOnCLick: false});
  popup.setContent(text)
  marker.bindPopup(popup);
  marker.openPopup()
}

twitmarkers.query = function(query){
  var center = map.getCenter();
  $.ajax({
    url: '/twitter',
    method: 'POST',
    data: {
      query: query,
      lat: center.lat,
      lng: center.lng,
      r: 100
    },
    success: function(statuses){
      seed = 0;
      for(var i = 0; i<query.length; i++){
        seed+=query.charCodeAt(i);
      }
      statuses.forEach(function(status){
        twitmarkers.generate({lat: center.lat-.005+random()*.01, lng: center.lng-.005+random()*.01}, status.text);
      })
    }
  })
}

function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}
