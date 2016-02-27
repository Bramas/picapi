
var basicContext = require('basiccontext');


var React = require('react');
var ReactDOM = require('react-dom');
import { Link } from 'react-router'
import api from '../api';

class Context extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = '';
    }
    render() {
    	var i = 0;
        return <div>{React.Children.map(this.props.children, (child) => {
		    return React.cloneElement(child, {
		        ref: 'context-'+i
		    });
		})}</div>;
    }
    handleContextMenu(e) {
    	basicContext.show(this.props.items, e);  
    }
    attachEventToChild(child){
    	ReactDOM.findDOMNode(this.refs['context-0']).addEventListener('contextmenu', this.handleContextMenu.bind(this));
    }
    componentDidMount() {
    	this.attachEventToChild(this.props.children[0]);
    	//React.Children.forEach(this.props.children, this.attachEventToChild, this);
    }
    componentDidUpdate(prevProps, prevState) {
     	//this.componentDidMount();
    }
}

export default Context;


