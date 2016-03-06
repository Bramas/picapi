
var React = require('react');
var ReactDOM = require('react-dom');
import { DragSource } from 'react-dnd';
import { connect } from 'react-redux'

import { Link } from 'react-router'
import api from '../api';
import { DeletePhotoDialog, RenamePhotoDialog } from './dialogs';

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

import { selectPhoto, albumMovePhoto } from '../actions';

import styles from 'material-ui/lib/styles';
const Colors = styles.Colors;

const photoSource = {
  beginDrag(props, monitor, component) {
    return {'photoId':props.id, 'albumId': props.albumId};
  },
  endDrag(props, monitor, component) {
  	if(monitor.getDropResult())
  	{
  		
  	}
  }
};

const iconButtonElement = (
  <IconButton
    touch={true}
  >
    <MoreVertIcon color={Colors.white} />
  </IconButton>
);


function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview()//,
    //isDragging: monitor.isDragging()
  };
}
let Photo = DragSource('photo', photoSource, collect)(React.createClass({
  getInitialState() {
      return {
        renaming:false,
        deleting: false
      }
  },
  _handleRightIconButtonKeyboardFocus(event, isKeyboardFocused) {
    //const iconButton = this.props.rightIconButton;
    const newState = {};

    newState.rightIconButtonKeyboardFocused = isKeyboardFocused;
    if (isKeyboardFocused) newState.isKeyboardFocused = false;
    this.setState(newState);

    //if (iconButton && iconButton.props.onKeyboardFocus) iconButton.props.onKeyboardFocus(event, isKeyboardFocused);
  },

  _handleRightIconButtonMouseDown(event) {
    //const iconButton = this.props.rightIconButton;
    event.stopPropagation();
    //if (iconButton && iconButton.props.onMouseDown) iconButton.props.onMouseDown(event);
  },

  _handleRightIconButtonMouseLeave(event) {
    //const iconButton = this.props.rightIconButton;
    this.setState({rightIconButtonHovered: false});
    //if (iconButton && iconButton.props.onMouseLeave) iconButton.props.onMouseLeave(event);
  },

  _handleRightIconButtonMouseEnter(event) {
    //const iconButton = this.props.rightIconButton;
    this.setState({rightIconButtonHovered: true});
    //if (iconButton && iconButton.props.onMouseEnter) iconButton.props.onMouseEnter(event);
  },

  _handleRightIconButtonMouseUp(event) {
    //const iconButton = this.props.rightIconButton;
    event.stopPropagation();
    //if (iconButton && iconButton.props.onMouseUp) iconButton.props.onMouseUp(event);
  },

  _handleRightIconButtonTouchTap(event) {
    //const iconButton = this.props.rightIconButton;

    //Stop the event from bubbling up to the list-item
    event.stopPropagation();
    //if (iconButton && iconButton.props.onTouchTap) iconButton.props.onTouchTap(event);
  },
	render: function() {
		const { connectDragSource} = this.props;
    //overlay={<CardTitle titleStyle={{fontSize:'14px'}} title={this.props.title} />}

    let style = {margin:'10px', display:'inline-block', height:'100px', width:'100px'};
    if(this.props.selected) {
      style['border'] = '5px solid '+Colors.pinkA200;
      style['height'] = '110px';
      style['width']  = '110px';
      style['margin']  = '5px';

    }
    const rightIconButtonHandlers = {
        onKeyboardFocus: this._handleRightIconButtonKeyboardFocus,
        onMouseEnter: this._handleRightIconButtonMouseEnter,
        onMouseLeave: this._handleRightIconButtonMouseLeave,
        onTouchTap: this._handleRightIconButtonTouchTap,
        onMouseDown: this._handleRightIconButtonMouseUp,
        onMouseUp: this._handleRightIconButtonMouseUp,
      };
		return  connectDragSource(
        <div className="photo" style={style}>
          <Paper zDepth={1}>
            <Card style={{position:'relative'}} onTouchTap={() => api.store.dispatch(selectPhoto(this.props.id))}>
              <CardMedia>
                <img style={{height:'100px', width:'100px'}} src={this.props.src} />
              </CardMedia>
              <div style={{position:'absolute', top:'0', right:'0', width:'auto', 'minWidth':'auto',display:'inline-block'}}>
                <IconMenu iconButtonElement={iconButtonElement}>
                  <MenuItem onTouchTap={() => this.setState({renaming:true})} >Rename</MenuItem>
                  {this.props.albumId == 'unsorted'?
                    <MenuItem onTouchTap={() => this.setState({deleting:true})} >Delete</MenuItem>:
                    <MenuItem onTouchTap={() => api.store.dispatch(albumMovePhoto(this.props.albumId, 'unsorted', this.props.id))} >Remove from the album</MenuItem>
                  }
                </IconMenu>
              </div>
            </Card>
          </Paper>
          <RenamePhotoDialog title={this.props.title} id={this.props.id} open={this.state.renaming} onClose={() => this.setState({renaming:false})} />
          <DeletePhotoDialog title={this.props.title} albumId={this.props.albumId} id={this.props.id} open={this.state.deleting} onClose={() => this.setState({deleting:false})} />
        </div>);
	}
}));


// title={photo.title} src={api.thumbUrl(photo)} 

const mapStateToProps = (state, props) => {
  props
  if(!state.photos[props.id]){
    return {
      title: 'unknown',
      src  : api.thumbUrl({}),
      photo: {}
    }
  }
  return {
      title: state.photos[props.id].title,
      src  : api.thumbUrl(state.photos[props.id], 150),
      photo: state.photos[props.id],
      selected: state.selection.indexOf(props.id) != -1
    }
}

const mapDispatchToProps = (dispatch, props) => {
  return { }
}





export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Photo);


