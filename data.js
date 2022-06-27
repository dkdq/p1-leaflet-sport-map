const fourSquareAPI = 'https://api.foursquare.com/v3/';
const keyAPI = 'fsq3vW4xIbVcpqi55/KpV8GLD+rU8CR8Etgm2zEfsG5Dwho=';
const weatherAPI = 'https://api.data.gov.sg/v1/environment/2-hour-weather-forecast';

async function search(lat, lng, query, radius) {

    let url = fourSquareAPI + 'places/search';
    let response = await axios.get(url,{
        'params': {
            'll': lat+","+lng,
            'query': query,
            'radius': radius,
            'categories': 16000,
            'limit': 50
        },
        'headers':{
            'Accept': 'application/json',
            'Authorization': keyAPI
        }
    });
    return response.data;
}
