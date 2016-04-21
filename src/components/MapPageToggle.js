import * as React from 'react';

export default class MapPageToggle extends React.Component {

	constructor (props) {
		super(props);
	}

	componentWillMount () {
	}

	componentDidMount () {
	}

	componentWillUnmount () {
	}

	componentDidUpdate () {
	}

	mapClicked () {
		this.props.modeChanged('map');
	}

	pageClicked () {
		this.props.modeChanged('page');
	}

	render () {
		var mode = this.props.mode;
		return (
			<div className="map-page-toggle">
				<div className={"map-page-toggle-btn" + (mode === 'map' ? ' active' : '')} onClick={(() => this.mapClicked())}>map view</div>
				<div className={"map-page-toggle-btn" + (mode === 'page' ? ' active' : '')} onClick={(() => this.pageClicked())}>page view</div>
			</div>
		);
	}
}
