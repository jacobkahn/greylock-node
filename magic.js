var server = require('./bin/www');
var client = require('./db/db');
var utils = require('./utils');

server.listen(3000);

var io = require('socket.io')(server);

io.on('connection', function(socket) {
  console.log('new phone connected');
  socket.on('start', function(data) {
    // need to check for the ROOM id or whatever here
  });

  socket.on('item_move', function(data) {
    // item has moved on the page 
    // calculate new_data
    var sessionID = data.session_id;
    client.get('session-' + sessionID, function (err, result) {
      var session = JSON.parse(result);

      var globalVerticalOffset = Number(data.anchor.y);
      var globalHorizontalOffset = Number(data.anchor.x);
      console.log('Moving from, before calcs ', globalHorizontalOffset, globalVerticalOffset);
      var phoneAbove = session['devices'][data.phone_id]['neighbors']['up'];
      while (phoneAbove) {
        globalVerticalOffset += Number(session['devices'][phoneAbove]['screenHeight']);
        phoneAbove = session['devices'][phoneAbove]['neighbors']['up'];
      }
      var phoneLeft = session['devices'][data.phone_id]['neighbors']['left'];
      console.log(phoneLeft);
      while (phoneLeft) {
        console.log('found a phone to the left with offset called ', phoneLeft, Number(session['devices'][phoneLeft]['screenWidth']));
        globalHorizontalOffset += Number(session['devices'][phoneLeft]['screenWidth']);
        phoneLeft = session['devices'][phoneLeft]['neighbors']['left'];
      }
      console.log('Moving from ', globalHorizontalOffset, globalVerticalOffset);
      var responseObj = {};
      Object.keys(session['devices']).forEach(function (deviceID) {
        responseObj[deviceID] = {
          anchor: {
            y: globalVerticalOffset - session['devices'][data.phone_id]['virtualVerticalOffset'],
            x: globalHorizontalOffset - session['devices'][data.phone_id]['virtualHorizontalOffset'],
          }
        };
      });
      console.log(JSON.stringify(responseObj));
      socket.broadcast.emit('item_draw', responseObj);
    });
  });
});
