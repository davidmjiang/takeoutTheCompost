const config = {};

config.host = process.env.HOST || "https://compost.documents.azure.com:443/";
config.authKey =
  process.env.AUTH_KEY || "9bdG9WdQqC7IIJwPu8MquIjW24RLsaUaurtRSRHGj6INypQKHcDVDEcZSSejUSfDZXLRFeAMPUISvfcq8IJuSw==";
config.databaseId = "CompostApp";
config.containerId = "Reviews";

if (config.host.includes("https://localhost:")) {
  console.log("Local environment detected");
  console.log("WARNING: Disabled checking of self-signed certs. Do not have this code in production.");
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.log(`Go to http://localhost:${process.env.PORT || '3000'} to try the sample.`);
}

module.exports = config;