	
import React from 'react';
import LeftPane from './left-pane';
import Header from './header';
import ListAlbums from './list-albums';
import UploadQueue from './upload-queue'

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Paper from 'material-ui/lib/paper';


class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Layout';
    }
    
    render() {
        return <div>
        	<Header />
            <div style={{'margin-top': '50px'}} className="container">
                <div className="col-md-3">
                    <Paper zDepth={3} rounded={true} >
                        <ListAlbums />
                    </Paper>
                </div>
                <div className="col-md-9">
                    <Paper zDepth={3} rounded={true} >
                        {this.props.children}
                        <UploadQueue />
                    </Paper>
                </div>
            </div>
	    </div>;
    }
}

export default DragDropContext(HTML5Backend)(Layout);
	