
import { combineReducers } from 'redux'
import { REQUEST_ALBUM_PHOTOS, RECEIVE_ALBUM_PHOTOS, ALBUM_MOVE_PHOTO } from './actions'
var Immutable = require('immutable');

const initialState = {
  albums: {},
  lastUpdated: Date.now(),
  isFetching: false
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
		let p = false;
		if(state.albums[action.originAlbumId] && state.albums[action.originAlbumId].photos)
		{
			for(var i = state.albums[action.originAlbumId].photos.length - 1; i >= 0; i--) {
			    if(state.albums[action.originAlbumId].photos[i].id === action.photoId) {
			    	p = state.albums[action.originAlbumId].photos[i]
			        state.albums[action.originAlbumId].photos.splice(i, 1);
			    }
			}
			
		}
		if(state.albums[action.destinationAlbumId] && state.albums[action.destinationAlbumId].photos && p)
		{
			state.albums[action.destinationAlbumId].photos.push(p);
		}
	    return state;
	case REQUEST_ALBUM_PHOTOS:
	  state.isFetching = true;
	  return state;
	case RECEIVE_ALBUM_PHOTOS:
		state.isFetching = false;
		state.lastUpdated = action.receivedAt;
		
		if(!state.albums[action.albumId]) {
			state.albums[action.albumId] = {};
		}
		if(!state.albums[action.albumId].photos) {
			state.albums[action.albumId].photos = [];
		}
		
		state.albums[action.albumId].photos = action.photos;
	    return state;
	default:
		return state; 
  }
  /*
  switch (action.type) {
	case ALBUM_MOVE_PHOTO:
		let p = false;
		if(state.getIn(['albums', action.originAlbumId]) && state.getIn(['albums', action.originAlbumId, 'photos']))
		{
			state = state.updateIn(['albums', action.originAlbumId, 'photos'], function(photos) {
				for(var i = photos.length - 1; i >= 0; i--) {
				    if(photos[i].id === action.photoId) {
				    	p = photos[i]
				        photos.splice(i, 1);
				    }
				}
			});
			
		}
		if(state.getIn(['albums', action.destinationAlbumId]) && state.getIn(['albums', action.destinationAlbumId, 'photos']))
		{
			state = state.updateIn(['albums', action.originAlbumId, 'photos'], photos => photos.push(p));
		}
	    break;
	case REQUEST_ALBUM_PHOTOS:
	  state.set('isFetching', true);
	  break;
	case RECEIVE_ALBUM_PHOTOS:
		state = state.set('isFetching', false)
		state = state.set('lastUpdated', action.receivedAt);
		
		if(!state.getIn(['albums', action.albumId, 'photos'])) {
			var a = {albums: {}}
			a.albums[action.albumId] = { photos:[] };
			state = state.mergeDeep(a);
		}
		
		state = state.setIn(['albums', action.albumId, 'photos'], action.photos);
	    break;
	default:
	    
  }
  return state.toJS();*/

}

export default reducer;//combineReducers({reducer});