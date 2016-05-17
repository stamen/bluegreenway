import * as React from 'react';

import MapLayersPicker from '../components/MapLayersPicker';
import MapOverlay from '../components/MapOverlay';
import PageHeader from '../components/PageHeader';

import * as tileLayers from '../../static/tileLayers.json';

let mapObjs = {};

export default class Projects extends React.Component {

	constructor (props) {
		super(props);

		this.onStateChange = this.onStateChange.bind(this);
		this.unsubscribeStateChange = props.store.subscribe(this.onStateChange);
	}

	componentWillMount () {
		var urlMode = this.props.params.mode;
		if (urlMode) {
			this.props.actions.modeChanged(urlMode);
		}
		this.onStateChange();

		if (!this.props.store.getState().geodata.zones.geojson.features) {
			this.props.actions.fetchZoneGeoData();
		}


		if (!this.props.store.getState().projects.data.items.length) {
			this.props.actions.fetchProjectsData();
		} else {

		}

		this.setState({
			maps: {}
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
		if (urlMode !== appMode) {
			this.updateModeUrl(appMode);
		}
		if (nextProps.store.getState().geodata.zones !== this.state.geodata.zones) {
			console.log('getting zone data');
		}
	}

	componentDidUpdate (prevProps, prevState) {
		if (prevState.geodata.zones !== this.state.geodata.zones) {
			console.log('have zone data');
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

	createMiniMaps(zones) {
		const refs = this.refs;
		Object.keys(refs).forEach(key => {
			this.renderMap(key, zones);
		});
	}

	renderMap(id, zoneFeatures) {
		console.log(id, zoneFeatures);
		let map;
		let basemap = L.tileLayer(tileLayers.layers[1].url);
		let zoneLayer;
		let layerId = id.split('-')[1];

		// because of this redux react pattern, this will get called twice
		// for each id. If the map already exists, don't init it again.
		if (layerId in this.state.maps) {
			return false;
		}

		map = L.map(id, {
			zoom: 12,
			center: [37.7439, -122.3895],
			zoomControl: false,
			scrollWheelZoom: false,
			dragging: false,
			touchZoom: false,
			doubleClickZoom: false,
			keyboard: false,
			attributionControl: false,
			zoomAnimation: false
		});

		map.addLayer(basemap);

		zoneLayer = L.geoJson(zoneFeatures, {
			filter: (feature, layer) => {
				return feature.properties.map_id === layerId;
			},
			style: {
				color: '#4DA3BC',
				weight: 2,
				fillColor: '#4DA3BC'
			}
		});

		map.addLayer(zoneLayer);

		map.fitBounds(zoneLayer.getBounds());

		this.setState({
			maps: {...this.state.maps, layerId: map}
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
						<div className='learn-more'><p>Learn More</p></div>
					</div>
					<div className='three columns zone-cell'>
						<h4 className='title'>Pier 70/Central Waterfront</h4>
						<div ref='map-p70' id='map-p70'></div>
						<div className='learn-more'><p>Learn More</p></div>
					</div>
					<div className='three columns zone-cell'>
						<h4 className='title'>India Basin</h4>
						<div ref='map-ib' id='map-ib'></div>
						<div className='learn-more'><p>Learn More</p></div>
					</div>
					<div className='three columns zone-cell'>
						<h4 className='title'>Shipyard Candlestick</h4>
						<div ref='map-sc' id='map-sc'></div>
						<div className='learn-more'><p>Learn More</p></div>
					</div>
				</div>
			</div>
		);
	}

	renderMapView () {
		return (
			<div className="projects-map-overlay two columns">
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
