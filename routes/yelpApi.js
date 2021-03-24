const yelp = require("yelp-fusion");
const config = require("../config")

const apiKey = config.yelpKey;
const client = yelp.client(apiKey);

var yelpApi = {
    searchBusinesses: function(req, res) {
        const term = req.query.term;
        const latitude = req.query.lat;
        const longitude = req.query.lon;

        client.search({
            term,
            latitude,
            longitude
        }).then(response => {
            res.send(response.jsonBody.businesses);
        }).catch(e => {
            res.send(e);
        });
    }
}

module.exports = yelpApi;