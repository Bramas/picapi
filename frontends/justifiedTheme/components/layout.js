	
import React from 'react';
import LeftPane from './left-pane';
import Header from './header';
import ListAlbums from './list-albums';


import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Layout';
    }
    
    render() {
        return <div id="dropzone">
        	<Header />
            <ListAlbums />
	        <div className="container">{this.props.children}</div>
	    </div>;
    }
}

export default DragDropContext(HTML5Backend)(Layout);
	