/*
 Open PICASA HTML Generator
 Please retain credits.

 Copyright 2014 Christopher David Zenzel
 All Rights Reserved

 Please support my education by purchasing an application in the Mac or iTunes App Store!

License:

This work is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-nd/4.0/. This is a work of Christopher Zenzel and was published to GitHub to help contribute code to the community to help people build web sites.

 */

var selectedPhotos = Array();
var photosFeed = '';

var photoColumns = 2;
var photoMargin = 3;

function getPhotosFromAlbum(link) {
//XML: 	getRemoteXMLQuery(link, getPhotosInfo);
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

	for (photoIndex = 0; photoIndex < photosFeed.feed.entry.length; photoIndex++) {
		var thumbnail = photosFeed.feed.entry[photoIndex].media$group.media$thumbnail[0].url;
		outputHtml += '<a href="javascript:selectPhoto(' + photoIndex + ');"><img src="' + thumbnail + '" alt="Thumbnail Preview" id="spht_' + photoIndex + '" /></a>';
	}

	$("#photoPreviews").html(outputHtml);
}

function refreshSelectedPhotos() {
	var outputHtml = '';
	var outputImages = Array();

	for (var i = 0; i < selectedPhotos.length; i++) {

/* XML:
		var thumbnail = $(photosFeed).find("entry").eq(selectedPhotos[i]).find("thumbnail").eq(2).attr('url');
		var photoLink = $(photosFeed).find("entry").eq(selectedPhotos[i]).find("link[type='text/html']").attr('href');
*/

		var thumbnail = photosFeed.feed.entry[selectedPhotos[i]].media$group.media$thumbnail[2].url;
		var photoLink = photosFeed.feed.entry[selectedPhotos[i]].link[1].href;

		outputImages[i] = '<a href="' + photoLink + '" target="_blank"><img src="' + thumbnail + '" alt="" border="0" style="margin: ' + photoMargin + 'px;" /></a>';
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
	for (photoIndex = 0; photoIndex < photosFeed.feed.entry.length; photoIndex++) {
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

function getAlbumPlus() {
    
    var albumLink = document.getElementById('txtAlbumLink').value;
    var albumAuthPrefix = 'Gv1sRg';

    var albumRegex = new RegExp('http[s]?[:]\\/\\/plus\\.google\\.com\\/photos\\/(\\d*)\\/albums\\/(\\d*)[?][.*\\&?]?authkey[=](.*)[\\&?.*]?');

    var pageRegex = new RegExp('http[s]?[:]\\/\\/plus\\.google\\.com\\/(b\\/\\d*\\/)?photos\\/(\\d*)\\/albums\\/(\\d*)[?]?[.*\\&?]?[\\&?.*]?');
    
    var match = albumRegex.exec(albumLink);
    var matcher2 = pageRegex.exec(albumLink);
    
    var link = '';

    if (match) {
    
        var personid = match[1];
        var albumid = match[2];
        var authid = match[3];
    
    	link = 'https://picasaweb.google.com/data/feed/base/user/' + personid + '/albumid/' + albumid + '?kind=photo&authkey=' + albumAuthPrefix + authid + '&hl=en_US&alt=json';

    } else if (matcher2) {

        var personid = matcher2[2];
        var albumid = matcher2[3];

    	link = 'https://picasaweb.google.com/data/feed/base/user/' + personid + '/albumid/' + albumid + '?kind=photo&hl=en_US&alt=json';

    }
    
 //   getRemoteXMLQuery(link, getPhotosInfo);
    
	$.getJSON(
		link,
		function (data) {
			getPhotosInfo(data);
		}
	);

}

function getAlbumManual() {
    var personid = document.getElementById('txtUserID').value;
    var albumid = document.getElementById('txtAlbumID').value;
    var authid = document.getElementById('txtAuthKeyID').value;

    var link = '';

    if (authid && authid != '' && authid != 'AuthKey') {
	link = 'https://picasaweb.google.com/data/feed/base/user/' + personid + '/albumid/' + albumid + '?kind=photo&authkey=' + authid + '&hl=en_US&alt=json';
    } else {
	link = 'https://picasaweb.google.com/data/feed/base/user/' + personid + '/albumid/' + albumid + '?kind=photo&hl=en_US&alt=json';
    }
    
//    getRemoteXMLQuery(link, getPhotosInfo);

	$.getJSON(
		link,
		function (data) {
			getPhotosInfo(data);
		}
	);

}

function getAlbumsInfo(data) {
	var albumsFeed = data;

	var outputHtml = '<ul>';

	for (var i = 0; i < albumsFeed.feed.entry.length; i++) {
		var albumTitle = albumsFeed.feed.entry[i].title.$t;
		var albumFeed = albumsFeed.feed.entry[i].id.$t;

		var albumRegex = new RegExp('http[s]?\:\/\/picasaweb.google.com\/data\/entry\/base\/user\/(.*)\/albumid\/(.*)');
		var match = albumRegex.exec(albumFeed);

		albumFeed = "https://picasaweb.google.com/data/feed/base/user/" + match[1] + "/albumid/" + match[2];

		outputHtml += '<li><a href="javascript:getPhotosFromAlbum(\'' + albumFeed + '\');">' + albumTitle + '</a></li>';
	}

	outputHtml += '</ul>';

	$("#albumPreviews").html(outputHtml);
}

function getAlbumsFromUser(user) {
	$("#albumPreviews").html("Please wait while we generate your album list . . .");
	var albums = 'https://picasaweb.google.com/data/feed/base/user/' + user + '?access=public&alt=json';

	$.getJSON(
		albums,
		function (data) {
			getAlbumsInfo(data);
		}
	);

//	getRemoteXMLQuery(albums, getAlbumsInfo);
}

function getAlbumsButton() {
	getAlbumsFromUser(document.getElementById('txtAlbumUser').value);
}

