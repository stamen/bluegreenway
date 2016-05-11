import moment from 'moment';

import { timestampFormat } from './common';

export function cleanProjectItem (item) {
  item = item.node;
  console.log(item);
  let cleaned = {};
  cleaned.accessible = item.Accessible;
  cleaned.additionalInfo = item['Additional Info'];
  cleaned.address = item['Address'];
  cleaned.BGWZone = item['BGW Zone'];
  cleaned.description = item.Description;
  cleaned.facilities = item.Facilities;
  cleaned.hours = item.Hours;
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
  console.log(cleaned);
  return cleaned;
}

export function cleanProjectsData (projects) {
  // note: may want to remove filter for production...
  return projects
    .filter(project => {
      return project.node['Is BGW'] !== null;
    })
    .map(project => cleanProjectItem(project));
}
