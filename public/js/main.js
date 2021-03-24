const getAreaReviews = require("./GetReviews");
const BingMap = require("./mapUtilities");

function updateMap(points) {
    if (points && points.length > 0) {
        let locations = [];
        points.forEach((point) => {
            let lat = point.lat;
            let lon = point.lon;
            locations.push({latitude: lat, longitude: lon});

            BingMap.drawThePinByGeocoords(lat, lon, point);
        });
        BingMap.setLocationsView(locations, 80);
    }
}

function loadMapScenario() {
    if (BingMap.getMap() == null) {
        BingMap.init();
        const mapCenter = BingMap.getCenter();
        const params = {
            lat: mapCenter.latitude,
            lon: mapCenter.longitude
        };
        getAreaReviews(params).then(res => {
            updateMap(res);
        });
    }
}

window.onload = loadMapScenario;