

var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router'
import api from '../api';
import { renameAlbum } from '../actions';
import { connect } from 'react-redux'

import { DropTarget } from 'react-dnd';
import HTML5Backend, { NativeTypes } from 'react-dnd-html5-backend';

import { albumMovePhoto, fetchAlbums, createAlbum, deleteAlbum } from '../actions';
import { DeleteAlbumDialog, RenameAlbumDialog, CreateAlbumDialog } from './dialogs';
var basicModal = require('basicmodal');

import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';

import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import AddIcon from 'material-ui/lib/svg-icons/content/add';
import Avatar from 'material-ui/lib/avatar';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';

import { browserHistory } from 'react-router'
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';

import Paper from 'material-ui/lib/paper';

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
  if(!state.albums[props.id])
  {
    return {
      title:'unkown'
    }
  }
  return state.albums[props.id]
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
    touch={true}
  >
    <MoreVertIcon color={Colors.grey400} />
  </IconButton>
);


let AlbumLink = React.createClass({

  getInitialState() {
      return {
        renaming:false,
        deleting: false
      }
  },

  rename() {
       this.setState({renaming:true});
  },
  delete() {
       this.setState({deleting:true});
  },
  render() {
    var connectDropTarget = this.props.connectDropTarget;
    let secondaryText = null;
    if(this.props.photos) {
      //secondaryText = this.props.photos.length + ' photos';
    }
    let style = null
    if(this.props.isOver) 
    {
      style = {backgroundColor: Colors.green400};
    }
    let rightIconMenu = (
      <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem onTouchTap={this.rename} >Rename</MenuItem>
        <MenuItem onTouchTap={this.delete} >Delete</MenuItem>
      </IconMenu>
    );
      return connectDropTarget(<div>
          <div>
            <ListItem 
              style={style}
              rightIconButton={ this.props.id === parseInt(this.props.id, 10) ? rightIconMenu : null}
              onTouchTap={() =>  api.history.push(this.props.to)} 
              secondaryText={secondaryText} 
              primaryText={this.props.title} />
          </div>
        <div>{ this.props.id === parseInt(this.props.id, 10) ? (<div>
            <RenameAlbumDialog title={this.props.title} id={this.props.id} open={this.state.renaming} onClose={() => this.setState({renaming:false})} />
            <DeleteAlbumDialog title={this.props.title} id={this.props.id} open={this.state.deleting} onClose={() => this.setState({deleting:false})} />
          </div>):'' }
        </div>
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
  getInitialState() {
      return {
          createAlbumDialog:false  
      };
  },
	renderAlbum: function(albumId) {
		return <AlbumLink key={albumId} id={albumId} to={'/album/'+albumId} />
	},

	componentDidUpdate: function() {

	},
	componentDidMount: function() {
		this.componentDidUpdate();
	},
	render: function() {
    if(!this.props.albums) {
      return <div>Loading...</div>
    }
		return <div>
      <Paper zDepth={1}>
        <List>
          {Object.keys(this.props.albums).map(this.renderAlbum)}
        </List>
        <div style={{height:'28px', textAlign:'center'}}>
          <FloatingActionButton onTouchTap={() => this.setState({createAlbumDialog : true})}>
            <ContentAdd />
          </FloatingActionButton>
        </div>
      </Paper>
      <CreateAlbumDialog open={this.state.createAlbumDialog}   onClose={() => this.setState({createAlbumDialog:false})} />
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