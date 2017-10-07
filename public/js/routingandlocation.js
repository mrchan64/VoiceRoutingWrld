var apiKey = "23f1072e4c422af506ebdc340470b9da";

var searchbarConfig = {
    apiKey: apiKey,
    outdoorSearchMenuItems: [
        {name: "Around Me", searchTag: "", iconKey: "aroundme"},
        {name: "Tourism", searchTag: "tourism", iconKey: "tourism"}
    ],
    locationJumps: [
        {name: "San Francisco", latLng: [37.7952, -122.4028]}
    ]
};
var searchbar = new WrldSearchbar("searchbar", map, searchbarConfig);
searchbar.on("searchresultsclear", clearMarkers);
searchbar.on("searchresultsupdate", addSearchResultMarkers);
searchbar.on("searchresultselect", openSelectedResultPopup);

var markers = [];

function clearMarkers() {
    markers.forEach(function(marker) { marker.remove(); });
}

function addSearchResultMarkers(event) {
    clearMarkers();
    for (var poiId in event.results) {
        var result = event.results[poiId];
        var marker = L.marker(result.location.latLng, { title: result.title });
        marker.addTo(map);
        markers.push(marker);
    }
}

function openSelectedResultPopup(event) {
    map.openPopup(event.result.title, event.result.location.latLng);
}