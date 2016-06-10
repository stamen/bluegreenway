import * as React from 'react';
import { get } from 'lodash';
import { vizJSON } from '../models/common.js';

export default class LeafletMap extends React.Component {
	constructor(props) {
		super(props);

		this.mapState = {
			initing: false,
			map: null,
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

		this.updateMapLayers(storeState);
	}

	componentDidUpdate(prevProps, prevState) {
		// hide controls after map has initialized
		if (this.mapState.map) {
			// i know, i know...
			$('.leaflet-control-attribution.leaflet-control').remove();
		}
	}

	updateMapLayers (storeState) {
		if (!this.mapState.map) return;

		let { mapLayersPicker, projects } = storeState;

		if (mapLayersPicker.transportation[0].checked) {
			this.mapState.layers.biking.show();
		} else {
			this.mapState.layers.biking.hide();
		}

		if (mapLayersPicker.projects) {
			this.mapState.map.addLayer(this.mapState.layers.projects);
		} else {
			this.mapState.map.removeLayer(this.mapState.layers.projects);
		}

		if (projects.selectedProject) {
			console.log(">>>>> selectedProject:", projects.selectedProject);
		}
	}

	initMap(projectsGeoJSON) {
		// if already inited, or begun initing, bail
		if (this.mapState.initing || this.mapState.map) return;

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

		let projectsLayer = this.createProjectsMapLayer(projectsGeoJSON);

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

					// fit map to encompass projects bounds
					// note: projectsLayer is added/removed via an action, not here.
					map.fitBounds(projectsLayer.getBounds(), {
						paddingTopLeft: [0, 0],
						paddingBottomRight: [0, 0],
						animate: false
					});

					this.mapState.initing = false;
					this.mapState.map = map;
					this.mapState.layers = sublayers;

					this.mapState.layers.projects = projectsLayer;

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

	createProjectsMapLayer (projectsGeoJSON) {
		let dummyProject = {
			name: 'Placeholder Project',
			desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi libero justo, malesuada non laoreet at, varius sed nulla. Nullam vel felis facilisis, aliquam arcu ut, euismod risus. Donec venenatis erat magna, id bibendum ligula rutrum sed. In vitae tempus magna.'
		};

		return L.geoJson(projectsGeoJSON, {
			style: feature => {
				// to do: style features based on a bgw_zone_id
			},
			onEachFeature: (feature, layer) => {
				layer.on('click', () => {
					const storeState = this.props.store.getState();

					let project;
					if (!feature.properties.id_is_fake) {
						project = storeState.projects.data.items.find(project => project.id === feature.properties.bgw_id);
					}
					if (!project) project = dummyProject;

					let popupContent = `<h3>${ project.name }</h3><p>${ project.description }</p>`;

					// cartodb.js pins us to an old-ass version of Leaflet that doesn't have this function,
					// so we have to manually instantiate a popup on click instead of binding and updating it.
					// layer.setPopupContent(`<h3>${ project.name }</h3><p>${ project.description }</p>`);
					L.popup()
						.setLatLng(layer.getBounds().getCenter())
						.setContent(popupContent)
						.openOn(this.mapState.map);

					if (project !== dummyProject) {
						this.props.actions.updateSelectedProject(project);
					}
				});
			}
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
