import * as React from 'react';
import { withRouter } from 'react-router';
import { get } from 'lodash';
import slug from 'slug';
import { queue } from 'd3-queue';

import MapLayersPicker from '../components/MapLayersPicker';
import {MapOverlayContainer, MapOverlay} from '../components/MapOverlay';
import PageHeader from '../components/PageHeader';
import * as tileLayers from '../../static/tileLayers.json';
import * as dataURLs from '../../static/dataUrls.json';

/**
 * This component draws the page displayed when the 'Projects' link in the top navbar is clicked.
 * This page shows the Blue Greenway zones; individual projects are listed by the Zone component.
 * Confusing, right? Sorry...
 */
class Projects extends React.Component {
	constructor (props) {
		super(props);

		this.miniMaps = null;
	}

	componentWillMount () {
		const storeState = this.props.store.getState(),
			geodata = get(storeState.geodata, 'zones.geojson'),
			projects = get(storeState.projects, 'data.items');

		// set map layers
		this.props.actions.mapLayersPickerStoriesChange(false);
		this.props.actions.mapLayersPickerEventsChange(false);
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

  componentWillReceiveProps(nextProps, nextState) {
    //
  }

	componentWillUpdate (nextProps, nextState) {
    //
	}

  componentDidUpdate (prevProps) {
    const storeState = this.props.store.getState(),
      { mode } = this.props.params,
      geodata = get(storeState.geodata, 'zones.geojson');

    // only call createMiniMaps() after React has rendered DOM divs for each map
    if (mode === 'page' && this.refs.mb && this.refs.ib && this.refs.p70 && this.refs.sc) {
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
		const storeState = this.props.store.getState();
		let geodata = get(storeState.geodata, 'zones.geojson'),
			zoneId = geodata.features.find(feature => feature.properties.map_id === mapId).properties.map_id,
			zoneTitleSlug = storeState.zoneConfigs.find(config => config.id === mapId).slug;

		// TODO: this should just be a <Link>, created in renderPageView()
		let { mode } = this.props.params,
			path = `/projects/${ mode }/${ zoneTitleSlug }`;
		this.props.router.push(path);
	}

	createMiniMaps (zones) {
		if (this.miniMaps) return;
		if (!zones || !zones.features) return;

		this.miniMaps = [];

		this.props.store.getState().zoneConfigs.forEach(zoneConfig => {
			this.renderMap(zoneConfig.id, zones);
		});
	}

	renderMap (layerId, zoneFeatures) {
    let map,
			basemap = L.tileLayer(tileLayers.layers[1].url),
			zoneFeaturesLayer = L.geoJson(zoneFeatures),
			zoneLayer = L.geoJson(zoneFeatures, {
				filter: (feature, layer) => feature.properties.map_id === layerId,
				style: {
					color: '#17445F',
					weight: 4,
					opacity: 1,
					fillColor: '#17445F',
					fillOpacity: 0.2,
					clickable: false
				}
			});

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
      zoom: 12,
      zoomControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      tap: false,
      dragging: false,
      touchZoom: false
    };

    const layerOptions = {
      tooltip: false,
      legends: false,
      infowindow: false,
      cartodb_logo: false
    };

    map = L.map(`map-${layerId}`, mapOptions);

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
        layer.addTo(map).setZIndex(index);
      });
      configMap(cartodbLayers);
    });

    // stuff to do after cartodb layers have loaded...
    const configMap = (cartodbLayers) => {
      let sublayers = {};
      sublayers.zones = cartodbLayers[0];
      sublayers.green_connections = cartodbLayers[1];
      sublayers.green_connections.hide();
      sublayers.biking = cartodbLayers[2];
      sublayers.biking.hide();
      sublayers.bgwLine = cartodbLayers[3];
      sublayers.pois = cartodbLayers[4];
      sublayers.pois.hide();
      sublayers.mapLabels = cartodbLayers[5];

      map.addLayer(zoneLayer);
      map.fitBounds(zoneFeaturesLayer.getBounds(), {
        paddingTopLeft: [0, 50],
        paddingBottomRight: [0, 0]
      });
      zoneLayer.bringToFront();

      if (!this.miniMaps) this.miniMaps = [];
      this.miniMaps.push(map);
    };
	}

	renderPageView () {
		let { zoneConfigs } = this.props.store.getState();
		return (
			<div className='grid-container'>
				<PageHeader />
				<div className='row'>
					{ zoneConfigs.map(zoneConfig => {
						return (
							<div ref={ zoneConfig.id } className='three columns zone-cell' key={ zoneConfig.id }>
								<h4 className='title'>{ zoneConfig.title }</h4>
								<div id={ `map-${ zoneConfig.id }` }></div>
								<div className='learn-more' onClick={ this.onLearnMoreClick.bind(this, zoneConfig.id) }>
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
		return (
			<MapOverlayContainer className="projects-map-overlay">
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
			</MapOverlayContainer>
		);
	}

	render () {
		let { mode } = this.props.params;
		return (
			<div id="projects">
				{ mode === 'page' ? this.renderPageView() : this.renderMapView() }
			</div>
		);
	}

}

export default withRouter(Projects);
