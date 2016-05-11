import moment from 'moment';
import slug from 'slug';
import { find, sortBy, uniq } from 'lodash';

import { timestampFormat } from './common';

function parseRelatedIds (s) {
	if (!s) return [];
	return s.split(', ').map(idStr => parseInt(idStr));
}

function parseImages (images) {
	// If we only have one image, return that image wrapped in an array
	if (images.src) {
		return [images];
	}
	return images;
}

export function cleanStoryItem (item) {
	item = item.node;
	let cleaned = {
		body: item.Body,
		category: item.Category,
		id: parseInt(item.id),
		images: parseImages(item.Image),
		postDate: moment(item['Post Date'], timestampFormat),
		relatedEvents: parseRelatedIds(item['Related Events']),
		relatedLocations: parseRelatedIds(item['Related Locations']),
		title: slug(item.title, '_')
	};
	return cleaned;
}

export function cleanStoriesData (items) {
	return items.map(item => cleanStoryItem(item));
}

export function getCategoryOptions(stories) {
	let categories = stories.data.items.map(story => story.category);
	categories = uniq(categories.filter(category => category)).sort();
	return categories.map(category => ({ value: category, display: category }));
}
