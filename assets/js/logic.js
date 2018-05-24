centerOfUS = [39.8283,-98.5795];
zoomLevel = 5;

var outdoorBaseLayer = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token='+accessToken)
var map = L.map('map-id',{
    center:centerOfUS,
    zoom:zoomLevel,
    layers: [outdoorBaseLayer]
})

var borders = [];
d3.json('/data/custom.geo.json',function(error,data) {
    if(error){console.warn(error)};
    // console.log(data)
    let features = data.features;
    features.forEach(x=>borders.push(x.geometry));
    let borderLayer = L.geoJSON(borders);
    borderLayer.addTo(map)
})