	
import React from 'react';
import LeftPane from './left-pane';
import Header from './header';

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Layout';
    }
    render() {
        return <div>
        	<Header />
	        <div className="container">{this.props.children}</div>
	    </div>;
    }
}

export default Layout;
	