import * as React from 'react';
import { withRouter } from 'react-router';
import { get } from 'lodash';
import slug from 'slug';

import MapLayersPicker from '../components/MapLayersPicker';
import MapOverlay from '../components/MapOverlay';
import PageHeader from '../components/PageHeader';
import * as tileLayers from '../../static/tileLayers.json';
import { vizJSON } from '../models/common.js';

class Projects extends React.Component {
	static miniMapConfig = [
		{
			id: 'mb',
			title: 'Mission Bay/ Mission Rock'
		},
		{
			id: 'p70',
			title: 'Pier 70/Central Waterfront'
		},
		{
			id: 'ib',
			title: 'India Basin'
		},
		{
			id: 'sc',
			title: 'Shipyard Candlestick'
		}
	];

	constructor (props) {
		super(props);

		this.miniMaps = null;
	}

	componentWillMount () {
		const storeState = this.props.store.getState(),
			geodata = get(storeState.geodata, 'zones.geojson'),
			projects = get(storeState.projects, 'data.items');

		this.props.actions.mapLayersPickerProjectsChange(true);

		if (!geodata || !geodata.features) {
			this.props.actions.fetchZoneGeoData();
		}

		if (!projects || !projects.length) {
			this.props.actions.fetchProjectsData();
		}
	}

	componentDidMount () {
		this.createMiniMaps(get(this.props.store.getState().geodata, 'zones.geojson'));
	}

	componentWillUpdate (nextProps, nextState) {
		const storeState = nextProps.store.getState(),
			{ mode } = nextProps.params,
			geodata = get(storeState.geodata, 'zones.geojson');

		if (mode === 'page') {
			this.createMiniMaps(geodata);
		} else {
			this.destroyMaps();
		}
	}

	destroyMaps () {
		if (!this.miniMaps) return;

		if (this.miniMaps.length) {
			this.miniMaps.forEach(map => map.remove());
		}
		this.miniMaps = null;
	}

	onLearnMoreClick (mapId, e) {
		let geodata = get(this.props.store.getState().geodata, 'zones.geojson'),
			zoneTitleSlug = '',
			zoneId = geodata.features.find(feature => feature.properties.map_id === mapId).properties.map_id;

		if (zoneId === 'mb') {
			zoneTitleSlug = 'mission_bay_mission_rock';
		} else if (zoneId === 'ib') {
			zoneTitleSlug = 'india_basin';
		} else if (zoneId === 'p70') {
			zoneTitleSlug = 'pier_70';
		} else if (zoneId === 'sc') {
			zoneTitleSlug = 'shipyard_candlestick';
		}

		// TODO: this should just be a <Link>, created in renderPageView()
		let { mode } = this.props.params,
			path = `/projects/${ mode }/${ zoneTitleSlug }`;
		this.props.router.push(path);
	}

	createMiniMaps (zones) {
		if (this.miniMaps) return;
		if (!zones || !zones.features) return;

		this.miniMaps = [];

		Projects.miniMapConfig.forEach(mapConfig => {
			this.renderMap(mapConfig.id, zones);
		});
	}

	renderMap (layerId, zoneFeatures) {
		// console.log(id, zoneFeatures);
		// console.log('*******RENDER MINI MAP********');
		let map,
			basemap = L.tileLayer(tileLayers.layers[1].url),
			zoneFeaturesLayer = L.geoJson(zoneFeatures),
			zoneLayer = L.geoJson(zoneFeatures, {
				filter: (feature, layer) => feature.properties.map_id === layerId,
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

		cartodb.createVis(`map-${ layerId }`, vizJSON, options)
			.on('done', (vis, layers) => {
				map = vis.getNativeMap();
				map.addLayer(zoneLayer);
				map.fitBounds(zoneFeaturesLayer.getBounds(), {
					paddingTopLeft: [0, 100],
					paddingBottomRight: [0, 0]
				});
				zoneLayer.bringToFront();

				if (!this.miniMaps) this.miniMaps = [];
				this.miniMaps.push(map);
			})
			.on('error', err => {
				console.warn(err);
			});

	}

	renderPageView () {
		console.log(">>>>> render projects page");
		return (
			<div className='grid-container'>
				<PageHeader />
				<div className='row'>
					{ Projects.miniMapConfig.map(mapConfig => {
						return (
							<div className='three columns zone-cell'>
								<h4 className='title'>{ mapConfig.title }</h4>
								<div id={ `map-${ mapConfig.id }` }></div>
								<div className='learn-more' onClick={ this.onLearnMoreClick.bind(this, mapConfig.id) }>
									<p>Learn More</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	}

	renderMapView () {
		let { mapLayersPicker } = this.props.store.getState();
		console.log(">>>>> render projects map");
		return (
			<div className="projects-map-overlay">
				<MapOverlay collapsible={ true }>
					<MapLayersPicker
						title='Recreation'
						layers={ mapLayersPicker.layers }
						onLayerChange={ this.props.actions.mapLayersPickerLayerChange }
					/>
				</MapOverlay>
				<MapOverlay collapsible={ true }>
					<MapLayersPicker
						title='Transportation'
						layers={ mapLayersPicker.transportation }
						onLayerChange={ this.props.actions.mapLayersPickerTransportationChange }
					/>
				</MapOverlay>
			</div>
		);
	}

	render () {
		let { mode } = this.props.params;
		console.log(">>>>> projects mode:", mode);
		return (
			<div id="projects">
				{ mode === 'page' ? this.renderPageView() : this.renderMapView() }
			</div>
		);
	}

}

export default withRouter(Projects);