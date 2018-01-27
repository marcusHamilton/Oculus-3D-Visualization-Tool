var express = require('express');
var router = express.Router();

/* GET VR page */
router.get('/', function(req, res, next) {
    res.render('VRWorld');
});

module.exports = router;