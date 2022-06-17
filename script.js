const weatherAPI = 'https://api.data.gov.sg/v1/environment/2-hour-weather-forecast';
const fourSquareAPI = 'https://api.foursquare.com/v3/';
const keyAPI = 'fsq3vW4xIbVcpqi55/KpV8GLD+rU8CR8Etgm2zEfsG5Dwho=';

let map = L.map('map');
map.setView([1.2451, 103.8498], 12);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw' //demo access token
}).addTo(map);

async function search() {
    // let map = createMap(1.2451, 103.8498);
    let url = fourSquareAPI + 'places/search';
    let placeResponse = await axios.get(url, {
        'params': {
            // 'll': lat+","+lng,
            'near': 'singapore',
            // 'query': query,
            'categories': 16004,
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


async function main() {
    // let map = createMap(1.2451, 103.8498);
    search(map);
    let response = await axios.get(weatherAPI);
    let weatherCoordinates = response.data.area_metadata;
    // console.log(response.data.area_metadata);
    // console.log(response.data.items[0].forecasts);

    // new data
    let newData = [];
    let coor = response.data.area_metadata;
    let weather = response.data.items[0].forecasts;
    let markerCluster = L.markerClusterGroup({
        zoomToBoundsOnClick: false
    });

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
    // console.log(newData);    

    // for (let item of newData) {
    //     let lat = item.latitude;
    //     let lon = item.longitude;
    //     let coordinate = [lat, lon];
    //     L.marker(coordinate).bindPopup(`
    //     <h1>${item.name}</h1><p>Forecast: ${item.weather}</p>`)
    //         .addTo(markerCluster);
    // }
    // markerCluster.addTo(map);

    // icon
    let iconWeather = L.Icon.extend({
        options: {
           iconSize:     [38, 95],
           shadowSize:   [50, 64],
           iconAnchor:   [22, 94],
           shadowAnchor: [4, 62],
           popupAnchor:  [-3, -76]
        }
    });

    let iconSunny = new iconWeather({
        iconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-green.png',
        shadowUrl: 'http://leafletjs.com/examples/custom-icons/leaf-shadow.png'
    })

    for (let item of newData) {
        let lat = item.latitude;
        let lon = item.longitude;
        let coordinate = [lat, lon];
        L.marker(coordinate, {icon: iconSunny}).bindPopup(`<h1>${item.name} ${item.weather}</h1>`).addTo(markerCluster);
    }
    markerCluster.addTo(map);

    let cyclingResponse = await axios.get('data/cycling-path.geojson');
    // console.log(cyclingResponse.data);
    let cyclingLayer = L.geoJson(cyclingResponse.data, {
        'onEachFeature': function (feature, layer) {
            // console.log(feature);
            let divElement = document.createElement('div');
            divElement.innerHTML = feature.properties.Description;
            // console.log(feature.properties.Description);
            let columns = divElement.querySelectorAll('td');
            let town = columns[0].innerHTML;
            let agency = columns[1].innerHTML;
            layer.bindPopup(`<h1>${town}</h1><p>Maintained by: ${agency}</p>`);
            // layer.bindPopup(feature.properties.Description);
        }
    })
    cyclingLayer.setStyle({ color: 'red' });

    let nparksResponse = await axios.get('data/nparks-tracks.geojson');
    // console.log(cyclingResponse.data);
    let nparksLayer = L.geoJson(nparksResponse.data, {
        'onEachFeature': function (feature, layer) {
            // console.log(feature);
            let divElement = document.createElement('div');
            divElement.innerHTML = feature.properties.Description;
            // console.log(feature.properties.Description);
            let columns = divElement.querySelectorAll('td');
            // console.log(columns);
            let place = columns[0].innerHTML;
            let type = columns[1].innerHTML;
            layer.bindPopup(`<h1>${place}</h1><p>Category: ${type}</p>`);
            // layer.bindPopup(feature.properties.Description);
        }
    })
    nparksLayer.setStyle({ color: 'blue' });

    let loopResponse = await axios.get('data/park-connector-loop.geojson');
    // console.log(cyclingResponse.data);
    let loopLayer = L.geoJson(loopResponse.data, {
        'onEachFeature': function (feature, layer) {
            // console.log(feature);
            let divElement = document.createElement('div');
            divElement.innerHTML = feature.properties.Description;
            // console.log(feature.properties.Description);
            let columns = divElement.querySelectorAll('td');
            // console.log(columns);
            let place = columns[0].innerHTML;
            let type = columns[1].innerHTML;
            layer.bindPopup(`<h1>${place}</h1><p>Category: ${type}</p>`);
            // layer.bindPopup(feature.properties.Description);
        }
    })
    loopLayer.setStyle({ color: 'green' });

    L.control.layers({}, {
        'Weather': markerCluster,
        'Cycling Path Networks': cyclingLayer,
        'Nparks Tracks': nparksLayer,
        'Park Connector Loop': loopLayer
    }).addTo(map);

    // document.querySelector('#btnSearch').addEventListener('click', search() {
    //     let query = document.querySelector('#txtSearch').value;
    //     console.log(query);
    // })
}
main();

window.addEventListener('DOMContentLoaded', async function () {
    // let map = createMap(1.3521, 103.8198);
    let searchResultLayer = L.layerGroup();
    searchResultLayer.addTo(map)

    document.querySelector('#btnSearch').addEventListener('click', async function () {
        
        searchResultLayer.clearLayers(); 
        document.querySelector('#results').innerHTML = "";
        
        let query = document.querySelector('#txtSearch').value;
        // let latlng = map.getBounds().getCenter();
        // let locations = await search(latlng.lat, latlng.lng, query, 4000);
        let locations = await search();
        // console.log(locations);
        for (let result of locations.results) {
            let lat = result.geocodes.main.latitude;
            let lng = result.geocodes.main.longitude;

            let marker = L.marker([lat, lng]).addTo(searchResultLayer);

            marker.bindPopup(`<h1>${result.name}</h1>
            <p>${result.location.address} 
            ${result.location.address_extended ? ", " + result.location.address_extended
            : ""}</p>`)

            let resultElement = document.createElement('div');
            resultElement.className="search-result";
            resultElement.innerHTML = result.name;
            resultElement.addEventListener('click', function(){
                map.flyTo([lat, lng], 15)
                marker.openPopup();
            })

            document.querySelector("#results").appendChild(resultElement);
        }
    })

    document.querySelector("#btnShowSearch").addEventListener('click', function(){
   
        let searchContainer = document.querySelector('#search-container');

        let isDisplayed =  searchContainer.style.display == 'block';
        console.log(isDisplayed);
        if (isDisplayed) {
            searchContainer.style.display = 'none';
        } else {
            searchContainer.style.display = 'block';
        }
    });
})