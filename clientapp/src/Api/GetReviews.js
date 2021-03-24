import { apiBaseUrl } from "../config";

export function getAreaReviews(params) {
    let url = `${apiBaseUrl}/reviews`;
    return fetch(url)
        .then(res => res.json());
}