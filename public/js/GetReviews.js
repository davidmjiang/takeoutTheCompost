function getAreaReviews(params) {
    let url = `/reviews`;
    return fetch(url)
        .then(res => res.json());
}

module.exports = getAreaReviews;