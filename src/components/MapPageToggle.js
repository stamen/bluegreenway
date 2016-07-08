import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const MapPageToggle = ({ mode, currentLocation }) => {

	// e.g. http://some-server.com/#/stories/page/joe-biden-washes-his-transam
	let path = currentLocation.pathname.split('/'),
		view = path.length > 1 ? path[1] : '',
		// mode = path.length > 2 ? path[2] : '',
		other = path.length > 3 ? path.slice(3).join('/') : '';

	let mapUrl = view ? `${ view }/map/${ other }` : `map`,
		pageUrl = view ? `${ view }/page/${ other }` : `page`;

	mapUrl += currentLocation.search;
	pageUrl += currentLocation.search;

	return (
		<div className='map-page-toggle'>
			<Link to={ mapUrl } className={ 'map-page-toggle-btn' + (mode === 'map' ? ' active' : '') }>
				map<span className='map-page-toggle-btn-fulltext'> view</span>
			</Link>
			<Link to={ pageUrl } className={ 'map-page-toggle-btn' + (mode === 'page' ? ' active' : '') }>
				page<span className='map-page-toggle-btn-fulltext'> view</span>
			</Link>
		</div>
	);
};

MapPageToggle.propTypes = {
	mode: PropTypes.string,
	currentLocation: PropTypes.object
};

export default MapPageToggle;
