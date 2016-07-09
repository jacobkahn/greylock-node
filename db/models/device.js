var Waterline = require('waterline');

var Device = Waterline.Collection.extend({
  identity: 'device',
  connection: 'default',

  attributes: {
    deviceID: {
      type: 'string',
      primaryKey: true,
      unique: true,
    },
  }
});

module.exports = Device;
