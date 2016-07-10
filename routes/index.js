var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:session_id/:phone_id', function(req, res, next) {
  res.render('index', {
  	title: 'Express',
  	phone_id: req.params.phone_id,
  	session_id: req.params.session_id
  });
});

module.exports = router;
