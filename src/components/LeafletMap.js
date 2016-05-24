import * as React from 'react';
import { vizJSON } from '../models/common.js';

export default class LeafletMap extends React.Component {
	constructor(props) {
		super(props);
		this.onStateChange = this.onStateChange.bind(this);
		this.unsubscribeStateChange = props.store.subscribe(this.onStateChange);
	}

	componentWillMount() {
		this.onStateChange();

		if (!this.props.store.getState().geodata.projects.geojson.features) {
			this.props.actions.fetchProjectsGeoData();
		}
	}

	componentDidMount() {
		if (this.props.store.getState().geodata.projects.geojson) {
			// if the data has already been stored
			this.initMap(this.props.store.getState().geodata.projects.geojson);
		}
	}

	componentWillUpdate(nextProps, nextState) {
		// console.log(nextState.geodata.projects.geojson,
		// 	nextProps.store.getState().geodata.projects.geojson,
		// 	this.state.geodata.projects.geojson);
		if (!this.state.mapObject && nextState.geodata.projects !==
				this.state.geodata.projects) {
			this.initMap(nextProps.store.getState().geodata.projects.geojson);
		}
	}

	componentDidUpdate(prevProps, prevState) {

	}

	componentWillUnmount() {
		this.unsubscribeStateChange();
	}

	onStateChange () {
		let storeState = this.props.store.getState();
		this.setState(storeState);
	}

	initMap(projectsGeoJSON) {
		// console.log('************ INIT MAP *************');
		const options = {
			cartodb_logo: false,
			center: [37.757450, -122.406235],
			infowindow: false,
			legends: false,
			scrollwheel: false,
			search: false,
			zoom: 13,
			zoomControl: false
		};

		let projectsLayer = L.geoJson(projectsGeoJSON);

		cartodb.createVis('bgw-map', vizJSON, options)
			.on('done', (vis, layers) => {
				// console.log(this, vis, layers);
				const map = vis.getNativeMap();
				// this.setMapControls(map);
				map.addLayer(projectsLayer);
				map.fitBounds(projectsLayer.getBounds(), {
					paddingTopLeft: [0, 0],
					paddingBottomRight: [0, 0]
				});
				projectsLayer.bringToFront();
				this.setState({ mapObject: map });
			})
			.on('error', err => {
				console.warn(err);
			});
	}

	setMapControls(map) {
		new L.Control.Zoom({position: 'bottomright'}).addTo(map);
	}

	render() {
		return (
			<div id='bgw-map' ref='leafletMap' className='map-container' />
		);
	}
}
