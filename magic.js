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
        // Check to see if everyone else has completed
        var allClientsFinished = true;
        Object.keys(session['devices']).forEach(function (device) {
          if (session['devices'][device]['youtubeClientLoaded'] != 'true') {
            allClientsFinished = false;
          }
        });
        if (allClientsFinished) {
          io.sockets.emit('play_video', {});
        }
      });
    });
  });

  socket.on('video_pause', function (data) {
    socket.broadcast.emit('video_pause', {});
  });

  socket.on('video_play', function (data) {
    socket.broadcast.emit('video_play', {});
  });

  socket.on('video_buffering', function (data) {
    socket.broadcast.emit('wait_on_video', {});
  });

  socket.on('video_safe', function (data) {
    io.sockets.emit('play_video', {});
  });

  socket.on('bird_click', function (data) {
    socket.broadcast.emit('bird_click', {is_replay: data.is_replay});
  });

  socket.on('death', function () {
    socket.broadcast.emit('death', {});
  });

  socket.on('flip', function (data) {
    var sessionID = data.session_id;
    var deviceID = data.phone_id;
    var orientation = data.orientation;
    client.get('session-' + sessionID, function (err, result) {
      var session = JSON.parse(result);
      var sHeight = session['devices'][deviceID]['screenHeight'];
      session['devices'][deviceID]['screenHeight'] = session['devices'][deviceID]['screenWidth'];
      session['devices'][deviceID]['screenWidth'] = sHeight;
      session['devices'][deviceID]['orientation'] = orientation;
      session = utils.calculateGlobalOffsets(session);
      console.log('writing flip value', JSON.stringify(session));
      client.set('session-' + sessionID, JSON.stringify(session), function (err, newResult) {
        io.sockets.emit('reload', {
          reload: 'true'
        });
      });
    });
  });

});
