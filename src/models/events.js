import moment from 'moment';

const timestampFormat = 'MM/DD/YYYY - HH:mma';

export function cleanEventItem (item) {
	item = item.node;
	let cleaned = {};
	cleaned.startDate = moment(item['Start Date'], timestampFormat);
	cleaned.endDate = moment(item['End Date'], timestampFormat);
	cleaned.category = item.Category;
	cleaned.cost = item.Cost;
	cleaned.id = item.id;
	cleaned.title = item.Title;
	return cleaned;
}

export function cleanEventsData (items) {
	return items.map(item => cleanEventItem(item));
}
