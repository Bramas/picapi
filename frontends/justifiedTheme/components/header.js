
var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router'
import api from '../api';


import LeftNav from 'material-ui/lib/left-nav';
import AppBar from 'material-ui/lib/app-bar';
import MenuItem from 'material-ui/lib/menus/menu-item';

module.exports = React.createClass({
	getInitialState() {
	    return {
	        leftNavOpen:false  
	    };
	},
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
	openLeftNav: function() {
		console.log(this.state.leftNavOpen);
		this.setState({leftNavOpen: !this.state.leftNavOpen})
	},
	render: function() {
		return <div>
			<LeftNav
	          docked={false}
	          width={200}
	          open={this.state.leftNavOpen}
	          onRequestChange={leftNavOpen => this.setState({leftNavOpen})}
	        >
	          <MenuItem onTouchTap={this.handleClose}>Menu Item</MenuItem>
	          <MenuItem onTouchTap={this.handleClose}>Menu Item 2</MenuItem>
	        </LeftNav>
	        <AppBar
	        	onLeftIconButtonTouchTap={this.openLeftNav}
			    title="PicMan"
			    iconClassNameRight="muidocs-icon-navigation-expand-more">
			</AppBar>
		</div>;
	}
})