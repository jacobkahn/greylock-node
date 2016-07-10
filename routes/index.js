var express = require('express');
var router = express.Router();
var client = require('../db/db');
var utils = require('./utils');

/* GET home page. */
router.get('/page/:session_id/:phone_id', function(req, res, next) {
  var sessionID = req.params.session_id;
  var phoneID = req.params.phone_id;
  client.get('session-' + sessionID, function (err, result) {
    var session = JSON.parse(result);
    console.log('first_phone_id', session['sortedDeviceIDs'][0]);
    console.log('phoneID', phoneID);
    console.log(String(session['sortedDeviceIDs'][0] == phoneID));

    var positioning = calculateGlobalOffsetFromInitialAnchor(0, 0, session);
    var globalHorizontalOffset = positioning['globalHorizontalOffset'];
    var globalVerticalOffset = position['globalVerticalOffset'];
    console.log('rendering a new page with offsets', globalHorizontalOffset, globalVerticalOffset);

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
