import * as React from 'react';
import { get } from 'lodash';
import centroid from 'turf-centroid';
import slug from 'slug';
import ReactDOM from 'react-dom';
import { queue } from 'd3-queue';

import { vizJSON } from '../models/common.js';
import Event from './Event';
import Story from './Story';
import sassVars from '../../scss/variables.json';
import * as dataURLs from '../../static/dataUrls.json';

// TODO: move these to variables.json
const layerStyles = {
	'open space': {
		weight: 1.5,
		opacity: 0,
		color: '#46beae',
		fillOpacity: 0
	},
	'project': {
		weight: 1.5,
		opacity: 0,
		color: '#2e7042',
		fillOpacity: 0
	},
	'highlighted': {
		opacity: 0.75,
		color: '#000000',
		weight: 2,
		fillColor: '#ffff66',
		fillOpacity: 0.8
	}
};

export default class LeafletMap extends React.Component {
	constructor (props) {
		super(props);

		this.mapState = {
			initing: false,
			map: null,
			layers: null,
			projects: {
				layerData: {},
				popups: {}
			}
		};

		this.onMapClicked = this.onMapClicked.bind(this);
	}

	componentWillMount () {
		const storeState = this.props.store.getState();
		if (!get(storeState, 'geodata.projects.geojson.features')) {
			this.props.actions.fetchProjectsGeoData();
		}
	}

	componentDidMount () {
		const storeState = this.props.store.getState();
		this.initMap(get(storeState, 'geodata.projects.geojson'));
	}

	componentWillUpdate (nextProps, nextState) {
		const storeState = nextProps.store.getState();
		this.initMap(get(storeState, 'geodata.projects.geojson'));

		this.updateMapLayers(storeState);
	}

	componentDidUpdate (prevProps, prevState) {
		// hide controls after map has initialized
		if (this.mapState.map) {
			// i know, i know...
			$('.leaflet-control-attribution.leaflet-control').remove();
		}
	}

	updateMapLayers (storeState) {
		if (!this.mapState.map) return;

		let { mapLayersPicker, projects } = storeState;

		// TODO: DRY this out
		if (mapLayersPicker.transportation[0].checked) {
			this.mapState.layers.biking.show();
		} else {
			this.mapState.layers.biking.hide();
		}

		if (mapLayersPicker.transportation[1].checked) {
			this.mapState.layers.green_connections.show();
		} else {
			this.mapState.layers.green_connections.hide();
		}

		if (mapLayersPicker.layers[0].checked) {
			this.mapState.layers.pois.show();
		} else {
			this.mapState.layers.pois.hide();
		}

		// toggle marker layers, creating on-demand as needed
		['stories', 'events'].forEach(type => {
			if (mapLayersPicker[type]) {
				if (!this.mapState.layers[type]) {
					this.createMarkerMapLayer(type);
				}
				if (this.mapState.layers[type]) {
					// show it only if it's already been created
					this.mapState.map.addLayer(this.mapState.layers[type]);
				}
			} else if (this.mapState.layers[type]) {
				// hide it only if it's already been created
				this.mapState.map.removeLayer(this.mapState.layers[type]);
			}
		});

		// commented out to always show projects interaction layer
		if (mapLayersPicker.projects) {
			this.mapState.map.addLayer(this.mapState.layers.projects);
		} else {
			this.mapState.map.removeLayer(this.mapState.layers.projects);
		}

		if (projects.selectedProject) {
			let popup = this.mapState.projects.popups[projects.selectedProject.id];

			// If popup has not yet been created, create it
			if (!popup) {
				this.initProjectPopup(projects.selectedProject);
				popup = this.mapState.projects.popups[projects.selectedProject.id];
			}

			// ...and then open it.
			if (popup) {
				popup.openOn(this.mapState.map);
			}
		}

		// set layer highlights
		let selectedProjectId = projects.selectedProject && projects.selectedProject.id,
			projectFeature,
			projectStyle;
		Object.keys(this.mapState.projects.layerData).forEach(projectId => {
			projectFeature = this.mapState.projects.layerData[projectId];
			if (projectId == selectedProjectId) {
				projectStyle = layerStyles.highlighted;
			} else {
				projectStyle = layerStyles[projectFeature.feature.properties.category];
			}
			projectFeature.layer.setStyle(projectStyle);
		});
	}

