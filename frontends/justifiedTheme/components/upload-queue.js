


var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router'
import { connect } from 'react-redux'
import api from '../api';
import { fetchAlbums } from '../actions';



let UploadQueue = React.createClass({
	renderUpload(item){
		console.log(item);
		return <div key={'uplaod-queue-'+item.name}>{item.name}</div>;
	},
	render() {
		if(this.props.uploadQueue.length == 0) return <div></div>;

		return <div className="bg-primary uploading-queue">Uploading: <div>{this.props.uploadQueue.map(this.renderUpload)}</div></div>;
	}
});



const mapStateToProps = (state, props) => {
  return {
  	uploadQueue: state.uploadQueue
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {}
}




export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadQueue);

