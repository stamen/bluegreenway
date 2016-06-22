// Set up promise polyfill for isomorphic-fetch
import { polyfill } from 'es6-promise';
polyfill();

import fetch from 'isomorphic-fetch';
import { get } from 'lodash';

// dataUrls_tmp.json = for use while working offline
// dataUrls.json = for use in production
import dataUrls from '../static/dataUrls.json';

export const SET_STATE = 'SET_STATE';
// export const MODE_CHANGED = 'MODE_CHANGED';
export const MAP_MOVED = 'MAP_MOVED';
export const MAP_LAYERS_PICKER_LAYERS_CHANGED = 'MAP_LAYERS_PICKER_LAYERS_CHANGED';
export const MAP_LAYERS_PICKER_TRANSPORTATION_CHANGED = 'MAP_LAYERS_PICKER_TRANSPORTATION_CHANGED';
export const MAP_LAYERS_PICKER_STORIES_CHANGED = 'MAP_LAYERS_PICKER_STORIES_CHANGED';
export const MAP_LAYERS_PICKER_EVENTS_CHANGED = 'MAP_LAYERS_PICKER_EVENTS_CHANGED';
export const MAP_LAYERS_PICKER_PROJECTS_CHANGED = 'MAP_LAYERS_PICKER_PROJECTS_CHANGED';
export const ITEM_SELECTED = 'ITEM_SELECTED';
export const EVENTS_START_DATE_CHANGED = 'EVENTS_START_DATE_CHANGED';
export const EVENTS_END_DATE_CHANGED = 'EVENTS_END_DATE_CHANGED';
export const AGE_RANGES_CHANGED = 'AGE_RANGES_CHANGED';
export const COSTS_CHANGED = 'COSTS_CHANGED';
export const EVENT_TYPES_CHANGED = 'EVENT_TYPES_CHANGED';
export const LOCATIONS_CHANGED = 'LOCATIONS_CHANGED';
export const STORY_CATEGORY_CHANGE = 'STORY_CATEGORY_CHANGE';
export const EVENTS_DATA_REQUEST = 'EVENTS_DATA_REQUEST';
export const EVENTS_DATA_RESPONSE = 'EVENTS_DATA_RESPONSE';
export const EVENTS_DATA_ERROR_RESPONSE = 'EVENTS_DATA_ERROR_RESPONSE';

export const STORIES_DATA_REQUEST = 'STORIES_DATA_REQUEST';
export const STORIES_DATA_RESPONSE = 'STORIES_DATA_RESPONSE';
export const STORIES_DATA_ERROR_RESPONSE = 'STORIES_DATA_ERROR_RESPONSE';
export const STORIES_START_DATE_CHANGED = 'STORIES_START_DATE_CHANGED';
export const STORIES_END_DATE_CHANGED = 'STORIES_END_DATE_CHANGED';
export const UPDATE_SELECTED_STORY = 'UPDATE_SELECTED_STORY';

export const ZONE_GEODATA_REQUEST = 'ZONE_GEODATA_REQUEST';
export const ZONE_GEODATA_RESPONSE = 'ZONE_GEODATA_RESPONSE';
export const ZONE_GEODATA_ERROR_RESPONSE = 'ZONE_GEODATA_ERROR_RESPONSE';
export const PROJECTS_GEODATA_REQUEST = 'PROJECTS_GEODATA_REQUEST';
export const PROJECTS_GEODATA_RESPONSE = 'PROJECTS_GEODATA_RESPONSE';
export const PROJECTS_GEODATA_ERROR_RESPONSE = 'PROJECTS_GEODATA_ERROR_RESPONSE';

export const PROJECTS_DATA_REQUEST = 'PROJECTS_DATA_REQUEST';
export const PROJECTS_DATA_RESPONSE = 'PROJECTS_DATA_RESPONSE';
export const PROJECTS_DATA_ERROR_RESPONSE = 'PROJECTS_DATA_ERROR_RESPONSE';
export const UPDATE_SELECTED_PROJECT = 'UPDATE_SELECTED_PROJECT';

