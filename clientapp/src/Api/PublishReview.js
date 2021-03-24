import { apiBaseUrl } from "../config";

export function publishReview(params) {
    let url = `${apiBaseUrl}/review`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    }
    return fetch(url, options)
                .then(res => res.json())
                .then(res => res);
}