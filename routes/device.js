var express = require('express');
var hat = require('hat');
var client = require('../db/db');
var moment = require('moment');

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
    var sessionID = Number(count) + 1;

    var session = {
      count: deviceCount,
      devices: {
        [deviceID]: {
          deviceID: deviceID,
          neighbors: {},
        },
      },
    };
    client.set('session-' + sessionID, JSON.stringify(session), function (err, result) {
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
    session['devices'][deviceID] = {
      deviceID: deviceID,
      neighbors: {},
    };
    client.set('session-' + sessionID, JSON.stringify(session), function (err, result) {
      res.send({
        session_id: sessionID,
        status: 'success',
      });
    });
  });
});

var generateSortedDeviceIDs = function (session) {
  var deviceIDs = Object.keys(session['devices']);
  deviceIDs.sort(function (a, b) {
    aDate = moment(session['devices'][a]['calibrationTimestamp'], 'x');
    bDate = moment(session['devices'][b]['calibrationTimestamp'], 'x');
    return aDate.isAfter(bDate) ? -1 : 1;
  });
  return deviceIDs;
};

var generatePhonePointers = function (session) {
  var sortedDeviceIDs = generateSortedDeviceIDs(session);
  if (Number(session['count']) === 1) {

  } else if (Number(session['count']) === 2) {
    session['devices'][sortedDeviceIDs[0]]['neighbors'] = {
      right: sortedDeviceIDs[1],
    };
    session['devices'][sortedDeviceIDs[1]]['neighbors'] = {
      left: sortedDeviceIDs[0],
    };
  } else if (Number(session['count']) === 4) {
  	session['devices'][sortedDeviceIDs[0]]['neighbors'] = {
      right: sortedDeviceIDs[1],
      down: sortedDeviceIDs[2],
    };
    session['devices'][sortedDeviceIDs[1]]['neighbors'] = {
      left: sortedDeviceIDs[0],
      down: sortedDeviceIDs[3],
    };
    session['devices'][sortedDeviceIDs[2]]['neighbors'] = {
      up: sortedDeviceIDs[0],
      right: sortedDeviceIDs[3],
    };
    session['devices'][sortedDeviceIDs[3]]['neighbors'] = {
      left: sortedDeviceIDs[2],
      up: sortedDeviceIDs[1],
    };
  }
  return session;
};

var getNumberCalibrated = function (session) {
	var numberCalibrated = 0;
    Object.keys(session['devices']).forEach(function (key) {
      if (session['devices'][key].hasOwnProperty('calibrationTimestamp')) {
        numberCalibrated++;
      }
    });
	return numberCalibrated;
}

var calculateGlobalOffsets = function (session) {
	Object.keys(session['devices']).forEach(function (deviceID) {
	    var virtualVerticalOffset = 0;
	    var virtualHorizontalOffset = 0;
	    var phoneAbove = session['devices'][deviceID]['neighbors']['up'];
	    while (phoneAbove) {
	      virtualVerticalOffset += Number(session['devices'][phoneAbove]['screenHeight']);
	      phoneAbove = session['devices'][phoneAbove]['neighbors']['up'];
	    }
	    var phoneLeft = session['devices'][deviceID]['neighbors']['left'];
	    while (phoneLeft) {
	      virtualHorizontalOffset += Number(session['devices'][phoneLeft]['screenWidth']);
	      phoneLeft = session['devices'][phoneLeft]['neighbors']['left'];
	    }
	    session['devices'][deviceID]['virtualVerticalOffset'] = virtualVerticalOffset;
	    session['devices'][deviceID]['virtualHorizontalOffset'] = virtualHorizontalOffset;
	});
	return session;
}

router.post('/calibrate', function (req, res, next) {
  var sessionID = req.body.session_id;
  var deviceID = req.body.phone_id;
  var calibrationTimestamp = req.body.timestamp;
  var screenHeight = req.body.screen_height;
  var screenWidth = req.body.screen_width;

  client.get('session-' + sessionID, function (err, result) {
    var session = JSON.parse(result);
    session['devices'][deviceID]['calibrationTimestamp'] = calibrationTimestamp;
    session['devices'][deviceID]['screenHeight'] = screenHeight;
    session['devices'][deviceID]['screenWidth'] = screenWidth;


    var numberCalibrated = getNumberCalibrated(session);
    if (numberCalibrated === Number(session['count'])) {
      session = generatePhonePointers(session);
      session['sortedDeviceIDs'] = generateSortedDeviceIDs(session);
      session = calculateGlobalOffsets(session);
    }
    client.set('session-' + sessionID, JSON.stringify(session), function (err, result) {
      res.send({
        count: session.count,
        status: 'success',
      });
    });
  });
});

router.post('/calibrate/ready', function (req, res, next) {
  var sessionID = req.body.session_id;

  client.get('session-' + sessionID, function (err, result) {
    var session = JSON.parse(result);
    res.send({
    	calibration_ready: String(getNumberCalibrated(session) === Number(session['count'])),
    	status: 'success',
    });
  });
});

module.exports = router;