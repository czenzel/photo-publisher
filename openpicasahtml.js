/*
 Open PICASA HTML Generator
 Please retain credits.

 ALPHA Version
 Copyright 2013 Christopher David Zenzel
 */

var selectedPhotos = Array();
var photosFeed = '';

var photoColumns = 2;
var photoMargin = 3;

function getPhotosFromAlbum(link) {
	getRemoteXMLQuery(link, getPhotosInfo);
}

function refreshSelectedPhotos() {
	var outputHtml = '';
	var outputImages = Array();

	for (var i = 0; i < selectedPhotos.length; i++) {
		var thumbnail = $(photosFeed).find("entry").eq(selectedPhotos[i]).find("thumbnail").eq(2).attr('url');
		var photoLink = $(photosFeed).find("entry").eq(selectedPhotos[i]).find("link[type='text/html']").attr('href');

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
	$(photosFeed).find("entry").each(function() {
		selectedPhotos[photoIndex] = photoIndex;
		photoIndex++;
	});
	refreshSelectedPhotos();
}

function selectPhoto(photoId) {
	if (selectedPhotos.indexOf(photoId) != -1) {
		var toSplice = selectedPhotos.indexOf(photoId);
		selectedPhotos.splice(toSplice, 1);
	} else {
		selectedPhotos[selectedPhotos.length++] = photoId;
	}
	refreshSelectedPhotos();
}

function getPhotosInfo(data) {
	selectedPhotos = Array();
	photosFeed = data.results[0].toString().replace(/media\:/ig, '');

	var outputHtml = '';
	var photoIndex = 0;

	$(photosFeed).find("entry").each(function() {
		var thumbnail = $(this).find("thumbnail").eq(0).attr('url');
		outputHtml += '<a href="#" onclick="selectPhoto(' + photoIndex + ');"><img src="' + thumbnail + '" alt="Thumbnail Preview" /></a>';
		photoIndex++;
	});

	$("#photoPreviews").html(outputHtml);
}

function getAlbumsFromUser(user) {
	$("#albumPreviews").html("Please wait while we generate your album list . . .");
	var albums = 'https://picasaweb.google.com/data/feed/base/user/' + user + '?access=public';
	getRemoteXMLQuery(albums, getAlbumsInfo);
}

function getAlbumsInfo(data) {
	var albumsFeed = data.results[0];

	var outputHtml = '<ul>';

	$(albumsFeed).find("entry").each(function() {
		var albumTitle = $(this).find("title").text();
		var albumFeed = $(this).find("link[rel='http://schemas.google.com/g/2005#feed']").attr('href');
		var albumPreview = $(this).find("summary").text();

		outputHtml += '<li><a href="#" onclick="getPhotosFromAlbum(\'' + albumFeed + '\');">' + albumTitle + '</a></li>';
	});

	outputHtml += '</ul>';

	$("#albumPreviews").html(outputHtml);
}

function getAlbumsButton() {
	getAlbumsFromUser(document.getElementById('txtAlbumUser').value);
}