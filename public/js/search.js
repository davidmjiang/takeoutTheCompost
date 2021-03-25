const mapUtilities = require("./mapUtilities");

function getLocation() {
    // first check if the map gas the coords
    if (mapUtilities.getMap()) {
        return mapUtilities.getCenter();
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