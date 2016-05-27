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
  useRouterHistory,
  hashHistory } from 'react-router';
import { createHistory } from 'history';
import { routerReducer, syncHistoryWithStore } from 'react-router-redux';

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
  middleware.push(createLogger());
}

// Create the single store for this application session
const store = createStore(
	combineReducers({
		...reducers,
		routing: routerReducer
	}),
	initialState,
	applyMiddleware(...middleware)
);

// Create the single action creator for this application session
const actions = actionCreator(store);

// Set up a history object whose state will stay in sync with the store,
// using `react-router-redux` IF using server-side rendering:
const browserHistory = useRouterHistory(createHistory)({
	basename: process.env.BASE_URL || '/'
});

// IF NOT using server side rendering just use hashHistory & don't worry about baseurl
const history = syncHistoryWithStore(hashHistory, store);

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
			<Route path='stories' component={ Stories } />
			<Route path='stories/:mode' component={ Stories } />
			<Route path='stories/:mode/:title' component={ Story } />
			<Route path='events' component={ Events } />
			<Route path='events/:mode' component={ Events } />
			<Route path='projects' component={ Projects } />
			<Route path='projects/:mode' component={ Projects } />
      <Route path='projects/:mode/:zone' component={ Zone } />
			<Route path='about' component={ About } />
      <Route path='about/:mode' component={ About } />
		</Route>
		<Route path='*' component={ RouteNotFound } />
	</Router>
), document.getElementById('app'));
