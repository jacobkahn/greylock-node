function getSubImage (anchorx, anchory, image_sizex, image_sizey, phone_sizex, phone_sizey) {
	if (anchory >= phone_sizey || anchorx >= phone_sizex) {
		return null;
	} else if (anchorx < -image_sizex || anchory < -image_sizey) {
		return null;
	} else {
		// part of the image is in this phone's display space
		var top = Math.abs(Math.min(0, anchory));
		var left = Math.abs(Math.min(0, anchorx));
		if (anchory + image_sizey < phone_sizey) {
			var bottom = image_sizey;
		} else {
			var bottom = phone_sizey - anchory;
		}
		if (anchorx + image_sizex < phone_sizex) {
			var right = image_sizex;
		} else {
			var right = phone_sizex - anchorx;
		}
		// top left, top right, bottom left, bottom right image coordinates to display
		return [[left, top], [right, top], [left, bottom], [right, bottom]];
	}
}


function getSubPhoneDisplay (anchorx, anchory, image_sizex, image_sizey, phone_sizex, phone_sizey) {
	var subimage = getSubImage(anchorx, anchory, image_sizex, image_sizey, phone_sizex, phone_sizey);
	if (subimage == null) {
		return null;
	} else {
		// part of the image is in this phone's display space
		var phone_top = Math.abs(Math.max(0, anchory));
		var phone_left = Math.abs(Math.max(0, anchorx));
		// top left, top right, bottom left, bottom right image coordinates to display
		var top_left = [phone_left, phone_top];
		var dx = subimage[1][0] - subimage[0][0];
		var top_right = [phone_left + dx, phone_top];
		var dy = subimage[2][1] - subimage[0][1];
		var bot_right = [phone_left + dx, phone_top + dy];
		var bot_left = [phone_left, phone_top + dy];
		return [top_left, top_right, bot_left, bot_right];
	}
}

function getAnchorDisplacement (anchorx, anchory, lst) {
	/**
	Takes in the current global coordinates of anchor and a list of phones, and outputs the position of the phone relative to the anchor
	*/
	var newlst = [];
	for (var j = 0; j < lst.length; j++){
  		curphone = lst[j];
  		newlst.push(globalToPhone(anchorx, anchory, curphone));
	}
	return newlst;
}

function phoneToGlobal(pointx, pointy, phone) {
	/**
	Takes in a point in a phone's coordinate frame, and transforms it into global frame.
	*/
	return [pointx + phone["corner"]["x"], pointy + phone["corner"]["y"]];

}

function globalToPhone(pointx, pointy, phone) {
	/**
	Takes in a point in global frame, and transforms it into a phone's frame.
	*/
	return [pointx - phone["corner"]["x"], pointy - phone["corner"]["y"]];
}

function translateGlobal(translationx, translationy, phonelst) {
	/** 
	Translates the global frame itself (equivalent to scrolling). Note: anchor point also needs to be translated separately.
	*/
	var newlst = [];
	for (var j = 0; j < lst.length; j++){
  		curphone = lst[j];
  		newpt = [phone["corner"]["x"], phone["corner"]["y"]];
  		newpt[0] += translationx;
  		newpt[1] += translationy;
  		newlst.push(newpt);
	}
	return newlst;
}

function translatePoint(translatex, translatey, pointx, pointy) {
	return [translatex + pointx, translatey + pointy];
}

function scale(factor, lst, phone, center_of_zoom) {
	/** 
	Takes in a list of phones, rescales the top corner when zoom input is detected
	*/
	return null;
}

// random test code
anchorx = 1000
anchory = 1000
image_sizex = 1920
image_sizey = 1080
phone_sizex = 1920
phone_sizey = 1080

console.log(getSubPhoneDisplay(anchorx, anchory, image_sizex, image_sizey, phone_sizex, phone_sizey))
console.log(getSubImage(anchorx, anchory, image_sizex, image_sizey, phone_sizex, phone_sizey))

