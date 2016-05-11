// Set up promise polyfill for isomorphic-fetch
import { polyfill } from 'es6-promise';
polyfill();

import fetch from 'isomorphic-fetch';

import dataUrls from '../static/dataUrls.json';

export const SET_STATE = 'SET_STATE';
export const MODE_CHANGED = 'MODE_CHANGED';
export const MAP_MOVED = 'MAP_MOVED';
export const MAP_LAYERS_PICKER_LAYERS_CHANGED = 'MAP_LAYERS_PICKER_LAYERS_CHANGED';
export const MAP_LAYERS_PICKER_TRANSPORTATION_CHANGED = 'MAP_LAYERS_PICKER_TRANSPORTATION_CHANGED';
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

export default function (store) {

	return {

		setState (state) {
			store.dispatch({
				type: SET_STATE,
				state
			});
		},

		modeChanged (value) {
			// Only allow map or page modes
			value = (value in ['map', 'page'] ? value : 'page');
			store.dispatch({
				type: MODE_CHANGED,
				value: value
			});
		},

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

		mapLayersPickerTransportationChange (key, value) {
			store.dispatch({
				type: MAP_LAYERS_PICKER_TRANSPORTATION_CHANGED,
				key,
				value
			});
		},

		mapLayersPickerLayerChange (key, value) {
			store.dispatch({
				type: MAP_LAYERS_PICKER_LAYERS_CHANGED,
				key,
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
		}
	};

};
