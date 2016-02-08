
import React from 'react';
import ReactDom  from 'react-dom';

import api from './api';
import Albums from './components/albums';
import Album from './components/album';
import Layout from './components/layout';
import Timeline from './components/timeline'
/*
api.post('Album::getAll', {}, function(data) {
	ReactDom.render(<Albums albums={data.albums} />, document.getElementById('main-container'))
});*/


import { Router, Route, IndexRoute, Link } from 'react-router'

ReactDom.render((
	<Router>
		<Route path="/" component={Layout}>
			<IndexRoute component={Albums}/>
			<Route path="/timeline" component={Timeline}/>
			<Route path="/albums" component={Albums}/>
			<Route path="/album/:albumId" component={Album}/>
		</Route>
	</Router>
), document.getElementById('main-container'))

let photos = []
let timeline = {}


/*
function handleTreeClick(node, toggled){
	var params = {
		year: node.name
	}
	api.post('Plugin::PhotosTimeline::getYear', params, function(data) {
		photos = Object.keys(data.content).map(function (key) {return data.content[key]});
		ReactDom.render(<Layout 
			leftPane={<TreeTimeline data={timeline} onToggle={handleTreeClick}/>}
			mainPane={<Album photos={photos} />} />, document.getElementById('main-container'))
	});

}

api.post('Plugin::PhotosTimeline::getDates', {}, function(data) {
	timeline = data;
	ReactDom.render(<Layout 
		leftPane={<TreeTimeline data={timeline} onToggle={handleTreeClick}/>}
		mainPane={<Album photos={photos} />} />, document.getElementById('main-container'))
});*/