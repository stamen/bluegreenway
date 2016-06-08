import * as React from 'react';

import MapLayersPicker from '../components/MapLayersPicker';
import MapOverlay from '../components/MapOverlay';
import PageHeader from '../components/PageHeader';

import slug from 'slug';

import * as tileLayers from '../../static/tileLayers.json';
import { vizJSON } from '../models/common.js';

export default class Projects extends React.Component {

	constructor (props) {
		super(props);

		this.onStateChange = this.onStateChange.bind(this);
		this.unsubscribeStateChange = props.store.subscribe(this.onStateChange);
	}

	componentWillMount () {
		var urlMode = this.props.params.mode;
		var appMode = this.props.store.getState().mode;

		if (urlMode) {
			this.props.actions.modeChanged(urlMode);
		} else {
			this.updateModeUrl(appMode);
		}

		this.onStateChange();

		if (!this.props.store.getState().geodata.zones.geojson.features) {
			this.props.actions.fetchZoneGeoData();
		}

		if (!this.props.store.getState().projects.data.items.length) {
			this.props.actions.fetchProjectsData();
		}

		this.setState({
			maps: []
		});
	}

	componentDidMount () {
		// if we already have the zone data...
		if (this.state.geodata.zones.geojson) {
			this.createMiniMaps(this.state.geodata.zones.geojson);
		}
	}

	componentWillUpdate(nextProps, nextState) {
		var urlMode = nextProps.params.mode;
		var appMode = nextProps.store.getState().mode;

		console.log(urlMode, appMode);

		if (urlMode !== appMode) {
			if (appMode === 'map') {
				// get rid of the leaflet maps that were drawn for the page view
				this.destroyMaps();
			}
			this.updateModeUrl(appMode);
		}
		if (nextProps.store.getState().geodata.zones !== this.state.geodata.zones) {
			// console.log('getting zone data');
		}
	}

	componentDidUpdate (prevProps, prevState) {
		let prevAppMode = prevState.mode;
		let appMode = this.props.store.getState().mode;
		if (prevState.geodata.zones !== this.state.geodata.zones) {
			this.createMiniMaps(this.state.geodata.zones.geojson);
		}
		if (prevAppMode === 'map' && appMode === 'page' && !this.state.maps.length) {
			// assumes zone geodata was already loaded while user was visiting the map view
			if (!this.state.geodata.zones.geojson) return;
			this.createMiniMaps(this.state.geodata.zones.geojson);
		}
	}

	componentWillUnmount () {
		this.unsubscribeStateChange();
	}

	onStateChange () {
		let storeState = this.props.store.getState();
		this.setState(storeState);
	}

	updateModeUrl (mode) {
		this.props.history.push(`/projects/${mode}`);
	}

	destroyMaps() {
		this.state.maps.forEach(map => {
			map.remove();
		});

		this.setState({
			maps: []
		});
	}

	onLearnMoreClick (mapId, e) {
		let zoneTitleSlug = '';
		let zoneId = this.state.geodata.zones.geojson.features.filter(feature => {
			return feature.properties.map_id === mapId;
		});
		zoneId = zoneId[0].properties.map_id;

		if (zoneId === 'mb') {
			zoneTitleSlug = 'mission_bay_mission_rock';
		} else if (zoneId === 'ib') {
			zoneTitleSlug = 'india_basin';
		} else if (zoneId === 'p70') {
			zoneTitleSlug = 'pier_70';
		} else if (zoneId === 'sc') {
			zoneTitleSlug = 'shipyard_candlestick';
		}

		const mode = this.state.mode;
		const path = `/projects/${mode}/${zoneTitleSlug}`;
		this.props.history.push(path);
	}

	createMiniMaps(zones) {
		const refs = this.refs;
		Object.keys(refs).forEach(key => {
			this.renderMap(key, zones);
		});
	}

	renderMap(id, zoneFeatures) {
		// console.log(id, zoneFeatures);
		// console.log('*******RENDER MINI MAP********');
		let map;
		let basemap = L.tileLayer(tileLayers.layers[1].url);
		let layerId = id.split('-')[1];
		let zoneFeaturesLayer = L.geoJson(zoneFeatures);
		let zoneLayer = L.geoJson(zoneFeatures, {
			filter: (feature, layer) => {
				return feature.properties.map_id === layerId;
			},
			style: {
				color: '#4DA3BC',
				weight: 0,
				fillColor: '#4DA3BC',
				fillOpacity: 1,
				clickable: false
			}
		});

		const options = {
			attributionControl: false,
			cartodb_logo: false,
			center: [37.757450, -122.406235],
			description: false,
			doubleClickZoom: false,
			dragging: false,
			fullscreen: false,
			infowindow: false,
			keyboard: false,
			layer_selector: false,
			legends: false,
			loaderControl: false,
			shareable: false,
			search: false,
			scrollwheel: false,
			search: false,
			scrollWheelZoom: false,
			touchZoom: false,
			zoom: 12,
			zoomAnimation: false,
			zoomControl: false
		};

		cartodb.createVis(id, vizJSON, options)
			.on('done', (vis, layers) => {
				map = vis.getNativeMap();
				map.addLayer(zoneLayer);
				map.fitBounds(zoneFeaturesLayer.getBounds(), {
					paddingTopLeft: [0, 100],
					paddingBottomRight: [0, 0]
				});
				zoneLayer.bringToFront();

				this.setState({
					maps: [...this.state.maps, map]
				});

				// console.log(this.state.maps);
			})
			.on('error', err => {
				console.warn(err);
			});

	}

	render () {
		return (
			<div id="projects">
				{ this.state.mode === 'page' ? this.renderPageView() : this.renderMapView() }
			</div>
		);
	}

	renderPageView () {
		return (
			<div className='grid-container'>
				<PageHeader />
				<div className='row'>
					<div className='three columns zone-cell'>
						<h4 className='title'>Mission Bay/ Mission Rock</h4>
						<div ref='map-mb' id='map-mb'></div>
						<div className='learn-more' onClick={this.onLearnMoreClick.bind(this, 'mb')}>
							<p>Learn More</p>
						</div>
					</div>
					<div className='three columns zone-cell'>
						<h4 className='title'>Pier 70/Central Waterfront</h4>
						<div ref='map-p70' id='map-p70'></div>
						<div className='learn-more' onClick={this.onLearnMoreClick.bind(this, 'p70')}>
							<p>Learn More</p>
						</div>
					</div>
					<div className='three columns zone-cell'>
						<h4 className='title'>India Basin</h4>
						<div ref='map-ib' id='map-ib'></div>
						<div className='learn-more' onClick={this.onLearnMoreClick.bind(this, 'ib')}>
							<p>Learn More</p>
						</div>
					</div>
					<div className='three columns zone-cell'>
						<h4 className='title'>Shipyard Candlestick</h4>
						<div ref='map-sc' id='map-sc'></div>
						<div className='learn-more' onClick={this.onLearnMoreClick.bind(this, 'sc')}>
							<p>Learn More</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	renderMapView () {
		return (
			<div className="projects-map-overlay">
				<MapOverlay collapsible={true}>
					<MapLayersPicker
						layers={this.state.mapLayersPicker.layers}
						onLayerChange={this.props.actions.mapLayersPickerLayerChange}
						transportation={this.state.mapLayersPicker.transportation}
						onTransportationChange={this.props.actions.mapLayersPickerTransportationChange}
						/>
				</MapOverlay>
			</div>
		);
	}

}
