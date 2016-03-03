


var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router'
import api from '../api';
import { renameAlbum } from '../actions';
import { connect } from 'react-redux';



const mapStateToProps = (state, props) => {
  	return {
      	selectionInfo: state.selectionInfo
    }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
  }
}

var React = require('react');

var InfoPanel = React.createClass({
    displayName: 'InfoPanel',
    render() {
        return (
            <div>{this.props.selectionInfo}</div>
        );
    }
});



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InfoPanel);