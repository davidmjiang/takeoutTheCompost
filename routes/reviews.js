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
     const latitude = parseFloat(req.query.lat);
     const longitude = parseFloat(req.query.lon);
     const querySpec = {
       query: "SELECT * FROM root r WHERE ROUND(r.lat)=@lat AND ROUND(r.lon)=@lon",
       parameters: [
         {
           name: "@lat",
           value: Math.round(latitude)
         },
         {
           name: "@lon",
           value: Math.round(longitude)
         }
       ]
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

     // translate the strings into numbers when needed
     const review = {
       yelpId: item.yelpId,
       id: item.id,
       name: item.name,
       lat: parseFloat(item.latitude),
       lon: parseFloat(item.longitude),
       containers: parseInt(item.containers),
       cups: parseInt(item.cups),
       bags: parseInt(item.bags),
       utensils: parseInt(item.utensils)
     };

     const doc = await this.reviewDao.createOrUpdate(review);
     // show a thank you page
     res.render("pages/confirmation", { name: item.name });
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

   async newReview(req, res) {
     const yelpId = req.query.yelpId;
     // check that one doesn't already exist
     const review = await this.getReviewByYelpId(yelpId);
     let viewResult = {};
     if (review && review.length > 0) {
       // review exists, get the existing info
       viewResult = review[0];

     } else {
       // new review, put in the info we know
      viewResult = { yelpId, name: req.query.name, lat: req.query.lat, lon: req.query.lon };
     }
     res.render('pages/review', { viewResult, helpers: viewHelpers });
   }
 }

 module.exports = ReviewList;