var express = require('express');
var router = express.Router();
var client = require('../db/db');

/* GET home page. */
router.get('/page/:session_id/:phone_id', function(req, res, next) {
  var sessionID = req.params.session_id;
  var phoneID = req.params.phone_id;
  client.get('session-' + sessionID, function (err, result) {
    var session = JSON.parse(result);
    console.log('first_phone_id', session['sortedDeviceIDs'][0]);
    console.log('phoneID', phoneID);
    console.log(String(session['sortedDeviceIDs'][0] == phoneID));
    res.render('index', {
      title: 'Express',
      phone_id: phoneID,
      session_id: sessionID,
      isFirst: session['sortedDeviceIDs'][0] == phoneID,
	});
  });
});

module.exports = router;
