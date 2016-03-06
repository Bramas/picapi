

var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router'
import api from '../api';
import { createAlbum, renameAlbum, deleteAlbum, renamePhoto, deletePhoto, albumMovePhoto } from '../actions';


import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';

export class DeleteAlbumDialog extends React.Component {
    handleClose() {
      this.props.onClose();
    }
    handleSubmit() {
      
      api.store.dispatch(deleteAlbum(this.props.id));
      this.props.onClose();
    }
    render() {

        const actions = [
          <FlatButton
            label="Cancel"
            secondary={true}
            onTouchTap={this.handleClose.bind(this)}
          />,
          <FlatButton
            label="Delete"
            primary={true}
            keyboardFocused={true}
            onTouchTap={this.handleSubmit.bind(this)}
          />,
        ];
        return <Dialog
          title="Delete Album"
          actions={actions}
          modal={false}
          open={this.props.open}
          onRequestClose={this.handleClose.bind(this)} >
            Are you sure you want to delete this album?
        </Dialog>;
    }
}

export class RenameAlbumDialog extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'RenameDialog';
    }
    handleClose() {
      this.props.onClose();
    }
    handleSubmit() {
      api.store.dispatch(renameAlbum(this.props.id, this.refs['title'].getValue()));
      this.props.onClose();
    }
    render() {

        const actions = [
          <FlatButton
            label="Cancel"
            secondary={true}
            onTouchTap={this.handleClose.bind(this)}
          />,
          <FlatButton
            label="Submit"
            primary={true}
            keyboardFocused={true}
            onTouchTap={this.handleSubmit.bind(this)}
          />,
        ];
        return <Dialog
          title="Rename Album"
          actions={actions}
          modal={false}
          open={this.props.open}
          onRequestClose={this.handleClose.bind(this)} >
            <TextField ref="title"
              hintText="Album Name"
              defaultValue={this.props.title}
              floatingLabelText="Album Name"
            />
        </Dialog>;
    }
}

export class CreateAlbumDialog extends React.Component {
    handleClose() {
      this.props.onClose();
    }
    handleSubmit() {
      api.store.dispatch(createAlbum(this.refs['title'].getValue()));
      this.props.onClose();
    }
    render() {

        const actions = [
          <FlatButton
            label="Cancel"
            secondary={true}
            onTouchTap={this.handleClose.bind(this)}
          />,
          <FlatButton
            label="Submit"
            primary={true}
            keyboardFocused={true}
            onTouchTap={this.handleSubmit.bind(this)}
          />,
        ];
        return <Dialog
          title="Create Album"
          actions={actions}
          modal={false}
          open={this.props.open}
          onRequestClose={this.handleClose.bind(this)} >
            <TextField ref="title"
              hintText="Album Name"
              floatingLabelText="Album Name"
            />
        </Dialog>;
    }
}


export class DeletePhotoDialog extends React.Component {
    handleClose() {
      this.props.onClose();
    }
    handleSubmit() {
      
      api.store.dispatch(deletePhoto(this.props.id));
      this.props.onClose();
    }
    render() {

        const actions = [
          <FlatButton
            label="Cancel"
            secondary={true}
            onTouchTap={this.handleClose.bind(this)}
          />,
          <FlatButton
            label="Delete"
            primary={true}
            keyboardFocused={true}
            onTouchTap={this.handleSubmit.bind(this)}
          />,
        ];
        return <Dialog
          title="Delete Photo"
          actions={actions}
          modal={false}
          open={this.props.open}
          onRequestClose={this.handleClose.bind(this)} >
            Are you sure you want to delete this photo?
        </Dialog>;
    }
}

export class RenamePhotoDialog extends React.Component {
    handleClose() {
      this.props.onClose();
    }
    handleSubmit() {
      api.store.dispatch(renamePhoto(this.props.id, this.refs['title'].getValue()));
      this.props.onClose();
    }
    render() {

        const actions = [
          <FlatButton
            label="Cancel"
            secondary={true}
            onTouchTap={this.handleClose.bind(this)}
          />,
          <FlatButton
            label="Submit"
            primary={true}
            keyboardFocused={true}
            onTouchTap={this.handleSubmit.bind(this)}
          />,
        ];
        return <Dialog
          title="Rename Photo"
          actions={actions}
          modal={false}
          open={this.props.open}
          onRequestClose={this.handleClose.bind(this)} >
            <TextField ref="title"
              hintText="Photo Name"
              defaultValue={this.props.title}
              floatingLabelText="Album Photo"
            />
        </Dialog>;
    }
}