
import { combineReducers } from 'redux'
import { SELECT_PHOTO, RENAME_ALBUM, DELETE_ALBUM, CREATE_ALBUM, UPLOAD_FINISHED, START_UPLOADS, ADD_ATTACHMENTS, ADD_PHOTO, REQUEST_ALBUM_PHOTOS, RECEIVE_ALBUM_PHOTOS, ALBUM_MOVE_PHOTO, RECEIVE_ALBUMS, REQUEST_ALBUMS } from './actions'
var Immutable = require('immutable');

var React = require('react');
import PhotoInfo from './components/photo-info';

const initialState = {
  albums: false,
  photos: {},
  lastUpdated: Date.now(),
  isFetching: false,
  uploadQueue: [],
  selectionInfo: <PhotoInfo selection={[32]} />,
  selection: [32]
}

function reducer(state, action) {
  if (typeof state === 'undefined') {
	return initialState;
  }
  console.log('reduce action ')
  console.log(action);
  state = Immutable.fromJS(state);
  state = state.toJS();
  switch (action.type) {
	case ALBUM_MOVE_PHOTO:
		if(state.albums[action.originAlbumId] && state.albums[action.originAlbumId].photos)
		{
			for(var i = state.albums[action.originAlbumId].photos.length - 1; i >= 0; i--) {
			    if(state.albums[action.originAlbumId].photos[i] === action.photoId) {
			        state.albums[action.originAlbumId].photos.splice(i, 1);
			    }
			}
			
		}
		if(state.albums[action.destinationAlbumId] && state.albums[action.destinationAlbumId].photos)
		{
			if(state.albums[action.destinationAlbumId].photos.indexOf(action.photoId) == -1)
			{
				state.albums[action.destinationAlbumId].photos.push(action.photoId);
			}
			
		}
	    return state;
	case REQUEST_ALBUMS:
	  state.isFetching = true;
	  return state;
	case REQUEST_ALBUM_PHOTOS:
	  state.isFetching = true;
	  return state;
	case ADD_PHOTO:
		state.photos[action.photo.id] = action.photo
		return state;
	case UPLOAD_FINISHED:
		for(var i = state.uploadQueue.length - 1; i >= 0; i--) {
			    if(state.uploadQueue[i].name === action.name) {
			        state.uploadQueue.splice(i, 1);
			    }
			}
   		return state;
   	case DELETE_ALBUM:
   	console.log(state.albums);
   		delete state.albums[action.id];
   	console.log(state.albums);
   		return state;
   	case RENAME_ALBUM:

   		state.albums[action.id].title = action.title;
   		return state;
   	case CREATE_ALBUM:
   		state.albums[action.album.id] = action.album;
   		return state;
	case START_UPLOADS:
		for (var i=0; i < action.files.length; i++) {
    	    state.uploadQueue.push({
    	    	name: action.files[i].name, 
    	    	size: action.files[i].size,
    	    	type: action.files[i].type,
    	    	albumId: action.albumId
    	    });
   		}
   		return state;
	case ADD_ATTACHMENTS:
		if(!state.photos[action.id])
		{
			state.photos[action.id] = {id: action.id, title:'unknown'};
		}
		state.photos[action.id]['attachments'] = action.attachments;
		return state
	case RECEIVE_ALBUMS:
		state.isFetching = false;
		state.lastUpdated = action.receivedAt;
		state.albums = {};
		for(var o in action.albums) {
			state.albums[action.albums[o].id] = action.albums[o];
		}
		return state;
	case RECEIVE_ALBUM_PHOTOS:
		state.isFetching = false;
		state.lastUpdated = action.receivedAt;
		
		if(!state.albums[action.albumId]) {
			return state;
		}
		if(!state.albums[action.albumId].photos) {
			state.albums[action.albumId].photos = [];
		}
		for(var i in action.photos) {
			state.albums[action.albumId].photos.push(action.photos[i].id);
			state.photos[action.photos[i].id] = action.photos[i];
		}
		
	    return state;

	case SELECT_PHOTO:
		if(false) //TODO: if ControlModfier
		{
			if(state.selection.indexOf(action.id) == -1)
				state.selection.push(action.id);
		}
		else {
			state.selection = [action.id];
		}

		state.selectionInfo = <PhotoInfo selection={state.selection} />
		return state
	default:
		return state; 
  }

}

export default reducer;//combineReducers({reducer});