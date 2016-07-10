var server = require('./bin/www');
var client = require('./db/db');
var utils = require('./utils');

server.listen(3000);

var io = require('socket.io')(server);

io.on('connection', function(socket) {
  socket.on('start', function(data) {
    // need to check for the ROOM id or whatever here
  });

  socket.on('item_move', function(data) {
    // item has moved on the page 
    // calculate new_data
    var sessionID = data.session_id;
    client.get('session-' + sessionID, function (err, result) {
      var session = JSON.parse(result);

      var positioning = utils.calculateGlobalOffsetFromInitialAnchor(Number(data.anchor.x), Number(data.anchor.y), session, data.phone_id);
      var globalHorizontalOffset = positioning['globalHorizontalOffset'];
      var globalVerticalOffset = positioning['globalVerticalOffset'];
      var responseObj = {};
      Object.keys(session['devices']).forEach(function (deviceID) {
        responseObj[deviceID] = {
          anchor: {
            y: globalVerticalOffset - session['devices'][deviceID]['virtualVerticalOffset'],
            x: globalHorizontalOffset - session['devices'][deviceID]['virtualHorizontalOffset'],
          }
        };
      });
      socket.broadcast.emit('item_draw', responseObj);
    });
  });

  socket.on('video_ready', function (data) {
    var deviceID = data.phone_id;
      var sessionID = data.session_id;
      client.get('session-' + sessionID, function (err, result) {
        var session = JSON.parse(result);
        session['devices'][deviceID]['youtubeClientLoaded'] = 'true';
        client.set('session-' + sessionID, JSON.stringify(session), function (err, newResult) {
          var newSession = JSON.parse(newResult);
          // Check to see if everyone else has completed
          var allClientsFinished = true;
          Object.keys(session['devices']).forEach(function (device) {
            if (!session['devices'][device].hasOwnProperty('youtubeClientLoaded')) {
              allClientsFinished = false;
            }
          });
          if (allClientsFinished) {
            socket.broadcast.emit('item_draw', responseObj);
          }
      });
    });
  });
});
