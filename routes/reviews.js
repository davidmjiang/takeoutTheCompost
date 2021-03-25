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

   async getReview(req, res) {
     const yelpId = req.params.id;
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
     res.send(review);
   }

   async addReview(req, res) {
     const item = req.body;

     const doc = await this.reviewDao.addItem(item);
     res.send(doc);
   }
 }

 module.exports = ReviewList;