import * as React from 'react';

import Collapse from 'react-collapse';

export class MapOverlayContainer extends React.Component {
	constructor (props) {
		super(props);
	}

	componentWillMount () {
		this.setState({
			filtersOpen: false
		});
	}

	componentDidMount () {
	}

	componentWillUnmount () {
	}

	componentDidUpdate () {
	}

	render () {
		let { filtersOpen } = this.state;

		return (
			<div className={ 'map-overlay-container ' + (filtersOpen ? ' filters-open' : '') }>
				<div className='map-overlay-container-contents'>
					{ this.props.children }
				</div>
				<a className="map-overlay-container-toggle-filters" onClick={ () => { this.setState({ filtersOpen: !filtersOpen }); } }>
					{ filtersOpen ? 'select' : 'filters' }
				</a>
			</div>
		);
	}
}

export class MapOverlay extends React.Component {

	constructor (props) {
		super(props);
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
				<span className={ 'collapse-toggle' + (this.state.expanded ? ' expanded' : ' collapsed')} onClick={this.handleCollapseToggleClick.bind(this) }></span>
			);
		}
		return null;
	}

	render () {
		return (
			<div className='map-overlay collapse'>
				{ this.renderToggle() }
				<Collapse isOpened={ this.state.expanded }>
					{ this.props.children }
				</Collapse>
			</div>
		);
	}

}
