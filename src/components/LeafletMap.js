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
		if (!this.state.mapObject && nextState.geodata.projects !==
				this.state.geodata.projects) {
			this.initMap(nextProps.store.getState().geodata.projects.geojson);
		}
		if (this.state.mapLayers && nextState.mapLayersPicker !== this.state.mapLayersPicker) {
			this.updateMapLayers(nextState.mapLayersPicker);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.mapObject) {
			// i know, i know...
			$('.leaflet-control-attribution.leaflet-control').remove();
		}
	}

	componentWillUnmount() {
		this.unsubscribeStateChange();
	}

	onStateChange () {
		let storeState = this.props.store.getState();
		this.setState(storeState);
	}

	updateMapLayers (mapLayersPicker) {
		if (mapLayersPicker.transportation[0].checked) {
			this.state.mapLayers.biking.show();
		} else if (!mapLayersPicker.transportation[0].checked) {
			this.state.mapLayers.biking.hide();
		}
	}

	initMap(projectsGeoJSON) {
		const options = {
			cartodb_logo: false,
			center: [37.757450, -122.406235],
			dragging: true,
			infowindow: false,
			legends: false,
			scrollwheel: true,
			search: false,
			zoom: 13,
			zoomControl: false
		};

		let projectsLayer = L.geoJson(projectsGeoJSON,{
			style: feature => {
				// to do: style features based on a bgw_zone_id
			}
		});

		cartodb.createVis('bgw-map', vizJSON, options)
			.on('done', (vis, layers) => {
				// console.log(vis, layers);
				// the first layer (layers[0]) is typically the basemap used in the visualization
				// the second layer is the one containing the actual styled geodata layers
				// cartodb.js refers to these as "subLayers", yes it's confusing!
				const layer = layers[1];
				const sublayerCount = layer.getSubLayerCount();
				let sublayers = {};

				// we can iterate over subLayers like this
				for (let i = 0; i < sublayerCount; i++) {
					// layer.getSubLayer(i).hide();
				}

				// typically it's useful to store them like so:
				sublayers.biking = layer.getSubLayer(3);
				sublayers.bgwline = layer.getSubLayer(2);
				sublayers.zones = layer.getSubLayer(1);

				// to get the Leaflet map object
				const map = vis.getNativeMap();
				this.setMapControls(map);

				// add the Projects GeoJSON overlay
				map.addLayer(projectsLayer);
				map.fitBounds(projectsLayer.getBounds(), {
					paddingTopLeft: [0, 0],
					paddingBottomRight: [0, 0]
				});
				projectsLayer.bringToFront();

				this.setState({
					mapObject: map,
					mapLayers: sublayers
				});
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