export default function (store) {

	return {

		setState (state) {
			store.dispatch({
				type: SET_STATE,
				state
			});
		},

		/*
		modeChanged (value) {
			// Only allow map or page modes
			value = (value in ['map', 'page'] ? value : 'page');
			store.dispatch({
				type: MODE_CHANGED,
				value: value
			});
		},
		*/

		mapMoved (mapState) {
			store.dispatch({
				type: MAP_MOVED,
				value: mapState
			});
		},

		itemSelected (value) {
			store.dispatch({
				type: ITEM_SELECTED,
				value: value
			});
		},

		eventsMinDateChanged (date) {
			store.dispatch({
				type: EVENTS_START_DATE_CHANGED,
				value: date
			});
		},

		eventsMaxDateChanged (date) {
			store.dispatch({
				type: EVENTS_END_DATE_CHANGED,
				value: date
			});
		},

		ageRangesChange (ageRanges) {
			store.dispatch({
				type: AGE_RANGES_CHANGED,
				value: ageRanges
			});
		},

		costsChange (costs) {
			store.dispatch({
				type: COSTS_CHANGED,
				value: costs
			});
		},

		eventTypesChange (eventTypes) {
			store.dispatch({
				type: EVENT_TYPES_CHANGED,
				value: eventTypes
			});
		},

		locationsChange (locations) {
			store.dispatch({
				type: LOCATIONS_CHANGED,
				value: locations
			});
		},

		storyCategoryChange (categories) {
			store.dispatch({
				type: STORY_CATEGORY_CHANGE,
				value: categories
			});
		},

		mapLayersPickerLayerChange (key, value) {
			store.dispatch({
				type: MAP_LAYERS_PICKER_LAYERS_CHANGED,
				key,
				value
			});
		},

		mapLayersPickerTransportationChange (key, value) {
			store.dispatch({
				type: MAP_LAYERS_PICKER_TRANSPORTATION_CHANGED,
				key,
				value
			});
		},

		mapLayersPickerStoriesChange (value) {
			store.dispatch({
				type: MAP_LAYERS_PICKER_STORIES_CHANGED,
				value
			});
		},

		mapLayersPickerEventsChange (value) {
			store.dispatch({
				type: MAP_LAYERS_PICKER_EVENTS_CHANGED,
				value
			});
		},

		mapLayersPickerProjectsChange (value) {
			store.dispatch({
				type: MAP_LAYERS_PICKER_PROJECTS_CHANGED,
				value
			});
		},

		//
		// Events data actions.
		//
		// Only fetchEventsData should be dispatched directly:
		// requestEventsData, receiveEventsData, and receiveEventsDataError are
		// invoked by fetchEventsData as necessary
		//
		requestEventsData () {
			return {
				type: EVENTS_DATA_REQUEST
			};
		},

		receiveEventsData (json) {
			return {
				type: EVENTS_DATA_RESPONSE,
				items: json.nodes
			};
		},

		receiveEventsDataError (error) {
			return {
				type: EVENTS_DATA_ERROR_RESPONSE,
				error
			};
		},

		fetchEventsData () {
			store.dispatch(dispatch => {
				dispatch(this.requestEventsData());
				return fetch(dataUrls.events)
					.then(response => response.json())
					.then(json => dispatch(this.receiveEventsData(json)))
					.catch(error => dispatch(this.receiveEventsDataError(error)));
			});
		},

		//
		// Stories data actions.
		//
		// Only fetchStoriesData should be dispatched directly:
		// requestStoriesData, receiveStoriesData, and receiveStoriesDataError are
		// invoked by fetchStoriesData as necessary
		//
		requestStoriesData () {
			return {
				type: STORIES_DATA_REQUEST
			};
		},

		receiveStoriesData (json) {
			return {
				type: STORIES_DATA_RESPONSE,
				items: json.nodes
			};
		},

		receiveStoriesDataError (error) {
			return {
				type: STORIES_DATA_ERROR_RESPONSE,
				error
			};
		},

		fetchStoriesData () {
			store.dispatch(dispatch => {
				dispatch(this.requestStoriesData());
				return fetch(dataUrls.stories)
					.then(response => response.json())
					.then(json => dispatch(this.receiveStoriesData(json)))
					.catch(error => dispatch(this.receiveStoriesDataError(error)));
			});
		},

		storiesMinDateChanged (date) {
			store.dispatch({
				type: STORIES_START_DATE_CHANGED,
				value: date
			});
		},

		storiesMaxDateChanged (date) {
			store.dispatch({
				type: STORIES_END_DATE_CHANGED,
				value: date
			});
		},

		updateSelectedStory (story) {
			store.dispatch({
				type: UPDATE_SELECTED_STORY,
				story
			});
		},

		//
		// Projects actions
		//
		// Only fetchProjectsData should be dispatched directly:
		// requestProjectData, receiveProjectData, and receiveProjectDataErrors are
		// invoked by fetchProjectsData as necessary
		//

		requestProjectsData () {
			return {
				type: PROJECTS_DATA_REQUEST
			};
		},

		receiveProjectsData (json) {
			return {
				type: PROJECTS_DATA_RESPONSE,
				items: json.nodes
			};
		},

		receiveProjectsDataError (error) {
			return {
				type: PROJECTS_DATA_ERROR_RESPONSE,
				error
			};
		},

		fetchProjectsData () {
			store.dispatch(dispatch => {
				dispatch(this.requestProjectsData());
				return fetch(dataUrls.projects)
					.then(response => response.json())
					.then(json => dispatch(this.receiveProjectsData(json)))
					.catch(error => dispatch(this.receiveProjectsDataError(error)));
			});
		},

		updateSelectedProject (project) {
			store.dispatch({
				type: UPDATE_SELECTED_PROJECT,
				project
			});
		},

		//
		// GeoData actions
		//
		requestZoneGeoData () {
			return {
				type: ZONE_GEODATA_REQUEST
			};
		},

		receiveZoneGeoData (geojson) {
			// console.log("zones geojson:", geojson.features);
			
			return {
				type: ZONE_GEODATA_RESPONSE,
				geojson
			};
		},

		receiveZoneGeoDataError (error) {
			return {
				type: ZONE_GEODATA_ERROR_RESPONSE,
				error
			};
		},

		fetchZoneGeoData () {
			store.dispatch(dispatch => {
				dispatch(this.requestZoneGeoData());
				return fetch(dataUrls.zones)
					.then(response => response.json())
					.then(json => dispatch(this.receiveZoneGeoData(json)))
					.catch(error => dispatch(this.receiveZoneGeoDataError(error)));
			});
		},

		requestProjectsGeoData () {
			return {
				type: PROJECTS_GEODATA_REQUEST
			};
		},

		receiveProjectsGeoData (geojson) {
			// log all the project names and ids:
			// console.log("projects geojson:", geojson.features.map(f => `${ f.properties.name }: ${ f.properties.bgw_id }`));
			
			return {
				type: PROJECTS_GEODATA_RESPONSE,
				geojson
			};
		},

		receiveProjectsGeoDataError (error) {
			return {
				type: PROJECTS_GEODATA_RESPONSE,
				error
			};
		},

		fetchProjectsGeoData () {
			store.dispatch(dispatch => {
				dispatch(this.requestProjectsGeoData());
				return fetch(dataUrls.projectsGeoData)
					.then(response => response.json())
					.then(json => dispatch(this.receiveProjectsGeoData(json)))
					.catch(error => dispatch(this.receiveProjectsGeoDataError(error)));
			});
		},

		// Utility functions that are not actions, but pull data from the store.
		utils: {

			// ---------------------------------------- //
			// Zones-related data from various sources:
			// zones geojson:
			// 	"cartodb_id": 1,
			// 	"name": "Mission Bay/ Mission Rock",
			// 	"description": null,
			// 	"map_id": "mb"
			//
			// projects CMS:
			// 	"BGW Zone": "Mission Bay/Mission Rock",
			//
			// store.zoneConfigs:
			// 	id: 'mb',
			// 	slug: 'mission_bay_mission_rock',
			// 	bgwZoneId: 'Mission Bay/Mission Rock'
			// ---------------------------------------- //

			/**
			 * @param id {String} short string used in zones geojson file
			 * 		  and client code, but not present in CMS data.
			 * @return {Object} Zone geojson
			 */
			getZoneById (id) {

				let zoneGeodata = get(store.getState().geodata, 'zones.geojson.features');
				return zoneGeodata ? zoneGeodata.find(z => z.properties.map_id === id) : null;

			},

			/**
			 * @param slug {String} slugified zone id used in BGW URLs.
			 * @return {Object} Zone geojson
			 */
			getZoneBySlug (slug) {

				let zoneConfig = store.getState().zoneConfigs.find(z => z.slug === slug);
				return zoneConfig ? this.getZoneById(zoneConfig.id) : null;

			},

			/**
			 * @param bgwId {String} Long, descriptive string from projects CMS.
			 * 		  This string is created and managed by CMS, and appears to be the
			 * 		  only Zone identifier in the CMS, so *should* be safe for use.
			 * @return {Object} Zone geojson.
			 */
			getZoneByBGWId (bgwId) {

				// TODO: map zoneId to zoneName, then return getZoneByBGWId(zoneName)
				// below is untested, semi-psuedocode
				let zone = store.getState().zones.find(z => z.bgwZoneId === bgwId);
				return zone ? this.getZoneById(zoneConfig.id) : null;

			},

			getProjectsInZone (projects, zone) {

				let zoneConfig = store.getState().zoneConfigs.find(z => z.id === zone.properties.map_id);
				return projects.filter(p => p.BGWZone === zoneConfig.bgwZoneId);

			}

		}
	};
};
