import * as React from 'react';
import { withRouter } from 'react-router';
import moment from 'moment';
import 'moment-range';
import { uniq } from 'lodash';

import Event from '../components/Event';
import DateRange from '../components/DateRange';
import EventFilters from '../components/EventFilters';
import MapLayersPicker from '../components/MapLayersPicker';
import { MapOverlayContainer, MapOverlay } from '../components/MapOverlay';
import MapPOILegend from '../components/MapPOILegend';
import PageHeader from '../components/PageHeader';
import {
	getAgeRangesOptions,
	getCostsOptions,
	getLocationsOptions,
	getTypesOptions,
	getTypesMapLayerOptions,
	getFilteredEvents
} from '../models/events';

// global for tracking which default image to use when no photo is supplied
let defaultImageIndex = 6;

class Events extends React.Component {

	constructor (props) {
		super(props);
		this.updateFilters = this.updateFilters.bind(this);
	}

	componentWillMount () {
		const { events } = this.props.store.getState();

		// set map layers
		this.props.actions.mapLayersPickerStoriesChange(false);
		this.props.actions.mapLayersPickerEventsChange(true);
		this.props.actions.mapLayersPickerProjectsChange(true);

		// Fetch data if we need to
		if (!events.data.items.length) {
			this.props.actions.fetchEventsData();
		}

		if (events.data.items.length &&
			!events.eventTypeOptions.length) {
			// events have loaded but filter options have not yet been derived
			this.deriveFilterOptions(events.data.items);
		}
	}

	shouldComponentUpdate () {
		return !this.updatingFilters;
	}

	componentWillUpdate (nextProps) {
		const { events } = nextProps.store.getState();

		if (events.data.items.length &&
			!events.eventTypeOptions.length) {
			// events have loaded but filter options have not yet been derived
			this.deriveFilterOptions(events.data.items);
		}
	}

	deriveFilterOptions (events) {
		this.props.actions.eventLocationsChange(getLocationsOptions(events));
		this.props.actions.costsChange(getCostsOptions(events));
		this.props.actions.eventTypesChange(getTypesOptions(events));
		this.props.actions.ageRangesChange(getAgeRangesOptions(events));
		this.props.actions.mapLayersPickerEventTypesChange(null, null, getTypesMapLayerOptions(events));
	}

	updateFilters () {
		this.updatingFilters = true;

		const {
			startDate,
			endDate
		} = this.refs.dateFilter.state;
		const {
			filterAgeRange,
			filterCost,
			filterEventType,
			filterLocation,
		} = this.refs.eventFilter ? this.refs.eventFilter.state : {};

		let filtersToSet = [];
		if (startDate) {
			filtersToSet.push({
				func: this.props.actions.eventsMinDateChanged,
				args: [startDate]
			});
		}
		if (endDate) {
			filtersToSet.push({
				func: this.props.actions.eventsMaxDateChanged,
				args: [endDate]
			});
		}

		// empty values are allowed here (to clear the filter)
		filtersToSet.push({
			func: this.props.actions.eventsAgeRangeChange,
			args: [filterAgeRange && filterAgeRange.value !== 'Any' ? filterAgeRange.value : '']
		});
		filtersToSet.push({
			func: this.props.actions.eventsCostChange,
			args: [filterCost && filterCost.value !== 'Any' ? filterCost.value : '']
		});
		filtersToSet.push({
			func: this.props.actions.eventsTypeChange,
			args: [filterEventType && filterEventType.value !== 'Any' ? filterEventType.value : '']
		});
		filtersToSet.push({
			func: this.props.actions.eventsLocationChange,
			args: [filterLocation && filterLocation.value !== 'Any' ? filterLocation.value : '']
		});

		if (filtersToSet.length) {
			filtersToSet.forEach((filterObj, i) => {
				if (i === filtersToSet.length - 1) {
					// let the last filter change trigger a render
					this.updatingFilters = false;
				}
				filterObj.func(...filterObj.args);
			});
		} else {
			this.updatingFilters = false;
		}
	}

	render () {
		let eventItems = getFilteredEvents(this.props.store.getState().events);
		return (
			<div id="events">
				{ this.props.params.mode === 'page' ?  this.renderPageView(eventItems) : this.renderMapView(eventItems) }
			</div>
		);
	}

