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

export const STORIES_START_DATE_CHANGED = 'STORIES_START_DATE_CHANGED';
export const STORIES_END_DATE_CHANGED = 'STORIES_END_DATE_CHANGED';

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
		}

	};

};
