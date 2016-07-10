var client = require('./db/db');
var hat = require('hat');

var topLeft = hat();
var topRight = hat();
var bottomLeft = hat();
var bottomRight = hat();

var seedData = {
	devices: {
		[topLeft]: {
			deviceID: topLeft,
			neighbors: {
				right: topRight,
				down: bottomLeft,
			},
			calibrationTimestamp: '1',
			screenHeight: "375.000000",
			screenWidth: '667.000000',
			virtualVerticalOffset: 0,
	        virtualHorizontalOffset: 0,
		},
		[topRight]: {
			deviceID: topRight,
			neighbors: {
				left: topLeft,
				down: bottomRight,
			},
			calibrationTimestamp: '2',
			screenHeight: "375.000000",
			screenWidth: '667.000000',
			virtualVerticalOffset: 0,
	        virtualHorizontalOffset: 667,
		},
		[bottomLeft]: {
			deviceID: topLeft,
			neighbors: {
				up: topLeft,
				right: bottomRight,
			},
			calibrationTimestamp: '3',
			screenHeight: "375.000000",
			screenWidth: '667.000000',
			virtualVerticalOffset: 375,
	        virtualHorizontalOffset: 0,
		},
		[bottomRight]: {
			deviceID: topLeft,
			neighbors: {
				left: bottomLeft,
				up: topRight,
			},
			calibrationTimestamp: '4',
			screenHeight: "375.000000",
			screenWidth: '667.000000',
			virtualVerticalOffset: "375",
	        virtualHorizontalOffset: "667",
		}
	},
	sortedDeviceIDs: [
		topLeft, topRight, bottomLeft, bottomRight
	],
}

var sessionID = 2;

console.log('Now putting this into the \"db\":');
console.log(JSON.stringify(seedData));

client.set(sessionID, JSON.stringify(seedData), function (err, result) {
	if (err) {
		console.log(err);
	}
	console.log(topLeft, topRight, bottomLeft, bottomRight)
	console.log('http://54.174.96.55:3000/page/' + sessionID + '/' + topLeft);
	console.log('http://54.174.96.55:3000/page/' + sessionID + '/' + topRight);
	console.log('http://54.174.96.55:3000/page/' + sessionID + '/' + bottomLeft);
	console.log('http://54.174.96.55:3000/page/' + sessionID + '/' + bottomRight);
})