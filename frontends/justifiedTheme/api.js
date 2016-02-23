/**
 * @description This module communicates with Lychee's API
 * @copyright   2015 by Tobias Reich
 */
import { createStore, applyMiddleware  } from 'redux'
import thunkMiddleware from 'redux-thunk'
import reducerApp from './reducers'
import { addPhoto, albumMovePhoto, addAttachments } from './actions'

let api = {

	token   : false,
	path    : 'http://localhost:8080',
	onError : function(e){ console.log(e); },
	store   : createStore(reducerApp, undefined, applyMiddleware(thunkMiddleware))

}


api.thumbUrl = function(photo) {
	if(photo && photo['url_info'])
		return photo['url_info']['base'] + photo['url_info']['extension'];
	return 'http://placehold.it/300x200';
}
api.call = function(cmd, method, params, callback) {

	const success = (data) => {
		if(callback)
			callback(data)
	}

	const error = (jqXHR, textStatus, errorThrown) => {
		console.log('Server error or API not found.', params, errorThrown)
	}

	var request = new XMLHttpRequest();
	request.open(method, api.path+cmd, true);

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
	if("string" != typeof params)
	{
		/*
		var prefix, paramsArray = [],
	        addParam = function (key, value) {
	        // If value is a function, invoke it and return its value
	        value = typeof value === "function" ? value() : (value == null ? "" : value);
	        paramsArray[paramsArray.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
	    };
		for(o in params) {
            addParam(o, params[o]);
        }*/
		params = this.objectToQueryString(params);
	}
	request.send(params);

}

api.get = function(cmd, params, callback) {
	return this.call(cmd, 'GET', params, callback);
}
api.post = function(cmd, params, callback) {
	return this.call(cmd, 'POST', params, callback);
}
api.delete = function(cmd, params, callback) {
	return this.call(cmd, 'DELETE', params, callback);
}

api.init = function(callback){

	api.get('/authenticate?code=sdfsdf&client_id=qsdfsdf&grant_type=password',{}, callback);
}


function buildParams(prefix, obj, add) {
    var name, i, l, rbracket;
    rbracket = /\[\]$/;
    if (obj instanceof Array) {
        for (i = 0, l = obj.length; i < l; i++) {
            if (rbracket.test(prefix)) {
                add(prefix, obj[i]);
            } else {
                buildParams(prefix + "[" + ( typeof obj[i] === "object" ? i : "" ) + "]", obj[i], add);
            }
        }
    } else if (typeof obj == "object") {
        // Serialize object item.
        for (name in obj) {
            buildParams(prefix + "[" + name + "]", obj[ name ], add);
        }
    } else {
        // Serialize scalar item.
        add(prefix, obj);
    }
}
api.objectToQueryString = function (a) {
    var prefix, s, add, name, r20, output;
    s = [];
    r20 = /%20/g;
    add = function (key, value) {
        // If value is a function, invoke it and return its value
        value = ( typeof value == 'function' ) ? value() : ( value == null ? "" : value );
        s[ s.length ] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
    };
    if (a instanceof Array) {
        for (name in a) {
            add(name, a[name]);
        }
    } else {
        for (prefix in a) {
            buildParams(prefix, a[ prefix ], add);
        }
    }
    output = s.join("&").replace(r20, "+");
    return output;
};
api.sendFile = function(file, albumId) {
        var uri = "http://localhost:8080/photos";
        var xhr = new XMLHttpRequest();
        var fd = new FormData();
        xhr.open("POST", uri, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                // Handle response.
                let p = JSON.parse(xhr.responseText); // handle response.
                if(p.title) {
                	api.store.dispatch(addPhoto(p))
                	api.store.dispatch(albumMovePhoto(false, albumId, p.id))
                }
                if(p.attachments) {
                	api.store.dispatch(addAttachments(p.id, p.attachments))
                }
                

            }
        }//.bind(this, albumId);

        xhr.upload.addEventListener("progress", function(e) {
            if (e.lengthComputable) {
              var percentage = Math.round((e.loaded * 100) / e.total);
              console.log(percentage);
            }
          }, false);
        fd.append('upload', file);
        // Initiate a multipart/form-data upload
        xhr.send(fd);  
    }

api.upload = function(files, albumId) {
    for (var i=0; i<files.length; i++) {
        this.sendFile(files[i], albumId);
    }
}
module.exports = api;