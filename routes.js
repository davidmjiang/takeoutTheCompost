var express = require('express'),
  router = express.Router(),
  conf = require('./config'),
  basicAuth = require('basic-auth'),
  helpers = require('./public/js/helpers');

router.use(function (req, res, next) {
  console.log(req.method + ' ' + req.path)
  next()
})

var auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.send(401);
  }

  var user = basicAuth(req);
  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  }

  if (user.name === conf.admin.username && user.pass === conf.admin.password) {
    return next();
  } else {
    return unauthorized(res);
  }
}

router.get('/', function (req,res) {
  res.render('pages/index', {mapKey: conf.bingKey, helpers: helpers, title:"Takeout the compost", image: "img/mask-logo.svg"});
})

router.get('/about', function (req, res) { 
  res.render('pages/about')
})


router.post('/auth', function (req, res) { //todo basic authentication <> backend
  let user = '';
  user = req.body.user;
  if (!user || !user.name || !user.pass) {
    res.send(401)
  }
  if (user.name === conf.admin.username && user.pass === conf.admin.password) {
    res.send(200)
  } else {
    res.send(401)
  }
})

module.exports = router