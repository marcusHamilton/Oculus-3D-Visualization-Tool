var express = require('express');
var router = express.Router();

/* GET localLoad page. */
router.get('/', function(req, res, next) {
  res.render('localLoad');
});

module.exports = router;
