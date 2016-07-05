import { combineReducers } from 'redux';
import * as actions from './actions';
import moment from 'moment';

import { cleanEventsData } from './models/events';
import { cleanStoriesData } from './models/stories';
import { cleanProjectsData } from './models/projects';

export default {

	/*
	mode (state = 'page', action) {
		switch (action.type) {
			case actions.MODE_CHANGED:
				return action.value;
			default:
				return state;
		}
	},
	*/

	menuOpen (state = false, action) {
		switch (action.type) {
			case actions.MENU_HIDDEN:
				return false;
			case actions.MENU_TOGGLED:
				return !state;
			default:
				return state;
		};
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
		layers (state = {}, action) {
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

		transportation (state = {}, action) {
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
		},

		stories (state = {}, action) {
			switch (action.type) {
				case actions.MAP_LAYERS_PICKER_STORIES_CHANGED:
					return action.value;
				default:
					return state;
			}
		},

		events (state = {}, action) {
			switch (action.type) {
				case actions.MAP_LAYERS_PICKER_EVENTS_CHANGED:
					return action.value;
				default:
					return state;
			}
		},

		projects (state = {}, action) {
			switch (action.type) {
				case actions.MAP_LAYERS_PICKER_PROJECTS_CHANGED:
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

		ageRange (state = '', action) {
			switch (action.type) {
				case actions.EVENTS_AGE_RANGE_CHANGED:
					return action.value;
				default:
					return state;
			}
		},

		cost (state = '', action) {
			switch (action.type) {
				case actions.EVENTS_COST_CHANGED:
					return action.value;
				default:
					return state;
			}
		},

		type (state = '', action) {
			switch (action.type) {
				case actions.EVENTS_TYPE_CHANGED:
					return action.value;
				default:
					return state;
			}
		},

		location (state = '', action) {
			switch (action.type) {
				case actions.EVENTS_LOCATION_CHANGED:
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
				case actions.EVENT_LOCATIONS_CHANGED:
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
	}),

	projects: combineReducers({

		data (state = { isFetching: false, items: [] }, action) {
			switch (action.type) {
				case actions.PROJECTS_DATA_REQUEST:
					return Object.assign({}, state, {
						isFetching: true,
						error: null
					});
				case actions.PROJECTS_DATA_RESPONSE:
					return Object.assign({}, state, {
						isFetching: false,
						items: cleanProjectsData(action.items),
						error: null
					});
				case actions.PROJECTS_DATA_ERROR_RESPONSE:
					return Object.assign({}, state, {
						isFetching: false,
						error: action.error
					});
				default:
					return state;
			}
		},

		selectedProject (state = null, action) {
			switch (action.type) {
				case actions.UPDATE_SELECTED_PROJECT:
					return action.project;
				default:
					return state;
			}
		}

	}),

	/**
	 * Zone constants hardcoded in initialState below, used to link FE code, CMS data, and geojson.
	 * Geodata can be retrieved via `getZone*` methods in actions.js.
	 * TODO: shouldn't need the `getZone*` methods, should just merge state from geodata into a single `zones` reducer.
	 */
	zoneConfigs (state = [], action) {

		return state;

	},

	geodata: combineReducers({

		zones (state = { isFetching: false, geojson: {} }, action) {
			switch (action.type) {
				case actions.ZONE_GEODATA_REQUEST:
					return Object.assign({}, state, {
						isFetching: true,
						geojson: null,
						error: null
					});
				case actions.ZONE_GEODATA_RESPONSE:
					return Object.assign({}, state, {
						isFetching: false,
						geojson: action.geojson,
						error: null
					});
				case actions.ZONE_GEODATA_ERROR_RESPONSE:
					return Object.assign({}, state, {
						isFetching: false,
						geojson: null,
						error: action.error
					});
				default:
					return state;
			}
		},

		projects (state = { isFetching: false, geojson: {} }, action) {
			switch (action.type) {
				case actions.PROJECTS_GEODATA_REQUEST:
					return {
						...state,
						isFetching: true,
						geojson: null,
						error: null
					};
				case actions.PROJECTS_GEODATA_RESPONSE:
					return {
						...state,
						isFetching: false,
						geojson: action.geojson,
						error: null
					};
				case actions.PROJECTS_GEODATA_ERROR_RESPONSE:
					return {
						...state,
						isFetching: false,
						geojson: null,
						error: action.error
					};
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

	map: {
		zoom: 14,
		bounds: L.latLngBounds(
			L.latLng(37.733, -122.474),
			L.latLng(37.793, -122.346)
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

	mapLayersPicker: {
		layers: [
			{ key: 'boat_landings', name: 'boat launches / picnic tables / benches', checked: false}
		],
		transportation: [
			{ key: 'walking_biking', name: 'bike network', checked: true },
			{ key: 'green_connector_network', name: 'green connector network', checked: true }
		],
		projects: false
	},

	events: {
		startDate: moment(),
		endDate: moment().add(3, 'months'),
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
	},

	zoneConfigs: [
		{
			id: 'mb',
			title: 'Mission Bay / Mission Rock',
			slug: 'mission_bay_mission_rock',
			bgwZoneId: 'Mission Bay/Mission Rock'
		},
		{
			id: 'p70',
			title: 'Pier 70 / Central Waterfront',
			slug: 'pier_70',
			bgwZoneId: 'Pier 70/Central Waterfront'
		},
		{
			id: 'ib',
			title: 'India Basin',
			slug: 'india_basin',
			bgwZoneId: 'India Basin'
		},
		{
			id: 'sc',
			title: 'Shipyard Candlestick',
			slug: 'shipyard_candlestick',
			bgwZoneId: 'Hunters Point Naval Shipyard/Candlestick'
		}
	],

	projects: {
		data: {
			isFetching: false,
			items: [],
			error: null
		}
	},

	geodata: {
		zones: {
			isFetching: false,
			geojson: {},
			error: null
		},

		projects: {
			isFetching: false,
			geojson: {},
			error: null
		}
	},

	menuOpen: false

};
