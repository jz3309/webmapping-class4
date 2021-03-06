mapboxgl.accessToken = 'pk.eyJ1IjoianozMzA5IiwiYSI6ImNqbGR4amJwMjBnODkza3V2ZzFxMHV0dW0ifQ.lQd9gMzBwlRC_TikwmZTbQ';

// instantiate the map
var map = new mapboxgl.Map({
    container: 'mapContainer',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-74.0059, 40.7577],
    zoom: 12,
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

//add NavigationControl
map.addControl(new mapboxgl.NavigationControl());

// Add geolocate control to the map.
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}));


//add each station as a circle
map.on('load', function() {
    //add source
    map.addSource('pointssource', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/jz3309/ADS/master/avgfee.geojson'
    });

    //add station's address as a label
    map.addLayer({
        id: "poi-labels",
        type: "symbol",
        source: "pointssource",
        layout: {
            "text-field": ["get", "StationName"],
            "text-font": ["Lato Black"],
            "text-offset": [0, 2.5],
            "text-size": 8,
            "text-allow-overlap": true,
            "text-justify": "center",
            "icon-offset": [0, -22],
            "icon-image": "marker",
            "icon-allow-overlap": true
        },
        paint: {
            "text-color": "#fff"
        }
    });

    //load  all the itmes to console
    map.addLayer({
        id: 'stationpoints',
        type: 'circle',
        source: 'pointssource',
        paint: {
            // make circles larger as the user zooms

            'circle-stroke-width': 5,
            'circle-stroke-color': '#f7df26',
            'circle-color': "#f7df26",
            'circle-stroke-opacity': 0.1,
            'circle-radius': {
                'base': 0.8,
                'stops': [
                    [12.5, 2.5],
                    [18, 10]
                ]
            }
        },

    });
});

//add popup when hover to show more information
var popup = new mapboxgl.Popup({});

map.on('mouseenter', 'stationpoints', function(e) {
    map.getCanvas().style.cursor = 'pointer';

    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = e.features[0].properties.StationName;
    var prices = e.features[0].properties.AvgTestFees;
    var phonenumber = e.features[0].properties.PhoneNumber
    var address = e.features[0].properties.Address
    var zip = e.features[0].properties.ZIP
    var city = e.features[0].properties.City



    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    popup.setLngLat(coordinates)
        .setHTML('<h4>' + description + '</h4>' + '</br>' + '<h7>' + 'Price: $' + prices + '</h7>' + '</br><h7>' + 'Phone Number: ' + phonenumber + '</h7>' +
            '</br><h7>' + 'Address: ' + address + '</h7>' + '</br><h7>' + 'ZipCode: ' + zip + '</h7>')
        .addTo(map);

});

map.on('mouseleave', 'stationpoints', function() {
    map.getCanvas().style.cursor = '';
});


//add slider to filter the price
document.getElementById('slider').addEventListener('input', function(e) {
    var fee = parseInt(e.target.value);
    // update the map
    map.setFilter('stationpoints', ['<', ['number', ['get', 'AvgTestFees']], fee]);

    // update text when slide the bar
    document.getElementById('fee-filter').innerText = fee
});