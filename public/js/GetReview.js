function getReview(yelpId) {
    let url = `/review/${yelpId}`;
    return fetch(url)
        .then(res => res.json());
}

module.exports = getReview;