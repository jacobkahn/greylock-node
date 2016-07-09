var server = require('./bin/www');

server.listen(3000);

var io = require('socket.io')(server);

io.on('connection', function(socket) {
  console.log('new phone connected');
  socket.on('start', function(data) {
    // need to check for the ROOM id or whatever here
  });

  socket.on('item_move', function(data) {
    // item has moved on the page 
    console.log(data.anchor);
    // calculate new_data
    // socket.broadcast.emit('item_draw', new_data);
  });
});
