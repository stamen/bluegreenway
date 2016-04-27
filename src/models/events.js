import moment from 'moment';

export function cleanEventItem (item) {
	item = item.node;
	// TODO finish massaging into a format that will work in our view
	return item;
}

export function cleanEventsData (items) {
	return items.map(item => cleanEventItem(item));
}
