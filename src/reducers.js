import { combineReducers } from 'redux';
import * as actions from './actions';
import leaflet from 'leaflet';
import moment from 'moment';

const identity = (state, action) => state;

export default {

	mode (state = 'page', action) {
		switch (action.type) {
			case actions.MODE_CHANGED:
				return action.value;
			default:
				return state;
		}
	},

	map (state = {}, action) {
		switch (action.type) {
			case actions.MAP_MOVED:
				return {
					...state,
					...action.value
				};
			default:
				return {
					...state
				};
		}
	},

	itemSelector: combineReducers({

		title (state = '', action) {
			switch (action.type) {
				case actions.ITEM_SELECTOR_SET_TITLE:
					return action.value;
				default:
					return state;
			}
		},

		items (state = null, action) {
			switch (action.type) {
				case actions.ITEM_SELECTOR_SET_ITEMS:
					return action.value;
				default:
					return state;
			}
		},

		selectedItem (state = null, action) {
			switch (action.type) {
				case actions.ITEM_SELECTED:
					return action.value;
				default:
					return state;
			}
		}

	}),

	events: combineReducers({

		startDate (state = null, action) {
			switch (action.type) {
				case actions.EVENTS_START_DATE_CHANGED:
					return action.value;
				default:
					return state;
			}
		},

		endDate (state = null, action) {
			switch (action.type) {
				case actions.EVENTS_END_DATE_CHANGED:
					return action.value;
				default:
					return state;
			}
		},

		ageRangeOptions (state = [], action) {
			switch (action.type) {
				case actions.AGE_RANGES_CHANGED:
					return action.value;
				default:
					return state;
			}
		},

		costOptions (state = [], action) {
			switch (action.type) {
				case actions.COSTS_CHANGED:
					return action.value;
				default:
					return state;
			}
		},

		eventTypeOptions (state = [], action) {
			switch (action.type) {
				case actions.EVENT_TYPES_CHANGED:
					return action.value;
				default:
					return state;
			}
		},

		locationOptions (state = [], action) {
			switch (action.type) {
				case actions.LOCATIONS_CHANGED:
					return action.value;
				default:
					return state;
			}
		}

	})


};

// Default values passed into reducers on store initialization (in `main.jsx`).
// These values will override the defaults specified in each reducer's argument list,
// and can be merged into a set of initial state on store init if desired.
export const initialState = {

	mode: 'page',

	map: {
		zoom: 14,
		bounds: leaflet.latLngBounds(
			leaflet.latLng(37.733, -122.474),
			leaflet.latLng(37.793, -122.346)
		),
		zoomSnap: 0.0,
		zoomControl: false,
		keyboard: false,
		dragging: false,
		touchZoom: false,
		scrollWheelZoom: false,
		doubleClickZoom: false,
		boxZoom: false
	},

	itemSelector: {
		title: 'Select a tileset',
		items: [
			{ "id": 1, "name": "Toner" },
			{ "id": 2, "name": "Toner Background" },
			{ "id": 3, "name": "Toner Lite" },
			{ "id": 4, "name": "Terrain" },
			{ "id": 5, "name": "Terrain Background" },
			{ "id": 6, "name": "Watercolor" },
			{ "id": 7, "name": "Satellite" },
			{ "id": 8, "name": "Positron" },
			{ "id": 9, "name": "Dark Matter" }
		]
	},

	events: {
		startDate: moment('1/1/2016', 'M/D/YYYY'),
		endDate: moment(),
		ageRangeOptions: [
			{ value: 'a', display: 'a' },
			{ value: 'b', display: 'b' },
			{ value: 'c', display: 'c' }
		],
		costOptions: [
			{ value: 'a', display: 'a' },
			{ value: 'b', display: 'b' },
			{ value: 'c', display: 'c' }
		],
		locationOptions: [
			{ value: 'a', display: 'a' },
			{ value: 'b', display: 'b' },
			{ value: 'c', display: 'c' }
		],
		eventTypeOptions: [
			{ value: 'a', display: 'a' },
			{ value: 'b', display: 'b' },
			{ value: 'c', display: 'c' }
		]
	}

};
