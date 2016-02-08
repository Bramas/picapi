'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {Treebeard} from '../lib/react-treebeard/index';


class TreeExample extends React.Component {
	constructor(props){
		super(props);
	}
	onToggle(node, toggled){
		if(this.props.onToggle)
		{
			this.props.onToggle(node, toggled);
		}
	}
	render(){
		let data = {
			name: 'root',
			toggled: true,
			children: []
		};
		for(let year in this.props.data){
			let months = {name:year, children:[]}
			for(let month in  this.props.data[year]){
				months.children.push({name:month, terminal:true});
			}
			data.children.push(months);
		}
		console.log(data);
		return (
			<Treebeard
				data={data}
				onToggle={this.onToggle.bind(this)}
			/>
		);
	}
}

module.exports = TreeExample;