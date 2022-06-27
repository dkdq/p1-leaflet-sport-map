window.addEventListener('DOMContentLoaded', async function () {
    let map = createMap(1.3521, 103.8198);
    let searchResultLayer = L.layerGroup();
    searchResultLayer.addTo(map)

    let response = await axios.get(weatherAPI);
    let weatherCoordinates = response.data.area_metadata;

    // new data
    let newData = [];
    let coor = response.data.area_metadata;
    let weather = response.data.items[0].forecasts;
    let markerCluster = L.markerClusterGroup({
        maxClusterRadius: 55,
    });

    for (i = 0; i < coor.length; i++) {
        newData.push(
            {
                name: coor[i].name,
                latitude: coor[i].label_location.latitude,
                longitude: coor[i].label_location.longitude,
                weather: weather[i].forecast
            })
    }

    // weather icon
    let iconWeather = L.Icon.extend({
        options: {
            iconSize: [40, 40],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        }
    });

    let iconSunny = new iconWeather({
        iconUrl: 'images/weather.png',
    })

    for (let item of newData) {
        let lat = item.latitude;
        let lon = item.longitude;
        let coordinate = [lat, lon];
        L.marker(coordinate, { icon: iconSunny })
        .bindPopup(`<h1>${item.name}</h1><p>Forecast: ${item.weather}</p>`).addTo(markerCluster);
    }
    markerCluster.addTo(map);

    // geojsons data
    let nparksResponse = await axios.get('data/nparks.geojson');
    let nparksLayer = L.geoJson(nparksResponse.data, {
        'onEachFeature': function (feature, layer) {
            let divElement = document.createElement('div');
            divElement.innerHTML = feature.properties.Description;
            let columns = divElement.querySelectorAll('td');
            let town = columns[0].innerHTML;
            let agency = columns[1].innerHTML;
            layer.bindPopup(`<h1>${town}</h1><p>Maintained by: ${agency}</p>`);
        }
    })
    nparksLayer.setStyle({ color: 'red' });

    let nparksTracksResponse = await axios.get('data/nparks-tracks.geojson');
    let nparksTracksLayer = L.geoJson(nparksTracksResponse.data, {
        'onEachFeature': function (feature, layer) {
            let divElement = document.createElement('div');
            divElement.innerHTML = feature.properties.Description;
            let columns = divElement.querySelectorAll('td');
            let place = columns[0].innerHTML;
            let type = columns[1].innerHTML;
            layer.bindPopup(`<h1>${place}</h1><p>Category: ${type}</p>`);
        }
    })
    nparksTracksLayer.setStyle({ color: 'yellow' });

    // map layer control
    L.control.layers({
        'Google Terrain': googleTerrain,
        'Google Hybird': googleHybird
    }, {
        'Weather': markerCluster,
        'Nparks': nparksLayer,
        'Nparks Tracks': nparksTracksLayer
    }, {position: 'bottomright'}).addTo(map);

    // search button
    document.querySelector('#btnSearch').addEventListener('click', async function () {

        // clear existing markers from the search result layer
        searchResultLayer.clearLayers();

        // clear existing search results
        document.querySelector('#results').innerHTML = "";

        let query = document.querySelector('#txtSearch').value;
        let latlng = map.getBounds().getCenter();
        let locations = await search(latlng.lat, latlng.lng, query, 6000);
        console.log(locations);

        // prevent empty input
        if (query == '') {
            alert('Please enter a value!')
        } else {
            for (let result of locations.results) {
                // create markers and put on map
                let lat = result.geocodes.main.latitude;
                let lng = result.geocodes.main.longitude;

                let marker = L.marker([lat, lng]).addTo(searchResultLayer);

                marker.bindPopup(`<h1>${result.name}</h1>
               <p>${result.location.address}
               ${result.location.formatted_address ? ", " + result.location.post_town : ''}</p>`)

                // display search result under the search
                let resultElement = document.createElement('div');
                resultElement.className = "search-result";
                resultElement.innerHTML = result.name;
                resultElement.addEventListener('click', function () {
                    map.flyTo([lat, lng], 16)
                    marker.openPopup();
                })
                document.querySelector("#results").appendChild(resultElement);
            }
        }

        // reset button
        document.querySelector('#btnReset').addEventListener('click', async function () {
            searchResultLayer.clearLayers();
            document.querySelector('#results').innerHTML = "";
            document.querySelector('#txtSearch').value = "";
            map.setView([1.3521, 103.8198], 14);
        })
    })

    // toggle button
    document.querySelector("#btnShowSearch").addEventListener('click', function () {

        let searchContainer = document.querySelector('#search-container');

        let isDisplayed = searchContainer.style.display == 'none';
        if (isDisplayed) {
            searchContainer.style.display = 'block';
        } else {
            searchContainer.style.display = 'none';
        }
    });

    // location button
    document.querySelector("#btnLocation").addEventListener('click', function () {

        map.locate({
            maxZoom: 20,
            watch: true,
            timeout: 10000
        });
    
        function onLocationFound(e) {
            let radius = e.accuracy / 2;

            let location = L.icon({
                iconUrl: 'images/marker-icon-2x-red.png',
                shadowUrl: 'images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            L.marker(e.latlng, {icon: location}).addTo(map)
                .bindPopup("You are within " + parseInt(radius) + " meters from this point").openPopup();
            L.circle(e.latlng, radius).addTo(map);
        }
        map.on('locationfound', onLocationFound);
    });
})