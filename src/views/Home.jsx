import * as React from 'react';
import PageHeader from '../components/PageHeader';
import MapLayersPicker from '../components/MapLayersPicker';
import MapOverlay from '../components/MapOverlay';

export default class Home extends React.Component {

	constructor (props) {
		super(props);
		this.onStateChange = this.onStateChange.bind(this);
		this.unsubscribeStateChange = props.store.subscribe(this.onStateChange);
	}

	componentWillMount () {
		this.setState({});
		let urlMode = this.props.params.mode;
		let appMode = this.props.store.getState().mode;
		if (urlMode) {
			this.props.actions.modeChanged(urlMode);
		}
		this.onStateChange();
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

	componentWillUnmount () {
		this.unsubscribeStateChange();
	}

	onStateChange () {
		let storeState = this.props.store.getState();
		this.setState(storeState);
	}

	renderMapView () {
		return (
			<div className="projects-map-overlay">
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
				{ this.state.mode === 'page' ? this.renderPageView() : this.renderMapView() }
			</div>
		);
	}

}
