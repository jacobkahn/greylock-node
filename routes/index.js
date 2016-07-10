var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/page/:session_id/:phone_id', function(req, res, next) {
  var sessionID = req.params.session_id;
  var phoneID = req.params.phone_id;
  client.get('session-' + sessionID, function (err, result) {
    var session = JSON.parse(result);
    res.render('index', {
      title: 'Express',
      phone_id: phoneID,
      session_id: sessionID,
      isFirst: String(session['sortedDeviceIDs'][0] == phoneID),
	});
  });
});

module.exports = router;
