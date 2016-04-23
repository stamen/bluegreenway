export const SET_STATE = 'SET_STATE';
export const MODE_CHANGED = 'MODE_CHANGED';
export const MAP_MOVED = 'MAP_MOVED';
export const ITEM_SELECTED = 'ITEM_SELECTED';
export const EVENTS_START_DATE_CHANGED = 'EVENTS_START_DATE_CHANGED';
export const EVENTS_END_DATE_CHANGED = 'EVENTS_END_DATE_CHANGED';

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
		}

	};

};
