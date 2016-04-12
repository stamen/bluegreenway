// import node modules
import { debounce } from 'lodash';
import * as React from 'react';
import { Map, TileLayer, GeoJson } from 'react-leaflet';

// import components from @stamen/panorama
import { ItemSelector } from '@stamen/panorama';
// Note: can also just `npm install` individual components, and import like so:
// import ItemSelector from '@stamen/itemselector';

// local (not installed via npm) components (views)
import ExampleComponent from '../components/ExampleComponent.jsx';

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
		this.onItemSelected = this.onItemSelected.bind(this);
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

		// Call `setState()` with the updated data, which causes a re-`render()`
		this.setState(componentState);

	}


	// ============================================================ //
	// React Lifecycle
	// ============================================================ //

	componentWillMount () {

		this.computeComponentDimensions();

		setTimeout(() => {
			this.props.actions.exampleComponentInitialized();
		}, 1000);

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

		if (event && event.target) {
			this.props.actions.mapMoved({
				zoom: event.target.getZoom(),
				center: event.target.getCenter()
			});
		}

	}

	onWindowResize (event) {

		this.computeComponentDimensions();

	}

	onItemSelected (value, index) {
		this.props.actions.itemSelected(value);
	}



	// ============================================================ //
	// Helpers
	// ============================================================ //

	computeComponentDimensions () {

		let bottomRowHeight,
			dimensions = {};

		// Calculate bottom row height as set by media breakpoints
		let bottomRowEl = document.querySelector('.bottom-row'),
			bottomRowHeightStyle;

		if (bottomRowEl) {
			bottomRowHeightStyle = window.getComputedStyle(bottomRowEl);
			bottomRowHeight = bottomRowEl.offsetHeight + parseFloat(bottomRowHeightStyle.marginTop.replace('px', '')) + parseFloat(bottomRowHeightStyle.marginBottom.replace('px', ''));
		} else {
			bottomRowHeight = window.innerWidth < sassVars.breakpoints.width.large ? sassVars.breakpoints.bottomRow.height.small : sassVars.breakpoints.bottomRow.height.large;
		}

		dimensions.upperRight = {
			height: window.innerHeight - bottomRowHeight - 3 * sassVars.app.containerPadding
		};
		dimensions.upperLeft = {
			height: dimensions.upperRight.height - sassVars.header.height
		};
		dimensions.lowerLeft = {
			height: bottomRowHeight - 2 * sassVars.app.containerPadding
		};
		dimensions.lowerRight = {
			height: dimensions.lowerLeft.height
		};

		// This state is needed to render, but since it's not something that could be serialized
		// and used to rehydrate the application on init, it exists outside of the application store.
		this.setState({ dimensions: dimensions });

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
			<div className='container full-height'>

				<div className='row full-height'>
					<div className='columns eight left-column full-height'>
						<header className='row u-full-width'>
							<h1><span className='header-main'>Panorama Template</span></h1>
						</header>
						<div className='row top-row template-tile' style={ { height: this.state.dimensions.upperLeft.height + 'px' } }>
						<Map { ...this.state.map } onLeafletMoveend={ this.onMapMoved }>
								{ this.renderTileLayers() }
							</Map>
						</div>
						<div className='row bottom-row template-tile'>
							<ExampleComponent { ...this.props } { ...this.state.exampleComponent } />
						</div>
					</div>
					<div className='columns four right-column full-height'>
						<div className='row top-row template-tile' style={ { height: this.state.dimensions.upperRight.height + 'px' } }>
							<ItemSelector { ...this.state.itemSelector } onItemSelected={ this.onItemSelected } />
						</div>
						<div className='row bottom-row template-tile'>
						</div>
					</div>
				</div>

			</div>
		);

	}

}

export default App;