	renderMapView (eventItems) {
		// this is all handled by LeafletMap now
		return '';

		const storeState = this.props.store.getState();
		return (
			<MapOverlayContainer className="events-map-overlay">
				<MapOverlay>
					<MapLayersPicker
						title='Events'
						layers={ storeState.mapLayersPicker.eventTypes }
						onLayerChange={ this.props.actions.mapLayersPickerEventTypesChange }
					/>
				</MapOverlay>
				<MapOverlay>
					<MapLayersPicker
						title='Recreation'
						layers={ storeState.mapLayersPicker.layers }
						onLayerChange={ this.props.actions.mapLayersPickerLayerChange }
					>
						<MapPOILegend/>
					</MapLayersPicker>
				</MapOverlay>
				<MapOverlay>
					<MapLayersPicker
						title='Transportation'
						layers={ storeState.mapLayersPicker.transportation }
						onLayerChange={ this.props.actions.mapLayersPickerTransportationChange }
					/>
				</MapOverlay>
				{/*
				<MapOverlay>
					<DateRange
						ref='dateFilter'
						minDate={ moment('1/1/2015', 'M/D/YYYY') }
						maxDate={ moment().add(1, 'year') }
						initialStartDate={ storeState.events.startDate }
						initialEndDate={ storeState.events.endDate }
						onRangeChange={ this.updateFilters }
					/>
				</MapOverlay>
				*/}
			</MapOverlayContainer>
		);
	}

	renderPageView (eventItems) {
		const storeState = this.props.store.getState();
		return (
			<div className="grid-container">
				<PageHeader />
				{ storeState.events.data.error ?
					<div className="events-data-load-error">"We're having a hard time loading data. Please try again."</div> :
					null }
				{ this.renderRows(eventItems) }
			</div>
		);
	}

	renderRows (eventItems) {
		const storeState = this.props.store.getState(),
			firstRowLength = 2,
			rowLength = 4;

		let firstEvent = eventItems[0],
			secondEvent = eventItems[1],
			remainingEventRows;

		// pack eventItems into rows of four
		if (eventItems.length > firstRowLength) {
			remainingEventRows = eventItems.slice(firstRowLength).reduce((out, event, i) => {
				if (i % rowLength === 0) {
					out.push([]);
				}
				out[Math.floor(i / rowLength)].push(event);
				return out;
			}, []);
		}

		let eventCells = [];
		if (remainingEventRows) {
			eventCells = remainingEventRows.map((eventRow, i) => {
				return (
					<div className='row' key={ 'row=' + i }>
						{ eventRow.map((event, j) => this.renderEvent(event, firstRowLength + i * rowLength + j)) }
					</div>
				);
			});
		}

		return (
			<div>
				<div className='row'>
					<div className='three columns date-picker-cell' style={{ background: 'white' }}>
						<DateRange
							ref='dateFilter'
							minDate={ moment('1/1/2015', 'M/D/YYYY') }
							maxDate={ moment().add(1, 'year') }
							initialStartDate={ storeState.events.startDate }
							initialEndDate={ storeState.events.endDate }
							onRangeChange={ this.updateFilters }
						/>
					</div>
					<div className='three columns filter-cell' style={{ background: 'white' }}>
						<div className="filter-header">Filter Events</div>
						<EventFilters
							ref='eventFilter'
							locationOptions={ storeState.events.locationOptions }
							eventTypeOptions={ storeState.events.eventTypeOptions }
							ageRangeOptions={ storeState.events.ageRangeOptions }
							costOptions={ storeState.events.costOptions }
							onFilterChange={ this.updateFilters }
						/>
					</div>
					{ firstEvent ? this.renderEvent(firstEvent, 0) : null }
					{ secondEvent ? this.renderEvent(secondEvent, 1) : null }
				</div>
				{ eventCells }
			</div>
		);

	}

	renderEvent (event, index) {
		return (
			<Event
				{ ...event }
				defaultImageIndex={ (index % 6) + 1 }
				key={ event.startDate.format('YYYYMMDD') + event.id }
			/>
		);
	}

}

export default withRouter(Events);
