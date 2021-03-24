'use strict'

const { CosmosClient } = require("@azure/cosmos")
const config = require("./config")
const ReviewDao = require("./models/reviewDao")
const ReviewList = require("./routes/reviews")
const yelpApi = require("./routes/yelpApi")

var express = require("express"),
  app = express(),
  router = require("./routes"),
  path = require('path'),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000,
  host = process.env.OPENSHIFT_NODEJS_IP

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// serve static content
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'clientapp/build')));

// database setup
const cosmosClient = new CosmosClient({
  endpoint: config.host,
  key: config.authKey
});
const reviewDao = new ReviewDao(cosmosClient, config.databaseId, config.containerId);
const reviewList = new ReviewList(reviewDao);
reviewDao.init(err => {
  console.error(err);
}).catch(err => {
  console.error(err);
  console.error("Shutting down because there was an error setting up the database");
  process.exit(1);
});

app.get("/reviews", (req, res, next) => reviewList.getReviews(req, res).catch(next));
app.get("/searchResults", (req, res, next) => yelpApi.searchBusinesses(req, res));
app.post("/review", (req, res, next) => reviewList.addReview(req, res).catch(next));

app.use("/", router)
app.use('*', function (req, res) {
  res.render('pages/404')
})

app.listen(port, host, function () {
  host = host || 'localhost'
  console.log('Server is running at ' + host + ':' + port)
})