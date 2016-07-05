import * as React from 'react';
import { withRouter } from 'react-router';
import moment from 'moment';
import 'moment-range';
import { uniq } from 'lodash';

import Event from '../components/Event';
import DateRange from '../components/DateRange';
import EventFilters from '../components/EventFilters';
import MapLayersPicker from '../components/MapLayersPicker';
import {MapOverlayContainer, MapOverlay} from '../components/MapOverlay';
import PageHeader from '../components/PageHeader';
import {
	getAgeRangesOptions,
	getCostsOptions,
	getLocationsOptions,
	getTypesOptions
} from '../models/events';

// global for tracking which default image to use when no photo is supplied
let defaultImageIndex = 6;

class Events extends React.Component {

	constructor (props) {
		super(props);
	}

	componentWillMount () {
		// set map layers
		this.props.actions.mapLayersPickerStoriesChange(false);
		this.props.actions.mapLayersPickerEventsChange(true);
		this.props.actions.mapLayersPickerProjectsChange(true);

		// Fetch data if we need to
		if (!this.props.store.getState().events.data.items.length) {
			this.props.actions.fetchEventsData();
		}
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
				{ this.props.params.mode === 'page' ?  this.renderPageView() : this.renderMapView() }
			</div>
		);
	}

	renderMapView () {
		const storeState = this.props.store.getState();
		return (
			<MapOverlayContainer className="events-map-overlay">
				<MapOverlay collapsible={ true }>
					<MapLayersPicker
						title='Recreation'
						layers={ storeState.mapLayersPicker.layers }
						onLayerChange={ this.props.actions.mapLayersPickerLayerChange }
					/>
				</MapOverlay>
				<MapOverlay collapsible={ true }>
					<MapLayersPicker
						title='Transportation'
						layers={ storeState.mapLayersPicker.transportation }
						onLayerChange={ this.props.actions.mapLayersPickerTransportationChange }
					/>
				</MapOverlay>
				<MapOverlay collapsible={true}>
					<DateRange
						minDate={ moment('1/1/2016', 'M/D/YYYY') }
						maxDate={ moment() }
						initialStartDate={ storeState.events.startDate }
						initialEndDate={ storeState.events.endDate }
						onRangeChange={ range => this.handleRangeChange(range) }
					/>
				</MapOverlay>
			</MapOverlayContainer>
		);
	}

	renderPageView () {
		const storeState = this.props.store.getState();
		return (
			<div className="grid-container">
				<PageHeader />
				{ storeState.events.data.error ?
					<div className="events-data-load-error">"We're having a hard time loading data. Please try again."</div> :
					null }
				{ this.renderRows(storeState.events.data.items) }
			</div>
		);
	}

	renderRows (events) {
		const storeState = this.props.store.getState(),
			currentRange = moment.range(storeState.events.startDate, storeState.events.endDate);

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
					<div className='three columns date-picker-cell' style={{ background: 'white' }}>
						<DateRange
							minDate={ moment() }
							maxDate={ moment().add(3, 'months') }
							initialStartDate={ storeState.events.startDate }
							initialEndDate={ storeState.events.endDate }
							onRangeChange={ range => this.handleRangeChange(range) }
						/>
					</div>
					<div className='three columns filter-cell' style={{ background: 'white' }}>
						<div className="filter-header">Filter Events</div>
						<EventFilters
							locationOptions={ storeState.events.locationOptions }
							eventTypeOptions={ storeState.events.eventTypeOptions }
							ageRangeOptions={ storeState.events.ageRangeOptions }
							costOptions={ storeState.events.costOptions }
						/>
					</div>
					{ firstEvent ? this.renderEvent(firstEvent) : null }
					{ secondEvent ? this.renderEvent(secondEvent) : null }
				</div>
				{ eventCells }
			</div>
		);

	}

	renderEvent (event) {
		event.defaultImageIndex = defaultImageIndex;
		defaultImageIndex -= 1;
		if (defaultImageIndex === 0) defaultImageIndex = 6;

		return (
			<Event {...event } key={ event.startDate.format('YYYYMMDD') + event.id } />
		);
	}

}

export default withRouter(Events);
