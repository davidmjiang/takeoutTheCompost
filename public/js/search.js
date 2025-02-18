const mapUtilities = require("./mapUtilities");

function getLocation() {
    // first check if the map gas the coords
    if (mapUtilities.getMap()) {
        return mapUtilities.getCenter();
    }
    // if not check for query params
    const params = new URLSearchParams(window.location.search);
    const lat = params.get("lat");
    const lon = params.get("lon");
    if (lat && lon) {
        return {longitude: lon, latitude: lat};
    }
    // if not then get from browser
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            return position;
        });
    }
}

const searchButton = document.getElementById("search-button");
const searchField = document.getElementById("search-field");
if (searchButton) {
    searchButton.addEventListener("click", () => {
        const location = getLocation();
        const term = searchField.value;
        const longitude = location.longitude;
        const latitude = location.latitude;
        window.location.href=`/searchResults?term=${term}&lat=${latitude}&lon=${longitude}`;
    });
}

if (searchField) {
    searchField.addEventListener("keyup", function(event) {
        if (event.code === 'Enter') {
            event.preventDefault();
            searchButton.click();
        }
    });
}