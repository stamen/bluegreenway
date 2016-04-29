import moment from 'moment';
import { find, sortBy } from 'lodash';

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
	cleaned.location = item['Associated Location'];
	cleaned.url = item.URL;
	return cleaned;
}

function groupEvents(events) {
	events = sortBy(events, 'startDate');
	let groupedEvents = [];
	events.forEach(event => {
		let match = find(groupedEvents, groupedEvent => { 
			if (groupedEvent.title !== event.title) return false;
			else {
				// If this event starts one day after the end of an event with
				// the same name, combine them
				return event.startDate.isSame(moment(groupedEvent.endDate).add(1, 'days'));
			}
		});
		if (match) {
			match.endDate = event.endDate;
		}
		else {
			groupedEvents.push(event);
		}
	});
	return groupedEvents;
}

export function cleanEventsData (items) {
	return groupEvents(items.map(item => cleanEventItem(item)));
}
