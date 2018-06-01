centerOfUS = [39.8283,-98.5795];
zoomLevel = 2;

var outdoorBaseLayer = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token='+accessToken)
var map = L.map('map',{
    center:centerOfUS,
    zoom:zoomLevel,
    layers: [outdoorBaseLayer]
})


var allData = [];

var allLayers = {};

var feature = [];

d3.json('/data/custom.geo.json',function(error,data) {
    if(error){console.warn(error)};

    d3.json('/data/immigration_by_country.JSON',function(error,cdata) {
        if(error){console.warn(error)};
        // console.log(cdata);
        // console.log(cdata['1960'])
        for(year in cdata) {
            //Initializes the list allData, and creates a feature collection for each year found in cdata
            allData[year] = {type:'FeatureCollection',features:[]}
        }
        // console.log(allData)
        for(elem in data.features) {
            feature = data.features[elem];
            // console.log(feature.properties.name)
            for(year in cdata) {
                if(cdata[year][feature.properties.name]) {
                    let immigrants = parseInt(cdata[year][feature.properties.name].replace(/,/g, ''));
                    //This JSON.parse(JSON.stringify()) bullshit allowed me to bypass the horseshit shallow copy
                    //thing that javascript kept insisting I meant.  No I don't wanna update feature, that's why
                    //I saved it into temporary feature.  wtf get your shit together js
                    let tempfeat = JSON.parse(JSON.stringify(feature));
                    tempfeat['properties']['immigrants'] = immigrants;
                    //If statement checks to see if value is valid or NaN
                    if(immigrants) {
                        allData[year].features.push(tempfeat)
                    }
                }
            }
        }
        // console.log(allData)

        for(year in allData) {
            // console.log(year)
            allLayers[year] = L.choropleth(allData[year],{
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
                layer.bindPopup(feature.properties.name + `<br>Number of Immigrants in ${year}:<br>` + feature.properties.immigrants);
                }
            });
        }
        // console.log(allLayers)
        
        L.control.layers(allLayers).addTo(map)
        var legend = L.control({ position: "bottomright" });
        legend.onAdd = function() {
            var div = L.DomUtil.create("div", "info legend");
            var limits = allLayers['1960'].options.limits;
            var colors = allLayers['1960'].options.colors;
            var labels = [];
            // console.log(limits)
            // Add min & max
            var legendInfo = "<h1 style='text-align:center;'>Immigration Volume</h1>" +
            "<div class=\"labels\">" +
                "<div class=\"min\">" + limits[0] + "</div>" +
                "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
            "</div>";

            div.innerHTML = legendInfo;
            div.id = 'legend'
            limits.forEach(function(limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
            });

            div.innerHTML += "<ul>" + labels.join("") + "</ul>";
            return div;
        };
        legend.addTo(map);
    })
})

//Following code updates legend after user changes choropleth layer
map.on('baselayerchange',function(e) {
    // console.log('change')
    // console.log(e)
    let div = L.DomUtil.get('legend')
    let limits = allLayers[e.name].options.limits;
    let colors = allLayers[e.name].options.colors;
    let labels = [];

    let legendInfo = "<h1 style='text-align:center;'>Immigration Volume</h1>" +
        "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        "</div>";
    
    div.innerHTML = legendInfo;
    limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
})