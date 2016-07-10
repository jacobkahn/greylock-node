var express = require('express');
var router = express.Router();
var client = require('../db/db');
var utils = require('../utils');

/* GET home page. */
router.get('/page/:session_id/:phone_id', function(req, res, next) {
  var sessionID = req.params.session_id;
  var phoneID = req.params.phone_id;
  client.get('session-' + sessionID, function(err, result) {
    var session = JSON.parse(result);

    var positioning = utils.calculateGlobalOffsetFromInitialAnchor(0, 0, session, phoneID);
    var globalHorizontalOffset = positioning['globalHorizontalOffset'] * -1;
    var globalVerticalOffset = positioning['globalVerticalOffset'] * -1;
    var orientation = 'null';
    if (session['devices'][phoneID].hasOwnProperty('orientation')) {
      orientation = session['devices'][phoneID]['orientation'];
    }

    res.render('index', {
      title: 'images',
      phone_id: phoneID,
      session_id: sessionID,
      anchor: {
        x: globalHorizontalOffset,
        y: globalVerticalOffset,
      },
      orientation: orientation,
    });
  });
});

/* GET youtube page. */
router.get('/youtube/:session_id/:phone_id', function(req, res, next) {
  var sessionID = req.params.session_id;
  var phoneID = req.params.phone_id;
  client.get('session-' + sessionID, function(err, result) {
    var session = JSON.parse(result);

    var positioning = utils.calculateGlobalOffsetFromInitialAnchor(0, 0, session, phoneID);
    var globalHorizontalOffset = positioning['globalHorizontalOffset'] * -1;
    var globalVerticalOffset = positioning['globalVerticalOffset'] * -1;

    var globalCanvasDimensions = utils.calculateGlobalCanvasDimensions(session);

    res.render('youtube', {
      title: 'youtube',
      phone_id: phoneID,
      session_id: sessionID,
      anchor: {
        x: globalHorizontalOffset,
        y: globalVerticalOffset,
      },
      global_width: globalCanvasDimensions['horizontal'],
      global_height: globalCanvasDimensions['vertical']
    });
  });
});

router.get('/bird/:session_id/:phone_id', function (req, res, next) {
  var sessionID = req.params.session_id;
  var phoneID = req.params.phone_id;
  client.get('session-' + sessionID, function(err, result) {
    var session = JSON.parse(result);
    var positioning = utils.calculateGlobalOffsetFromInitialAnchor(0, 0, session, phoneID);
    var globalHorizontalOffset = positioning['globalHorizontalOffset'] * -1;
    var globalVerticalOffset = positioning['globalVerticalOffset'] * -1;

    var globalCanvasDimensions = utils.calculateGlobalCanvasDimensions(session);

    res.render('bird', {
      phone_id: phoneID,
      session_id: sessionID,
      anchor: {
        x: globalHorizontalOffset,
        y: globalVerticalOffset,
      },
      global_width: globalCanvasDimensions['horizontal'],
      global_height: globalCanvasDimensions['vertical']
    });
  });
});

module.exports = router;