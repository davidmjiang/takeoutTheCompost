function getAreaReviews(params) {
    let url = `/reviews?north=${params.north}&east=${params.east}&south=${params.south}&west=${params.west}`;
    return fetch(url)
        .then(res => res.json());
}

module.exports = getAreaReviews;