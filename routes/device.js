var express = require('express');
var hat = require('hat');

var router = express.Router();

router.get('initialize', function (req, res, next) {
	res.send({
		phone_id: hat(),
		status: 'success',
	});
});

module.exports = router;