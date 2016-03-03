

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
import Paper from 'material-ui/lib/paper';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import AddIcon from 'material-ui/lib/svg-icons/content/add';

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

import styles from 'material-ui/lib/styles';
const Colors = styles.Colors;
const iconButtonElement = (
  <IconButton
     onTouchTap={(event) => { console.log(event); }}
    touch={true}
  >
    <MoreVertIcon color={Colors.white} />
  </IconButton>
);


let AlbumLink = React.createClass({

  _handleRightIconButtonTouchTap(event) {
    console.log('STOP PROPAG');
    //Stop the event from bubbling up to the list-item
    event.stopPropagation();
    //if (iconButton && iconButton.props.onTouchTap) iconButton.props.onTouchTap(event);
  },
  render() {
    let style = {margin:'10px', display:'inline-block', height:'240px', width:'240px'};
    
    var connectDropTarget = this.props.connectDropTarget;
    var a = this.props.isOver ? '+': '';
      return connectDropTarget(
        <div class="photo" style={style}>
          <Paper zDepth={1}>
            <Card onTouchTap={() => api.history.push(this.props.to)}>
              <CardMedia overlay={<CardTitle title={this.props.title+a} />} >
                <img style={{height:'240px', width:'240px'}} src={api.thumbUrl(this.props.cover, 240)} />

                <div style={{position:'absolute', top:'0', right:'0', width:'auto', 'min-width':'auto',display:'inline-block'}}>
                  <IconMenu onTouchTap={this._handleRightIconButtonTouchTap} iconButtonElement={iconButtonElement}>
                    <MenuItem onTouchTap={this.rename} >Rename</MenuItem>
                    <MenuItem onTouchTap={this.delete} >Delete</MenuItem>
                  </IconMenu>
                </div>
              </CardMedia>
            </Card>
          </Paper>
        </div>);
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