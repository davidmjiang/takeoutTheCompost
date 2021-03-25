const ReviewDao = require("../models/reviewDao");
const yelpApi = require("./yelpApi");
const viewHelpers = require("../public/js/helpers");

 class ReviewList {
   /**
    * Handles the various APIs for displaying and managing reviews
    * @param {ReviewDao} reviewDao
    */
   constructor(reviewDao) {
     this.reviewDao = reviewDao;
   }
   async getReviews(req, res) {
     const querySpec = {
       query: "SELECT * FROM root r"
     };

     const items = await this.reviewDao.find(querySpec);
     res.send(items);
   }

   async getReview(req, res) {
     const yelpId = req.params.id;
     const review = await this.getReviewByYelpId(yelpId);
     res.send(review);
   }

   async addReview(req, res) {
     const item = req.body;

     const doc = await this.reviewDao.addItem(item);
     res.send(doc);
   }

   async searchReviews(req, res) {
     const yelpResults = await yelpApi.searchBusinesses(req.query.term, req.query.lat, req.query.lon);
     const reviewResults = {};
     let promises = yelpResults.map((result) => {
      const yelpId = result.id;
      const reviewPromise = this.getReviewByYelpId(yelpId).then((review) => {
        if (review.length > 0) {
          reviewResults[yelpId] = review[0];
        }
      });
      return reviewPromise;
     });
     await Promise.all(promises);
     res.render('pages/search', {yelpResults, reviewResults, helpers: viewHelpers, searchTerm: req.query.term });
   }

   async getReviewByYelpId(yelpId) {
    const querySpec = {
      query: "SELECT * FROM root r WHERE r.yelpId=@yelpId",
      parameters: [
        {
          name: "@yelpId",
          value: yelpId
        }
      ]
    };
    const review = await this.reviewDao.find(querySpec);
    return review;
   }
 }

 module.exports = ReviewList;