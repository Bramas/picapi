

var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router'
import api from '../api';
import { connect } from 'react-redux'

import { DropTarget } from 'react-dnd';

import { albumMovePhoto } from '../actions';


const linkTarget = {
  canDrop(props) {
    return true;
  },

  drop(props, monitor, component) {
    if(!monitor.getItem().photoId)
    {
      return;
    }
    var photoId = monitor.getItem().photoId;
    var albumId = monitor.getItem().albumId;
    console.log('move photo '+photoId+' in album '+props.id);
    props.onPhotoDropped(albumId, photoId);
    return {photoId: photoId, destinationAlbumId:props.id}
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

const mapStateToProps = (state, props) => {
  var title = props.title || 'Loading...'
  if(state.albums[props.id] && state.albums[props.id].title)
  {
    title = state.albums[props.id].title
  }
  return {
    title: title
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    onPhotoDropped: (albumId, photoId) => {
      dispatch(albumMovePhoto(albumId, props.id, photoId))
    }
  }
}


let AlbumLink = React.createClass({
  render() {
    var connectDropTarget = this.props.connectDropTarget;
    var a = this.props.isOver ? '+': '';
      return connectDropTarget(<div><Link to={this.props.to}>{this.props.title}</Link>{a}</div>);
  }
});


AlbumLink = DropTarget('photo', linkTarget, collect)
(AlbumLink);


AlbumLink = connect(
  mapStateToProps,
  mapDispatchToProps
)(AlbumLink);


let ListAlbumsView = React.createClass({
	renderAlbum: function(album) {
		return <li key={album.id} className="list-album-entry" title={album.title}>

					<AlbumLink id={album.id} to={'/album/'+album.id} title={album.title} />
				</li>
	},

	componentDidUpdate: function() {
		//$(ReactDOM.findDOMNode(this)).justifiedGallery();
	},
	componentDidMount: function() {
		this.componentDidUpdate();
	},

	render: function() {
		return <ul>{this.props.albums.map(this.renderAlbum)}</ul>;
	}
})


module.exports = React.createClass({

  getInitialState () {
    return {
      albums: []
    }
  },

  componentDidMount () {
    // fetch data initially in scenario 2 from above
    this.fetchInvoice()
  },

  componentDidUpdate (prevProps) {
   
  },

  componentWillUnmount () {

  },
  onDataReceived(data) {

  	this.setState({albums: data})
  },
  fetchInvoice () {
    api.post('/albums', {}, this.onDataReceived);
  },
  render () {
    return <ListAlbumsView albums={this.state.albums}/>
  }

})