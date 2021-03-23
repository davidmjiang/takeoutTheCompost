const ReviewDao = require("../models/reviewDao");

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

   async addReview(req, res) {
     const item = req.body;

     await this.reviewDao.addItem(item);
     res.redirect("/");
   }
 }

 module.exports = ReviewList;