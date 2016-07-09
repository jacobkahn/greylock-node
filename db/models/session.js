var Waterline = require('Waterline');

var Session = Waterline.Collection.extend({
  identity: 'session',
  connection: 'default',

  attributes: {
    id: {
      type: 'int',
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },

    devices: {
      collection: 'device',
    },
  }
});

module.exports = Session;
