module.exports = {
  calculateGlobalCanvasDimensions: function (session) {
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
  },

  calculateGlobalOffsetFromInitialAnchor: function (x, y, session, phoneID) {
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
  },
};
