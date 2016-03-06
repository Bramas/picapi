
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
		this.setState({leftNavOpen: true})
	},
	closeLeftNav: function() {
		this.setState({leftNavOpen: false})
	},
	render: function() {

		return <div>
			<LeftNav
	          docked={false}
	          width={200}
	          open={this.state.leftNavOpen}
	          onRequestChange={open => this.setState({leftNavOpen: open})}
	        >
	          <MenuItem onTouchTap={() => { api.history.push('/albums'); this.closeLeftNav(); }}>Albums</MenuItem>
	          <MenuItem onTouchTap={() => { api.history.push('/'); this.closeLeftNav(); }}>Settings</MenuItem>
	        </LeftNav>
	        <AppBar
	        	onLeftIconButtonTouchTap={this.openLeftNav}
			    title="PicMan"
			    iconClassNameRight="muidocs-icon-navigation-expand-more">
			</AppBar>
		</div>;
	}
})