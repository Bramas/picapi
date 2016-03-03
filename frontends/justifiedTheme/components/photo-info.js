


var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router'
import api from '../api';
import { renameAlbum } from '../actions';
import { connect } from 'react-redux';




var React = require('react');

var PhotoInfo = React.createClass({
	renderAttachements(k) {
		return <div key={k}><a href={this.props.photo.attachments[k]} >{k}</a></div>
	},
    render() {
    	if(!this.props.photo)
    	{
    		return (
	            <div>loading...</div>
	        );
    	}
    	if(this.props.selection.length > 1) {
    		return <div>{this.props.selection.length+' photos'}</div>
    	}
        return (
            <div>Photo<br/>{this.props.photo['title']}<br />{Object.keys(this.props.photo.attachments).map(this.renderAttachements)}</div>
        );
    }
});




const mapStateToProps = (state, props) => {
  if(state.photos[props.selection[0]])
  {
	  return {
	  	photo: state.photos[props.selection[0]]
	  }
   }
   return {
   	photo: false
   }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhotoInfo);