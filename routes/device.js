var express = require('express');
var hat = require('hat');
var client = require('../db/db');

var router = express.Router();

router.get('/initialize', function (req, res, next) {
  var deviceID = hat();
  res.send({
    phone_id: deviceID,
    status: 'success',
  });
});

router.post('/create_session', function (req, res, next) {
  var deviceID = req.body.phone_id;
  var deviceCount = req.body.count;

  client.get('session_counter', function (err, count) {
    var sessionID = count + 1;

    var sessionData = {
      count: deviceCount,
      devices: [deviceID],
    };
    client.set('session-' + sessionID, JSON.stringify(sessionData), function (err, result) {
      client.set('session_counter', sessionID, function (err, result) {
        res.send({
          session_id: sessionID,
          status: 'success',
        });
      });
    });

  });
});

router.post('/register_session', function (req, res, next) {
  var sessionID = req.body.session_id;
  var deviceID = req.body.phone_id;

  client.get('session-' + sessionID, function (err, result) {
    var session = JSON.parse(result);
    session['devices'].push(deviceID);
    client.set('session-' + sessionID, JSON.stringify(session), function (err, result) {
      res.send({
        count: session.count,
        status: 'success',
      });
    });
  });
});

// router.post('/calibrate', function (req, res, next) {
//   var sessionID = req.body.session_id;
//   var deviceID = req.body.phone_id;
//   var timestamp = req.body.timestamp;

//   client.get('session-' + sessionID, function (err, result) {
//     var session = JSON.parse(result);
//     // two phone configuration first
//     if (session['devices'].length === 0) {
//       session['calibrationData'] = [];
//       session['calibrationData'].push({
//         timestamp: 
//       });
//     }
//     client.set('session-' + sessionID, JSON.stringify(session), function (err, result) {
//       res.send({
//         count: session.count,
//         status: 'success',
//       });

//   });
// });

module.exports = router;