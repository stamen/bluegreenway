// import node modules
import { debounce } from 'lodash';
import * as React from 'react';

// import components from @stamen/panorama
// import { ItemSelector } from '@stamen/panorama';
// Note: can also just `npm install` individual components, and import like so:
// import ItemSelector from '@stamen/itemselector';

import Header from '../components/Header';
import Footer from '../components/Footer';
import MapPageToggle from '../components/MapPageToggle';
import LeafletMap from '../components/LeafletMap';

// config
import tileLayers from '../../static/tileLayers.json';
import sassVars from '../../scss/variables.json';

// main app container
class App extends React.Component {

	constructor (props) {

		super(props);

		// bind event handlers
		this.onWindowResize = debounce(this.onWindowResize.bind(this), 250);
		this.onMapMoved = this.onMapMoved.bind(this);
		this.onAppStateChange = this.onAppStateChange.bind(this);

		// subscribe for future state changes
		props.store.subscribe(this.onAppStateChange);

	}

	// TODO: consider using `react-redux` and making this function into a `mapStateToProps()`
	// would also then want to implement `connect()` and `mapDispatchToProps()`,
	// with App.jsx as a 'container component'. (http://redux.js.org/docs/basics/UsageWithReact.html)
	// If we're going full `react-redux`, might consider moving to use of `<Provider>` as well,
	// but this might require a rewrite of panorama components...not sure.
	onAppStateChange () {

		// Pass whitelisted data from Redux state
		// (as defined by reducers.js) down into components.
		let storeState = this.props.store.getState(),
			componentState = {};

		if (storeState.map) {
			componentState.map = Object.assign({}, storeState.map);
		}

		componentState.mode = storeState.mode;

		/*
		if (storeState.itemSelector) {
			componentState.itemSelector = {
				title: storeState.itemSelector.title,
				items: storeState.itemSelector.items,
				selectedItem: storeState.itemSelector.selectedItem
			};
		}

		if (storeState.exampleComponent) {
			componentState.exampleComponent = {
				inited: storeState.exampleComponent.inited,
				count: storeState.exampleComponent.count
			};
		}
		*/

		// Call `setState()` with the updated data, which causes a re-`render()`
		this.setState(componentState);

	}


	// ============================================================ //
	// React Lifecycle
	// ============================================================ //

	componentWillMount () {

		this.props.actions.modeChanged('page');

		this.computeComponentDimensions();

		// set up initial state
		this.onAppStateChange();

	}

	componentDidMount () {

		window.addEventListener('resize', this.onWindowResize);

	}

	componentWillUnmount () {

		window.removeEventListener('resize', this.onWindowResize);

	}

	shouldComponentUpdate (nextProps, nextState) {

		// Do not re-render if the state change was just map state.
		return !this.mapHashUpdated;

	}

	componentDidUpdate () {

		//

	}



	// ============================================================ //
	// Handlers
	// ============================================================ //

	onMapMoved (event) {

		if (event && event.target && this.state.map.bounds && this.refs.leafletMap) {

			/*
			this.props.actions.mapMoved({
				zoom: event.target.getZoom(),
				// center: event.target.getCenter(),
				bounds: event.target.getBounds()
			});
			*/

			// maintain map bounds when map container resizes
			let map = this.refs.leafletMap.getLeafletElement(),
				currentZoom = map.getZoom(),
				newZoom = map.getBoundsZoom(this.state.map.bounds);

			if (currentZoom != newZoom) {
				this.refs.leafletMap.getLeafletElement().fitBounds(this.state.map.bounds);
			}
		}

	}

	onWindowResize (event) {

		this.computeComponentDimensions();

	}



	// ============================================================ //
	// Helpers
	// ============================================================ //

	computeComponentDimensions () {

		// This state is needed to render, but since it's not something that could be serialized
		// and used to rehydrate the application on init, it exists outside of the application store.

	}



	// ============================================================ //
	// Render functions
	// ============================================================ //

	renderTileLayers () {

		let layers = [];

		if (tileLayers.layers) {
			layers = layers.concat(tileLayers.layers.map((item, i) => {
				return (
					<TileLayer
						key={ 'tile-layer-' + i }
						url={ item.url }
					/>
				);
			}));
		}

		return layers;
	}

	render () {

		return (
			<div>
				<MapPageToggle modeChanged={this.props.actions.modeChanged} mode={this.state.mode} />
				<div className={'background-container' + (this.state.mode === 'map' ? '' : ' blurred')}>
					<LeafletMap {...this.props} />
				</div>
				<Header { ...this.state.header } />

				<div className='content-container'>
					{ this.props.children }
					<Footer { ...this.state.footer } />
				</div>
			</div>
		);

	}

}

export default App;
