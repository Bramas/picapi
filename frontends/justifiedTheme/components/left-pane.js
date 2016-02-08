

var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router'
import api from '../api';


module.exports = React.createClass({

  getInitialState () {
    return {
      photos: []
    }
  },

	render () {
		return <div><Link to="/albums">Albums</Link><Link to="/timeline">Timeline</Link></div>;
	}

})