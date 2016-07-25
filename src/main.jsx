import React from 'react';
import { render } from 'react-dom';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { Redirect,
	Router,
	Route,
	IndexRedirect,
	IndexRoute,
	applyRouterMiddleware,
	useRouterHistory,
	hashHistory } from 'react-router';
import useScroll from 'react-router-scroll';
import { createHashHistory } from 'history';

import App from './views/App.jsx';
import Home from './views/Home.jsx';
import Stories from './views/Stories.jsx';
import Story from './views/Story.jsx';
import Events from './views/Events.jsx';
import Projects from './views/Projects.jsx';
import Zone from './views/Zone.jsx';
import About from './views/About.jsx';
import RouteNotFound from './views/404.jsx';

import reducers, { initialState } from './reducers';
import actionCreator from './actions';

const middleware = [thunkMiddleware];

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
	// redux-logger only works in a browser environment
	// middleware.push(createLogger());
}

// Create the single store for this application session
const store = createStore(
	combineReducers(reducers),
	initialState,
	applyMiddleware(...middleware)
);

// Create the single action creator for this application session
const actions = actionCreator(store);

// set up hash history without querystring cruft (e.g. ?_k=xi50sh)
// from: https://github.com/reactjs/react-router/blob/master/upgrade-guides/v2.0.0.md#using-custom-histories
const appHistory = useRouterHistory(createHashHistory)({
	queryKey: false
});

// Pass the session store and actionCreator into
// every component created by `react-router`.
// Within each component, the store and action creator
// will be available as `props.store` / `props.actions`.
const createReduxComponent = (Component, props) => {
	let propsWithStore = Object.assign({}, props, { store, actions });
	return <Component { ...propsWithStore } />;
};

// Render the app as `react-router` <Route>s, within a <Router>
render((
	<Router history={ appHistory } createElement={ createReduxComponent } render={applyRouterMiddleware(useScroll())}>
		<Route path='/' component={ App }>
			<IndexRedirect to='home' />
			<Route path='home'>
				<IndexRedirect to='page' />
				<Route path=':mode' component={ Home } name='Home' />
			</Route>

			<Route path='stories'>
				<IndexRedirect to='page' />
				<Route path=':mode' component={ Stories } name='Stories' />
				<Route path=':mode/:title' component={ Story } name='Story' />
			</Route>

			<Route path='events'>
				<IndexRedirect to='page' />
				<Route path=':mode' component={ Events } name='Events' />
			</Route>

			<Route path='projects'>
				<IndexRedirect to='page' />
				<Route path=':mode' component={ Projects } name='Projects' />
				<Route path='page/:zone' component={ Zone } name='Zone' />
				<Route path=':mode/:zone' component={ Projects } name='Projects' />
			</Route>

			<Route path='about'>
				<IndexRedirect to='page' />
				<Route path=':mode' component={ About } name='About' />
			</Route>
		</Route>
		<Route path='*' component={ RouteNotFound } />
	</Router>
), document.getElementById('app'));

// Inject SVG (compiled in build step) into document, for cross-browser support.
// Some day, there will be a better way.
// https://css-tricks.com/ajaxing-svg-sprite/
let xhr = new XMLHttpRequest();
xhr.open('GET', './img/icons.svg', true);
xhr.addEventListener('load', event => {
	let svgContainer = document.createElement('div');
	svgContainer.classList.add('icons-svg');
	svgContainer.style.display = 'none';
	svgContainer.innerHTML = xhr.responseText;
	document.body.insertBefore(svgContainer, document.body.firstChild);
});
xhr.send();
