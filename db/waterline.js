var postgresAdapter = require('sails-redis');
var Waterline = require('waterline');
var models = require('./models');
var sailsRedisAdapter = require('sails-redis');

var waterline = new Waterline();

// Redis config
var config = {
  adapters: {
    'redis': sailsRedisAdapter,
  },
  connections: {
    default: {
      adapter: 'redis',
    }
  }
};

// Load all collections registered in models.js
Object.keys(models).forEach(function (model) {
  waterline.loadCollection(models[model]);
});

module.exports = {client: waterline, config: config};
