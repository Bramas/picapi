
var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router'
import api from '../api';


module.exports = React.createClass({
	renderAlbum: function(album) {
		console.log(album);
		return <div key={album.id} className="album-entry" title={album.title}>
					<Link to={'/album/'+album.id}>{album.title}</Link>
				</div>
	},

	componentDidUpdate: function() {
		//$(ReactDOM.findDOMNode(this)).justifiedGallery();
	},
	componentDidMount: function() {
		this.componentDidUpdate();
	},

	render: function() {
		return <nav className="navbar navbar-default">
				<div className="container">
					<div className="navbar-header">
						<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-6" aria-expanded="false">
							<span className="sr-only">Toggle navigation</span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
						</button>
						<a className="navbar-brand" href="#">Brand</a>
					</div>
					<div className="collapse navbar-collapse" id="bs-example-navbar-collapse-6">
						<ul className="nav navbar-nav">
							<li className="active">
								<Link to={'/'}>Home</Link>
							</li>
							<li>
								<Link to={'/albums'}>Albums</Link>
							</li>
						</ul>
					</div>
				</div>
			</nav>;
	}
})