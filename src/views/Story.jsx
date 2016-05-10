import * as React from 'react';
import moment from 'moment';

import DateRange from '../components/DateRange';
import MapLayersPicker from '../components/MapLayersPicker';
import MapOverlay from '../components/MapOverlay';
import PageHeader from '../components/PageHeader';

export default class Story extends React.Component {

	constructor (props) {
		super(props);

		this.onStateChange = this.onStateChange.bind(this);
		this.unsubscribeStateChange = props.store.subscribe(this.onStateChange);
	}

	onStateChange () {
		let storeState = this.props.store.getState();
		this.setState(storeState);
	}

	componentWillUpdate (nextProps, nextState) {
		var urlMode = this.state.mode;
		var appMode = nextProps.store.getState().mode;
		var storyTitle = nextProps.store.getState().stories.selectedStory.title;
		// console.log(this.state, nextProps.store.getState(), nextState);
		if (urlMode !== appMode) {
			this.updateModeUrl(appMode, storyTitle);
		}
	}

	updateModeUrl (mode, title) {
		if (mode && title) {
			this.props.history.push(`/stories/${mode}/${title}`);
		} else if (mode && !title) {
			this.props.history.push(`/stories/${mode}`);
		} else {
			this.props.history.push('*');
		}
	}

	componentWillMount (){
		// var urlMode = this.props.params.mode;
		// var title = this.props.params.title;
		// if (urlMode) {
		//  this.props.actions.modeChanged(urlMode);
		// }
		this.onStateChange();
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

	handleRangeChange (range) {
		if (range[0]) {
			this.props.actions.storiesMinDateChanged(range[0]);
		}
		if (range[1]) {
			this.props.actions.storiesMaxDateChanged(range[1]);
		}
	}

	renderPageView () {
		return (
			<div className='grid-container'>
				<PageHeader />
				<div>Story</div>
			</div>
		);
	}

	renderMapView () {
		return (
			<div className='stories-map-overlay two columns'>
				<MapOverlay collapsible={true}>
					<MapLayersPicker
						layers={this.state.mapLayersPicker.layers}
						onLayerChange={this.props.actions.mapLayersPickerLayerChange}
						transportation={this.state.mapLayersPicker.transportation}
						onTransportationChange={this.props.actions.mapLayersPickerTransportationChange}
						/>
				</MapOverlay>
				<MapOverlay collapsible={true}>
					<DateRange
						minDate={moment('1/1/2016', 'M/D/YYYY')}
						maxDate={moment()}
						initialStartDate={this.state.stories.startDate}
						initialEndDate={this.state.stories.endDate}
						onRangeChange={(range) => this.handleRangeChange(range)} />
				</MapOverlay>
			</div>
		);
	}

	render () {
		return (
			<div id="story">
				{ this.state.mode === 'page' ? this.renderPageView() : this.renderMapView() }
			</div>
		);
	}
}
