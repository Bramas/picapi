
import api from './api';

export const ALBUM_MOVE_PHOTO = 'ALBUM_MOVE_PHOTO';
export function albumMovePhoto(originAlbumId, destinationAlbumId, photoId) {
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
		api.post('/albums/'+albumId+'/photos', {}, function(data){
			dispatch(receiveAlbumPhotos(albumId, data))
		});
	}
};
