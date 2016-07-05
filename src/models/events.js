import moment from 'moment';
import { find, sortBy, uniq } from 'lodash';

import { timestampFormat } from './common';

export function cleanEventItem (item) {
	item = item.node;
	let cleaned = {};
	cleaned.startDate = moment(item['Start Date'], timestampFormat);
	cleaned.endDate = moment(item['End Date'], timestampFormat);
	cleaned.ageRange = item['Age Range'];
	cleaned.category = item.Category;
	cleaned.cost = item.Cost;
	cleaned.id = item.id;
	cleaned.title = item.Title;
	cleaned.location = item['Associated Location'];
	cleaned.type = item.Category;
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
	// console.log("events:", items.map(i => i.node['Associated Location']));
	return groupEvents(items.map(item => cleanEventItem(item)));
}

export function getAgeRangesOptions(events) {
	let ageRanges = events.map(event => event.ageRange);
	ageRanges = uniq(ageRanges.filter(ageRange => ageRange)).sort();
	ageRanges.unshift('Any');
	return ageRanges;
}

export function getLocationsOptions(events) {
	// This will have to do until locations are loaded too
	let locations = events.map(event => event.location);
	locations = uniq(locations.filter(location => location)).sort();
	locations = locations.map(location => ({ value: location, display: location }));
	locations.unshift('Any');
	return locations;
}

export function getCostsOptions(events) {
	let costs = events.map(event => event.cost);
	costs = uniq(costs.filter(cost => cost)).sort();
	costs.unshift('Any');
	return costs;
}

export function getTypesOptions(events) {
	let types = events.map(event => event.type);
	types = uniq(types.filter(type => type)).sort();
	types.unshift('Any');
	return types;
}
