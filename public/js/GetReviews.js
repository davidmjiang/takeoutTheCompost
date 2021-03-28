function getAreaReviews(params) {
    let url = `/reviews?lat=${params.lat}&lon=${params.lon}`;
    return fetch(url)
        .then(res => res.json());
}

module.exports = getAreaReviews;