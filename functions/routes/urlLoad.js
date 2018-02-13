var express = require('express');
var router = express.Router();

/* GET urlLoad page */
router.get('/', function(req, res, next) {
  res.render('urlLoad');
});

module.exports = router;
