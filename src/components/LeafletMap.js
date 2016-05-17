import * as React from 'react';
import { vizJSON } from '../models/common.js';

export default class LeafletMap extends React.Component {
	constructor(props) {
		super(props);
		this.onStateChange = this.onStateChange.bind(this);
		this.unsubscribeStateChange = props.store.subscribe(this.onStateChange);
		this.initMap = this.initMap.bind(this);
		this.setMapControls = this.setMapControls.bind(this);
	}

	componentWillMount() {
		this.onStateChange();
	}

	componentDidMount() {
		this.initMap();
	}

	componentWillUpdate(nextProps) {

	}

	componentWillUnmount() {
		this.unsubscribeStateChange();
	}

	onStateChange () {
		let storeState = this.props.store.getState().map;
		this.setState({ mapSettings: storeState });
	}

	initMap() {
		// const vizJSON = 'https://stamen.cartodb.com/u/stamen-org/api/v2/viz/4d180fa8-0e3d-11e6-aa9a-0ea31932ec1d/viz.json';
		const options = {
			cartodb_logo: false,
			center: [37.757450, -122.406235],
			infowindow: false,
			legends: false,
			scrollwheel: false,
			search: false,
			zoom: 14,
			zoomControl: false
		};
		cartodb.createVis('map', vizJSON, options)
			.on('done', (vis, layers) => {
				// console.log(this, vis, layers);
				const map = vis.getNativeMap();
				this.setMapControls(map);
				this.setState({ mapObject: map });
			})
			.on('error', err => {
				console.warn(err);
			});
	}

	setMapControls(map) {
		// new L.Control.Zoom({position: 'bottomright'}).addTo(map);
	}

	render() {
		return (
			<div id='map' ref='leafletMap' className='map-container' />
		);
	}
}
