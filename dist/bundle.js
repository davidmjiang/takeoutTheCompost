(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function getAreaReviews(params) {
    let url = `/reviews`;
    return fetch(url)
        .then(res => res.json());
}

module.exports = getAreaReviews;
},{}],2:[function(require,module,exports){
const Ratings = {
    ratingStrings: {
        0: "Not available",
        1: "Neither",
        2: "Recyclable",
        3: "Compostable"
    },
    ratingImages: {
        0: "not-available-circle.svg",
        1: "remove.svg",
        2: "recycle.svg",
        3: "compostable.svg"
    }
};

module.exports = Ratings;
},{}],3:[function(require,module,exports){
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
    const result = opening + getTitleHtml(review) + getScoreHtml("Containers", containerScore) + getScoreHtml("Cups", cupScore) + getScoreHtml("Bags", bagScore) + getScoreHtml("Utensils", utensilScore) + closing;
    return result;
}

module.exports = getHtmlString;
},{"../js/Ratings":2}],4:[function(require,module,exports){
const getAreaReviews = require("./GetReviews");
const BingMap = require("./mapUtilities");
require("./search");

function updateMap(points) {
    if (points && points.length > 0) {
        let locations = [];
        points.forEach((point) => {
            let lat = point.lat;
            let lon = point.lon;
            locations.push({latitude: lat, longitude: lon});

            BingMap.drawThePinByGeocoords(lat, lon, point);
        });
        BingMap.setLocationsView(locations, 80);
    }
}

function loadMapScenario() {
    // make sure we are on the map page
    if (!document.getElementById("ReviewsMap")) {
        return;
    }
    if (BingMap.getMap() == null) {
        BingMap.init();
        const mapCenter = BingMap.getCenter();
        const params = {
            lat: mapCenter.latitude,
            lon: mapCenter.longitude
        };
        getAreaReviews(params).then(res => {
            updateMap(res);
        });
    }
}

window.onload = loadMapScenario;
},{"./GetReviews":1,"./mapUtilities":5,"./search":6}],5:[function(require,module,exports){
const getHtmlString = require("../js/infoBox");

let map = null; //global 
let infoBox = null;
let layer = [];
let pins = [];

function createCustomClusteredPin(cluster) {
    //Define variables for minimum cluster radius, and how wide the outline area of the circle should be.
    var minRadius = 12;
    var outlineWidth = 7;
    //Get the number of pushpins in the cluster
    var clusterSize = cluster.containedPushpins.length;
    //Calculate the radius of the cluster based on the number of pushpins in the cluster, using a logarithmic scale.
    var radius = Math.log(clusterSize) / Math.log(10) * 5 + minRadius;
    //Default cluster color is red.
    var fillColor = 'rgba(255, 40, 40, 0.5)';
    if (clusterSize < 10) {
        //Make the cluster green if there are less than 10 pushpins in it.
        fillColor = 'rgba(20, 180, 20, 0.5)';
    }
    else if (clusterSize < 100) {
        //Make the cluster yellow if there are 10 to 99 pushpins in it.
        fillColor = 'rgba(255, 210, 40, 0.5)';
    }
    //Create an SVG string of two circles, one on top of the other, with the specified radius and color.
    var svg = ['<svg xmlns="http://www.w3.org/2000/svg" width="', (radius * 2), '" height="', (radius * 2), '">',
        '<circle cx="', radius, '" cy="', radius, '" r="', radius, '" fill="', fillColor, '"/>',
        '<circle cx="', radius, '" cy="', radius, '" r="', radius - outlineWidth, '" fill="', fillColor, '"/>',
        '</svg>'];
    //Customize the clustered pushpin using the generated SVG and anchor on its center.
    cluster.setOptions({
        icon: svg.join(''),
        anchor: new window.Microsoft.Maps.Point(radius, radius),
        textOffset: new window.Microsoft.Maps.Point(0, radius - 8) //Subtract 8 to compensate for height of text.
    });
}

const BingMap = {
    init: function(){
        map = new window.Microsoft.Maps.Map(document.getElementById('ReviewsMap'), { 
            supportedMapTypes: [window.Microsoft.Maps.MapTypeId.road, window.Microsoft.Maps.MapTypeId.aerial, window.Microsoft.Maps.MapTypeId.grayscale, window.Microsoft.Maps.MapTypeId.canvasDark]
        });
        infoBox = new window.Microsoft.Maps.Infobox(map.getCenter(), {
            visible: false
        });
        infoBox.setMap(map);
        window.Microsoft.Maps.Events.addHandler(map, "click", function(e) {
            if (infoBox.getOptions().visible && e.targetType == "map") {
                infoBox.setOptions({ 
                    visible: false
                });
            }
        });
    },
    getMap: function(){        
        return map;
    },
    getCenter: function() {
        return map.getCenter();
    },
    setView: function(type,lat,lon,zoom){
        map.setView({
            mapTypeId: type,
            center: new window.Microsoft.Maps.Location(lat,lon),
            zoom: zoom
        });
    },
    setLocationsView: function(locations, padding){
        let rect = new window.Microsoft.Maps.LocationRect.fromLocations(locations);
        map.setView({ bounds: rect, padding });
    },
    reverseGeocoordsFromZip:function(zipcode, cb, errorCb) {
        window.Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
            var searchManager = new window.Microsoft.Maps.Search.SearchManager(map);
            var requestOptions = {
                bounds: map.getBounds(),
                where: zipcode,
                callback: function (answer, userData) {
                    cb(answer.results[0].location)
                },
                errorCallback: function(options) {
                    errorCb();
                }
            }
            searchManager.geocode(requestOptions)
        })
    },
    reverseGeocoordsFromAddress:function(address,cb, errorCb) { // Get lat, lon
        window.Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
            var searchManager = new window.Microsoft.Maps.Search.SearchManager(map);
            var requestOptions = {
                bounds: map.getBounds(),
                where: address,
                callback: function (answer, userData) {
                    cb(answer.results[0].location)
                },
                errorCallback: function(options) {
                    errorCb()
                }
            }
            searchManager.geocode(requestOptions)
        })
    },
    reverseAddress:function(lat, lon, cb) { // Get address
        window.Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
            var searchManager = new window.Microsoft.Maps.Search.SearchManager(map);
            var reverseGeocodeRequestOptions = {
                location: new window.Microsoft.Maps.Location(lat,lon),
                callback: function (answer, userData) {
                    cb(answer.address.formattedAddress)
                }
            }
            searchManager.reverseGeocode(reverseGeocodeRequestOptions);
        })
    },
    drawPinByAddress:function(address) { // Draw the pin
        window.Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
            var searchManager = new window.Microsoft.Maps.Search.SearchManager(map);
            var requestOptions = {
                bounds: map.getBounds(),
                where: address,
                callback: function (answer, userData) {
                    map.setView({ bounds: answer.results[0].bestView });
                    map.entities.push(new window.Microsoft.Maps.Pushpin(answer.results[0].location));
                }
            }
            searchManager.geocode(requestOptions)
        })
    },
    drawThePinByGeocoords:function(lat, lon, message) { // Draw the pin
        window.Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
            var searchManager = new window.Microsoft.Maps.Search.SearchManager(map);
            var reverseGeocodeRequestOptions = {
                location: new window.Microsoft.Maps.Location(lat,lon),
                callback: function (answer, userData) {
                    var pushpin = new window.Microsoft.Maps.Pushpin(reverseGeocodeRequestOptions.location,{
                        enableHoverStyle: true, 
                        enableClickedStyle: true                
                    });
                    pushpin.metadata = message;
                    window.Microsoft.Maps.Events.addHandler(pushpin, 'click', function (e) {
                        infoBox.setOptions({ 
                            location: e.target.getLocation(),
                            visible: true,
                            htmlContent: getHtmlString(e.target.metadata)
                        });
                    });
                    map.entities.push(pushpin)
                }
            }
            searchManager.reverseGeocode(reverseGeocodeRequestOptions);
        })
    },
    drawThePinByAddress:function(address, message) { // Draw the pin
        window.Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
            var searchManager = new window.Microsoft.Maps.Search.SearchManager(map);
            var requestOptions = {
                bounds: map.getBounds(),
                where: address,
                callback: function (answer, userData) {
                    var pushpin = new window.Microsoft.Maps.Pushpin(answer.results[0].location,{
                        enableHoverStyle: true, 
                        enableClickedStyle: true,
                        //icon: 'https://www.bingmapsportal.com/Content/images/poi_custom.png', //TODO: design with categorial icon
                        //text: 'A', //message.title (initial)
                        //textOffset: new window.Microsoft.Maps.Point(0, 5)
                        //color: 'red' //message.type                        
                    });
                    pins.push(pushpin);
                    var infobox = new window.Microsoft.Maps.Infobox(answer.results[0].location, { 
                        title: JSON.parse(message).title, 
                        description: JSON.parse(message).description, 
                        visible: false 
                    });
                    infobox.setMap(map);
                    window.Microsoft.Maps.Events.addHandler(pushpin, 'click', function (args) {
                        infobox.setOptions({ visible: !infobox.getOptions.visible });
                        //map.setView({ center: args.target.getLocation(), zoom: 14 });
                    });
                    map.entities.push(pushpin);
                }
            }
            searchManager.geocode(requestOptions)
        })
    },
    showCluster:function(){
        window.Microsoft.Maps.loadModule('Microsoft.Maps.Clustering', function () {
            //Generate 3000 random pushpins in the map view.
            //pins = window.Microsoft.Maps.TestDataGenerator.getPushpins(3000, map.getBounds()); 
            //Create a ClusterLayer with options and add it to the map.
            var clusterLayer = new window.Microsoft.Maps.ClusterLayer(pins, {
                clusteredPinCallback: createCustomClusteredPin,
                gridSize: 80
            });
            layer.push(clusterLayer);
            map.layers.insert(clusterLayer);
        });
    },
    showDrawingManager:function(){
        window.Microsoft.Maps.loadModule('Microsoft.Maps.DrawingTools', function () {
            //Generate 3000 random pushpins in the map view.
            //pins = window.Microsoft.Maps.TestDataGenerator.getPushpins(3000, map.getBounds()); 
            //Create a ClusterLayer with options and add it to the map.
            var tools = new window.Microsoft.Maps.DrawingTools(map);
            tools.showDrawingManager(function (manager) {
                console.log('Drawing manager loaded.');
                window.Microsoft.Maps.Events.addHandler(manager, 'drawingStarted', function () { console.log('Drawing started.'); });
                window.Microsoft.Maps.Events.addHandler(manager, 'drawingEnded', function () { console.log('Drawing ended.'); });
                window.Microsoft.Maps.Events.addHandler(manager, 'drawingErased', function () { console.log('Drawing erased.'); });
            });
        });
    }
};

module.exports = BingMap;
},{"../js/infoBox":3}],6:[function(require,module,exports){
const mapUtilities = require("./mapUtilities");

function getLocation() {
    // first check if the map gas the coords
    if (mapUtilities.getMap()) {
        return mapUtilities.getCenter();
    }
    // if not then get from browser
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            return position;
        });
    }
}

const searchButton = document.getElementById("search-button");
const searchField = document.getElementById("search-field");
if (searchButton) {
    searchButton.addEventListener("click", () => {
        const location = getLocation();
        const term = searchField.value;
        const longitude = location.longitude;
        const latitude = location.latitude;
        window.location.href=`/searchResults?term=${term}&lat=${latitude}&lon=${longitude}`;
    });
}

if (searchField) {
    searchField.addEventListener("keyup", function(event) {
        if (event.code === 'Enter') {
            event.preventDefault();
            searchButton.click();
        }
    });
}
},{"./mapUtilities":5}]},{},[4]);
