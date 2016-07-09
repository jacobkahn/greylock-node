var express = require('express');
var hat = require('hat');
var Device = require('../db/models').device;

var router = express.Router();

router.get('/initialize', function (req, res, next) {
	var deviceID = hat();
	req.models.device.create({
		deviceID: deviceID,
	}).then(function (device) {
		res.send({
			phone_id: device.deviceID,
			status: 'success',
		});
	}).catch(function (err) {
		res.send({
			phone_id: -1,
			status: 'failure',
		});
	});
});

router.post('/create_session', function (req, res, next) {
	req.models.device.findOne()
		.where({
			deviceID: req.body.phone_id,
		}).then(function (device) {
			req.models.session.create({
				devices: [device.deviceID]
			}).then(function (session) {
				res.send({
					session_id: session.id,
					status: 'success',
				});
			}).catch(function (err) {
				console.log(err);
				res.send({
					session_id: -1,
					status: 'failure',
				});
			});
		});
});

module.exports = router;