import moment from 'moment';

import { timestampFormat } from './common';

export function cleanProjectItem (item) {
	item = item.node;
	let cleaned = {};
	cleaned.accessible = item.Accessible;
	cleaned.additionalInfo = item['Additional Info'];
	cleaned.address = item['Address'];
	cleaned.BGWZone = item['BGW Zone'];
	cleaned.description = item.Description;
	cleaned.facilities = item.Facilities;
	cleaned.hours = item.Hours;
	cleaned.images = item.Images;
	cleaned.id = +item.id;
	cleaned.links = item.Links;
	cleaned.locationCategory = item['Location Category'];
	cleaned.name = item.Name;
	cleaned.parking = item.Parking;
	cleaned.restrooms = item.Restrooms;
	cleaned.timelinePctComplete = item['Timeline Percent Complete'];
	cleaned.url = item.URL;
	cleaned.postDate = moment(item['Post date'], timestampFormat);
	cleaned.updatedDate = moment(item['Updated date'], timestampFormat);
	return cleaned;
}

export function cleanProjectsData (projects) {
	// log all the project names and ids:
	// console.log("projects:", projects.map(p => (`[${ p.node.id }] ${ p.node.Name }: { zoneId: ${ p.node['BGW Zone'] } }`)));

	return projects.map(project => cleanProjectItem(project));
}
