const getHtmlString = require("../js/infoBox");
const ratings = require("../js/Ratings");

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

function createCustomPushpin(review)
{
    var c1 = ratings.ratingColors[review.containers];
    var c2 = ratings.ratingColors[review.bags];
    var c3 = ratings.ratingColors[review.cups];
    var c4 = ratings.ratingColors[review.utensils];
    var radius = 12;
    var svg = ['<svg xmlns="http://www.w3.org/2000/svg" width="', (radius * 2), '" height="', (radius * 2), '">',
        '<circle cx="', radius, '" cy="', radius, '" r="', radius, '" fill="', c1,'"/>',
        '<circle cx="', radius, '" cy="', radius, '" r="', 8, '" fill="', c2, '"/>',
        '<circle cx="', radius, '" cy="', radius, '" r="', 5, '" fill="', c3, '"/>',
        '<circle cx="', radius, '" cy="', radius, '" r="', 2, '" fill="', c4, '"/>',
        '</svg>'];
    return svg.join('');
}

const BingMap = {
    init: function(){
        map = new window.Microsoft.Maps.Map(document.getElementById('ReviewsMap'), { 
            supportedMapTypes: [window.Microsoft.Maps.MapTypeId.grayscale, window.Microsoft.Maps.MapTypeId.canvasDark]
        });
        infoBox = new window.Microsoft.Maps.Infobox(map.getCenter(), {
            visible: false
        });
        infoBox.setMap(map);
        window.Microsoft.Maps.Events.addHandler(map, "click", function(e) {
            // hide any popovers
            var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
            popoverTriggerList.forEach((popover) => {
                bootstrap.Popover.getInstance(popover).hide();
            });
            // close any infoboxes
            if (infoBox.getOptions().visible && e.targetType == "map") {
                infoBox.setOptions({ 
                    visible: false
                });
            }
        });
    },
    showEmptyInfobox: function() {
        infoBox.setOptions({
            location: this.getCenter(),
            visible: true,
            description: "No results in your area. Search for a restaurant to add your review!"
        });
    },
    getMap: function(){        
        return map;
    },
    getCenter: function() {
        return map.getCenter();
    },
    getPins: function() {
        return map.entities;
    },
    addThrottledHandler: function(eventName, listener, interval) {
        window.Microsoft.Maps.Events.addThrottledHandler(map, eventName, listener, interval);
    },
    getBounds: function() {
        return map.getBounds();
    },
    clear: function() {
        map.entities.clear();
    },
    setView: function(lat,lon){
        map.setView({
            center: new window.Microsoft.Maps.Location(lat,lon),
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
    displayInfobox:function(e, zoomIn) {
        e = e.target ? e.target : e;
        let location = e.getLocation();
        infoBox.setOptions({
            location: location,
            visible: true,
            htmlContent: getHtmlString(e.metadata)
        });
        // make sure the whole box is shown
        let buffer = 30;
        let infoboxAnchor = infoBox.getAnchor();
        var infoboxLocation = map.tryLocationToPixel(e.getLocation(), window.Microsoft.Maps.PixelReference.control);
        var dx = infoboxLocation.x - infoboxAnchor.x;
        var dy = infoboxLocation.y - infoboxAnchor.y;

        if (dy < buffer) {
            dy *= -1;
            dy += buffer;
        } else {
            dy = 0;
        }
        if (dx < buffer) { //Check to see if overlapping with left side of map.
            //#### Offset in opposite direction.
            dx *= -1;
            //#### add a buffer from the left edge of the map.
            dx += buffer;
        } else { //Check to see if overlapping with right side of map.
            dx = map.getWidth() - infoboxLocation.x + infoboxAnchor.x - infoBox.getWidth();
            //#### If dx is greater than zero then it does not overlap.
            if (dx > buffer) {
                dx = 0;
            } else {
                //#### add a buffer from the right edge of the map.
                dx -= buffer;
            }
        }

        //#### Adjust the map so infobox is in view
        if (dx != 0 || dy != 0) {
            map.setView({
                centerOffset: new Microsoft.Maps.Point(dx, dy),
                center: map.getCenter()
            });
        }
    },
    drawThePinByGeocoords:function(lat, lon, message, highlightPin = false) { // Draw the pin
        window.Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
            var searchManager = new window.Microsoft.Maps.Search.SearchManager(map);
            var reverseGeocodeRequestOptions = {
                location: new window.Microsoft.Maps.Location(lat,lon),
                callback: function (answer, userData) {
                    var pushpin = new window.Microsoft.Maps.Pushpin(reverseGeocodeRequestOptions.location,{
                        enableHoverStyle: true, 
                        enableClickedStyle: true,
                        icon: createCustomPushpin(message)            
                    });
                    pushpin.metadata = message;
                    window.Microsoft.Maps.Events.addHandler(pushpin, 'click', BingMap.displayInfobox);
                    map.entities.push(pushpin);
                    if (highlightPin) {
                        BingMap.displayInfobox(pushpin, true);
                    }  
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