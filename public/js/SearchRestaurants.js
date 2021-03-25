function searchRestaurantsByCoordinates(term, latitude, longitude) {
    let url = `/searchResults?term=${term}&lat=${latitude}&lon=${longitude}`;
    return fetch(url)
    .then(res => res.json());
}

module.exports = searchRestaurantsByCoordinates;