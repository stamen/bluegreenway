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

import { getFilteredEvents } from '../models/events';


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

		if (this.mapState.map && nextProps.params.mode !== 'map') {
			this.mapState.map.closePopup();
		}
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

		// TODO: toggle markers by category/type.
		//  See "TODO: Create a LayerGroup for each story/event category." below for more info.
		/*
		mapLayersPicker.storyCategories.forEach(storyCategory => {
			//
		});
		mapLayersPicker.eventTypes.forEach(eventType => {
			//
		});
		*/

		if (projects.selectedProject) {
			let popup = this.mapState.projects.popups[projects.selectedProject.id];

			// If popup has not yet been created, create it
			if (!popup) {
				this.initProjectPopup(projects.selectedProject);
				popup = this.mapState.projects.popups[projects.selectedProject.id];
			}

			// if not a placeholder, recenter on open
			if (!projects.selectedProject.isPlaceholder) {
				let map = this.mapState.map,
					onPopupOpen = function (event) {
						let container = popup._container,
							h = container && container.offsetHeight,
							img = projects.selectedProject.images && projects.selectedProject.images.src;

						if (img) h += 200;
						container.style.bottom = `${ -h / 2 }px`;

						/*
						// this works, but creates too much jumpy motion.
						// using hardcoded values above immediately on popup open instead.
						if (h && img) {
							img = new Image();
							img.addEventListener('load', (imgEvent) => {
								h = container.offsetHeight;
								container.style.bottom = `${ -h / 2 }px`;
							});
							img.src = projects.selectedProject.images.src;
						} else if (h) {
							container.style.bottom = `${ -h / 2 }px`;
						}
						*/
						
						// only ever do this once.
						map.off('popupopen', onPopupOpen);
					};
				map.on('popupopen', onPopupOpen);
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

		const mapCenter = [37.757450, -122.406235],
			mapOptions = {
				center: mapCenter,
				zoom: 13,
				zoomControl: false,
				minZoom: 12,
				maxZoom: 16,
				maxBounds: [[mapCenter[0] - 0.3, mapCenter[1] - 0.3], [mapCenter[0] + 0.3, mapCenter[1] + 0.3]]
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
		if (!projectsGeoJSON || !projectsGeoJSON.length) return null;

		// filter out past events
		if (type === 'events') {
			layerData = getFilteredEvents(storeState.events);
		}

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

			let items = [],
				elements = [];

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
					items.push(item);
					elements.push(this.initMarkerPopup(type, item, i));
				}
			});

			if (elements.length) {
				markerObjs.push({
					centroidResult,
					items,
					elements
				});
			}
		});

		let markers = [],
			markersByType = {};
		markerObjs.forEach(markerObj => {
			let categoryKey = slug(markerObj.items[0].category).toLowerCase(),
				icon = L.divIcon({
					className: `marker ${ type } ${ categoryKey }`,
					iconSize: null,
					html:
						`<svg width='${ svgSize[0] }' height='${ svgSize[1] }'>
							<use xlink:href='#${ svgSymbolId }' />
						</svg>`
				});

			let popupContentContainer = document.createElement('div');
			popupContentContainer.classList.add('popup-item-container', type);
			markerObj.elements.forEach(item => popupContentContainer.appendChild(item));

			// on shorter viewports, limit max-height of popup
			// to innerHeight - header height - padding
			if (window.innerHeight < 900) {
				let popupPadding = 0.5 * 18;	// _app.scss::$popup-padding
				popupContentContainer.style.maxHeight = `${ window.innerHeight - sassVars.header.height - 2 * popupPadding }px`;
			}

			let w = type === 'events' ? 265 : 510,
				h = 265,
				left = 24*3 + document.querySelector('.map-overlay-container-contents').offsetWidth;	// keep popup to right of legend panels

			let marker = L.marker(markerObj.centroidResult.reverse(), {
					icon: icon
				})
				.bindPopup(popupContentContainer, {
					closeButton: false,

					// hardcoded based on values in _app.scss::.popup-item-container,
					// required for auto panning and offset to work correctly
					maxWidth: w,

					offset: [-w/2 - 24, h/2],
					autoPanPaddingTopLeft: [left, sassVars.header.height],
					autoPanPaddingBottomRight: [24, 24]
				});

			markers.push(marker);

			if (!markersByType[categoryKey]) {
				markersByType[categoryKey] = [];
			}
			markersByType[categoryKey].push(marker);
		});

		if (!markers.length) return null;

		this.mapState.layers[type] = L.layerGroup(markers);

		// TODO: Create a LayerGroup for each story/event category.
		// Not doing this now because of the marker-at-location overlap problem:
		// 
		// All markers are placed at the centroid of their corresponding project.
		// This means that all markers for a given project are stacked directly on top of one another,
		// rendering only the top marker in that stack visible and interactive.
		// Therefore, the `markerObjs.forEach` loop above groups all stories/events per project
		// into a single marker, and assigns that marker a category matching the first item in the stack.
		// 
		// So, there aren't actually markers drawn for every item,
		// and a UI that allows toggling markers by category could have no visible effect due to the overlap.
		// A solution for this problem would require both design and implementation,
		// and we're out of time...so the legends will remain non-interactive.
		// 
		// this.mapState.layers[categoryKey] = L.layerGroup(markersByType[categoryKey]);
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
						defaultImageIndex={ (index % 6) + 1 }
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

		let { feature, layer } = layerData,
			{ isPlaceholder, description } = project,
			popupContent = '';

		if (isPlaceholder) {
			popupContent = `
				<div class='project-popup placeholder'>
					<h3>${ project.name }</h3>
				</div>
			`;
		} else {
			description = description.replace('<p></p>', '');
			popupContent = `
				<div class='project-popup'>
					<h3>${ project.name }</h3>
					<img src=${ project.images.src } alt=${ project.images.alt }/>
					${ description }
				</div>
			`;
		}

		// hardcoded based on values in projects.scss::.project-popup
		let w = 270,
			offset = isPlaceholder ?
				[-0.6 * w, 40] :
				[-0.75 * w, 0.75 * w];

		this.mapState.projects.popups[project.id] = L.popup({
				// hardcoded based on values in _app.scss::.popup-item-container,
				// required for auto panning and offset to work correctly
				maxWidth: w,

				offset: offset,
				closeButton: false,
				autoPanPaddingTopLeft: [24, sassVars.header.height],
				autoPanPaddingBottomRight: [24, 24]
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
			// console.warn(`No project with id ${ projectId } found in projects returned from SFPA CMS.`);
			this.props.actions.updateSelectedProject({
				isPlaceholder: true,
				id: projectId,
				name: feature.properties.name
			});
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
