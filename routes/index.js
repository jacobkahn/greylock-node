var express = require('express');
var router = express.Router();
var client = require('../db/db');
var utils = require('../utils');

/* GET home page. */
router.get('/page/:session_id/:phone_id', function(req, res, next) {
  var sessionID = req.params.session_id;
  var phoneID = req.params.phone_id;
  client.get('session-' + sessionID, function (err, result) {
    var session = JSON.parse(result);

    var positioning = utils.calculateGlobalOffsetFromInitialAnchor(0, 0, session, phoneID);
    var globalHorizontalOffset = positioning['globalHorizontalOffset'] * -1;
    var globalVerticalOffset = positioning['globalVerticalOffset'] * -1;

    res.render('index', {
      title: 'Express',
      phone_id: phoneID,
      session_id: sessionID,
      anchor: {
        x: globalHorizontalOffset,
        y: globalVerticalOffset,
      },
	});
  });
});

module.exports = router;
