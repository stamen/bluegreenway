import { combineReducers } from 'redux';
import * as actions from './actions';
import leaflet from 'leaflet';

const identity = (state, action) => state;

export default {

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

	exampleComponent: combineReducers({

		inited (state = false, action) {
			switch (action.type) {
				case actions.EXAMPLE_INITED:
					return true;
				default:
					return state;
			}
		},

		count (state = 0, action) {
			switch (action.type) {
				case actions.EXAMPLE_INCREMENT:
					return state + 1;
				case actions.EXAMPLE_DECREMENT:
					return state - 1;
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
		bounds: leaflet.latLngBounds(
			leaflet.latLng(37.733, -122.474),
			leaflet.latLng(37.793, -122.346)),
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

	exampleComponent: {
		inited: false,
		count: 0
	}

};