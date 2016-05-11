import { combineReducers } from 'redux';
import * as actions from './actions';
import leaflet from 'leaflet';
import moment from 'moment';

import { cleanEventsData } from './models/events';
import { cleanStoriesData } from './models/stories';

const identity = (state, action) => state;

const MAP_LAYERS_PICKER_DEFAULT_LAYERS = [
	{ key: 'boat_landings', name: 'boat landings / launches', checked: false},
	{ key: 'picnic_tables', name: 'picnic tables', checked: false },
	{ key: 'benches', name: 'benches', checked: false },
	{ key: 'community gardens', name: 'community gardens', checked: false },
	{ key: 'development pipeline', name: 'development pipeline', checked: false }
];
const MAP_LAYERS_PICKER_DEFAULT_TRANSPORTATION = [
	{ key: 'walking_biking', name: 'walking / biking' },
	{ key: 'connector_streets', name: 'connector streets / paths' },
	{ key: 'green_connector_network', name: 'green connector network' },
	{ key: 'public_transportation', name: 'public transportation' }
];

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

	mapLayersPicker: combineReducers({
		layers (state = MAP_LAYERS_PICKER_DEFAULT_LAYERS, action) {
			switch (action.type) {
				case actions.MAP_LAYERS_PICKER_LAYERS_CHANGED:
					return state.map(layer => {
						if (layer.key === action.key) {
							layer.checked = action.value;
						}
						return layer;
					});
				default:
					return state;
			}
		},

		transportation (state = MAP_LAYERS_PICKER_DEFAULT_TRANSPORTATION, action) {
			switch (action.type) {
				case actions.MAP_LAYERS_PICKER_TRANSPORTATION_CHANGED:
					return state.map(layer => {
						if (layer.key === action.key) {
							layer.checked = action.value;
						}
						return layer;
					});
				default:
					return state;
			}
		}
	}),

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
		},

		data (state = { isFetching: false, items: [] }, action) {
			switch (action.type) {
				case actions.EVENTS_DATA_REQUEST:
					return Object.assign({}, state, {
						isFetching: true,
						error: null
					});
				case actions.EVENTS_DATA_RESPONSE:
					return Object.assign({}, state, {
						isFetching: false,
						items: cleanEventsData(action.items),
						error: null
					});
				case actions.EVENTS_DATA_ERROR_RESPONSE:
					return Object.assign({}, state, {
						isFetching: false,
						error: action.error
					});
				default:
					return state;
			}
		}

	}),

	stories: combineReducers({

		startDate (state = null, action) {
			switch (action.type) {
				case actions.STORIES_START_DATE_CHANGED:
					return action.value;
				default:
					return state;
			}
		},

		endDate (state = null, action) {
			switch (action.type) {
				case actions.STORIES_END_DATE_CHANGED:
					return action.value;
				default:
					return state;
			}
		},

		data (state = { isFetching: false, items: [] }, action) {
			switch (action.type) {
				case actions.STORIES_DATA_REQUEST:
					return Object.assign({}, state, {
						isFetching: true,
						error: null
					});
				case actions.STORIES_DATA_RESPONSE:
					return Object.assign({}, state, {
						isFetching: false,
						items: cleanStoriesData(action.items),
						error: null
					});
				case actions.STORIES_DATA_ERROR_RESPONSE:
					return Object.assign({}, state, {
						isFetching: false,
						error: action.error
					});
				default:
					return state;
			}
		},

		selectedStory (state = null, action) {
			switch (action.type) {
				case actions.UPDATE_SELECTED_STORY:
					return action.story;
				default:
					return state;
			}
		},

		categoryOptions (state = [], action) {
			switch (action.type) {
				case actions.STORY_CATEGORY_CHANGE:
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
		ageRangeOptions: [],
		costOptions: [],
		locationOptions: [],
		eventTypeOptions: [],
		data: {
			isFetching: false,
			items: [],
			error: null
		}
	},

	stories: {
		startDate: moment('1/1/2016', 'M/D/YYYY'),
		endDate: moment(),
		selectedStory: null,
		categoryOptions: [],
		data: {
			isFetching: false,
			items: [],
			error: null
		}
	}

};
