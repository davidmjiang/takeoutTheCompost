const Ratings = require("../js/Ratings");

function getRatingImage(score) {
    return "img\\" + Ratings.ratingImages[score];
}

function getScoreHtml(category, imgSrc) {
    return `<div class=\"infobox-score\">${category}: <img class=\"infobox-image img-fluid\" src=${imgSrc} /></div>`;
}

function getTitleHtml(review) {
    return `<div class=\"infobox-title\">${review.name}</div>`;
}

function getHtmlString(review) {
    const containerScore = getRatingImage(review.containers);
    const cupScore = getRatingImage(review.cups);
    const bagScore = getRatingImage(review.bags);
    const utensilScore = getRatingImage(review.utensils);
    const opening = "<div class=\"infobox\">";
    const closing = "</div>";
    const result = opening + getTitleHtml(review) + getScoreHtml("Containers", containerScore) + getScoreHtml("Bags", bagScore) + getScoreHtml("Cups", cupScore) + getScoreHtml("Utensils", utensilScore) + closing;
    return result;
}

module.exports = getHtmlString;