require('dotenv').config();
const config = {};

config.host = process.env.HOST;
config.authKey = process.env.AUTH_KEY;
config.databaseId = "CompostApp";
config.containerId = "Reviews";

if (config.host.includes("https://localhost:")) {
  console.log("Local environment detected");
  console.log("WARNING: Disabled checking of self-signed certs. Do not have this code in production.");
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.log(`Go to http://localhost:${process.env.PORT || '3000'} to try the sample.`);
}

config.yelpKey = process.env.YELP_KEY;
config.bingKey = process.env.BING_KEY;
config.applicationInsightsKey = process.env.APPINSIGHTS_INSTRUMENTATIONKEY;

module.exports = config;