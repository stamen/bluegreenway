import * as React from 'react';
import PageHeader from '../components/PageHeader';
import MapLayersPicker from '../components/MapLayersPicker';
import MapOverlay from '../components/MapOverlay';

export default class Home extends React.Component {

	constructor (props) {
		super(props);
	}

	componentWillMount () {
		this.props.actions.mapLayersPickerProjectsChange(false);
	}

	componentDidMount () {
		//
	}

	componentWillUpdate (nextProps, nextState) {
		//
	}

	componentDidUpdate () {
		//
	}

	renderMapView () {
		let { mapLayersPicker } = this.props.store.getState();
		return (
			<div className="projects-map-overlay">
				<MapOverlay collapsible={ true }>
					<MapLayersPicker
						title='Recreation'
						layers={ mapLayersPicker.layers }
						onLayerChange={ this.props.actions.mapLayersPickerLayerChange }
					/>
				</MapOverlay>
				<MapOverlay collapsible={ true }>
					<MapLayersPicker
						title='Transportation'
						layers={ mapLayersPicker.transportation }
						onLayerChange={ this.props.actions.mapLayersPickerTransportationChange }
					/>
				</MapOverlay>
			</div>
		);
	}

	renderPageView () {
		return (
			<div className='grid-container'>
				<PageHeader />

				<div className='row'>
					<div className='three columns'></div>
					<div className='six columns'></div>
					<div className='three columns'></div>
				</div>

				<div className='row'>
					<div className='six columns'></div>
					<div className='three columns'></div>
					<div className='three columns'></div>
				</div>

				<div className='row'>
					<div className='three columns'></div>
					<div className='three columns'></div>
					<div className='six columns'></div>
				</div>

				<div className='row'>
					<div className='three columns'></div>
					<div className='six columns'></div>
					<div className='three columns'></div>
				</div>

				<div className='row'>
					<div className='six columns'></div>
					<div className='three columns'></div>
					<div className='three columns'></div>
				</div>

				<div className='row'>
					<div className='three columns'></div>
					<div className='three columns'></div>
				</div>

			</div>
		);
	}

	render () {
		return (
			<div id='home'>
				{ this.props.params.mode === 'page' ? this.renderPageView() : this.renderMapView() }
			</div>
		);
	}

}
