import React, { PropTypes } from 'react';

const MapPageToggle = ({mode, modeChanged}) => {

	function mapClicked () {
		modeChanged('map');
	}

	function pageClicked () {
		modeChanged('page');
	}

	return (
		<div className="map-page-toggle">
			<div className={"map-page-toggle-btn" + (mode === 'map' ? ' active' : '')} onClick={(() => mapClicked())}>
				map
				<span className="map-page-toggle-btn-fulltext"> view</span>
			</div>
			<div className={"map-page-toggle-btn" + (mode === 'page' ? ' active' : '')} onClick={(() => pageClicked())}>
				page
				<span className="map-page-toggle-btn-fulltext"> view</span>
			</div>
		</div>
	);
};

MapPageToggle.propTypes = {
	mode: PropTypes.string,
	modeChanged: PropTypes.func
};

export default MapPageToggle;
