	
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
    sendFile(file) {
        var uri = "http://localhost:8080/photos";
        var xhr = new XMLHttpRequest();
        var fd = new FormData();
        
        xhr.open("POST", uri, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                // Handle response.
                alert(xhr.responseText); // handle response.
            }
        };

        xhr.upload.addEventListener("progress", function(e) {
            if (e.lengthComputable) {
              var percentage = Math.round((e.loaded * 100) / e.total);
              console.log(percentage);
            }
          }, false);
        fd.append('upload', file);
        // Initiate a multipart/form-data upload
        xhr.send(fd);  
    }
    render() {
        return <div id="dropzone">
        	<Header />
            <ListAlbums />
	        <div className="container">{this.props.children}</div>
	    </div>;
    }
    handleFileDrop(event) {
        event.stopPropagation();
        event.preventDefault();

        var filesArray = event.dataTransfer.files;
        for (var i=0; i<filesArray.length; i++) {
            this.sendFile(filesArray[i]);
        }
    }
    componentDidMount() {
        /*var dropzone = document.getElementById("dropzone");
        dropzone.ondragover = dropzone.ondragenter = function(event) {
            event.stopPropagation();
            event.preventDefault();
        }
        dropzone.ondrop = this.handleFileDrop.bind(this);*/
    }
}

export default DragDropContext(HTML5Backend)(Layout);
	