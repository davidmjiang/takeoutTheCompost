const Ratings = require("./Ratings")

var helpers = {
    getRatingImage: function(score) {
        return "img\\" + Ratings.ratingImages[score];
    }
}

module.exports = helpers;