	initMap (projectsGeoJSON) {
		// if already inited, or begun initing, bail
		if (this.mapState.initing || this.mapState.map) return;

		// invalid geojson
		if (!projectsGeoJSON || !projectsGeoJSON.features) return;

		this.mapState.initing = true;

		// cartodb viz.json urls
		const vizJSONURLs = [
			dataURLs.mapBasemap,
			dataURLs.mapGreenConnections,
			dataURLs.mapBicycleRoutes,
			dataURLs.mapBGWLine,
			dataURLs.mapPOIs,
			dataURLs.mapLabels
		];

		const mapOptions = {
			center: [37.757450, -122.406235],
			zoom: 13,
			zoomControl: false
		};

		const layerOptions = {
			tooltip: false,
			legends: false,
			infowindow: false
		};

		let projectsLayer = this.createProjectsMapLayer(projectsGeoJSON);

		const map = L.map('bgw-map', mapOptions);

		const q = queue(vizJSONURLs.length + 1);

		vizJSONURLs.forEach(vizJSON => {
			q.defer((vizJSON, callback) => {
				cartodb.createLayer(map, vizJSON, layerOptions, (layer) => {
					callback(null, layer);
				});
			}, vizJSON);
		});

		q.await(function (error, arvg) {
			if (error) throw error;
			let cartodbLayers = Array.prototype.slice.call(arguments, 1);
			cartodbLayers.forEach((layer, index) => {
				// make labels & BGW line are always on top
				layer.addTo(map).setZIndex(index);
			});
			configMap(cartodbLayers);
		});

		// stuff to do after cartodb layers have loaded...
		const configMap = (cartodbLayers) => {
			let sublayers = {};
			sublayers.zones = cartodbLayers[0];
			sublayers.green_connections = cartodbLayers[1];
			sublayers.biking = cartodbLayers[2];
			sublayers.bgwLine = cartodbLayers[3];
			sublayers.pois = cartodbLayers[4];
			sublayers.mapLabels = cartodbLayers[5];
			this.setMapControls(map);

			let leftPadding = Math.max(0, (window.innerWidth - sassVars.breakpoints.width.small));
			map.fitBounds(projectsLayer.getBounds(), {
				paddingTopLeft: [leftPadding, sassVars.header.height],
				paddingBottomRight: [0, 0],
				animate: false
			});

			map.on('click', this.onMapClicked);

			this.mapState.initing = false;
			this.mapState.map = map;
			this.mapState.layers = sublayers;

			if (!this.mapState.layers.stories) {
				this.createMarkerMapLayer('stories');
			}
			if (!this.mapState.layers.events) {
				this.createMarkerMapLayer('events');
			}

			this.mapState.layers.projects = projectsLayer;
			projectsLayer.addTo(map);

			this.forceUpdate();
		};

	}

	createMarkerMapLayer (type) {
		const storeState = this.props.store.getState();

		// bail if data not yet loaded
		let layerData = get(storeState[type], 'data.items');
		if (!layerData.length) return null;

		// bail if projects geojson not yet loaded
		let projectsGeoJSON = get(storeState, 'geodata.projects.geojson.features');
		if (!projectsGeoJSON.length) return null;

		let locationsField,
			svgSize,
			svgSymbolId;

		switch (type) {
			case 'stories':
				locationsField = 'relatedLocations';
				svgSize = [20, 30];
				svgSymbolId = 'icon_marker-eyedrop';
				break;
			case 'events':
				locationsField = 'location';
				svgSize = [20, 30];
				svgSymbolId = 'icon_marker-pushpin';
				break;
			default:
				throw new Error('Cannot create map layer for type:', type);
		}

		/*
		console.log(`>>>>> ${ type }:`, layerData.reduce((acc, item) => {
			let locationIds = Array.isArray(item[locationsField]) ? item[locationsField] : item[locationsField] && item[locationsField].split(',');
			acc[item.id] = `${ item.title }: ${ locationIds && locationIds.join(',') || null }`;
			return acc;
		}, {}));
		*/

		let markerObjs = [];
		projectsGeoJSON.forEach(project => {
			// find project centroid
			let centroidResult = get(centroid(project), 'geometry.coordinates');

			// if project centroid could not be calculated, no marker can be created.
			if (!centroidResult) return;

			let renderedItemsForProject = [];

			// iterate items to find those associated with this project
			let projectId = project.properties.bgw_id;
			layerData.forEach((item, i) => {
				// can be > 1 location; create a marker for each
				let locationIds = Array.isArray(item[locationsField]) ?
					item[locationsField] :
					item[locationsField] && item[locationsField].split(',');

				if (!locationIds || !locationIds.length) return;
				locationIds = locationIds.map(id => +id);

				if (~locationIds.indexOf(projectId)) {
					renderedItemsForProject.push(this.initMarkerPopup(type, item, i));
				}

			});

			if (renderedItemsForProject.length) {
				markerObjs.push({
					centroidResult,
					renderedItemsForProject
				});
			}
		});

		let markers = [];
		markerObjs.forEach(markerObj => {
			let icon = L.divIcon({
				// className: `marker ${ type } ${ slug(item.category, { lower: true }) }`,
				className: `marker ${ type }`,
				iconSize: null,
				html:
					`<svg width='${ svgSize[0] }' height='${ svgSize[1] }'>
						<use xlink:href='#${ svgSymbolId }' />
					</svg>`
			});

			let popupContentContainer = document.createElement('div');
			popupContentContainer.classList.add('popup-item-container');
			markerObj.renderedItemsForProject.forEach(item => popupContentContainer.appendChild(item));

			let marker = L.marker(markerObj.centroidResult.reverse(), {
					icon: icon
				})
				.bindPopup(popupContentContainer, {
					closeButton: false
				});
			markers.push(marker);
		});

		/*
		layerData.forEach((item, i) => {
			// can be > 1 location; create a marker for each
			let locationIds = Array.isArray(item[locationsField]) ?
				item[locationsField] :
				item[locationsField] && item[locationsField].split(',');

			if (!locationIds || !locationIds.length) return;

			locationIds.forEach(locationId => {
				let project = projectsGeoJSON.find(feature => feature.properties.bgw_id == locationId);
				if (!project) return;

				let centroidResult = get(centroid(project), 'geometry.coordinates');
				if (centroidResult) {
					let icon = L.divIcon({
						className: `marker ${ type } ${ slug(item.category, { lower: true }) }`,
						iconSize: null,
						html:
							`<svg width='${ svgSize[0] }' height='${ svgSize[1] }'>
								<use xlink:href='#${ svgSymbolId }' />
							</svg>`
					});

					let marker = L.marker([centroidResult[1], centroidResult[0]], {
							icon: icon
						})
						.bindPopup(this.initMarkerPopup(type, item, i), {
							closeButton: false
						});
					markers.push(marker);
				} else {
					console.warn(`Could not derive centroid for project[${ locationId }]:`, project);
				}
			});
		});
		*/

		if (!markers.length) return null;

		this.mapState.layers[type] = L.layerGroup(markers);
	}

