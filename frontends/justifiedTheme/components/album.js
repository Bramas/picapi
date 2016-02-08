

var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router'
import api from '../api';


let AlbumView = React.createClass({
	renderPhoto: function(photo) {
		return  <div key={photo.id} className="jg-entry" title={photo.title}>
					<img src={api.thumbUrl(photo)} />
				</div>
	},

	componentDidUpdate: function() {
		//$(ReactDOM.findDOMNode(this.refs['gallery'])).justifiedGallery();
	},
	componentDidMount: function() {
		this.componentDidUpdate();
	},

	render: function() {
		return <div><div ref="gallery">{this.props.photos.map(this.renderPhoto)}</div><Link to={'/albums'}>retour</Link></div>;
	}
})


module.exports = React.createClass({

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
		console.log(data);
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
		api.post('/albums/'+this.props.params.albumId+'/photos', {}, this.onDataReceived);

	},

	render () {
		return <AlbumView photos={this.state.photos}/>
	}

})