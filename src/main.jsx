import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Redirect, Router, Route, IndexRedirect, IndexRoute, useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import { routerReducer, syncHistoryWithStore } from 'react-router-redux';

import App from './views/App.jsx';
import Home from './views/Home.jsx';
import Stories from './views/Stories.jsx';
import Events from './views/Events.jsx';
import Projects from './views/Projects.jsx';
import About from './views/About.jsx';
import RouteNotFound from './views/404.jsx';

import reducers, { initialState } from './reducers';
import actionCreator from './actions';

// Create the single store for this application session
const store = createStore(
	combineReducers({
		...reducers,
		routing: routerReducer
	}),
	initialState
);

// Create the single action creator for this application session
const actions = actionCreator(store);

// Set up a history object whose state will stay in sync with the store,
// using `react-router-redux`
const browserHistory = useRouterHistory(createHistory)({
	basename: process.env.BASE_URL || '/'
});
const history = syncHistoryWithStore(browserHistory, store);

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
	<Router history={ history } createElement={ createReduxComponent }>
		<Route path='/' component={ App }>
			<IndexRoute component={ Home } />
			<Route path='stories' component={ Stories }>
				<Route path=':mode' component={ Stories } />
			</Route>
			<Route path='events' component={ Events }>
				<Route path=':mode' component={ Events } />
			</Route>
			<Route path='projects' component={ Projects }>
				<Route path=':mode' component={ Projects } />
			</Route>
			<Route path='about' component={ About } />
		</Route>
		<Route path='*' component={ RouteNotFound } />
	</Router>
), document.getElementById('app'));
