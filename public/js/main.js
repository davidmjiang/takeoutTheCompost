const getAreaReviews = require("./GetReviews");
const BingMap = require("./mapUtilities");
require("./search");

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
    // make sure we are on the map page
    if (!document.getElementById("ReviewsMap")) {
        return;
    }
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

// enable popovers
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl, { trigger: 'focus', container: 'body', fallbackPlacements:['bottom'] });
})

window.onload = loadMapScenario;