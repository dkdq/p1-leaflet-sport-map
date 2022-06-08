const weatherAPI = "https://api.data.gov.sg/v1/environment/2-hour-weather-forecast";

let map = L.map('map');

map.setView([1.3521, 103.8198], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw' //demo access token
}).addTo(map);

async function markerCoordinates() {
    let response = await axios.get(weatherAPI);
    let weatherCoordinates = response.data.area_metadata;
    // console.log(response.data.area_metadata);
    // console.log(response.data.items[0].forecasts);
    for (let place of weatherCoordinates) {
        let lat = place.label_location.latitude;
        let lon = place.label_location.longitude;
        let coordinate = [lat,lon];
        L.marker(coordinate).bindPopup(`<h1>${place.name}</h1>`).addTo(map);
    }
markerCoordinates();

let coor = response.data.area_metadata);
let weather = response.data.items[0].forecasts);

for (i=0; i<coor.length; i++){
    console.log(coor[i]
}