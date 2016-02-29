

var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router'
import api from '../api';
import { connect } from 'react-redux'

import { DropTarget } from 'react-dnd';
import HTML5Backend, { NativeTypes } from 'react-dnd-html5-backend';

import { albumMovePhoto, fetchAlbums, createAlbum } from '../actions';
var basicModal = require('basicmodal');

import Context from './context';


import CardHeader from 'material-ui/lib/card/card-header';
import CardTitle from 'material-ui/lib/card/card-title';
import CardMedia from 'material-ui/lib/card/card-media';
import Card from 'material-ui/lib/card/card';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';

const linkTarget = {
  canDrop(props) {
    return true;
  },

  drop(props, monitor, component) {
    if(!monitor.getItem().photoId)
    {
      if(monitor.getItem().files)
      {
        api.upload(monitor.getItem().files, props.id);
      }
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

  contextMenu:  [
        { title: 'Rename', icon: 'ion-plus-round', fn: c => console.log(c) },
        { },
        { title: 'Delete', icon: 'ion-person', fn: c => console.log(c)  },
  ],
  render() {
    var connectDropTarget = this.props.connectDropTarget;
    var a = this.props.isOver ? '+': '';
      return connectDropTarget(
        <span>
          <Context items={this.contextMenu}>
            <Link to={this.props.to}>
              <Card>
                {false?<CardHeader
                  title={this.props.title+a}
                  subtitle={this.props.title+a}
                  avatar="http://lorempixel.com/100/100/nature/" />:''}
                <CardMedia
                  overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}
                >
                  <img src={this.props.img} />
                </CardMedia>
                {false?<CardTitle title="Card title" subtitle="Card subtitle" />:''}
              </Card>
            </Link>
          </Context>
        </span>);
  }
});


AlbumLink = DropTarget(['photo', NativeTypes.FILE], linkTarget, collect)
(AlbumLink);


AlbumLink = connect(
  mapStateToProps,
  mapDispatchToProps
)(AlbumLink);


let ListAlbumsView = React.createClass({
  renderAlbum: function(albumId) {
    let album = this.props.albums[albumId];
    let badge = album.photos ? <span className="badge">{album.photos.length}</span> : '';

    return <AlbumLink key={album.id} id={album.id} to={'/album/'+album.id} img={api.thumbUrl(album.cover)} title={album.title} />;
  },

  componentDidUpdate: function() {

  },
  componentDidMount: function() {
    this.componentDidUpdate();
  },
  newAlbum: function() {
        basicModal.show({
        body: `
              <p><strong>New Album</strong></p>
              <input class="basicModal__text" type="text" placeholder="Album Title" name="title">
              `,
        class: basicModal.THEME.small,
        closable: true,
        buttons: {
            cancel: {
                class: basicModal.THEME.xclose,
                fn: basicModal.close
            },
            action: {
                title: 'Create Album',
                fn: function(data) {
                   this.props.createAlbum(data.title);
                   basicModal.close();
                }.bind(this)
            }
        }
    });
  },

  render: function() {
    if(!this.props.albums) {
      return <div>Loading...</div>
    }
    return <div>
      {Object.keys(this.props.albums).map(this.renderAlbum)}
      <div onClick={this.newAlbum}>Nouvel Album</div>
    </div>;
  }
});


const mapStateToProps2 = (state, props) => {
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

const mapDispatchToProps2 = (dispatch, props) => {
  if(!props.albums && !props.isFetching) {
    dispatch(fetchAlbums());
  }
  return {
    fetchAlbums: function() {
      dispatch(fetchAlbums())
    },
    createAlbum: function(title) {
      dispatch(createAlbum(title))
    }
  }
}
export default connect(
  mapStateToProps2,
  mapDispatchToProps2
)(ListAlbumsView);