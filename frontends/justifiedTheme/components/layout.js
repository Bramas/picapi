	
import React from 'react';
import LeftPane from './left-pane';

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Layout';
    }
    render() {
    	console.log(this.props);
        return <div>
        	<div><LeftPane/></div>
	        <div>{this.props.children}</div>
	    </div>;
    }
}

export default Layout;
	