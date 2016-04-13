// import node modules
import { debounce } from 'lodash';
import * as React from 'react';
import { Map, TileLayer, GeoJson } from 'react-leaflet';

// import components from @stamen/panorama
// import { ItemSelector } from '@stamen/panorama';
// Note: can also just `npm install` individual components, and import like so:
// import ItemSelector from '@stamen/itemselector';

import Header from '../components/header';

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
				<div className='background-container'>
					<Map { ...this.state.map } ref='leafletMap' onLeafletMoveend={ this.onMapMoved } className='map-container'>
						{ this.renderTileLayers() }
					</Map>
				</div>
				<Header { ...this.state.header } />
				<div style={{position: 'relative', width: '15em', backgroundColor: 'white', margin: '1em', padding: '0.5em'}}>
					A snake slithers across a tree branch, past what looks like the large iris of a flower. The flower blinks. It's the eye of the raptor. Muldoon sees it. He raises his gun. Instead of running away again, the raptor rises slowly out of the brush, fully revealing itself to Muldoon, hissing at him. The corners of Muldoon's mouth twitch up into a smile. He draws a bead on the animal. His finger tenses on the trigger. Suddenly, his smile vanishes, both eyes pop open, and a terrible thought sweeps across his face. His eyes flick to the side "Clever girl"

					Muldoon whisks in through the double doors. Hammond is right behind him. They go straight to the main console, where RAY ARNOLD fortyish, a chronic worrier and chain-smoker, is seated. "National Weather Service is tracking a tropical storm about seventy-five miles west of us." Hammond sighs and looks over Arnold's shoulder. "Why didn't I build in Orlando?" "I'll keep an eye on it. Maybe it'll swing south like the last one." "Ray, start the tour program." He punches a button on the console. "Hold on to your butts!"

					A worker climbs to the top of the crate. The search lights are trained on the door. The rifleman throw the bolts on their rifles and crack their stun guns, sending arcs of current cracking through the air. The worker gets ready to grab the gate when all at once A roar from the inside the crate, and the panel flies out of his hands and smacks into him, knocking him clear off the crate. Now everything happens at once. The worker thuds to the jungle floor, the crate jerks away from the mouth of the holding pen flash, an alarm buzzer sounds "Shoot her!"

					Ned looks up and sees a man get out of a taxi - Lewis Dodson, fiftyish, wearing a large straw hat and looking almost too much like an American tourist. Dodson clutches as attaché case close to him and scans the cafe furtively. Nedry laughs, shakes his head, and waves to him. "Dodgson!" Dodgson hurries over to the table. "You shouldn't use my name." "Dodgson, Dodgson! We got Dodgson here! See, nobody cares. Nice hat. What are you trying to look like, a secret agent?"

					"John, the kind of control you're attempting is not possible. If there's one thing the history of evolution has taught us, it's that life will not be contained. Life breaks free. It expands to new territories. It crashes through barriers. Painfully, maybe even dangerously, but and...well, there it is." Ellie listens to him, impressed. Watch her head - support her head. Grant, ignoring the others, picks up the baby dinosaur, and holds it on the palm of his hand, under the incubator's heat light. He spreads the tiny animal out on the back of his hand and delicately runs his finger over its tail, counting the vertebrae. A look of puzzled recognition crosses his face. "You're implying that a group of composed entirely of females will breed?" "I'm simply saying that life - - finds a way.

					You're implying that a group composed entirely of female animals will... breed? Dr. Ian Malcolm: No, I'm, I'm simply saying that life, uh... finds a way.

					You know the first attraction I ever built when I came down south from Scotland? It was a Flea Circus, Petticoat Lane. Really quite wonderful. We had a wee trapeze, and ah, a merry-go - -a carousel - - and a seesaw. They all moved, motorized of course, but people would swear they could see the fleas. "I see the fleas, mummy! Can't you see the fleas?" Clown fleas, high wire fleas, fleas on parade... But with this place, I wanted to show them something that wasn't an illusion, something that was real, something they could see and touch. An aim not devoid of merit.

					God creates dinosaurs. God destroys dinosaurs. God creates man. Man destroys God. Man creates dinosaurs. Dinosaurs eat man... woman inherits the earth.

					I was overwhelmed by the power of this place; but I made a mistake, too. I didn't have enough respect for that power and it's out now. The only thing that matters now are the people we love: Alan and Lex and Tim. John, they're out there where people are dying.

					We can make it if we run. No, we can't. Why not? Because we are being hunted. Oh God. In the bushes straight ahead. It's all right. Like hell it is!
				</div>
			</div>
		);

	}

}

export default App;
