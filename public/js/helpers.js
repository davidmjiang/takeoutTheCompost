const Ratings = require("./Ratings")

var helpers = {
    getRatingImage: function(score) {
        return "img\\" + Ratings.ratingImages[score];
    },
    getNewReviewUrl: function(restaurant) {
        const url = `/newReview?yelpId=${restaurant.id}&name=${restaurant.name}&lat=${restaurant.coordinates.latitude}&lon=${restaurant.coordinates.longitude}`;
        return encodeURI(url);
    },
    shouldBeChecked: function(reviewVal, radioVal) {
        if (reviewVal == radioVal) {
            return "checked";
        } else {
            return null;
        }
    },
    getMapUrl: function(key) {
        return `https://www.bing.com/api/maps/mapcontrol?key=${key}`;
    },
    createRadioButtonId: function(label, value) {
        return `${label}RadioButton${value}`;
    }
}

module.exports = helpers;
