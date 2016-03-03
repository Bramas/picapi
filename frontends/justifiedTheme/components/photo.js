
var React = require('react');
var ReactDOM = require('react-dom');
import { DragSource } from 'react-dnd';
import { connect } from 'react-redux'

import { Link } from 'react-router'
import api from '../api';

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

import { selectPhoto } from '../actions';

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
		return  connectDragSource(
        <div class="photo" style={style}>
          <Paper zDepth={1}>
            <Card onTouchTap={() => api.store.dispatch(selectPhoto(this.props.id))}>
              <CardMedia>
                <img style={{height:'100px', width:'100px'}} src={this.props.src} />

                <div style={{position:'absolute', top:'0', right:'0', width:'auto', 'min-width':'auto',display:'inline-block'}}>
                  <IconMenu iconButtonElement={iconButtonElement}>
                    <MenuItem onTouchTap={this.rename} >Rename</MenuItem>
                    <MenuItem onTouchTap={this.delete} >Delete</MenuItem>
                  </IconMenu>
                </div>
              </CardMedia>
            </Card>
          </Paper>
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


