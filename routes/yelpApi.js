const yelp = require("yelp-fusion");
const config = require("../config")

const apiKey = config.yelpKey;
const client = yelp.client(apiKey);

var yelpApi = {
    searchBusinessesApi: function(req, res) {
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
    },
    searchBusinesses: function(term, latitude, longitude) {
        return client.search({
            term,
            latitude,
            longitude
        }).then(response => {
            return response.jsonBody.businesses;
        });
    }
}

module.exports = yelpApi;