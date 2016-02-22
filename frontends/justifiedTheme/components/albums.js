

var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router'
import { connect } from 'react-redux'
import api from '../api';
import { fetchAlbums } from '../actions';

let AlbumsView = React.createClass({
	renderAlbum: function(albumId) {
    let album = this.props.albums[albumId];
		return <div key={album.id} className="album-entry" title={album.title}>

					<Link to={'/album/'+album.id}><img src={api.thumbUrl(album.cover)} />{album.title}</Link>
				</div>
	},

	componentDidUpdate: function() {
		//$(ReactDOM.findDOMNode(this)).justifiedGallery();
	},
	componentDidMount: function() {
		this.componentDidUpdate();
	},

	render: function() {
    if(!this.props.albums){
      return <div>Loading</div>;
    }
		return <div>{Object.keys(this.props.albums).map(this.renderAlbum)}</div>;
	}
})

const mapStateToProps = (state, props) => {
  if(state.albums) {
    return {
      albums: state.albums,
      isFetching: state.isFetching
    }
  }
  return {
    albums: false,
    isFetching: state.isFetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAlbums: function() {
      dispatch(fetchAlbums())
    }
  }
}

const mergeProps = (stateProps, dispatchProps, props) => {
  if(!stateProps.albums && !stateProps.isFetching) {
    dispatchProps.fetchAlbums();
  }
  return Object.assign({}, stateProps, dispatchProps, props);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(AlbumsView);

