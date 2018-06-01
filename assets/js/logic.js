centerOfUS = [39.8283,-98.5795];
zoomLevel = 5;

var outdoorBaseLayer = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token='+accessToken)
var map = L.map('map',{
    center:centerOfUS,
    zoom:zoomLevel,
    layers: [outdoorBaseLayer]
})



var borders = [];

var _1960Data = {type:'FeatureCollection1',
                 features: []
                };
var _1970Data = {type:'FeatureCollection2',
                features: []
                };
var _1980Data = {type:'FeatureCollection3',
                features: []
                };
var _1990Data = {type:'FeatureCollection4',
                features: []
                };
var _1960Layer;
var _1970Layer;
var _1980Layer;
var _1990Layer;

var allLayers;



var feature = [];

d3.json('/data/custom.geo.json',function(error,data) {
    if(error){console.warn(error)};
    // console.log(data)
    // let features = data.features;
    // let testItem = features[0]['properties'];
    // console.log(testItem)
    // testItem['test']='TESTING';
    // console.log(testItem)
    // console.log(features.map(x=>x.properties.name))
    // features.forEach(x=>borders.push(x.geometry));
    // let borderLayer = L.geoJSON(borders);
    // borderLayer.addTo(map)
    d3.json('/data/immigration_by_country.JSON',function(error,cdata) {
        if(error){console.warn(error)};
        // console.log(cdata);
        // console.log(cdata['1960'])
        for(elem in data.features) {
            feature = data.features[elem];
            // console.log(feature)
            if(cdata['1960'][feature.properties.name]) {
                let immigrants = parseInt(cdata['1960'][feature.properties.name].replace(/,/g, ''));
                //This JSON.parse(JSON.stringify()) bullshit allowed me to bypass the horseshit shallow copy
                //thing that javascript kept insisting I meant.  No I don't wanna update feature, that's why
                //I saved it into temporary feature.  wtf get your shit together js
                let tempfeat = JSON.parse(JSON.stringify(feature));
                tempfeat['properties']['immigrants'] = immigrants;
                _1960Data.features.push(tempfeat)
                // data.features[elem]['properties']['immigrants']= immigrants;

            }
            if(cdata['1970'][feature.properties.name]) {
                let immigrants = parseInt(cdata['1970'][feature.properties.name].replace(/,/g, ''));
                let tempfeat = JSON.parse(JSON.stringify(feature));
                tempfeat['properties']['immigrants'] = immigrants;
                _1970Data.features.push(tempfeat)
                // data.features[elem]['properties']['immigrants']= immigrants;

            }
            if(cdata['1980'][feature.properties.name]) {
                let immigrants = parseInt(cdata['1980'][feature.properties.name].replace(/,/g, ''));
                let tempfeat = JSON.parse(JSON.stringify(feature));
                tempfeat['properties']['immigrants'] = immigrants;
                _1980Data.features.push(tempfeat)
                // data.features[elem]['properties']['immigrants']= immigrants;

            }
            if(cdata['1990'][feature.properties.name]) {
                let immigrants = parseInt(cdata['1990'][feature.properties.name].replace(/,/g, ''));
                let tempfeat = JSON.parse(JSON.stringify(feature));
                tempfeat['properties']['immigrants'] = immigrants;
                _1990Data.features.push(tempfeat)
                // data.features[elem]['properties']['immigrants']= immigrants;
 
            }
        }
        console.log(_1960Data)
        console.log(_1970Data)
        console.log(_1980Data)
        console.log(_1990Data)

        _1960Layer = L.choropleth(_1960Data,{
            valueProperty: 'immigrants',
            scale: ["#ffffb2", "#b10026"],
            steps: 10,
            mode: 'q',
            style: {
                // Border color
                color: "#fff",
                weight: 1,
                fillOpacity: 0.8
            },

            onEachFeature: function(feature, layer) {
            layer.bindPopup(feature.properties.name + "<br>Number of 1960s Immigrants:<br>" + feature.properties.immigrants);
            }
        });
        _1970Layer = L.choropleth(_1970Data,{
            valueProperty: 'immigrants',
            scale: ["#ffffb2", "#b10026"],
            steps: 10,
            mode: 'q',
            style: {
                // Border color
                color: "#fff",
                weight: 1,
                fillOpacity: 0.8
            },

            onEachFeature: function(feature, layer) {
            layer.bindPopup(feature.properties.name + "<br>Number of 1970s Immigrants:<br>" + feature.properties.immigrants);
            }
        });
        _1980Layer = L.choropleth(_1980Data,{
            valueProperty: 'immigrants',
            scale: ["#ffffb2", "#b10026"],
            steps: 10,
            mode: 'q',
            style: {
                // Border color
                color: "#fff",
                weight: 1,
                fillOpacity: 0.8
            },

            onEachFeature: function(feature, layer) {
            layer.bindPopup(feature.properties.name + "<br>Number of 1980s Immigrants:<br>" + feature.properties.immigrants);
            }
        });
        _1990Layer = L.choropleth(_1990Data,{
            valueProperty: 'immigrants',
            scale: ["#ffffb2", "#b10026"],
            steps: 10,
            mode: 'q',
            style: {
                // Border color
                color: "#fff",
                weight: 1,
                fillOpacity: 0.8
            },

            onEachFeature: function(feature, layer) {
            layer.bindPopup(feature.properties.name + "<br>Number of 1990s Immigrants:<br>" + feature.properties.immigrants);
            }
        });

        allLayers = {'1960':_1960Layer,
                    '1970':_1970Layer,
                    '1980':_1980Layer,
                    '1990':_1990Layer};
        L.control.layers(allLayers).addTo(map)
        // var legend = L.control({ position: "bottomright" });
        // legend.onAdd = function() {
        //     var div = L.DomUtil.create("div", "info legend");
        //     var limits = geojson.options.limits;
        //     var colors = geojson.options.colors;
        //     var labels = [];
        //     // console.log(limits)
        //     // Add min & max
        //     var legendInfo = "<h1>Immigration Volume</h1>" +
        //     "<div class=\"labels\">" +
        //         "<div class=\"min\">" + limits[0] + "</div>" +
        //         "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        //     "</div>";

        //     div.innerHTML = legendInfo;

        //     limits.forEach(function(limit, index) {
        //     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        //     });

        //     div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        //     return div;
        // };
        // legend.addTo(map);
    })
})