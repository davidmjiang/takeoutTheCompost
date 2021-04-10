const ReviewDao = require("../models/reviewDao");
const yelpApi = require("./yelpApi");
const viewHelpers = require("../public/js/helpers");
const config = require("../config");
const appInsights = require("applicationinsights");

 class ReviewList {
   /**
    * Handles the various APIs for displaying and managing reviews
    * @param {ReviewDao} reviewDao
    */
   constructor(reviewDao) {
     this.reviewDao = reviewDao;
     this.appInsights = appInsights.defaultClient;
   }
   async getReviews(req, res) {
     this.appInsights.trackTrace({message: "Request to /reviews started"});
     const north = parseFloat(req.query.north);
     const east = parseFloat(req.query.east);
     const south = parseFloat(req.query.south);
     const west = parseFloat(req.query.west);
     const querySpec = {
       query: "SELECT * FROM root r WHERE r.lat <= @north AND r.lat >= @south AND r.lon <= @east AND r.lon >= @west",
       parameters: [
         {
           name: "@north",
           value: north
         },
         {
           name: "@east",
           value: east
         },
         {
          name: "@south",
          value: south
        },
        {
          name: "@west",
          value: west
        }
       ]
     };

     let startTime = Date.now();
     const items = await this.reviewDao.find(querySpec);
     let duration = Date.now() - startTime;
     this.appInsights.trackDependency({name: "get reviews from db", duration: duration});
     res.send(items);
   }

   async addReview(req, res) {
     this.appInsights.trackTrace({message: "Adding a new review"});
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

     let startTime = Date.now();
     const doc = await this.reviewDao.createOrUpdate(review);
     let duration = Date.now() - startTime;
     this.appInsights.trackDependency({name: "posting review to db", duration: duration});
     // show a thank you page
     const title = `Thank you for reviewing ${item.name}!`;
     res.render("pages/index", { title: title, image: "img/happy-cook.svg", mapKey: config.bingKey, helpers: viewHelpers});
   }

   async searchReviews(req, res) {
     this.appInsights.trackEvent({name: "Request to /searchResults started", properties: {term: req.query.term}});

     let startTime = Date.now();
     const yelpResults = await yelpApi.searchBusinesses(req.query.term, req.query.lat, req.query.lon);
     let duration = Date.now() - startTime;
     this.appInsights.trackDependency({name: "search yelp", duration: duration});

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

     let startTime2 = Date.now();
     await Promise.all(promises);
     let duration2 = Date.now() - startTime2;
     this.appInsights.trackDependency({name: "get reviews by yelp id", duration: duration2});
     this.appInsights.trackEvent({name: "returning search results", properties: {yelpResults: yelpResults.length, reviewResults: Object.keys(reviewResults).length}});

     res.render('pages/search', { yelpResults, reviewResults, helpers: viewHelpers, searchTerm: req.query.term });
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
     this.appInsights.trackEvent({name: "new review page", properties: {yelpId: req.query.yelpId}});
     const yelpId = req.query.yelpId;
     // check that one doesn't already exist
     let startTime = Date.now();
     const review = await this.getReviewByYelpId(yelpId);
     let duration = Date.now() - startTime;
     this.appInsights.trackDependency({name: "get review by yelp id", duration: duration});

     let viewResult = {};
     if (review && review.length > 0) {
       // review exists, get the existing info
       this.appInsights.trackTrace({message: "Review exists, getting the existing info"});
       viewResult = review[0];

     } else {
       // new review, put in the info we know
       this.appInsights.trackTrace({message: "New review, putting in the info we know"});
      viewResult = { yelpId, name: req.query.name, lat: req.query.lat, lon: req.query.lon };
     }
     res.render('pages/review', { viewResult, helpers: viewHelpers });
   }
 }

 module.exports = ReviewList;