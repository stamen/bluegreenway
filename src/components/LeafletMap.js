import * as React from 'react';
import { vizJSON } from '../models/common.js';
import { get } from 'lodash';

export default class LeafletMap extends React.Component {
	constructor(props) {
		super(props);

		this.mapState = {
			initing: false,
			layers: null,
		};
	}

	componentWillMount() {
		const storeState = this.props.store.getState();
		if (!get(storeState, 'geodata.projects.geojson.features')) {
			this.props.actions.fetchProjectsGeoData();
		}
	}

	componentDidMount() {
		const storeState = this.props.store.getState();
		this.initMap(get(storeState, 'geodata.projects.geojson'));
	}

	componentWillUpdate(nextProps, nextState) {
		const storeState = nextProps.store.getState();
		this.initMap(get(storeState, 'geodata.projects.geojson'));

		this.updateMapLayers(storeState.mapLayersPicker);
	}

	componentDidUpdate(prevProps, prevState) {
		// hide controls after map has initialized
		if (this.mapState.layers) {
			// i know, i know...
			$('.leaflet-control-attribution.leaflet-control').remove();
		}
	}

	updateMapLayers (mapLayersPicker) {
		if (!this.mapState.layers) return;

		if (mapLayersPicker.transportation[0].checked) {
			this.mapState.layers.biking.show();
		} else if (!mapLayersPicker.transportation[0].checked) {
			this.mapState.layers.biking.hide();
		}
	}

	initMap(projectsGeoJSON) {
		// if already inited, or begun initing, bail
		if (this.mapState.initing || this.mapState.layers) return;

		// invalid geojson
		if (!projectsGeoJSON || !projectsGeoJSON.features) return;

		this.mapState.initing = true;

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

				// to get the Leaflet map object
				let map = vis.getNativeMap();

				const initMap = () => {
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

					this.setMapControls(map);

					// add the Projects GeoJSON overlay
					map.addLayer(projectsLayer);
					map.fitBounds(projectsLayer.getBounds(), {
						paddingTopLeft: [0, 0],
						paddingBottomRight: [0, 0],
						animate: false
					});
					projectsLayer.bringToFront();

					this.mapState.initing = false;
					this.mapState.layers = sublayers;

					this.forceUpdate();

				};

				// wait to intiialize until Leaflet is ready.
				if (map._loaded) {
					initMap();
				} else {
					map.on('load', initMap);
				}

			})

			.on('error', err => {
				console.warn(err);
			});
	}

	setMapControls(map) {
		new L.Control.Zoom({position: 'bottomright'}).addTo(map);
	}

	render() {
		// note: map container stays hidden until cartodb is fully initialized.
		return (
			<div id='bgw-map' ref='leafletMap' className={ `map-container${ !this.mapState.layers ? ' hidden': '' }` } />
		);
	}
}
