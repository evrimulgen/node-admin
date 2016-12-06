var express = require('express');
var router = express.Router();

var auth = require('../auth/credentials.json');

// Login view
router.get('/', function (req, res) {

  if(req.session && req.session.user == auth.username && req.session.admin){

    return res.redirect('/');

  }

  res.render('login');

});

// Login endpoint
router.post('/', function (req, res) {

  if(req.body.username == auth.username || req.body.password == auth.password) {

    req.session.user = auth.username;
    req.session.admin = true;

    return res.redirect('/');

  }

  res.redirect('/login?error=bad_credentials'); // or other errors

});

module.exports = router;
