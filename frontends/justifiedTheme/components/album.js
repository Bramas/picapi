

var React = require('react');
var ReactDOM = require('react-dom');
import { DragSource } from 'react-dnd';
import { connect } from 'react-redux'

import { Link } from 'react-router'
import api from '../api';
import Photo from './photo';

import { fetchAlbumPhotos } from '../actions';


let AlbumView = React.createClass({
	renderPhoto: function(photoId) {
		return  <Photo key={photoId} albumId={this.props.params.albumId} id={photoId} />
	},

	componentDidMount: function() {
		this.componentDidUpdate();
	},

	render: function() {
		if(!this.props.photos)
		{
			return(<div>Loading...</div>);
		}

		return <div ref="gallery">{this.props.photos.map(this.renderPhoto)}</div>;
	},

	componentDidUpdate(prevProps, prevState) {
		if(!this.props.photos && !this.props.isFetching)
		{
  			console.log('album '+this.props.albumId+' not found => fetching')
  			this.props.fetchAlbumPhotos(this.props.params.albumId);  
  		}
	}
})


const mapStateToProps = (state, props) => {
  if(state.albums[props.params.albumId]) {
  	return {
		photos: state.albums[props.params.albumId].photos,
  		isFetching: state.isFetching
	}
  }
  return {
  	photos: false,
  	isFetching: state.isFetching
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
  	fetchAlbumPhotos: function(albumId) {
  		dispatch(fetchAlbumPhotos(albumId))
  	}
  }
}




export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlbumView);

let Album = React.createClass({

  getInitialState () {
    return {
      photos: []
    }
  },

  componentDidMount () {
    // fetch data initially in scenario 2 from above
    this.fetchInvoice()
  },

  componentDidUpdate (prevProps) {
	let oldId = prevProps.params.albumId
    let newId = this.props.params.albumId
    if (newId !== oldId)
      this.fetchInvoice()
  },

  componentWillUnmount () {

  },
  onDataReceived(data) {
	this.setState({photos: data});
		/*ReactDom.render(<Layout 
			leftPane={<TreeTimeline data={timeline} onToggle={handleTreeClick}/>}
			mainPane={<Album photos={photos} />} />, document.getElementById('main-container'))*/
	},
	fetchInvoice () {	
		var params = {
		albumID: this.props.params.albumId,
		password: null
		}
		api.get('/albums/'+this.props.params.albumId+'/photos', {}, this.onDataReceived);

	},

	render () {
		return <AlbumView photos={this.state.photos}/>
	}

});