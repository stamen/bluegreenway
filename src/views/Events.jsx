import * as React from 'react';
import moment from 'moment';
import 'moment-range';
import { uniq } from 'lodash';

import DateRange from '../components/DateRange';
import EventFilters from '../components/EventFilters';
import MapLayersPicker from '../components/MapLayersPicker';
import MapOverlay from '../components/MapOverlay';
import PageHeader from '../components/PageHeader';
import {
	getAgeRangesOptions,
	getCostsOptions,
	getLocationsOptions,
	getTypesOptions
} from '../models/events';

export default class Events extends React.Component {

	constructor (props) {
		super(props);

		this.onStateChange = this.onStateChange.bind(this);
		this.unsubscribeStateChange = props.store.subscribe(this.onStateChange);
	}

	componentWillMount () {
		var urlMode = this.props.params.mode;
		var appMode = this.props.store.getState().mode;

		if (urlMode) {
			this.props.actions.modeChanged(urlMode);
		} else {
			this.updateModeUrl(appMode);
		}

		this.onStateChange();

		// Fetch data if we need to
		if (!this.props.store.getState().events.data.items.length) {
			this.props.actions.fetchEventsData();
		}
	}

	componentDidMount () {
		//
	}

	componentWillUpdate(nextProps, nextState) {
		var urlMode = nextProps.params.mode;
		var appMode = nextProps.store.getState().mode;

		console.log(urlMode, appMode);

		if (urlMode !== appMode) {
			this.updateModeUrl(appMode);
		}

		if (nextState.events.data.items.length !== this.state.events.data.items.length) {
			this.updateFilterOptions(nextState.events);
		}
	}

	componentDidUpdate () {
		//
	}

	componentWillUnmount () {
		this.unsubscribeStateChange();
	}

	updateModeUrl (mode) {
		this.props.history.push(`/events/${mode}`);
	}

	onStateChange () {
		let storeState = this.props.store.getState();
		this.setState(storeState);
	}

	updateFilterOptions (events) {
		this.props.actions.locationsChange(getLocationsOptions(events));
		this.props.actions.costsChange(getCostsOptions(events));
		this.props.actions.eventTypesChange(getTypesOptions(events));
		this.props.actions.ageRangesChange(getAgeRangesOptions(events));
	}

	handleRangeChange (range) {
		if (range[0]) {
			this.props.actions.eventsMinDateChanged(range[0]);
		}
		if (range[1]) {
			this.props.actions.eventsMaxDateChanged(range[1]);
		}
	}

	render () {
		return (
			<div id="events">
				{ this.state.mode === 'page' ?  this.renderPageView() : this.renderMapView() }
			</div>
		);
	}

	renderPageView () {
		return (
			<div className="grid-container">
				<PageHeader />
				{ this.state.events.data.error ?
					<div className="events-data-load-error">We're having a hard time loading data. Please try again.</div> :
					null }
				{ this.renderRows(this.state.events.data.items) }
			</div>
		);
	}

	renderMapView () {
		return (
			<div className="events-map-overlay">
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
						initialStartDate={this.state.events.startDate}
						initialEndDate={this.state.events.endDate}
						onRangeChange={(range) => this.handleRangeChange(range)} />
				</MapOverlay>
			</div>
		);
	}

	renderRows (events) {
		const currentRange = moment.range(this.state.events.startDate, this.state.events.endDate);
		events = events.filter(event => {
			return moment.range(event.startDate, event.endDate).overlaps(currentRange);
		});

		let firstEvent = events[0],
			secondEvent = events[1],
			remainingEventRows;

		// pack events into rows of four
		if (events.length > 2) {
			remainingEventRows = events.slice(2).reduce((out, event, i) => {
				if (i % 4 === 0) {
					out.push([]);
				}
				out[Math.floor(i / 4)].push(event);
				return out;
			}, []);
		}

		let eventCells = [];
		if (remainingEventRows) {
			eventCells = remainingEventRows.map((eventRow, i) => {
				return (
					<div className='row' key={ 'row=' + i }>
						{ eventRow.map(event => this.renderEvent(event)) }
					</div>
				);
			});
		}

		return (
			<div>
				<div className='row'>
					<div className='three columns' style={{ background: 'white' }}>
						<DateRange
							minDate={moment('1/1/2016', 'M/D/YYYY')}
							maxDate={moment()}
							initialStartDate={this.state.events.startDate}
							initialEndDate={this.state.events.endDate}
							onRangeChange={(range) => this.handleRangeChange(range)} />
					</div>
					<div className='three columns filter-cell' style={{ background: 'white' }}>
						<div className="filter-header">Filter Events</div>
						<EventFilters
							locationOptions={this.state.events.locationOptions}
							eventTypeOptions={this.state.events.eventTypeOptions}
							ageRangeOptions={this.state.events.ageRangeOptions}
							costOptions={this.state.events.costOptions} />
					</div>
					{ firstEvent ? this.renderEvent(firstEvent) : null }
					{ secondEvent ? this.renderEvent(secondEvent) : null }
				</div>
				{ eventCells }
			</div>
		);

	}

	renderEvent (event) {
		return (
			<div className='event-cell three columns' key={ event.startDate.format('YYYYMMDD') + event.id }>
				{ (event.startDate.format('D-MMM') === event.endDate.format('D-MMM')) ?
					(<div className='event-date'>
						<span>{ event.startDate.format('MMM') }</span>
						<span>{ event.startDate.format('D') }</span>
					</div>) :
					(<div className='event-date-range'>
						<div>
							<span className="event-date-range-month">{ event.startDate.format('MMM') }</span>
							<span className="event-date-range-day">{ event.startDate.format('D') }</span>
						</div>
						<div className="event-date-range-separator">&mdash;</div>
						<div>
							<span className="event-date-range-month">{ event.endDate.format('MMM') }</span>
							<span className="event-date-range-day">{ event.endDate.format('D') }</span>
						</div>
					</div>)
				}
				<div className='event-details'>
					<p className='event-title'>{ event.title }</p>
					<p>Time: <span>{ (event.startDate.hour() === 0 && event.startDate.minute() === 0) ? 'all day' :  event.startDate.format('h:mm a') }</span></p>
					<p>Cost: <span>{ event.cost }</span></p>
				</div>
			</div>
		);

	}

}
