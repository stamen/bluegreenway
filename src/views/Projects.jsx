import * as React from 'react';

import MapLayersPicker from '../components/MapLayersPicker';
import MapOverlay from '../components/MapOverlay';
import PageHeader from '../components/PageHeader';

export default class Projects extends React.Component {

	constructor (props) {
		super(props);

		this.onStateChange = this.onStateChange.bind(this);
		this.unsubscribeStateChange = props.store.subscribe(this.onStateChange);
	}

	onStateChange () {
		let storeState = this.props.store.getState();
		this.setState(storeState);
	}

	componentWillUpdate(nextProps, nextState) {
		var urlMode = nextProps.params.mode;
		var appMode = nextProps.store.getState().mode;
		if (urlMode !== appMode) {
			this.updateModeUrl(appMode);
		}
	}

	updateModeUrl (mode) {
		this.props.history.push(`/projects/${mode}`);
	}

	componentWillMount () {
		var urlMode = this.props.params.mode;
		if (urlMode) {
			this.props.actions.modeChanged(urlMode);
		}
		this.onStateChange();

		if (!this.props.store.getState().projects.data.items.length) {
			this.props.actions.fetchProjectsData();
		}
	}

	componentDidMount () {

		//

	}

	componentWillUnmount () {
		this.unsubscribeStateChange();
	}

	componentDidUpdate () {

		//

	}

	render () {
		return (
			<div id="projects">
				{ this.state.mode === 'page' ? this.renderPageView() : this.renderMapView() }
			</div>
		);
	}

	renderPageView () {
		return (
			<div className='grid-container'>
				<PageHeader />
				<div className='row'>
					<div className='three columns zone-cell'>
						<h4 className='title'>Mission Bay/ Mission Rock</h4>
						<div className='learn-more'><p>Learn More</p></div>
					</div>
					<div className='three columns zone-cell'>
						<h4 className='title'>Pier 70/Central Waterfront</h4>
						<div className='learn-more'><p>Learn More</p></div>
					</div>
					<div className='three columns zone-cell'>
						<h4 className='title'>India Basin</h4>
						<div className='learn-more'><p>Learn More</p></div>
					</div>
					<div className='three columns zone-cell'>
						<h4 className='title'>Shipyard Candlestick</h4>
						<div className='learn-more'><p>Learn More</p></div>
					</div>
				</div>
			</div>
		);
	}

	renderMapView () {
		return (
			<div className="projects-map-overlay two columns">
				<MapOverlay collapsible={true}>
					<MapLayersPicker
						layers={this.state.mapLayersPicker.layers}
						onLayerChange={this.props.actions.mapLayersPickerLayerChange}
						transportation={this.state.mapLayersPicker.transportation}
						onTransportationChange={this.props.actions.mapLayersPickerTransportationChange}
						/>
				</MapOverlay>
			</div>
		);
	}

}
