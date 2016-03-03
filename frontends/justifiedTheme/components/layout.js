	
import React from 'react';
import LeftPane from './left-pane';
import Header from './header';
import ListAlbums from './list-albums';
import UploadQueue from './upload-queue'
import InfoPanel from './info-panel';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Paper from 'material-ui/lib/paper';

import styles from 'material-ui/lib/styles';
const Colors = styles.Colors;


class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Layout';
    }
    
    render() {
        return <div style={{backgroundColor:Colors.grey100}}>
        	<Header />
            <div className="container-fluid">
                <div className="col-md-2">
                    <ListAlbums />
                </div>
                <div className="col-md-7">
                    {this.props.children}
                    <UploadQueue />
                </div>
                <div className="col-md-3">
                    <Paper>
                        <InfoPanel />
                    </Paper>
                </div>
            </div>
	    </div>;
    }
}

export default DragDropContext(HTML5Backend)(Layout);
	