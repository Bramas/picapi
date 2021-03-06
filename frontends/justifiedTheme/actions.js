



export const SELECT_PHOTO = 'SELECT_PHOTO';
export function selectPhoto(id) {
  return {
      type: SELECT_PHOTO,
      id: id
    } 
}


export const RENAME_PHOTO = 'RENAME_PHOTO'
export function renamePhoto(id, title) {
  var api = require('./api');
  return dispatch => {
    api.put('/photos/'+id, {title: title}, function(data) { 
      dispatch({
        type: RENAME_PHOTO,
        id: id,
        title: title
      })
    });
  } 
}

export const RENAME_ALBUM = 'RENAME_ALBUM'
export function renameAlbum(id, title) {
  var api = require('./api');
  return dispatch => {
    api.put('/albums/'+id, {title: title}, function(data) { 
      dispatch({
        type: RENAME_ALBUM,
        id: id,
        title: title
      })
    });
  } 
}



export const ALBUM_MOVE_PHOTO = 'ALBUM_MOVE_PHOTO';
export function albumMovePhoto(originAlbumId, destinationAlbumId, photoId) {
  var api = require('./api');
  if(originAlbumId)
	  api.delete('/albums/'+originAlbumId+'/photos/'+photoId, {});

	api.post('/albums/'+destinationAlbumId+'/photos', {photo_id: photoId});
  return {
    type: ALBUM_MOVE_PHOTO,
    originAlbumId,
    destinationAlbumId,
    photoId
  }
}
export const CREATE_ALBUM = 'CREATE_ALBUM'
export function createAlbum(title) {

  var api = require('./api');
  return dispatch => {
    api.post('/albums', {title: title}, function(data) { 
      console.log('NEW: '); console.log(data);
      data['title'] = title;
      dispatch({
        type: CREATE_ALBUM,
        album: data
      })
    });
  } 
}

export const UPLOAD_FINISHED = 'UPLOAD_FINISHED'
export function uploadFinished(name) {
  return {
    type: UPLOAD_FINISHED,
    name
  }
}

export const START_UPLOADS = 'START_UPLOADS'
export function startUploads(files, albumId) {
  return {
    type: START_UPLOADS,
    files,
    albumId
  }
}

export const ADD_ATTACHMENTS = 'ADD_ATTACHMENTS'
export function addAttachments(id, attachments) {
  return {
    type: ADD_ATTACHMENTS,
    id,
    attachments
  }
}


export const ADD_PHOTO = 'ADD_PHOTO'
export function addPhoto(p) {
  return {
    type: ADD_PHOTO,
    photo: p
  }
}

export const REQUEST_ALBUMS = 'REQUEST_ALBUMS'
function requestAlbums() {
  return {
    type: REQUEST_ALBUMS
  }
}

export const RECEIVE_ALBUMS = 'RECEIVE_ALBUMS'
function receiveAlbums(albums) {
  return {
    type: RECEIVE_ALBUMS,
    albums: albums,
    receivedAt: Date.now()
  }
}

export function fetchAlbums() {
  var api = require('./api');
  return dispatch => {
    dispatch(requestAlbums())
    api.get('/albums', {}, function(data){
      dispatch(receiveAlbums(data))
    });
  }
};


export const REQUEST_ALBUM_PHOTOS = 'REQUEST_ALBUM_PHOTOS'
function requestAlbumPhotos(albumId) {
  return {
    type: REQUEST_ALBUM_PHOTOS,
    albumId
  }
}

export const RECEIVE_ALBUM_PHOTOS = 'RECEIVE_ALBUM_PHOTOS'
function receiveAlbumPhotos(albumId, photos) {
  return {
    type: RECEIVE_ALBUM_PHOTOS,
    albumId,
    photos: photos,
    receivedAt: Date.now()
  }
}

export function fetchAlbumPhotos(albumId) {
	var api = require('./api');
	return dispatch => {
		dispatch(requestAlbumPhotos(albumId))
		api.get('/albums/'+albumId+'/photos', {}, function(data){
			dispatch(receiveAlbumPhotos(albumId, data))
		}, function() { api.history.push('/'); });
	}
};


export const DELETE_PHOTO = 'DELETE_PHOTO'
export function deletePhoto(id) {
  var api = require('./api');
  return dispatch => {
    api.delete('/photos/'+id, {}, function(data) { 
      dispatch({
        type: DELETE_PHOTO,
        id: id
      })
      dispatch(fetchAlbumPhotos('unsorted'));
    });
  } 
}

export const DELETE_ALBUM = 'DELETE_ALBUM'
export function deleteAlbum(id) {
  var api = require('./api');
  return dispatch => {
    api.delete('/albums/'+id, {}, function(data) { 
      dispatch({
        type: DELETE_ALBUM,
        id: id
      })
      dispatch(fetchAlbumPhotos('unsorted'));
    });
  } 
}
