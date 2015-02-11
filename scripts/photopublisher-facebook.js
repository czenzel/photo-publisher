/*

	Photo Publisher by Christopher Zenzel
	Copyright 2014 Christopher Zenzel. All Rights Reserved.

	Please view the License file for information regarding licensing of the source
	code of these files on GitHub or Christopher's Research Pages.

 */

var selectedPhotos = Array();
var photosFeed = '';

var photoColumns = 2;
var photoMargin = 3;

function getPhotosFromAlbum(link) {
	$.getJSON(
		link,
		function (data) {
			getPhotosInfo(data);
		}
	);
}

function getPhotosInfo(data) {
	selectedPhotos = Array();
	photosFeed = data;

	var outputHtml = '';
	var photoIndex = 0;

	for (photoIndex = 0; photoIndex < photosFeed.data.length; photoIndex++) {
		var thumbnail = photosFeed.data[photoIndex].images[photosFeed.data[photoIndex].images.length - 1].source;
		outputHtml += '<a href="javascript:selectPhoto(' + photoIndex + ');"><img src="' + thumbnail + '" alt="Thumbnail Preview" id="spht_' + photoIndex + '" /></a>';
	}

	$("#photoPreviews").html(outputHtml);
}

function refreshSelectedPhotos() {
	var outputHtml = '';
	var outputImages = Array();

	for (var i = 0; i < selectedPhotos.length; i++) {

		var thumbnail = photosFeed.data[selectedPhotos[i]].images[photosFeed.data[selectedPhotos[i]].images.length - 1].source;
		var photoLink = photosFeed.data[selectedPhotos[i]].images[0].source;

		outputImages[i] = '<a rel="lightbox" href="' + photoLink + '" target="_blank"><img src="' + thumbnail + '" alt="" border="0" style="margin: ' + photoMargin + 'px;" /></a>';
	}

	var currentColumn = 0;
	for (var i = 0; i < outputImages.length; i++) {
		currentColumn++;
		var colval = outputImages[i];
		if (currentColumn == 1) {
			outputHtml += '<div style="width: auto;">' + colval;
		}
		else if (currentColumn < photoColumns) {
			outputHtml += colval;
		}
		else if (currentColumn == photoColumns) {
			outputHtml += colval + '</div>';
			currentColumn = 0;
		}
	}

	if (currentColumn < photoColumns && currentColumn != 0) {
		outputHtml += '</div>';
	}

	$("#photoSelected").html(outputHtml);
	$("#albumCode").text(outputHtml);
}

function selectAllPhotos() {
	var photoIndex = 0;
	for (photoIndex = 0; photoIndex < photosFeed.data.length; photoIndex++) {
		selectedPhotos[photoIndex] = photoIndex;
		$("#spht_" + photoIndex).attr('class', 'selectedphoto');
	}
	refreshSelectedPhotos();
}

function selectPhoto(photoId) {
	if (selectedPhotos.indexOf(photoId) != -1) {
		var toSplice = selectedPhotos.indexOf(photoId);
		selectedPhotos.splice(toSplice, 1);
		$("#spht_" + photoId).attr('class', 'unselectphoto');
	} else {
		selectedPhotos[selectedPhotos.length++] = photoId;
		$("#spht_" + photoId).attr('class', 'selectedphoto');
	}
	refreshSelectedPhotos();
}

function getAlbumFB() {

    photoColumns = document.getElementById('numAlbumCols').value;
    
    var albumLink = document.getElementById('txtAlbumLink').value;

    var albumRegex = /https:\/\/www\.facebook\.com\/(.*\/media_set|media\/set\/)\?set\=a\.(\d*)\.(.*)[\&.*]?/i;

    var match = albumRegex.exec(albumLink);
    var access_token = document.getElementById('txtAccessTokenId').value;

    if (!access_token && access_token == "") { return; }
    
    var link = '';

    if (match) {
    
        var albumid = match[2];
    
    	link = 'https://graph.facebook.com/v2.1/' + albumid + '/photos?access_token=' + access_token;

    } else { return; }

	$.getJSON(
		link,
		function (data) {
			getPhotosInfo(data);
		}
	);

}


