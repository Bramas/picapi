


export const ALBUM_MOVE_PHOTO = 'ALBUM_MOVE_PHOTO';
export function albumMovePhoto(originAlbumId, destinationAlbumId, photoId) {
  var api = require('./api');
	api.delete('/albums/'+originAlbumId+'/photos/'+photoId, {});
	api.post('/albums/'+destinationAlbumId+'/photos', {photo_id: photoId});
  return {
    type: ALBUM_MOVE_PHOTO,
    originAlbumId,
    destinationAlbumId,
    photoId
  }
}


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
		});
	}
};
