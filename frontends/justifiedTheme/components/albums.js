

var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router'
import api from '../api';

let AlbumsView = React.createClass({
	renderAlbum: function(album) {
		console.log(album);
		return <div key={album.id} className="album-entry" title={album.title}>

					<Link to={'/album/'+album.id}><img src={api.thumbUrl(album.cover)} />{album.title}</Link>
				</div>
	},

	componentDidUpdate: function() {
		//$(ReactDOM.findDOMNode(this)).justifiedGallery();
	},
	componentDidMount: function() {
		this.componentDidUpdate();
	},

	render: function() {
		return <div>{this.props.albums.map(this.renderAlbum)}</div>;
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

    console.log(data)
  	this.setState({albums: data})
  },
  fetchInvoice () {
    api.get('/albums', {}, this.onDataReceived);
  },
  render () {
    return <AlbumsView albums={this.state.albums}/>
  }

})