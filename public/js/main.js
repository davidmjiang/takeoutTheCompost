const getAreaReviews = require("./GetReviews");
const BingMap = require("./mapUtilities");
require("./search");

function mapIncludes(point) {
    const entities = BingMap.getPins();
    for (let i = 0; i < entities.getLength(); i++) {
        const id = entities.get(i).metadata.yelpId;
        if (id && id === point.yelpId) {
            return true;
        }
    }
    return false;
}

function updateMap(points) {
    if (points && points.length > 0) {
        points.forEach((point) => {
            if (!mapIncludes(point)) {
                let lat = point.lat;
                let lon = point.lon;
                let highlightPin = window.highlightedId && window.highlightedId === point.yelpId;
                BingMap.drawThePinByGeocoords(lat, lon, point, highlightPin);
            }
        });
    }
}

function getBoundParams() {
    const bounds = BingMap.getBounds();
    const east = bounds.getEast();
    const north = bounds.getNorth();
    const south = bounds.getSouth();
    const west = bounds.getWest();
    const params = {east, north, south, west};
    return params;
}

function getNewPins() {
    const params = getBoundParams();
    getAreaReviews(params).then(res => {
        updateMap(res);
    });
}

function loadMapScenario() {
    // make sure we are on the map page
    if (!document.getElementById("ReviewsMap")) {
        return;
    }
    if (BingMap.getMap() == null) {
        BingMap.init();
        BingMap.addThrottledHandler('viewchangeend', getNewPins, 2000);
    }
}

// enable popovers
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl, { trigger: 'focus', container: 'body', fallbackPlacements:['bottom'] });
})

window.onload = loadMapScenario;