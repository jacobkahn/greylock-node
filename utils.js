
var calculateGlobalCanvasDimensions = function (session) {
	var firstPhoneID = session['sortedDeviceIDs'][0];
	var globalVerticalOffset = session['devices'][firstPhoneID]['screenHeight'];
	var globalHorizontalOffset = session['devices'][firstPhoneID]['screenWidth'];
	var phoneBelow = session['devices'][firstPhoneID]['neighbors']['down'];
	while (phoneBelow) {
	  globalVerticalOffset += Number(session['devices'][phoneBelow]['screenHeight']);
	  phoneBelow = session['devices'][phoneBelow]['neighbors']['down'];
	}
	var phoneRight = session['devices'][firstPhoneID]['neighbors']['right'];
	while (phoneRight) {
	  globalHorizontalOffset += Number(session['devices'][phoneRight]['screenWidth']);
	  phoneRight = session['devices'][phoneRight]['neighbors']['down'];
	}
	return {
		horizontal: globalHorizontalOffset,
		vertical: globalVerticalOffset,
	};
}

var calculateGlobalOffsetFromInitialAnchor = function (x, y, session, phoneID) {
	var globalVerticalOffset = y;
	var globalHorizontalOffset = x;
	var phoneAbove = session['devices'][phoneID]['neighbors']['up'];
	while (phoneAbove) {
	  globalVerticalOffset += Number(session['devices'][phoneAbove]['screenHeight']);
	  phoneAbove = session['devices'][phoneAbove]['neighbors']['up'];
	}
	var phoneLeft = session['devices'][phoneID]['neighbors']['left'];
	while (phoneLeft) {
	  globalHorizontalOffset += Number(session['devices'][phoneLeft]['screenWidth']);
	  phoneLeft = session['devices'][phoneLeft]['neighbors']['left'];
	}
	return {globalVerticalOffset: globalVerticalOffset, globalHorizontalOffset: globalHorizontalOffset};
}

function scale(factor, centerx, centery, pointx, pointy) {
	/** 
	Zoom helper function.
	*/
	return [(pointx - centerx) * factor + centerx, (pointy - centery) * factor + centery];
}

function rotate(theta, centerx, centery, pointx, pointy) {
	/**
	Rotates a vector from center to point around center clockwise by theta (in degrees).
	*/
	dx = pointx - centerx
	dy = pointy - centery
	rad = theta * Math.PI / 180.0
	sine = Math.sin(rad)
	cosine = Math.cos(rad)
	return [dx * cosine - dy * sine + centerx, dx * sine + dy * cosine + centery]
}

module.exports = {
	calculateGlobalOffsetFromInitialAnchor: calculateGlobalOffsetFromInitialAnchor,
	calculateGlobalCanvasDimensions: calculateGlobalCanvasDimensions,
};
