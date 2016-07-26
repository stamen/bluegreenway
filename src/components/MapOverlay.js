import * as React from 'react';

import Collapse from 'react-collapse';

export class MapOverlayContainer extends React.Component {
	constructor (props) {
		super(props);
		this.handleToggleFiltersClick = this.handleToggleFiltersClick.bind(this);
	}

	componentWillMount () {
		this.setState({
			filtersOpen: false
		});
	}

	handleToggleFiltersClick () {
		// KLUDGE: the map overlay refactor puts the overlays into the map and therefore under MapPageToggle.
		// Just need to get this done, so that's what this code does. Even if it's nasty.
		document.querySelector('.map-page-toggle').style.display = this.state.filtersOpen ? 'block' : 'none';

		// KLUDGE: the map overlay refactor puts the overlays under the markers; this is primarily noticeable on mobile.
		// while the filter overlays are open, place markers below overlays, with !important to override cartodb.css
		document.querySelector('.leaflet-marker-pane').style.zIndex = this.state.filtersOpen ? null : '4';
		document.querySelector('.leaflet-overlay-pane').style.zIndex = this.state.filtersOpen ? null : '6';

		this.setState({ filtersOpen: !this.state.filtersOpen });
	}

	render () {
		let { filtersOpen } = this.state;

		return (
			<div className={ 'map-overlay-container ' + (filtersOpen ? ' filters-open' : '') }>
				<div className='map-overlay-container-contents'>
					{ this.props.children }
				</div>
				<a className="map-overlay-container-toggle-filters" onClick={ this.handleToggleFiltersClick }>
					{ filtersOpen ? 'select' : 'filters' }
				</a>
			</div>
		);
	}
}

export class MapOverlay extends React.Component {

	constructor (props) {
		super(props);
		this.handleCollapseToggleClick = this.handleCollapseToggleClick.bind(this);
	}

	componentWillMount () {
		this.setState({
			expanded: true
		});
	}

	componentDidMount () {
	}

	componentWillUnmount () {
	}

	componentDidUpdate () {
	}

	handleCollapseToggleClick () {
		this.setState({
			expanded: !this.state.expanded
		});
	}

	renderToggle () {
		if (this.props.collapsible) {
			return (
				<span className={ 'collapse-toggle' + (this.state.expanded ? ' expanded' : ' collapsed')} onClick={ this.handleCollapseToggleClick }></span>
			);
		}
		return null;
	}

	render () {
		return (
			<div className='map-overlay collapse'>
				{ this.renderToggle() }
				{ this.props.children }
			</div>
		);
	}

}
