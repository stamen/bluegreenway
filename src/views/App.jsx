// import node modules
import { debounce } from 'lodash';
import * as React from 'react';
import { withRouter } from 'react-router';

import Header from '../components/Header';
import Footer from '../components/Footer';
import MapPageToggle from '../components/MapPageToggle';
import MapLayersPicker from '../components/MapLayersPicker';
import MapOverlay from '../components/MapOverlay';
import LeafletMap from '../components/LeafletMap';

// config
import tileLayers from '../../static/tileLayers.json';

// main app container
class App extends React.Component {

	constructor (props) {
		super(props);

		// bind event handlers
		this.onAppStateChange = this.onAppStateChange.bind(this);
		this.onHashChange = this.onHashChange.bind(this);
		
		// subscribe for future state changes
		props.store.subscribe(this.onAppStateChange);

		window.addEventListener('hashchange', this.onHashChange);
		this.onHashChange();
	}

	componentWillMount () {
		// set up initial state
		this.onAppStateChange();
	}

	componentWillUpdate (nextProps, nextState) {
		let contentContainer = this.refs.contentContainer;
		let footer = this.refs.footer;
		let mode = nextProps.params.mode || 'page';

		if (contentContainer) {
			if (mode === 'map' && !contentContainer.classList.contains('map-view-enabled')) {
				contentContainer.classList.add('map-view-enabled');
				this.setState({ showFooter: false });
			} else if (mode === 'page' && contentContainer.classList.contains('map-view-enabled')) {
				contentContainer.classList.remove('map-view-enabled');
				this.setState({ showFooter: true });
			}
		}
	}

	onHashChange (event) {
		let url = document.location.pathname + document.location.search + document.location.hash;
		if (this.lastUrl === url) return;
		this.lastUrl = url;

		// Track hash changes in Google Analytics as virtual pageviews
		// https://developers.google.com/analytics/devguides/collection/analyticsjs/single-page-applications#tracking_virtual_pageviews
		window.ga('set', 'page', url);
		window.ga('send', 'pageview');
	}

	onAppStateChange () {
		// Pass whitelisted data from Redux state
		// (as defined by reducers.js) down into components.
		let storeState = this.props.store.getState(),
			componentState = {};

		if (storeState.map) {
			componentState.map = Object.assign({}, storeState.map);
		}

		let mode = this.props.params.mode || 'page';
		componentState.mode = mode;
		componentState.showFooter = mode === 'page';
		componentState.menuOpen = storeState.menuOpen;

		// Call `setState()` with the updated data, which causes a re-`render()`
		this.setState(componentState);
	}

	render () {
		// pass props down to route view
		let childrenWithProps = React.Children.map(this.props.children, child => React.cloneElement(child, ...this.props));
		let mode = this.props.params.mode || 'page';

		document.querySelector('body').classList[mode === 'map' ? 'add' : 'remove']('no-scroll');

		return (
			<div>
			<MapPageToggle currentLocation={ this.props.location } mode={ mode } />
				<div className={ 'background-container' + (mode === 'map' ? '' : ' blurred') }>
					<LeafletMap { ...this.props } />
				</div>
				<Header actions={this.props.actions} menuOpen={ this.state.menuOpen } mode={ mode } />

				<div ref='contentContainer' className='content-container'>
					{ childrenWithProps }
					{ this.state.showFooter? <Footer /> : null }
				</div>
			</div>
		);
	}

}

export default withRouter(App);
