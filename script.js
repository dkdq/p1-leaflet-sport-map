const weatherAPI = 'https://api.data.gov.sg/v1/environment/2-hour-weather-forecast';
const fourSquareAPI = 'https://api.foursquare.com/v3/';
const keyAPI = 'fsq3vW4xIbVcpqi55/KpV8GLD+rU8CR8Etgm2zEfsG5Dwho=';

async function markerWeather() {
    let map = createMap(1.2451, 103.8498);
    let response = await axios.get(weatherAPI);
    let weatherCoordinates = response.data.area_metadata;
    // console.log(response.data.area_metadata);
    // console.log(response.data.items[0].forecasts);

    // icon
    // let iconWeather = L.Icon.extend({
    //     options: {
    //        iconSize:     [38, 95],
    //        shadowSize:   [50, 64],
    //        iconAnchor:   [22, 94],
    //        shadowAnchor: [4, 62],
    //        popupAnchor:  [-3, -76]
    //     }
    // });

    // let iconSunny = new iconWeather({
    //     iconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-green.png',
    //     shadowUrl: 'http://leafletjs.com/examples/custom-icons/leaf-shadow.png'
    // })

    // new data
    let newData = [];
    let coor = response.data.area_metadata;
    let weather = response.data.items[0].forecasts;

    for (i = 0; i < coor.length; i++) {
        // console.log(coor[i]);
        // console.log(weather[i]);
        newData.push(
            {
                name: coor[i].name,
                latitude: coor[i].label_location.latitude,
                longitude: coor[i].label_location.longitude,
                weather: weather[i].forecast
            })
    }
    console.log(newData);

    for (let item of newData) {
        let lat = item.latitude;
        let lon = item.longitude;
        let coordinate = [lat, lon];
        L.marker(coordinate).bindPopup(`<h1>${item.name} ${item.weather}</h1>`).addTo(map);
    }

    // for (let item of newData) {
    //     let lat = item.latitude;
    //     let lon = item.longitude;
    //     let coordinate = [lat, lon];
    //     L.marker(coordinate, {icon: iconSunny}).bindPopup(`<h1>${item.name} ${item.weather}</h1>`).addTo(map);
    // }

    // let cyclingResponse = await axios.get('data/cycling-path.geojson');
    // // console.log(cyclingResponse.data);
    // let cyclingLayer = L.geoJson(cyclingResponse.data, {
    //     'onEachFeature': function (feature, layer) {
    //         // console.log(feature);
    //         layer.bindPopup(feature.properties.Description);
    //     }
    // })
    // cyclingLayer.addTo(map);

    // let nparksResponse = await axios.get('data/nparks-tracks.geojson');
    // // console.log(cyclingResponse.data);
    // let nparksLayer = L.geoJson(nparksResponse.data, {
    //     'onEachFeature' : function(feature,layer){
    //         console.log(feature);
    //         layer.bindPopup(feature.properties.Description);
    //     }
    // })
    // nparksLayer.addTo(map);

    let loopResponse = await axios.get('data/park-connector-loop.geojson');
    // console.log(cyclingResponse.data);
    let loopLayer = L.geoJson(loopResponse.data, {
        'onEachFeature': function (feature, layer) {
            // console.log(feature);
            layer.bindPopup(feature.properties.Description);
        }
    })
    loopLayer.addTo(map);
}
markerWeather();

async function search() {
    let url = fourSquareAPI + 'places/search';
    let placeResponse = await axios.get(url, {
        'params': {
            'll': '1.3521,103.8198',
            // 'near': 'singapore',
            'query': 'trail',
            'limit': 50
        },
        'headers': {
            'Accept': 'application/json',
            'Authorization': keyAPI
        }
    });
    // console.log(placeResponse.data);
    return placeResponse.data;
}
search();   