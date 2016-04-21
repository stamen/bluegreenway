export const SET_STATE = 'SET_STATE';
export const MODE_CHANGED = 'MODE_CHANGED';
export const MAP_MOVED = 'MAP_MOVED';
export const ITEM_SELECTED = 'ITEM_SELECTED';
export const EXAMPLE_INITED = 'EXAMPLE_INITED';
export const EXAMPLE_INCREMENT = 'EXAMPLE_INCREMENT';
export const EXAMPLE_DECREMENT = 'EXAMPLE_DECREMENT';

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

		exampleComponentInitialized () {
			store.dispatch({
				type: EXAMPLE_INITED
			});
		},

		exampleComponentIncrement () {
			store.dispatch({
				type: EXAMPLE_INCREMENT
			});
		},

		exampleComponentDecrement () {
			store.dispatch({
				type: EXAMPLE_DECREMENT
			});
		}

	};

};
