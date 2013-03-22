function getRemoteXMLQuery( url, callback ) {
	/* Use YQL Request */
	var callbackName = callback.toString();
	var callbackGroups = /function\s+(.*).*\(/i;
	var match = callbackGroups.exec(callbackName);
	var cbn = match[1];

	var _p_maxage = 60 * 15;

	var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + url + '"') + '&format=xml&_maxage=' + _p_maxage + '&callback=' + cbn;

	/* Stop Cache Busting with JQuery */
	$.ajax({
		url: yql,
		dataType: 'jsonp',
		jsonp: 'callback',
		jsonpCallback: cbn
	});
}

function getRemoteHTMLQuery( url, callback ) {
	/* Use YQL Request */
	var callbackName = callback.toString();
	var callbackGroups = /function\s+(.*).*\(/i;
	var match = callbackGroups.exec(callbackName);
	var cbn = match[1];

	yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + url + '"') + '&format=xml&callback=' + cbn;

	/* Stop Cache Busting with JQuery */
	$.ajax({
		url: yql,
		dataType: 'jsonp',
		jsonp: 'callback',
		jsonpCallback: cbn
	});
}

function parseRemoteData(data) {
	if (data.results[0]) { data = data.results[0]; return data; }
	return "";
}
