/**
 * @description This module communicates with Lychee's API
 * @copyright   2015 by Tobias Reich
 */

let api = {

	path    : 'http://localhost:8080',
	onError : function(e){ console.log(e); }

}
api.thumbUrl = function(photo) {
	return photo['url_info']['base'] + photo['url_info']['extension'];
}
api.post = function(cmd, params, callback) {


	const success = (data) => {

		// Output response when debug mode is enabled
		//if (lychee.debugMode) console.log(data)

		callback(data)

	}

	const error = (jqXHR, textStatus, errorThrown) => {

		console.log('Server error or API not found.', params, errorThrown)

	}

	var request = new XMLHttpRequest();
	request.open('GET', api.path+cmd, true);

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
	    // Success!
	    var resp = request.responseText;
	    success(JSON.parse(resp))
	  } else {
	    // We reached our target server, but it returned an error
	    console.log('error')
	  }
	};

	request.onerror = function() {
	  // There was a connection error of some sort
	};

	request.send();

}

module.exports = api;