	initMarkerPopup (type, data, index) {
		let container = document.createElement('div');
		container.classList.add('popup-item');
		switch (type) {
			case 'stories':
				ReactDOM.render((
					<Story
						{ ...data }
						homepage={ true }
						onClick={ this.props.actions.updateSelectedStory }
						router={ this.props.router }
					/>
				), container);
				return container;
			case 'events':
				ReactDOM.render((
					<Event
						{ ...data }
						homepage={ true }
						defaultImageIndex={ (index + 1) % 6 }
						// onClick={ this.props.actions.updateSelectedStory }
						// router={ this.props.router }
					/>
				), container);
				return container;
			default:
				return null;
		}
	}

	createProjectsMapLayer (projectsGeoJSON) {
		// projects CMS data needed to wire up popups,
		// but we're not going to wait for it to load
		// and hold up loading whatever page we're on.
		this.props.actions.fetchProjectsData();

		return L.geoJson(projectsGeoJSON, {
			style: feature => layerStyles[feature.properties.category],

			// Project data load from the CMS separately from the project geojson.
			// So, we store the geojson feature and map layer to use for creating a popup
			// when the selected project changes, either via a layer click handler (assigned here),
			// or programmatically via an action fired from elsewhere.
			onEachFeature: (feature, layer) => {
				this.mapState.projects.layerData[feature.properties.bgw_id] = {
					feature,
					layer,
				};
				layer.on('click', (event) => this.onProjectFeatureClicked(feature, layer));
			}
		});
	}

	/**
	 * Create project popup on demand, since project data may not yet be available from the CMS
	 * when the project geojson is loaded and added to the map.
	 */
	initProjectPopup (project) {
		let layerData = this.mapState.projects.layerData[project.id];
		if (!layerData) return null;

		let { feature, layer } = layerData;

		// ugh, this is a mess
		let popupContent = `
			<div class='project-popup'>
				<h3>${ project.name }</h3>
				<p>${ project.description }</p>
			</div>
		`;

		this.mapState.projects.popups[project.id] = L.popup({
				closeButton: false,
				autoPanPaddingTopLeft: [0, sassVars.header.height],
				offset: new L.Point(-20, 0)
			})
			.setLatLng(layer.getBounds().getCenter())
			.setContent(popupContent);

	}

	onMapClicked (event) {
		this.props.actions.updateSelectedProject(null);
	}

	/**
	 * Update selected project on click, but only if the CMS project data
	 * associated with the clicked project geojson layer have loaded.
	 */
	onProjectFeatureClicked (feature) {
		const projects = get(this.props.store.getState().projects, 'data.items');
		if (!projects.length) return;

		let projectId = feature.properties.bgw_id,
			project = projects.find(project => project.id === projectId);

		if (project) {
			this.props.actions.updateSelectedProject(project);
		} else {
			console.warn(`No project with id ${ projectId } found in projects returned from SFPA CMS.`);
		}
	}

	setMapControls (map) {
		new L.Control.Zoom({position: 'bottomright'}).addTo(map);
	}

	render () {
		// note: map container stays hidden until cartodb is fully initialized.
		return (
			<div id='bgw-map' ref='leafletMap' className={ `map-container${ !this.mapState.layers ? ' hidden': '' }` } />
		);
	}
}
