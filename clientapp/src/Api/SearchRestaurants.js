import { apiBaseUrl } from "../config";

export function searchRestaurantsByCoordinates(term, latitude, longitude) {
    let url = `${apiBaseUrl}/searchResults?term=${term}&lat=${latitude}&lon=${longitude}`;
    return fetch(url)
    .then(res => res.json());
}