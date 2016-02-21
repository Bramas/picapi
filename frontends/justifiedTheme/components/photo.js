
var React = require('react');
var ReactDOM = require('react-dom');
import { DragSource } from 'react-dnd';

import { Link } from 'react-router'
import api from '../api';


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
		return  connectDragSource(<div className="jg-entry">
					<img src={this.props.src}  title={this.props.title}/><span>{this.props.title}</span>
				</div>);
	}
}));
module.exports = Photo;

